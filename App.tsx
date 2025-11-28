
import React, { useState, useEffect } from 'react';
import { 
  Home, ShoppingCart, User as UserIcon, ScanLine, AlertTriangle, Users
} from 'lucide-react';

import { Database } from './services/database';
import { MOCK_RECIPES, DEFAULT_PROFILE_TEMPLATE } from './constants';
import { UserData, UserProfile, ShoppingItem, MealPlan, Recipe, User, Comment } from './types';

// Components
import { AuthScreen } from './components/AuthScreen';
import { RecipeModal } from './components/RecipeModal';

// Views
import { AddRecipeView } from './views/AddRecipeView';
import { CommunityView } from './views/CommunityView';
import { ScanReceiptView } from './views/ScanReceiptView';
import { HomeView } from './views/HomeView';
import { ShoppingListView } from './views/ShoppingListView';
import { ProfileView } from './views/ProfileView';

// --- MAIN APP COMPONENT ---

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE_TEMPLATE);
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [mealPlan, setMealPlan] = useState<MealPlan>({});
  const [customRecipes, setCustomRecipes] = useState<Recipe[]>([]);
  const [publicRecipes, setPublicRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isAddingRecipe, setIsAddingRecipe] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [permissionError, setPermissionError] = useState(false);
  const [publicPermissionError, setPublicPermissionError] = useState(false);

  const isAdmin = user?.email === 'admin@admin.fr';

  // Authentication & REAL-TIME Data Listener
  useEffect(() => {
    let unsubscribeData: (() => void) | undefined;
    let unsubscribePublic: (() => void) | undefined;

    const unsubscribeAuth = Database.onAuthStateChange(async (authUser) => {
      setUser(authUser);
      if (authUser) {
        setIsLoadingData(true);
        // Subscribe to real-time updates from Firebase
        unsubscribeData = Database.subscribeToUserData(authUser.uid, (data) => {
             if (data) {
                setProfile({
                    ...DEFAULT_PROFILE_TEMPLATE,
                    ...data.profile,
                    favorites: data.profile?.favorites || [],
                    inventory: data.profile?.inventory || [],
                    equipment: data.profile?.equipment || DEFAULT_PROFILE_TEMPLATE.equipment
                });
                setShoppingList(data.shoppingList || []);
                setMealPlan(data.mealPlan || {});
                setCustomRecipes(data.customRecipes || []);
                setIsLoadingData(false);
             } else {
                 setIsLoadingData(false);
             }
        }, (error) => {
            if (error.code === 'permission-denied') {
                setPermissionError(true);
                setIsLoadingData(false);
            }
        });
        
        // Subscribe to public recipes
        unsubscribePublic = Database.subscribeToPublicRecipes(
            (recipes) => {
                setPublicRecipes(recipes);
                setPublicPermissionError(false);
            }, 
            (error) => {
                console.warn("Public recipes error:", error);
                if (error.code === 'permission-denied') {
                    setPublicPermissionError(true);
                }
            }
        );

      } else {
          setProfile(DEFAULT_PROFILE_TEMPLATE);
          setShoppingList([]);
          if (unsubscribeData) unsubscribeData();
          if (unsubscribePublic) unsubscribePublic();
          setIsLoadingData(false);
      }
    });

    return () => {
        unsubscribeAuth();
        if (unsubscribeData) unsubscribeData();
        if (unsubscribePublic) unsubscribePublic();
    };
  }, []);

  const handleUpdateProfile = async (newProfile: UserProfile) => {
    setProfile(newProfile);
    if(user) await Database.updateUserData(user.uid, { profile: newProfile });
  };

  const handleScanSuccess = async (total: number, newItems: string[]) => {
      const updatedProfile = {
          ...profile,
          spent: profile.spent + total,
          inventory: [...(profile.inventory || []), ...newItems]
      };
      if(user) await Database.updateUserData(user.uid, { profile: updatedProfile });
      alert(`Ticket validé ! ${total}€ déduits et ${newItems.length} articles ajoutés au frigo.`);
      setActiveTab('profile');
  };

  const handleToggleFavorite = async (recipeId: number) => {
      if (!user) return;
      const currentFavorites = profile.favorites || [];
      const isAdding = !currentFavorites.includes(recipeId);
      await Database.toggleFavorite(user.uid, recipeId, isAdding);
  };

  const handleTogglePublicLike = async (recipeId: number, isLiking: boolean) => {
      if(!user) return;
      await Database.togglePublicLike(recipeId, user.uid, isLiking);
  };

  const handleAddComment = async (text: string) => {
      if(!user || !selectedRecipe) return;
      
      const newComment: Comment = {
          id: Date.now(),
          authorName: user.displayName || 'Anonyme',
          text: text,
          createdAt: Date.now()
      };
      
      await Database.addComment(selectedRecipe.id, newComment);
      
      // Optimistic update for the modal
      setSelectedRecipe(prev => prev ? ({
          ...prev,
          comments: [...(prev.comments || []), newComment]
      }) : null);
  };

  const toggleShoppingItem = async (id: number) => {
    const newList = shoppingList.map(i => i.id === id ? { ...i, checked: !i.checked } : i);
    if(user) await Database.updateUserData(user.uid, { shoppingList: newList });
  };

  const deleteShoppingItem = async (id: number) => {
     const newList = shoppingList.filter(i => i.id !== id);
     if(user) await Database.updateUserData(user.uid, { shoppingList: newList });
  };

  const addShoppingItem = async (name: string) => {
      const newItem: ShoppingItem = { id: Date.now(), name, checked: false, category: 'Autre' };
      if(user) await Database.addToShoppingList(user.uid, [newItem]);
  };

  const addRecipeIngredients = async (recipe: Recipe) => {
      const newItems = recipe.ingredients.map((ing, idx) => ({
          id: Date.now() + idx,
          name: `${ing.name} (${ing.qty}${ing.unit ? ing.unit : ''})`,
          checked: false,
          category: 'Recette'
      }));
      if(user) await Database.addToShoppingList(user.uid, newItems);
      setSelectedRecipe(null);
      setActiveTab('list');
  };

  const handleSaveOrUpdateRecipe = async (recipe: Recipe) => {
      if(!user) return;
      
      const isUpdate = !!editingRecipe;

      // Handle PUBLIC Update/Create
      if(recipe.isPublic) {
          const publicRecipe = {
              ...recipe,
              isCustom: false,
              author: {
                  uid: user.uid,
                  name: user.displayName || 'Chef'
              }
          };

          if (isUpdate) {
              await Database.updatePublicRecipe(publicRecipe);
              // Also update local copy if exists
              await Database.updateCustomRecipe(user.uid, { ...publicRecipe, isCustom: true });
          } else {
              await Database.publishPublicRecipe(publicRecipe);
              // Save local copy with isCustom: true so user can edit/delete it later from "My Recipes"
              await Database.addCustomRecipe(user.uid, { ...publicRecipe, isCustom: true });
          }

      } else {
          // Handle PRIVATE Update/Create
          const privateRecipe = { ...recipe, isCustom: true };
          if (isUpdate) {
              await Database.updateCustomRecipe(user.uid, privateRecipe);
              // If it WAS public before, we should delete it from public? 
              // Complexity: Changing privacy. For now, we assume simplicity.
          } else {
              await Database.addCustomRecipe(user.uid, privateRecipe);
          }
      }

      setIsAddingRecipe(false);
      setEditingRecipe(null);
      setActiveTab('home');
      alert(isUpdate ? "Recette modifiée avec succès !" : "Recette créée avec succès !");
  };

  const handleDeleteRecipe = async (recipe: Recipe) => {
    if(!user) return;
    
    try {
        let deletedLocal = false;
        let deletedPublic = false;

        // 1. Try to delete from local custom recipes
        const isLocal = customRecipes.some(r => String(r.id) === String(recipe.id));
        if (isLocal || recipe.isCustom) {
            await Database.deleteCustomRecipe(user.uid, recipe.id);
            deletedLocal = true;
        }

        // 2. Try to delete from public feed
        // Allow deletion if user is author OR if user is ADMIN
        if (isAdmin || (recipe.author && recipe.author.uid === user.uid)) {
            await Database.deletePublicRecipe(recipe.id);
            deletedPublic = true;
        }

        if (!deletedLocal && !deletedPublic) {
            // Check if it's a mock recipe which cannot be deleted
            const isMock = MOCK_RECIPES.some(r => String(r.id) === String(recipe.id));
            if (isMock) {
                 throw new Error("Impossible de supprimer une recette par défaut de l'application.");
            }
            throw new Error("Impossible de supprimer : recette introuvable ou droits insuffisants.");
        }

        // Close modal ONLY on success
        setSelectedRecipe(null);

    } catch (error: any) {
        console.error("Delete error:", error);
        
        let msg = "Oups ! La suppression a échoué.";
        if (error.code === 'permission-denied') {
            msg = "⛔ Accès refusé : Vous ne pouvez supprimer que VOS propres recettes. (Êtes-vous sûr d'être l'auteur ?)";
        } else if (error.code === 'unavailable') {
            msg = "📡 Erreur de connexion : Vérifiez votre internet.";
        } else if (error.message) {
            msg = `Erreur : ${error.message}`;
        }

        alert(msg);
        // Rethrow so the modal knows to stop loading state
        throw error;
    }
  };

  const handleEditRecipe = (recipe: Recipe) => {
      setEditingRecipe(recipe);
      setSelectedRecipe(null);
      setIsAddingRecipe(true);
      setActiveTab('home'); // Ensure we are on a view that renders AddRecipeView
  };

  const handleLogout = () => {
      Database.logout();
  };

  if (permissionError) {
      return (
          <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
              <div className="bg-red-100 p-4 rounded-full mb-4">
                  <AlertTriangle className="text-red-600" size={40} />
              </div>
              <h1 className="text-xl font-bold text-slate-900 mb-2">Accès refusé</h1>
              <p className="text-slate-600 mb-6">
                  L'application ne peut pas accéder à tes données.
                  <br/>
                  Vérifie les "Règles" dans ta console Firebase Firestore.
              </p>
          </div>
      );
  }

  if (isLoadingData) {
      return (
          <div className="h-screen w-full flex items-center justify-center bg-slate-50">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
      )
  }

  if (!user) {
    return <AuthScreen onLoginSuccess={() => {}} />;
  }

  // Combine Mock and Custom Recipes for Home View
  const allRecipes = [...MOCK_RECIPES, ...customRecipes];

  return (
    <div className="w-full max-w-md mx-auto h-[100dvh] bg-slate-50 shadow-2xl relative overflow-hidden flex flex-col">
      
      <div className="flex-1 overflow-y-auto bg-slate-50 scroll-smooth pb-24">
          {activeTab === 'home' && !isAddingRecipe && (
              <HomeView 
                  profile={profile} 
                  recipes={allRecipes} 
                  onSelectRecipe={setSelectedRecipe} 
                  onToggleFavorite={handleToggleFavorite}
                  onAddRecipeClick={() => { setEditingRecipe(null); setIsAddingRecipe(true); }}
              />
          )}
          {activeTab === 'home' && isAddingRecipe && (
              <AddRecipeView 
                onSave={handleSaveOrUpdateRecipe} 
                onCancel={() => { setIsAddingRecipe(false); setEditingRecipe(null); }} 
                currentUser={user}
                initialRecipe={editingRecipe}
              />
          )}

          {activeTab === 'community' && (
              <>
                {publicPermissionError ? (
                    <div className="p-8 text-center mt-10">
                        <div className="bg-red-50 inline-block p-4 rounded-full mb-4">
                            <AlertTriangle className="text-red-500" size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">Erreur de connexion</h3>
                        <p className="text-slate-500 text-sm mb-4">Impossible de charger la communauté. Les permissions Firestore sont manquantes.</p>
                        <div className="bg-slate-100 p-3 rounded-lg text-xs text-left text-slate-600 font-mono overflow-x-auto">
                            allow read, write: if request.auth != null;
                        </div>
                        <p className="text-xs text-slate-400 mt-2">Ajoute cette règle dans ta console Firebase.</p>
                    </div>
                ) : (
                    <CommunityView 
                        recipes={publicRecipes} 
                        onSelectRecipe={setSelectedRecipe}
                        currentUserId={user.uid}
                        onToggleLike={handleTogglePublicLike}
                    />
                )}
              </>
          )}

          {activeTab === 'scan' && <ScanReceiptView onScanSuccess={handleScanSuccess} />}
          {activeTab === 'list' && (
              <ShoppingListView 
                  shoppingList={shoppingList} 
                  onToggle={toggleShoppingItem} 
                  onDelete={deleteShoppingItem} 
                  onAdd={addShoppingItem}
                  apiKey={process.env.GOOGLE_MAPS_API_KEY} 
              />
          )}
          {activeTab === 'profile' && (
              <ProfileView 
                  profile={profile} 
                  onLogout={handleLogout}
                  onUpdate={handleUpdateProfile} 
              />
          )}
      </div>

      {/* Detail Modal */}
      <RecipeModal 
        recipe={selectedRecipe as Recipe} 
        onClose={() => setSelectedRecipe(null)} 
        onAddIngredients={addRecipeIngredients}
        isFavorite={selectedRecipe ? (profile.favorites || []).includes(selectedRecipe.id) : false}
        onToggleFavorite={() => selectedRecipe && handleToggleFavorite(selectedRecipe.id)}
        onAddComment={handleAddComment}
        onDelete={handleDeleteRecipe}
        onEdit={handleEditRecipe}
        currentUserUid={user.uid}
        isAdmin={isAdmin}
      />

      {/* Bottom Navigation */}
      <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-2 py-3 pb-6 flex justify-around items-center z-40 text-[10px] font-bold shadow-[0_-5px_20px_rgba(0,0,0,0.03)] backdrop-blur-md bg-white/95">
        <button onClick={() => { setActiveTab('home'); setIsAddingRecipe(false); }} className={`flex flex-col items-center gap-1 min-w-[50px] transition-colors ${activeTab === 'home' ? 'text-emerald-600' : 'text-slate-300 hover:text-slate-500'}`}>
            <Home size={22} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
            <span>Accueil</span>
        </button>

         <button onClick={() => { setActiveTab('community'); setIsAddingRecipe(false); }} className={`flex flex-col items-center gap-1 min-w-[50px] transition-colors ${activeTab === 'community' ? 'text-indigo-600' : 'text-slate-300 hover:text-slate-500'}`}>
             <Users size={22} strokeWidth={activeTab === 'community' ? 2.5 : 2} />
            <span className={`${activeTab === 'community' ? 'text-indigo-600' : ''}`}>Communauté</span>
        </button>
        
        <button onClick={() => setActiveTab('scan')} className="relative -top-5">
             <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-emerald-200 transition-transform active:scale-95 ${activeTab === 'scan' ? 'bg-slate-800 text-white' : 'bg-emerald-600 text-white'}`}>
                <ScanLine size={24} />
             </div>
        </button>

        <button onClick={() => setActiveTab('list')} className={`flex flex-col items-center gap-1 min-w-[50px] transition-colors ${activeTab === 'list' ? 'text-emerald-600' : 'text-slate-300 hover:text-slate-500'}`}>
             <div className="relative">
                <ShoppingCart size={22} strokeWidth={activeTab === 'list' ? 2.5 : 2} />
                {shoppingList.filter(i => !i.checked).length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-[14px] bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center px-0.5 border-2 border-white">
                        {shoppingList.filter(i => !i.checked).length}
                    </span>
                )}
            </div>
            <span>Courses</span>
        </button>

        <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center gap-1 min-w-[50px] transition-colors ${activeTab === 'profile' ? 'text-emerald-600' : 'text-slate-300 hover:text-slate-500'}`}>
            <UserIcon size={22} strokeWidth={activeTab === 'profile' ? 2.5 : 2} />
            <span>Profil</span>
        </button>
      </nav>
    </div>
  );
}

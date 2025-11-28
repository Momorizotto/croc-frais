

import { auth, db, googleProvider } from "../firebase-config";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  updateProfile
} from "firebase/auth";
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  arrayUnion, 
  arrayRemove 
} from "firebase/firestore";
import { UserData, UserProfile, ShoppingItem, Recipe, User, Comment } from '../types';
import { DEFAULT_PROFILE_TEMPLATE, MOCK_SHOPPING_LIST } from '../constants';

export const Database = {
  // --- AUTHENTICATION ---

  onAuthStateChange: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        callback({
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || ''
        });
      } else {
        callback(null);
      }
    });
  },

  login: async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Ensure doc exists on login handled in component or lazy loaded
      return { success: true };
    } catch (error: any) {
      let message = "Erreur de connexion.";
      if (error.code === 'auth/invalid-credential') message = "Email ou mot de passe incorrect.";
      if (error.code === 'auth/user-not-found') message = "Aucun compte trouvé avec cet email.";
      if (error.code === 'auth/wrong-password') message = "Mot de passe incorrect.";
      return { success: false, message };
    }
  },

  loginWithGoogle: async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userRef = doc(db, "users", result.user.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
         const newUser: UserData = {
          uid: result.user.uid,
          profile: { 
              ...DEFAULT_PROFILE_TEMPLATE, 
              email: result.user.email || '', 
              name: result.user.displayName || 'Étudiant',
              favorites: [],
              inventory: [],
          },
          shoppingList: [...MOCK_SHOPPING_LIST],
          mealPlan: {},
          customRecipes: [],
          createdAt: Date.now()
        };
        await setDoc(userRef, newUser);
      }
      return { success: true };
    } catch (error: any) {
      console.error("Google Auth Error:", error);
      return { success: false, message: error.message };
    }
  },

  register: async (email: string, password: string, name: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      if (user) {
        await updateProfile(user, { displayName: name });

        const newUser: UserData = {
            uid: user.uid,
            profile: { 
                ...DEFAULT_PROFILE_TEMPLATE, 
                email, 
                name,
                favorites: [],
                inventory: [],
            },
            shoppingList: [...MOCK_SHOPPING_LIST],
            mealPlan: {},
            customRecipes: [],
            createdAt: Date.now()
        };

        await setDoc(doc(db, "users", user.uid), newUser);
        return { success: true, user: { uid: user.uid, email, displayName: name } };
      }
      return { success: false, message: "Erreur inconnue" };
    } catch (error: any) {
      let message = "Erreur d'inscription.";
      if (error.code === 'auth/email-already-in-use') message = "Cet email est déjà utilisé.";
      if (error.code === 'auth/weak-password') message = "Le mot de passe est trop faible (6 caractères min).";
      return { success: false, message };
    }
  },

  logout: async () => {
    await signOut(auth);
  },

  // --- REAL-TIME DATA MANAGEMENT ---

  subscribeToUserData: (
    uid: string, 
    callback: (data: UserData | null) => void,
    onError?: (error: any) => void
  ) => {
    return onSnapshot(doc(db, "users", uid), (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data() as UserData);
      } else {
        callback(null);
      }
    }, (error) => {
      console.error("Firestore Listen Error:", error);
      if (onError) onError(error);
    });
  },

  updateUserData: async (uid: string, data: Partial<UserData>) => {
    const userRef = doc(db, "users", uid);
    // Use setDoc with merge to prevent crashes if doc is missing
    const updatePayload: any = {};
    if (data.profile) updatePayload.profile = data.profile;
    if (data.shoppingList) updatePayload.shoppingList = data.shoppingList;
    if (data.mealPlan) updatePayload.mealPlan = data.mealPlan;
    if (data.customRecipes) updatePayload.customRecipes = data.customRecipes;

    await setDoc(userRef, updatePayload, { merge: true });
  },
  
  toggleFavorite: async (uid: string, recipeId: number, isAdding: boolean) => {
      const userRef = doc(db, "users", uid);
      await setDoc(userRef, {
        profile: {
             favorites: isAdding ? arrayUnion(recipeId) : arrayRemove(recipeId)
        }
      }, { merge: true });
  },
  
  addToShoppingList: async (uid: string, items: ShoppingItem[]) => {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
        shoppingList: arrayUnion(...items)
    });
  },

  addCustomRecipe: async (uid: string, recipe: Recipe) => {
      const userRef = doc(db, "users", uid);
      // Ensure the recipe object is clean JSON
      const cleanRecipe = JSON.parse(JSON.stringify(recipe));
      await updateDoc(userRef, {
          customRecipes: arrayUnion(cleanRecipe)
      });
  },

  updateCustomRecipe: async (uid: string, recipe: Recipe) => {
    const userRef = doc(db, "users", uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
        const data = docSnap.data() as UserData;
        const recipes = data.customRecipes || [];
        const index = recipes.findIndex(r => r.id === recipe.id);
        if (index !== -1) {
            recipes[index] = recipe;
            await updateDoc(userRef, { customRecipes: recipes });
        }
    }
  },

  deleteCustomRecipe: async (uid: string, recipeId: number) => {
      const userRef = doc(db, "users", uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
          const data = docSnap.data() as UserData;
          // Robust filtering handling both string and number IDs
          const updatedRecipes = (data.customRecipes || []).filter(r => String(r.id) !== String(recipeId));
          await updateDoc(userRef, { customRecipes: updatedRecipes });
      }
  },

  // --- COMMUNITY FEATURES ---

  publishPublicRecipe: async (recipe: Recipe) => {
      const cleanRecipe = JSON.parse(JSON.stringify(recipe));
      await setDoc(doc(db, "public_recipes", recipe.id.toString()), cleanRecipe);
  },

  updatePublicRecipe: async (recipe: Recipe) => {
     const recipeRef = doc(db, "public_recipes", recipe.id.toString());
     await setDoc(recipeRef, recipe, { merge: true });
  },

  deletePublicRecipe: async (recipeId: number) => {
      await deleteDoc(doc(db, "public_recipes", recipeId.toString()));
  },

  subscribeToPublicRecipes: (callback: (recipes: Recipe[]) => void, onError?: (error: any) => void) => {
      const q = query(collection(db, "public_recipes"), orderBy("createdAt", "desc"));
      return onSnapshot(q, (snapshot) => {
          const recipes: Recipe[] = [];
          snapshot.forEach((doc) => {
              recipes.push(doc.data() as Recipe);
          });
          callback(recipes);
      }, (error) => {
          if (onError) onError(error);
          else console.error("Snapshot error:", error);
      });
  },

  togglePublicLike: async (recipeId: number, uid: string, isLiking: boolean) => {
      const recipeRef = doc(db, "public_recipes", recipeId.toString());
      await updateDoc(recipeRef, {
          likes: isLiking 
            ? arrayUnion(uid) 
            : arrayRemove(uid)
      });
  },

  addComment: async (recipeId: number, comment: Comment) => {
      const recipeRef = doc(db, "public_recipes", recipeId.toString());
      const cleanComment = JSON.parse(JSON.stringify(comment));
      await updateDoc(recipeRef, {
          comments: arrayUnion(cleanComment)
      });
  }
};

import React, { useState } from 'react';
import { TrendingUp, Heart, Leaf, Clock, Wallet, PenTool, Plus } from 'lucide-react';
import { UserProfile, Recipe } from '../types';
import { RecipeCard } from '../components/RecipeCard';

interface HomeViewProps {
    profile: UserProfile;
    recipes: Recipe[];
    onSelectRecipe: (r: Recipe) => void;
    onToggleFavorite: (id: number) => void;
    onAddRecipeClick: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ 
    profile, 
    recipes, 
    onSelectRecipe, 
    onToggleFavorite,
    onAddRecipeClick
}) => {
    const [filter, setFilter] = useState<'All' | 'Favorites' | 'Végétarien' | 'Vegan' | 'Rapide' | 'Budget' | 'Perso'>('All');

    const filteredRecipes = recipes.filter(r => {
        if (filter === 'All') return true;
        if (filter === 'Favorites') return profile.favorites && profile.favorites.includes(r.id);
        if (filter === 'Budget') return r.cost < 2.5;
        if (filter === 'Perso') return r.isCustom;
        return r.tags.includes(filter);
    });

    return (
    <div className="p-6 space-y-8">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Bonjour, {profile.name} 👋</h1>
                <p className="text-sm text-slate-500 font-medium">Qu'est-ce qu'on mange ?</p>
            </div>
            <div className="flex flex-col items-end bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100">
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Budget</span>
                 <span className={`font-bold text-lg ${(profile.budget - profile.spent) < 20 ? 'text-red-500' : 'text-emerald-600'}`}>
                    {(profile.budget - profile.spent).toFixed(2)}€
                 </span>
            </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
                <div className="bg-white p-2.5 rounded-xl shadow-sm text-orange-500">
                    <TrendingUp size={24} />
                </div>
                <div>
                    <p className="font-bold text-orange-900 text-sm">Série de cuisine</p>
                    <p className="text-xs text-orange-700 font-medium">Tu cuisines depuis {profile.streak} jours ! 🔥</p>
                </div>
            </div>
        </div>

        <div>
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6 hide-scrollbar">
                {[
                    { id: 'All', label: 'Tous', icon: null },
                    { id: 'Favorites', label: 'Favoris', icon: Heart },
                    { id: 'Perso', label: 'Mes Recettes', icon: PenTool },
                    { id: 'Végétarien', label: 'Végé', icon: Leaf },
                    { id: 'Rapide', label: 'Express', icon: Clock },
                    { id: 'Budget', label: 'Eco', icon: Wallet },
                ].map((cat) => (
                    <button 
                        key={cat.id}
                        onClick={() => setFilter(cat.id as any)}
                        className={`flex items-center gap-1 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                            filter === cat.id 
                            ? 'bg-slate-800 text-white border-slate-800 shadow-lg shadow-slate-200' 
                            : 'bg-white text-slate-600 border-slate-100 hover:border-slate-300'
                        }`}
                    >
                        {cat.icon && <cat.icon size={12} className={filter === cat.id ? "text-white" : "text-slate-400"} />}
                        {cat.label}
                    </button>
                ))}
            </div>
        </div>

        <div>
            <div className="flex justify-between items-end mb-4">
                <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                    {filter === 'All' ? 'Inspiration' : filter === 'Favorites' ? 'Mes Coups de Cœur' : `Recettes ${filter}`}
                    <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{filteredRecipes.length}</span>
                </h2>
                <button onClick={onAddRecipeClick} className="text-xs font-bold text-emerald-600 flex items-center gap-1 hover:text-emerald-700">
                    <Plus size={14} /> Créer
                </button>
            </div>
            
            {filteredRecipes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {filteredRecipes.map(recipe => (
                        <RecipeCard 
                            key={recipe.id} 
                            recipe={recipe} 
                            isFavorite={profile.favorites?.includes(recipe.id) || false}
                            onClick={() => onSelectRecipe(recipe)}
                            onToggleFavorite={(e) => { e.stopPropagation(); onToggleFavorite(recipe.id); }}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-slate-400 font-medium">Aucune recette trouvée.</p>
                    <button onClick={onAddRecipeClick} className="text-emerald-600 font-bold text-sm mt-2">Créer ma première recette</button>
                </div>
            )}
        </div>
    </div>
    );
};

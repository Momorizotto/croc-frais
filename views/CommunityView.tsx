
import React from 'react';
import { Users } from 'lucide-react';
import { Recipe } from '../types';
import { RecipeCard } from '../components/RecipeCard';

interface CommunityViewProps {
    recipes: Recipe[];
    onSelectRecipe: (r: Recipe) => void;
    onToggleLike: (id: number, isLiking: boolean) => void;
    currentUserId: string;
}

export const CommunityView: React.FC<CommunityViewProps> = ({ 
    recipes, 
    onSelectRecipe, 
    onToggleLike, 
    currentUserId 
}) => {
    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Communauté 🌍</h1>
                    <p className="text-sm text-slate-500 font-medium">Les pépites des étudiants</p>
                </div>
            </div>

            {recipes.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                    <Users size={48} className="mx-auto mb-4 opacity-30" />
                    <p>Sois le premier à poster une recette !</p>
                    <p className="text-xs mt-2 text-slate-300 max-w-[200px] mx-auto">Ou vérifie ta connexion internet</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {recipes.map(recipe => {
                         const isLiked = recipe.likes?.includes(currentUserId) || false;
                         return (
                            <RecipeCard 
                                key={recipe.id} 
                                recipe={recipe} 
                                isFavorite={isLiked}
                                onClick={() => onSelectRecipe(recipe)}
                                onToggleFavorite={(e) => { e.stopPropagation(); onToggleLike(recipe.id, !isLiked); }}
                            />
                         )
                    })}
                </div>
            )}
        </div>
    );
};

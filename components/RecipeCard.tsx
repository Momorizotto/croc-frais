
import React from 'react';
import { Clock, Euro, Flame, Heart, MessageCircle, User } from 'lucide-react';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  isFavorite: boolean;
  onClick: () => void;
  onToggleFavorite: (e: React.MouseEvent) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, isFavorite, onClick, onToggleFavorite }) => {
  const isPublic = recipe.isPublic;
  const likeCount = recipe.likes?.length || 0;

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden cursor-pointer hover:shadow-md transition-all active:scale-95 group relative flex flex-col h-full"
    >
      <div className="relative h-36 w-full shrink-0">
        <img src={recipe.image_url} alt={recipe.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        
        {/* Author badge for public recipes */}
        {isPublic && recipe.author && (
            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full border border-white/20">
                <User size={10} className="text-white" />
                <span className="text-[10px] font-bold text-white truncate max-w-[80px]">{recipe.author.name}</span>
            </div>
        )}

        <div className="absolute top-2 right-2 flex gap-1 z-10">
             <button 
                onClick={onToggleFavorite}
                className={`flex items-center gap-1 p-2 rounded-full backdrop-blur-md shadow-sm transition-all ${isFavorite ? 'bg-red-50 text-red-500' : 'bg-white/90 text-slate-400 hover:text-red-400'}`}
             >
                <Heart size={16} fill={isFavorite ? "currentColor" : "none"} strokeWidth={2.5} />
                {isPublic && <span className="text-xs font-bold">{likeCount > 0 ? likeCount : ''}</span>}
             </button>
        </div>
        <div className="absolute top-2 left-2 flex gap-1">
            {recipe.tags.slice(0, 1).map(tag => (
                <span key={tag} className="bg-white/90 px-2 py-1 rounded-full text-[10px] font-bold text-emerald-800 shadow-sm backdrop-blur-sm">
                    {tag}
                </span>
            ))}
        </div>
      </div>
      <div className="p-3 flex flex-col flex-1">
        <h3 className="font-bold text-slate-800 text-sm mb-2 leading-tight line-clamp-2 min-h-[40px]">{recipe.title}</h3>
        
        <div className="mt-auto flex items-center justify-between text-xs text-slate-500 border-t border-slate-50 pt-2">
            <span className="flex items-center gap-1"><Clock size={12} /> {recipe.prep_time}m</span>
            <span className="flex items-center gap-1 text-emerald-600 font-bold"><Euro size={12} /> {recipe.cost}</span>
            {isPublic ? (
                 <span className="flex items-center gap-1 text-indigo-500 font-bold">
                    <MessageCircle size={12} /> {recipe.comments?.length || 0}
                 </span>
            ) : (
                <span className={`flex items-center gap-1 font-bold ${recipe.difficulty === 'Easy' ? 'text-emerald-500' : recipe.difficulty === 'Medium' ? 'text-orange-500' : 'text-red-500'}`}>
                    <Flame size={12} /> {recipe.difficulty === 'Easy' ? 'Facile' : recipe.difficulty === 'Medium' ? 'Moyen' : 'Difficile'}
                </span>
            )}
        </div>
      </div>
    </div>
  );
};


import React, { useState } from 'react';
import { X, Trash2, Heart, Clock, Euro, Flame, Leaf, MessageCircle, Send, Globe2, Pencil, Plus, Database } from 'lucide-react';
import { Recipe, Comment } from '../types';
import { Button } from './Button';

interface RecipeModalProps {
    recipe: Recipe;
    onClose: () => void;
    onAddIngredients: (r: Recipe) => void;
    isFavorite: boolean;
    onToggleFavorite: () => void;
    onAddComment?: (text: string) => void;
    onDelete?: (recipe: Recipe) => Promise<void>;
    onEdit?: (recipe: Recipe) => void;
    currentUserUid?: string;
    isAdmin?: boolean;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({ 
    recipe, 
    onClose, 
    onAddIngredients, 
    isFavorite, 
    onToggleFavorite,
    onAddComment,
    onDelete,
    onEdit,
    currentUserUid,
    isAdmin
}) => {
    const [commentText, setCommentText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    if (!recipe) return null;

    const handleSendComment = () => {
        if(commentText.trim() && onAddComment) {
            onAddComment(commentText);
            setCommentText('');
        }
    }

    // STRICT Permission Check:
    // 1. Admin can always delete
    // 2. If recipe has an author, only the author can delete/edit.
    // 3. If recipe has no author (legacy local), rely on isCustom.
    const isAuthor = recipe.author 
        ? (currentUserUid && recipe.author.uid === currentUserUid)
        : (recipe.isCustom === true);
    
    const canModify = isAdmin || isAuthor;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
            <div className="relative w-full h-full sm:h-[90vh] sm:max-w-md bg-white sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300">
                <div className="relative h-72 shrink-0 group">
                    <img src={recipe.image_url} className="w-full h-full object-cover" alt={recipe.title} />
                    <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start bg-gradient-to-b from-black/40 to-transparent">
                        <button onClick={onClose} className="bg-white/20 text-white p-2 rounded-full hover:bg-white/30 backdrop-blur-md transition-all active:scale-95 border border-white/20">
                            <X size={20} />
                        </button>
                        <div className="flex gap-2">
                             {canModify && onEdit && (
                                <button 
                                    onClick={() => onEdit(recipe)}
                                    className="p-2 rounded-full backdrop-blur-md bg-black/30 text-white border border-white/20 hover:bg-white hover:text-indigo-600 transition-all active:scale-95"
                                >
                                    <Pencil size={20} />
                                </button>
                             )}
                             {canModify && onDelete && (
                                <button 
                                    onClick={async () => {
                                        if (window.confirm("Voulez-vous vraiment supprimer cette recette ?")) {
                                            setIsDeleting(true);
                                            try {
                                                await onDelete(recipe);
                                                // Modal will be closed by parent usually
                                            } catch (e) {
                                                console.error(e);
                                                setIsDeleting(false);
                                            }
                                        }
                                    }} 
                                    disabled={isDeleting}
                                    className="p-2 rounded-full backdrop-blur-md bg-black/30 text-white border border-white/20 hover:bg-red-500/80 hover:text-white transition-all active:scale-95"
                                >
                                    {isDeleting ? <span className="animate-spin text-white">⏳</span> : <Trash2 size={20} />}
                                </button>
                            )}
                            <button onClick={onToggleFavorite} className={`p-2 rounded-full backdrop-blur-md shadow-lg transition-all active:scale-95 border ${isFavorite ? 'bg-white text-red-500 border-red-100' : 'bg-black/30 text-white border-white/20 hover:bg-white hover:text-red-400'}`}>
                                <Heart size={20} fill={isFavorite ? "currentColor" : "none"} strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 pt-20">
                        <div className="flex gap-2 mb-2">
                             {recipe.tags.map(tag => (
                                 <span key={tag} className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-white text-[10px] font-bold border border-white/10">{tag}</span>
                             ))}
                             {recipe.isCustom && !recipe.isPublic && (
                                 <span className="px-2 py-0.5 rounded-md bg-indigo-500/80 backdrop-blur-md text-white text-[10px] font-bold border border-white/10">Perso</span>
                             )}
                             {recipe.isPublic && (
                                 <span className="px-2 py-0.5 rounded-md bg-purple-500/80 backdrop-blur-md text-white text-[10px] font-bold border border-white/10 flex items-center gap-1">
                                    <Globe2 size={10} /> Public
                                 </span>
                             )}
                        </div>
                        <h2 className="text-2xl font-bold text-white leading-tight shadow-sm mb-1">{recipe.title}</h2>
                        {recipe.author && (
                             <p className="text-xs font-medium text-slate-300">Par {recipe.author.name} {isAdmin && <span className="text-orange-400 font-bold ml-1">(Admin Mode)</span>}</p>
                        )}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto bg-white p-6 pb-24">
                    <div className="flex gap-2 mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex-1 flex flex-col items-center justify-center border-r border-slate-200 last:border-0">
                            <Clock size={20} className="text-slate-400 mb-1" />
                            <span className="text-sm font-bold text-slate-800">{recipe.prep_time} min</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center justify-center border-r border-slate-200 last:border-0">
                            <Euro size={20} className="text-emerald-500 mb-1" />
                            <span className="text-sm font-bold text-emerald-600">{recipe.cost}€</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center justify-center">
                            <Flame size={20} className="text-orange-500 mb-1" />
                            <span className="text-sm font-bold text-orange-600">{recipe.difficulty}</span>
                        </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Leaf size={18} className="text-emerald-600" /> Ingrédients
                    </h3>
                    <ul className="space-y-3 mb-8">
                        {recipe.ingredients.map((ing, i) => (
                            <li key={i} className="flex justify-between items-center text-sm text-slate-600 border-b border-slate-50 pb-2 last:border-0">
                                <span className="font-medium">{ing.name}</span>
                                <span className="font-bold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg">{ing.qty} {ing.unit}</span>
                            </li>
                        ))}
                    </ul>

                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center">
                            <span className="text-xs font-bold text-orange-600">i</span>
                        </div>
                        Préparation
                    </h3>
                    <div className="space-y-6 mb-8">
                        {recipe.steps.map((step) => (
                            <div key={step.step} className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-sm shrink-0 shadow-lg shadow-slate-200">
                                    {step.step}
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed pt-1">{step.text}</p>
                            </div>
                        ))}
                    </div>

                    {recipe.isPublic && (
                        <div className="border-t border-slate-100 pt-6">
                             <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <MessageCircle size={18} className="text-indigo-500" /> Commentaires ({recipe.comments?.length || 0})
                            </h3>
                            
                            <div className="space-y-4 mb-4">
                                {recipe.comments && recipe.comments.length > 0 ? (
                                    recipe.comments.map((comment, i) => (
                                        <div key={i} className="bg-slate-50 p-3 rounded-xl">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="font-bold text-xs text-slate-800">{comment.authorName}</span>
                                                <span className="text-[10px] text-slate-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-sm text-slate-600">{comment.text}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-slate-400 text-sm italic">Soyez le premier à commenter !</p>
                                )}
                            </div>

                            {onAddComment && (
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        value={commentText} 
                                        onChange={e => setCommentText(e.target.value)} 
                                        placeholder="Ajouter un commentaire..." 
                                        className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <button 
                                        onClick={handleSendComment}
                                        disabled={!commentText.trim()}
                                        className="bg-indigo-600 text-white p-2 rounded-xl disabled:opacity-50"
                                    >
                                        <Send size={18} />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {isAdmin && (
                        <div className="mt-8 p-4 bg-slate-800 rounded-xl text-slate-400 text-xs font-mono">
                            <p className="font-bold text-white mb-2 flex items-center gap-2"><Database size={14}/> ADMIN DATA</p>
                            <div className="grid grid-cols-[80px_1fr] gap-1">
                                <span>ID:</span> <span className="text-emerald-400 select-all">{recipe.id}</span>
                                <span>Source:</span> <span>{recipe.isPublic ? "Firebase (Public)" : recipe.isCustom ? "Firebase (User Custom)" : "Code (Mock/Constant)"}</span>
                                <span>AuthorID:</span> <span className="select-all">{recipe.author?.uid || "N/A"}</span>
                            </div>
                            <p className="mt-2 text-[10px] text-slate-500">
                                Pour supprimer manuellement dans Firebase, copiez l'ID ci-dessus et cherchez le document correspondant dans la collection `public_recipes`.
                            </p>
                        </div>
                    )}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100 bg-white/90 backdrop-blur-md z-10">
                    <Button fullWidth onClick={() => onAddIngredients(recipe)}>
                        <Plus size={20} /> Ajouter à la liste de courses
                    </Button>
                </div>
            </div>
        </div>
    );
};

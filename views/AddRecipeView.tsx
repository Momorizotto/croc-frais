
import React, { useState, useRef, useEffect } from 'react';
import { X, Globe2, LockKeyhole, Camera } from 'lucide-react';
import { Recipe, Ingredient, RecipeStep, User } from '../types';
import { Button } from '../components/Button';

interface AddRecipeViewProps {
    onSave: (r: Recipe) => Promise<void>;
    onCancel: () => void;
    currentUser: User;
    initialRecipe?: Recipe | null;
}

export const AddRecipeView: React.FC<AddRecipeViewProps> = ({ onSave, onCancel, currentUser, initialRecipe }) => {
    const [title, setTitle] = useState('');
    const [prepTime, setPrepTime] = useState(15);
    const [cost, setCost] = useState(5);
    const [image, setImage] = useState('');
    const [ingredientsText, setIngredientsText] = useState('');
    const [stepsText, setStepsText] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isPublic, setIsPublic] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Pre-fill form if editing
    useEffect(() => {
        if (initialRecipe) {
            setTitle(initialRecipe.title);
            setPrepTime(initialRecipe.prep_time);
            setCost(initialRecipe.cost);
            setImage(initialRecipe.image_url);
            setIsPublic(!!initialRecipe.isPublic);
            
            const ingredientsStr = initialRecipe.ingredients.map(i => i.name).join('\n');
            setIngredientsText(ingredientsStr);

            const stepsStr = initialRecipe.steps.map(s => s.text).join('\n');
            setStepsText(stepsStr);

            setTags(initialRecipe.tags.filter(t => t !== 'Perso'));
        }
    }, [initialRecipe]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // AGGRESSIVE COMPRESSION for Firestore 1MB limit
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    
                    // Max dimension 600px is enough for mobile cards
                    const MAX_DIM = 600; 

                    if (width > height) {
                        if (width > MAX_DIM) {
                            height *= MAX_DIM / width;
                            width = MAX_DIM;
                        }
                    } else {
                        if (height > MAX_DIM) {
                            width *= MAX_DIM / height;
                            height = MAX_DIM;
                        }
                    }
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        ctx.drawImage(img, 0, 0, width, height);
                        // Compress to JPEG with 0.5 quality - very small footprint
                        const dataUrl = canvas.toDataURL('image/jpeg', 0.5);
                        setImage(dataUrl);
                    }
                };
                if (event.target?.result) {
                    img.src = event.target.result as string;
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if(!title || !ingredientsText) return alert("Titre et ingrédients requis");
        setIsSaving(true);

        const ingredients: Ingredient[] = ingredientsText.split('\n').filter(l => l.trim()).map(line => ({
            name: line,
            qty: 1, 
            unit: 'portion'
        }));

        const steps: RecipeStep[] = stepsText.split('\n').filter(l => l.trim()).map((line, i) => ({
            step: i + 1,
            text: line
        }));

        // Base recipe object
        const newRecipe: Recipe = {
            id: initialRecipe ? initialRecipe.id : Date.now(),
            title,
            description: isPublic ? "Recette partagée avec la communauté" : "Recette personnalisée",
            prep_time: prepTime,
            cost,
            difficulty: 'Medium',
            image_url: image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=60",
            tags: ["Perso", ...tags],
            ingredients,
            steps,
            isPublic: isPublic,
            createdAt: initialRecipe ? initialRecipe.createdAt : Date.now(),
            likes: initialRecipe ? initialRecipe.likes : [],
            comments: initialRecipe ? initialRecipe.comments : [],
            author: {
                uid: currentUser.uid,
                name: currentUser.displayName || 'Chef'
            }
        };

        try {
            await onSave(newRecipe);
        } catch (error) {
            console.error(error);
            alert("Erreur lors de l'enregistrement. L'image est peut-être trop lourde même après compression.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="p-6 pb-24 animate-in slide-in-from-right">
             <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-slate-800">{initialRecipe ? 'Modifier la recette' : 'Créer une recette'}</h1>
                <button onClick={onCancel} className="bg-slate-100 p-2 rounded-full text-slate-500 hover:bg-slate-200 transition-colors">
                    <X size={20} />
                </button>
            </div>

            <div className="space-y-6">
                <div className="bg-indigo-50 p-4 rounded-xl flex items-center justify-between border border-indigo-100">
                    <div className="flex items-center gap-3">
                        {isPublic ? <Globe2 className="text-indigo-600" size={24}/> : <LockKeyhole className="text-slate-500" size={24}/>}
                        <div>
                            <p className="font-bold text-slate-800 text-sm">{isPublic ? 'Public' : 'Privé'}</p>
                            <p className="text-xs text-slate-500">{isPublic ? 'Visible par toute la communauté' : 'Visible uniquement par toi'}</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Titre du plat</label>
                    <input value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Ex: Lasagnes de la mama" />
                </div>
                
                <div className="flex gap-4">
                     <div className="flex-1">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Temps (min)</label>
                        <input type="number" value={prepTime} onChange={e => setPrepTime(parseInt(e.target.value) || 0)} className="w-full bg-white border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500" />
                    </div>
                     <div className="flex-1">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Coût (€)</label>
                        <input type="number" value={cost} onChange={e => setCost(parseFloat(e.target.value) || 0)} className="w-full bg-white border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500" />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Photo</label>
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="relative w-full h-40 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 bg-slate-50 overflow-hidden"
                    >
                         {image ? (
                             <img src={image} className="w-full h-full object-cover" alt="Preview" />
                         ) : (
                             <div className="flex flex-col items-center text-slate-400">
                                 <Camera size={32} className="mb-2" />
                                 <span className="text-xs font-bold">Prendre une photo</span>
                             </div>
                         )}
                         <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            accept="image/*" 
                            onChange={handleFileChange}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Ingrédients (1 par ligne)</label>
                    <textarea value={ingredientsText} onChange={e => setIngredientsText(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500 h-24 resize-none" placeholder="200g Pâtes&#10;1 Pot de sauce..." />
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Étapes (1 par ligne)</label>
                    <textarea value={stepsText} onChange={e => setStepsText(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500 h-24 resize-none" placeholder="Cuire les pâtes...&#10;Mélanger..." />
                </div>

                <Button fullWidth onClick={handleSave} isLoading={isSaving}>{initialRecipe ? "Modifier la recette" : "Sauvegarder la recette"}</Button>
            </div>
        </div>
    );
};

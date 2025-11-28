import React, { useState } from 'react';
import { Sparkles, Loader2, ArrowLeft } from 'lucide-react';
import { UserProfile } from '../types';
import { generateRecipeIdea } from '../services/geminiService';
import { Button } from './Button';

interface ChefAIProps {
  profile: UserProfile;
}

export const ChefAI: React.FC<ChefAIProps> = ({ profile }) => {
  const [ingredients, setIngredients] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!ingredients.trim()) return;
    setLoading(true);
    const response = await generateRecipeIdea(profile, ingredients);
    setResult(response);
    setLoading(false);
  };

  return (
    <div className="p-4 pb-24 min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 animate-in fade-in duration-500">
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-indigo-100 p-2 rounded-full">
            <Sparkles className="text-indigo-600" size={24} />
        </div>
        <div>
            <h1 className="text-xl font-bold text-indigo-900">Chef IA</h1>
            <p className="text-xs text-indigo-400">Anti-gaspi & Créatif</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-xl shadow-indigo-100/50 border border-white mb-6">
        <label className="block text-sm font-bold text-slate-700 mb-2">Qu'as-tu dans ton frigo ?</label>
        <textarea 
          className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 placeholder:text-slate-400 resize-none transition-all" 
          rows={3} 
          placeholder="Ex: 2 oeufs, un fond de lait, du pain rassis..." 
          value={ingredients} 
          onChange={(e) => setIngredients(e.target.value)}
        />
        <div className="mt-4">
            <Button 
                onClick={handleGenerate} 
                variant="secondary" 
                fullWidth 
                isLoading={loading}
                disabled={!ingredients}
            >
                {loading ? "Le Chef réfléchit..." : "Inventer une recette"}
            </Button>
        </div>
      </div>

      {result && (
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-indigo-100 animate-in slide-in-from-bottom-4">
          <div className="prose prose-sm prose-indigo text-slate-700 whitespace-pre-wrap font-medium leading-relaxed">
            {result}
          </div>
          <div className="mt-6 pt-4 border-t border-indigo-50 flex justify-end">
             <button 
                onClick={() => setResult(null)}
                className="text-xs font-bold text-indigo-400 hover:text-indigo-600"
             >
                Nouvelle recherche
             </button>
          </div>
        </div>
      )}
    </div>
  );
};
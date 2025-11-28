
import React, { useState } from 'react';
import { ShoppingCart, Check, Trash2, Plus } from 'lucide-react';
import { ShoppingItem } from '../types';
import { StoreMap } from '../components/StoreMap';

interface ShoppingListViewProps {
    shoppingList: ShoppingItem[];
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
    onAdd: (name: string) => void;
    apiKey?: string;
}

export const ShoppingListView: React.FC<ShoppingListViewProps> = ({ shoppingList, onToggle, onDelete, onAdd, apiKey }) => {
    const [view, setView] = useState<'list' | 'map'>('list');
    const [input, setInput] = useState('');

    return (
        <div className="p-6">
            <div className="flex justify-between items-end mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Courses</h1>
                <div className="bg-slate-100 p-1 rounded-xl flex shadow-inner">
                    <button onClick={() => setView('list')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${view === 'list' ? 'bg-white shadow-sm text-emerald-700' : 'text-slate-400 hover:text-slate-600'}`}>Liste</button>
                    <button onClick={() => setView('map')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${view === 'map' ? 'bg-white shadow-sm text-emerald-700' : 'text-slate-400 hover:text-slate-600'}`}>Carte</button>
                </div>
            </div>

            {view === 'list' ? (
                <>
                    <form onSubmit={(e) => { e.preventDefault(); if(input) { onAdd(input); setInput(''); } }} className="relative mb-8">
                        <input 
                            value={input} 
                            onChange={e => setInput(e.target.value)}
                            placeholder="Ajouter un produit..." 
                            className="w-full bg-white border border-slate-200 pl-5 pr-14 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm transition-shadow text-sm font-medium"
                        />
                        <button type="submit" className="absolute right-2 top-2 bottom-2 bg-emerald-600 text-white w-12 rounded-xl flex items-center justify-center hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200">
                            <Plus size={22} />
                        </button>
                    </form>

                    <div className="space-y-3">
                        {shoppingList.length === 0 && (
                            <div className="text-center py-16 text-slate-300 flex flex-col items-center">
                                <ShoppingCart size={56} className="mb-4 opacity-50" strokeWidth={1.5} />
                                <p className="font-medium">Ta liste est vide.</p>
                            </div>
                        )}
                        {shoppingList.map(item => (
                            <div key={item.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 group ${item.checked ? 'bg-slate-50 border-slate-100 opacity-75' : 'bg-white border-slate-100 shadow-sm hover:border-emerald-200'}`}>
                                <div className="flex items-center gap-4 flex-1 cursor-pointer select-none" onClick={() => onToggle(item.id)}>
                                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${item.checked ? 'bg-emerald-500 border-emerald-500 scale-90' : 'border-slate-300 group-hover:border-emerald-400'}`}>
                                        {item.checked && <Check size={14} className="text-white" />}
                                    </div>
                                    <div className={item.checked ? "opacity-50 line-through transition-opacity" : ""}>
                                        <p className="font-bold text-slate-800 text-sm">{item.name}</p>
                                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">{item.category}</p>
                                    </div>
                                </div>
                                <button onClick={() => onDelete(item.id)} className="text-slate-300 hover:text-red-400 p-2 transition-colors">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <StoreMap apiKey={apiKey} />
            )}
        </div>
    );
};

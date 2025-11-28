
import React, { useState, useRef } from 'react';
import { Camera, X, ScanLine, Check } from 'lucide-react';
import { Button } from '../components/Button';
import { analyzeReceipt } from '../services/geminiService';

interface ScanReceiptViewProps {
    onScanSuccess: (total: number, items: string[]) => void;
}

export const ScanReceiptView: React.FC<ScanReceiptViewProps> = ({ onScanSuccess }) => {
    const [image, setImage] = useState<string | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [result, setResult] = useState<{ total: number, items: string[] } | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
                setResult(null); // Reset prev result
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAnalyze = async () => {
        if (!image) return;
        setAnalyzing(true);
        // Extract base64 part
        const base64Data = image.split(',')[1];
        const data = await analyzeReceipt(base64Data);
        setResult(data);
        setAnalyzing(false);
    };

    const handleConfirm = () => {
        if (result) {
            onScanSuccess(result.total, result.items);
            setImage(null);
            setResult(null);
        }
    };

    return (
        <div className="p-6 h-full flex flex-col">
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Scan Ticket</h1>
            <p className="text-slate-500 text-sm mb-6">Prends une photo de ton ticket de caisse. L'IA mettra à jour ton budget et ton frigo.</p>

            <div className="flex-1 flex flex-col items-center justify-center bg-slate-100 rounded-3xl border-2 border-dashed border-slate-300 relative overflow-hidden">
                {!image ? (
                    <div className="text-center p-6">
                        <div className="bg-white p-4 rounded-full shadow-sm inline-block mb-4">
                            <Camera size={32} className="text-emerald-500" />
                        </div>
                        <p className="font-bold text-slate-600 mb-2">Ajouter un ticket</p>
                        <p className="text-xs text-slate-400 mb-4">Supporte JPG, PNG</p>
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-emerald-200 active:scale-95 transition-transform"
                        >
                            Ouvrir la caméra
                        </button>
                    </div>
                ) : (
                    <div className="w-full h-full relative">
                        <img src={image} className="w-full h-full object-contain bg-slate-900" alt="Ticket" />
                        {!result && (
                            <button 
                                onClick={() => setImage(null)}
                                className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>
                )}
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    capture="environment"
                    onChange={handleFileChange} 
                />
            </div>

            {analyzing && (
                <div className="absolute inset-0 bg-white/80 z-20 flex flex-col items-center justify-center backdrop-blur-sm">
                    <ScanLine size={48} className="text-emerald-600 animate-pulse mb-4" />
                    <p className="font-bold text-slate-800">Analyse en cours...</p>
                    <p className="text-xs text-slate-500">Extraction des prix et aliments</p>
                </div>
            )}

            {result && (
                <div className="absolute inset-x-0 bottom-0 top-20 bg-white rounded-t-3xl shadow-2xl p-6 z-30 animate-in slide-in-from-bottom duration-500 flex flex-col">
                    <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-6"></div>
                    <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Check className="text-emerald-500" /> Analyse terminée
                    </h3>
                    
                    <div className="bg-emerald-50 p-4 rounded-2xl mb-6 flex justify-between items-center border border-emerald-100">
                        <div>
                            <p className="text-xs text-emerald-600 font-bold uppercase">Total détecté</p>
                            <p className="text-2xl font-bold text-emerald-900">{result.total.toFixed(2)}€</p>
                        </div>
                        <div className="text-right">
                             <p className="text-xs text-emerald-600 font-bold uppercase">Articles</p>
                             <p className="text-xl font-bold text-emerald-900">{result.items.length}</p>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto mb-4 border border-slate-100 rounded-xl p-2">
                        {result.items.length > 0 ? (
                            <ul className="space-y-2">
                                {result.items.map((item, i) => (
                                    <li key={i} className="text-sm text-slate-700 bg-slate-50 px-3 py-2 rounded-lg flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-center text-slate-400 text-sm py-4">Aucun aliment détecté.</p>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <Button variant="outline" onClick={() => setResult(null)} className="flex-1">Refaire</Button>
                        <Button onClick={handleConfirm} className="flex-[2]">Valider & Ajouter</Button>
                    </div>
                </div>
            )}

            {image && !analyzing && !result && (
                <div className="mt-4">
                    <Button fullWidth onClick={handleAnalyze}>
                        <ScanLine className="mr-2" /> Analyser le ticket
                    </Button>
                </div>
            )}
        </div>
    );
};

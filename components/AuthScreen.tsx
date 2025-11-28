
import React, { useState } from 'react';
import { User as UserIcon, Mail, Lock, Eye, EyeOff, Leaf } from 'lucide-react';
import { Database } from '../services/database';
import { Button } from './Button';

interface AuthScreenProps {
  onLoginSuccess: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    let result;
    if (isLogin) {
        result = await Database.login(email, password);
    } else {
        if (!name) {
            setError("Le prénom est requis");
            setIsLoading(false);
            return;
        }
        result = await Database.register(email, password, name);
    }

    if (result.success) {
        onLoginSuccess();
    } else {
        setError(result.message || "Une erreur est survenue");
        setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
      setIsLoading(true);
      const result = await Database.loginWithGoogle();
      if (result.success) {
          onLoginSuccess();
      } else {
          setError(result.message || "Erreur Google Auth");
          setIsLoading(false);
      }
  };

  return (
    <div className="min-h-screen bg-emerald-600 flex flex-col justify-center p-6 text-white animate-in fade-in">
      <div className="bg-white text-slate-900 p-8 rounded-3xl shadow-2xl w-full max-w-sm mx-auto transition-all">
        <div className="flex justify-center mb-6">
          <div className="bg-emerald-100 p-4 rounded-full shadow-inner">
            <Leaf size={40} className="text-emerald-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center mb-1 text-slate-800">Croc'Frais</h2>
        <p className="text-center text-slate-400 text-sm mb-6 font-medium">Mange mieux, dépense moins.</p>
        
        {error && (
            <div className="bg-red-50 border border-red-100 text-red-500 p-3 rounded-xl mb-6 text-xs font-bold text-center flex items-center justify-center gap-2 animate-in slide-in-from-top-2">
                <span className="block w-2 h-2 bg-red-500 rounded-full"></span>
                {error}
            </div>
        )}

        <div className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
                <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Prénom</label>
                <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                        type="text" 
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-200 pl-11 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-slate-700" 
                        placeholder="Ton prénom" 
                        required={!isLogin}
                    />
                </div>
                </div>
            )}
            
            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Email</label>
                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                        type="email" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-200 pl-11 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-slate-700" 
                        placeholder="etudiant@univ.fr" 
                        required
                    />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Mot de passe</label>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                        type={showPassword ? "text" : "password"} 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-200 pl-11 pr-11 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-slate-700" 
                        placeholder="••••••••" 
                        required
                        minLength={6}
                    />
                    <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
            </div>

            <div className="pt-2">
                <Button fullWidth type="submit" isLoading={isLoading}>
                    {isLogin ? "Se connecter" : "Créer mon compte"}
                </Button>
            </div>
            </form>

            <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink-0 mx-4 text-slate-300 text-xs font-bold">OU</span>
                <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <Button 
                type="button" 
                variant="outline" 
                fullWidth 
                onClick={handleGoogleLogin} 
                className="bg-white hover:bg-slate-50"
            >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                Continuer avec Google
            </Button>
        </div>

        <div className="mt-6 text-center">
            <p className="text-xs text-slate-400 mb-2">
                {isLogin ? "Nouveau sur Croc'Frais ?" : "Tu as déjà un compte ?"}
            </p>
            <button 
                onClick={() => { setIsLogin(!isLogin); setError(''); }} 
                className="text-sm text-emerald-600 font-bold hover:text-emerald-700 transition-colors"
            >
                {isLogin ? "Créer un compte gratuitement" : "Se connecter maintenant"}
            </button>
        </div>
      </div>
    </div>
  );
};

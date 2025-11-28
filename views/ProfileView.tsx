
import React, { useState } from 'react';
import { X, ChevronRight, Users, Settings, LogOut, ScanLine, Leaf } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { UserProfile } from '../types';
import { ALL_EQUIPMENT } from '../constants';
import { Button } from '../components/Button';

interface ProfileViewProps {
    profile: UserProfile;
    onLogout: () => void;
    onUpdate: (p: UserProfile) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ profile, onLogout, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempProfile, setTempProfile] = useState<UserProfile>(profile);

    const data = [
        { name: 'Dépensé', value: profile.spent, color: '#10b981' },
        { name: 'Restant', value: Math.max(0, profile.budget - profile.spent), color: '#e2e8f0' },
    ];

    const handleSave = () => {
        onUpdate(tempProfile);
        setIsEditing(false);
    };

    const toggleEquipment = (item: string) => {
        const hasItem = tempProfile.equipment.includes(item);
        const newEquipment = hasItem 
            ? tempProfile.equipment.filter(i => i !== item)
            : [...tempProfile.equipment, item];
        setTempProfile({ ...tempProfile, equipment: newEquipment });
    };

    if (isEditing) {
        return (
            <div className="p-6 pb-32">
                 <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-slate-800">Modifier mon profil</h1>
                    <button onClick={() => setIsEditing(false)} className="bg-slate-100 p-2 rounded-full text-slate-500 hover:bg-slate-200 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Prénom</label>
                        <input type="text" value={tempProfile.name} onChange={e => setTempProfile({...tempProfile, name: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl p-4 font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none" />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Budget (€)</label>
                            <input type="number" value={tempProfile.budget} onChange={e => setTempProfile({...tempProfile, budget: parseFloat(e.target.value) || 0})} className="w-full bg-white border border-slate-200 rounded-xl p-4 font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none" />
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Pers. Foyer</label>
                            <div className="relative">
                                <Users size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input type="number" min={1} max={10} value={tempProfile.household_size || 1} onChange={e => setTempProfile({...tempProfile, household_size: parseInt(e.target.value) || 1})} className="w-full bg-white border border-slate-200 rounded-xl p-4 pl-12 font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Régime Alimentaire</label>
                        <div className="relative">
                            <select value={tempProfile.diet} onChange={e => setTempProfile({...tempProfile, diet: e.target.value as any})} className="w-full bg-white border border-slate-200 rounded-xl p-4 font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none appearance-none">
                                {["Omnivore", "Végétarien", "Végétalien (Vegan)", "Halal", "Casher", "Sans Gluten"].map(d => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none rotate-90" size={20} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Mon Équipement</label>
                        <div className="flex flex-wrap gap-2">
                            {ALL_EQUIPMENT.map(eq => {
                                const isSelected = tempProfile.equipment.includes(eq);
                                return (
                                    <button key={eq} onClick={() => toggleEquipment(eq)} className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border ${isSelected ? 'bg-emerald-100 border-emerald-200 text-emerald-700' : 'bg-white border-slate-200 text-slate-400'}`}>
                                        {eq}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                        <label className="flex items-center justify-between p-2">
                            <span className="font-bold text-slate-700">Notifications</span>
                            <input type="checkbox" checked={tempProfile.notifications ?? true} onChange={e => setTempProfile({...tempProfile, notifications: e.target.checked})} className="w-5 h-5 accent-emerald-600"/>
                        </label>
                    </div>

                    <div className="pt-2">
                        <Button fullWidth onClick={handleSave}>Enregistrer les modifications</Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
             <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Profil</h1>
                <div className="flex gap-2">
                    <button onClick={() => { setTempProfile(profile); setIsEditing(true); }} className="bg-emerald-100 text-emerald-600 p-2 rounded-xl hover:bg-emerald-200 transition-colors">
                        <Settings size={20}/>
                    </button>
                    <button onClick={onLogout} className="bg-slate-100 text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition-colors">
                        <LogOut size={20}/>
                    </button>
                </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 mb-6 flex flex-col items-center">
                <div className="w-56 h-56 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={data} innerRadius={65} outerRadius={85} paddingAngle={5} dataKey="value" stroke="none">
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value: number) => `${value.toFixed(2)}€`} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Budget</span>
                        <span className="text-3xl font-bold text-slate-800">{profile.budget}€</span>
                    </div>
                </div>
                <div className="flex gap-12 mt-6 w-full justify-center">
                     <div className="text-center">
                        <span className="block w-3 h-3 rounded-full bg-emerald-500 mx-auto mb-2 shadow-sm shadow-emerald-200"></span>
                        <p className="text-xs text-slate-400 font-bold uppercase">Dépensé</p>
                        <p className="font-bold text-emerald-600 text-lg">{profile.spent.toFixed(2)}€</p>
                     </div>
                     <div className="text-center">
                        <span className="block w-3 h-3 rounded-full bg-slate-200 mx-auto mb-2"></span>
                        <p className="text-xs text-slate-400 font-bold uppercase">Restant</p>
                        <p className="font-bold text-slate-600 text-lg">{(profile.budget - profile.spent).toFixed(2)}€</p>
                     </div>
                </div>
            </div>

            <div className="space-y-4">
                 <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-3">
                    <div className="flex items-center gap-4">
                        <div className="bg-orange-50 p-3 rounded-2xl text-orange-600"><ScanLine size={22}/></div>
                        <div>
                            <p className="font-bold text-slate-800">Mon Frigo</p>
                            <p className="text-sm text-slate-500 font-medium">{profile.inventory ? profile.inventory.length : 0} aliments en stock</p>
                        </div>
                    </div>
                </div>

                <div onClick={() => { setTempProfile(profile); setIsEditing(true); }} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between active:scale-[0.99] transition-transform cursor-pointer hover:border-emerald-200">
                    <div className="flex items-center gap-4">
                        <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600"><Leaf size={22}/></div>
                        <div>
                            <p className="font-bold text-slate-800">Régime & Paramètres</p>
                            <p className="text-sm text-slate-500 font-medium">{profile.diet} • {profile.household_size || 1} pers.</p>
                        </div>
                    </div>
                    <Settings size={20} className="text-slate-300" />
                </div>
            </div>
        </div>
    );
};

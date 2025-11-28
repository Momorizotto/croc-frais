import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile } from "../types";

const initAI = () => {
    // We expect the environment variable to be available
    if (!process.env.API_KEY) {
        console.error("Missing API_KEY in environment");
        return null;
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateRecipeIdea = async (profile: UserProfile, ingredients: string): Promise<string> => {
    const ai = initAI();
    if (!ai) return "Erreur: Clé API manquante. Impossible de contacter le Chef IA.";

    const prompt = `
      Tu es un chef expert pour étudiants.
      Profil étudiant: ${profile.name}
      Régime: ${profile.diet}
      Équipement disponible: ${profile.equipment.join(', ')}
      
      L'étudiant a ces restes : "${ingredients}".
      
      Génère une recette courte, simple et fun.
      Format:
      🍳 [Nom de la recette]
      ⏱️ Temps: X min
      💰 Coût estimé: Très faible
      
      📝 Instructions courtes.
      💡 Astuce de chef.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text || "Désolé, je n'ai pas trouvé d'inspiration. Réessaie !";
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "Le Chef est momentanément indisponible (Erreur API).";
    }
};

export const analyzeReceipt = async (base64Image: string): Promise<{ total: number, items: string[] }> => {
    const ai = initAI();
    if (!ai) throw new Error("API Key missing");

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    {
                        inlineData: {
                            mimeType: 'image/jpeg',
                            data: base64Image
                        }
                    },
                    {
                        text: "Analyse ce ticket de caisse. Extrais le montant total payé (Total à payer) et la liste des produits ALIMENTAIRES uniquement. Ignore les produits non alimentaires."
                    }
                ]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        total: { type: Type.NUMBER, description: "Le montant total du ticket en euros." },
                        items: { 
                            type: Type.ARRAY, 
                            items: { type: Type.STRING },
                            description: "Liste des noms des produits alimentaires trouvés."
                        }
                    }
                }
            }
        });

        const text = response.text;
        if (!text) return { total: 0, items: [] };
        return JSON.parse(text);
    } catch (error) {
        console.error("Receipt Analysis Error:", error);
        return { total: 0, items: [] };
    }
};

export type DietType = "Omnivore" | "Végétarien" | "Végétalien (Vegan)" | "Halal" | "Casher" | "Sans Gluten";

export interface UserProfile {
  name: string;
  email: string;
  budget: number;
  spent: number;
  streak: number;
  equipment: string[];
  diet: DietType;
  household_size: number;
  inventory: string[];
  favorites: number[]; // Liste des IDs de recettes likées
  theme?: 'light' | 'dark';
  notifications?: boolean;
}

export interface Ingredient {
  name: string;
  qty: number | string;
  unit?: string;
}

export interface RecipeStep {
  step: number;
  text: string;
}

export interface Comment {
  id: number;
  authorName: string;
  text: string;
  createdAt: number;
}

export interface Recipe {
  id: number; // Changed to number to support timestamp IDs, though Firestore uses strings usually, keeping number for compatibility with existing mocks
  title: string;
  description: string;
  prep_time: number;
  cost: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  image_url: string;
  tags: string[];
  ingredients: Ingredient[];
  steps: RecipeStep[];
  isCustom?: boolean; 
  // Social Features
  isPublic?: boolean;
  author?: {
    uid: string;
    name: string;
  };
  likes?: string[]; // Array of User UIDs
  comments?: Comment[];
  createdAt?: number;
}

export interface ShoppingItem {
  id: number;
  name: string;
  checked: boolean;
  category: string;
  quantity?: string;
}

export interface MealPlan {
  [date: string]: {
    lunch: number | null; // Recipe ID
    dinner: number | null; // Recipe ID
  };
}

// Local User type to replace Firebase User
export interface User {
    uid: string;
    email: string;
    displayName: string;
}

export interface UserData {
  uid: string; 
  profile: UserProfile;
  shoppingList: ShoppingItem[];
  mealPlan: MealPlan;
  customRecipes: Recipe[]; 
  createdAt: number;
  passwordHash?: string; // For local auth simulation
}

export interface StorePlace {
  name: string;
  vicinity: string;
  rating?: number;
  geometry: {
    location: {
      lat: number;
      lng: number;
    }
  }
}

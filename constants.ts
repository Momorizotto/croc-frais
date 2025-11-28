

import { Recipe, UserProfile, ShoppingItem } from './types';

export const ALL_EQUIPMENT = [
  "Micro-ondes", "Plaque élec.", "Four", "Mixeur", "Bouilloire",
  "Grille-pain", "Robot cuiseur", "Friteuse", "Autocuiseur"
];

export const DEFAULT_PROFILE_TEMPLATE: UserProfile = {
  name: "",
  email: "",
  budget: 200,
  spent: 45.50, 
  streak: 3,
  equipment: ["Micro-ondes", "Plaque élec."],
  diet: "Omnivore",
  household_size: 1,
  inventory: ["Oeufs", "Lait", "Pâtes", "Sauce Tomate"],
  favorites: [],
  theme: 'light',
  notifications: true
};

export const MOCK_RECIPES: Recipe[] = [
  // --- PETIT DÉJEUNER & BRUNCH ---
  {
    id: 6,
    title: "Avocado Toast & Oeuf Mollet",
    description: "Le brunch du dimanche à la maison.",
    prep_time: 10,
    cost: 3.80,
    difficulty: 'Medium',
    image_url: "https://images.unsplash.com/photo-1687276287139-88f7333c8ca4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZvY2FkbyUyMHRvYXN0fGVufDB8fDB8fHww",
    tags: ["Végétarien", "Brunch", "Sain"],
    ingredients: [
      { name: "Avocat", qty: 1, unit: "pièce" },
      { name: "Pain complet", qty: 2, unit: "tranches" },
      { name: "Oeuf", qty: 1, unit: "pièce" },
      { name: "Citron", qty: 0.5, unit: "pièce" }
    ],
    steps: [
      { step: 1, text: "Toaster le pain. Écraser l'avocat avec sel, poivre et citron." },
      { step: 2, text: "Cuire l'oeuf 6 min dans l'eau bouillante (mollet)." },
      { step: 3, text: "Tartiner et déposer l'oeuf écalé dessus." }
    ]
  },
  {
    id: 9,
    title: "Bowl Yaourt & Granola",
    description: "Petit déj ou dessert sain.",
    prep_time: 3,
    cost: 1.20,
    difficulty: 'Easy',
    image_url: "https://images.unsplash.com/photo-1724234813528-0ca586b36638?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ym9hd2wlMjB5YW91cnQlMjBncmFub2xhfGVufDB8fDB8fHww",
    tags: ["Végétarien", "Sans Cuisson", "Petit Déj"],
    ingredients: [
      { name: "Yaourt Grec", qty: 150, unit: "g" },
      { name: "Granola", qty: 40, unit: "g" },
      { name: "Fruit de saison", qty: 1, unit: "pièce" },
      { name: "Miel", qty: 1, unit: "càc" }
    ],
    steps: [
      { step: 1, text: "Verser le yaourt dans un bol." },
      { step: 2, text: "Ajouter le granola et les fruits coupés." },
      { step: 3, text: "Finir avec un filet de miel." }
    ]
  },
  {
    id: 19,
    title: "Pancakes Banane",
    description: "Seulement 3 ingrédients !",
    prep_time: 10,
    cost: 0.80,
    difficulty: 'Easy',
    image_url: "https://images.unsplash.com/photo-1606149186228-4e5ac94a742e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGFuY2FrZXMlMjBiYW5hbmV8ZW58MHx8MHx8fDA%3D",
    tags: ["Végétarien", "Petit Déj", "Sain"],
    ingredients: [
        { name: "Banane mûre", qty: 1, unit: "pièce" },
        { name: "Oeufs", qty: 2, unit: "pièce" },
        { name: "Beurre (cuisson)", qty: 5, unit: "g" }
    ],
    steps: [
        { step: 1, text: "Écraser la banane en purée." },
        { step: 2, text: "Mélanger avec les oeufs battus." },
        { step: 3, text: "Cuire des petits tas à la poêle." }
    ]
  },
  {
    id: 30,
    title: "Porridge Pomme Cannelle",
    description: "L'énergie pour toute la matinée.",
    prep_time: 5,
    cost: 0.50,
    difficulty: 'Easy',
    image_url: "https://assets.afcdn.com/recipe/20150827/31365_w1024h768c1cx1728cy1971.jpg",
    tags: ["Végétarien", "Sain", "Petit Déj"],
    ingredients: [
        { name: "Flocons d'avoine", qty: 40, unit: "g" },
        { name: "Lait (ou eau)", qty: 200, unit: "ml" },
        { name: "Pomme", qty: 1, unit: "pièce" },
        { name: "Cannelle", qty: 1, unit: "càc" }
    ],
    steps: [
        { step: 1, text: "Mélanger avoine et lait dans un bol." },
        { step: 2, text: "Chauffer 2 min au micro-ondes." },
        { step: 3, text: "Ajouter la pomme en dés et la cannelle." }
    ]
  },

  // --- REPAS RAPIDES & ÉTUDIANTS ---
  {
    id: 1,
    title: "Omelette aux Épinards & Feta",
    description: "Un classique riche en fer, prêt en 10 minutes.",
    prep_time: 10,
    cost: 2.50,
    difficulty: 'Easy',
    image_url: "https://images.unsplash.com/photo-1510693206972-df098062cb71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    tags: ["Végétarien", "Rapide", "Protéiné"],
    ingredients: [
      { name: "Oeufs", qty: 3, unit: "pièce" },
      { name: "Épinards frais", qty: 100, unit: "g" },
      { name: "Feta", qty: 30, unit: "g" }
    ],
    steps: [
      { step: 1, text: "Battre les œufs dans un bol avec sel et poivre." },
      { step: 2, text: "Faire chauffer une poêle, ajouter les épinards jusqu'à ce qu'ils réduisent." },
      { step: 3, text: "Verser les œufs, ajouter la feta émiettée et cuire 5 min." }
    ]
  },
  {
    id: 2,
    title: "Salade de Pâtes Thon & Maïs",
    description: "Parfait pour le lendemain en lunchbox.",
    prep_time: 15,
    cost: 3.00,
    difficulty: 'Easy',
    image_url: "https://recettes100faim.fr/wp-content/uploads/2018/07/recette-salade-pates-thon-blog-letort.jpg",
    tags: ["BatchCooking", "Froid", "Budget"],
    ingredients: [
      { name: "Pâtes", qty: 100, unit: "g" },
      { name: "Thon", qty: 1, unit: "boite" },
      { name: "Maïs", qty: 50, unit: "g" },
      { name: "Tomate", qty: 1, unit: "pièce" }
    ],
    steps: [
      { step: 1, text: "Cuire les pâtes selon les instructions du paquet." },
      { step: 2, text: "Égoutter le thon et le maïs. Couper la tomate en dés." },
      { step: 3, text: "Mélanger le tout avec un filet d'huile d'olive." }
    ]
  },
  {
    id: 5,
    title: "Pâtes Carbonara Étudiante",
    description: "La version simplifiée mais ultra gourmande.",
    prep_time: 15,
    cost: 2.20,
    difficulty: 'Easy',
    image_url: "https://images.unsplash.com/photo-1612874742237-6526221588e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    tags: ["Gourmand", "Rapide"],
    ingredients: [
      { name: "Spaghetti", qty: 120, unit: "g" },
      { name: "Lardons", qty: 75, unit: "g" },
      { name: "Oeuf", qty: 1, unit: "pièce" },
      { name: "Parmesan/Grana", qty: 30, unit: "g" }
    ],
    steps: [
      { step: 1, text: "Cuire les pâtes al dente." },
      { step: 2, text: "Faire griller les lardons." },
      { step: 3, text: "Mélanger oeuf et fromage. Hors du feu, mélanger pâtes, lardons et sauce." }
    ]
  },
  {
    id: 4,
    title: "Wrap Poulet Crudités",
    description: "Idéal quand on n'a pas envie de cuisiner.",
    prep_time: 5,
    cost: 3.50,
    difficulty: 'Easy',
    image_url: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    tags: ["Sans Cuisson", "Viande"],
    ingredients: [
      { name: "Tortilla", qty: 1, unit: "pièce" },
      { name: "Aiguillettes de poulet", qty: 100, unit: "g" },
      { name: "Salade", qty: 1, unit: "poignée" },
      { name: "Sauce blanche", qty: 1, unit: "càs" }
    ],
    steps: [
      { step: 1, text: "Réchauffer légèrement la tortilla (optionnel)." },
      { step: 2, text: "Étaler la sauce, ajouter salade et poulet cuit." },
      { step: 3, text: "Rouler serré et déguster." }
    ]
  },
  {
    id: 8,
    title: "Croque-Monsieur Poêle",
    description: "Pas de four ? Pas de problème.",
    prep_time: 8,
    cost: 1.50,
    difficulty: 'Easy',
    image_url: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    tags: ["Rapide", "Réconfort"],
    ingredients: [
      { name: "Pain de mie", qty: 2, unit: "tranches" },
      { name: "Jambon", qty: 1, unit: "tranche" },
      { name: "Fromage râpé", qty: 30, unit: "g" },
      { name: "Beurre", qty: 10, unit: "g" }
    ],
    steps: [
      { step: 1, text: "Beurrer les faces extérieures du pain." },
      { step: 2, text: "Garnir de jambon et fromage." },
      { step: 3, text: "Cuire à la poêle à feu moyen jusqu'à ce que ce soit doré des deux côtés." }
    ]
  },
  {
    id: 10,
    title: "Burger Maison",
    description: "Meilleur et moins cher qu'au fast-food.",
    prep_time: 20,
    cost: 4.50,
    difficulty: 'Medium',
    image_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    tags: ["Gourmand", "Viande"],
    ingredients: [
      { name: "Pain Burger", qty: 1, unit: "pièce" },
      { name: "Steak haché", qty: 1, unit: "pièce" },
      { name: "Cheddar", qty: 1, unit: "tranche" },
      { name: "Tomate/Salade", qty: 1, unit: "portion" }
    ],
    steps: [
      { step: 1, text: "Cuire le steak à la poêle. Poser le fromage dessus à la fin." },
      { step: 2, text: "Toaster le pain." },
      { step: 3, text: "Monter le burger avec la sauce de ton choix." }
    ]
  },
  {
    id: 31,
    title: "Quesadillas au Fromage",
    description: "Le snack chaud parfait.",
    prep_time: 10,
    cost: 2.00,
    difficulty: 'Easy',
    image_url: "https://images.unsplash.com/photo-1618040996337-56904b7850b9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    tags: ["Rapide", "Végétarien"],
    ingredients: [
        { name: "Tortilla", qty: 1, unit: "pièce" },
        { name: "Fromage râpé", qty: 50, unit: "g" },
        { name: "Oignon rouge", qty: 0.25, unit: "pièce" },
        { name: "Maïs", qty: 20, unit: "g" }
    ],
    steps: [
        { step: 1, text: "Mettre le fromage sur la moitié de la tortilla." },
        { step: 2, text: "Plier en deux et cuire à la poêle jusqu'à ce que le fromage fonde." },
        { step: 3, text: "Couper en triangles." }
    ]
  },
  {
    id: 32,
    title: "Tartine Chèvre Miel",
    description: "Simple et sophistiqué.",
    prep_time: 10,
    cost: 3.00,
    difficulty: 'Easy',
    image_url: "https://img.cuisineaz.com/1024x1024/2017/06/22/i130101-toasts-de-chevre-au-miel.jpeg",
    tags: ["Végétarien", "Rapide"],
    ingredients: [
        { name: "Pain de campagne", qty: 1, unit: "tranche" },
        { name: "Fromage de chèvre", qty: 3, unit: "rondelles" },
        { name: "Miel", qty: 1, unit: "càc" },
        { name: "Noix", qty: 2, unit: "pièces" }
    ],
    steps: [
        { step: 1, text: "Toaster le pain." },
        { step: 2, text: "Disposer le chèvre, arroser de miel." },
        { step: 3, text: "Ajouter les noix et passer au grill 2 min." }
    ]
  },

  // --- PLATS COMPLETS & BATCH COOKING ---
  {
    id: 3,
    title: "Curry de Pois Chiches",
    description: "Plat réconfortant et économique.",
    prep_time: 20,
    cost: 1.80,
    difficulty: 'Medium',
    image_url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    tags: ["Vegan", "Sans Gluten", "Chaud"],
    ingredients: [
      { name: "Pois chiches", qty: 200, unit: "g" },
      { name: "Lait de coco", qty: 200, unit: "ml" },
      { name: "Curry en poudre", qty: 1, unit: "càs" },
      { name: "Riz", qty: 100, unit: "g" }
    ],
    steps: [
      { step: 1, text: "Faire revenir le curry dans un peu d'huile." },
      { step: 2, text: "Ajouter les pois chiches et le lait de coco." },
      { step: 3, text: "Laisser mijoter 15 min pendant que le riz cuit." }
    ]
  },
  {
    id: 7,
    title: "Chili Sin Carne",
    description: "Ragoût épicé aux légumes et haricots rouges.",
    prep_time: 25,
    cost: 2.00,
    difficulty: 'Medium',
    image_url: "https://assets.afcdn.com/recipe/20190320/89689_w600.jpg",
    tags: ["Vegan", "BatchCooking", "Épicé"],
    ingredients: [
      { name: "Haricots rouges", qty: 250, unit: "g" },
      { name: "Pulpe de tomate", qty: 200, unit: "g" },
      { name: "Oignon", qty: 1, unit: "pièce" },
      { name: "Maïs", qty: 50, unit: "g" }
    ],
    steps: [
      { step: 1, text: "Faire revenir l'oignon émincé." },
      { step: 2, text: "Ajouter tomates, haricots égouttés et maïs." },
      { step: 3, text: "Laisser mijoter 15 min. Servir avec du riz." }
    ]
  },
  {
    id: 13,
    title: "One Pot Pasta Tomate",
    description: "Tout cuire dans une seule casserole !",
    prep_time: 15,
    cost: 1.80,
    difficulty: 'Easy',
    image_url: "https://images.unsplash.com/photo-1556761223-4c4282c73f77?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    tags: ["Végétarien", "BatchCooking"],
    ingredients: [
      { name: "Pâtes", qty: 120, unit: "g" },
      { name: "Sauce tomate", qty: 100, unit: "g" },
      { name: "Oignon", qty: 0.5, unit: "pièce" },
      { name: "Eau", qty: 300, unit: "ml" }
    ],
    steps: [
        { step: 1, text: "Mettre tous les ingrédients dans une casserole." },
        { step: 2, text: "Porter à ébullition et laisser mijoter 12 min en remuant." },
        { step: 3, text: "Ajouter du fromage si désiré." }
    ]
  },
  {
    id: 14,
    title: "Riz Cantonais Express",
    description: "Utilise tes restes de riz de la veille.",
    prep_time: 10,
    cost: 2.00,
    difficulty: 'Medium',
    image_url: "https://i0.wp.com/www.programme-malin.com/wp-content/uploads/2020/12/riz-cantonnais.jpg?fit=1920%2C1080&ssl=1",
    tags: ["Anti-Gaspi", "Rapide"],
    ingredients: [
        { name: "Riz cuit", qty: 150, unit: "g" },
        { name: "Oeuf", qty: 1, unit: "pièce" },
        { name: "Petits pois (surgelés)", qty: 50, unit: "g" },
        { name: "Dés de jambon", qty: 50, unit: "g" }
    ],
    steps: [
        { step: 1, text: "Faire revenir les petits pois et le jambon." },
        { step: 2, text: "Ajouter le riz et bien chauffer." },
        { step: 3, text: "Ajouter l'oeuf battu et remuer jusqu'à cuisson." }
    ]
  },
  {
    id: 11,
    title: "Dahl de Lentilles Corail",
    description: "Voyage en Inde depuis ta cuisine.",
    prep_time: 20,
    cost: 1.90,
    difficulty: 'Medium',
    image_url: "data:image/jpeg;base64,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",
    tags: ["Vegan", "Sans Gluten", "Sain"],
    ingredients: [
      { name: "Lentilles corail", qty: 100, unit: "g" },
      { name: "Lait de coco", qty: 100, unit: "ml" },
      { name: "Tomate concassée", qty: 100, unit: "g" },
      { name: "Curcuma/Cumin", qty: 1, unit: "càc" }
    ],
    steps: [
      { step: 1, text: "Rincer les lentilles." },
      { step: 2, text: "Cuire tout ensemble dans une casserole 15-20 min." },
      { step: 3, text: "Servir avec du riz ou des naans." }
    ]
  },
  {
    id: 33,
    title: "Poulet Curry Coco",
    description: "Un classique indémodable.",
    prep_time: 25,
    cost: 4.50,
    difficulty: 'Medium',
    image_url: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    tags: ["Viande", "BatchCooking"],
    ingredients: [
        { name: "Escalope de poulet", qty: 1, unit: "pièce" },
        { name: "Lait de coco", qty: 200, unit: "ml" },
        { name: "Pâte de curry", qty: 1, unit: "càs" },
        { name: "Riz basmati", qty: 80, unit: "g" }
    ],
    steps: [
        { step: 1, text: "Couper le poulet en dés et cuire à la poêle." },
        { step: 2, text: "Ajouter le curry puis le lait de coco." },
        { step: 3, text: "Laisser épaissir 10 min et servir avec le riz." }
    ]
  },
  {
    id: 34,
    title: "Ratatouille Express",
    description: "Le soleil dans l'assiette.",
    prep_time: 30,
    cost: 3.50,
    difficulty: 'Easy',
    image_url: "https://lacuisinedegeraldine.fr/wp-content/uploads/2025/06/Ratatouille-333-scaled.jpg",
    tags: ["Végétarien", "Sain", "Léger"],
    ingredients: [
        { name: "Courgette", qty: 1, unit: "pièce" },
        { name: "Aubergine", qty: 0.5, unit: "pièce" },
        { name: "Poivron", qty: 1, unit: "pièce" },
        { name: "Tomates concassées", qty: 200, unit: "g" }
    ],
    steps: [
        { step: 1, text: "Couper tous les légumes en dés." },
        { step: 2, text: "Faire revenir dans l'huile d'olive." },
        { step: 3, text: "Ajouter la tomate et mijoter 20 min." }
    ]
  },
  {
    id: 17,
    title: "Gratin de Pâtes au Thon",
    description: "Le plat familial par excellence.",
    prep_time: 30,
    cost: 3.50,
    difficulty: 'Easy',
    image_url: "https://rachel-cuisine.fr/wp-content/uploads/2020/03/gratin-pate-thon.jpg",
    tags: ["BatchCooking", "Four"],
    ingredients: [
        { name: "Pâtes", qty: 150, unit: "g" },
        { name: "Thon", qty: 1, unit: "boite" },
        { name: "Crème fraîche", qty: 100, unit: "g" },
        { name: "Gruyère", qty: 50, unit: "g" }
    ],
    steps: [
        { step: 1, text: "Cuire les pâtes. Mélanger avec thon et crème." },
        { step: 2, text: "Verser dans un plat, recouvrir de fromage." },
        { step: 3, text: "Gratiner 15 min au four à 200°C." }
    ]
  },

  // --- FRAICHEUR & SALADES ---
  {
    id: 15,
    title: "Pâtes Pesto & Mozza",
    description: "Le déjeuner d'été par excellence.",
    prep_time: 10,
    cost: 2.80,
    difficulty: 'Easy',
    image_url: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    tags: ["Végétarien", "Froid", "Rapide"],
    ingredients: [
        { name: "Pâtes", qty: 100, unit: "g" },
        { name: "Pesto vert", qty: 2, unit: "càs" },
        { name: "Mozzarella billes", qty: 50, unit: "g" },
        { name: "Tomates cerises", qty: 6, unit: "pièce" }
    ],
    steps: [
        { step: 1, text: "Cuire les pâtes et laisser refroidir." },
        { step: 2, text: "Couper les tomates et la mozza." },
        { step: 3, text: "Mélanger le tout avec le pesto." }
    ]
  },
  {
    id: 18,
    title: "Salade Grecque",
    description: "Fraîcheur méditerranéenne.",
    prep_time: 10,
    cost: 3.00,
    difficulty: 'Easy',
    image_url: "https://assets.afcdn.com/recipe/20190704/94666_w1024h1024c1cx2689cy1920cxt0cyt0cxb5378cyb3840.webp",
    tags: ["Végétarien", "Froid", "Sain"],
    ingredients: [
        { name: "Concombre", qty: 0.5, unit: "pièce" },
        { name: "Tomate", qty: 2, unit: "pièce" },
        { name: "Feta", qty: 50, unit: "g" },
        { name: "Olives noires", qty: 10, unit: "pièce" }
    ],
    steps: [
        { step: 1, text: "Couper tous les légumes en dés grossiers." },
        { step: 2, text: "Ajouter la feta en cubes et les olives." },
        { step: 3, text: "Assaisonner d'huile d'olive et origan." }
    ]
  },
  {
    id: 35,
    title: "Taboulé Maison",
    description: "Rien à voir avec celui du supermarché.",
    prep_time: 20,
    cost: 2.50,
    difficulty: 'Easy',
    image_url: "https://img-3.journaldesfemmes.fr/cpm4D_7KeKHxFJ2vfjf6k_a2V6Y=/750x500/386f7c9373454df7b775ac379ab85ed1/ccmcms-jdf/39877978.jpg",
    tags: ["Vegan", "Froid", "Budget"],
    ingredients: [
        { name: "Semoule", qty: 100, unit: "g" },
        { name: "Tomate", qty: 2, unit: "pièce" },
        { name: "Concombre", qty: 0.5, unit: "pièce" },
        { name: "Menthe/Persil", qty: 1, unit: "botte" }
    ],
    steps: [
        { step: 1, text: "Préparer la semoule." },
        { step: 2, text: "Couper tomates et concombre en tout petits dés." },
        { step: 3, text: "Ciseler les herbes et mélanger avec jus de citron et huile." }
    ]
  },

  // --- DESSERTS & DOUCEURS ---
  {
    id: 20,
    title: "Mug Cake Chocolat",
    description: "Prêt en 2 min au micro-ondes.",
    prep_time: 2,
    cost: 0.50,
    difficulty: 'Easy',
    image_url: "https://tastesbetterfromscratch.com/wp-content/uploads/2022/12/Chocolate-Mug-Cake-1.jpg",
    tags: ["Dessert", "Rapide", "Micro-ondes"],
    ingredients: [
        { name: "Chocolat noir", qty: 4, unit: "carrés" },
        { name: "Beurre", qty: 20, unit: "g" },
        { name: "Sucre", qty: 1, unit: "càs" },
        { name: "Farine", qty: 1, unit: "càs" }
    ],
    steps: [
        { step: 1, text: "Fondre chocolat et beurre au micro-ondes (30s)." },
        { step: 2, text: "Ajouter sucre, puis farine, puis un oeuf." },
        { step: 3, text: "Cuire 1 min au micro-ondes." }
    ]
  },
  {
    id: 21,
    title: "Pommes au Four Express",
    description: "Dessert sain et réconfortant.",
    prep_time: 5,
    cost: 0.60,
    difficulty: 'Easy',
    image_url: "https://www.gourmandiseries.fr/wp-content/uploads/2016/11/pomme-au-four-noix.jpg",
    tags: ["Dessert", "Sain", "Vegan"],
    ingredients: [
        { name: "Pomme", qty: 1, unit: "pièce" },
        { name: "Cannelle", qty: 1, unit: "pincée" },
        { name: "Sucre vanillé", qty: 1, unit: "sachet" }
    ],
    steps: [
        { step: 1, text: "Évider la pomme." },
        { step: 2, text: "Saupoudrer de sucre et cannelle." },
        { step: 3, text: "Cuire 3 min au micro-ondes ou 20 min au four." }
    ]
  },
  {
    id: 36,
    title: "Cookie Géant Poêle",
    description: "À partager (ou pas).",
    prep_time: 15,
    cost: 2.00,
    difficulty: 'Medium',
    image_url: "https://www.undejeunerdesoleil.com/wp-content/uploads/2021/11/Cookie_chocolat_geant_poele_recette_video.jpg",
    tags: ["Dessert", "Gourmand"],
    ingredients: [
        { name: "Farine", qty: 100, unit: "g" },
        { name: "Beurre", qty: 50, unit: "g" },
        { name: "Sucre", qty: 50, unit: "g" },
        { name: "Pépites chocolat", qty: 50, unit: "g" }
    ],
    steps: [
        { step: 1, text: "Mélanger beurre mou et sucre, puis oeuf et farine." },
        { step: 2, text: "Ajouter les pépites." },
        { step: 3, text: "Cuire dans une petite poêle à feu très doux 10-12 min." }
    ]
  }
];

export const MOCK_SHOPPING_LIST: ShoppingItem[] = [
  { id: 101, name: "Oeufs (boite de 6)", quantity: "1", category: "Frais", checked: false },
  { id: 102, name: "Lait", quantity: "1L", category: "Frais", checked: true },
  { id: 103, name: "Pâtes", quantity: "500g", category: "Épicerie", checked: false },
];

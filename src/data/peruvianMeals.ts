export interface Ingredient {
  item: string;
  amount: string;
}

export interface Meal {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: Ingredient[];
  instructions: string;
  imageColor: string; // Since we mock images with colors
}

export const peruvianMeals: Meal[] = [
  // BREAKFAST
  {
    id: 'b1',
    name: 'Avena con Quinua y Manzana',
    type: 'breakfast',
    calories: 320,
    protein: 10,
    carbs: 55,
    fat: 6,
    ingredients: [
      { item: 'Quinua cocida', amount: '1/2 taza' },
      { item: 'Avena en hojuelas', amount: '1/4 taza' },
      { item: 'Manzana picada', amount: '1 unidad' },
      { item: 'Canela en polvo', amount: 'Al gusto' },
      { item: 'Leche de almendras', amount: '1 taza' }
    ],
    instructions: 'Hervir la leche con avena y quinua por 5 minutos. Servir con manzana fresca y canela.',
    imageColor: '#fef08a'
  },
  {
    id: 'b2',
    name: 'Pan con Palta y Huevo a la Copa',
    type: 'breakfast',
    calories: 350,
    protein: 14,
    carbs: 30,
    fat: 18,
    ingredients: [
      { item: 'Pan integral', amount: '2 rebanadas' },
      { item: 'Palta fuerte', amount: '1/4 unidad' },
      { item: 'Huevo', amount: '1 unidad' },
      { item: 'Sal marina', amount: 'Al gusto' }
    ],
    instructions: 'Tostar el pan, agregar la palta machacada. Acompañar con un huevo pasado por agua.',
    imageColor: '#86efac'
  },
  {
    id: 'b3',
    name: 'Jugo de Papaya con Chía y Huevos Revueltos',
    type: 'breakfast',
    calories: 280,
    protein: 15,
    carbs: 25,
    fat: 12,
    ingredients: [
      { item: 'Papaya', amount: '1 taza' },
      { item: 'Semillas de chía', amount: '1 cdta' },
      { item: 'Huevos', amount: '2 unidades' },
      { item: 'Tomate picado', amount: '1/4 taza' }
    ],
    instructions: 'Licuar la papaya con agua y chía. Preparar huevos revueltos con tomate en sartén antiadherente.',
    imageColor: '#fca5a5'
  },

  // LUNCH
  {
    id: 'l1',
    name: 'Ceviche de Pescado con Camote',
    type: 'lunch',
    calories: 380,
    protein: 35,
    carbs: 45,
    fat: 4,
    ingredients: [
      { item: 'Pescado blanco', amount: '150g' },
      { item: 'Limón', amount: '5 unidades' },
      { item: 'Cebolla roja', amount: '1/2 unidad' },
      { item: 'Camote sancochado', amount: '100g' },
      { item: 'Choclo desgranado', amount: '1/4 taza' }
    ],
    instructions: 'Cortar el pescado, marinar con limón, sal y ají limo. Servir con cebolla, camote y choclo.',
    imageColor: '#e0f2fe'
  },
  {
    id: 'l2',
    name: 'Lomo Saltado Saludable (de Pollo)',
    type: 'lunch',
    calories: 450,
    protein: 32,
    carbs: 50,
    fat: 12,
    ingredients: [
      { item: 'Pechuga de pollo', amount: '150g' },
      { item: 'Cebolla roja gruesa', amount: '1/2 unidad' },
      { item: 'Tomate en tiras', amount: '1 unidad' },
      { item: 'Papas nativas al horno', amount: '100g' },
      { item: 'Sillao bajo en sodio', amount: '1 cda' }
    ],
    instructions: 'Saltear el pollo, luego cebolla y tomate. Evitar exceso de aceite. Servir con papas al horno sin freír.',
    imageColor: '#fdba74'
  },
  {
    id: 'l3',
    name: 'Quinotto de Champiñones',
    type: 'lunch',
    calories: 410,
    protein: 15,
    carbs: 60,
    fat: 10,
    ingredients: [
      { item: 'Quinua cocida', amount: '1 taza' },
      { item: 'Champiñones', amount: '1 taza' },
      { item: 'Queso fresco light', amount: '30g' },
      { item: 'Leche evaporada descremada', amount: '2 cdas' }
    ],
    instructions: 'Guisar los champiñones, agregar quinua, un chorro de leche y terminar con el queso.',
    imageColor: '#d6d3d1'
  },

  // DINNER
  {
    id: 'd1',
    name: 'Crema de Zapallo Loche',
    type: 'dinner',
    calories: 220,
    protein: 8,
    carbs: 30,
    fat: 6,
    ingredients: [
      { item: 'Zapallo loche', amount: '200g' },
      { item: 'Pechuga de pollo deshilachada', amount: '50g' },
      { item: 'Leche descremada', amount: '1/4 taza' },
      { item: 'Queso fresco', amount: '20g' }
    ],
    instructions: 'Hervir y licuar el zapallo. Servir con pollo deshilachado y trozos de queso.',
    imageColor: '#fde047'
  },
  {
    id: 'd2',
    name: 'Ensalada de Atún con Tarwi',
    type: 'dinner',
    calories: 250,
    protein: 25,
    carbs: 15,
    fat: 10,
    ingredients: [
      { item: 'Atún en agua', amount: '1 lata' },
      { item: 'Tarwi sancochado', amount: '2 cdas' },
      { item: 'Lechuga y tomate', amount: '2 tazas' },
      { item: 'Limón', amount: '1 unidad' }
    ],
    instructions: 'Mezclar vegetales, atún y tarwi. Aderezar con limón y sal.',
    imageColor: '#bbf7d0'
  },
  {
    id: 'd3',
    name: 'Pollo a la Plancha con Verduras Salteadas',
    type: 'dinner',
    calories: 280,
    protein: 30,
    carbs: 15,
    fat: 8,
    ingredients: [
      { item: 'Filete de pollo', amount: '120g' },
      { item: 'Brócoli', amount: '1/2 taza' },
      { item: 'Zanahoria', amount: '1/2 taza' },
      { item: 'Pimiento', amount: '1/4 unidad' }
    ],
    instructions: 'Dorar el pollo sin aceite. Saltear vegetales ligeramente crujientes.',
    imageColor: '#fed7aa'
  },

  // SNACKS
  {
    id: 's1',
    name: 'Yogurt Griego con Aguaymanto',
    type: 'snack',
    calories: 120,
    protein: 10,
    carbs: 15,
    fat: 2,
    ingredients: [
      { item: 'Yogurt griego natural', amount: '100g' },
      { item: 'Aguaymanto fresco', amount: '1/4 taza' }
    ],
    instructions: 'Mezclar el yogurt con el aguaymanto.',
    imageColor: '#fef08a'
  },
  {
    id: 's2',
    name: 'Canchita Serrana sin Aceite',
    type: 'snack',
    calories: 150,
    protein: 4,
    carbs: 30,
    fat: 1,
    ingredients: [
      { item: 'Maíz paccho', amount: '1/3 taza' },
      { item: 'Sal', amount: 'Al gusto' }
    ],
    instructions: 'Tostar el maíz en olla de barro o teflón sin aceite usando tapa.',
    imageColor: '#fcd34d'
  },
  {
    id: 's3',
    name: 'Huevo Duro con Choclo',
    type: 'snack',
    calories: 180,
    protein: 9,
    carbs: 20,
    fat: 6,
    ingredients: [
      { item: 'Huevo cocido', amount: '1 unidad' },
      { item: 'Choclo desgranado', amount: '1/4 taza' }
    ],
    instructions: 'Perfecto para llevar. Comer como merienda de media tarde.',
    imageColor: '#fef08a'
  }
];

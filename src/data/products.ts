export interface Product {
  id: number;
  name: string;
  category: string;
  brand: string;
  description: string;
  ingredients: string;
  benefits: string;
  flavor: string;
  imageColor: string;
  image?: string;
  tags: string[];
}

// Map product IDs to their generated images
export const PRODUCT_IMAGES: Record<number, string> = {
  1: '/images/prod_rexet.png',
  2: '/images/prod_nutraday.png',
  3: '/images/prod_biopro_tect.png',
  4: '/images/prod_liquid_fiber.png',
  5: '/images/prod_vita_xtra.png',
  6: '/images/prod_flora_liv.png',
  7: '/images/prod_prunex.png',
  8: '/images/prod_balance.png',
  9: '/images/prod_vitaenergia.png',
  10: '/images/prod_protein_active.png',
};

export const CATEGORIES = [
  "Todos",
  "Sistema Base",
  "Inmunológica",
  "Control de Peso",
  "Anti-Edad",
  "Sport",
  "Vigor Mental",
  "Café y Bebidas",
  "Gastronomía",
];

export const products: Product[] = [
  // SISTEMA BASE (12)
  { brand: 'FUXION', id: 1, name: "Rexet", category: "Sistema Base", description: "Desintoxicante hepático que purifica tu cuerpo desde adentro. Limpieza profunda para un nuevo comienzo.", ingredients: "Extractos vegetales (tuna roja, acerola, perejil, clorofila), Zinc, Magnesio, Vitaminas B, C, D", benefits: "Detox hepático, limpieza profunda, energía renovada", flavor: "Tuna Roja", imageColor: "#E53935", tags: ["detox", "limpieza", "hígado", "verde"] },
  { brand: 'FUXION', id: 2, name: "Nutraday", category: "Sistema Base", description: "Tu multivitamínico diario completo. Todo lo que tu cuerpo necesita en un solo sobre.", ingredients: "Aminoácidos, Vitaminas, Minerales, Fibra, Camu Camu, Luteína", benefits: "Nutrición completa diaria, energía, vitalidad", flavor: "Frutas Tropicales", imageColor: "#FB8C00", tags: ["vitaminas", "diario", "energía", "minerales"] },
  { brand: 'FUXION', id: 3, name: "BioPro+ Tect", category: "Sistema Base", description: "Proteína inmunológica premium con colostrum. Protección y nutrición en cada toma.", ingredients: "BioProtein con Colostrum, Aminoácidos, DHA/ARA, Calcio", benefits: "Inmunidad, proteína de alta calidad, desarrollo", flavor: "Vainilla Francesa", imageColor: "#FDD835", tags: ["proteína", "inmunidad", "colostrum"] },
  { brand: 'FUXION', id: 4, name: "Liquid Fiber", category: "Sistema Base", description: "Fibra líquida con prebióticos y probióticos para una digestión perfecta.", ingredients: "Fibra soluble, Prebióticos, Probióticos", benefits: "Digestión saludable, regulación intestinal", flavor: "Piña", imageColor: "#FFB300", tags: ["fibra", "digestión", "prebiótico"] },
  { brand: 'FUXION', id: 5, name: "Vita Xtra T+", category: "Sistema Base", description: "Energía antioxidante con superalimentos amazónicos. Vitalidad natural todo el día.", ingredients: "Guayusa, Té Verde, Goji, Cordyceps, Ginseng, Vitaminas", benefits: "Energía natural, antioxidantes, vitalidad", flavor: "Frutas del Bosque", imageColor: "#8E24AA", tags: ["energía", "antioxidante", "vitalidad"] },
  { brand: 'FUXION', id: 6, name: "Flora Liv", category: "Sistema Base", description: "Salud digestiva con cultivos probióticos vivos y fibra prebiótica.", ingredients: "Cultivos probióticos, Fibra prebiótica, Uchuva, Granadilla", benefits: "Flora intestinal saludable, digestión óptima", flavor: "Granadilla", imageColor: "#F4511E", tags: ["probiótico", "digestión", "flora"] },
  { brand: 'FUXION', id: 7, name: "Prunex1", category: "Sistema Base", description: "Limpieza intestinal suave y efectiva con fibra de ciruela.", ingredients: "Fibra de ciruela, Prebióticos, Enzimas digestivas", benefits: "Limpieza intestinal, regulación, bienestar digestivo", flavor: "Ciruela", imageColor: "#6A1B9A", tags: ["limpieza", "fibra", "detox"] },
  { brand: 'FUXION', id: 8, name: "Balance", category: "Sistema Base", description: "Detox y equilibrio con superalimentos verdes para tu bienestar integral.", ingredients: "Chlorella, Espirulina, Alfalfa, Espinaca, Jengibre, Zinc, Magnesio", benefits: "Detox, equilibrio mineral, alcalinización", flavor: "Manzana Verde", imageColor: "#43A047", tags: ["detox", "verde", "equilibrio"] },
  { brand: 'FUXION', id: 9, name: "Vitaenergía", category: "Sistema Base", description: "Energía y vitalidad con adaptógenos naturales para un rendimiento óptimo.", ingredients: "Guaraná, Maca, Ginseng, Vitaminas B, Minerales", benefits: "Energía sostenida, vitalidad, rendimiento", flavor: "Mix Frutal", imageColor: "#E65100", tags: ["energía", "vitalidad", "adaptógeno"] },
  { brand: 'FUXION', id: 10, name: "Protein Active", category: "Sistema Base", description: "5 proteínas vegetales de alta calidad con aminoácidos esenciales.", ingredients: "5 proteínas vegetales, Aminoácidos, Enzimas, DHA/ARA, Aceite de coco", benefits: "Proteína completa vegetal, recuperación muscular", flavor: "Vainilla", imageColor: "#FFD54F", tags: ["proteína", "vegetal", "aminoácidos"] },
  { brand: 'FUXION', id: 11, name: "Berry Balance", category: "Sistema Base", description: "Poder antioxidante de berries y frutas tropicales con probióticos.", ingredients: "Cranberry, Berries, Frutas Tropicales, Probióticos, Antocianina, Calcio, Vitaminas C, E", benefits: "Antioxidante potente, salud urinaria, inmunidad", flavor: "Frutos Rojos", imageColor: "#C62828", tags: ["antioxidante", "berries", "inmunidad"] },
  { brand: 'FUXION', id: 12, name: "Xpeed", category: "Sistema Base", description: "Energía rápida con cafeína natural para cuando necesitas un boost inmediato.", ingredients: "Cafeína natural, Taurina, Vitaminas B, Electrolitos", benefits: "Energía rápida, concentración, rendimiento", flavor: "Cítricos", imageColor: "#00C853", tags: ["energía", "cafeína", "rápido"] },

  // INMUNOLÓGICA (2)
  { brand: 'FUXION', id: 13, name: "Vera+", category: "Inmunológica", description: "Fortalece tu sistema inmune con betaglucanos y antioxidantes de alta potencia.", ingredients: "Betaglucanos, Aminoácidos, Antioxidantes", benefits: "Sistema inmune fuerte, defensa natural", flavor: "Berries", imageColor: "#1565C0", tags: ["inmunidad", "betaglucanos", "defensa"] },
  { brand: 'FUXION', id: 14, name: "Duo Defense", category: "Inmunológica", description: "Defensa dual con vitamina C de Camu Camu y zinc para máxima protección.", ingredients: "Camu Camu, Vitamina C, Zinc, Probióticos", benefits: "Doble defensa inmunológica, vitamina C natural", flavor: "Naranja", imageColor: "#EF6C00", tags: ["inmunidad", "vitamina C", "zinc", "defensa"] },

  // CONTROL DE PESO (5)
  { brand: 'FUXION', id: 15, name: "Thermo T3", category: "Control de Peso", description: "Termogénico natural que activa tu metabolismo para quemar grasa eficientemente.", ingredients: "Té verde, Café verde, L-Carnitina, Cromo", benefits: "Quema grasa, metabolismo activo, control de peso", flavor: "Té Verde", imageColor: "#2E7D32", tags: ["termogénico", "fit", "metabolismo", "l-carnitina"] },
  { brand: 'FUXION', id: 16, name: "NoCARB-T", category: "Control de Peso", description: "Bloqueador natural de carbohidratos para un control de peso inteligente.", ingredients: "Extracto de frijol blanco, Cromo, Fibra", benefits: "Bloquea absorción de carbohidratos, control de peso", flavor: "Limón", imageColor: "#9E9D24", tags: ["control", "carbohidratos", "fit"] },
  { brand: 'FUXION', id: 17, name: "Chocolate Fit", category: "Control de Peso", description: "Batido de control de peso con sabor a chocolate negro. Delicioso y nutritivo.", ingredients: "Cacao, Proteína, L-Carnitina, Fibra", benefits: "Control de peso delicioso, saciedad, nutrición", flavor: "Chocolate Negro", imageColor: "#4E342E", tags: ["fit", "chocolate", "control", "proteína"] },
  { brand: 'FUXION', id: 18, name: "BioPro+ Fit", category: "Control de Peso", description: "Proteína fit con L-Carnitina para control de peso y definición muscular.", ingredients: "Proteína vegetal, L-Carnitina, Vitaminas B, Cromo, Zinc", benefits: "Definición muscular, control de peso, proteína", flavor: "Vainilla", imageColor: "#558B2F", tags: ["proteína", "fit", "l-carnitina", "control"] },
  { brand: 'FUXION', id: 19, name: "Protein Active Fit", category: "Control de Peso", description: "Proteína vegetal fit con BCAA para máximo rendimiento y control.", ingredients: "Proteínas vegetales, L-Carnitina, BCAA, Vitaminas", benefits: "Definición, rendimiento, control de peso", flavor: "Chocolate", imageColor: "#33691E", tags: ["proteína", "fit", "BCAA"] },

  // ANTI-EDAD (4)
  { brand: 'FUXION', id: 20, name: "Youth Elixir HGH", category: "Anti-Edad", description: "Anti-envejecimiento avanzado con péptidos y colágeno para una juventud prolongada.", ingredients: "Péptidos, Aminoácidos, Antioxidantes, Colágeno", benefits: "Anti-envejecimiento, vitalidad juvenil, regeneración", flavor: "Frutas Exóticas", imageColor: "#AD1457", tags: ["anti-edad", "colágeno", "péptidos", "regeneración"] },
  { brand: 'FUXION', id: 21, name: "Beauty-In", category: "Anti-Edad", description: "Belleza desde el interior con colágeno bioactivo y CoQ10. Piel radiante.", ingredients: "Colágeno bioactivo, Coenzima Q10, Biotina, Vitamina E, Súper frutas", benefits: "Piel radiante, cabello fuerte, uñas saludables", flavor: "Frutas Tropicales", imageColor: "#D81B60", tags: ["belleza", "colágeno", "CoQ10", "anti-edad"] },
  { brand: 'FUXION', id: 22, name: "Golden FLX", category: "Anti-Edad", description: "Salud articular con cúrcuma dorada y jengibre para movilidad sin dolor.", ingredients: "Cúrcuma, Jengibre, Cardamomo, Leche de coco, Pimienta negra, Canela", benefits: "Articulaciones flexibles, anti-inflamatorio, movilidad", flavor: "Orégano y Cedrón", imageColor: "#F9A825", tags: ["articulaciones", "cúrcuma", "anti-inflamatorio"] },
  { brand: 'FUXION', id: 23, name: "Passion", category: "Anti-Edad", description: "Vitalidad y pasión con adaptógenos amazónicos para una vida plena.", ingredients: "Maca, Guaraná, Ginseng, Zinc", benefits: "Vitalidad, energía, bienestar integral", flavor: "Guaraná", imageColor: "#C2185B", tags: ["vitalidad", "maca", "energía", "pasión"] },

  // SPORT (6)
  { brand: 'FUXION', id: 24, name: "Pre Sport", category: "Sport", description: "Pre-entrenamiento explosivo con BCAA y cafeína para máximo rendimiento.", ingredients: "Cafeína, BCAA, Beta-Alanina, Electrolitos", benefits: "Energía pre-entreno, fuerza, resistencia", flavor: "Frutas Tropicales", imageColor: "#1B5E20", tags: ["pre-entreno", "BCAA", "energía", "sport"] },
  { brand: 'FUXION', id: 25, name: "Post Sport", category: "Sport", description: "Recuperación muscular con glutamina y BCAA para volver más fuerte.", ingredients: "Proteína, Glutamina, BCAA, Electrolitos", benefits: "Recuperación muscular, hidratación, fuerza", flavor: "Frutas", imageColor: "#2E7D32", tags: ["post-entreno", "recuperación", "glutamina", "muscular"] },
  { brand: 'FUXION', id: 26, name: "BioPro+ Sport", category: "Sport", description: "Proteína deportiva premium con creatina para desarrollo muscular óptimo.", ingredients: "BioProtein, Actinos, Aminoácidos, Creatina", benefits: "Masa muscular, fuerza, rendimiento deportivo", flavor: "Vainilla", imageColor: "#388E3C", tags: ["proteína", "creatina", "muscular", "sport"] },
  { brand: 'FUXION', id: 27, name: "Protein Active Sport Vainilla", category: "Sport", description: "Proteína vegetal sport con glutamina para atletas que buscan lo natural.", ingredients: "Proteínas vegetales, L-Glutamina, BCAA, Aminoácidos esenciales, Enzimas", benefits: "Crecimiento muscular, recuperación, rendimiento", flavor: "Vainilla y Canela", imageColor: "#43A047", tags: ["proteína", "sport", "muscular"] },
  { brand: 'FUXION', id: 28, name: "Protein Active Sport Chocolate", category: "Sport", description: "Proteína vegetal sport con sabor a chocolate con avellanas.", ingredients: "Proteínas vegetales, L-Glutamina, BCAA, Aminoácidos, Enzimas, Cacao", benefits: "Crecimiento muscular, sabor delicioso, rendimiento", flavor: "Chocolate con Avellanas", imageColor: "#42A5F5", tags: ["proteína", "chocolate", "muscular"] },
  { brand: 'FUXION', id: 29, name: "Xtra Mile", category: "Sport", description: "Ve más allá de tus límites con hidratación y energía para resistencia.", ingredients: "Electrolitos completos, Vitaminas B, Minerales, Cafeína natural, Taurina", benefits: "Resistencia, hidratación, rendimiento prolongado", flavor: "Frutas Cítricas", imageColor: "#2962FF", tags: ["resistencia", "hidratación", "sport"] },

  // VIGOR MENTAL (3)
  { brand: 'FUXION', id: 30, name: "On", category: "Vigor Mental", description: "Mente alerta y activa durante todo el día. Potencia tu concentración y memoria.", ingredients: "Ginkgo Biloba, Fosfatidilserina, Vitaminas B6 y B12, DHA, Bacopa, L-Teanina", benefits: "Concentración, memoria, claridad mental", flavor: "Mix Frutal", imageColor: "#7B1FA2", tags: ["mental", "concentración", "memoria"] },
  { brand: 'FUXION', id: 31, name: "No Stress", category: "Vigor Mental", description: "Mente sin estrés, relajada y enfocada. Controla la ansiedad de forma natural.", ingredients: "Ashwagandha, L-Teanina, Magnesio orgánico, Vitaminas B, GABA, Pasiflora", benefits: "Anti-estrés, relajación, enfoque", flavor: "Frutos Rojos", imageColor: "#9C27B0", tags: ["estrés", "relajación", "enfoque"] },
  { brand: 'FUXION', id: 32, name: "Off", category: "Vigor Mental", description: "Descanso profundo y reparador para despertar renovado cada mañana.", ingredients: "Valeriana, Pasiflora, Melatonina, Magnesio, Tilo, Manzanilla", benefits: "Sueño reparador, relajación nocturna, descanso", flavor: "Manzanilla", imageColor: "#6A1B9A", tags: ["sueño", "descanso", "relajación"] },

  // CAFÉ Y BEBIDAS (3)
  { brand: 'FUXION', id: 33, name: "Café & Café Fit", category: "Café y Bebidas", description: "Disfruta tu café diario con beneficios funcionales para control de peso.", ingredients: "Café gourmet, L-Carnitina, Cromo orgánico, Extracto de café verde, Vitaminas B", benefits: "Energía, metabolismo, control de peso, placer", flavor: "Café Gourmet", imageColor: "#4E342E", tags: ["café", "fit", "metabolismo"] },
  { brand: 'FUXION', id: 34, name: "Gano+ Cappuccino", category: "Café y Bebidas", description: "Cappuccino funcional con Ganoderma lucidum para bienestar integral.", ingredients: "Café, Ganoderma lucidum (Reishi), Vitaminas, Minerales, Leche", benefits: "Bienestar, inmunidad, energía, placer", flavor: "Cappuccino", imageColor: "#3E2723", tags: ["café", "ganoderma", "bienestar"] },
  { brand: 'FUXION', id: 35, name: "Protein Xoup", category: "Café y Bebidas", description: "Sopa proteica nutritiva con verduras para una comida completa y saludable.", ingredients: "Proteínas vegetales, Verduras deshidratadas, Minerales, Fibra, Especias naturales", benefits: "Nutrición completa, saciedad, proteína en sopa", flavor: "Verduras", imageColor: "#827717", tags: ["sopa", "proteína", "comida"] },

  // GASTRONOMÍA (1)
  { brand: 'FUXION', id: 36, name: "Probix", category: "Gastronomía", description: "Probióticos concentrados de alta potencia para una flora intestinal óptima.", ingredients: "Probióticos multi-cepa, Prebióticos FOS, Enzimas digestivas, Lactobacillus, Bifidobacterium", benefits: "Flora intestinal, digestión óptima, inmunidad", flavor: "Neutro", imageColor: "#558B2F", tags: ["probiótico", "digestión", "flora"] },
  // OMNILIFE MOCKS
  { brand: "Omnilife", id: 37, name: "Omniplus Suprême", category: "Sistema Base", description: "Suplemento alimenticio multivitamínico con extractos herbales.", ingredients: "Vitaminas, minerales, aloe vera, manzanilla", benefits: "Fortalece sistema inmune", flavor: "Frutas", imageColor: "#F57C00", tags: ["vitaminas", "inmunidad"] },
  { brand: "Omnilife", id: 38, name: "Magnus Suprême", category: "Sport", description: "Bebida energética que proporciona energía continua.", ingredients: "Cafeína, vitaminas del complejo B, glicina", benefits: "Energía y alerta", flavor: "Cítrico", imageColor: "#E65100", tags: ["energía", "sport"] },
  { brand: "Omnilife", id: 39, name: "Power Maker", category: "Anti-Edad", description: "Fórmula para nutrir los músculos y huesos.", ingredients: "Arginina, colina, glicina, vitaminas", benefits: "Aumenta masa muscular, tejido", flavor: "Naranja", imageColor: "#D84315", tags: ["músculos", "anti-edad"] },

  // SANTA NATURA MOCKS
  { brand: "Santa Natura", id: 40, name: "Uña de Gato Premium", category: "Inmunológica", description: "Antiinflamatorio y protector inmunológico natural.", ingredients: "Extracto de Uña de Gato (Uncaria tomentosa)", benefits: "Mejora defensas, antiinflamatorio", flavor: "Natural", imageColor: "#795548", tags: ["inmunidad", "natural"] },
  { brand: "Santa Natura", id: 41, name: "Maca Negra", category: "Vigor Mental", description: "Potenciador natural de energía y memoria.", ingredients: "Maca negra gelatinizada", benefits: "Energía, concentración", flavor: "Maca", imageColor: "#3E2723", tags: ["vitalidad", "maca"] },
  { brand: "Santa Natura", id: 42, name: "Colágeno Hidrolizado", category: "Anti-Edad", description: "Colágeno puro de origen natural con camu camu.", ingredients: "Colágeno hidrolizado, vitamina C natural", benefits: "Articulaciones, piel, cabello", flavor: "Frutos rojos", imageColor: "#C2185B", tags: ["belleza", "colágeno"] },

  // HERBALIFE MOCKS
  { brand: "Herbalife", id: 43, name: "Fórmula 1 Batido Nutricional", category: "Control de Peso", description: "Comida saludable en un vaso. Mezcla de proteínas, vitaminas y minerales.", ingredients: "Proteína de soya, fibra, 21 vitaminas y minerales", benefits: "Control de peso, nutrición esencial", flavor: "Vainilla", imageColor: "#689F38", tags: ["batido", "fit", "control"] },
  { brand: "Herbalife", id: 44, name: "Té Concentrado de Hierbas", category: "Control de Peso", description: "Bebida de té refrescante y termogénica.", ingredients: "Té verde, té negro, extracto de malva", benefits: "Metabolismo, energía", flavor: "Limón", imageColor: "#33691E", tags: ["té", "termogénico"] },
  { brand: "Herbalife", id: 45, name: "Herbal Aloe Concentrado", category: "Sistema Base", description: "Bebida refrescante que apoya la salud digestiva.", ingredients: "Jugo de aloe vera, manzanilla", benefits: "Digestión sana, alivio", flavor: "Mango", imageColor: "#FFB300", tags: ["aloe", "digestión"] }
];

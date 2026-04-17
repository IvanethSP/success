// Google Gemini Vision API - Food Analysis Service

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export interface FoodAnalysis {
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  health_score: number;
  food_items: string[];
  suggestions: string;
  recommended_tags: string[];
}

const ANALYSIS_PROMPT = `Eres un nutricionista experto. Analiza la imagen de esta comida y devuelve ÚNICAMENTE un JSON válido (sin markdown, sin backticks, sin texto adicional) con esta estructura exacta:

{
  "description": "Nombre del plato o descripción breve de la comida (en español)",
  "calories": (número total de calorías estimadas),
  "protein": (gramos de proteína),
  "carbs": (gramos de carbohidratos),
  "fats": (gramos de grasa),
  "fiber": (gramos de fibra),
  "health_score": (puntuación de salud del 1 al 10, donde 10 es muy saludable),
  "food_items": ["lista", "de", "alimentos", "identificados"],
  "suggestions": "Breve consejo nutricional personalizado para este plato (en español, máximo 2 oraciones)",
  "recommended_tags": ["lista de tags relevantes entre: energía, vitaminas, vitalidad, proteína, fibra, detox, inmunidad, probiótico, anti-edad, colágeno, muscular, termogénico, control, metabolismo, relajación, mental, concentración"]
}

Sé preciso con las estimaciones calóricas basándote en porciones típicas. Si no puedes identificar la comida, devuelve una estimación basada en lo que ves.`;

export async function analyzeFoodImage(
  imageBase64: string,
  apiKey: string
): Promise<FoodAnalysis> {
  const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
  const mimeType = imageBase64.match(/^data:(image\/\w+);/)?.[1] || 'image/jpeg';

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: ANALYSIS_PROMPT },
          {
            inline_data: {
              mime_type: mimeType,
              data: base64Data,
            },
          },
        ],
      }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1024,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    if (response.status === 400 && err.includes('API_KEY')) {
      throw new Error('API Key inválida. Verifica tu clave de Gemini.');
    }
    if (response.status === 429) {
      throw new Error('Límite de solicitudes excedido. Intenta en unos minutos.');
    }
    throw new Error(`Error de Gemini API: ${response.status}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error('No se recibió respuesta del análisis.');
  }

  // Clean potential markdown code fences
  const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();

  try {
    const parsed: FoodAnalysis = JSON.parse(cleaned);
    // Validate required fields
    if (!parsed.description || typeof parsed.calories !== 'number') {
      throw new Error('Respuesta incompleta');
    }
    return parsed;
  } catch {
    throw new Error('No se pudo procesar la respuesta. Intenta con otra foto.');
  }
}

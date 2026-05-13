import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
  console.warn("Missing EXPO_PUBLIC_GEMINI_API_KEY in environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

export async function analyzeFoodImage(base64Image: string) {
  if (!apiKey) throw new Error("Missing Gemini API Key");

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
Analyze this food image and provide an estimation of its nutritional values.
Return the result strictly as a valid JSON object matching this structure EXACTLY:

{
  "title": "Short descriptive name of the food (max 3 words)",
  "brand": "Brand name if visible, or 'Generic/Homemade' if not",
  "tags": [
    { "label": "e.g. HIGH\\nPROTEIN", "bg": "#A8C5A0", "color": "#395235" },
    { "label": "e.g. LOW\\nSUGAR", "bg": "#EEE0D8", "color": "#434840" }
  ],
  "nutrition": [
    { "value": "120", "unit": "KCAL" },
    { "value": "12g", "unit": "PROT" },
    { "value": "4g", "unit": "FAT" },
    { "value": "8g", "unit": "CARBS" }
  ]
}

- Keep "tags" limited to 2-3 relevant items. You can use colors like "#A8C5A0" for green, "#EEE0D8" for neutral, "#FDF6F5" for light pink, etc. Use '\\n' in the tag label if it consists of two words.
- Ensure the "nutrition" array always has exactly 4 items in this specific order: KCAL, PROT, FAT, CARBS.
- Do NOT include markdown formatting like \`\`\`json. Return only the raw JSON string.
`;

  const imagePart = {
    inlineData: {
      data: base64Image,
      mimeType: "image/jpeg"
    }
  };

  try {
    const result = await model.generateContent([prompt, imagePart]);
    const responseText = result.response.text();
    // Clean up potential markdown formatting if Gemini still includes it
    const jsonString = responseText.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Gemini API Analysis Error:", error);
    throw error;
  }
}

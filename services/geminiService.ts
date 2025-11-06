import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, WorkoutPlan, FoodItem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
const model = 'gemini-2.5-flash';

export const getAiFitnessResponse = async (
  prompt: string,
  userProfile?: UserProfile,
  workoutPlan?: WorkoutPlan
): Promise<string> => {
  try {
    let context = `You are GymEllo Coach, a specialized AI fitness and nutrition assistant. 
    Your responses should be encouraging, knowledgeable, and formatted with markdown for readability (e.g., using lists, bolding, etc.).
    Do not use asterisks for formatting, use HTML tags like <b> for bold instead.
    
    Current user prompt: "${prompt}"`;

    if (userProfile) {
      context += `
      
      Here is the user's profile for context. Tailor your response to them:
      - Goal: ${userProfile.fitnessGoal}
      - Weight: ${userProfile.weight} kg
      - Height: ${userProfile.height} cm
      - Age: ${userProfile.age}
      - Gender: ${userProfile.gender}
      - Workouts per week: ${userProfile.workoutFrequency}
      `;
    }

    if (workoutPlan) {
        const planSummary = Object.values(workoutPlan).map(day => `- ${day.day}: ${day.title}`).join('\n');
        context += `
        
        Current Workout Plan:
        ${planSummary}
        `;
    }
    
    const response = await ai.models.generateContent({
      model: model,
      contents: context,
    });

    return response.text;
  } catch (error) {
    console.error("Error getting AI response:", error);
    return "I'm having trouble connecting right now. Please check your connection and API key, then try again.";
  }
};


export const getFoodNutritionInfo = async (query: string): Promise<FoodItem | null> => {
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: `You are an expert food scientist using the USDA FoodData Central database as your primary source. Provide precise nutritional information for a 100g serving of "${query}". If a different unit is specified (e.g., "1 cup"), calculate for that unit but also return the base 100g serving size and unit. Only return a single JSON object. Do not include any text, markdown formatting, or explanations before or after the JSON. If you cannot find the exact food, find the closest match. If no match is found, return a JSON object with all numeric values as 0 and the name as "Not Found".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: 'Full name of the food item.' },
            calories: { type: Type.NUMBER, description: 'Calories per serving.' },
            protein: { type: Type.NUMBER, description: 'Protein in grams per serving.' },
            carbs: { type: Type.NUMBER, description: 'Carbohydrates in grams per serving.' },
            fat: { type: Type.NUMBER, description: 'Fat in grams per serving.' },
            fiber: { type: Type.NUMBER, description: 'Fiber in grams per serving.' },
            servingSize: { type: Type.NUMBER, description: 'The size of a single serving.' },
            servingUnit: { type: Type.STRING, description: 'The unit of the serving size (e.g., "g", "ml", "cup").' },
          }
        },
      },
    });

    // The response.text is a string, so we need to parse it.
    // A try-catch block is a good idea in case the model returns malformed JSON.
    try {
      const jsonText = response.text.trim();
      return JSON.parse(jsonText) as FoodItem;
    } catch(e) {
      console.error("Failed to parse food nutrition JSON:", e);
      return null;
    }

  } catch (error) {
    console.error("Error fetching food nutrition data:", error);
    return null;
  }
};


export const getExerciseDetails = async (exerciseName: string): Promise<string> => {
  try {
    const prompt = `
      You are GymEllo Coach, a professional fitness trainer.
      For the exercise "${exerciseName}", return clean HTML that includes:
      1. 3–4 short numbered steps on how to perform the exercise correctly.
      2. A bold "Pro Tip" line at the end.
      
      Format like this:
      <div class="exercise-detail text-left space-y-2">
        <ol class="text-sm leading-relaxed text-gray-200">
          <li>Step 1...</li>
          <li>Step 2...</li>
        </ol>
        <p class="text-sm"><b>Pro Tip:</b> Something useful.</p>
      </div>
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error getting exercise details:", error);
    return `
      <div class="text-center">
        <p>Could not load exercise instructions at this time.</p>
      </div>
    `;
  }
};
import { GoogleGenAI } from "@google/genai";
import { CoffeeOrder } from './types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export async function generateCoffeeDescription(order: CoffeeOrder): Promise<string> {
  if (!process.env.API_KEY) {
    return "AI-powered descriptions are currently unavailable. Please check your API key setup.";
  }

  const { coffeeType, size, milk, syrup, extraShots } = order;
  
  let prompt = `Generate a short, enticing, and fun description for a custom coffee drink. Make it sound delicious and unique. The coffee is a ${size} ${coffeeType}`;
  
  if (milk !== 'Dairy') {
    prompt += ` made with ${milk} milk`;
  }
  
  if (syrup !== 'None') {
    prompt += ` and a pump of ${syrup} syrup`;
  }
  
  if (extraShots > 0) {
    const shotText = extraShots > 1 ? 'shots' : 'shot';
    prompt += ` with ${extraShots} extra ${shotText} of espresso`;
  }
  
  prompt += ". Keep it under 50 words.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating coffee description:", error);
    return "Couldn't dream up a description for this one! Looks like the AI is on a coffee break.";
  }
}

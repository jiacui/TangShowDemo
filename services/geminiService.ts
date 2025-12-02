import { GoogleGenAI } from "@google/genai";
import { DailyLog, PhaseType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateDailyInsight = async (log: DailyLog, phase: PhaseType): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API Key not configured. Unable to generate insights.";
  }

  try {
    const prompt = `
      Act as a supportive medical health assistant for an obesity intervention experiment.
      
      Current Phase: ${phase === PhaseType.BLANK ? 'Observation (No Stimulation)' : 'Intervention (Active Stimulation)'}.
      
      User Data for today:
      - Morning Weight: ${log.morningStats?.weight || 'N/A'} kg
      - Breakfast Appetite Score (0-100): ${log.appetite?.breakfastScore || 'N/A'}
      - Dinner Appetite Score (0-100): ${log.appetite?.dinnerScore || 'N/A'}
      - Device Usage: ${log.deviceUsage?.confirmed ? 'Completed' : 'Missed'}
      
      Provide a brief, encouraging 2-sentence feedback message for the user. 
      If in the Blank phase, focus on consistency of data recording. 
      If in the Stimulation phase, focus on how they are feeling and adhering to the protocol.
      Do not give medical advice, just motivation regarding the data collection.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Keep up the good work! Consistent data helps us understand your health better.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Great job recording your data today! Consistency is key.";
  }
};

import { GoogleGenAI } from "@google/genai";
import { INITIAL_MODULES } from "../constants";

// Construct a context string from the modules for the AI
const generateContext = () => {
  let ctx = "You are a helpful expert assistant for Fortify Health's Quality Training Manual on Wheat Flour Fortification.\n";
  ctx += "Here is the structure of the training manual you have access to:\n\n";
  
  INITIAL_MODULES.forEach(m => {
    ctx += `Module: ${m.title}\nDescription: ${m.description}\n`;
    m.topics.forEach(t => {
      ctx += `- Topic: ${t.title}. Summary: ${t.summary}\n`;
    });
    ctx += "\n";
  });
  
  ctx += "Answer questions based on this curriculum. If a user asks where to find something, guide them to the specific module number.";
  return ctx;
};

export const sendMessageToGemini = async (userMessage: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API Key is missing. Please configure the environment.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userMessage,
      config: {
        systemInstruction: generateContext(),
      }
    });

    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered an error while processing your request.";
  }
};

export const generateTopicSummary = async (topicTitle: string, topicText: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API Key is missing. Please configure the environment.";
  }
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Please provide a very brief, 3-bullet-point summary of the following training topic titled "${topicTitle}". Here is the content:\n\n${topicText}\n\nMake the summary easy to read and focus on the most critical takeaways.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Could not generate summary.";
  } catch (error) {
    console.error("Gemini summarizer error:", error);
    return "Error generating summary.";
  }
};
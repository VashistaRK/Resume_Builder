import type { GenerationConfig, StartChatParams } from "@google/generative-ai";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure that your Vite environment variable is defined
const apiKey: string = import.meta.env.VITE_GOOGLE_AI_API_KEY;

if (!apiKey) {
  throw new Error("VITE_GOOGLE_AI_API_KEY is not defined in your environment.");
}

const genAI = new GoogleGenerativeAI(apiKey);

const generationConfig: GenerationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

// Define the model
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

// Create the chat session with config and empty history
export const AIChatSession = model.startChat({
  generationConfig,
  history: [],
} as StartChatParams);

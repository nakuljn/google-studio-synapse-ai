
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { ModelType, EvaluationResult } from '../types';

// Initialize the API client
// Note: In a real app, handle missing API key more gracefully in UI
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const streamContent = async (
  model: ModelType,
  systemInstruction: string,
  prompt: string,
  temperature: number,
  onChunk: (text: string) => void
): Promise<string> => {
  if (!apiKey) throw new Error("API Key is missing");

  try {
    const responseStream = await ai.models.generateContentStream({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: temperature,
      }
    });

    let fullText = '';
    for await (const chunk of responseStream) {
      const c = chunk as GenerateContentResponse;
      if (c.text) {
        fullText += c.text;
        onChunk(fullText);
      }
    }
    return fullText;
  } catch (error) {
    console.error("Gemini Stream Error:", error);
    throw error;
  }
};

export const askTutor = async (
  context: string,
  userQuestion: string
): Promise<string> => {
    if (!apiKey) throw new Error("API Key is missing");

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `
You are an expert AI Tutor on the platform "Synapse". 
Your goal is to help a student who is currently learning about AI Engineering.

Context of what the student is looking at (Lesson Content + Current Playground State):
${context}

Student Question:
${userQuestion}

Answer concisely and helpfully. Do not give the full answer if it's an exercise, but guide them.
            `,
        });
        return response.text || "I'm sorry, I couldn't generate a response.";
    } catch (error) {
        console.error("Tutor Error:", error);
        return "I'm having trouble connecting to the neural network right now. Try again later.";
    }
}

export const evaluateSubmission = async (
    criteria: string,
    systemInstruction: string,
    userPrompt: string,
    modelOutput: string
): Promise<EvaluationResult> => {
    if (!apiKey) throw new Error("API Key is missing");

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `
You are an strict automated grading system for an AI engineering course.
Your job is to evaluate if a student's interaction with an LLM meets the specific lesson criteria.

---
**Lesson Success Criteria:**
${criteria}

**Student's System Instruction:**
${systemInstruction}

**Student's Prompt:**
${userPrompt}

**Actual Model Output:**
${modelOutput}
---

Did the student satisfy the criteria?
If NO, provide a short, constructive hint on what they missed (max 1 sentence).
If YES, provide a short congratulatory message.
            `,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        passed: { type: Type.BOOLEAN },
                        feedback: { type: Type.STRING }
                    },
                    required: ["passed", "feedback"]
                }
            }
        });

        if (response.text) {
            return JSON.parse(response.text) as EvaluationResult;
        }
        return { passed: false, feedback: "Error parsing grading response." };
    } catch (error) {
        console.error("Evaluation Error:", error);
        return { passed: false, feedback: "System error during evaluation. Please try again." };
    }
}

export const speakText = (text: string) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    // Try to find a good voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Natural'));
    if (preferredVoice) utterance.voice = preferredVoice;
    
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.cancel(); // Stop any previous speech
    window.speechSynthesis.speak(utterance);
  }
};

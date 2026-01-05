import { GoogleGenAI, Type, Schema } from "@google/genai";
import { LessonPlan } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const lessonPlanSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    topic: { type: Type.STRING },
    gradeLevel: { type: Type.STRING },
    subject: { type: Type.STRING },
    duration: { type: Type.STRING },
    visualStyle: {
      type: Type.OBJECT,
      properties: {
        themeName: { type: Type.STRING, description: "A catchy name for the visual theme" },
        tone: { type: Type.STRING, description: "The emotional tone of the lesson visuals" },
        colorPalette: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING }, 
          description: "Hex codes or color names" 
        },
        fontPairing: { type: Type.STRING, description: "Suggested font pairings for Canva" },
        canvaPrompts: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              element: { type: Type.STRING, description: "E.g., Background, Icon, Hero Image" },
              prompt: { type: Type.STRING, description: "The actual prompt to paste into Canva Magic Media" },
              description: { type: Type.STRING, description: "Why this visual fits the lesson" }
            },
            required: ["element", "prompt", "description"]
          }
        }
      },
      required: ["themeName", "tone", "colorPalette", "fontPairing", "canvaPrompts"]
    },
    procedures: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          time: { type: Type.STRING },
          activity: { type: Type.STRING },
          description: { type: Type.STRING }
        },
        required: ["time", "activity", "description"]
      }
    },
    quiz: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          options: { type: Type.ARRAY, items: { type: Type.STRING } },
          correctAnswer: { type: Type.STRING }
        },
        required: ["question", "options", "correctAnswer"]
      }
    },
    exitTicket: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "2-3 short reflective questions for students"
    },
    miniProject: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        materialsNeeded: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["title", "description", "materialsNeeded"]
    },
    youtubeSearchQuery: { type: Type.STRING, description: "The perfect YouTube search query to find an educational video for this specific lesson" },
    youtubeVideoId: { type: Type.STRING, description: "A valid YouTube Video ID (11 chars) if one is found via search tools, otherwise empty string." }
  },
  required: ["topic", "gradeLevel", "subject", "visualStyle", "procedures", "quiz", "exitTicket", "miniProject", "youtubeSearchQuery"]
};

export const generateLessonPlan = async (
  topic: string,
  grade: string,
  subject: string,
  duration: string,
  visualTheme: string,
  customQuestions?: string
): Promise<LessonPlan> => {
  try {
    let customInstructions = "";
    if (customQuestions && customQuestions.trim().length > 0) {
      customInstructions = `
      IMPORTANT - USER CUSTOM QUESTIONS:
      The user has provided specific questions to be included in this lesson plan. 
      You MUST incorporate the following questions verbatim into the 'quiz' section or 'exitTicket' section as appropriate:
      "${customQuestions}"
      `;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Create a comprehensive, engaging lesson plan for:
      Topic: ${topic}
      Grade: ${grade}
      Subject: ${subject}
      Duration: ${duration}
      Preferred Visual Theme Style: ${visualTheme}

      ${customInstructions}

      The lesson plan MUST include:
      1. A "Visual Style" section specifically designed for creating slides in Canva. Give prompts for "Magic Media" (AI image generation) that match the '${visualTheme}' aesthetic.
      2. A step-by-step procedure.
      3. A short quiz (5 questions). If user provided custom questions, use them. Fill the rest if needed.
      4. An exit ticket.
      5. A creative mini-project idea.
      6. A recommended YouTube video search query.
      
      Use Google Search to try and find a REAL, specific YouTube video ID that is highly relevant to this lesson. If you find one, put the 11-character ID in the youtubeVideoId field. If not, leave it empty.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: lessonPlanSchema,
        tools: [{ googleSearch: {} }] 
      },
    });

    const text = response.text;
    if (!text) throw new Error("No content generated");
    
    return JSON.parse(text) as LessonPlan;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

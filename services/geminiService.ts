import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { ChatMessage } from "../types";

const API_KEY = process.env.API_KEY || '';

// Initialize only if API Key is present, otherwise we'll handle gracefully in components
let ai: GoogleGenAI | null = null;
if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
}

export const getTriageResponseStream = async function* (
  history: ChatMessage[],
  newMessage: string,
  language: 'en' | 'ha' = 'en'
): AsyncGenerator<string, void, unknown> {
  if (!ai) {
    yield "I'm sorry, I cannot connect to the AI service right now. Please check your API key configuration.";
    return;
  }

  const systemInstructions = {
    en: `You are Dr. AI, a helpful, empathetic, and professional medical triage assistant for a TeleHealth app. 
        Your goal is to gather symptoms from the user, suggest potential causes (using cautious language like "might be", "could suggest"), and RECOMMEND THE APPROPRIATE SPECIALIST type.
        
        You MUST try to recommend one of the following specialists if relevant:
        - General Practitioner
        - Cardiologist
        - Dermatologist
        - Pediatrician
        - Psychiatrist
        - Orthopedic
        
        IMPORTANT RULES:
        1. DISCLAIMER: Always start or end major advice with a brief reminder that you are an AI and this is not a medical diagnosis.
        2. TRIAGE: If symptoms sound life-threatening (e.g., severe chest pain, trouble breathing, stroke signs), immediately tell the user to call emergency services.
        3. FORMAT: Keep responses concise and easy to read. Use bullet points for lists.
        4. EMPATHY: Be kind and reassuring.`,
    ha: `Kai ne Dr. AI, mataimakin lafiya mai taimako da kwarewa na manhajar TeleHealth.
        Manufarka ita ce sauraron alamun ciwo daga mai amfani, bayar da shawarwari kan abin da zai iya zama sababi (amfani da harshen taka-tsantsan kamar "zai iya zama", "yana iya nuna"), da kuma BADA SHAWARAR KWARARREN da ya dace.
        
        DOLE ne ka yi ƙoƙarin bada shawarar ɗaya daga cikin kwararrun masu zuwa idan ya dace:
        - General Practitioner (Likitan Gaba ɗaya)
        - Cardiologist (Likitan Zuciya)
        - Dermatologist (Likitan Fata)
        - Pediatrician (Likitan Yara)
        - Psychiatrist (Likitan Kwakwalwa)
        - Orthopedic (Likitan Kashi)
        
        MUHIMMAN DOKOKI:
        1. DISCLAIMER: Koyaushe fara ko kawo karshen babban shawara tare da gajeren tunatarwa cewa kai AI ne kuma wannan ba binciken likita ba ne.
        2. TRIAGE: Idan alamun suna barazana ga rayuwa (misali, matsanancin ciwon kirji, wahalar numfashi), gaya wa mai amfani nan take ya kira sabis na gaggawa.
        3. FORMAT: Tabbatar martani ya zama takaitacce kuma mai sauƙin karantawa.
        4. Harshe: Yi amfani da harshen Hausa mai sauƙi da girmamawa.`
  };

  try {
    const chat: Chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemInstructions[language],
        temperature: 0.7,
      },
      history: history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      }))
    });

    const result = await chat.sendMessageStream({ message: newMessage });

    for await (const chunk of result) {
       // Correctly casting the chunk to access .text
       const c = chunk as GenerateContentResponse;
       if (c.text) {
         yield c.text;
       }
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    yield language === 'ha' 
      ? "Ina fuskantar matsala wajen sarrafa wannan a halin yanzu. Da fatan za a gwada anjima."
      : "I'm having trouble processing that right now. Please try again later.";
  }
};
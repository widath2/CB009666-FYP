import { NextRequest, NextResponse } from "next/server";
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Simple rule-based text simplification as fallback
function simpleTextSimplification(text: string): string {
  // Common word replacements for dyslexia-friendly text
  const wordReplacements: { [key: string]: string } = {
    'utilize': 'use',
    'terminate': 'end',
    'assist': 'help',
    'commence': 'start',
    'demonstrate': 'show',
    'participate': 'take part',
    'accomplish': 'finish',
    'facilitate': 'help',
    'numerous': 'many',
    'sufficient': 'enough',
    'establish': 'set up',
    'implement': 'do',
    'obtain': 'get',
    'acquire': 'get',
    'purchase': 'buy',
    'endeavor': 'try',
    'attempt': 'try',
    'approximately': 'about',
    'furthermore': 'also',
    'however': 'but',
    'therefore': 'so',
    'subsequently': 'then',
    'previously': 'before',
    'currently': 'now',
    'immediately': 'right away'
  };

  let simplifiedText = text;
  
  // Replace complex words with simpler ones
  Object.entries(wordReplacements).forEach(([complex, simple]) => {
    const regex = new RegExp(`\\b${complex}\\b`, 'gi');
    simplifiedText = simplifiedText.replace(regex, simple);
  });
  
  // Break long sentences (more than 20 words) into shorter ones
  const sentences = simplifiedText.split(/[.!?]+/);
  const processedSentences = sentences.map(sentence => {
    const words = sentence.trim().split(/\s+/);
    if (words.length > 20) {
      // Try to find a natural breaking point
      const midPoint = Math.floor(words.length / 2);
      const firstHalf = words.slice(0, midPoint).join(' ').trim();
      const secondHalf = words.slice(midPoint).join(' ').trim();
      return firstHalf + (firstHalf ? '.' : '') + ' ' + secondHalf;
    }
    return sentence.trim();
  });
  
  return processedSentences.join('. ').replace(/\.\s*\./g, '.').trim() + '.';
}

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    console.log("Starting text simplification...");
    console.log("OpenAI API Key present:", !!process.env.OPENAI_API_KEY);

    // Try OpenAI first, fallback to simple replacement if API key issues
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith('sk-')) {
      try {
        // Use OpenAI to simplify text for dyslexic readers with word tracking
        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `You are an expert in making text accessible for people with dyslexia. Your task is to simplify complex words and sentences while maintaining all important information.

WORD SIMPLIFICATION EXAMPLES:
- "terminate" → "end"
- "assist" → "help" 
- "commence" → "start"
- "utilize" → "use"
- "demonstrate" → "show"
- "participate" → "take part"
- "accomplish" → "finish"
- "facilitate" → "help"
- "numerous" → "many"
- "sufficient" → "enough"

SENTENCE SIMPLIFICATION EXAMPLES:
- "The teacher asked me to assist with arranging the chairs" → "The teacher asked me to help with arranging the chairs"
- "Students are required to demonstrate proficiency" → "Students must show they can do it well"

GUIDELINES:
1. Replace complex words with simple, common alternatives
2. Keep the exact same meaning
3. Break very long sentences into shorter ones
4. Use active voice instead of passive voice
5. Remove unnecessary jargon
6. Maintain all important information
7. Keep paragraphs short and clear

Return ONLY the simplified text. Do not add explanations or notes.`
            },
            {
              role: "user",
              content: `Please simplify this text for someone with dyslexia by replacing complex words with simpler ones:\n\n${text}`
            }
          ],
          max_tokens: 2000,
          temperature: 0.2,
        });

        const simplifiedText = completion.choices[0]?.message?.content;

        if (!simplifiedText) {
          throw new Error("No response from OpenAI");
        }

        console.log("OpenAI text simplification completed");
        return NextResponse.json({ simplifiedText });
        
      } catch (openaiError) {
        console.error("OpenAI error:", openaiError);
        console.log("Falling back to simple text replacement...");
        
        // Fallback to simple replacement
        const simplifiedText = simpleTextSimplification(text);
        console.log("Simple text simplification completed");
        
        return NextResponse.json({ 
          simplifiedText,
          fallback: true,
          message: "Used basic simplification (OpenAI unavailable)"
        });
      }
    } else {
      // No API key or invalid format, use simple replacement
      console.log("No valid OpenAI API key, using simple text replacement...");
      const simplifiedText = simpleTextSimplification(text);
      console.log("Simple text simplification completed");
      
      return NextResponse.json({ 
        simplifiedText,
        fallback: true,
        message: "Used basic simplification (no OpenAI API key)"
      });
    }

  } catch (error) {
    console.error("Simplification error:", error);
    return NextResponse.json(
      { error: "Failed to simplify text. Please try again." },
      { status: 500 }
    );
  }
}

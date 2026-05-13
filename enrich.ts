import { GoogleGenAI, Type } from "@google/genai";
import fs from "fs";
import { fitnessExercises } from "./data/fitnessData";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function enrichExercises() {
  const updatedExercises = [];
  
  for (const ex of fitnessExercises) {
    if (ex.coaching_cues && ex.coaching_cues.length > 0) {
      updatedExercises.push(ex);
      continue;
    }

    console.log(`Enriching ${ex.name}...`);
    
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-preview",
        contents: `Provide detailed fitness information for the exercise: "${ex.name}".
        Return a JSON object with the following fields:
        - primary_discipline: "fitness"
        - category: (e.g., "Strength Training", "Core", "Cardio")
        - exercise_type: (e.g., "Compound", "Isolation", "Isometric")
        - coaching_cues: Array of 5 short coaching tips.
        - common_mistakes: Array of 5 common mistakes.
        - breathing: Object with { inhale: string, exhale: string }
        - alternatives: Array of 5 alternative exercises.
        - tags: Array of 5-7 relevant tags (e.g., "Chest", "Push", "Barbell").
        - difficulty: "Beginner", "Intermediate", or "Advanced"
        - equipment: Object with { items: string[], type: "Bodyweight" | "Free weights" | "Machine" | "Equipment" }
        - instruction_steps: Array of 5 objects { step: number, title: string, instruction: string }
        - recommended_sets_reps: Array of 3 objects { level: "Beginner" | "Hypertrophy" | "Strength", recommendation: string }
        - variations: Array of 5 variations.
        - video: A high quality YouTube embed URL for a tutorial (e.g., "https://www.youtube.com/embed/...")
        - thumbnail: A YouTube thumbnail URL for the video (e.g., "https://img.youtube.com/vi/.../maxresdefault.jpg")
        `,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              primary_discipline: { type: Type.STRING },
              category: { type: Type.STRING },
              exercise_type: { type: Type.STRING },
              coaching_cues: { type: Type.ARRAY, items: { type: Type.STRING } },
              common_mistakes: { type: Type.ARRAY, items: { type: Type.STRING } },
              breathing: {
                type: Type.OBJECT,
                properties: {
                  inhale: { type: Type.STRING },
                  exhale: { type: Type.STRING }
                }
              },
              alternatives: { type: Type.ARRAY, items: { type: Type.STRING } },
              tags: { type: Type.ARRAY, items: { type: Type.STRING } },
              difficulty: { type: Type.STRING },
              equipment: {
                type: Type.OBJECT,
                properties: {
                  items: { type: Type.ARRAY, items: { type: Type.STRING } },
                  type: { type: Type.STRING }
                }
              },
              instruction_steps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    step: { type: Type.INTEGER },
                    title: { type: Type.STRING },
                    instruction: { type: Type.STRING }
                  }
                }
              },
              recommended_sets_reps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    level: { type: Type.STRING },
                    recommendation: { type: Type.STRING }
                  }
                }
              },
              variations: { type: Type.ARRAY, items: { type: Type.STRING } },
              video: { type: Type.STRING },
              thumbnail: { type: Type.STRING }
            }
          }
        }
      });

      const data = JSON.parse(response.text.trim());
      
      const enrichedEx = {
        ...ex,
        primary_discipline: data.primary_discipline,
        category: data.category,
        exercise_type: data.exercise_type,
        coaching_cues: data.coaching_cues,
        common_mistakes: data.common_mistakes,
        breathing: data.breathing,
        alternatives: data.alternatives,
        tags: data.tags,
        difficulty: data.difficulty,
        equipment: data.equipment,
        instruction_steps: data.instruction_steps,
        recommended_sets_reps: data.recommended_sets_reps,
        variations: data.variations,
        media: {
          images: ex.media?.images || [],
          video: data.video,
          thumbnail: data.thumbnail
        }
      };
      
      updatedExercises.push(enrichedEx);
    } catch (e) {
      console.error(`Failed to enrich ${ex.name}:`, e);
      updatedExercises.push(ex);
    }
  }

  // Now write back to data/fitnessData.ts
  let fileContent = fs.readFileSync("./data/fitnessData.ts", "utf-8");
  
  // Find the start and end of fitnessExercises
  const startIndex = fileContent.indexOf("export const fitnessExercises: Exercise[] = [");
  const endIndex = fileContent.indexOf("export const fitnessWorkouts: Workout[] = [");
  
  if (startIndex !== -1 && endIndex !== -1) {
    const newArrayString = "export const fitnessExercises: Exercise[] = " + JSON.stringify(updatedExercises, null, 2) + ";\n\n";
    fileContent = fileContent.substring(0, startIndex) + newArrayString + fileContent.substring(endIndex);
    fs.writeFileSync("./data/fitnessData.ts", fileContent);
    console.log("Successfully updated fitnessData.ts");
  } else {
    console.error("Could not find the array bounds in fitnessData.ts");
  }
}

enrichExercises();

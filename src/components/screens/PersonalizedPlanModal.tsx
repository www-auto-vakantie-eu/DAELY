import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { SectionHeader } from '../ui/SharedUI';
import { ICONS } from '../ui/Icons';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import { disciplines } from '../../../data/seedData';

export const PersonalizedPlanModal: React.FC = () => {
  const {
    showPersonalizedPlan,
    setShowPersonalizedPlan,
    personalizedPlan,
    setPersonalizedPlan,
    planGenerating,
    setPlanGenerating,
    streak
  } = useAppContext();

  const userGoals = [
    { label: 'Gewicht', current: 78.5, target: 75, unit: 'kg' },
    { label: 'Lichaamsvet', current: 18, target: 12, unit: '%' },
    { label: 'Spiermassa', current: 62, target: 65, unit: 'kg' }
  ];

  if (!showPersonalizedPlan) return null;

  return (
    <div className="fixed inset-0 z-[2000] bg-white animate-in slide-in-from-bottom-full duration-500 flex flex-col pt-20 px-8 pb-40 overflow-y-auto hide-scrollbar">
      <header className="flex justify-between items-end mb-12">
        <div><p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.5em] mb-2">AI PROTOCOL</p><h1 className="text-5xl font-black tracking-tighter text-zinc-900 leading-none">Persoonlijk Schema</h1></div>
        <button onClick={() => setShowPersonalizedPlan(false)} className="p-6 bg-zinc-100 rounded-full active-scale"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
      </header>
      
      <div className="space-y-10">
        <section>
          <SectionHeader title="Jouw AI Coach" subtitle="Gepersonaliseerd Schema Genereren" />
          <div className="p-8 bg-zinc-50 rounded-[2rem] border border-black/5">
            <p className="text-sm text-zinc-600 mb-6 leading-relaxed">
              Op basis van jouw profielgegevens (Doelen, Activiteitsniveau, Voorkeuren) genereert onze AI een uitgebreid weekschema speciaal voor jou.
            </p>
            
            {!personalizedPlan && !planGenerating && (
              <button 
                onClick={async () => {
                  setPlanGenerating(true);
                  try {
                    // @ts-ignore
                    const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });
                    
                    const prompt = `
                      Generate a personalized weekly fitness and nutrition plan for a user with the following profile:
                      - Goal: ${userGoals.map(g => `${g.label}: ${g.target} ${g.unit}`).join(', ')}
                      - Current Stats: ${userGoals.map(g => `${g.label}: ${g.current} ${g.unit}`).join(', ')}
                      - Activity Level: High (based on streak: ${streak} days)
                      - Interests: ${disciplines.slice(0, 3).map(d => d.name).join(', ')}
                      
                      Please provide a structured plan including:
                      1. Weekly Workout Schedule (Mon-Sun)
                      2. Nutrition Guidelines & Meal Suggestions
                      3. Recovery Protocols
                      
                      Format the output in Markdown and write the response in Dutch.
                    `;
                    
                    const response = await ai.models.generateContent({
                      model: "gemini-3-flash-preview",
                      contents: prompt
                    });
                    setPersonalizedPlan(response.text || "Sorry, ik kon op dit moment geen schema genereren. Probeer het later opnieuw.");
                  } catch (error) {
                    console.error("Error generating plan:", error);
                    setPersonalizedPlan("Sorry, ik kon op dit moment geen schema genereren. Probeer het later opnieuw.");
                  } finally {
                    setPlanGenerating(false);
                  }
                }}
                className="w-full py-4 bg-indigo-600 text-white rounded-xl font-black uppercase tracking-widest shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
              >
                <ICONS.Settings className="w-5 h-5" />
                Genereer Mijn Schema
              </button>
            )}

            {planGenerating && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
                <p className="text-xs font-black text-indigo-600 uppercase tracking-widest animate-pulse">Profiel Analyseren & Schema Genereren...</p>
              </div>
            )}

            {personalizedPlan && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="prose prose-zinc prose-sm max-w-none mb-8">
                  <ReactMarkdown>{personalizedPlan}</ReactMarkdown>
                </div>
                <button 
                  onClick={() => setPersonalizedPlan(null)}
                  className="w-full py-4 bg-zinc-200 text-zinc-900 rounded-xl font-black uppercase tracking-widest hover:bg-zinc-300 transition-colors"
                >
                  Schema Opnieuw Genereren
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

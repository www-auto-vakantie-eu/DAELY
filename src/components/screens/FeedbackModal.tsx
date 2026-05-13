import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Button } from '../ui/SharedUI';
import { ICONS, BASE_ICONS } from '../ui/Icons';

export const FeedbackModal: React.FC = () => {
  const {
    showFeedbackModal,
    setShowFeedbackModal,
    feedbackRating,
    setFeedbackRating,
    feedbackUsability,
    setFeedbackUsability,
    feedbackPrimaryUse,
    setFeedbackPrimaryUse,
    feedbackText,
    setFeedbackText,
    hasSubmittedFeedback,
    setHasSubmittedFeedback,
    showFeedbackSuccess,
    setShowFeedbackSuccess
  } = useAppContext();

  if (!showFeedbackModal) return null;

  return (
    <div className="fixed inset-0 z-[5000] bg-zinc-900/40 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto hide-scrollbar animate-in zoom-in-95 duration-300">
        {!showFeedbackSuccess ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-zinc-900 tracking-tight">Jouw Feedback</h3>
              <button onClick={() => setShowFeedbackModal(false)} className="p-2 bg-zinc-100 rounded-full text-zinc-500 hover:text-zinc-900 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-sm font-bold text-zinc-800 mb-3">Hoe zou je je algemene ervaring beoordelen?</p>
              <div className="flex justify-center gap-2 bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                {[1, 2, 3, 4, 5].map(star => (
                  <button 
                    key={star} 
                    onClick={() => setFeedbackRating(star)}
                    className={`p-2 transition-all duration-200 ${feedbackRating >= star ? 'text-amber-400 scale-110' : 'text-zinc-200 hover:text-amber-200'}`}
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill={feedbackRating >= star ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm font-bold text-zinc-800 mb-3">Hoe makkelijk is het om te vinden wat je zoekt?</p>
              <div className="flex justify-center gap-2 bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                {[1, 2, 3, 4, 5].map(star => (
                  <button 
                    key={star} 
                    onClick={() => setFeedbackUsability(star)}
                    className={`p-2 transition-all duration-200 ${feedbackUsability >= star ? 'text-blue-500 scale-110' : 'text-zinc-200 hover:text-blue-200'}`}
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill={feedbackUsability >= star ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm font-bold text-zinc-800 mb-3">Waarvoor gebruik je de app het meest?</p>
              <div className="flex flex-wrap gap-2">
                {['Workouts', 'Voeding', 'Mindset', 'Community', 'Tracking'].map(use => (
                  <button 
                    key={use}
                    onClick={() => setFeedbackPrimaryUse(use)}
                    className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${feedbackPrimaryUse === use ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'}`}
                  >
                    {use}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-zinc-800 mb-3">Verbeterpunten</label>
              <textarea 
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Wat kunnen we beter doen? Mis je nog functies?"
                className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none resize-none h-24"
              />
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8 flex items-start gap-3">
              <ICONS.Trophy className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-xs font-medium text-blue-800 leading-relaxed">Door je feedback te delen, doe je automatisch mee aan onze maandelijkse prijstrekking!</p>
            </div>

            <Button 
              variant="primary" 
              className="w-full py-4 text-sm"
              disabled={feedbackRating === 0 || feedbackUsability === 0 || !feedbackPrimaryUse}
              onClick={() => {
                if (feedbackRating > 0 && feedbackUsability > 0 && feedbackPrimaryUse) {
                  setShowFeedbackSuccess(true);
                  setTimeout(() => {
                    setShowFeedbackModal(false);
                    setHasSubmittedFeedback(true);
                    setShowFeedbackSuccess(false);
                    setFeedbackRating(0);
                    setFeedbackUsability(0);
                    setFeedbackPrimaryUse('');
                    setFeedbackText('');
                  }, 2500);
                }
              }}
            >
              Feedback Versturen
            </Button>
          </>
        ) : (
          <div className="text-center py-8 animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BASE_ICONS.Check className="w-10 h-10 text-emerald-500" />
            </div>
            <h3 className="text-3xl font-black text-zinc-900 mb-2 tracking-tight">Dankjewel!</h3>
            <p className="text-sm font-medium text-zinc-600 leading-relaxed">Je feedback is succesvol verzonden. Veel succes met de prijstrekking!</p>
          </div>
        )}
      </div>
    </div>
  );
};

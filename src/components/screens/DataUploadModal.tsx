import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { BASE_ICONS } from '../ui/Icons';

export const DataUploadModal: React.FC = () => {
  const {
    showDataUploadModal,
    setShowDataUploadModal,
    dataUploadType,
    setDataUploadType,
    dataUploadAction,
    setDataUploadAction,
    dataUploadFile,
    setDataUploadFile,
    dataUploadSuccess,
    setDataUploadSuccess
  } = useAppContext();

  if (!showDataUploadModal) return null;

  return (
    <div className="fixed inset-0 z-[6000] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full sm:max-w-md rounded-t-[2rem] sm:rounded-[2rem] p-8 animate-in slide-in-from-bottom-8 duration-500">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-2xl font-black tracking-tighter text-zinc-900">Data Uploaden</h3>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">AI Analyse</p>
          </div>
          <button onClick={() => setShowDataUploadModal(false)} className="p-2 bg-zinc-100 rounded-full text-zinc-500 hover:text-zinc-900 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {dataUploadSuccess ? (
          <div className="text-center py-8 animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BASE_ICONS.Check className="w-10 h-10 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-black text-zinc-900 mb-2">Upload Geslaagd!</h3>
            <p className="text-sm font-medium text-zinc-600 mb-8">Je data wordt nu geanalyseerd door de AI.</p>
            <button 
              onClick={() => {
                setShowDataUploadModal(false);
                setDataUploadSuccess(false);
                setDataUploadFile(null);
              }}
              className="w-full p-4 bg-zinc-900 text-white rounded-xl font-black uppercase tracking-widest active-scale"
            >
              Sluiten
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-3">Type Data</label>
              <select 
                value={dataUploadType}
                onChange={(e) => setDataUploadType(e.target.value)}
                className="w-full p-4 bg-zinc-50 border-2 border-zinc-100 rounded-xl font-bold text-sm focus:outline-none focus:border-zinc-900 transition-colors"
              >
                <option value="blood">Bloedonderzoek (PDF/JPG)</option>
                <option value="dexa">DEXA Scan (PDF/JPG)</option>
                <option value="dna">DNA Profiel (PDF/CSV)</option>
                <option value="wearable">Wearable Export (CSV)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-3">Actie</label>
              <select 
                value={dataUploadAction}
                onChange={(e) => setDataUploadAction(e.target.value)}
                className="w-full p-4 bg-zinc-50 border-2 border-zinc-100 rounded-xl font-bold text-sm focus:outline-none focus:border-zinc-900 transition-colors"
              >
                <option value="adjust_plan">Pas mijn schema aan op deze data</option>
                <option value="save_only">Alleen opslaan voor later</option>
                <option value="analyze">Analyseer en geef inzichten</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-3">Bestand</label>
              <div className="relative">
                <input 
                  type="file" 
                  onChange={(e) => setDataUploadFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="w-full p-8 border-2 border-dashed border-zinc-200 rounded-xl flex flex-col items-center justify-center text-center bg-zinc-50">
                  <BASE_ICONS.Upload className="w-8 h-8 text-zinc-400 mb-3" />
                  <span className="text-sm font-bold text-zinc-900">
                    {dataUploadFile ? dataUploadFile.name : 'Klik of sleep om een bestand te uploaden'}
                  </span>
                  <span className="text-xs font-medium text-zinc-500 mt-1">PDF, JPG, PNG of CSV (max 10MB)</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => {
                if (dataUploadFile) {
                  // Simulate upload
                  setTimeout(() => setDataUploadSuccess(true), 1000);
                } else {
                  alert('Selecteer eerst een bestand om te uploaden.');
                }
              }}
              className={`w-full p-4 rounded-xl font-black uppercase tracking-widest transition-colors ${dataUploadFile ? 'bg-emerald-500 text-white active-scale hover:bg-emerald-600' : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'}`}
            >
              Upload & Verwerk
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

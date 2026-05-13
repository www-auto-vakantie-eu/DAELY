import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { BASE_ICONS } from '../ui/Icons';
import { Card } from '../ui/SharedUI';
import { meditations } from '../../../data/seedData';
import { getGenderedImage } from '../../utils/imageUtils';

export const MindScreen: React.FC = () => {
  const { t } = useTranslation();
  
  const MIND_CATEGORIES = useMemo(() => [
    { name: t('mind.categories.signature_methods'), id: 'Signature Methods', image: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=800' },
    { name: t('mind.categories.focus'), id: 'Focus', image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=800' },
    { name: t('mind.categories.recovery'), id: 'Recovery', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800' },
    { name: t('mind.categories.sleep'), id: 'Sleep', image: 'https://images.unsplash.com/photo-1511295742362-92c96b124e52?q=80&w=800' },
    { name: t('mind.categories.pre_game'), id: 'Pre-Game', image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=800' }
  ], [t]);

  const SIGNATURE_METHODS = [
    { id: 'wim-hof-1', title: 'The Wim Hof Method', author: 'Wim Hof', duration: `11 ${t('mind.mins')}`, image: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=800' },
    { id: 'huberman-1', title: 'NSDR Protocol', author: 'Andrew Huberman', duration: `10 ${t('mind.mins')}`, image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=800' },
    { id: 'goggins-1', title: 'The Cookie Jar', author: 'David Goggins', duration: `15 ${t('mind.mins')}`, image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=800' }
  ];

  const {
    selectedMindCategory,
    setSelectedMindCategory,
    setSelectedSignatureMethod,
    setIsPlayingSignatureMethod,
    setSelectedMeditation,
    contentGenderPreference
  } = useAppContext();

  return (
    <div className="px-6 pb-40 pt-16 animate-in fade-in duration-500">
      {selectedMindCategory === 'All' ? (
        <>
          <header className="mb-12"><h1 className="text-6xl font-black tracking-tighter text-gradient mb-4">{t('mind.title')}</h1><p className="text-zinc-500 text-sm font-medium tracking-tight">{t('mind.subtitle')}</p></header>
          <div className="grid grid-cols-1 gap-4">
            {MIND_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedMindCategory(cat.id)}
                className="relative p-8 rounded-[2rem] text-left active-scale group overflow-hidden h-32"
              >
                <img src={getGenderedImage(cat.image, contentGenderPreference, 'mind')} alt={cat.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/80 to-zinc-950/20" />
                <div className="relative z-10 flex justify-between items-center h-full">
                  <span className="text-xl font-black text-white tracking-tight">{cat.name}</span>
                  <BASE_ICONS.ChevronRight className="w-6 h-6 text-white/50 group-hover:text-white transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </>
      ) : selectedMindCategory === 'Signature Methods' ? (
        <div className="animate-in slide-in-from-right duration-300">
          <button onClick={() => setSelectedMindCategory('All')} className="mb-8 flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            <span className="text-xs font-black uppercase tracking-widest">{t('mind.back_to_categories')}</span>
          </button>
          <header className="mb-8"><h2 className="text-4xl font-black tracking-tighter text-zinc-900">{t('mind.categories.signature_methods')}</h2></header>
          <div className="grid grid-cols-1 gap-4">
            {SIGNATURE_METHODS.map(method => (
              <Card key={method.id} noPadding onClick={() => { setSelectedSignatureMethod(method); setIsPlayingSignatureMethod(true); }} className="relative aspect-[16/9] group active-scale shadow-lg overflow-hidden border-none cursor-pointer">
                <img src={getGenderedImage(method.image, contentGenderPreference, 'mind')} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt={method.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">{method.author}</p>
                  <h4 className="text-2xl font-black leading-tight mb-2">{method.title}</h4>
                  <p className="text-xs font-bold opacity-70 uppercase">{method.duration}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="animate-in slide-in-from-right duration-300">
          <button onClick={() => setSelectedMindCategory('All')} className="mb-8 flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            <span className="text-xs font-black uppercase tracking-widest">{t('mind.back_to_categories')}</span>
          </button>
          <header className="mb-8"><h2 className="text-4xl font-black tracking-tighter text-zinc-900">{MIND_CATEGORIES.find(c => c.id === selectedMindCategory)?.name || selectedMindCategory}</h2></header>
          <div className="grid grid-cols-2 gap-4">
            {meditations.filter(m => m.category === selectedMindCategory).map(m => (
              <Card key={m.id} noPadding onClick={() => setSelectedMeditation(m)} className="relative aspect-square group active-scale shadow-lg overflow-hidden border-none">
                <img src={getGenderedImage(m.image || "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=400", contentGenderPreference, 'mind')} className="absolute inset-0 w-full h-full object-cover" alt={m.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h4 className="text-sm font-black leading-tight mb-1">{m.title}</h4>
                  <p className="text-[8px] font-bold opacity-60 uppercase">{m.duration_min} {t('mind.mins')}</p>
                </div>
              </Card>
            ))}
            {meditations.filter(m => m.category === selectedMindCategory).length === 0 && (
                <div className="col-span-2 py-12 text-center text-zinc-400 text-sm font-medium">{t('mind.no_sessions')}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

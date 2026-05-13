import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { Card, CustomBadge } from '../ui/SharedUI';
import { getGenderedImage } from '../../utils/imageUtils';
import type { Creator } from '../../../types';
import { fetchCreators, getPreferredCountry } from '../../services/contentApi';

export const CommunityScreen: React.FC = () => {
  const { t } = useTranslation();
  const { setSelectedCreator, contentGenderPreference, setActiveTab, setAthleteSubTab } = useAppContext();
  const [creators, setCreators] = useState<Creator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [country] = useState(() => getPreferredCountry());

  useEffect(() => {
    let isMounted = true;

    const loadCreators = async () => {
      try {
        setError('');
        const data = await fetchCreators(country);
        if (isMounted) {
          setCreators(data);
        }
      } catch (err) {
        console.error('Failed to load creators:', err);
        if (isMounted) {
          setError('Community content kon niet worden geladen.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadCreators();

    return () => {
      isMounted = false;
    };
  }, [country]);

  return (
    <div className="px-6 pb-40 pt-16 animate-in fade-in duration-500">
      <header className="mb-12"><h1 className="text-6xl font-black tracking-tighter text-gradient mb-4">{t('community.title')}</h1><p className="text-zinc-500 text-sm font-medium tracking-tight">{t('community.subtitle')}</p></header>
      <div className="flex gap-3 mb-8">
        <button
          onClick={() => {
            setAthleteSubTab('PARTNERS');
            setActiveTab('Athlete');
          }}
          className="flex-1 py-3 rounded-2xl bg-zinc-100 text-zinc-700 text-xs font-black uppercase tracking-widest border border-zinc-200 hover:bg-zinc-200 transition-colors active-scale"
        >
          Partners
        </button>
        <button
          onClick={() => {
            setAthleteSubTab('Events');
            setActiveTab('Athlete');
          }}
          className="flex-1 py-3 rounded-2xl bg-blue-50 text-blue-700 text-xs font-black uppercase tracking-widest border border-blue-200 hover:bg-blue-100 transition-colors active-scale"
        >
          Events
        </button>
      </div>
      <div className="space-y-6">
        {isLoading && (
          <Card className="p-6 text-sm font-semibold text-zinc-500 border border-black/5">
            Community wordt geladen...
          </Card>
        )}
        {!isLoading && error && (
          <Card className="p-6 text-sm font-semibold text-red-600 border border-red-100 bg-red-50">
            {error}
          </Card>
        )}
         {creators.map(c => (
            <Card key={c.id} onClick={() => setSelectedCreator(c)} className="flex items-center gap-6 p-8 border border-black/5 active-scale cursor-pointer">
               <div className="w-24 h-24 rounded-full accent-gradient p-1"><img src={getGenderedImage(c.image, contentGenderPreference, 'workout')} className="w-full h-full rounded-full object-cover border-4 border-white" alt={c.name} /></div>
               <div><div className="flex items-center gap-2 mb-2"><h3 className="text-2xl font-black tracking-tighter">{c.name}</h3>{c.verified && <span className="text-blue-500 text-lg">✓</span>}</div><p className="text-xs text-zinc-500 font-medium mb-3">{c.specialty}</p><CustomBadge level={c.level} /></div>
            </Card>
         ))}
      </div>
    </div>
  );
};

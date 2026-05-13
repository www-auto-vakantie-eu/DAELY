
import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { Card, SectionHeader, Button } from '../ui/SharedUI';
import { BASE_ICONS } from '../ui/Icons';

const PartnerScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { partners } = useAppContext();
  const partner = partners.find((p) => p.id === id);

  if (!partner) {
    return (
      <div className="p-8">
        <Card className="p-8 text-center text-red-600 font-bold">Partner niet gevonden</Card>
      </div>
    );
  }

  // Dummy producten, vervang met echte data indien beschikbaar
  const products = [
    { name: 'Product 1', description: 'Beschrijving van product 1' },
    { name: 'Product 2', description: 'Beschrijving van product 2' },
  ];

  return (
    <div className="p-8 max-w-xl mx-auto">
      <SectionHeader title={partner.name} />
      <Card className="p-8 flex flex-col items-center text-center mb-8">
        <div className="w-24 h-24 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center overflow-hidden p-2 shadow-sm mb-4">
          <img src={`https://www.google.com/s2/favicons?domain=${partner.domain}&sz=128`} alt={partner.name} className="w-full h-full object-contain rounded-lg" />
        </div>
        <h2 className="text-2xl font-black mb-2">{partner.name}</h2>
        <p className="text-zinc-500 mb-4">Categorie: {partner.category}</p>
      </Card>

      <SectionHeader title="Producten" />
      <div className="grid gap-4 mb-8">
        {products.map((product, idx) => (
          <Card key={idx} className="p-6 text-left">
            <h3 className="font-bold text-lg mb-1">{product.name}</h3>
            <p className="text-zinc-500 text-sm">{product.description}</p>
          </Card>
        ))}
      </div>

      <Button variant="primary" className="w-full py-4 text-base font-bold flex items-center justify-center gap-2">
        <BASE_ICONS.Users className="w-5 h-5" />
        Influencer samenwerkingen
      </Button>
    </div>
  );
};

export default PartnerScreen;

import { useState } from 'react';
import { X } from 'lucide-react';

const PromoBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-accent text-accent-foreground relative">
      <div className="container mx-auto px-4 py-2.5">
        <p className="text-center text-sm font-medium pr-8">
          🎉 Lancement : <span className="font-semibold">-20%</span> sur votre première commande avec le code{' '}
          <span className="font-bold">BIENVENUE20</span>
        </p>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-accent-foreground/10 rounded-full transition-colors"
        aria-label="Fermer"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default PromoBanner;

import React, { useState } from 'react';
import { Gift, Sparkles, RefreshCw } from 'lucide-react';
import { DecodedSecret } from '../types';

interface Props {
  data: DecodedSecret;
}

const ParticipantReveal: React.FC<Props> = ({ data }) => {
  const [isRevealed, setIsRevealed] = useState(false);

  const handleReveal = () => {
    setIsRevealed(true);
  };

  return (
    <div className="w-full animate-pop">
      {/* Wrapper Estilizado */}
      <div className={`
        relative overflow-hidden rounded-[20px] shadow-[0_10px_30px_rgba(212,47,47,0.3)] 
        transition-all duration-700
        ${isRevealed ? 'bg-gradient-to-br from-festive-red to-festive-redDark' : 'bg-white border-t-[5px] border-festive-red'}
      `}>
        
        {!isRevealed ? (
          <div className="p-10 flex flex-col items-center text-center">
             <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-sm font-semibold mb-2">
                    Amigo Secreto
                </span>
                <h1 className="text-3xl font-bold text-gray-800">
                  Olá, <span className="text-festive-red">{data.giver}</span>!
                </h1>
             </div>
            
            <p className="text-gray-600 mb-8 max-w-xs mx-auto text-lg">
              Seu amigo secreto já foi sorteado. Clique na caixa abaixo para ver quem você tirou!
            </p>

            <button
              onClick={handleReveal}
              className="group relative cursor-pointer transform transition-all hover:scale-105 active:scale-95 focus:outline-none"
            >
              <Gift className="w-40 h-40 text-festive-green drop-shadow-lg" strokeWidth={1} />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-xs py-1 px-3 rounded-full whitespace-nowrap">
                  Clique para abrir
              </div>
            </button>
          </div>
        ) : (
          <div className="p-12 flex flex-col items-center text-center text-white relative">
            {/* Elementos Decorativos de Fundo */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
                 <div className="absolute top-10 left-10 text-4xl animate-bounce-slow">❄</div>
                 <div className="absolute bottom-10 right-10 text-5xl animate-bounce-slow" style={{animationDelay: '1s'}}>🎄</div>
            </div>

            <div className="z-10 animate-pop">
                <div className="flex justify-center mb-6">
                    <Sparkles className="w-16 h-16 text-festive-gold animate-spin" style={{animationDuration: '3s'}} />
                </div>
                
                <h2 className="text-xl font-medium text-white/90 mb-4 uppercase tracking-widest">
                  Você tirou:
                </h2>
                
                <h1 className="text-5xl sm:text-6xl font-extrabold text-festive-gold drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] mb-8 break-words leading-tight">
                  {data.receiver}
                </h1>

                <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-xl">
                  <p className="text-white/90 font-medium text-sm">
                    🤫 Shhh! Guarde segredo até o dia da festa!
                  </p>
                </div>
            </div>
            
            <div className="mt-10 z-10">
                <a 
                  href="/" 
                  className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm hover:underline transition-colors"
                >
                    <RefreshCw className="w-3 h-3" /> Realizar novo sorteio
                </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticipantReveal;
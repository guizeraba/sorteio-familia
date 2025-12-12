import React, { useState } from 'react';
import { Share2, Users, Gift, Check, RefreshCw, Trash2, Copy, Coffee } from 'lucide-react';
import { performDraw, encodeSecret } from '../utils';
import { ParticipantLink } from '../types';

const AdminPanel: React.FC = () => {
  const [inputNames, setInputNames] = useState('');
  const [links, setLinks] = useState<ParticipantLink[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [pixCopied, setPixCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pixKey = "a3f00eec-93e8-4d5b-a813-0286fac72d1c";

  const handleDraw = () => {
    const names = inputNames
      .split('\n')
      .map(n => n.trim())
      .filter(n => n.length > 0);

    // Remove nomes duplicados
    const uniqueNames = Array.from(new Set(names)) as string[];

    if (uniqueNames.length < 2) {
      setError('Você precisa de pelo menos 2 participantes para realizar o sorteio!');
      return;
    }

    if (uniqueNames.length !== names.length) {
      setError('Nomes duplicados foram removidos automaticamente.');
    } else {
      setError(null);
    }

    const results = performDraw(uniqueNames);
    
    // Pega a URL base limpa (sem query strings ou hashes antigos) para evitar duplicação
    const baseUrl = window.location.href.split(/[?#]/)[0].replace(/\/$/, '');

    // Gera os links individuais
    const generatedLinks = results.map(result => {
      const secret = encodeSecret(result);
      // Constrói URL absoluta correta para envio (WhatsApp/Email precisam de link completo)
      const url = `${baseUrl}/#/?secret=${encodeURIComponent(secret)}`;
      return {
        name: result.giver,
        url: url
      };
    });

    setLinks(generatedLinks);
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Falha ao copiar', err);
    }
  };

  const copyPixToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(pixKey);
      setPixCopied(true);
      setTimeout(() => setPixCopied(false), 2000);
    } catch (err) {
      console.error('Falha ao copiar Pix', err);
    }
  };

  const reset = () => {
    setLinks([]);
    setError(null);
    setInputNames('');
    setPixCopied(false);
  };

  return (
    <div className="w-full bg-white rounded-[15px] shadow-[0_4px_12px_rgba(0,0,0,0.1)] border-t-[5px] border-festive-red p-6 sm:p-8 animate-fade-in">
      {/* Cabeçalho */}
      <div className="text-center mb-8">
         <h1 className="text-3xl sm:text-4xl font-extrabold text-festive-red mb-2 font-sans tracking-tight">
           Amigo Secreto Festivo 🎁
         </h1>
         <p className="text-gray-600">
           Organize seu sorteio à distância. Você gera os links, mas não sabe quem tirou quem!
         </p>
      </div>

      <div>
        {links.length === 0 ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-festive-green font-bold text-xl justify-center">
                <Users className="w-6 h-6" />
                Quem vai participar?
              </label>
              <p className="text-sm text-gray-500 text-center">Digite um nome por linha</p>
              <textarea
                value={inputNames}
                onChange={(e) => setInputNames(e.target.value)}
                placeholder="Maria&#10;João&#10;Ana&#10;Pedro"
                className="w-full h-48 p-4 bg-[#f9f9f9] border-2 border-gray-200 rounded-xl focus:border-festive-green focus:ring-0 focus:shadow-[0_0_5px_rgba(46,125,50,0.5)] outline-none transition-all resize-none text-gray-800 text-lg font-medium"
              />
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-festive-red p-4 rounded text-festive-red font-medium">
                {error}
              </div>
            )}

            <button
              onClick={handleDraw}
              className="w-full bg-gradient-to-br from-festive-green to-festive-greenLight hover:from-festive-greenLight hover:to-[#43a047] text-white text-xl font-bold py-4 rounded-xl shadow-md transform transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
            >
              <Gift className="w-6 h-6" />
              Realizar Sorteio
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-100 pb-4">
                <h2 className="text-2xl font-bold text-festive-green text-center sm:text-left">
                  Lista de Sorteio Pronta!
                </h2>
                <button 
                  onClick={reset}
                  className="text-gray-400 hover:text-festive-red transition-colors flex items-center gap-1 text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" /> Recomeçar
                </button>
              </div>
              
              <div className="bg-green-50 border-l-4 border-festive-green p-4 rounded-r-lg text-sm text-green-800">
                 <strong>Instruções:</strong> Envie o link específico para cada pessoa (WhatsApp, E-mail, etc). 
                 <br/><span className="font-bold text-festive-red">Não abra os links você mesmo</span> ou estragará a surpresa!
              </div>

              <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                {links.map((link, idx) => (
                  <div 
                    key={idx} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-festive-red/10 flex items-center justify-center text-festive-red font-bold">
                        {link.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="overflow-hidden">
                        <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Link para</span>
                        <p className="text-lg font-bold text-gray-800 truncate">{link.name}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => copyToClipboard(link.url, idx)}
                      className={`
                        flex items-center justify-center gap-2 px-4 py-2 sm:px-5 sm:py-3 rounded-lg font-bold transition-all w-full sm:w-auto text-sm sm:text-base whitespace-nowrap
                        ${copiedIndex === idx 
                          ? 'bg-green-100 text-green-700 shadow-inner' 
                          : 'bg-gray-100 hover:bg-festive-green hover:text-white text-gray-700'}
                      `}
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-4 h-4" /> Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" /> Copiar Link
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Área de Doação / Monetização */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6 text-center shadow-sm mt-8 animate-fade-in">
              <div className="flex justify-center mb-3">
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Coffee className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Gostou? Pague um café para o dev! ☕</h3>
              <p className="text-gray-600 text-sm mb-5 max-w-md mx-auto leading-relaxed">
                Este site é gratuito e seguro. Se ele salvou seu Natal, considere fazer uma doação de qualquer valor via Pix.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-lg mx-auto bg-white p-2 rounded-lg border border-yellow-100 shadow-sm">
                <code className="px-3 py-2 text-gray-600 font-mono text-sm break-all w-full sm:w-auto text-center bg-gray-50 rounded">
                  {pixKey}
                </code>
                <button
                  onClick={copyPixToClipboard}
                  className={`
                    w-full sm:w-auto px-4 py-2 rounded-md font-bold text-sm flex items-center justify-center gap-2 transition-all whitespace-nowrap
                    ${pixCopied 
                      ? 'bg-green-500 text-white' 
                      : 'bg-yellow-400 hover:bg-yellow-500 text-yellow-900'}
                  `}
                >
                  {pixCopied ? (
                    <><Check className="w-4 h-4" /> Copiado!</>
                  ) : (
                    <><Copy className="w-4 h-4" /> Copiar Chave Pix</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
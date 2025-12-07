import React, { useEffect, useState } from 'react';
import AdminPanel from './components/AdminPanel';
import ParticipantReveal from './components/ParticipantReveal';
import { AppMode, DecodedSecret } from './types';
import { decodeSecret } from './utils';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.ADMIN);
  const [secretData, setSecretData] = useState<DecodedSecret | null>(null);

  useEffect(() => {
    // Roteamento simples baseado em hash para determinar o estado
    const handleHashChange = () => {
      const hash = window.location.hash;
      // Extrai parâmetros após o '?' no hash
      const queryPart = hash.split('?')[1];
      const params = new URLSearchParams(queryPart);
      const secret = params.get('secret');

      if (secret) {
        const decoded = decodeSecret(secret);
        if (decoded && decoded.giver && decoded.receiver) {
          setSecretData(decoded);
          setMode(AppMode.PARTICIPANT);
        } else {
          // Segredo inválido, volta para admin
          window.location.hash = '';
          setMode(AppMode.ADMIN);
        }
      } else {
        setMode(AppMode.ADMIN);
      }
    };

    // Verifica ao montar
    handleHashChange();

    // Ouve mudanças
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="min-h-screen font-sans flex flex-col items-center justify-center p-4 sm:p-6">
      
      <main className="w-full max-w-2xl z-10 flex flex-col items-center justify-center min-h-[60vh]">
        {mode === AppMode.ADMIN && <AdminPanel />}
        {mode === AppMode.PARTICIPANT && secretData && <ParticipantReveal data={secretData} />}
      </main>

      <footer className="mt-12 text-center text-gray-500 text-sm font-medium">
        <p>© {new Date().getFullYear()} Amigo Secreto Festivo. Simples, Gratuito e Seguro.</p>
      </footer>
    </div>
  );
};

export default App;
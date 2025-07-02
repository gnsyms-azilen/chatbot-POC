import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import ChatInterface from './components/ChatInterface';

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'chat'>('chat');
  const [initialQuery, setInitialQuery] = useState<string>('');

  const handleStartChat = (query: string) => {
    setInitialQuery(query);
    setCurrentView('chat');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
    setInitialQuery('');
  };

  return (
    <div className="min-h-screen bg-secondary-50 font-inter">
      {currentView === 'landing' ? (
        <LandingPage onStartChat={handleStartChat} />
      ) : (
        <ChatInterface 
          initialQuery={initialQuery} 
          onBackToLanding={handleBackToLanding}
        />
      )}
    </div>
  );
}

export default App;
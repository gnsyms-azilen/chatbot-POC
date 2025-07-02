import React, { useState } from 'react';
import { Mic, Send, Bot } from 'lucide-react';
import ServiceFilter from './chat/ServiceFilter';

interface LandingPageProps {
  onStartChat: (query: string, services?: string[]) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartChat }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onStartChat(query.trim(), selectedServices);
    }
  };

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    // Voice input would be implemented here
  };

  const handleQuickStart = (suggestion: string) => {
    // Auto-select relevant services based on the suggestion
    let autoServices: string[] = [];
    
    if (suggestion.includes('freelancer')) {
      autoServices = ['self-employed', 'deductions'];
    } else if (suggestion.includes('quarterly')) {
      autoServices = ['self-employed', 'payments'];
    } else if (suggestion.includes('deductions')) {
      autoServices = ['deductions'];
    }
    
    onStartChat(suggestion, autoServices);
  };

  const maxChars = 200;
  const remainingChars = maxChars - query.length;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-secondary-50 via-white to-primary-50">
      <div className="w-full max-w-4xl mx-auto text-center">
        {/* Logo and Branding */}
        <div className="mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-primary-600 p-4 rounded-2xl shadow-lg">
              <Bot className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-800 mb-4">
            Tax<span className="text-primary-600">Bot</span>
          </h1>
          <p className="text-xl md:text-2xl text-secondary-600 font-medium mb-2">
            Your AI Tax & Finance Assistant
          </p>
          <p className="text-base md:text-lg text-secondary-500">
            Powered by Official IRS Data
          </p>
        </div>

        {/* Search Interface */}
        <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto mb-8 space-y-4">
          {/* Service Filter */}
          <ServiceFilter
            selectedServices={selectedServices}
            onServicesChange={setSelectedServices}
          />

          {/* Query Input */}
          <div className={`relative group transition-all duration-300 ${
            isFocused ? 'transform scale-[1.02]' : ''
          }`}>
            <div className={`absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 rounded-2xl blur-xl opacity-20 transition-opacity duration-300 ${
              isFocused ? 'opacity-40' : ''
            }`}></div>
            
            <div className="relative bg-white rounded-2xl shadow-xl border border-secondary-200 overflow-hidden">
              <div className="flex items-center p-2">
                <div className="flex-1 relative">
                  <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Ask any tax or finance question..."
                    className="w-full px-6 py-4 text-lg resize-none border-none outline-none bg-transparent text-secondary-800 placeholder-secondary-400 max-h-32"
                    rows={1}
                    maxLength={maxChars}
                    style={{ 
                      height: 'auto',
                      minHeight: '56px'
                    }}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = 'auto';
                      target.style.height = Math.min(target.scrollHeight, 128) + 'px';
                    }}
                  />
                </div>
                
                <div className="flex items-center gap-2 px-2">
                  <button
                    type="button"
                    onClick={handleVoiceInput}
                    className={`p-3 rounded-xl transition-all duration-200 ${
                      isListening 
                        ? 'bg-red-100 text-red-600 animate-pulse' 
                        : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
                    }`}
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                  
                  <button
                    type="submit"
                    disabled={!query.trim()}
                    className="p-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-4 px-2 text-sm">
            <div className="text-secondary-500">
              Press Enter to submit, Shift+Enter for new line
            </div>
            <div className={`transition-colors duration-200 ${
              remainingChars < 20 ? 'text-red-500' : 'text-secondary-500'
            }`}>
              {remainingChars} characters remaining
            </div>
          </div>
        </form>

        {/* Quick Start Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-16">
          {[
            "What tax deductions can I claim as a freelancer?",
            "How do I calculate quarterly estimated taxes?",
            "What's the difference between standard and itemized deductions?"
          ].map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleQuickStart(suggestion)}
              className="p-4 bg-white rounded-xl border border-secondary-200 text-left hover:border-primary-300 hover:shadow-md transition-all duration-200 group"
            >
              <p className="text-secondary-700 group-hover:text-primary-600 transition-colors duration-200">
                {suggestion}
              </p>
            </button>
          ))}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            {
              title: "IRS-Verified Data",
              description: "Answers backed by official tax codes and regulations"
            },
            {
              title: "Real-time Updates",
              description: "Always current with the latest tax law changes"
            },
            {
              title: "Personalized Advice",
              description: "Tailored recommendations for your specific situation"
            }
          ].map((feature, index) => (
            <div key={index} className="text-center">
              <h3 className="text-lg font-semibold text-secondary-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-secondary-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
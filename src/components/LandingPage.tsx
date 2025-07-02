import React, { useState } from 'react';
import { Mic, Send, Bot, Filter, X, Settings, User } from 'lucide-react';
import ServiceModal, { SERVICES } from './chat/ServiceModal';

interface LandingPageProps {
  onStartChat: (query: string, services?: string[]) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartChat }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

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

  const getServiceContext = () => {
    if (selectedServices.length === 0) return '';
    
    const serviceNames = selectedServices.map(id => {
      const service = SERVICES.find(s => s.id === id);
      return service?.name;
    }).filter(Boolean);

    if (serviceNames.length === 1) {
      return ` (${serviceNames[0]} specific)`;
    } else if (serviceNames.length > 1) {
      return ` (${serviceNames.join(', ')} specific)`;
    }
    return '';
  };

  const getSelectedServicesDisplay = () => {
    if (selectedServices.length === 0) return null;
    
    return selectedServices.map(serviceId => {
      const service = SERVICES.find(s => s.id === serviceId);
      if (!service) return null;
      
      const IconComponent = service.icon;
      return (
        <div
          key={serviceId}
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${service.color} transition-all duration-200`}
        >
          <IconComponent className="w-3 h-3" />
          <span>{service.name}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              const newSelected = selectedServices.filter(id => id !== serviceId);
              setSelectedServices(newSelected);
            }}
            className="ml-0.5 hover:bg-black hover:bg-opacity-10 rounded-full p-0.5 transition-colors"
            aria-label={`Remove ${service.name}`}
          >
            <X className="w-2.5 h-2.5" />
          </button>
        </div>
      );
    });
  };

  const handleClearAllServices = () => {
    setSelectedServices([]);
  };

  const maxChars = 200;
  const remainingChars = maxChars - query.length;

  return (
    <div className="min-h-screen flex flex-col bg-secondary-50 font-inter">
      {/* Header */}
      <header className="bg-white border-b border-secondary-200 h-12 flex items-center px-3 shadow-sm">
        <div className="flex items-center justify-between w-full">
          {/* Left Section */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="bg-primary-600 p-1.5 rounded-lg">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-sm font-semibold text-secondary-800">TaxBot</h1>
              </div>
            </div>
          </div>

          {/* Center Section */}
          <div className="hidden md:block flex-1 text-center">
            <h2 className="text-xs font-medium text-secondary-600">
              AI Tax & Finance Assistant
            </h2>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-1">
            <button className="p-1.5 text-secondary-600 hover:text-secondary-800 hover:bg-secondary-100 rounded-lg transition-colors">
              <Settings className="w-4 h-4" />
            </button>
            
            <button className="p-1.5 text-secondary-600 hover:text-secondary-800 hover:bg-secondary-100 rounded-lg transition-colors">
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-3">
        <div className="w-full max-w-3xl mx-auto text-center">
          {/* Logo and Branding */}
          <div className="mb-8">
            <div className="flex items-center justify-center mb-3">
              <div className="bg-primary-600 p-2.5 rounded-xl shadow-md">
                <Bot className="w-5 h-5 text-white" />
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-secondary-800 mb-2">
              Tax<span className="text-primary-600">Bot</span>
            </h1>
            <p className="text-sm md:text-base text-secondary-600 font-medium mb-1">
              AI Tax & Finance Assistant
            </p>
            <p className="text-xs text-secondary-500">
              Powered by Official IRS Data
            </p>
          </div>

          {/* Search Interface */}
          <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mb-6 space-y-4">
            {/* Selected Services Display */}
            {selectedServices.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-1.5 mb-3">
                {getSelectedServicesDisplay()}
                <button
                  type="button"
                  onClick={handleClearAllServices}
                  className="inline-flex items-center gap-0.5 px-2 py-0.5 text-xs font-medium text-secondary-600 hover:text-secondary-800 hover:bg-secondary-100 rounded-full transition-colors"
                >
                  <X className="w-2.5 h-2.5" />
                  Clear All
                </button>
              </div>
            )}

            {/* Query Input */}
            <div className={`relative group transition-all duration-200 ${
              isFocused ? 'transform scale-[1.01]' : ''
            }`}>
              <div className={`absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 rounded-xl blur-lg opacity-10 transition-opacity duration-200 ${
                isFocused ? 'opacity-20' : ''
              }`}></div>
              
              <div className="relative bg-white rounded-xl shadow-lg border border-secondary-200 overflow-hidden">
                <div className="flex items-center p-1.5">
                  <div className="flex-1 relative">
                    <textarea
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      placeholder={`Ask any tax or finance question...${getServiceContext()}`}
                      className="w-full px-4 py-3 pr-20 text-sm resize-none border-none outline-none bg-transparent text-secondary-800 placeholder-secondary-400 max-h-24"
                      rows={1}
                      maxLength={maxChars}
                      style={{ 
                        height: 'auto',
                        minHeight: '44px'
                      }}
                      onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = 'auto';
                        target.style.height = Math.min(target.scrollHeight, 96) + 'px';
                      }}
                    />
                    
                    {/* Service Selector Button */}
                    <button
                      type="button"
                      onClick={() => setIsServiceModalOpen(true)}
                      className={`absolute right-10 top-1/2 transform -translate-y-1/2 p-1.5 rounded-lg transition-all duration-200 ${
                        selectedServices.length > 0
                          ? 'bg-primary-100 text-primary-600'
                          : 'text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100'
                      }`}
                      title="Select service type"
                    >
                      <Filter className="w-3.5 h-3.5" />
                    </button>

                    {/* Voice Input Button */}
                    <button
                      type="button"
                      onClick={handleVoiceInput}
                      className={`absolute right-2.5 top-1/2 transform -translate-y-1/2 p-1.5 rounded-lg transition-all duration-200 ${
                        isListening 
                          ? 'bg-red-100 text-red-600 animate-pulse' 
                          : 'text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100'
                      }`}
                      title="Voice input"
                    >
                      <Mic className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-1.5 px-1.5">
                    <button
                      type="submit"
                      disabled={!query.trim()}
                      className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-2 px-1 text-xs">
              <div className="text-secondary-500">
                Press Enter to submit
              </div>
              <div className={`transition-colors duration-200 ${
                remainingChars < 20 ? 'text-red-500' : 'text-secondary-500'
              }`}>
                {remainingChars} left
              </div>
            </div>
          </form>

          {/* Quick Start Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-3xl mx-auto mb-10">
            {[
              "What tax deductions can I claim as a freelancer?",
              "How do I calculate quarterly estimated taxes?",
              "What's the difference between standard and itemized deductions?"
            ].map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleQuickStart(suggestion)}
                className="p-3 bg-white rounded-lg border border-secondary-200 text-left hover:border-primary-300 hover:shadow-sm transition-all duration-200 group"
              >
                <p className="text-xs text-secondary-700 group-hover:text-primary-600 transition-colors duration-200 leading-relaxed">
                  {suggestion}
                </p>
              </button>
            ))}
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              {
                title: "IRS-Verified Data",
                description: "Answers backed by official tax codes"
              },
              {
                title: "Real-time Updates",
                description: "Always current with latest tax laws"
              },
              {
                title: "Personalized Advice",
                description: "Tailored to your specific situation"
              }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <h3 className="text-sm font-semibold text-secondary-800 mb-1">
                  {feature.title}
                </h3>
                <p className="text-xs text-secondary-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Service Modal */}
      <ServiceModal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        selectedServices={selectedServices}
        onServicesChange={setSelectedServices}
      />
    </div>
  );
};

export default LandingPage;
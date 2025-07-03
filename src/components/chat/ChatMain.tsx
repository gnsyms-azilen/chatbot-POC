import React, { useState } from 'react';
import { Send, Mic, Filter, X } from 'lucide-react';
import MessageBubble from './MessageBubble';
import LoadingDots from './LoadingDots';
import ServiceModal, { SERVICES } from './ServiceModal';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  services?: string[];
  sources?: Array<{
    title: string;
    url: string;
    description: string;
  }>;
}

interface ChatMainProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string, services: string[]) => void;
  toggleSources: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const ChatMain: React.FC<ChatMainProps> = ({ 
  messages, 
  isLoading, 
  onSendMessage, 
  toggleSources,
  messagesEndRef 
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim(), selectedServices);
      setInputValue('');
    }
  };

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    // Voice input implementation would go here
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

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md mx-auto">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Send className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-base font-semibold text-secondary-800 mb-1">
                Ready to help with your tax questions
              </h3>
              <p className="text-sm text-secondary-600">
                Ask me anything about taxes, deductions, filing requirements, or financial planning.
              </p>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <MessageBubble 
            key={message.id} 
            message={message} 
            toggleSources={toggleSources}
            allMessages={messages}
          />
        ))}

        {isLoading && <LoadingDots />}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-secondary-200 p-4 space-y-3">
        {/* Selected Services Display */}
        {selectedServices.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            {getSelectedServicesDisplay()}
            <button
              onClick={handleClearAllServices}
              className="inline-flex items-center gap-0.5 px-2 py-0.5 text-xs font-medium text-secondary-600 hover:text-secondary-800 hover:bg-secondary-100 rounded-full transition-colors"
            >
              <X className="w-2.5 h-2.5" />
              Clear All
            </button>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Ask a follow-up question...${getServiceContext()}`}
              className="w-full px-3 py-2.5 pr-20 border border-secondary-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent max-h-24 text-sm text-secondary-800"
              rows={1}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = Math.min(target.scrollHeight, 96) + 'px';
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
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
          
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="p-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Service Modal */}
        <ServiceModal
          isOpen={isServiceModalOpen}
          onClose={() => setIsServiceModalOpen(false)}
          selectedServices={selectedServices}
          onServicesChange={setSelectedServices}
        />
      </div>
    </div>
  );
};

export default ChatMain;
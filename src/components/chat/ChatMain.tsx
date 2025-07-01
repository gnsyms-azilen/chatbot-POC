import React, { useState } from 'react';
import { Send, Mic } from 'lucide-react';
import MessageBubble from './MessageBubble';
import LoadingDots from './LoadingDots';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  sources?: Array<{
    title: string;
    url: string;
    description: string;
  }>;
}

interface ChatMainProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const ChatMain: React.FC<ChatMainProps> = ({ 
  messages, 
  isLoading, 
  onSendMessage, 
  messagesEndRef 
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    // Voice input implementation would go here
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && !isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md mx-auto">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-800 mb-2">
                Ready to help with your tax questions
              </h3>
              <p className="text-secondary-600">
                Ask me anything about taxes, deductions, filing requirements, or financial planning.
              </p>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {isLoading && <LoadingDots />}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-secondary-200 p-6">
        <form onSubmit={handleSubmit} className="flex items-center gap-4">
          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask a follow-up question..."
              className="w-full px-4 py-3 pr-12 border border-secondary-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent max-h-32 text-secondary-800"
              rows={1}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = Math.min(target.scrollHeight, 128) + 'px';
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-all duration-200 ${
                isListening 
                  ? 'bg-red-100 text-red-600 animate-pulse' 
                  : 'text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100'
              }`}
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>
          
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="p-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        
        {/* <p className="text-xs text-secondary-500 mt-2 text-center">
          Press Enter to send, Shift+Enter for new line
        </p> */}
      </div>
    </div>
  );
};

export default ChatMain;
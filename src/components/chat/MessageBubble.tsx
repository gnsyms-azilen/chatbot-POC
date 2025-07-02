import React, { useState, useEffect } from 'react';
import { Copy, FileText, Share, ThumbsUp, ThumbsDown, User, Bot } from 'lucide-react';
import { SERVICES } from './ServiceFilter';

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

interface MessageBubbleProps {
  message: Message;
  toggleSources: () => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, toggleSources }) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [isTyping, setIsTyping] = useState(!message.isUser);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    if (message.isUser) {
      setDisplayedContent(message.content);
      setIsTyping(false);
      return;
    }

    // Typing animation for bot messages
    let index = 0;
    const interval = setInterval(() => {
      if (index < message.content.length) {
        setDisplayedContent(message.content.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [message.content, message.isUser]);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'TaxBot Response',
        text: message.content,
      });
    }
  };

  const handleFeedback = (type: 'up' | 'down') => {
    setFeedback(feedback === type ? null : type);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getServiceBadges = () => {
    if (!message.services || message.services.length === 0) return null;
    
    return message.services.map(serviceId => {
      const service = SERVICES.find(s => s.id === serviceId);
      if (!service) return null;
      
      const IconComponent = service.icon;
      return (
        <div
          key={serviceId}
          className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border ${service.color}`}
        >
          <IconComponent className="w-3 h-3" />
          <span>{service.name}</span>
        </div>
      );
    });
  };

  if (message.isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-2xl">
          <div className="flex items-start gap-3 justify-end">
            <div className="flex-1">
              {/* Service badges for user messages */}
              {message.services && message.services.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-end mb-2">
                  {getServiceBadges()}
                </div>
              )}
              
              <div className="bg-primary-600 text-white p-4 rounded-2xl rounded-tr-md shadow-sm">
                <p className="whitespace-pre-wrap">{displayedContent}</p>
              </div>
              <div className="flex justify-end mt-2">
                <span className="text-xs text-secondary-500">
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </div>
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="max-w-4xl w-full">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
            <Bot className="w-4 h-4 text-white" />
          </div>
          
          <div className="flex-1">
            {/* Service context indicator */}
            {message.services && message.services.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                <div className="text-xs text-secondary-500 font-medium">
                  Response contextualized for:
                </div>
                {getServiceBadges()}
              </div>
            )}
            
            <div className="bg-secondary-50 p-4 rounded-2xl rounded-tl-md shadow-sm">
              <p className="whitespace-pre-wrap text-secondary-800">
                {displayedContent}
                {isTyping && <span className="animate-pulse">|</span>}
              </p>
            </div>
            
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-secondary-500">
                {formatTime(message.timestamp)}
              </span>
              
              {!isTyping && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="p-2 text-secondary-500 hover:text-secondary-700 hover:bg-secondary-100 rounded-lg transition-colors"
                    title="Copy to clipboard"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={toggleSources}
                    className="p-2 text-secondary-500 hover:text-secondary-700 hover:bg-secondary-100 rounded-lg transition-colors"
                    title="Sources & References"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={handleShare}
                    className="p-2 text-secondary-500 hover:text-secondary-700 hover:bg-secondary-100 rounded-lg transition-colors"
                    title="Share"
                  >
                    <Share className="w-4 h-4" />
                  </button>
                  
                  <div className="flex items-center gap-1 ml-2">
                    <button
                      onClick={() => handleFeedback('up')}
                      className={`p-2 rounded-lg transition-colors ${
                        feedback === 'up'
                          ? 'text-green-600 bg-green-100'
                          : 'text-secondary-500 hover:text-green-600 hover:bg-green-50'
                      }`}
                      title="Helpful"
                    >
                      <ThumbsUp className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => handleFeedback('down')}
                      className={`p-2 rounded-lg transition-colors ${
                        feedback === 'down'
                          ? 'text-red-600 bg-red-100'
                          : 'text-secondary-500 hover:text-red-600 hover:bg-red-50'
                      }`}
                      title="Not helpful"
                    >
                      <ThumbsDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
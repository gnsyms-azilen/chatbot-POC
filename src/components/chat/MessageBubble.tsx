import React, { useState, useEffect } from 'react';
import { Copy, Download, ThumbsUp, ThumbsDown, User, Bot, FileText } from 'lucide-react';
import { SERVICES } from './ServiceModal';
import { generateConversationPDF } from '../../utils/pdfGenerator';

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
  allMessages: Message[];
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, toggleSources, allMessages }) => {
  const [animatedTokens, setAnimatedTokens] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(!message.isUser);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  // Helper function to tokenize content into words and preserve formatting
  const tokenizeContent = (content: string): string[] => {
    const tokens: string[] = [];
    const lines = content.split('\n');
    
    lines.forEach((line, lineIndex) => {
      if (lineIndex > 0) {
        tokens.push('\n'); // Add newline token
      }
      
      const words = line.split(' ').filter(word => word.length > 0);
      words.forEach((word, wordIndex) => {
        tokens.push(word);
        if (wordIndex < words.length - 1) {
          tokens.push(' '); // Add space token
        }
      });
    });
    
    return tokens;
  };

  useEffect(() => {
    if (message.isUser) {
      setAnimatedTokens(tokenizeContent(message.content));
      setIsTyping(false);
      return;
    }

    // Word-by-word animation for bot messages
    const tokens = tokenizeContent(message.content);
    let tokenIndex = 0;
    
    const interval = setInterval(() => {
      if (tokenIndex < tokens.length) {
        setAnimatedTokens(prev => [...prev, tokens[tokenIndex]]);
        tokenIndex++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 70); // 70ms delay between tokens for natural reading pace

    return () => clearInterval(interval);
  }, [message.content, message.isUser]);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
  };

  const handleDownloadPDF = () => {
    // Find the conversation up to this message
    const messageIndex = allMessages.findIndex(m => m.id === message.id);
    const conversationUpToHere = allMessages.slice(0, messageIndex + 1);
    generateConversationPDF(conversationUpToHere);
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
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${service.color}`}
        >
          <IconComponent className="w-2.5 h-2.5" />
          <span>{service.name}</span>
        </div>
      );
    });
  };

  const renderAnimatedContent = () => {
    return animatedTokens.map((token, index) => {
      if (token === '\n') {
        return <br key={index} />;
      }
      
      if (token === ' ') {
        return <span key={index}>&nbsp;</span>;
      }
      
      return (
        <span
          key={index}
          className="animate-word-fade-in inline-block"
          style={{
            animationDelay: `${index * 0.05}s`,
            animationFillMode: 'both'
          }}
        >
          {token}
        </span>
      );
    });
  };

  if (message.isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-xl">
          <div className="flex items-start gap-2 justify-end">
            <div className="flex-1">
              {/* Service badges for user messages */}
              {message.services && message.services.length > 0 && (
                <div className="flex flex-wrap gap-1.5 justify-end mb-1.5">
                  {getServiceBadges()}
                </div>
              )}
              
              <div className="bg-primary-600 text-white p-3 rounded-xl rounded-tr-md shadow-sm">
                <p className="whitespace-pre-wrap text-sm">{message.content}</p>
              </div>
              <div className="flex justify-end mt-1">
                <span className="text-xs text-secondary-500">
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </div>
            <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="max-w-3xl w-full">
        <div className="flex items-start gap-2">
          <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
            <Bot className="w-3 h-3 text-white" />
          </div>
          
          <div className="flex-1">
            {/* Service context indicator */}
            {message.services && message.services.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-1.5">
                <div className="text-xs text-secondary-500 font-medium">
                  Response for:
                </div>
                {getServiceBadges()}
              </div>
            )}
            
            <div className="bg-secondary-50 p-3 rounded-xl rounded-tl-md shadow-sm">
              <div className="whitespace-pre-wrap text-secondary-800 text-sm leading-relaxed">
                {renderAnimatedContent()}
                {isTyping && <span className="animate-pulse ml-1">|</span>}
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-secondary-500">
                {formatTime(message.timestamp)}
              </span>
              
              {!isTyping && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleCopy}
                    className="p-1.5 text-secondary-500 hover:text-secondary-700 hover:bg-secondary-100 rounded-lg transition-colors"
                    title="Copy to clipboard"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  
                  <button
                    onClick={toggleSources}
                    className="p-1.5 text-secondary-500 hover:text-secondary-700 hover:bg-secondary-100 rounded-lg transition-colors"
                    title="Sources & References"
                  >
                    <FileText className="w-3.5 h-3.5" />
                  </button>
                  
                  <button
                    onClick={handleDownloadPDF}
                    className="p-1.5 text-secondary-500 hover:text-secondary-700 hover:bg-secondary-100 rounded-lg transition-colors"
                    title="Download conversation as PDF"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  
                  <div className="flex items-center gap-0.5 ml-1">
                    <button
                      onClick={() => handleFeedback('up')}
                      className={`p-1.5 rounded-lg transition-colors ${
                        feedback === 'up'
                          ? 'text-green-600 bg-green-100'
                          : 'text-secondary-500 hover:text-green-600 hover:bg-green-50'
                      }`}
                      title="Helpful"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </button>
                    
                    <button
                      onClick={() => handleFeedback('down')}
                      className={`p-1.5 rounded-lg transition-colors ${
                        feedback === 'down'
                          ? 'text-red-600 bg-red-100'
                          : 'text-secondary-500 hover:text-red-600 hover:bg-red-50'
                      }`}
                      title="Not helpful"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
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
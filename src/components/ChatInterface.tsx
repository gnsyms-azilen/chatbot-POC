import React, { useState, useEffect, useRef, useCallback } from 'react';
import ChatHeader from './chat/ChatHeader';
import ChatSidebar from './chat/ChatSidebar';
import ChatMain from './chat/ChatMain';
import SourcesSidebar from './chat/SourcesSidebar';
import { SERVICES } from './chat/ServiceModal';

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

interface ChatInterfaceProps {
  initialQuery: string;
  onBackToLanding: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ initialQuery, onBackToLanding }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTopic, setCurrentTopic] = useState('Tax Questions');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasProcessedInitialQuery, setHasProcessedInitialQuery] = useState(false);
  const [showSources, setShowSources] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sourcesClasses = `
    ${showSources ? 'w-72' : 'w-0'}
    transition-width duration-300 ease-in-out
    bg-white border-l border-secondary-200
    flex flex-col h-full
  `;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (initialQuery && !hasProcessedInitialQuery) {
      setHasProcessedInitialQuery(true);
      handleSendMessage(initialQuery, []);
    }
  }, [initialQuery]);

  const handleSendMessage = async (content: string, services: string[]) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date(),
      services: services.length > 0 ? services : undefined,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Update topic based on first few words of the message
    if (messages.length === 0) {
      const topic = content.split(' ').slice(0, 3).join(' ');
      setCurrentTopic(topic.length > 20 ? topic.substring(0, 20) + '...' : topic);
    }

    // Simulate AI response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: generateBotResponse(content, services),
        isUser: false,
        timestamp: new Date(),
        services: services.length > 0 ? services : undefined,
        sources: [
          {
            title: "IRS Publication 535 - Business Expenses",
            url: "https://www.irs.gov/pub/irs-pdf/p535.pdf",
            description: "Official IRS guidance on business expense deductions"
          },
          {
            title: "Tax Code Section 162",
            url: "https://www.law.cornell.edu/uscode/text/26/162",
            description: "Legal framework for business expense deductions"
          }
        ]
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const generateBotResponse = (query: string, services: string[]): string => {
    let contextPrefix = '';
    
    if (services.length > 0) {
      const serviceNames = services.map(id => {
        const service = SERVICES.find(s => s.id === id);
        return service?.name;
      }).filter(Boolean);
      
      if (serviceNames.length === 1) {
        contextPrefix = `For ${serviceNames[0]} specifically: `;
      } else if (serviceNames.length > 1) {
        contextPrefix = `For ${serviceNames.slice(0, -1).join(', ')} and ${serviceNames[serviceNames.length - 1]}: `;
      }
    }

    // Service-specific responses
    if (services.includes('deductions') || query.toLowerCase().includes('deduction')) {
      return contextPrefix + "Based on current IRS regulations, there are several deductions you may be eligible for. For freelancers and self-employed individuals, you can typically deduct business expenses such as home office costs (if you use part of your home exclusively for business), equipment purchases, professional development courses, and business-related travel expenses.\n\nThe key requirement is that these expenses must be both ordinary and necessary for your business. Keep detailed records and receipts for all claimed deductions. For home office deductions, you can use either the simplified method ($5 per square foot, up to 300 sq ft) or the actual expense method.\n\nWould you like me to explain any specific deduction category in more detail?";
    }
    
    if (services.includes('self-employed') || query.toLowerCase().includes('quarterly')) {
      return contextPrefix + "Quarterly estimated taxes are due four times per year for self-employed individuals and those who don't have taxes withheld from their income. The due dates are typically January 15, April 15, June 15, and September 15.\n\nTo calculate your quarterly payments:\n1. Estimate your annual income\n2. Calculate expected tax liability\n3. Subtract any withholdings or credits\n4. Divide by 4 for quarterly amounts\n\nYou can use Form 1040ES to help with calculations. The general rule is to pay either 90% of the current year's tax liability or 100% of last year's tax (110% if your prior year AGI exceeded $150,000).\n\nWould you like help calculating your specific quarterly payment amount?";
    }

    if (services.includes('business-tax')) {
      return contextPrefix + "For business tax matters, there are several key areas to consider. Business expenses must be ordinary and necessary to be deductible. Common deductible expenses include office supplies, equipment, professional services, marketing costs, and business travel.\n\nDepending on your business structure (sole proprietorship, LLC, corporation), you'll file different forms and may have different tax obligations. Corporations file Form 1120, while sole proprietors report business income on Schedule C of their personal return.\n\nKeep meticulous records of all business transactions, as the IRS may request documentation during an audit. Consider working with a tax professional for complex business situations.\n\nWhat specific aspect of business taxation would you like to explore further?";
    }

    return contextPrefix + "Thank you for your question! I'd be happy to help you with tax and finance guidance. Based on official IRS publications and current tax regulations, I can provide you with accurate information tailored to your specific situation.\n\nCould you provide a bit more detail about your specific circumstances so I can give you the most relevant advice?";
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentTopic('Tax Questions');
    setHasProcessedInitialQuery(false);
    onBackToLanding();
  };

  const mockChatHistory = [
    { id: '1', title: 'Freelancer Deductions', timestamp: new Date('2024-01-15'), category: '2024 Tax Year' },
    { id: '2', title: 'Quarterly Payments', timestamp: new Date('2024-01-10'), category: '2024 Tax Year' },
    { id: '3', title: 'Home Office Deduction', timestamp: new Date('2024-01-05'), category: '2024 Tax Year' },
    { id: '4', title: 'Business Expenses', timestamp: new Date('2023-12-20'), category: '2023 Tax Year' },
  ];

  const toggleHistory = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const toggleSources = useCallback(() => {
    setShowSources(prev => !prev);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-secondary-50">
      <ChatHeader 
        currentTopic={currentTopic}
        onNewChat={handleNewChat}
        onMobileMenuToggle={toggleHistory}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <ChatSidebar 
          chatHistory={mockChatHistory}
          isOpen={isMobileMenuOpen}
          onClose={toggleHistory}
        />
        
        <div className="flex-1 flex">
          <ChatMain 
            messages={messages}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            messagesEndRef={messagesEndRef}
            toggleSources={toggleSources}
          />
          <div className={sourcesClasses}>
            <SourcesSidebar 
              toggleSources={toggleSources}
              sources={messages.filter(m => !m.isUser && m.sources).flatMap(m => m.sources || [])}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
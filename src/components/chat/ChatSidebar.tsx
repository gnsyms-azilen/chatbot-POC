import React from 'react';
import { Search, Clock, X } from 'lucide-react';

interface ChatHistoryItem {
  id: string;
  title: string;
  timestamp: Date;
  category: string;
}

interface ChatSidebarProps {
  chatHistory: ChatHistoryItem[];
  isOpen: boolean;
  onClose: () => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ chatHistory, isOpen, onClose }) => {
  const groupedHistory = chatHistory.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ChatHistoryItem[]>);

  const sidebarClasses = `
    w-80 bg-white border-r border-secondary-200 flex flex-col h-full
    md:relative md:translate-x-0 md:shadow-none
    ${isOpen 
      ? 'fixed inset-y-0 left-0 z-50 shadow-xl translate-x-0' 
      : 'fixed inset-y-0 left-0 z-50 shadow-xl -translate-x-full'
    }
    transition-transform duration-300 ease-in-out
  `;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <div className={sidebarClasses}>
        {/* Header */}
        <div className="p-6 border-b border-secondary-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-secondary-800">
              Chat History
            </h3>
            <button
              onClick={onClose}
              className="md:hidden p-1 text-secondary-600 hover:text-secondary-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
            <input
              type="text"
              placeholder="Search previous chats..."
              className="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-6">
          {Object.entries(groupedHistory).map(([category, items]) => (
            <div key={category} className="mb-6">
              <h4 className="text-xs font-semibold text-secondary-500 uppercase tracking-wider mb-3">
                {category}
              </h4>
              
              <div className="space-y-2">
                {items.map((item) => (
                  <button
                    key={item.id}
                    className="w-full text-left p-3 rounded-lg hover:bg-secondary-50 transition-colors group"
                  >
                    <div className="flex items-start gap-3">
                      <Clock className="w-4 h-4 text-secondary-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-secondary-800 truncate group-hover:text-primary-600 transition-colors">
                          {item.title}
                        </p>
                        <p className="text-xs text-secondary-500 mt-1">
                          {item.timestamp.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ChatSidebar;
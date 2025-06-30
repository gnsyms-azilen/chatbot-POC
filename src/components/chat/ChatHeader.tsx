import React from 'react';
import { Bot, Plus, Settings, User, Menu } from 'lucide-react';

interface ChatHeaderProps {
  currentTopic: string;
  onNewChat: () => void;
  onMobileMenuToggle: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  currentTopic, 
  onNewChat, 
  onMobileMenuToggle 
}) => {
  return (
    <header className="bg-white border-b border-secondary-200 h-16 flex items-center px-4 shadow-sm">
      <div className="flex items-center justify-between w-full">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMobileMenuToggle}
            className="md:hidden p-2 text-secondary-600 hover:text-secondary-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="bg-primary-600 p-2 rounded-lg">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-secondary-800">TaxBot</h1>
            </div>
          </div>
        </div>

        {/* Center Section */}
        <div className="hidden md:block flex-1 text-center">
          <h2 className="text-sm font-medium text-secondary-600 truncate max-w-xs mx-auto">
            {currentTopic}
          </h2>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          <button
            onClick={onNewChat}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Chat</span>
          </button>
          
          <button className="p-2 text-secondary-600 hover:text-secondary-800 hover:bg-secondary-100 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          
          <button className="p-2 text-secondary-600 hover:text-secondary-800 hover:bg-secondary-100 rounded-lg transition-colors">
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;
import React from "react";
import { Search, Clock, X, History } from "lucide-react";

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

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  chatHistory,
  isOpen,
  onClose,
}) => {
  const groupedHistory = chatHistory.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ChatHistoryItem[]>);

  const animation = 'transition-all duration-500 ease-in-out'

  const sidebarClasses = `
    w-72 bg-white border-r border-secondary-200 
    flex flex-col h-full
    fixed inset-y-0 left-0 z-50 shadow-xl
    md:relative md:translate-x-0 md:shadow-none 
    ${isOpen ? " translate-x-0 " : "-translate-x-full md:hidden"}
    ${animation}
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
      <div className={`max-md:hidden ${animation}  ${!isOpen ? 'w-16 opacity-100' : 'w-0 opacity-0'} flex flex-col h-full w-16 border-r bg-white border-secondary-200`}>
        <button
          onClick={onClose}
          className=" py-2 text-secondary-600 hover:text-secondary-800 flex justify-center"
        >
          <History className="w-5 h-5" />
        </button>
      </div>

      <div className={sidebarClasses}>
          <>
            {/* Header */}
            <div className="p-4 border-b border-secondary-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-secondary-800">
                  Chat History
                </h3>
                <button
                  onClick={onClose}
                  className=" p-1 text-secondary-600 hover:text-secondary-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-secondary-400" />
                <input
                  type="text"
                  placeholder="Search previous chats..."
                  className="w-full pl-8 pr-3 py-2 border border-secondary-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-4">
              {Object.entries(groupedHistory).map(([category, items]) => (
                <div key={category} className="mb-4">
                  <h4 className="text-xs font-semibold text-secondary-500 uppercase tracking-wider mb-2">
                    {category}
                  </h4>

                  <div className="space-y-1.5">
                    {items.map((item) => (
                      <button
                        key={item.id}
                        className="w-full text-left p-2.5 rounded-lg hover:bg-secondary-50 transition-colors group"
                      >
                        <div className="flex items-start gap-2.5">
                          <Clock className="w-3.5 h-3.5 text-secondary-400 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-secondary-800 truncate group-hover:text-primary-600 transition-colors">
                              {item.title}
                            </p>
                            <p className="text-xs text-secondary-500 mt-0.5">
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
          </>
      </div>
    </>
  );
};

export default ChatSidebar;
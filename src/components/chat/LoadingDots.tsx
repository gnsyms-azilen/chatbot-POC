import React from 'react';
import { Bot } from 'lucide-react';

const LoadingDots: React.FC = () => {
  return (
    <div className="flex justify-start">
      <div className="max-w-4xl w-full">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
            <Bot className="w-4 h-4 text-white" />
          </div>
          
          <div className="flex-1">
            <div className="bg-secondary-50 p-4 rounded-2xl rounded-tl-md shadow-sm inline-block">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse-dot"></div>
                <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse-dot" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse-dot" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
            
            <div className="mt-2">
              <span className="text-xs text-secondary-500">
                TaxBot is thinking...
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingDots;
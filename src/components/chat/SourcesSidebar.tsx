import React, { useState } from 'react';
import { ExternalLink, ChevronDown, ChevronUp, Shield, X, History } from 'lucide-react';

interface Source {
  title: string;
  url: string;
  description: string;
}

interface SourcesSidebarProps {
  sources: Source[];
  isOpen: boolean;
  onClose: () => void;
}

const SourcesSidebar: React.FC<SourcesSidebarProps> = ({ sources, isOpen, onClose }) => {
  const [expandedSources, setExpandedSources] = useState<Set<number>>(new Set());

  const toggleSource = (index: number) => {
    const newExpanded = new Set(expandedSources);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSources(newExpanded);
  };

  const handleVerify = (source: Source) => {
    window.open(source.url, '_blank', 'noopener,noreferrer');
  };

  const animation = 'transition-all duration-500 ease-in-out';

  const sidebarClasses = `
    w-72 bg-white border-l border-secondary-200 
    flex flex-col h-full
    fixed inset-y-0 right-0 z-50 shadow-xl
    md:relative md:translate-x-0 md:shadow-none 
    ${isOpen ? "translate-x-0" : "translate-x-full md:hidden"}
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

      {/* Full Sidebar */}
      <div className={sidebarClasses}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-secondary-200 bg-gradient-to-r from-primary-50 to-secondary-50">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-primary-600" />
              <h3 className="text-base font-semibold text-secondary-800">
                Sources & References
              </h3>
            </div>
            <p className="text-xs text-secondary-600">
              All responses are backed by official documentation
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-secondary-600 hover:text-secondary-800 hover:bg-secondary-100 rounded-lg transition-colors ml-2"
            title="Hide sources"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sources List */}
        <div className="flex-1 overflow-y-auto p-4">
          {sources.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-secondary-400" />
              </div>
              <h4 className="text-xs font-medium text-secondary-800 mb-1">
                No sources yet
              </h4>
              <p className="text-xs text-secondary-600">
                Sources will appear here when TaxBot provides answers
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {sources.map((source, index) => (
                <div
                  key={index}
                  className="border border-secondary-200 rounded-lg overflow-hidden bg-secondary-50 hover:shadow-sm transition-shadow duration-200"
                >
                  <button
                    onClick={() => toggleSource(index)}
                    className="w-full p-3 text-left hover:bg-secondary-100 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-medium text-secondary-800 line-clamp-2 leading-relaxed">
                          {source.title}
                        </h4>
                        <p className="text-xs text-primary-600 mt-1 truncate">
                          {new URL(source.url).hostname}
                        </p>
                      </div>
                      <div className="flex-shrink-0 ml-2">
                        {expandedSources.has(index) ? (
                          <ChevronUp className="w-3.5 h-3.5 text-secondary-500" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 text-secondary-500" />
                        )}
                      </div>
                    </div>
                  </button>
                  
                  {expandedSources.has(index) && (
                    <div className="px-3 pb-3 border-t border-secondary-200 bg-white">
                      <p className="text-xs text-secondary-700 mb-3 mt-2 leading-relaxed">
                        {source.description}
                      </p>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleVerify(source)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors shadow-sm hover:shadow-md"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Verify Source
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {sources.length > 0 && (
          <div className="p-4 border-t border-secondary-200 bg-secondary-50">
            <div className="flex items-center gap-2 text-xs text-secondary-600">
              <Shield className="w-3 h-3 text-primary-600" />
              <span>All sources verified and up-to-date</span>
            </div>
            <div className="mt-2 text-xs text-secondary-500">
              {sources.length} source{sources.length === 1 ? '' : 's'} available
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SourcesSidebar;
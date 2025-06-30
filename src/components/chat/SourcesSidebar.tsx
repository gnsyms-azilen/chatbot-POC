import React, { useState } from 'react';
import { ExternalLink, ChevronDown, ChevronUp, Shield } from 'lucide-react';

interface Source {
  title: string;
  url: string;
  description: string;
}

interface SourcesSidebarProps {
  sources: Source[];
}

const SourcesSidebar: React.FC<SourcesSidebarProps> = ({ sources }) => {
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

  return (
    <div className="w-80 bg-white border-l border-secondary-200 flex flex-col h-full hidden lg:flex">
      {/* Header */}
      <div className="p-6 border-b border-secondary-200">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-secondary-800">
            Sources & References
          </h3>
        </div>
        <p className="text-sm text-secondary-600">
          All responses are backed by official documentation
        </p>
      </div>

      {/* Sources List */}
      <div className="flex-1 overflow-y-auto p-6">
        {sources.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-secondary-400" />
            </div>
            <h4 className="text-sm font-medium text-secondary-800 mb-2">
              No sources yet
            </h4>
            <p className="text-sm text-secondary-600">
              Sources will appear here when TaxBot provides answers
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sources.map((source, index) => (
              <div
                key={index}
                className="border border-secondary-200 rounded-xl overflow-hidden bg-secondary-50"
              >
                <button
                  onClick={() => toggleSource(index)}
                  className="w-full p-4 text-left hover:bg-secondary-100 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-secondary-800 line-clamp-2">
                        {source.title}
                      </h4>
                      <p className="text-xs text-primary-600 mt-1 truncate">
                        {new URL(source.url).hostname}
                      </p>
                    </div>
                    {expandedSources.has(index) ? (
                      <ChevronUp className="w-4 h-4 text-secondary-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-secondary-500 flex-shrink-0" />
                    )}
                  </div>
                </button>
                
                {expandedSources.has(index) && (
                  <div className="px-4 pb-4 border-t border-secondary-200 bg-white">
                    <p className="text-sm text-secondary-700 mb-4 mt-3">
                      {source.description}
                    </p>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleVerify(source)}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Verify
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
        <div className="p-6 border-t border-secondary-200 bg-secondary-50">
          <div className="flex items-center gap-2 text-xs text-secondary-600">
            <Shield className="w-4 h-4" />
            <span>All sources verified and up-to-date</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SourcesSidebar;
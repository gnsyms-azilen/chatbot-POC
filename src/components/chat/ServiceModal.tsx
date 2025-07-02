import React, { useEffect, useRef } from 'react';
import { X, Check, Search, Building, User, Calculator, FileText, CreditCard, TrendingUp } from 'lucide-react';

export interface Service {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description: string;
}

export const SERVICES: Service[] = [
  {
    id: 'personal-tax',
    name: 'Personal Tax',
    icon: User,
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    description: 'Individual tax returns, deductions, and personal tax planning'
  },
  {
    id: 'business-tax',
    name: 'Business Tax',
    icon: Building,
    color: 'bg-green-100 text-green-700 border-green-200',
    description: 'Business expenses, corporate taxes, and business deductions'
  },
  {
    id: 'self-employed',
    name: 'Self-Employed',
    icon: Calculator,
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    description: 'Freelancer taxes, quarterly payments, and 1099 forms'
  },
  {
    id: 'tax-planning',
    name: 'Tax Planning',
    icon: TrendingUp,
    color: 'bg-orange-100 text-orange-700 border-orange-200',
    description: 'Strategic tax planning and optimization strategies'
  },
  {
    id: 'deductions',
    name: 'Deductions',
    icon: FileText,
    color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    description: 'Tax deductions, credits, and expense tracking'
  },
  {
    id: 'payments',
    name: 'Tax Payments',
    icon: CreditCard,
    color: 'bg-red-100 text-red-700 border-red-200',
    description: 'Payment schedules, penalties, and refund information'
  }
];

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedServices: string[];
  onServicesChange: (services: string[]) => void;
}

const ServiceModal: React.FC<ServiceModalProps> = ({
  isOpen,
  onClose,
  selectedServices,
  onServicesChange
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = React.useState('');

  useEffect(() => {
    if (isOpen) {
      // Focus search input when modal opens
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);

      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll
      document.body.style.overflow = 'unset';
      setSearchTerm('');
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const filteredServices = SERVICES.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleServiceToggle = (serviceId: string) => {
    if (serviceId === 'all') {
      onServicesChange([]);
      return;
    }

    const newSelected = selectedServices.includes(serviceId)
      ? selectedServices.filter(id => id !== serviceId)
      : [...selectedServices, serviceId];
    
    onServicesChange(newSelected);
  };

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="service-modal-title"
    >
      <div 
        ref={modalRef}
        className="w-full max-w-xl max-h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-secondary-200 bg-gradient-to-r from-primary-50 to-secondary-50">
          <div>
            <h2 id="service-modal-title" className="text-lg font-semibold text-secondary-800">
              Select Service
            </h2>
            <p className="text-xs text-secondary-600 mt-0.5">
              Choose one or more services to get targeted assistance
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-secondary-500 hover:text-secondary-700 hover:bg-secondary-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-secondary-100">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-secondary-400" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-2.5 border border-secondary-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Service Options */}
        <div className="flex-1 overflow-y-auto max-h-80">
          {/* All Services Option */}
          <div className="p-4 border-b border-secondary-100">
            <button
              onClick={() => handleServiceToggle('all')}
              className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-secondary-50 transition-all duration-200 ${
                selectedServices.length === 0 ? 'bg-primary-50 border-2 border-primary-200 shadow-sm' : 'border-2 border-transparent'
              }`}
            >
              <div className="w-5 h-5 flex items-center justify-center">
                {selectedServices.length === 0 ? (
                  <div className="w-4 h-4 bg-primary-600 rounded-full flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" />
                  </div>
                ) : (
                  <div className="w-4 h-4 border-2 border-secondary-300 rounded-full" />
                )}
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm font-medium text-secondary-800">
                  All Services
                </div>
                <div className="text-xs text-secondary-500 mt-0.5">
                  Get answers for any tax or finance question
                </div>
              </div>
            </button>
          </div>

          {/* Individual Services */}
          <div className="p-4 space-y-2">
            {filteredServices.length === 0 ? (
              <div className="text-center py-6">
                <div className="text-xs text-secondary-500">
                  No services found matching "{searchTerm}"
                </div>
              </div>
            ) : (
              filteredServices.map((service) => {
                const IconComponent = service.icon;
                const isSelected = selectedServices.includes(service.id);
                
                return (
                  <button
                    key={service.id}
                    onClick={() => handleServiceToggle(service.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-secondary-50 transition-all duration-200 ${
                      isSelected ? 'bg-primary-50 border-2 border-primary-200 shadow-sm' : 'border-2 border-transparent hover:border-secondary-200'
                    }`}
                  >
                    <div className="w-5 h-5 flex items-center justify-center">
                      {isSelected ? (
                        <div className="w-4 h-4 bg-primary-600 rounded-full flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </div>
                      ) : (
                        <div className="w-4 h-4 border-2 border-secondary-300 rounded-full" />
                      )}
                    </div>
                    <div className={`p-2 rounded-lg ${service.color}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium text-secondary-800">
                        {service.name}
                      </div>
                      <div className="text-xs text-secondary-500 mt-0.5">
                        {service.description}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-secondary-200 bg-secondary-50">
          <div className="text-xs text-secondary-600">
            {selectedServices.length === 0 
              ? 'All services selected' 
              : `${selectedServices.length} service${selectedServices.length === 1 ? '' : 's'} selected`
            }
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-secondary-600 hover:text-secondary-800 hover:bg-secondary-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors shadow-sm hover:shadow-md"
            >
              Apply Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceModal;
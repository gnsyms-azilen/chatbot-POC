import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Check, Filter, Building, User, Calculator, FileText, CreditCard, TrendingUp } from 'lucide-react';

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

interface ServiceFilterProps {
  selectedServices: string[];
  onServicesChange: (services: string[]) => void;
  className?: string;
}

const ServiceFilter: React.FC<ServiceFilterProps> = ({
  selectedServices,
  onServicesChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const handleClearAll = () => {
    onServicesChange([]);
  };

  const getSelectedServicesText = () => {
    if (selectedServices.length === 0) return 'All Services';
    if (selectedServices.length === 1) {
      const service = SERVICES.find(s => s.id === selectedServices[0]);
      return service?.name || 'All Services';
    }
    return `${selectedServices.length} Services Selected`;
  };

  const getSelectedServicesDisplay = () => {
    if (selectedServices.length === 0) return null;
    
    return selectedServices.map(serviceId => {
      const service = SERVICES.find(s => s.id === serviceId);
      if (!service) return null;
      
      const IconComponent = service.icon;
      return (
        <div
          key={serviceId}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${service.color} transition-all duration-200`}
        >
          <IconComponent className="w-3 h-3" />
          <span>{service.name}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleServiceToggle(serviceId);
            }}
            className="ml-1 hover:bg-black hover:bg-opacity-10 rounded-full p-0.5 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      );
    });
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Selected Services Display */}
      {selectedServices.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {getSelectedServicesDisplay()}
          <button
            onClick={handleClearAll}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-secondary-600 hover:text-secondary-800 hover:bg-secondary-100 rounded-full transition-colors"
          >
            <X className="w-3 h-3" />
            Clear All
          </button>
        </div>
      )}

      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-3 bg-white border border-secondary-200 rounded-xl hover:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
          isOpen ? 'border-primary-300 ring-2 ring-primary-500 ring-opacity-20' : ''
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-primary-100 rounded-lg">
            <Filter className="w-4 h-4 text-primary-600" />
          </div>
          <div className="text-left">
            <div className="text-sm font-medium text-secondary-800">
              {getSelectedServicesText()}
            </div>
            <div className="text-xs text-secondary-500">
              Filter by service type
            </div>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-secondary-400 transition-transform duration-200 ${
          isOpen ? 'rotate-180' : ''
        }`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-secondary-200 rounded-xl shadow-xl z-50 overflow-hidden">
          {/* Search */}
          <div className="p-4 border-b border-secondary-100">
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* All Services Option */}
          <div className="p-2">
            <button
              onClick={() => handleServiceToggle('all')}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-secondary-50 transition-colors ${
                selectedServices.length === 0 ? 'bg-primary-50 border border-primary-200' : ''
              }`}
            >
              <div className="w-5 h-5 flex items-center justify-center">
                {selectedServices.length === 0 && (
                  <Check className="w-4 h-4 text-primary-600" />
                )}
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm font-medium text-secondary-800">
                  All Services
                </div>
                <div className="text-xs text-secondary-500">
                  Get answers for any tax or finance question
                </div>
              </div>
            </button>
          </div>

          {/* Service Options */}
          <div className="max-h-64 overflow-y-auto p-2">
            {filteredServices.map((service) => {
              const IconComponent = service.icon;
              const isSelected = selectedServices.includes(service.id);
              
              return (
                <button
                  key={service.id}
                  onClick={() => handleServiceToggle(service.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-secondary-50 transition-colors ${
                    isSelected ? 'bg-primary-50 border border-primary-200' : ''
                  }`}
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    {isSelected ? (
                      <Check className="w-4 h-4 text-primary-600" />
                    ) : (
                      <div className="w-4 h-4 border border-secondary-300 rounded" />
                    )}
                  </div>
                  <div className={`p-2 rounded-lg ${service.color}`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-secondary-800">
                      {service.name}
                    </div>
                    <div className="text-xs text-secondary-500">
                      {service.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {filteredServices.length === 0 && (
            <div className="p-8 text-center">
              <div className="text-sm text-secondary-500">
                No services found matching "{searchTerm}"
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ServiceFilter;
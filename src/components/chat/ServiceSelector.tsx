import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';
import ServiceModal, { SERVICES } from './ServiceModal';

interface ServiceSelectorProps {
  selectedServices: string[];
  onServicesChange: (services: string[]) => void;
  className?: string;
}

const ServiceSelector: React.FC<ServiceSelectorProps> = ({
  selectedServices,
  onServicesChange,
  className = ''
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getSelectedServicesDisplay = () => {
    if (selectedServices.length === 0) return null;
    
    return selectedServices.map(serviceId => {
      const service = SERVICES.find(s => s.id === serviceId);
      if (!service) return null;
      
      const IconComponent = service.icon;
      return (
        <div
          key={serviceId}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${service.color} transition-all duration-200`}
        >
          <IconComponent className="w-3.5 h-3.5" />
          <span>{service.name}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              const newSelected = selectedServices.filter(id => id !== serviceId);
              onServicesChange(newSelected);
            }}
            className="ml-1 hover:bg-black hover:bg-opacity-10 rounded-full p-0.5 transition-colors"
            aria-label={`Remove ${service.name}`}
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      );
    });
  };

  const handleClearAll = () => {
    onServicesChange([]);
  };

  const getButtonText = () => {
    if (selectedServices.length === 0) return 'Select Service';
    if (selectedServices.length === 1) {
      const service = SERVICES.find(s => s.id === selectedServices[0]);
      return service?.name || 'Select Service';
    }
    return `${selectedServices.length} Services`;
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Selected Services Display */}
      {selectedServices.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
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

      {/* Select Service Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-3 px-4 py-3 bg-white border border-secondary-200 rounded-xl hover:border-primary-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 w-full sm:w-auto"
      >
        <div className="p-1.5 bg-primary-100 rounded-lg">
          <Filter className="w-4 h-4 text-primary-600" />
        </div>
        <div className="text-left">
          <div className="text-sm font-medium text-secondary-800">
            {getButtonText()}
          </div>
          <div className="text-xs text-secondary-500">
            {selectedServices.length === 0 
              ? 'Choose service type for targeted help'
              : 'Click to modify selection'
            }
          </div>
        </div>
      </button>

      {/* Service Modal */}
      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedServices={selectedServices}
        onServicesChange={onServicesChange}
      />
    </div>
  );
};

export default ServiceSelector;
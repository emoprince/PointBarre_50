
import React from 'react';
import { CoffeeOption } from '../types';

interface OptionSelectorProps {
  title: string;
  options: CoffeeOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

const OptionSelector: React.FC<OptionSelectorProps> = ({ title, options, selectedValue, onSelect }) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-stone-700 mb-3">{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {options.map((option) => (
          <button
            key={option.name}
            onClick={() => onSelect(option.name)}
            className={`p-3 rounded-lg border-2 transition-all duration-200 ease-in-out flex flex-col items-center justify-center space-y-2 text-center h-24
              ${selectedValue === option.name
                ? 'bg-amber-900 text-white border-amber-900 shadow-lg'
                : 'bg-white text-stone-700 border-stone-200 hover:border-amber-700 hover:shadow-md'
              }`}
          >
            {option.icon && <option.icon className="w-7 h-7 mb-1" />}
            <span className="font-medium text-sm">{option.name}</span>
            {option.price > 0 && <span className="text-xs opacity-80">(+${option.price.toFixed(2)})</span>}
          </button>
        ))}
      </div>
    </div>
  );
};

export default OptionSelector;

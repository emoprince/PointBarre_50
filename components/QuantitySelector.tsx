import React from 'react';

interface QuantitySelectorProps {
  title: string;
  value: string;
  onChange: (value: string) => void;
  max?: number;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({ title, value, onChange, max = 100 }) => {
  const numericValue = Number(value) || 0;
  
  const increment = () => onChange(String(Math.min(numericValue + 1, max)));
  const decrement = () => onChange(String(Math.max(numericValue - 1, 0)));

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-[#FFFEE7] mb-3">{title}</h3>
      <div className="flex items-center justify-center bg-transparent p-2 border-2 border-[#FFFEE7] max-w-xs mx-auto">
        <button
          onClick={decrement}
          disabled={numericValue === 0}
          className="px-4 py-2 bg-[#FFFEE7]/10 text-[#FFFEE7] hover:bg-[#FFFEE7]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          -
        </button>
        <span className="flex-grow text-center text-xl font-bold text-[#FFFEE7]">{numericValue}</span>
        <button
          onClick={increment}
          disabled={numericValue === max}
          className="px-4 py-2 bg-[#FFFEE7]/10 text-[#FFFEE7] hover:bg-[#FFFEE7]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default QuantitySelector;


import React from 'react';
import { SparklesIcon } from './icons/Icons';

interface CoffeeDescriptionProps {
    description: string;
    isLoading: boolean;
}

const CoffeeDescription: React.FC<CoffeeDescriptionProps> = ({ description, isLoading }) => {
    return (
        <div className="bg-amber-100 border-l-4 border-amber-800 text-amber-900 p-4 rounded-r-lg min-h-[100px] flex items-center">
            <div className="flex items-start space-x-3">
                <SparklesIcon className="w-6 h-6 text-amber-800 flex-shrink-0 mt-1" />
                <div>
                    <p className="font-semibold text-sm mb-1">Your Unique Creation</p>
                    {isLoading ? (
                        <div className="space-y-2 animate-pulse">
                            <div className="h-4 bg-amber-200 rounded w-3/4"></div>
                            <div className="h-4 bg-amber-200 rounded w-1/2"></div>
                        </div>
                    ) : (
                        <p className="text-sm italic">{description}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CoffeeDescription;

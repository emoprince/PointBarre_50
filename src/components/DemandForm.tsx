import React, { useState } from 'react';
import { CoffeeOrder } from '../types';

interface DemandFormProps {
  order: CoffeeOrder;
  totalPrice: number;
}

const DemandForm: React.FC<DemandFormProps> = ({ order, totalPrice }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const createMailtoLink = () => {
    const subject = encodeURIComponent(`Coffee Order Inquiry from ${name}`);
    let body = `Hello, I'm interested in the following coffee order:\n\n`;
    body += `- Base: ${order.coffeeType}\n`;
    body += `- Size: ${order.size}\n`;
    body += `- Milk: ${order.milk}\n`;
    body += `- Syrup: ${order.syrup}\n`;
    body += `- Extra Shots: ${order.extraShots}\n\n`;
    body += `Calculated Price: $${totalPrice.toFixed(2)}\n\n`;
    body += `Please let me know about availability.\n\n`;
    body += `Thanks,\n${name}\n(${email})`;
    
    return `mailto:your-email@example.com?subject=${subject}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="mt-6 p-6 bg-white rounded-xl shadow-sm border border-stone-200">
      <h3 className="text-lg font-semibold text-stone-700 mb-4">Send Your Demand</h3>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-700 focus:border-amber-700 outline-none transition"
        />
        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-700 focus:border-amber-700 outline-none transition"
        />
        <a
          href={createMailtoLink()}
          className="w-full text-center block bg-amber-800 text-white font-bold py-3 px-4 rounded-lg hover:bg-amber-900 transition-colors duration-300 shadow-md"
        >
          Send via Email
        </a>
        <p className="text-xs text-center text-stone-500">
          This will open your default email client.
        </p>
      </div>
    </div>
  );
};

export default DemandForm;

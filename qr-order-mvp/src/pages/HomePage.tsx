import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils, QrCode, ArrowRight } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="px-6 py-12 flex flex-col items-center justify-center min-h-[80vh] text-center">
      <div className="w-20 h-20 bg-orange-600 rounded-3xl flex items-center justify-center text-white mb-8 shadow-xl shadow-orange-600/20">
        <Utensils size={40} />
      </div>
      
      <h1 className="text-4xl font-black text-stone-900 mb-4 tracking-tight">
        Welcome to <span className="text-orange-600">QR Order</span>
      </h1>
      <p className="text-stone-500 mb-12 max-w-xs mx-auto font-medium leading-relaxed">
        Experience the future of dining. Scan, order, and pay right from your table.
      </p>

      <div className="grid gap-4 w-full max-w-xs">
        <Link 
          to="/menu?table=5" 
          className="bg-stone-900 text-white w-full py-5 rounded-3xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-stone-900/10"
        >
          <QrCode size={24} />
          <span>Scan Table 5</span>
        </Link>
        
        <Link 
          to="/admin" 
          className="bg-white text-stone-900 border border-stone-200 w-full py-5 rounded-3xl font-bold flex items-center justify-center gap-3 shadow-sm"
        >
          <span>Admin Dashboard</span>
          <ArrowRight size={20} />
        </Link>
      </div>

      <div className="mt-16 pt-8 border-t border-stone-100 w-full max-w-xs">
        <p className="text-stone-400 text-xs font-bold uppercase tracking-widest">
          Powered by AI Studio
        </p>
      </div>
    </div>
  );
};

export default HomePage;

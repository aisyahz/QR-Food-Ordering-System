import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils, QrCode, ArrowRight } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="px-6 py-12 flex flex-col items-center justify-center min-h-[80vh] text-center">
      <div className="w-20 h-20 bg-orange-600 rounded-3xl flex items-center justify-center text-white mb-8 shadow-xl shadow-orange-600/20">
        <Utensils size={40} />
      </div>
      
      <h1 className="text-5xl font-black text-stone-900 mb-6 tracking-tight">
        Scan. Order. <span className="text-orange-600">Done.</span>
      </h1>
      <p className="text-stone-600 mb-12 max-w-xs mx-auto font-semibold text-xl leading-relaxed">
        So easy even Grandpa can use it.
      </p>

      <div className="grid gap-4 w-full max-w-xs">
        <Link 
          to="/menu?table=5" 
          className="bg-stone-900 text-white w-full py-6 rounded-3xl font-bold text-xl flex items-center justify-center gap-3 shadow-xl shadow-stone-900/10"
        >
          <QrCode size={28} />
          <span>Scan Menu</span>
        </Link>
        
        <Link 
          to="/admin" 
          className="p-4 text-stone-400 text-sm font-medium hover:text-stone-600 transition-colors"
        >
          Admin Dashboard
        </Link>
      </div>

      <div className="mt-16 pt-8 border-t border-stone-100 w-full max-w-xs">
        <p className="text-stone-400 text-xs font-bold uppercase tracking-widest">
          AtokOrder
        </p>
      </div>
    </div>
  );
};

export default HomePage;

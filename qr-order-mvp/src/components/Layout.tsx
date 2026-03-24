import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, LayoutDashboard, Utensils } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { totalItems } = useCart();
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans pb-20 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200 px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Utensils className="text-orange-600" size={24} />
          <span className="font-bold text-xl tracking-tight">QR Order</span>
        </Link>
        <div className="flex gap-4">
          <Link to="/admin" className="p-2 text-stone-500 hover:text-orange-600 transition-colors">
            <LayoutDashboard size={20} />
          </Link>
          {!isAdminPage && (
            <Link to="/cart" className="relative p-2 text-stone-500 hover:text-orange-600 transition-colors">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto min-h-[calc(100vh-60px)] md:max-w-2xl lg:max-w-4xl">
        {children}
      </main>

      {/* Mobile Sticky Cart Button (only on menu) */}
      {location.pathname === '/menu' && totalItems > 0 && (
        <div className="fixed bottom-6 left-0 right-0 px-4 z-40 md:hidden">
          <Link 
            to="/cart" 
            className="bg-orange-600 text-white w-full py-4 rounded-2xl shadow-xl shadow-orange-600/20 flex justify-between items-center px-6 font-bold"
          >
            <div className="flex items-center gap-2">
              <ShoppingCart size={20} />
              <span>{totalItems} items</span>
            </div>
            <span>View Cart</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Layout;

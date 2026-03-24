import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { MenuItem } from '../types';
import { useCart } from '../context/CartContext';
import { Plus, Minus } from 'lucide-react';
import { seedMenu } from '../services/seedService';

const MenuPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tableNumber = searchParams.get('table') || '1';
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const { addToCart, cart, updateQuantity } = useCart();

  useEffect(() => {
    // Seed if empty
    seedMenu();

    const path = 'menu_items';
    const q = query(collection(db, path), where('available', '==', true));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));
      setMenuItems(items);
      const cats = ['All', ...new Set(items.map(i => i.category))];
      setCategories(cats);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    });

    return () => unsubscribe();
  }, []);

  const filteredItems = selectedCategory === 'All' 
    ? menuItems 
    : menuItems.filter(i => i.category === selectedCategory);

  const getCartQuantity = (itemId: string) => {
    return cart.find(i => i.id === itemId)?.quantity || 0;
  };

  return (
    <div className="px-4 py-6">
      {/* Table Header */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-stone-900">Our Menu</h1>
          <p className="text-stone-500 font-medium">Table {tableNumber}</p>
        </div>
        <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          Mobile Order
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 mb-6">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat 
                ? 'bg-stone-900 text-white shadow-lg shadow-stone-900/20' 
                : 'bg-white text-stone-500 border border-stone-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu List */}
      <div className="grid gap-6">
        {filteredItems.map(item => {
          const quantity = getCartQuantity(item.id);
          return (
            <div key={item.id} className="bg-white rounded-3xl p-4 flex gap-4 border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex-grow flex flex-col justify-between py-1">
                <div>
                  <h3 className="font-bold text-stone-900 leading-tight">{item.name}</h3>
                  <p className="text-stone-400 text-xs mt-1 line-clamp-2">{item.description}</p>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-black text-orange-600">RM {item.price.toFixed(2)}</span>
                  
                  {quantity > 0 ? (
                    <div className="flex items-center gap-3 bg-stone-100 rounded-full px-2 py-1">
                      <button 
                        onClick={() => updateQuantity(item.id, quantity - 1)}
                        className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-stone-900 shadow-sm"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="font-bold text-sm w-4 text-center">{quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, quantity + 1)}
                        className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-stone-900 shadow-sm"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => addToCart(item)}
                      className="bg-stone-900 text-white p-2 rounded-xl hover:bg-orange-600 transition-colors"
                    >
                      <Plus size={20} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MenuPage;

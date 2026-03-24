import React from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, subtotal, totalItems } = useCart();
  const [searchParams] = useSearchParams();
  const tableNumber = searchParams.get('table') || '1';
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] px-6 text-center">
        <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={40} className="text-stone-300" />
        </div>
        <h2 className="text-2xl font-bold text-stone-900 mb-2">Your cart is empty</h2>
        <p className="text-stone-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link 
          to={`/menu?table=${tableNumber}`} 
          className="bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-orange-600/20"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-xl border border-stone-200">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">Your Cart</h1>
      </div>

      <div className="grid gap-4 mb-8">
        {cart.map(item => (
          <div key={item.id} className="bg-white rounded-3xl p-4 flex gap-4 border border-stone-100 shadow-sm">
            <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="flex-grow flex flex-col justify-between py-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-stone-900 leading-tight">{item.name}</h3>
                  <p className="text-orange-600 font-bold text-sm">RM {item.price.toFixed(2)}</p>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-stone-300 hover:text-red-500">
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center gap-3 bg-stone-100 rounded-full px-2 py-1">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-stone-900 shadow-sm">
                    <Minus size={16} />
                  </button>
                  <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-stone-900 shadow-sm">
                    <Plus size={16} />
                  </button>
                </div>
                <span className="font-bold text-stone-900">RM {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm mb-24">
        <h3 className="font-bold text-lg mb-4">Order Summary</h3>
        <div className="flex justify-between mb-2 text-stone-500">
          <span>Subtotal ({totalItems} items)</span>
          <span>RM {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-4 text-stone-500">
          <span>Service Tax (0%)</span>
          <span>RM 0.00</span>
        </div>
        <div className="h-px bg-stone-100 mb-4"></div>
        <div className="flex justify-between items-center">
          <span className="font-bold text-xl">Total</span>
          <span className="font-black text-2xl text-orange-600">RM {subtotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Fixed Checkout Button */}
      <div className="fixed bottom-6 left-0 right-0 px-4 z-40 md:relative md:bottom-0 md:px-0">
        <Link 
          to={`/checkout?table=${tableNumber}`} 
          className="bg-stone-900 text-white w-full py-4 rounded-2xl shadow-xl shadow-stone-900/20 flex justify-center items-center font-bold text-lg"
        >
          Checkout Now
        </Link>
      </div>
    </div>
  );
};

export default CartPage;

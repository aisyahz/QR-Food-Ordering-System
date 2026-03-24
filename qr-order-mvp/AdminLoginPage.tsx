import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useCart } from '../context/CartContext';
import { ArrowLeft, CreditCard, ShieldCheck, Loader2 } from 'lucide-react';

const CheckoutPage: React.FC = () => {
  const { cart, subtotal, clearCart } = useCart();
  const [searchParams] = useSearchParams();
  const tableNumber = searchParams.get('table') || '1';
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayNow = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const orderData = {
        tableNumber,
        items: cart.map(item => ({
          menuItemId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        subtotal,
        total: subtotal,
        paymentStatus: 'paid',
        orderStatus: 'new',
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'orders'), orderData);
      clearCart();
      navigate(`/success?orderId=${docRef.id}`);
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="px-4 py-6">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-xl border border-stone-200">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">Checkout</h1>
      </div>

      {/* Table & Order Info */}
      <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-stone-500 font-medium">Table Number</span>
          <span className="font-bold text-lg">Table {tableNumber}</span>
        </div>
        <div className="h-px bg-stone-100 mb-4"></div>
        <div className="flex justify-between items-center">
          <span className="text-stone-500 font-medium">Total Amount</span>
          <span className="font-black text-2xl text-orange-600">RM {subtotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm mb-8">
        <h3 className="font-bold text-lg mb-4">Payment Method</h3>
        <div className="flex items-center gap-4 p-4 rounded-2xl border-2 border-orange-600 bg-orange-50">
          <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center text-white">
            <CreditCard size={24} />
          </div>
          <div className="flex-grow">
            <p className="font-bold text-stone-900">Online Payment</p>
            <p className="text-xs text-stone-500">Billplz / ToyyibPay / FPX</p>
          </div>
          <ShieldCheck className="text-orange-600" size={24} />
        </div>
      </div>

      {/* Security Note */}
      <div className="flex items-center gap-3 px-4 mb-8 text-stone-400 text-sm">
        <ShieldCheck size={18} />
        <p>Your payment is secured with 256-bit encryption.</p>
      </div>

      {/* Pay Button */}
      <button 
        onClick={handlePayNow}
        disabled={isProcessing}
        className="bg-stone-900 text-white w-full py-5 rounded-2xl shadow-xl shadow-stone-900/20 flex justify-center items-center font-bold text-lg disabled:opacity-70"
      >
        {isProcessing ? (
          <div className="flex items-center gap-3">
            <Loader2 className="animate-spin" size={20} />
            <span>Processing...</span>
          </div>
        ) : (
          <span>Pay Now RM {subtotal.toFixed(2)}</span>
        )}
      </button>
    </div>
  );
};

export default CheckoutPage;

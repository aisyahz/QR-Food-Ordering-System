import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Order } from '../types';
import { CheckCircle2, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

const SuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      const fetchOrder = async () => {
        const docRef = doc(db, 'orders', orderId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setOrder({ id: docSnap.id, ...docSnap.data() } as Order);
        }
        setLoading(false);
      };
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <Loader2 className="animate-spin text-orange-600 mb-4" size={40} />
        <p className="text-stone-500 font-medium">Fetching your order details...</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-12 flex flex-col items-center text-center">
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-8"
      >
        <CheckCircle2 size={48} />
      </motion.div>

      <h1 className="text-3xl font-black text-stone-900 mb-2">Payment Successful!</h1>
      <p className="text-stone-500 mb-8">Your order has been received and is being prepared.</p>

      {order && (
        <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm w-full mb-8 text-left">
          <div className="flex justify-between items-center mb-4">
            <span className="text-stone-400 text-sm font-medium">Order ID</span>
            <span className="font-mono text-xs text-stone-500">#{order.id.slice(-8).toUpperCase()}</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-stone-400 text-sm font-medium">Table</span>
            <span className="font-bold">Table {order.tableNumber}</span>
          </div>
          <div className="h-px bg-stone-100 mb-4"></div>
          <div className="space-y-3 mb-4">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-stone-600">{item.quantity}x {item.name}</span>
                <span className="font-bold">RM {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="h-px bg-stone-100 mb-4"></div>
          <div className="flex justify-between items-center">
            <span className="font-bold">Total Paid</span>
            <span className="font-black text-xl text-orange-600">RM {order.total.toFixed(2)}</span>
          </div>
        </div>
      )}

      <div className="grid gap-4 w-full">
        <Link 
          to="/menu" 
          className="bg-stone-900 text-white w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
        >
          <ShoppingBag size={20} />
          <span>Order More</span>
        </Link>
        <Link 
          to="/" 
          className="text-stone-500 font-bold flex items-center justify-center gap-2 py-2"
        >
          <span>Back to Home</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
};

export default SuccessPage;

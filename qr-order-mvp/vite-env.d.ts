import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Order, OrderStatus } from '../types';
import { Clock, CheckCircle, Package, AlertCircle, Loader2, LogOut, User, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { Link } from 'react-router-dom';

const AdminPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const stats = {
    new: orders.filter(o => o.orderStatus === 'new').length,
    preparing: orders.filter(o => o.orderStatus === 'preparing').length,
    completed: orders.filter(o => o.orderStatus === 'completed').length,
    totalRevenue: orders.reduce((acc, o) => o.orderStatus === 'completed' ? acc + o.total : acc, 0)
  };

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
      setOrders(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { orderStatus: status });
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'new': return <AlertCircle className="text-orange-600" size={18} />;
      case 'preparing': return <Clock className="text-blue-600" size={18} />;
      case 'completed': return <CheckCircle className="text-green-600" size={18} />;
      case 'cancelled': return <Package className="text-stone-400" size={18} />;
      default: return <Package className="text-stone-400" size={18} />;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'new': return 'bg-orange-100 text-orange-700';
      case 'preparing': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-stone-100 text-stone-700';
      default: return 'bg-stone-100 text-stone-700';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <Loader2 className="animate-spin text-orange-600 mb-4" size={40} />
        <p className="text-stone-500 font-medium">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-stone-900">Admin Dashboard</h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="bg-stone-900 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
              Live Orders
            </div>
            {user && (
              <div className="flex items-center gap-1.5 text-stone-400 text-[10px] font-bold uppercase tracking-wider ml-2">
                <User size={12} />
                {user.email}
              </div>
            )}
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 bg-stone-100 text-stone-600 px-6 py-3 rounded-2xl font-bold text-sm hover:bg-stone-200 transition-colors"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-[32px] border border-stone-100 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">New</p>
          <p className="text-2xl font-black text-orange-600">{stats.new}</p>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-stone-100 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">Preparing</p>
          <p className="text-2xl font-black text-blue-600">{stats.preparing}</p>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-stone-100 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">Completed</p>
          <p className="text-2xl font-black text-green-600">{stats.completed}</p>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-stone-100 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">Revenue</p>
          <p className="text-2xl font-black text-stone-900">RM {stats.totalRevenue.toFixed(0)}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-stone-900">Recent Orders</h2>
        <Link 
          to="/admin/menu" 
          className="flex items-center gap-2 text-orange-600 font-bold text-sm hover:underline"
        >
          <Edit2 size={16} />
          Manage Menu
        </Link>
      </div>

      <div className="grid gap-6">
        <AnimatePresence>
          {orders.map(order => (
            <motion.div 
              key={order.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-black text-xl">Table {order.tableNumber}</span>
                    <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                  <p className="text-stone-400 text-xs font-mono">#{order.id.slice(-8).toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-orange-600 text-lg">RM {order.total.toFixed(2)}</p>
                  <p className="text-stone-400 text-[10px]">{order.createdAt?.toDate().toLocaleTimeString()}</p>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-stone-600 font-medium">{item.quantity}x {item.name}</span>
                    <span className="text-stone-400">RM {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                {order.orderStatus === 'new' && (
                  <button 
                    onClick={() => updateStatus(order.id, 'preparing')}
                    className="flex-grow bg-blue-600 text-white py-3 rounded-2xl font-bold text-sm hover:bg-blue-700 transition-colors"
                  >
                    Start Preparing
                  </button>
                )}
                {order.orderStatus === 'preparing' && (
                  <button 
                    onClick={() => updateStatus(order.id, 'completed')}
                    className="flex-grow bg-green-600 text-white py-3 rounded-2xl font-bold text-sm hover:bg-green-700 transition-colors"
                  >
                    Mark Completed
                  </button>
                )}
                {order.orderStatus !== 'completed' && order.orderStatus !== 'cancelled' && (
                  <button 
                    onClick={() => updateStatus(order.id, 'cancelled')}
                    className="px-4 bg-stone-100 text-stone-500 py-3 rounded-2xl font-bold text-sm hover:bg-stone-200 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {orders.length === 0 && (
          <div className="text-center py-20">
            <Package size={48} className="text-stone-200 mx-auto mb-4" />
            <p className="text-stone-400 font-medium">No orders yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;

import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, doc, updateDoc, addDoc, deleteDoc, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { MenuItem } from '../types';
import { Plus, Edit2, Trash2, Save, X, Check, AlertCircle, Loader2, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

const MenuManagementPage: React.FC = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'menu_items'), orderBy('category'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const menuItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));
      setItems(menuItems);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleToggleAvailability = async (item: MenuItem) => {
    try {
      const itemRef = doc(db, 'menu_items', item.id);
      await updateDoc(itemRef, { available: !item.available });
    } catch (err) {
      console.error("Error toggling availability:", err);
      setError("Failed to update availability.");
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await deleteDoc(doc(db, 'menu_items', id));
    } catch (err) {
      console.error("Error deleting item:", err);
      setError("Failed to delete item.");
    }
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setLoading(true);
    setError(null);

    try {
      const { id, ...data } = editingItem;
      if (isAdding) {
        await addDoc(collection(db, 'menu_items'), data);
        setIsAdding(false);
      } else {
        await updateDoc(doc(db, 'menu_items', id), data);
      }
      setEditingItem(null);
    } catch (err: any) {
      console.error("Error saving item:", err);
      setError(err.message || "Failed to save item.");
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (item: MenuItem) => {
    setEditingItem({ ...item });
    setIsAdding(false);
  };

  const startAdding = () => {
    setEditingItem({
      id: '',
      name: '',
      description: '',
      price: 0,
      category: 'Main Dish',
      imageUrl: 'https://picsum.photos/seed/food/400/300',
      available: true
    });
    setIsAdding(true);
  };

  if (loading && items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <Loader2 className="animate-spin text-orange-600 mb-4" size={40} />
        <p className="text-stone-500 font-medium">Loading menu...</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link to="/admin" className="p-2 hover:bg-stone-100 rounded-full transition-colors">
            <ArrowLeft size={24} className="text-stone-600" />
          </Link>
          <h1 className="text-3xl font-black text-stone-900">Menu Management</h1>
        </div>
        
        <button 
          onClick={startAdding}
          className="flex items-center justify-center gap-2 bg-stone-900 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-stone-800 transition-colors"
        >
          <Plus size={18} />
          Add New Item
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium flex items-center gap-3">
          <AlertCircle size={18} />
          {error}
          <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="grid gap-4">
        {items.map(item => (
          <motion.div 
            key={item.id}
            layout
            className="bg-white rounded-3xl p-4 border border-stone-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center"
          >
            <img 
              src={item.imageUrl} 
              alt={item.name}
              className="w-20 h-20 rounded-2xl object-cover bg-stone-100"
              referrerPolicy="no-referrer"
            />
            
            <div className="flex-grow text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <h3 className="font-black text-lg text-stone-900">{item.name}</h3>
                <span className="bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  {item.category}
                </span>
              </div>
              <p className="text-stone-400 text-xs line-clamp-1">{item.description}</p>
              <p className="font-black text-orange-600 mt-1">RM {item.price.toFixed(2)}</p>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleToggleAvailability(item)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                  item.available 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                }`}
              >
                {item.available ? 'Available' : 'Sold Out'}
              </button>
              
              <button 
                onClick={() => startEditing(item)}
                className="p-3 bg-stone-100 text-stone-600 rounded-xl hover:bg-stone-200 transition-colors"
              >
                <Edit2 size={18} />
              </button>
              
              <button 
                onClick={() => handleDeleteItem(item.id)}
                className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Edit/Add Modal */}
      <AnimatePresence>
        {editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[40px] overflow-hidden shadow-2xl"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-black text-stone-900">
                    {isAdding ? 'Add New Item' : 'Edit Menu Item'}
                  </h2>
                  <button onClick={() => setEditingItem(null)} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
                    <X size={24} className="text-stone-400" />
                  </button>
                </div>

                <form onSubmit={handleSaveItem} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1.5 ml-1">Item Name</label>
                    <input 
                      required
                      type="text"
                      value={editingItem.name}
                      onChange={e => setEditingItem({...editingItem, name: e.target.value})}
                      className="w-full bg-stone-50 border-none rounded-2xl px-5 py-4 font-bold text-stone-900 focus:ring-2 focus:ring-orange-500 transition-all"
                      placeholder="e.g. Nasi Lemak Special"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1.5 ml-1">Price (RM)</label>
                      <input 
                        required
                        type="number"
                        step="0.01"
                        value={editingItem.price}
                        onChange={e => setEditingItem({...editingItem, price: parseFloat(e.target.value)})}
                        className="w-full bg-stone-50 border-none rounded-2xl px-5 py-4 font-bold text-stone-900 focus:ring-2 focus:ring-orange-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1.5 ml-1">Category</label>
                      <select 
                        value={editingItem.category}
                        onChange={e => setEditingItem({...editingItem, category: e.target.value})}
                        className="w-full bg-stone-50 border-none rounded-2xl px-5 py-4 font-bold text-stone-900 focus:ring-2 focus:ring-orange-500 transition-all appearance-none"
                      >
                        <option value="Main Dish">Main Dish</option>
                        <option value="Drinks">Drinks</option>
                        <option value="Dessert">Dessert</option>
                        <option value="Snacks">Snacks</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1.5 ml-1">Description</label>
                    <textarea 
                      required
                      rows={3}
                      value={editingItem.description}
                      onChange={e => setEditingItem({...editingItem, description: e.target.value})}
                      className="w-full bg-stone-50 border-none rounded-2xl px-5 py-4 font-bold text-stone-900 focus:ring-2 focus:ring-orange-500 transition-all resize-none"
                      placeholder="Describe the dish..."
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1.5 ml-1">Image URL</label>
                    <div className="flex gap-2">
                      <input 
                        required
                        type="url"
                        value={editingItem.imageUrl}
                        onChange={e => setEditingItem({...editingItem, imageUrl: e.target.value})}
                        className="flex-grow bg-stone-50 border-none rounded-2xl px-5 py-4 font-bold text-stone-900 focus:ring-2 focus:ring-orange-500 transition-all"
                      />
                      <div className="w-14 h-14 bg-stone-100 rounded-2xl flex items-center justify-center overflow-hidden border border-stone-200">
                        {editingItem.imageUrl ? (
                          <img src={editingItem.imageUrl} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <ImageIcon className="text-stone-300" size={20} />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button 
                      type="button"
                      onClick={() => setEditingItem(null)}
                      className="flex-grow bg-stone-100 text-stone-600 py-4 rounded-2xl font-black text-sm hover:bg-stone-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={loading}
                      className="flex-grow bg-stone-900 text-white py-4 rounded-2xl font-black text-sm hover:bg-stone-800 transition-colors flex items-center justify-center gap-2"
                    >
                      {loading ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
                      {isAdding ? 'Create Item' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MenuManagementPage;

import React, { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Loader2, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

const AdminLoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || "/admin";

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error("Login Error:", err);
      setError(err.message || "Failed to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[40px] p-10 shadow-xl border border-stone-100 text-center"
      >
        <div className="w-20 h-20 bg-orange-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
          <ShieldAlert className="text-orange-600" size={40} />
        </div>
        
        <h1 className="text-3xl font-black text-stone-900 mb-4">Admin Access</h1>
        <p className="text-stone-500 mb-10 leading-relaxed">
          Please sign in with your authorized Google account to access the kitchen dashboard.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium flex items-center gap-3">
            <ShieldAlert size={18} />
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-stone-900 text-white py-5 rounded-[24px] font-black text-lg flex items-center justify-center gap-3 hover:bg-stone-800 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={24} />
          ) : (
            <>
              <LogIn size={24} />
              Sign in with Google
            </>
          )}
        </button>
        
        <p className="mt-8 text-[10px] text-stone-400 uppercase tracking-[0.2em] font-bold">
          Authorized Personnel Only
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;

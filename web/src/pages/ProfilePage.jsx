import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/firebaseConfig';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { User, Package, MapPin, Settings, LogOut, Loader2, ChevronRight, ShoppingBag } from 'lucide-react';
import { formatCurrency } from '@/api/EcommerceApi';

const ProfilePage = () => {
  const { user, profile, signOut, updateProfile } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState('orders');

  // Form states
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone_number || '');
  const [address, setAddress] = useState(profile?.address || '');
  const [city, setCity] = useState(profile?.city || '');
  const [zipCode, setZipCode] = useState(profile?.zip_code || '');

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const ordersCol = collection(db, 'orders');
      const q = query(
        ordersCol, 
        where('user_id', '==', user.uid),
        orderBy('created_at', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const ordersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    const { error } = await updateProfile({
      full_name: fullName,
      phone_number: phone,
      address: address,
      city: city,
      zip_code: zipCode
    });
    
    if (error) {
      toast.error('Failed to update profile');
    } else {
      toast.success('Profile updated successfully');
    }
    setUpdating(false);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full lg:w-80 space-y-4">
            <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-xl truncate w-40">{profile?.full_name || 'User'}</h2>
                  <p className="text-zinc-500 text-sm truncate w-40">{user.email}</p>
                </div>
              </div>

              <nav className="space-y-1">
                <SidebarItem 
                  icon={<Package className="w-5 h-5" />} 
                  label="My Orders" 
                  active={activeTab === 'orders'} 
                  onClick={() => setActiveTab('orders')} 
                />
                <SidebarItem 
                  icon={<Settings className="w-5 h-5" />} 
                  label="Settings" 
                  active={activeTab === 'settings'} 
                  onClick={() => setActiveTab('settings')} 
                />
                <button 
                  onClick={signOut}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8"
            >
              {activeTab === 'orders' ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Order History</h1>
                    <span className="bg-zinc-800 px-3 py-1 rounded-full text-xs text-zinc-400">
                      {orders.length} Orders
                    </span>
                  </div>

                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
                      <Loader2 className="w-8 h-8 animate-spin mb-4" />
                      <p>Loading your orders...</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-20 bg-zinc-800/30 rounded-3xl border border-dashed border-zinc-700">
                      <ShoppingBag className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-zinc-300">No orders yet</h3>
                      <p className="text-zinc-500 mt-2">Your purchase history will appear here.</p>
                      <Button className="mt-6 bg-white text-black hover:bg-zinc-200 rounded-full px-8">
                        Start Shopping
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <OrderCard key={order.id} order={order} />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-8">
                  <h1 className="text-2xl font-bold">Account Settings</h1>
                  
                  <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-xl">
                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-zinc-400">Full Name</Label>
                        <Input 
                          id="fullName"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="bg-zinc-800/50 border-zinc-700 text-white rounded-xl h-12"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-zinc-400">Phone Number</Label>
                        <Input 
                          id="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder=""
                          className="bg-zinc-800/50 border-zinc-700 text-white rounded-xl h-12"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address" className="text-zinc-400">Shipping Address (House, Road, Area)</Label>
                        <textarea 
                          id="address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder=""
                          className="w-full bg-zinc-800/50 border border-zinc-700 text-white rounded-xl p-4 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city" className="text-zinc-400">District / City</Label>
                          <Input 
                            id="city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder=""
                            className="bg-zinc-800/50 border-zinc-700 text-white rounded-xl h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zip" className="text-zinc-400">Postal Code</Label>
                          <Input 
                            id="zip"
                            value={zipCode}
                            onChange={(e) => setZipCode(e.target.value)}
                            placeholder=""
                            className="bg-zinc-800/50 border-zinc-700 text-white rounded-xl h-12"
                          />
                        </div>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      disabled={updating}
                      className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-8 h-12 font-bold transition-all shadow-lg shadow-blue-600/20"
                    >
                      {updating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Changes'}
                    </Button>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all ${
      active 
        ? 'bg-white/10 text-white shadow-sm ring-1 ring-white/10' 
        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
    }`}
  >
    <div className="flex items-center gap-3">
      {icon}
      <span className="font-medium">{label}</span>
    </div>
    {active && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />}
  </button>
);

const OrderCard = ({ order }) => (
  <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-all group shadow-sm">
    <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
      <div className="flex-1 min-w-[200px]">
        <div className="flex items-center gap-3 mb-2">
          <span className={`text-[10px] uppercase tracking-[0.2em] font-black px-2.5 py-1 rounded-md ${
            order.status === 'delivered' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 
            order.status === 'cancelled' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
            order.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 
            'bg-blue-500/10 text-blue-500 border border-blue-500/20'
          }`}>
            {order.status}
          </span>
          <span className="text-zinc-600 text-[10px] font-mono tracking-tighter">#{order.id.toUpperCase()}</span>
        </div>
        <p className="text-lg font-bold text-white mb-1">{order.items?.length || 0} Products</p>
        <p className="text-xs text-zinc-500">Placed on {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>
      
      <div className="text-right">
        <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold mb-1">Order Total</p>
        <p className="text-2xl font-black text-white">{formatCurrency(order.total_amount_in_cents)}</p>
      </div>
    </div>
    
    {(order.tracking_number || (order.delivered_at && order.status === 'delivered')) && (
      <div className="mb-6 p-4 bg-zinc-800/20 rounded-xl border border-zinc-700/30 space-y-3">
        {order.tracking_number && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-500">Tracking Number</span>
            <span className="font-mono text-blue-400 font-bold">{order.tracking_number}</span>
          </div>
        )}
        {order.delivered_at && order.status === 'delivered' && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-500">Delivered On</span>
            <span className="text-green-500 font-medium">{new Date(order.delivered_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour:'2-digit', minute:'2-digit' })}</span>
          </div>
        )}
      </div>
    )}

    <div className="border-t border-zinc-800/50 pt-4 flex items-center justify-between">
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {order.items?.map((item, i) => (
          <div key={i} className="flex-shrink-0 w-12 h-12 rounded-lg bg-zinc-800 border border-zinc-700 overflow-hidden flex items-center justify-center p-1">
            <img src={item.product_image} alt="" className="w-full h-full object-contain" />
          </div>
        ))}
      </div>
      <button className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 font-bold uppercase tracking-wider transition-all">
        Details <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  </div>
);

export default ProfilePage;

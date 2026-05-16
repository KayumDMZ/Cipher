import React, { useState, useEffect } from 'react';
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy, limit,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, ShoppingBag, LogOut, Plus, Pencil, Trash2,
  Check, X, ChevronDown, TrendingUp, Users, DollarSign, RefreshCw, Image, Loader2,
} from 'lucide-react';
import { formatCurrency } from '@/api/EcommerceApi';

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const statusStyle = (s) => {
  switch (s) {
    case 'delivered':  return 'bg-green-500/15 text-green-400 border-green-500/30';
    case 'shipped':    return 'bg-blue-500/15  text-blue-400  border-blue-500/30';
    case 'processing': return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
    case 'cancelled':  return 'bg-red-500/15   text-red-400   border-red-500/30';
    default:           return 'bg-amber-500/15  text-amber-400  border-amber-500/30';
  }
};

// ── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="relative overflow-hidden rounded-2xl border border-white/8 bg-white/5 backdrop-blur p-6"
  >
    <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10 blur-2xl`} style={{ background: color }} />
    <div className="flex items-center justify-between">
      <div>
        <p className="text-zinc-500 text-xs uppercase tracking-widest font-semibold mb-1">{label}</p>
        <p className="text-3xl font-black text-white">{value}</p>
      </div>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${color}25` }}>
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
    </div>
  </motion.div>
);

// ── Order Detail Modal ────────────────────────────────────────────────────────
const OrderDetailModal = ({ order, onClose, onStatusChange }) => {
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState(order.tracking_number || '');
  const [savingTracking, setSavingTracking] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!order.customer_details?.name && order.user_id) {
        setLoadingProfile(true);
        try {
          const snap = await getDoc(doc(db, 'profiles', order.user_id));
          if (snap.exists()) setProfile(snap.data());
        } catch (e) { console.error('Error fetching profile for order:', e); }
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, [order]);

  const handleSaveTracking = async () => {
    setSavingTracking(true);
    try {
      await onStatusChange(order.id, order.status, { tracking_number: trackingNumber });
      toast.success('Tracking number updated');
    } catch (e) {
      toast.error('Failed to update tracking');
    } finally {
      setSavingTracking(false);
    }
  };

  const name = order.customer_details?.name || profile?.full_name || 'Anonymous';
  const email = order.customer_details?.email || profile?.email || 'No email provided';
  const phone = order.customer_details?.phone || profile?.phone_number || 'No phone provided';

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-zinc-900 border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/8 flex items-center justify-between bg-white/2">
          <div>
            <h3 className="text-xl font-bold">Order Details</h3>
            <p className="text-sm text-zinc-500 font-mono mt-1">#{order.id.toUpperCase()}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Customer & Shipping */}
          <div className="grid grid-cols-2 gap-8">
            <section>
              <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Customer Information</h4>
              <div className="space-y-1">
                {loadingProfile ? (
                  <div className="flex items-center gap-2 text-zinc-500 text-sm">
                    <Loader2 className="w-3 h-3 animate-spin" /> Loading info...
                  </div>
                ) : (
                  <>
                    <p className="font-medium">{name}</p>
                    <p className="text-sm text-zinc-400">{email}</p>
                    <p className="text-sm text-zinc-400">{phone}</p>
                  </>
                )}
              </div>
            </section>
            <section>
              <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Shipping Address</h4>
              <div className="text-sm text-zinc-400 leading-relaxed">
                {order.shipping_address ? (
                  <>
                    <p>{order.shipping_address.address || order.shipping_address.streetAddress}</p>
                    {order.shipping_address.address2 && <p>{order.shipping_address.address2}</p>}
                    <p>{order.shipping_address.city}, {order.shipping_address.state || order.shipping_address.area} {order.shipping_address.zip || order.shipping_address.postalCode}</p>
                    <p>{order.shipping_address.country || 'Bangladesh'}</p>
                  </>
                ) : (
                  <p>No address info</p>
                )}
              </div>
            </section>
          </div>

          {/* Payment & Status */}
          <div className="grid grid-cols-2 gap-8 p-4 bg-white/3 rounded-2xl border border-white/5">
            <section>
              <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Payment</h4>
              <div className="flex items-center gap-2">
                <span className="text-sm uppercase font-bold tracking-widest">{order.payment_method}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                  order.payment_status === 'paid' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}>
                  {order.payment_status || 'unpaid'}
                </span>
              </div>
            </section>
            <section>
              <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Order Status</h4>
              <StatusDropdown value={order.status} onChange={s => onStatusChange(order.id, s)} />
              
              <div className="mt-4 pt-4 border-t border-white/5">
                <h4 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">Tracking Number</h4>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={trackingNumber}
                    onChange={e => setTrackingNumber(e.target.value)}
                    placeholder="Enter tracking #"
                    className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500/50"
                  />
                  <button 
                    onClick={handleSaveTracking}
                    disabled={savingTracking || trackingNumber === (order.tracking_number || '')}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 disabled:opacity-30 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all"
                  >
                    {savingTracking ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Save'}
                  </button>
                </div>
              </div>

              {order.delivered_at && order.status === 'delivered' && (
                <p className="text-[10px] text-zinc-500 mt-2 italic">
                  Delivered on {new Date(order.delivered_at).toLocaleString('en-GB', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}
                </p>
              )}
            </section>
          </div>

          {/* Items */}
          <section>
            <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Order Items</h4>
            <div className="space-y-4">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 bg-white/2 rounded-xl border border-white/5">
                  <div className="w-16 h-16 rounded-lg bg-zinc-800 overflow-hidden flex-shrink-0">
                    <img src={item.product_image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-sm truncate">{item.product_title}</h5>
                    <p className="text-xs text-zinc-500 mt-0.5">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">{formatCurrency(item.price_at_purchase_in_cents)}</p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Subtotal: {formatCurrency(item.price_at_purchase_in_cents * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/8 bg-white/2 flex items-center justify-between">
          <div className="text-sm">
            <span className="text-zinc-500">Total Amount:</span>
            <span className="ml-2 text-xl font-black text-white">{formatCurrency(order.total_amount_in_cents)}</span>
          </div>
          <button onClick={onClose} className="px-6 py-2 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-colors">
            Done
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── Admin Dashboard ───────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('products');

  // Products state
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({ title: '', brand: '', category: '', description: '', image: '', price: '' });
  const [saving, setSaving] = useState(false);

  // Orders state
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Stats
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total_amount_in_cents || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  useEffect(() => { fetchProducts(); fetchOrders(); }, []);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const snap = await getDocs(collection(db, 'products'));
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch { toast.error('Could not load products'); }
    finally { setLoadingProducts(false); }
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const q = query(collection(db, 'orders'), orderBy('created_at', 'desc'), limit(100));
      const snap = await getDocs(q);
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch { toast.error('Could not load orders'); }
    finally { setLoadingOrders(false); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newProduct.title || !newProduct.price) { toast.error('Title and price are required'); return; }
    setSaving(true);
    try {
      await addDoc(collection(db, 'products'), {
        ...newProduct,
        price_in_cents: Math.round(parseFloat(newProduct.price) * 100),
        purchasable: true,
        created_at: serverTimestamp(),
      });
      toast.success('Product created');
      setNewProduct({ title: '', brand: '', category: '', description: '', image: '', price: '' });
      setShowAddForm(false);
      fetchProducts();
    } catch { toast.error('Failed to create product'); }
    finally { setSaving(false); }
  };

  const startEdit = (p) => { setEditingId(p.id); setEditValues({ title: p.title, brand: p.brand, price: (p.price_in_cents || 0) / 100, image: p.image || '' }); };
  const cancelEdit = () => { setEditingId(null); setEditValues({}); };

  const handleUpdate = async (id) => {
    setSaving(true);
    try {
      await updateDoc(doc(db, 'products', id), {
        title: editValues.title,
        brand: editValues.brand,
        image: editValues.image,
        price_in_cents: Math.round(parseFloat(editValues.price) * 100),
        updated_at: serverTimestamp(),
      });
      toast.success('Product updated');
      setEditingId(null);
      fetchProducts();
    } catch { toast.error('Failed to update product'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return;
    try {
      await deleteDoc(doc(db, 'products', id));
      toast.success('Product deleted');
      fetchProducts();
    } catch { toast.error('Failed to delete product'); }
  };

  const handleOrderStatus = async (orderId, status, extraData = {}) => {
    try {
      const updates = { 
        status, 
        updated_at: new Date().toISOString(),
        ...extraData 
      };
      
      if (status === 'delivered') {
        updates.delivered_at = new Date().toISOString();
      }

      await updateDoc(doc(db, 'orders', orderId), updates);
      
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...updates } : o));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, ...updates }));
      }
      toast.success(`Order marked as ${status}`);
    } catch { toast.error('Failed to update order status'); }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) return;
    try {
      await deleteDoc(doc(db, 'orders', orderId));
      setOrders(prev => prev.filter(o => o.id !== orderId));
      toast.success('Order deleted successfully');
    } catch { toast.error('Failed to delete order'); }
  };

  const handleSignOut = async () => { await signOut(); navigate('/login'); };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-white/8 flex flex-col">
        <div className="p-6 border-b border-white/8">
          <h1 className="text-xl font-black tracking-tight">Cipher <span className="text-blue-400">Admin</span></h1>
          <p className="text-zinc-500 text-xs mt-1 truncate">{user?.email}</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: 'products', icon: Package, label: 'Products' },
            { id: 'orders',   icon: ShoppingBag, label: 'Orders' },
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                tab === id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-zinc-400 hover:text-white hover:bg-white/6'
              }`}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/8">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-6xl">

          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={Package}    label="Products"      value={products.length}                     color="#3b82f6" delay={0.0} />
            <StatCard icon={ShoppingBag} label="Orders"       value={orders.length}                       color="#8b5cf6" delay={0.05} />
            <StatCard icon={TrendingUp} label="Pending"       value={pendingOrders}                       color="#f59e0b" delay={0.1} />
            <StatCard icon={DollarSign} label="Revenue"       value={formatCurrency(totalRevenue)}        color="#10b981" delay={0.15} />
          </div>

          <AnimatePresence mode="wait">
            {/* ── PRODUCTS TAB ── */}
            {tab === 'products' && (
              <motion.div key="products" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Product Catalog</h2>
                  <button
                    onClick={() => setShowAddForm(v => !v)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-semibold transition-all"
                  >
                    {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {showAddForm ? 'Cancel' : 'Add Product'}
                  </button>
                </div>

                {/* Add Form */}
                <AnimatePresence>
                  {showAddForm && (
                    <motion.form
                      onSubmit={handleCreate}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6 overflow-hidden"
                    >
                      <h3 className="text-lg font-semibold mb-4">New Product</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[
                          { key: 'title',    placeholder: 'Product Title',      span: 'col-span-2 md:col-span-2' },
                          { key: 'brand',    placeholder: 'Brand (apple/samsung/google)', span: '' },
                          { key: 'category', placeholder: 'Category (phone/tablet/laptop…)', span: '' },
                          { key: 'price',    placeholder: 'Price in BDT', type: 'number', span: '' },
                          { key: 'image',    placeholder: 'Image path', span: 'col-span-2 md:col-span-2' },
                        ].map(({ key, placeholder, span, type }) => (
                          <input
                            key={key}
                            type={type || 'text'}
                            placeholder={placeholder}
                            value={newProduct[key]}
                            onChange={e => setNewProduct(p => ({ ...p, [key]: e.target.value }))}
                            className={`bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 transition-colors ${span}`}
                            required={key === 'title' || key === 'price'}
                          />
                        ))}
                        {newProduct.image && (
                          <div className="flex items-center gap-3 col-span-2 md:col-span-1 bg-black/30 rounded-xl p-2">
                            <Image className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                            <img src={newProduct.image} alt="preview" className="h-12 w-12 object-contain rounded bg-white/5" onError={e => { e.target.style.opacity='0.2'; }} />
                            <span className="text-xs text-zinc-500 truncate">Preview</span>
                          </div>
                        )}
                      </div>
                      <button
                        type="submit"
                        disabled={saving}
                        className="mt-4 flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-500 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                      >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        Create Product
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* Products Table */}
                <div className="bg-white/5 border border-white/8 rounded-2xl overflow-hidden">
                  {loadingProducts ? (
                    <div className="flex items-center justify-center py-20 text-zinc-500">
                      <Loader2 className="w-6 h-6 animate-spin mr-3" /> Loading products...
                    </div>
                  ) : (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/8 text-zinc-500 text-xs uppercase tracking-wider">
                          <th className="px-4 py-4 text-left w-16">Image</th>
                          <th className="px-4 py-4 text-left">Title / Brand</th>
                          <th className="px-4 py-4 text-left">Price</th>
                          <th className="px-4 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map(product => (
                          <tr key={product.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                            <td className="px-4 py-3">
                              <div className="w-12 h-12 bg-white/5 rounded-xl overflow-hidden flex items-center justify-center">
                                <img
                                  src={editingId === product.id ? editValues.image : (product.image || product.image_url)}
                                  alt=""
                                  className="w-10 h-10 object-contain mix-blend-screen"
                                  onError={e => { e.target.style.opacity = '0.15'; }}
                                />
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              {editingId === product.id ? (
                                <div className="space-y-1.5">
                                  <input
                                    value={editValues.title}
                                    onChange={e => setEditValues(v => ({ ...v, title: e.target.value }))}
                                    className="bg-black/40 border border-white/15 rounded-lg px-3 py-1.5 text-sm w-full focus:outline-none focus:border-blue-500/50"
                                  />
                                  <input
                                    value={editValues.image}
                                    onChange={e => setEditValues(v => ({ ...v, image: e.target.value }))}
                                    placeholder="Image path"
                                    className="bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs w-full text-zinc-400 focus:outline-none focus:border-blue-500/50"
                                  />
                                </div>
                              ) : (
                                <>
                                  <p className="font-semibold text-white">{product.title}</p>
                                  <p className="text-zinc-500 text-xs uppercase mt-0.5">{product.brand}</p>
                                </>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              {editingId === product.id ? (
                                <input
                                  type="number"
                                  value={editValues.price}
                                  onChange={e => setEditValues(v => ({ ...v, price: e.target.value }))}
                                  className="bg-black/40 border border-white/15 rounded-lg px-3 py-1.5 text-sm w-28 focus:outline-none focus:border-blue-500/50"
                                />
                              ) : (
                                <span className="font-semibold">{formatCurrency(product.price_in_cents || 0)}</span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-end gap-2">
                                {editingId === product.id ? (
                                  <>
                                    <button onClick={() => handleUpdate(product.id)} disabled={saving}
                                      className="flex items-center gap-1 px-3 py-1.5 bg-green-600/20 text-green-400 hover:bg-green-600/30 rounded-lg text-xs font-semibold transition-all">
                                      <Check className="w-3.5 h-3.5" /> Save
                                    </button>
                                    <button onClick={cancelEdit}
                                      className="flex items-center gap-1 px-3 py-1.5 bg-white/5 text-zinc-400 hover:bg-white/10 rounded-lg text-xs font-semibold transition-all">
                                      <X className="w-3.5 h-3.5" /> Cancel
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button onClick={() => startEdit(product)}
                                      className="flex items-center gap-1 px-3 py-1.5 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg text-xs font-semibold transition-all">
                                      <Pencil className="w-3.5 h-3.5" /> Edit
                                    </button>
                                    <button onClick={() => handleDelete(product.id)}
                                      className="flex items-center gap-1 px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-xs font-semibold transition-all">
                                      <Trash2 className="w-3.5 h-3.5" /> Delete
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </motion.div>
            )}

            {/* ── ORDERS TAB ── */}
            {tab === 'orders' && (
              <motion.div key="orders" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Orders</h2>
                  <button onClick={fetchOrders} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/6 hover:bg-white/10 text-sm font-medium transition-all">
                    <RefreshCw className="w-4 h-4" /> Refresh
                  </button>
                </div>

                <div className="bg-white/5 border border-white/8 rounded-2xl overflow-hidden">
                  {loadingOrders ? (
                    <div className="flex items-center justify-center py-20 text-zinc-500">
                      <Loader2 className="w-6 h-6 animate-spin mr-3" /> Loading orders...
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-20 text-zinc-500">No orders yet.</div>
                  ) : (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/8 text-zinc-500 text-xs uppercase tracking-wider">
                          <th className="px-4 py-4 text-left">Order ID</th>
                          <th className="px-4 py-4 text-left">Date</th>
                          <th className="px-4 py-4 text-left">Items</th>
                          <th className="px-4 py-4 text-left">Total</th>
                          <th className="px-4 py-4 text-left">Status</th>
                          <th className="px-4 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map(order => (
                          <tr key={order.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                            <td className="px-4 py-4 font-mono text-xs text-zinc-400">#{order.id.slice(0,8).toUpperCase()}</td>
                            <td className="px-4 py-4 text-zinc-300 text-xs">
                              {order.created_at ? new Date(order.created_at).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' }) : '—'}
                            </td>
                            <td className="px-4 py-4 text-zinc-300">{order.items?.length ?? 0} items</td>
                            <td className="px-4 py-4 font-bold">{formatCurrency(order.total_amount_in_cents || 0)}</td>
                            <td className="px-4 py-4">
                              <StatusDropdown value={order.status} onChange={s => handleOrderStatus(order.id, s)} />
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center justify-end gap-2">
                                <button onClick={() => setSelectedOrder(order)}
                                  className="px-3 py-1.5 bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 rounded-lg text-xs font-semibold transition-all">
                                  View
                                </button>
                                <button onClick={() => handleDeleteOrder(order.id)}
                                  className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-all">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Order Detail Modal */}
          <AnimatePresence>
            {selectedOrder && (
              <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} onStatusChange={handleOrderStatus} />
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

// ── Status Dropdown ───────────────────────────────────────────────────────────
const StatusDropdown = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest border transition-all ${statusStyle(value)}`}
      >
        {value} <ChevronDown className="w-3 h-3" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute z-50 top-full mt-1 left-0 bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl min-w-[140px]"
          >
            {STATUS_OPTIONS.map(s => (
              <button
                key={s}
                onClick={() => { onChange(s); setOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-widest transition-colors hover:bg-white/8 ${s === value ? 'text-white bg-white/8' : 'text-zinc-400'}`}
              >
                {s}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      {open && <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />}
    </div>
  );
};

export default AdminDashboard;

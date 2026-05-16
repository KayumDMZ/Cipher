import { db } from '../firebaseConfig';
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  where, 
  addDoc, 
  deleteDoc, 
  setDoc,
  orderBy,
  writeBatch,
  updateDoc,
  limit,
} from 'firebase/firestore';

const currencyInfo = {
  currency_code: 'BDT',
  currency_symbol: '৳',
};

// ── Formatting ────────────────────────────────────────────────────────────────
export const formatCurrency = (amountInCents, customCurrencyInfo) => {
  const symbol = customCurrencyInfo?.currency_symbol || currencyInfo.currency_symbol;
  const amount = amountInCents / 100;
  return `${symbol}${new Intl.NumberFormat('en-IN').format(Math.round(amount))}`;
};

// ── Products ──────────────────────────────────────────────────────────────────
export const getProducts = async () => {
  try {
    const productsCol = collection(db, 'products');
    const productSnapshot = await getDocs(productsCol);
    
    if (!productSnapshot.empty) {
      const productList = await Promise.all(productSnapshot.docs.map(async (productDoc) => {
        const p = { id: productDoc.id, ...productDoc.data() };
        
        // Fetch variants for each product
        const variantsCol = collection(db, `products/${p.id}/variants`);
        const variantSnapshot = await getDocs(variantsCol);
        const variants = variantSnapshot.docs.map(vDoc => ({
          id: vDoc.id,
          ...vDoc.data(),
          currency_info: currencyInfo,
          price_formatted: formatCurrency(vDoc.data().price_in_cents, currencyInfo),
          sale_price_formatted: vDoc.data().sale_price_in_cents 
            ? formatCurrency(vDoc.data().sale_price_in_cents, currencyInfo) 
            : null,
        }));

        return {
          ...p,
          image: p.image_url || p.image,
          gsmArenaId: p.gsm_arena_id || p.gsmArenaId,
          variants,
        };
      }));
      return { products: productList };
    }
    return { products: [] };
  } catch (error) {
    console.error('EcommerceApi: Error fetching products from Firestore:', error);
    return { products: [] };
  }
};

export const getProduct = async (id) => {
  try {
    const productRef = doc(db, 'products', id);
    const productSnap = await getDoc(productRef);

    if (productSnap.exists()) {
      const p = { id: productSnap.id, ...productSnap.data() };
      
      const variantsCol = collection(db, `products/${id}/variants`);
      const variantSnapshot = await getDocs(variantsCol);
      const variants = variantSnapshot.docs.map(vDoc => ({
        id: vDoc.id,
        ...vDoc.data(),
        currency_info: currencyInfo,
        price_formatted: formatCurrency(vDoc.data().price_in_cents, currencyInfo),
        sale_price_formatted: vDoc.data().sale_price_in_cents 
          ? formatCurrency(vDoc.data().sale_price_in_cents, currencyInfo) 
          : null,
      }));

      return { product: {
        ...p,
        image: p.image_url || p.image,
        gsmArenaId: p.gsm_arena_id || p.gsmArenaId,
        variants,
      }};
    }
    return { product: null };
  } catch (error) {
    console.error(`EcommerceApi: Error fetching product ${id} from Firestore:`, error);
    return { product: null };
  }
};

/**
 * Fetches variant inventory for a list of product IDs.
 * Guards against undefined/empty product_ids to prevent silent errors.
 */
export const getProductQuantities = async ({ fields, product_ids } = {}) => {
  // Guard: if no product_ids or empty array, skip entirely
  if (!product_ids || !Array.isArray(product_ids) || product_ids.length === 0) {
    return { variants: [] };
  }
  
  try {
    const results = [];
    for (const productId of product_ids) {
      if (!productId) continue;
      const variantsCol = collection(db, `products/${productId}/variants`);
      const variantSnapshot = await getDocs(variantsCol);
      variantSnapshot.docs.forEach(vDoc => {
        results.push({
          id: vDoc.id,
          product_id: productId,
          ...vDoc.data(),
        });
      });
    }
    return { variants: results };
  } catch (error) {
    console.error('EcommerceApi: Error fetching product quantities:', error);
    return { variants: [] };
  }
};

// ── Cart ──────────────────────────────────────────────────────────────────────
export const syncCart = async (userId, cartItems) => {
  try {
    if (!userId) return { success: false };
    const cartRef = doc(db, 'carts', userId);
    await setDoc(cartRef, { items: cartItems, updatedAt: new Date().toISOString() });
    return { success: true };
  } catch (error) {
    console.error('Error syncing cart:', error.message);
    return { success: false, error };
  }
};

export const fetchCart = async (userId) => {
  try {
    if (!userId) return { cartItems: [] };
    const cartRef = doc(db, 'carts', userId);
    const cartSnap = await getDoc(cartRef);
    if (cartSnap.exists()) {
      return { cartItems: cartSnap.data().items || [] };
    }
    return { cartItems: [] };
  } catch (error) {
    console.error('Error fetching cart:', error.message);
    return { cartItems: [] };
  }
};

// ── Orders ────────────────────────────────────────────────────────────────────
export const createOrder = async (userId, cartItems, totalAmount, shippingAddress, paymentDetails, customerDetails = {}) => {
  try {
    if (!userId || !cartItems || cartItems.length === 0) {
      throw new Error('Invalid order data: userId and cartItems are required.');
    }

    const orderData = {
      user_id: userId,
      total_amount_in_cents: totalAmount,
      shipping_address: shippingAddress,
      status: 'pending',
      payment_method: paymentDetails.method,
      payment_status: paymentDetails.method === 'cod' ? 'unpaid' : 'paid',
      payment_info: paymentDetails.info || {},
      customer_details: customerDetails,
      created_at: new Date().toISOString(),
      items: cartItems.map(item => ({
        variant_id: item.variant?.id || '',
        quantity: item.quantity,
        price_at_purchase_in_cents: item.variant?.sale_price_in_cents ?? item.variant?.price_in_cents ?? 0,
        product_title: item.product?.title || '',
        product_image: item.product?.image || '',
      })),
    };

    const ordersCol = collection(db, 'orders');
    const docRef = await addDoc(ordersCol, orderData);
    
    // Clear cart after successful order
    const cartRef = doc(db, 'carts', userId);
    await deleteDoc(cartRef).catch(() => {}); // Non-critical, don't fail order

    return { success: true, orderId: docRef.id };
  } catch (error) {
    console.error('EcommerceApi: Error creating order:', error.message, error);
    return { success: false, error };
  }
};

/**
 * Fetches orders for a specific user (for profile order history).
 */
export const getOrders = async (userId) => {
  try {
    if (!userId) return { orders: [] };
    const ordersCol = collection(db, 'orders');
    const q = query(ordersCol, where('user_id', '==', userId), orderBy('created_at', 'desc'));
    const snapshot = await getDocs(q);
    return {
      orders: snapshot.docs.map(d => ({ id: d.id, ...d.data() })),
    };
  } catch (error) {
    console.error('EcommerceApi: Error fetching user orders:', error);
    return { orders: [] };
  }
};

/**
 * Fetches ALL orders (admin panel).
 */
export const getAdminOrders = async (limitCount = 50) => {
  try {
    const ordersCol = collection(db, 'orders');
    const q = query(ordersCol, orderBy('created_at', 'desc'), limit(limitCount));
    const snapshot = await getDocs(q);
    return {
      orders: snapshot.docs.map(d => ({ id: d.id, ...d.data() })),
    };
  } catch (error) {
    console.error('EcommerceApi: Error fetching admin orders:', error);
    return { orders: [] };
  }
};

/**
 * Updates the status of an order (admin action).
 */
export const updateOrderStatus = async (orderId, status) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, { status, updated_at: new Date().toISOString() });
    return { success: true };
  } catch (error) {
    console.error('EcommerceApi: Error updating order status:', error);
    return { success: false, error };
  }
};

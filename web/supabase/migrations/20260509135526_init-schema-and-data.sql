-- SQL SCHEMA FOR CIPHER STOREFRONT with DROP logic
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS product_variants CASCADE;
DROP TABLE IF EXISTS products CASCADE;

DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;

-- 1. Products Table
CREATE TABLE products (
    id TEXT PRIMARY KEY,
    brand TEXT NOT NULL,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    image_url TEXT,
    gsm_arena_id TEXT,
    ribbon_text TEXT,
    specs JSONB, -- Array of {label, value}
    colors TEXT[], -- Array of color names
    color_images JSONB, -- Object mapping color to image URL
    purchasable BOOLEAN DEFAULT true,
    images JSONB, -- Array of {url}
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Product Variants Table
CREATE TABLE product_variants (
    id TEXT PRIMARY KEY,
    product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    storage TEXT,
    price_in_cents BIGINT NOT NULL,
    sale_price_in_cents BIGINT,
    inventory_quantity INTEGER DEFAULT 0,
    manage_inventory BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Profiles Table (Linked to Supabase Auth)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT,
    phone_number TEXT,
    address TEXT,
    city TEXT,
    zip_code TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Orders Table
CREATE TABLE orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id),
    status TEXT DEFAULT 'pending', -- pending, paid, shipped, delivered, cancelled
    total_amount_in_cents BIGINT NOT NULL,
    currency_code TEXT DEFAULT 'BDT',
    shipping_address JSONB,
    billing_address JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Order Items Table
CREATE TABLE order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    variant_id TEXT REFERENCES product_variants(id),
    quantity INTEGER NOT NULL,
    price_at_purchase_in_cents BIGINT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Reviews Table
CREATE TABLE reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Cart Items Table (Server-side persistence)
CREATE TABLE cart_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    variant_id TEXT REFERENCES product_variants(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, variant_id)
);

-- ROW LEVEL SECURITY (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access for products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public read access for product_variants" ON product_variants FOR SELECT USING (true);
CREATE POLICY "Allow public read access for reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "New users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can view their own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own order items" ON order_items FOR SELECT 
USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));
CREATE POLICY "Users can create their own reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update/delete their own reviews" ON reviews FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own cart" ON cart_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own cart" ON cart_items FOR ALL USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON product_variants FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
-- CIPHER PRODUCTS SEED SQL

-- Product: iPhone 17 Pro
INSERT INTO products (id, brand, category, title, subtitle, description, image_url, gsm_arena_id, ribbon_text, specs, colors, color_images, images) VALUES (
  'iphone-17-pro',
  'apple',
  'phone',
  'iPhone 17 Pro',
  'A19 Pro chip. Pro camera system.',
  'iPhone 17 Pro features the A19 Pro chip, a breakthrough Pro Fusion camera system with all 48MP lenses, the longest zoom ever on iPhone, and the new Center Stage front camera.',
  '/products/iphone-17-pro.png',
  '',
  'New',
  '[{"label":"Brand","value":"Apple"},{"label":"Network","value":"GSM / CDMA / HSPA / EVDO / LTE / 5G"},{"label":"Body","value":"150.0 × 71.9 × 8.75 mm | 206 g | Aluminum chassis, Ceramic Shield back, IP68"},{"label":"Display","value":"6.3-inch Super Retina XDR OLED | 2622 × 1206 px (460 ppi) | ProMotion 1–120Hz | Always-On | 3000 nits peak"},{"label":"Platform","value":"OS: iOS 19 | Chipset: Apple A19 Pro (3 nm) | CPU: 6-core | GPU: 6-core | Neural Engine: 16-core"},{"label":"Memory","value":"128GB/12GB RAM, 256GB/12GB RAM, 512GB/12GB RAM (UFS)"},{"label":"Main Camera","value":"Triple 48MP: Wide f/1.78 + Ultra Wide f/2.2 + Telephoto f/2.8 | 8× optical-quality zoom | 4K@120fps"},{"label":"Selfie Camera","value":"24MP TrueDepth f/1.9 | 4K video | Center Stage"},{"label":"Battery","value":"3,988 mAh | Up to 33 hrs video | MagSafe 30W | USB-C fast charge 50% in 20 min"},{"label":"Connectivity","value":"Wi-Fi 7, Bluetooth 5.3, Ultra Wideband, NFC, USB-C 3.2, Satellite Emergency SOS"},{"label":"Colors","value":"Dark Blue Titanium, Silver, Space Black"}]'::jsonb,
  ARRAY['Dark Blue Titanium', 'Silver', 'Space Black'],
  '{"Dark Blue Titanium":"/products/iphone-17-pro.png","Silver":"/products/iphone-17-pro.png","Space Black":"/products/iphone-17-pro.png"}'::jsonb,
  '[{"url":"/products/iphone-17-pro.png"}]'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  brand = EXCLUDED.brand,
  category = EXCLUDED.category,
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  gsm_arena_id = EXCLUDED.gsm_arena_id,
  ribbon_text = EXCLUDED.ribbon_text,
  specs = EXCLUDED.specs,
  colors = EXCLUDED.colors,
  color_images = EXCLUDED.color_images,
  images = EXCLUDED.images;

INSERT INTO product_variants (id, product_id, title, storage, price_in_cents, sale_price_in_cents, inventory_quantity, manage_inventory) VALUES (
  'ip17p-256',
  'iphone-17-pro',
  '256GB',
  '256GB',
  19700000,
  NULL,
  20,
  TRUE
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  storage = EXCLUDED.storage,
  price_in_cents = EXCLUDED.price_in_cents,
  sale_price_in_cents = EXCLUDED.sale_price_in_cents,
  inventory_quantity = EXCLUDED.inventory_quantity,
  manage_inventory = EXCLUDED.manage_inventory;
INSERT INTO product_variants (id, product_id, title, storage, price_in_cents, sale_price_in_cents, inventory_quantity, manage_inventory) VALUES (
  'ip17p-512',
  'iphone-17-pro',
  '512GB',
  '512GB',
  23600000,
  NULL,
  15,
  TRUE
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  storage = EXCLUDED.storage,
  price_in_cents = EXCLUDED.price_in_cents,
  sale_price_in_cents = EXCLUDED.sale_price_in_cents,
  inventory_quantity = EXCLUDED.inventory_quantity,
  manage_inventory = EXCLUDED.manage_inventory;
INSERT INTO product_variants (id, product_id, title, storage, price_in_cents, sale_price_in_cents, inventory_quantity, manage_inventory) VALUES (
  'ip17p-1tb',
  'iphone-17-pro',
  '1TB',
  '1TB',
  26700000,
  NULL,
  10,
  TRUE
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  storage = EXCLUDED.storage,
  price_in_cents = EXCLUDED.price_in_cents,
  sale_price_in_cents = EXCLUDED.sale_price_in_cents,
  inventory_quantity = EXCLUDED.inventory_quantity,
  manage_inventory = EXCLUDED.manage_inventory;

-- Product: iPhone 16 Pro
INSERT INTO products (id, brand, category, title, subtitle, description, image_url, gsm_arena_id, ribbon_text, specs, colors, color_images, images) VALUES (
  'iphone-16-pro',
  'apple',
  'phone',
  'iPhone 16 Pro',
  'Hello, Apple Intelligence.',
  'The most advanced iPhone ever. With the A18 Pro chip, a 48MP Fusion Camera system, and the stunning new titanium design.',
  '/products/iphone-16-pro.png',
  '13315',
  '',
  '[{"label":"Brand","value":"Apple"},{"label":"Network","value":"GSM / CDMA / HSPA / EVDO / LTE / 5G"},{"label":"Body","value":"149.6 × 71.5 × 8.25 mm | 199 g | Titanium frame, Ceramic Shield front, Textured matte glass back | IP68"},{"label":"Display","value":"6.3-inch Super Retina XDR OLED | 2622 × 1206 px (460 ppi) | ProMotion 1–120Hz | Always-On | 2000 nits peak outdoor"},{"label":"Platform","value":"OS: iOS 18 | Chipset: Apple A18 Pro (3 nm) | CPU: 6-core | GPU: 6-core | Neural Engine: 16-core"},{"label":"Memory","value":"128GB/8GB RAM, 256GB/8GB RAM, 512GB/8GB RAM, 1TB/8GB RAM"},{"label":"Main Camera","value":"48MP Wide f/1.78 + 48MP Ultra Wide f/2.2 + 12MP 5× Telephoto f/2.8 | 4K@120fps ProRes | Camera Control"},{"label":"Selfie Camera","value":"12MP TrueDepth f/1.9 | 4K video | Face ID"},{"label":"Battery","value":"~3582 mAh | Up to 27 hrs video | MagSafe 25W | Qi2 15W | Fast charge 50% in 30 min"},{"label":"Connectivity","value":"Wi-Fi 6E, Bluetooth 5.3, UWB, NFC, USB-C 3.2, Satellite Emergency SOS"},{"label":"Colors","value":"Black Titanium, White Titanium, Natural Titanium, Desert Titanium"}]'::jsonb,
  ARRAY['Black Titanium', 'White Titanium', 'Natural Titanium', 'Desert Titanium'],
  '{"Black Titanium":"/products/iphone-16-pro.png","White Titanium":"/products/iphone-16-pro.png","Natural Titanium":"/products/iphone-16-pro.png","Desert Titanium":"/products/iphone-16-pro.png"}'::jsonb,
  '[{"url":"/products/iphone-16-pro.png"}]'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  brand = EXCLUDED.brand,
  category = EXCLUDED.category,
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  gsm_arena_id = EXCLUDED.gsm_arena_id,
  ribbon_text = EXCLUDED.ribbon_text,
  specs = EXCLUDED.specs,
  colors = EXCLUDED.colors,
  color_images = EXCLUDED.color_images,
  images = EXCLUDED.images;

INSERT INTO product_variants (id, product_id, title, storage, price_in_cents, sale_price_in_cents, inventory_quantity, manage_inventory) VALUES (
  'ip16p-128',
  'iphone-16-pro',
  '128GB',
  '128GB',
  10989000,
  9889000,
  20,
  TRUE
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  storage = EXCLUDED.storage,
  price_in_cents = EXCLUDED.price_in_cents,
  sale_price_in_cents = EXCLUDED.sale_price_in_cents,
  inventory_quantity = EXCLUDED.inventory_quantity,
  manage_inventory = EXCLUDED.manage_inventory;
INSERT INTO product_variants (id, product_id, title, storage, price_in_cents, sale_price_in_cents, inventory_quantity, manage_inventory) VALUES (
  'ip16p-256',
  'iphone-16-pro',
  '256GB',
  '256GB',
  12290000,
  10990000,
  15,
  TRUE
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  storage = EXCLUDED.storage,
  price_in_cents = EXCLUDED.price_in_cents,
  sale_price_in_cents = EXCLUDED.sale_price_in_cents,
  inventory_quantity = EXCLUDED.inventory_quantity,
  manage_inventory = EXCLUDED.manage_inventory;
INSERT INTO product_variants (id, product_id, title, storage, price_in_cents, sale_price_in_cents, inventory_quantity, manage_inventory) VALUES (
  'ip16p-512',
  'iphone-16-pro',
  '512GB',
  '512GB',
  14490000,
  13290000,
  10,
  TRUE
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  storage = EXCLUDED.storage,
  price_in_cents = EXCLUDED.price_in_cents,
  sale_price_in_cents = EXCLUDED.sale_price_in_cents,
  inventory_quantity = EXCLUDED.inventory_quantity,
  manage_inventory = EXCLUDED.manage_inventory;
INSERT INTO product_variants (id, product_id, title, storage, price_in_cents, sale_price_in_cents, inventory_quantity, manage_inventory) VALUES (
  'ip16p-1tb',
  'iphone-16-pro',
  '1TB',
  '1TB',
  16990000,
  15490000,
  6,
  TRUE
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  storage = EXCLUDED.storage,
  price_in_cents = EXCLUDED.price_in_cents,
  sale_price_in_cents = EXCLUDED.sale_price_in_cents,
  inventory_quantity = EXCLUDED.inventory_quantity,
  manage_inventory = EXCLUDED.manage_inventory;

-- Product: MacBook Pro 14"
INSERT INTO products (id, brand, category, title, subtitle, description, image_url, gsm_arena_id, ribbon_text, specs, colors, color_images, images) VALUES (
  'macbook-pro-m5',
  'apple',
  'laptop',
  'MacBook Pro 14"',
  'M5 chip. Supercharged for pros.',
  'The MacBook Pro with M5 chip delivers extraordinary performance with the longest battery life ever in a Mac. Built for the most demanding workflows.',
  '/products/macbook-pro.png',
  NULL,
  'New',
  '[{"label":"Brand","value":"Apple"},{"label":"Model","value":"MacBook Pro 14-inch (2026)"},{"label":"Display","value":"14.2-inch Liquid Retina XDR (Mini-LED) | 3024 × 1964 px (254 ppi) | ProMotion 10–120Hz | 1600 nits peak HDR | 1000 nits SDR"},{"label":"Platform","value":"macOS Sequoia | Apple M5 chip | 10-core CPU (4P+6E) | 14-core GPU | 16-core Neural Engine"},{"label":"Memory","value":"24GB / 48GB / 96GB Unified Memory | 512GB / 1TB / 2TB / 4TB / 8TB SSD"},{"label":"Battery","value":"72.4 Wh | Up to 24 hours video playback | 140W USB-C fast charge"},{"label":"Connectivity","value":"Wi-Fi 7 | Bluetooth 6 | 3× Thunderbolt 5 | HDMI 2.1 | SD card reader | MagSafe 3 | 3.5mm headphone jack"},{"label":"Dimensions","value":"312.6 × 221.2 × 15.5 mm | 1.62 kg"},{"label":"Colors","value":"Silver, Space Black"}]'::jsonb,
  ARRAY['Silver', 'Space Black'],
  '{"Silver":"/products/macbook-pro.png","Space Black":"/products/macbook-pro.png"}'::jsonb,
  '[{"url":"/products/macbook-pro.png"},{"url":"/products/macbook-pro.png"}]'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  brand = EXCLUDED.brand,
  category = EXCLUDED.category,
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  gsm_arena_id = EXCLUDED.gsm_arena_id,
  ribbon_text = EXCLUDED.ribbon_text,
  specs = EXCLUDED.specs,
  colors = EXCLUDED.colors,
  color_images = EXCLUDED.color_images,
  images = EXCLUDED.images;

INSERT INTO product_variants (id, product_id, title, storage, price_in_cents, sale_price_in_cents, inventory_quantity, manage_inventory) VALUES (
  'mbp14-m5-512',
  'macbook-pro-m5',
  'M5 / 24GB / 512GB',
  'M5 / 24GB / 512GB',
  19789000,
  NULL,
  8,
  TRUE
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  storage = EXCLUDED.storage,
  price_in_cents = EXCLUDED.price_in_cents,
  sale_price_in_cents = EXCLUDED.sale_price_in_cents,
  inventory_quantity = EXCLUDED.inventory_quantity,
  manage_inventory = EXCLUDED.manage_inventory;
INSERT INTO product_variants (id, product_id, title, storage, price_in_cents, sale_price_in_cents, inventory_quantity, manage_inventory) VALUES (
  'mbp14-m5-1tb',
  'macbook-pro-m5',
  'M5 / 24GB / 1TB',
  'M5 / 24GB / 1TB',
  21990000,
  NULL,
  6,
  TRUE
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  storage = EXCLUDED.storage,
  price_in_cents = EXCLUDED.price_in_cents,
  sale_price_in_cents = EXCLUDED.sale_price_in_cents,
  inventory_quantity = EXCLUDED.inventory_quantity,
  manage_inventory = EXCLUDED.manage_inventory;
INSERT INTO product_variants (id, product_id, title, storage, price_in_cents, sale_price_in_cents, inventory_quantity, manage_inventory) VALUES (
  'mbp14-m5p-512',
  'macbook-pro-m5',
  'M5 Pro / 24GB / 512GB',
  'M5 Pro / 24GB / 512GB',
  24990000,
  NULL,
  5,
  TRUE
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  storage = EXCLUDED.storage,
  price_in_cents = EXCLUDED.price_in_cents,
  sale_price_in_cents = EXCLUDED.sale_price_in_cents,
  inventory_quantity = EXCLUDED.inventory_quantity,
  manage_inventory = EXCLUDED.manage_inventory;
INSERT INTO product_variants (id, product_id, title, storage, price_in_cents, sale_price_in_cents, inventory_quantity, manage_inventory) VALUES (
  'mbp14-m5p-1tb',
  'macbook-pro-m5',
  'M5 Pro / 24GB / 1TB',
  'M5 Pro / 24GB / 1TB',
  27990000,
  NULL,
  4,
  TRUE
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  storage = EXCLUDED.storage,
  price_in_cents = EXCLUDED.price_in_cents,
  sale_price_in_cents = EXCLUDED.sale_price_in_cents,
  inventory_quantity = EXCLUDED.inventory_quantity,
  manage_inventory = EXCLUDED.manage_inventory;

-- Product: iPad Pro M4
INSERT INTO products (id, brand, category, title, subtitle, description, image_url, gsm_arena_id, ribbon_text, specs, colors, color_images, images) VALUES (
  'ipad-pro-m4',
  'apple',
  'tablet',
  'iPad Pro M4',
  'Thin. So thin. Powerful. So powerful.',
  'The new iPad Pro with the M4 chip delivers another giant leap in performance. Featuring an Ultra Retina XDR OLED display.',
  '/products/ipad-pro-m4.png',
  '12987',
  '',
  '[{"label":"Brand","value":"Apple"},{"label":"Display","value":"13-inch Ultra Retina XDR Tandem OLED | 2752 × 2064 px (264 ppi) | ProMotion 10–120Hz | 1600 nits peak HDR"},{"label":"Platform","value":"iPadOS 18 | Apple M4 chip | 10-core CPU | 10-core GPU | 16-core Neural Engine"},{"label":"Memory","value":"256GB/8GB RAM, 512GB/8GB RAM, 1TB/16GB RAM, 2TB/16GB RAM"},{"label":"Dimensions","value":"281.6 × 215.5 × 5.1 mm | 579 g (Wi-Fi)"},{"label":"Main Camera","value":"12MP Wide f/1.8 | 4K video | LiDAR Scanner | True Tone Flash"},{"label":"Selfie Camera","value":"12MP Ultra Wide landscape f/2.4 | Center Stage"},{"label":"Battery","value":"38.99 Wh | Up to 10 hrs Wi-Fi browsing | USB-C charging"},{"label":"Connectivity","value":"Wi-Fi 6E | Bluetooth 5.3 | USB-C 4 / Thunderbolt 4 | 5G optional | Apple Pencil Pro support"},{"label":"Colors","value":"Space Black, Silver"}]'::jsonb,
  ARRAY['Space Black', 'Silver'],
  '{"Space Black":"/products/ipad-pro-m4.png","Silver":"/products/ipad-pro-m4.png"}'::jsonb,
  '[{"url":"/products/ipad-pro-m4.png"},{"url":"/products/ipad-pro-m4.png"}]'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  brand = EXCLUDED.brand,
  category = EXCLUDED.category,
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  gsm_arena_id = EXCLUDED.gsm_arena_id,
  ribbon_text = EXCLUDED.ribbon_text,
  specs = EXCLUDED.specs,
  colors = EXCLUDED.colors,
  color_images = EXCLUDED.color_images,
  images = EXCLUDED.images;

INSERT INTO product_variants (id, product_id, title, storage, price_in_cents, sale_price_in_cents, inventory_quantity, manage_inventory) VALUES (
  'ipad-pro-256',
  'ipad-pro-m4',
  '256GB Wi-Fi',
  '256GB Wi-Fi',
  14289000,
  NULL,
  12,
  TRUE
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  storage = EXCLUDED.storage,
  price_in_cents = EXCLUDED.price_in_cents,
  sale_price_in_cents = EXCLUDED.sale_price_in_cents,
  inventory_quantity = EXCLUDED.inventory_quantity,
  manage_inventory = EXCLUDED.manage_inventory;
INSERT INTO product_variants (id, product_id, title, storage, price_in_cents, sale_price_in_cents, inventory_quantity, manage_inventory) VALUES (
  'ipad-pro-512',
  'ipad-pro-m4',
  '512GB Wi-Fi',
  '512GB Wi-Fi',
  16490000,
  NULL,
  10,
  TRUE
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  storage = EXCLUDED.storage,
  price_in_cents = EXCLUDED.price_in_cents,
  sale_price_in_cents = EXCLUDED.sale_price_in_cents,
  inventory_quantity = EXCLUDED.inventory_quantity,
  manage_inventory = EXCLUDED.manage_inventory;
INSERT INTO product_variants (id, product_id, title, storage, price_in_cents, sale_price_in_cents, inventory_quantity, manage_inventory) VALUES (
  'ipad-pro-1tb',
  'ipad-pro-m4',
  '1TB Wi-Fi',
  '1TB Wi-Fi',
  20490000,
  NULL,
  8,
  TRUE
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  storage = EXCLUDED.storage,
  price_in_cents = EXCLUDED.price_in_cents,
  sale_price_in_cents = EXCLUDED.sale_price_in_cents,
  inventory_quantity = EXCLUDED.inventory_quantity,
  manage_inventory = EXCLUDED.manage_inventory;
INSERT INTO product_variants (id, product_id, title, storage, price_in_cents, sale_price_in_cents, inventory_quantity, manage_inventory) VALUES (
  'ipad-pro-2tb',
  'ipad-pro-m4',
  '2TB Wi-Fi',
  '2TB Wi-Fi',
  24490000,
  NULL,
  5,
  TRUE
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  storage = EXCLUDED.storage,
  price_in_cents = EXCLUDED.price_in_cents,
  sale_price_in_cents = EXCLUDED.sale_price_in_cents,
  inventory_quantity = EXCLUDED.inventory_quantity,
  manage_inventory = EXCLUDED.manage_inventory;

-- Product: Apple Watch Ultra 3
INSERT INTO products (id, brand, category, title, subtitle, description, image_url, gsm_arena_id, ribbon_text, specs, colors, color_images, images) VALUES (
  'apple-watch-ultra-3',
  'apple',
  'watch',
  'Apple Watch Ultra 3',
  'Adventure awaits.',
  'The most capable Apple Watch ever. Apple Watch Ultra 3 pushes the limits of exploration with the most powerful GPS, brightest display, and longest battery life.',
  '/products/watch-ultra.png',
  '12560',
  'New',
  '[{"label":"Brand","value":"Apple"},{"label":"Model","value":"Apple Watch Ultra 3 (49mm)"},{"label":"Display","value":"49mm LTPO3 OLED Retina | 3000 nits peak | Always-On | Largest ever on Apple Watch"},{"label":"Platform","value":"watchOS 12 | Apple S10 SiP | 4-core Neural Engine | 64GB storage"},{"label":"Health Sensors","value":"ECG + electrical heart sensor | 3rd-gen optical heart sensor | Blood oxygen | Temperature | Depth gauge | Water temperature"},{"label":"Health Features","value":"Hypertension notifications | Sleep score | Sleep apnea detection | Crash Detection | Fall Detection"},{"label":"Battery","value":"Up to 42 hrs standard | Up to 72 hrs Low Power Mode | Fast charge: 12 hrs in 15 min"},{"label":"Connectivity","value":"5G Cellular | Wi-Fi 6 | Bluetooth 5.3 | NFC | Satellite Emergency SOS | Ultra Wideband"},{"label":"Durability","value":"100m water resistance (ISO 22810:2010) | Dive up to 40m | MIL-STD-810H | Titanium case"},{"label":"Colors","value":"Natural Titanium, Black Titanium"}]'::jsonb,
  ARRAY['Natural Titanium', 'Black Titanium'],
  '{"Natural Titanium":"/products/watch-ultra.png","Black Titanium":"/products/watch-ultra.png"}'::jsonb,
  '[{"url":"/products/watch-ultra.png"},{"url":"/products/watch-ultra.png"}]'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  brand = EXCLUDED.brand,
  category = EXCLUDED.category,
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  gsm_arena_id = EXCLUDED.gsm_arena_id,
  ribbon_text = EXCLUDED.ribbon_text,
  specs = EXCLUDED.specs,
  colors = EXCLUDED.colors,
  color_images = EXCLUDED.color_images,
  images = EXCLUDED.images;

INSERT INTO product_variants (id, product_id, title, storage, price_in_cents, sale_price_in_cents, inventory_quantity, manage_inventory) VALUES (
  'watch-u3-alpine',
  'apple-watch-ultra-3',
  'Alpine Loop',
  'Alpine Loop',
  10989000,
  NULL,
  10,
  TRUE
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  storage = EXCLUDED.storage,
  price_in_cents = EXCLUDED.price_in_cents,
  sale_price_in_cents = EXCLUDED.sale_price_in_cents,
  inventory_quantity = EXCLUDED.inventory_quantity,
  manage_inventory = EXCLUDED.manage_inventory;
INSERT INTO product_variants (id, product_id, title, storage, price_in_cents, sale_price_in_cents, inventory_quantity, manage_inventory) VALUES (
  'watch-u3-trail',
  'apple-watch-ultra-3',
  'Trail Loop',
  'Trail Loop',
  10989000,
  NULL,
  10,
  TRUE
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  storage = EXCLUDED.storage,
  price_in_cents = EXCLUDED.price_in_cents,
  sale_price_in_cents = EXCLUDED.sale_price_in_cents,
  inventory_quantity = EXCLUDED.inventory_quantity,
  manage_inventory = EXCLUDED.manage_inventory;
INSERT INTO product_variants (id, product_id, title, storage, price_in_cents, sale_price_in_cents, inventory_quantity, manage_inventory) VALUES (
  'watch-u3-ocean',
  'apple-watch-ultra-3',
  'Ocean Band',
  'Ocean Band',
  11490000,
  NULL,
  8,
  TRUE
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  storage = EXCLUDED.storage,
  price_in_cents = EXCLUDED.price_in_cents,
  sale_price_in_cents = EXCLUDED.sale_price_in_cents,
  inventory_quantity = EXCLUDED.inventory_quantity,
  manage_inventory = EXCLUDED.manage_inventory;

-- Product: Galaxy S26 Ultra
INSERT INTO products (id, brand, category, title, subtitle, description, image_url, gsm_arena_id, ribbon_text, specs, colors, color_images, images) VALUES (
  'samsung-galaxy-s26-ultra',
  'samsung',
  'phone',
  'Galaxy S26 Ultra',
  'Galaxy AI. The future is here.',
  'The absolute pinnacle of mobile engineering. Galaxy S26 Ultra features the Snapdragon 9 Elite, a revolutionary 200MP under-display camera system, and the most advanced Galaxy AI suite ever created.',
  '/products/s26-ultra.png',
  '12771',
  'New',
  '[{"label":"Brand","value":"Samsung"},{"label":"Network","value":"GSM / CDMA / HSPA / LTE / 5G"},{"label":"Body","value":"162.8 × 77.6 × 8.2 mm | 218 g | Titanium chassis | Gorilla Armor 3 | IP68"},{"label":"Display","value":"6.9-inch Dynamic LTPO AMOLED 3X | 1440 × 3120 px (~498 ppi) | 1-144Hz | HDR10+ | 3000 nits peak"},{"label":"Platform","value":"OS: Android 16, One UI 8 | Chipset: Snapdragon 9 Elite (2 nm) | CPU: Octa-core | GPU: Adreno 900"},{"label":"Memory","value":"256GB/16GB RAM, 512GB/16GB RAM, 1TB/16GB RAM (UFS 5.0)"},{"label":"Main Camera","value":"Quad: 200MP Wide f/1.7 + 50MP Ultrawide f/1.9 + 50MP 5× Periscope f/3.4 + 10MP 3× Telephoto f/2.4 | 8K@60fps video"},{"label":"Selfie Camera","value":"12MP Under-Display f/2.2 | 4K video"},{"label":"Battery","value":"5000 mAh | 65W wired | 25W wireless | 10W reverse wireless"},{"label":"Connectivity","value":"Wi-Fi 7 | Bluetooth 5.5 | NFC | USB-C 4.0 | Satellite Emergency SOS | Built-in S Pen"},{"label":"Colors","value":"Titanium Black, Titanium Silver, Titanium Blue"}]'::jsonb,
  ARRAY['Titanium Black', 'Titanium Silver', 'Titanium Blue'],
  '{"Titanium Black":"/products/s26-ultra.png","Titanium Silver":"/products/s26-ultra.png","Titanium Blue":"/products/s26-ultra.png"}'::jsonb,
  '[{"url":"/products/s26-ultra.png"}]'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  brand = EXCLUDED.brand,
  category = EXCLUDED.category,
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  gsm_arena_id = EXCLUDED.gsm_arena_id,
  ribbon_text = EXCLUDED.ribbon_text,
  specs = EXCLUDED.specs,
  colors = EXCLUDED.colors,
  color_images = EXCLUDED.color_images,
  images = EXCLUDED.images;

INSERT INTO product_variants (id, product_id, title, storage, price_in_cents, sale_price_in_cents, inventory_quantity, manage_inventory) VALUES (
  's26u-256',
  'samsung-galaxy-s26-ultra',
  '256GB',
  '256GB',
  12990000,
  NULL,
  15,
  TRUE
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  storage = EXCLUDED.storage,
  price_in_cents = EXCLUDED.price_in_cents,
  sale_price_in_cents = EXCLUDED.sale_price_in_cents,
  inventory_quantity = EXCLUDED.inventory_quantity,
  manage_inventory = EXCLUDED.manage_inventory;
INSERT INTO product_variants (id, product_id, title, storage, price_in_cents, sale_price_in_cents, inventory_quantity, manage_inventory) VALUES (
  's26u-512',
  'samsung-galaxy-s26-ultra',
  '512GB',
  '512GB',
  14490000,
  NULL,
  12,
  TRUE
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  storage = EXCLUDED.storage,
  price_in_cents = EXCLUDED.price_in_cents,
  sale_price_in_cents = EXCLUDED.sale_price_in_cents,
  inventory_quantity = EXCLUDED.inventory_quantity,
  manage_inventory = EXCLUDED.manage_inventory;
INSERT INTO product_variants (id, product_id, title, storage, price_in_cents, sale_price_in_cents, inventory_quantity, manage_inventory) VALUES (
  's26u-1tb',
  'samsung-galaxy-s26-ultra',
  '1TB',
  '1TB',
  15990000,
  NULL,
  8,
  TRUE
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  storage = EXCLUDED.storage,
  price_in_cents = EXCLUDED.price_in_cents,
  sale_price_in_cents = EXCLUDED.sale_price_in_cents,
  inventory_quantity = EXCLUDED.inventory_quantity,
  manage_inventory = EXCLUDED.manage_inventory;

-- Product: Galaxy S24 Ultra
INSERT INTO products (id, brand, category, title, subtitle, description, image_url, gsm_arena_id, ribbon_text, specs, colors, color_images, images) VALUES (
  'samsung-galaxy-s24-ultra',
  'samsung',
  'phone',
  'Galaxy S24 Ultra',
  'Galaxy AI is here.',
  'The most powerful Galaxy ever. With a built-in S Pen, 200MP camera, and Snapdragon 8 Gen 3 processor.',
  '/products/s24-ultra-gen.png',
  '12771',
  '',
  '[{"label":"Brand","value":"Samsung"},{"label":"Network","value":"GSM / CDMA / HSPA / LTE / 5G"},{"label":"Body","value":"162.3 × 79.0 × 8.6 mm | 232 g | Titanium frame | Gorilla Armor | IP68"},{"label":"Display","value":"6.8-inch Dynamic LTPO AMOLED 2X | 1440 × 3088 px (~505 ppi) | 120Hz | HDR10+ | 2600 nits peak"},{"label":"Platform","value":"OS: Android 14, One UI 6.1 | Chipset: Snapdragon 8 Gen 3 for Galaxy (4 nm) | GPU: Adreno 750"},{"label":"Memory","value":"256GB/12GB RAM, 512GB/12GB RAM, 1TB/12GB RAM (UFS 4.0)"},{"label":"Main Camera","value":"Quad: 200MP Wide f/1.7 + 12MP Ultrawide f/2.2 + 50MP 5× Periscope f/3.4 + 10MP 3× Telephoto f/2.4 | 8K video"},{"label":"Selfie Camera","value":"12MP f/2.2 | 4K video"},{"label":"Battery","value":"5000 mAh | 45W wired | 15W wireless | 4.5W reverse wireless"},{"label":"Connectivity","value":"Wi-Fi 6E | Bluetooth 5.3 | NFC | USB-C 3.2 | Built-in S Pen"},{"label":"Colors","value":"Titanium Black, Titanium Gray, Titanium Violet, Titanium Yellow"}]'::jsonb,
  ARRAY['Titanium Black', 'Titanium Gray', 'Titanium Violet', 'Titanium Yellow'],
  '{"Titanium Black":"/products/s24-ultra-gen.png","Titanium Gray":"/products/s24-ultra-gen.png","Titanium Violet":"/products/s24-ultra-gen.png","Titanium Yellow":"/products/s24-ultra-gen.png"}'::jsonb,
  '[{"url":"/products/s24-ultra-gen.png"},{"url":"/products/s24-ultra-gen.png"}]'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  brand = EXCLUDED.brand,
  category = EXCLUDED.category,
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  gsm_arena_id = EXCLUDED.gsm_arena_id,
  ribbon_text = EXCLUDED.ribbon_text,
  specs = EXCLUDED.specs,
  colors = EXCLUDED.colors,
  color_images = EXCLUDED.color_images,
  images = EXCLUDED.images;

INSERT INTO product_variants (id, product_id, title, storage, price_in_cents, sale_price_in_cents, inventory_quantity, manage_inventory) VALUES (
  's24u-256',
  'samsung-galaxy-s24-ultra',
  '256GB',
  '256GB',
  12299000,
  10999000,
  20,
  TRUE
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  storage = EXCLUDED.storage,
  price_in_cents = EXCLUDED.price_in_cents,
  sale_price_in_cents = EXCLUDED.sale_price_in_cents,
  inventory_quantity = EXCLUDED.inventory_quantity,
  manage_inventory = EXCLUDED.manage_inventory;
INSERT INTO product_variants (id, product_id, title, storage, price_in_cents, sale_price_in_cents, inventory_quantity, manage_inventory) VALUES (
  's24u-512',
  'samsung-galaxy-s24-ultra',
  '512GB',
  '512GB',
  13799000,
  12499000,
  15,
  TRUE
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  storage = EXCLUDED.storage,
  price_in_cents = EXCLUDED.price_in_cents,
  sale_price_in_cents = EXCLUDED.sale_price_in_cents,
  inventory_quantity = EXCLUDED.inventory_quantity,
  manage_inventory = EXCLUDED.manage_inventory;
INSERT INTO product_variants (id, product_id, title, storage, price_in_cents, sale_price_in_cents, inventory_quantity, manage_inventory) VALUES (
  's24u-1tb',
  'samsung-galaxy-s24-ultra',
  '1TB',
  '1TB',
  16299000,
  14999000,
  10,
  TRUE
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  storage = EXCLUDED.storage,
  price_in_cents = EXCLUDED.price_in_cents,
  sale_price_in_cents = EXCLUDED.sale_price_in_cents,
  inventory_quantity = EXCLUDED.inventory_quantity,
  manage_inventory = EXCLUDED.manage_inventory;

-- Product: Galaxy Z Fold7
INSERT INTO products (id, brand, category, title, subtitle, description, image_url, gsm_arena_id, ribbon_text, specs, colors, color_images, images) VALUES (
  'samsung-galaxy-z-fold7',
  'samsung',
  'phone',
  'Galaxy Z Fold7',
  'Unfold the future.',
  'The thinnest Galaxy Z Fold ever. Galaxy Z Fold7 features a stunning 8.0-inch foldable inner display, next-generation Galaxy AI, and the power of Snapdragon 8 Elite — all in the most refined fold design yet.',
  '/products/z-fold.png',
  '13147',
  'New',
  '[{"label":"Brand","value":"Samsung"},{"label":"Network","value":"GSM / HSPA / LTE / 5G"},{"label":"Body","value":"Unfolded: ~155 × 132 × 5.0 mm | ~215 g | Armor Aluminum frame | IP48"},{"label":"Display","value":"Main: 8.0-inch Dynamic LTPO AMOLED 2X | 2208 × 1968 px | 120Hz | Cover: 6.5-inch 2520 × 1080 px | 120Hz"},{"label":"Platform","value":"OS: Android 16, One UI 8 | Chipset: Snapdragon 8 Elite for Galaxy (3 nm) | GPU: Adreno 830"},{"label":"Memory","value":"256GB/12GB RAM, 512GB/12GB RAM, 1TB/12GB RAM (UFS 4.0)"},{"label":"Main Camera","value":"Triple: 200MP Wide f/1.7 + 12MP Ultrawide f/2.2 + 10MP 3× Telephoto f/2.4 | 8K video"},{"label":"Selfie Camera","value":"Cover: 12MP f/2.2 | Under-display: 4MP f/1.8"},{"label":"Battery","value":"4400 mAh | 25W wired | 15W wireless | 4.5W reverse wireless"},{"label":"Connectivity","value":"Wi-Fi 7 | Bluetooth 5.4 | NFC | USB-C 3.2 | S Pen compatible"},{"label":"Colors","value":"Silver Shadow, Pink, Navy"}]'::jsonb,
  ARRAY['Silver Shadow', 'Pink', 'Navy'],
  '{"Silver Shadow":"/products/z-fold.png","Pink":"/products/z-fold.png","Navy":"/products/z-fold.png"}'::jsonb,
  '[{"url":"/products/z-fold.png"},{"url":"/products/z-fold.png"},{"url":"/products/z-fold.png"}]'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  brand = EXCLUDED.brand,
  category = EXCLUDED.category,
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  gsm_arena_id = EXCLUDED.gsm_arena_id,
  ribbon_text = EXCLUDED.ribbon_text,
  specs = EXCLUDED.specs,
  colors = EXCLUDED.colors,
  color_images = EXCLUDED.color_images,
  images = EXCLUDED.images;

INSERT INTO product_variants (id, product_id, title, storage, price_in_cents, sale_price_in_cents, inventory_quantity, manage_inventory) VALUES (
  'zf7-256',
  'samsung-galaxy-z-fold7',
  '256GB',
  '256GB',
  21999000,
  NULL,
  8,
  TRUE
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  storage = EXCLUDED.storage,
  price_in_cents = EXCLUDED.price_in_cents,
  sale_price_in_cents = EXCLUDED.sale_price_in_cents,
  inventory_quantity = EXCLUDED.inventory_quantity,
  manage_inventory = EXCLUDED.manage_inventory;
INSERT INTO product_variants (id, product_id, title, storage, price_in_cents, sale_price_in_cents, inventory_quantity, manage_inventory) VALUES (
  'zf7-512',
  'samsung-galaxy-z-fold7',
  '512GB',
  '512GB',
  23999000,
  NULL,
  6,
  TRUE
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  storage = EXCLUDED.storage,
  price_in_cents = EXCLUDED.price_in_cents,
  sale_price_in_cents = EXCLUDED.sale_price_in_cents,
  inventory_quantity = EXCLUDED.inventory_quantity,
  manage_inventory = EXCLUDED.manage_inventory;
INSERT INTO product_variants (id, product_id, title, storage, price_in_cents, sale_price_in_cents, inventory_quantity, manage_inventory) VALUES (
  'zf7-1tb',
  'samsung-galaxy-z-fold7',
  '1TB',
  '1TB',
  26999000,
  NULL,
  4,
  TRUE
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  storage = EXCLUDED.storage,
  price_in_cents = EXCLUDED.price_in_cents,
  sale_price_in_cents = EXCLUDED.sale_price_in_cents,
  inventory_quantity = EXCLUDED.inventory_quantity,
  manage_inventory = EXCLUDED.manage_inventory;

-- Product: Galaxy Z Fold6
INSERT INTO products (id, brand, category, title, subtitle, description, image_url, gsm_arena_id, ribbon_text, specs, colors, color_images, images) VALUES (
  'samsung-galaxy-z-fold6',
  'samsung',
  'phone',
  'Galaxy Z Fold6',
  'Unfold a whole new world.',
  'The ultimate foldable phone. Galaxy Z Fold6 features a 7.6" foldable inner display and the power of Galaxy AI.',
  '/products/samsung-z-fold-6.png',
  '13147',
  '',
  '[{"label":"Brand","value":"Samsung"},{"label":"Network","value":"GSM / HSPA / LTE / 5G"},{"label":"Body","value":"Unfolded: 153.5 × 132.6 × 5.6 mm | Folded: 153.5 × 68.1 × 12.1 mm | 239 g | Armor Aluminum | IP48"},{"label":"Display","value":"Main: 7.6-inch Dynamic LTPO AMOLED 2X | 2160 × 1856 px | 120Hz | 2600 nits | Cover: 6.3-inch 968 × 2376 px | 120Hz"},{"label":"Platform","value":"OS: Android 14, One UI 6.1 | Chipset: Snapdragon 8 Gen 3 for Galaxy (4 nm) | GPU: Adreno 750"},{"label":"Memory","value":"256GB/12GB RAM, 512GB/12GB RAM, 1TB/12GB RAM (UFS 4.0)"},{"label":"Main Camera","value":"Triple: 50MP Wide f/1.8 + 12MP Ultrawide f/2.2 + 10MP 3× Telephoto f/2.4 | 4K video"},{"label":"Selfie Camera","value":"Cover: 10MP f/2.2 | Under-display: 4MP f/1.8"},{"label":"Battery","value":"4400 mAh | 25W wired | 15W wireless | 4.5W reverse wireless"},{"label":"Connectivity","value":"Wi-Fi 6E | Bluetooth 5.3 | NFC | USB-C 3.1 | S Pen compatible"},{"label":"Colors","value":"Silver Shadow, Pink, Navy"}]'::jsonb,
  ARRAY['Silver Shadow', 'Pink', 'Navy'],
  '{"Silver Shadow":"/products/samsung-z-fold-6.png","Pink":"/products/samsung-z-fold-6.png","Navy":"/products/samsung-z-fold-6.png"}'::jsonb,
  '[{"url":"/products/samsung-z-fold-6.png"}]'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  brand = EXCLUDED.brand,
  category = EXCLUDED.category,
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  gsm_arena_id = EXCLUDED.gsm_arena_id,
  ribbon_text = EXCLUDED.ribbon_text,
  specs = EXCLUDED.specs,
  colors = EXCLUDED.colors,
  color_images = EXCLUDED.color_images,
  images = EXCLUDED.images;

INSERT INTO product_variants (id, product_id, title, storage, price_in_cents, sale_price_in_cents, inventory_quantity, manage_inventory) VALUES (
  'zf6-256',
  'samsung-galaxy-z-fold6',
  '256GB',
  '256GB',
  18999000,
  16999000,
  10,
  TRUE
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  storage = EXCLUDED.storage,
  price_in_cents = EXCLUDED.price_in_cents,
  sale_price_in_cents = EXCLUDED.sale_price_in_cents,
  inventory_quantity = EXCLUDED.inventory_quantity,
  manage_inventory = EXCLUDED.manage_inventory;
INSERT INTO product_variants (id, product_id, title, storage, price_in_cents, sale_price_in_cents, inventory_quantity, manage_inventory) VALUES (
  'zf6-512',
  'samsung-galaxy-z-fold6',
  '512GB',
  '512GB',
  20999000,
  18999000,
  8,
  TRUE
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  storage = EXCLUDED.storage,
  price_in_cents = EXCLUDED.price_in_cents,
  sale_price_in_cents = EXCLUDED.sale_price_in_cents,
  inventory_quantity = EXCLUDED.inventory_quantity,
  manage_inventory = EXCLUDED.manage_inventory;
INSERT INTO product_variants (id, product_id, title, storage, price_in_cents, sale_price_in_cents, inventory_quantity, manage_inventory) VALUES (
  'zf6-1tb',
  'samsung-galaxy-z-fold6',
  '1TB',
  '1TB',
  23999000,
  20999000,
  5,
  TRUE
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  storage = EXCLUDED.storage,
  price_in_cents = EXCLUDED.price_in_cents,
  sale_price_in_cents = EXCLUDED.sale_price_in_cents,
  inventory_quantity = EXCLUDED.inventory_quantity,
  manage_inventory = EXCLUDED.manage_inventory;

-- Product: Galaxy Tab S10 Ultra
INSERT INTO products (id, brand, category, title, subtitle, description, image_url, gsm_arena_id, ribbon_text, specs, colors, color_images, images) VALUES (
  'samsung-galaxy-tab-s10-ultra',
  'samsung',
  'tablet',
  'Galaxy Tab S10 Ultra',
  'The ultimate tablet experience.',
  'Galaxy Tab S10 Ultra features a massive 14.6" Dynamic AMOLED 2X display and Galaxy AI built-in.',
  '/products/tab-s10-ultra.png',
  '13362',
  '',
  NULL,
  ARRAY['Moonstone Gray', 'Platinum Silver'],
  '{"Moonstone Gray":"/products/tab-s10-ultra.png","Platinum Silver":"/products/tab-s10-ultra.png"}'::jsonb,
  '[{"url":"/products/tab-s10-ultra.png"}]'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  brand = EXCLUDED.brand,
  category = EXCLUDED.category,
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  gsm_arena_id = EXCLUDED.gsm_arena_id,
  ribbon_text = EXCLUDED.ribbon_text,
  specs = EXCLUDED.specs,
  colors = EXCLUDED.colors,
  color_images = EXCLUDED.color_images,
  images = EXCLUDED.images;

INSERT INTO product_variants (id, product_id, title, storage, price_in_cents, sale_price_in_cents, inventory_quantity, manage_inventory) VALUES (
  'tabs10u-256',
  'samsung-galaxy-tab-s10-ultra',
  '256GB / 12GB',
  '256GB / 12GB',
  13199000,
  NULL,
  10,
  TRUE
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  storage = EXCLUDED.storage,
  price_in_cents = EXCLUDED.price_in_cents,
  sale_price_in_cents = EXCLUDED.sale_price_in_cents,
  inventory_quantity = EXCLUDED.inventory_quantity,
  manage_inventory = EXCLUDED.manage_inventory;
INSERT INTO product_variants (id, product_id, title, storage, price_in_cents, sale_price_in_cents, inventory_quantity, manage_inventory) VALUES (
  'tabs10u-512',
  'samsung-galaxy-tab-s10-ultra',
  '512GB / 12GB',
  '512GB / 12GB',
  14999000,
  NULL,
  8,
  TRUE
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  storage = EXCLUDED.storage,
  price_in_cents = EXCLUDED.price_in_cents,
  sale_price_in_cents = EXCLUDED.sale_price_in_cents,
  inventory_quantity = EXCLUDED.inventory_quantity,
  manage_inventory = EXCLUDED.manage_inventory;

-- Product: Galaxy Watch Ultra
INSERT INTO products (id, brand, category, title, subtitle, description, image_url, gsm_arena_id, ribbon_text, specs, colors, color_images, images) VALUES (
  'samsung-galaxy-watch-ultra',
  'samsung',
  'watch',
  'Galaxy Watch Ultra',
  'Push your limits.',
  'The most capable Galaxy Watch. Built for extreme performance, advanced health tracking, and the toughest environments.',
  '/products/samsung-watch-ultra.png',
  '13127',
  '',
  NULL,
  ARRAY['Titanium Gray', 'Titanium White', 'Titanium Silver'],
  '{"Titanium Gray":"/products/samsung-watch-ultra.png","Titanium White":"/products/samsung-watch-ultra.png","Titanium Silver":"/products/samsung-watch-ultra.png"}'::jsonb,
  '[{"url":"/products/samsung-watch-ultra.png"}]'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  brand = EXCLUDED.brand,
  category = EXCLUDED.category,
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  gsm_arena_id = EXCLUDED.gsm_arena_id,
  ribbon_text = EXCLUDED.ribbon_text,
  specs = EXCLUDED.specs,
  colors = EXCLUDED.colors,
  color_images = EXCLUDED.color_images,
  images = EXCLUDED.images;

INSERT INTO product_variants (id, product_id, title, storage, price_in_cents, sale_price_in_cents, inventory_quantity, manage_inventory) VALUES (
  'gwu-gray',
  'samsung-galaxy-watch-ultra',
  'Titanium Gray',
  'Titanium Gray',
  7149000,
  NULL,
  20,
  TRUE
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  storage = EXCLUDED.storage,
  price_in_cents = EXCLUDED.price_in_cents,
  sale_price_in_cents = EXCLUDED.sale_price_in_cents,
  inventory_quantity = EXCLUDED.inventory_quantity,
  manage_inventory = EXCLUDED.manage_inventory;
INSERT INTO product_variants (id, product_id, title, storage, price_in_cents, sale_price_in_cents, inventory_quantity, manage_inventory) VALUES (
  'gwu-white',
  'samsung-galaxy-watch-ultra',
  'Titanium White',
  'Titanium White',
  7149000,
  NULL,
  20,
  TRUE
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  storage = EXCLUDED.storage,
  price_in_cents = EXCLUDED.price_in_cents,
  sale_price_in_cents = EXCLUDED.sale_price_in_cents,
  inventory_quantity = EXCLUDED.inventory_quantity,
  manage_inventory = EXCLUDED.manage_inventory;
INSERT INTO product_variants (id, product_id, title, storage, price_in_cents, sale_price_in_cents, inventory_quantity, manage_inventory) VALUES (
  'gwu-silver',
  'samsung-galaxy-watch-ultra',
  'Titanium Silver',
  'Titanium Silver',
  7149000,
  NULL,
  15,
  TRUE
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  storage = EXCLUDED.storage,
  price_in_cents = EXCLUDED.price_in_cents,
  sale_price_in_cents = EXCLUDED.sale_price_in_cents,
  inventory_quantity = EXCLUDED.inventory_quantity,
  manage_inventory = EXCLUDED.manage_inventory;

-- Product: Pixel 9 Pro
INSERT INTO products (id, brand, category, title, subtitle, description, image_url, gsm_arena_id, ribbon_text, specs, colors, color_images, images) VALUES (
  'google-pixel-9-pro',
  'google',
  'phone',
  'Pixel 9 Pro',
  'Google AI. Now in your hands.',
  'Pixel 9 Pro is Google''s most powerful phone. Featuring the Tensor G4 chip and a triple rear camera system.',
  '/products/pixel-9-pro.png',
  '13218',
  '',
  '[{"label":"Brand","value":"Google"},{"label":"Network","value":"GSM / HSPA / LTE / 5G"},{"label":"Body","value":"152.8 × 72.0 × 8.5 mm | 199 g | Polished aluminum frame | Gorilla Glass Victus 2 front and back | IP68"},{"label":"Display","value":"6.3-inch Super Actua LTPO OLED | 1280 × 2856 px (495 ppi) | 1–120Hz | HDR | 3000 nits peak | Gorilla Glass Victus 2"},{"label":"Platform","value":"OS: Android 15 | Chipset: Google Tensor G4 | Security: Titan M2 | RAM: 16GB LPDDR5X"},{"label":"Memory","value":"128GB/16GB RAM, 256GB/16GB RAM, 1TB/16GB RAM (UFS 3.1)"},{"label":"Main Camera","value":"Triple: 50MP Wide f/1.68 + 48MP Ultrawide f/1.7 (Macro) + 48MP 5× Telephoto f/2.8 | 8K@30fps | Super Res Zoom 30×"},{"label":"Selfie Camera","value":"10.5MP f/2.2 | 4K video | Face Unlock"},{"label":"Battery","value":"4700 mAh | 45W wired (55% in 30 min) | Qi wireless | Battery Share"},{"label":"Connectivity","value":"Wi-Fi 7 | Bluetooth 5.3 | NFC | USB-C 3.2 | UWB | Satellite Emergency SOS"},{"label":"Colors","value":"Obsidian, Porcelain, Hazel, Rose Quartz"}]'::jsonb,
  ARRAY['Obsidian', 'Porcelain', 'Hazel', 'Rose Quartz'],
  '{"Obsidian":"/products/pixel-9-pro.png","Porcelain":"/products/pixel-9-pro.png","Hazel":"/products/pixel-9-pro.png","Rose Quartz":"/products/pixel-9-pro.png"}'::jsonb,
  '[{"url":"/products/pixel-9-pro.png"}]'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  brand = EXCLUDED.brand,
  category = EXCLUDED.category,
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  gsm_arena_id = EXCLUDED.gsm_arena_id,
  ribbon_text = EXCLUDED.ribbon_text,
  specs = EXCLUDED.specs,
  colors = EXCLUDED.colors,
  color_images = EXCLUDED.color_images,
  images = EXCLUDED.images;

INSERT INTO product_variants (id, product_id, title, storage, price_in_cents, sale_price_in_cents, inventory_quantity, manage_inventory) VALUES (
  'p9p-128',
  'google-pixel-9-pro',
  '128GB',
  '128GB',
  10989000,
  9889000,
  18,
  TRUE
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  storage = EXCLUDED.storage,
  price_in_cents = EXCLUDED.price_in_cents,
  sale_price_in_cents = EXCLUDED.sale_price_in_cents,
  inventory_quantity = EXCLUDED.inventory_quantity,
  manage_inventory = EXCLUDED.manage_inventory;
INSERT INTO product_variants (id, product_id, title, storage, price_in_cents, sale_price_in_cents, inventory_quantity, manage_inventory) VALUES (
  'p9p-256',
  'google-pixel-9-pro',
  '256GB',
  '256GB',
  12490000,
  11290000,
  14,
  TRUE
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  storage = EXCLUDED.storage,
  price_in_cents = EXCLUDED.price_in_cents,
  sale_price_in_cents = EXCLUDED.sale_price_in_cents,
  inventory_quantity = EXCLUDED.inventory_quantity,
  manage_inventory = EXCLUDED.manage_inventory;
INSERT INTO product_variants (id, product_id, title, storage, price_in_cents, sale_price_in_cents, inventory_quantity, manage_inventory) VALUES (
  'p9p-1tb',
  'google-pixel-9-pro',
  '1TB',
  '1TB',
  16490000,
  14990000,
  8,
  TRUE
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  storage = EXCLUDED.storage,
  price_in_cents = EXCLUDED.price_in_cents,
  sale_price_in_cents = EXCLUDED.sale_price_in_cents,
  inventory_quantity = EXCLUDED.inventory_quantity,
  manage_inventory = EXCLUDED.manage_inventory;

-- Product: Pixel 9a
INSERT INTO products (id, brand, category, title, subtitle, description, image_url, gsm_arena_id, ribbon_text, specs, colors, color_images, images) VALUES (
  'google-pixel-9a',
  'google',
  'phone',
  'Pixel 9a',
  'Google AI at a smarter price.',
  'All the best of Google AI in a more affordable package. Pixel 9a features the Tensor G4 chip and an upgraded 48MP camera.',
  '/products/pixel-9-pro.png',
  '13478',
  'New',
  '[{"label":"Brand","value":"Google"},{"label":"Network","value":"GSM / HSPA / LTE / 5G"},{"label":"Body","value":"154.7 × 73.3 × 8.9 mm | 185.9 g | Matte polycarbonate back | Gorilla Glass 3 front | IP68"},{"label":"Display","value":"6.3-inch Actua pOLED | 1080 × 2424 px (422 ppi) | 60–120Hz | HDR | 2700 nits peak"},{"label":"Platform","value":"OS: Android 15 | Chipset: Google Tensor G4 | Security: Titan M2 | RAM: 8GB LPDDR5X"},{"label":"Memory","value":"128GB/8GB RAM, 256GB/8GB RAM (UFS 3.1)"},{"label":"Main Camera","value":"Dual: 48MP Wide f/1.7 + 13MP Ultrawide f/2.2 | OIS | 4K@60fps video"},{"label":"Selfie Camera","value":"13MP f/2.2 | 4K video | Face Unlock"},{"label":"Battery","value":"5100 mAh | 23W wired | 7.5W Qi wireless"},{"label":"Connectivity","value":"Wi-Fi 6E | Bluetooth 5.3 | NFC | USB-C 3.2"},{"label":"Colors","value":"Obsidian, Porcelain, Peony, Iris"}]'::jsonb,
  ARRAY['Obsidian', 'Porcelain', 'Peony', 'Iris'],
  '{"Obsidian":"/products/pixel-9-pro.png","Porcelain":"/products/pixel-9-pro.png","Peony":"/products/pixel-9-pro.png","Iris":"/products/pixel-9-pro.png"}'::jsonb,
  '[{"url":"/products/pixel-9-pro.png"}]'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  brand = EXCLUDED.brand,
  category = EXCLUDED.category,
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  gsm_arena_id = EXCLUDED.gsm_arena_id,
  ribbon_text = EXCLUDED.ribbon_text,
  specs = EXCLUDED.specs,
  colors = EXCLUDED.colors,
  color_images = EXCLUDED.color_images,
  images = EXCLUDED.images;

INSERT INTO product_variants (id, product_id, title, storage, price_in_cents, sale_price_in_cents, inventory_quantity, manage_inventory) VALUES (
  'p9a-128',
  'google-pixel-9a',
  '128GB',
  '128GB',
  6599000,
  NULL,
  25,
  TRUE
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  storage = EXCLUDED.storage,
  price_in_cents = EXCLUDED.price_in_cents,
  sale_price_in_cents = EXCLUDED.sale_price_in_cents,
  inventory_quantity = EXCLUDED.inventory_quantity,
  manage_inventory = EXCLUDED.manage_inventory;
INSERT INTO product_variants (id, product_id, title, storage, price_in_cents, sale_price_in_cents, inventory_quantity, manage_inventory) VALUES (
  'p9a-256',
  'google-pixel-9a',
  '256GB',
  '256GB',
  7499000,
  NULL,
  20,
  TRUE
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  storage = EXCLUDED.storage,
  price_in_cents = EXCLUDED.price_in_cents,
  sale_price_in_cents = EXCLUDED.sale_price_in_cents,
  inventory_quantity = EXCLUDED.inventory_quantity,
  manage_inventory = EXCLUDED.manage_inventory;

-- Product: Pixel 9 Pro Fold
INSERT INTO products (id, brand, category, title, subtitle, description, image_url, gsm_arena_id, ribbon_text, specs, colors, color_images, images) VALUES (
  'google-pixel-9-pro-fold',
  'google',
  'phone',
  'Pixel 9 Pro Fold',
  'An epic display of AI.',
  'The thinnest foldable with the largest inner display. Experience Google AI on a massive 8-inch screen.',
  '/products/pixel-9-pro.png',
  '13220',
  '',
  NULL,
  ARRAY['Obsidian', 'Porcelain'],
  '{"Obsidian":"/products/pixel-9-pro.png","Porcelain":"/products/pixel-9-pro.png"}'::jsonb,
  '[{"url":"/products/pixel-9-pro.png"}]'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  brand = EXCLUDED.brand,
  category = EXCLUDED.category,
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  gsm_arena_id = EXCLUDED.gsm_arena_id,
  ribbon_text = EXCLUDED.ribbon_text,
  specs = EXCLUDED.specs,
  colors = EXCLUDED.colors,
  color_images = EXCLUDED.color_images,
  images = EXCLUDED.images;

INSERT INTO product_variants (id, product_id, title, storage, price_in_cents, sale_price_in_cents, inventory_quantity, manage_inventory) VALUES (
  'p9fold-256',
  'google-pixel-9-pro-fold',
  '256GB',
  '256GB',
  17899000,
  15999000,
  12,
  TRUE
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  storage = EXCLUDED.storage,
  price_in_cents = EXCLUDED.price_in_cents,
  sale_price_in_cents = EXCLUDED.sale_price_in_cents,
  inventory_quantity = EXCLUDED.inventory_quantity,
  manage_inventory = EXCLUDED.manage_inventory;
INSERT INTO product_variants (id, product_id, title, storage, price_in_cents, sale_price_in_cents, inventory_quantity, manage_inventory) VALUES (
  'p9fold-512',
  'google-pixel-9-pro-fold',
  '512GB',
  '512GB',
  19999000,
  17999000,
  8,
  TRUE
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  storage = EXCLUDED.storage,
  price_in_cents = EXCLUDED.price_in_cents,
  sale_price_in_cents = EXCLUDED.sale_price_in_cents,
  inventory_quantity = EXCLUDED.inventory_quantity,
  manage_inventory = EXCLUDED.manage_inventory;


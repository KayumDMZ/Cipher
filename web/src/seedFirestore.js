
import { db } from './firebaseConfig.js';
import { collection, doc, setDoc, writeBatch } from 'firebase/firestore';
import products from './api/products_seed.json' with { type: 'json' };


async function seedDatabase() {
  console.log('Starting seed process...');
  
  try {
    const batch = writeBatch(db);

    for (const product of products) {
      console.log(`Processing product: ${product.id}`);
      
      const { variants, ...productData } = product;
      
      // Seed product
      const productRef = doc(db, 'products', product.id);
      batch.set(productRef, {
        ...productData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      // Seed variants
      for (const variant of variants) {
        const variantRef = doc(db, 'products', product.id, 'variants', variant.id);
        batch.set(variantRef, {
          ...variant,
          product_id: product.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }

    }

    await batch.commit();
    console.log('Database successfully seeded!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

seedDatabase();

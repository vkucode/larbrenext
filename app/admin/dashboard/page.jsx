'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './general.module.scss';

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    }
    fetchProducts();
  }, []);

  return (
    <section className={styles.dashboard}>
      <h1>Product Dashboard</h1>
      <Link href="/admin/dashboard/add"><button>Add Product</button></Link>
      <div className={styles.productList}>
        {products.map((product) => (
          <div key={product.id} className={styles.productItem}>
            <h2>{product.nume_produs}</h2>
            <Link href={`/admin/dashboard/edit/${product.id}`}><button>Edit</button></Link>
            <Link href={`/admin/dashboard/delete/${product.id}`}><button>Delete</button></Link>
          </div>
        ))}
      </div>
    </section>
  );
}

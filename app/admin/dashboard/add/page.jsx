'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../general.module.scss'

export default function AddProduct() {
  const [nume, setNume] = useState('');
  const [descriere, setDescriere] = useState('');
  const [tip, setTip] = useState('');
  const [categorie, setCategorie] = useState('');
  const [imagine, setImagine] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nume, descriere, tip, categorie, imagine }),
      });

      if (response.ok) {
        router.push('/admin/dashboard');
      } else {
        console.error('Failed to add product');
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
  };

  return (
    <section className={styles.addProduct}>
      <h1>Add Product</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Product Name"
          value={nume}
          onChange={(e) => setNume(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={descriere}
          onChange={(e) => setDescriere(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Type"
          value={tip}
          onChange={(e) => setTip(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Category"
          value={categorie}
          onChange={(e) => setCategorie(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Image URL"
          value={imagine}
          onChange={(e) => setImagine(e.target.value)}
          required
        />
        <button type="submit">Add Product</button>
      </form>
    </section>
  );
}

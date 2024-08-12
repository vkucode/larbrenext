'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styles from '../general.module.scss';

export default function EditProductPage() {
  const [product, setProduct] = useState(null);
  const [formData, setFormData] = useState({
    nume_ar: '',
    nume_en: '',
    nume: '',
    descriere_ar: '',
    descriere_en: '',
    descriere: '',
    tip: '',
    categorie: '',
    imagine: '',
    fiche: '',
  });
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`https://www.larbreapains.fr/api/editProduct?id=${id}`);
        const data = await response.json();
        if (data.product) {
          setProduct(data.product);
          setFormData({
            nume_ar: data.product.nume_produs_ar,
            nume_en: data.product.nume_produs_en,
            nume: data.product.nume_produs,
            descriere_ar: data.product.descriere_produs_ar,
            descriere_en: data.product.descriere_produs_en,
            descriere: data.product.descriere_produs,
            tip: data.product.tip_produs,
            categorie: data.product.categoria_produs,
            imagine: data.product.imagine_produs,
            fiche: data.product.fiche_tech,
          });
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      }
    }
    fetchProduct();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://www.larbreapains.fr/api/editProduct`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...formData }),
      });

      if (response.ok) {
        router.push('/admin/dashboard');
      } else {
        console.error('Failed to update product');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <section className={styles.editProduct}>
      <h1>Editer le produit: {product.nume_produs}</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div>
            <div>
            <label>Nom AR:</label>
            <input
                type="text"
                name="nume_ar"
                value={formData.nume_ar}
                onChange={handleInputChange}
                required
            />
            </div>
            <div>
            <label>Nom EN:</label>
            <input
                type="text"
                name="nume_en"
                value={formData.nume_en}
                onChange={handleInputChange}
                required
            />
            </div>
            <div>
            <label>Nom FR:</label>
            <input
                type="text"
                name="nume"
                value={formData.nume}
                onChange={handleInputChange}
                required
            />
            </div>


        </div>
        <div>
            <div>
            <label>Description AR:</label>
            <input
                type="text"
                name="descriere_ar"
                value={formData.descriere_ar}
                onChange={handleInputChange}
                required
            />
            </div>
            <div>
            <label>Description EN:</label>
            <input
                type="text"
                name="descriere_en"
                value={formData.descriere_en}
                onChange={handleInputChange}
                required
            />
            </div>
            <div>
            <label>Description FR:</label>
            <input
                type="text"
                name="descriere"
                value={formData.descriere}
                onChange={handleInputChange}
                required
            />
            </div>
        </div>
        <div>
            <div>
            <label>Tip:</label>
                <input
                    type="text"
                    name="tip"
                    value={formData.tip}
                    onChange={handleInputChange}
                    required
                />
            </div>
          <div>
          <label>Categorie:</label>
            <input
                type="text"
                name="categorie"
                value={formData.categorie}
                onChange={handleInputChange}
                required
            />
          </div>
        
        </div>
        <div>

        </div>
        <div>
          <label>Imagine:</label>
          <input
            type="text"
            name="imagine"
            value={formData.imagine}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Fiche:</label>
          <input
            type="text"
            name="fiche"
            value={formData.fiche}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Update Product</button>
      </form>
    </section>
  );
}

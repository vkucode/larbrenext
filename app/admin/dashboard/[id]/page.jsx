'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styles from '../general.module.scss';
import { IoArrowBackOutline } from "react-icons/io5";
import { FaRegImage, FaFile } from "react-icons/fa6";

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
  });
  const [imageFile, setImageFile] = useState(null); // Stocăm imaginea selectată
  const [ficheFile, setFicheFile] = useState(null); // Stocăm fișa tehnică selectată
  const router = useRouter();
  const { id } = useParams();

  const categories = {
    Cuit: ['Pain', 'Patisserie', 'Viennoiserie'],
    Surgeler: ['Pain', 'Patisserie', 'Viennoiserie'],
    Traiteur: ['Quiche', 'Salade', 'Sandwich'],
  };

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

  const handleFileChange = (e, setter) => {
    const file = e.target.files[0];
    if (file) {
      setter(file); // Stocăm fișierul selectat
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const updatedFormData = new FormData();
    updatedFormData.append("id", id);
    updatedFormData.append("nume_ar", formData.nume_ar);
    updatedFormData.append("nume_en", formData.nume_en);
    updatedFormData.append("nume", formData.nume);
    updatedFormData.append("descriere_ar", formData.descriere_ar);
    updatedFormData.append("descriere_en", formData.descriere_en);
    updatedFormData.append("descriere", formData.descriere);
    updatedFormData.append("tip", formData.tip);
    updatedFormData.append("categorie", formData.categorie);

    // Adăugăm imaginea și fișa tehnică doar dacă utilizatorul a selectat fișiere noi
    if (imageFile) updatedFormData.append("imagine", imageFile);
    if (ficheFile) updatedFormData.append("fiche", ficheFile);

    try {
        const response = await fetch(`https://www.larbreapains.fr/api/products`, {
            method: 'PUT',
            body: updatedFormData,
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
      <div>
        <a href='/admin/dashboard'><IoArrowBackOutline />&nbsp;Retour</a>
        <h1>Editer le produit: {product.nume_produs}</h1>
      </div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div>
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
        </div>

        <div>
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
        </div>

        <div>
          <div>
            <label>Tip:</label>
            <select name="tip" id="tip" required value={formData.tip} onChange={handleInputChange}>
              <option value="">Sélectionnez le type</option>
              <option value="Cuit">Cuit</option>
              <option value="Surgeler">Surgeler</option>
              <option value="Traiteur">Traiteur</option>
            </select>
          </div>
          <div>
            <label>Categorie:</label>
            <select
              name="categorie"
              id="categorie"
              required
              value={formData.categorie}
              onChange={handleInputChange}
            >
              <option value="">Sélectionnez la catégorie</option>
              {formData.tip &&
                categories[formData.tip].map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <section>
          <label>Image de produit:</label>
          <div>
            <img
              src={product.imagine_produs}
              alt="Product Image"
              width={100}
            />
            <input
              type="file"
              name="imagine"
              onChange={(e) => handleFileChange(e, setImageFile)}
            />
          </div>
        </section>

        <section>
          <label>Fiche technique:</label>
          <div>
            <a
              href={product.fiche_tech}
              target="_blank"
              rel="noopener noreferrer"
            >
              Voir la fiche actuelle
            </a>
            <input
              type="file"
              name="fiche"
              onChange={(e) => handleFileChange(e, setFicheFile)}
            />
          </div>
        </section>

        <button type="submit">Update Product</button>
      </form>
    </section>
  );
}

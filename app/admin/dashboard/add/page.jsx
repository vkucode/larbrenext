'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../general.module.scss';
import { FaRegImage, FaFile } from "react-icons/fa6";
import { IoArrowBackOutline } from "react-icons/io5";

export default function AddProduct() {
  const [nume_ar, setNumeAr] = useState('');
  const [nume_en, setNumeEn] = useState('');
  const [nume, setNumeFR] = useState('');
  const [descriere_ar, setDescriereAR] = useState('');
  const [descriere_en, setDescriereEn] = useState('');
  const [descriere, setDescriereFR] = useState('');
  const [tip, setTip] = useState('');
  const [categorie, setCategorie] = useState('');
  const [imagine, setImagine] = useState(null);
  const [fiche, setFiche] = useState(null);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const categories = {
    Cuit: ['Pain', 'Patisserie', 'Viennoiserie'],
    Surgeler: ['Pain', 'Patisserie', 'Viennoiserie'],
    Traiteur: ['Quiche', 'Salade', 'Sandwich'],
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!nume_ar || !nume || !nume_en || !descriere_ar || !descriere_en || !descriere || !tip || !categorie || !imagine || !fiche) {
      setMessage('Tous les champs doivent être remplis.');
      return;
    }
  
    const formData = new FormData();
    formData.append("nume_ar", nume_ar);
    formData.append("nume_en", nume_en);
    formData.append("nume", nume);
    formData.append("descriere_ar", descriere_ar);
    formData.append("descriere_en", descriere_en);
    formData.append("descriere", descriere);
    formData.append("tip", tip);
    formData.append("categorie", categorie);
    formData.append("imagine", imagine);
    formData.append("fiche", fiche);
  
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        setMessage('Le produit a été ajouté avec succès.');
        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 1500);
      } else {
        const errorData = await response.json();
        setMessage(`Adăugarea produsului a eșuat: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setMessage('A apărut o eroare neașteptată.');
    }
  };
  

  const handleFileChange = (e, setter) => {
    const file = e.target.files[0];
    if (file) {
      setter(file);
    }
  };

  return (
    <section className={styles.addProduct}>
      <div>
        <a href='/admin/dashboard'><IoArrowBackOutline />&nbsp;Retour</a>
      </div>
      <h1>Ajouter un produit</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <input
            type="text"
            placeholder="Nom de produit FR"
            value={nume}
            onChange={(e) => setNumeFR(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Nom de produit AR"
            value={nume_ar}
            onChange={(e) => setNumeAr(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Nom de produit EN"
            value={nume_en}
            onChange={(e) => setNumeEn(e.target.value)}
            required
          />
        </div>
        
        <div>
          <textarea
            placeholder="Description FR"
            value={descriere}
            onChange={(e) => setDescriereFR(e.target.value)}
            required
          />
          <textarea
            placeholder="Description AR"
            value={descriere_ar}
            onChange={(e) => setDescriereAR(e.target.value)}
            required
          />
          <textarea
            placeholder="Description EN"
            value={descriere_en}
            onChange={(e) => setDescriereEn(e.target.value)}
            required
          />
        </div>
        <div>
          <select name="type" id="type" required value={tip} onChange={(e) => setTip(e.target.value)}>
            <option value="">Sélectionnez le type</option>
            <option value="Cuit">Cuit</option>
            <option value="Surgeler">Surgelé</option>
            <option value="Traiteur">Traiteur</option>
          </select>
          <select name="categorie" id="categorie" required value={categorie} onChange={(e) => setCategorie(e.target.value)}>
            <option value="">Sélectionnez la catégorie</option>
            {tip && categories[tip].map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <section className='flex flex-col justify-center items-center mt-5 mb-5'>
          <label htmlFor='imageProd' className='flex flex-row justify-center items-center'>Image de produit&nbsp;<FaRegImage /></label>
          <input
            id='imageProd'
            type="file"
            onChange={(e) => handleFileChange(e, setImagine)}
            required
          />
        </section>
        
        <section className='flex flex-col justify-center items-center mt-5 mb-5'>
          <label htmlFor='ficheProd' className='flex flex-row justify-center items-center'>Fiche technique&nbsp;<FaFile /></label>
          <input
            id='ficheProd'
            type="file"
            onChange={(e) => handleFileChange(e, setFiche)}
            required
          />
        </section>

        <button type="submit">Ajouter le produit</button>
        {message && <p className={styles.message}>{message}</p>}
      </form>
    </section>
  );
}

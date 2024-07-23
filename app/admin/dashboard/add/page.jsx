'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../general.module.scss';

export default function AddProduct() {
  const [nume_ar, setNumeAr] = useState('');
  const [nume, setNumeFR] = useState('');
  const [descriere_ar, setDescriereAR] = useState('');
  const [descriere, setDescriereFR] = useState('');
  const [tip, setTip] = useState('');
  const [categorie, setCategorie] = useState('');
  const [imagine, setImagine] = useState(null);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const categories = {
    Cuit: ['Pain', 'Patisserie', 'Viennoiserie'],
    Surgeler: ['Pain', 'Patisserie', 'Viennoiserie'],
    Traiteur: ['Quiche', 'Salade', 'Sandwich'],
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nume_ar || !nume || !descriere_ar || !descriere || !tip || !categorie || !imagine) {
      setMessage('Toate câmpurile trebuie completate.');
      return;
    }

    const formData = new FormData();
    formData.append('nume_ar', nume_ar);
    formData.append('nume', nume);
    formData.append('descriere_ar', descriere_ar);
    formData.append('descriere', descriere);
    formData.append('tip', tip);
    formData.append('categorie', categorie);
    formData.append('imagine', imagine);

    try {
      const response = await fetch('https://larbreapains.fr/api/products', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setMessage('Produsul a fost adăugat cu succes.');
        router.push('/admin/dashboard');
      } else {
        setMessage('Adăugarea produsului a eșuat.');
      }
    } catch (error) {
      setMessage('A apărut o eroare neașteptată.');
    }
  };

  return (
    <section className={styles.addProduct}>
      <h1>Ajouter un produit</h1>
      <form onSubmit={handleSubmit}>
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
        </div>
        <div>
          <select name="type" id="type" required value={tip} onChange={(e) => setTip(e.target.value)}>
            <option value="">Selectează tipul</option>
            <option value="Cuit">Cuit</option>
            <option value="Surgeler">Surgeler</option>
            <option value="Traiteur">Traiteur</option>
          </select>
          <select name="categorie" id="categorie" required value={categorie} onChange={(e) => setCategorie(e.target.value)}>
            <option value="">Selectează categoria</option>
            {tip && categories[tip].map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <input
          type="file"
          placeholder="Image de produit"
          onChange={(e) => setImagine(e.target.files[0])}
          required
        />
        <button type="submit">Ajouter le produit</button>
        {message && <p className={styles.message}>{message}</p>}
      </form>
    </section>
  );
}

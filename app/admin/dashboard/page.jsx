'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import styles from './general.module.scss';
import { TbEdit, TbTrash, TbPlus, TbFileText } from "react-icons/tb";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [filterNoTechFile, setFilterNoTechFile] = useState(false); // Filtru pentru produse fără fișă tehnică
  const router = useRouter();

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://larbreapains.fr/api/products');
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleTypeSelection = (type) => {
    setSelectedType(type);
    setFilterNoTechFile(false); // Resetăm filtrul "fără fișă tehnică" când selectăm un tip
  };

  const toggleNoTechFileFilter = () => {
    setFilterNoTechFile((prev) => !prev);
    setSelectedType(''); // Resetăm tipul selectat când activăm filtrul "fără fișă tehnică"
  };

  const filteredProducts = products.filter((product) => {
    if (filterNoTechFile) {
      // Filtrăm doar produsele fără fișă tehnică sau cu link-ul specific
      return (
        !product.fiche_tech ||
        product.fiche_tech.includes('https://www.larbreapains.fr/ficheTechnique/')
      );
    }
    // Filtrăm produsele după tip, dacă este selectat unul
    return selectedType ? product.tip_produs === selectedType : true;
  });

  const deleteProduct = async (id) => {
    const confirmed = confirm('Est-ce que vous êtes sûr de vouloir supprimer ce produit?');
    if (confirmed) {
      try {
        const response = await fetch(`https://larbreapains.fr/api/delete?id=${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          setProducts(products.filter(product => product.id !== id));
        } else {
          console.error('Failed to delete product');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <section className={styles.dashboard}>
      <div className='flex flex-row flex-wrap justify-between items-center w-full max-w-6xl'>
        <h1>Product Dashboard</h1>
        <button onClick={() => handleTypeSelection('Cuit')}>Cuit</button>
        <button onClick={() => handleTypeSelection('Surgeler')}>Surgelé</button>
        <button onClick={() => handleTypeSelection('Traiteur')}>Traiteur</button>
        <button onClick={() => handleTypeSelection('')}>Tous</button>
        <button onClick={toggleNoTechFileFilter}>
          {filterNoTechFile ? 'Voir tous les produits' : 'Sans fiche technique'}
        </button>
        <Link href="/admin/dashboard/add"><button>Ajouter&nbsp;<TbPlus /></button></Link>
      </div>
      <div className={styles.productList}>
        {filteredProducts.map((product) => (
          <div key={product.id} className={styles.productItem}>
            <h1>{product.nume_produs}</h1>
            <Image 
              src={product.imagine_produs} 
              alt={product.nume_produs} 
              width={150} 
              height={150} 
            />
            <div className={styles.controlBtns}>
              <Link href={`/admin/dashboard/${product.id}`}><button>Edit&nbsp;<TbEdit /></button></Link>
              <button onClick={() => deleteProduct(product.id)}>Delete&nbsp;<TbTrash /></button>
              {/* Adăugăm iconul fișei tehnice cu verificare suplimentară */}
              {product.fiche_tech &&
                !product.fiche_tech.includes('https://www.larbreapains.fr/ficheTechnique/') && (
                  <a 
                    href={product.fiche_tech} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={styles.fileIcon}
                    title="Voir la fiche technique"
                  >
                    <TbFileText />
                  </a>
                )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import styles from './general.module.scss';
import { TbEdit, TbTrash, TbPlus, TbFileText } from "react-icons/tb";
import { IoExitOutline } from "react-icons/io5";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [filterNoTechFile, setFilterNoTechFile] = useState(false);
  const router = useRouter();

  // Verificăm autentificarea utilizatorului la încărcarea paginii
  useEffect(() => {
    const session = localStorage.getItem('sessiontrue');
    if (session !== 'true') {
      router.push('/admin'); // Redirecționăm utilizatorul la pagina de login
    }
  }, []);

  // Funcție pentru a obține produsele
  const fetchProducts = async () => {
    try {
      const response = await fetch('https://larbreapains.fr/api/products');

      if (response.ok) {
        const data = await response.json();
        setProducts(data.products);
      } else {
        console.error('Failed to fetch products:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleTypeSelection = (type) => {
    setSelectedType(type);
    setFilterNoTechFile(false);
  };

  const toggleNoTechFileFilter = () => {
    setFilterNoTechFile((prev) => !prev);
    setSelectedType('');
  };

  const handleLogout = () => {
    localStorage.removeItem('sessiontrue');
    router.push('/admin');
  };

  const filteredProducts = products.filter((product) => {
    if (filterNoTechFile) {
      return (
        !product.fiche_tech ||
        product.fiche_tech.includes('https://www.larbreapains.fr/ficheTechnique/')
      );
    }
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

      <div className='flex flex-row flex-wrap justify-between items-center w-full max-w-6xl mb-5'>
        <h2 className='text-xl'>Bienvenue sur l'espace Admin</h2>
        <button onClick={handleLogout} className="!bg-[black] text-white">Logout&nbsp;<IoExitOutline /></button>
      </div>
      
      <div className='flex flex-col flex-wrap justify-center items-start w-full gap-5 max-w-6xl'>
        <h1>Product Dashboard</h1>
        <div className='flex flex-row justify-center items-center flex-wrap gap-5'>
          <button onClick={() => handleTypeSelection('Cuit')}>Cuit</button>
          <button onClick={() => handleTypeSelection('Surgeler')}>Surgelé</button>
          <button onClick={() => handleTypeSelection('Traiteur')}>Traiteur</button>
          <button onClick={() => handleTypeSelection('')}>Tous</button>
          <button onClick={toggleNoTechFileFilter}>
            {filterNoTechFile ? 'Voir tous les produits' : 'Sans fiche technique'}
          </button>
          <Link href="/admin/dashboard/add"><button>Ajouter&nbsp;<TbPlus /></button></Link>
        </div>
        
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

'use client';
import { useEffect, useState } from "react";
import Image from "next/image";
import styles from '../traiteur.module.scss'
import { IoIosSearch } from "react-icons/io";
import { HiXMark } from "react-icons/hi2";

export default function Salade() {
  const [dataResponse, setDataResponse] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); // State pentru produsul selectat
  const [isPopupVisible, setIsPopupVisible] = useState(false); // State pentru vizibilitatea popup-ului

  useEffect(() => {
    async function getPageData() {
      try {
        const apiUrlEndPoint = `https://larbreapains.fr/api/getdata`;
        const response = await fetch(apiUrlEndPoint);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const res = await response.json();
        console.log(res.products);
        setDataResponse(res.products || []); // Ensure res.products is an array
      } catch (error) {
        console.error('Fetch error: ', error);
        setDataResponse([]); // Set to empty array on error
      }
    }
    getPageData();
  }, []);

  const filteredProducts = dataResponse.filter(product => product.tip_produs === "Traiteur" && product.categoria_produs === 'Sandwich');

  const handleProductClick = (product) => {
    setSelectedProduct(product); // Setăm produsul selectat
    setIsPopupVisible(true); // Afișăm popup-ul
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false); // Ascundem popup-ul
    setSelectedProduct(null); // Resetăm produsul selectat
  };

  return (
    <section className={styles.sectionCatalog}>
        <div className={styles.filterBlock}>
            <IoIosSearch />
            <input type="text" name="filter" id="filter" placeholder="Rechercher un produit" />
        </div>
      <div className={styles.catalogProducts}>
        {filteredProducts.map((product) => (
            <div key={product.id} className={styles.productCard} onClick={() => handleProductClick(product)}>
            <h1>{product.nume_produs_ar}</h1>
            <Image
                src={`https://larbreapains.fr/img/imgProducts/${product.imagine_produs}`}
                width={400}
                height={400}
                alt={product.nume_produs_ar}
            />
            </div>
        ))}
      </div>

      {isPopupVisible && selectedProduct && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <Image src="/img/logow.png" width={200} height={200} alt="L'arbre A Pains" className={styles.popupLogo} />
            <div className={styles.popupImg}>
              <Image
                    src={`https://larbreapains.fr/img/imgProducts/${selectedProduct.imagine_produs}`}
                    width={700}
                    height={700}
                    alt={selectedProduct.nume_produs_ar}
                />
                <button onClick={handleClosePopup} className={styles.closeButtonMb}><HiXMark /></button>
            </div>

            <div className={styles.popupText}>
              <button onClick={handleClosePopup} className={styles.closeButton}><HiXMark /></button>
              <h1>{selectedProduct.nume_produs_ar}</h1>
              <p>{selectedProduct.descriere_produs_ar}</p>
              <a href={`https://larbreapains.fr/ficheTechnique/${selectedProduct.fiche_tech}`}>Fiche technique</a>
            </div>
            

            
            {/* Adăugăm alte informații despre produs aici */}
          </div>
        </div>
      )}
    </section>
  );
}

'use client';
import { useEffect, useState } from "react";
import Image from "next/image";
import styles from '../surgeler.module.scss'
import { IoIosSearch } from "react-icons/io";

export default function Pain() {
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

  const filteredProducts = dataResponse.filter(product => product.tip_produs === "Surgeler" && product.categoria_produs === 'Pain');

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
            <h1>{product.nume_produs}</h1>
            <Image
                src={`https://larbreapains.fr/img/imgProducts/${product.imagine_produs}`}
                width={400}
                height={400}
                alt={product.nume_produs}
            />
            </div>
        ))}
      </div>

      {isPopupVisible && selectedProduct && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <button onClick={handleClosePopup} className={styles.closeButton}>Close</button>
            <h1>{selectedProduct.nume_produs}</h1>
            <Image
                src={`https://larbreapains.fr/img/imgProducts/${selectedProduct.imagine_produs}`}
                width={400}
                height={400}
                alt={selectedProduct.nume_produs}
            />
            <p>{selectedProduct.descriere_produs}</p>
            {/* Adăugăm alte informații despre produs aici */}
          </div>
        </div>
      )}
    </section>
  );
}

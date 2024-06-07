'use client';
import { useEffect, useState } from "react";
import Image from "next/image";
import styles from '../traiteur.module.scss'
import { IoIosSearch } from "react-icons/io";

export default function Quiche() {
  const [dataResponse, setDataResponse] = useState([]);

  useEffect(() => {
    async function getPageData() {
      try {
        const apiUrlEndPoint = `http://localhost:3000/api/getdata`;
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

  const filteredProducts = dataResponse.filter(product => product.tip_produs === "Traiteur" && product.categoria_produs === 'Quiche');

  return (
    <section className={styles.sectionCatalog}>
        <div className={styles.filterBlock}>
            <IoIosSearch />
            <input type="text" name="filter" id="filter" placeholder="Rechercher un produit" />
        </div>
      <div className={styles.catalogProducts}>
        {filteredProducts.map((product) => (
            <div key={product.id} className={styles.productCard}>
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
      
    </section>
  );
}

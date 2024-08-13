'use client';
import { useEffect, useState } from "react";
import styles from './cuit.module.scss'
import Image from "next/image";
import { FaChevronRight } from "react-icons/fa6";
import 'animate.css'

export default function Cuit() {
  const [hoveredItem, setHoveredItem] = useState(null)

  return (
    <>
      <section className={styles.sectionPage}>
        <a href="/ar/cuit/pain"
          onMouseEnter={() => setHoveredItem(1)}
          onMouseLeave={() => setHoveredItem(null)}
        >
            <div className="absolute w-full h-full z-10 bg-black bg-opacity-50"></div>
            <Image src="/img/categories/img1.jpg" width={1000} height={1000} alt="خبز" />
            <Image src="/img/logo.png" className={styles.logoCat} width={200} height={200} alt="شعار" />
            <FaChevronRight className={`${styles.arrowCat} animate__animated ${hoveredItem === 1 ? 'animate__fadeInLeft' : 'animate__fadeOutRight'}`}/>
            <h1>خبز</h1>
        </a>
        <a href="/ar/cuit/patisserie"
        onMouseEnter={() => setHoveredItem(2)}
        onMouseLeave={() => setHoveredItem(null)}
        >
          <div className="absolute w-full h-full z-10 bg-black bg-opacity-50"></div>
          <Image src="/img/categories/img2.jpg" width={1000} height={1000} alt="حلويات" />
          <Image src="/img/logo.png" className={styles.logoCat} width={200} height={200} alt="شعار" />
          <FaChevronRight className={`${styles.arrowCat} animate__animated ${hoveredItem === 2 ? 'animate__fadeInLeft' : 'animate__fadeOutRight'}`}/>
          <h1>حلويات</h1>
        </a>
        <a href="/ar/cuit/viennoiserie"
        onMouseEnter={() => setHoveredItem(3)}
        onMouseLeave={() => setHoveredItem(null)}
        >
          <div className="absolute w-full h-full z-10 bg-black bg-opacity-50"></div>
          <Image src="/img/categories/img3.jpg" width={1000} height={1000} alt="معجنات" />
          <Image src="/img/logo.png" className={styles.logoCat} width={200} height={200} alt="شعار" />
          <FaChevronRight className={`${styles.arrowCat} animate__animated ${hoveredItem === 3 ? 'animate__fadeInLeft' : 'animate__fadeOutRight'}`}/>
          <h1>معجنات</h1>
        </a>

      </section>
    </>

  );
}

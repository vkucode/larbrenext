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
        <a href="/fr/cuit/pain"
          onMouseEnter={() => setHoveredItem(1)}
          onMouseLeave={() => setHoveredItem(null)}
        >
            <div className="absolute w-full h-full z-10 bg-black bg-opacity-50"></div>
            <Image src="/img/categories/img1.jpg" width={1000} height={1000} alt="pain" />
            <Image src="/img/logo.png" className={styles.logoCat} width={200} height={200} alt="logo" />
            <FaChevronRight className={`${styles.arrowCat} animate__animated ${hoveredItem === 1 ? 'animate__fadeInLeft' : 'animate__fadeOutRight'}`}/>
            <h1>Pain</h1>
        </a>
        <a href="/fr/cuit/patisserie"
        onMouseEnter={() => setHoveredItem(2)}
        onMouseLeave={() => setHoveredItem(null)}
        >
          <div className="absolute w-full h-full z-10 bg-black bg-opacity-50"></div>
          <Image src="/img/categories/img2.jpg" width={1000} height={1000} alt="pain" />
          <Image src="/img/logo.png" className={styles.logoCat} width={200} height={200} alt="logo" />
          <FaChevronRight className={`${styles.arrowCat} animate__animated ${hoveredItem === 2 ? 'animate__fadeInLeft' : 'animate__fadeOutRight'}`}/>
          <h1>Patisserie</h1>
        </a>
        <a href="/fr/cuit/viennoiserie"
        onMouseEnter={() => setHoveredItem(3)}
        onMouseLeave={() => setHoveredItem(null)}
        >
          <div className="absolute w-full h-full z-10 bg-black bg-opacity-50"></div>
          <Image src="/img/categories/img3.jpg" width={1000} height={1000} alt="pain" />
          <Image src="/img/logo.png" className={styles.logoCat} width={200} height={200} alt="logo" />
          <FaChevronRight className={`${styles.arrowCat} animate__animated ${hoveredItem === 3 ? 'animate__fadeInLeft' : 'animate__fadeOutRight'}`}/>
          <h1>Viennoiserie</h1>
        </a>

      </section>
    </>

  );
}

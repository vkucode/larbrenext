'use client';
import { useEffect, useState } from "react";
import styles from './traiteur.module.scss'
import Image from "next/image";
import { FaChevronRight } from "react-icons/fa6";
import 'animate.css'

export default function Traiteur() {
  const [hoveredItem, setHoveredItem] = useState(null)

  return (
    <>
      <section className={styles.sectionPage}>
        <a href="/ar/traiteur/salade"
          onMouseEnter={() => setHoveredItem(1)}
          onMouseLeave={() => setHoveredItem(null)}
        >
            <div className="absolute w-full h-full z-10 bg-black bg-opacity-50"></div>
            <Image src="/img/categories/salade.jpg" width={1000} height={1000} alt="سلطة" />
            <Image src="/img/logo.png" className={styles.logoCat} width={200} height={200} alt="شعار" />
            <FaChevronRight className={`${styles.arrowCat} animate__animated ${hoveredItem === 1 ? 'animate__fadeInLeft' : 'animate__fadeOutRight'}`}/>
            <h1>سلطة</h1>
        </a>
        <a href="/ar/traiteur/sandwich"
        onMouseEnter={() => setHoveredItem(2)}
        onMouseLeave={() => setHoveredItem(null)}
        >
          <div className="absolute w-full h-full z-10 bg-black bg-opacity-50"></div>
          <Image src="/img/categories/sandwich.jpg" width={1000} height={1000} alt="ساندويتش" />
          <Image src="/img/logo.png" className={styles.logoCat} width={200} height={200} alt="شعار" />
          <FaChevronRight className={`${styles.arrowCat} animate__animated ${hoveredItem === 2 ? 'animate__fadeInLeft' : 'animate__fadeOutRight'}`}/>
          <h1>ساندويتش</h1>
        </a>
        <a href="/ar/traiteur/quiche"
        onMouseEnter={() => setHoveredItem(3)}
        onMouseLeave={() => setHoveredItem(null)}
        >
          <div className="absolute w-full h-full z-10 bg-black bg-opacity-50"></div>
          <Image src="/img/categories/quiche.jpg" width={1000} height={1000} alt="كيش" />
          <Image src="/img/logo.png" className={styles.logoCat} width={200} height={200} alt="شعار" />
          <FaChevronRight className={`${styles.arrowCat} animate__animated ${hoveredItem === 3 ? 'animate__fadeInLeft' : 'animate__fadeOutRight'}`}/>
          <h1>كيش</h1>
        </a>

      </section>
    </>

  );
}

'use client';
import { useEffect, useState } from "react";
import styles from './accueil.module.scss';
import Image from "next/image";
import { ScreenFitText } from "./components/FitText";
import { ScreenFitTextPart } from "./components/FitTextPart";
import { PartnersBand } from "./components/PartnersBand";
import 'animate.css'

export default function AccueilPage() {

  const [onlogoHover, setOnHoverLogo] = useState(null);

  return (
    <>
      <section className={styles.headerAcc}>
        <div className={styles.overlay}></div>
        <Image src="/img/fond.png" className="animate__animated animate__fadeIn" width={1000} height={1000} alt="fond" />
        <div className={styles.headerContent}>
          <h1 className="animate__animated animate__fadeInUp">L&apos;Arbre à Pains</h1>
          <p className="animate__animated animate__fadeInUp">
            Nous sommes fiers de vous proposer des produits de boulangerie
            et de pâtisserie de qualité supérieure. 
          </p>
          <a href="#contact" className="animate__animated animate__fadeIn">Contactez&nbsp;nous</a>
        </div>
      </section>
      <section className={styles.aboutUs}>
        <ScreenFitText text="Qui Sommes nous" />
        <div className={styles.aboutContent}>
          <h1>Qui&nbsp;sommes&nbsp;nous</h1>
          <div className="flex-col-reverse lg:flex-row">
            <Image src="/img/fond.png" width={400} height={400} alt="about us" />
            <p className="text-center lg:text-left">
              L’ Arbre à Pains propose aux professionnels de l’hôtellerie et de la restauration une sélection rigoureuse de pains et viennoiseries héritée de la grande tradition boulangère et pâtissière française.
            </p>
          </div>
          <div className="flex-col lg:flex-row">
            <p className="text-center lg:text-right">
              Plus qu’un fournisseur, L’ Arbre à Pains a l’ambition d’être votre partenaire pour vous proposer des pains et viennoiseries authentiques et subtilement équilibrés.
            </p>
            <Image src="/img/fond.png" width={400} height={400} alt="about us" />
          </div>
          <p className={styles.aboutConclusion}>
            Nous restons attentifs aux évolutions du marché et à vos attentes afin de vous offrir la meilleure qualité, ainsi qu&apos;un service optimal à hotline 24h/24 et 7j/7 (jours fériés inclus).
          </p>
        </div>
      </section>
      <section className={styles.partenaires}>
        <ScreenFitTextPart text="Nos Partenaires" />
        <div className={styles.partenairesContent}>
          <h1>Nos Partenaires</h1>
          <PartnersBand />
        </div>
      </section>
      <section className={styles.categories}>
        <ScreenFitTextPart text="NOS CATÉGORIES" />
        <div className={styles.categoriesContent}>
          <h1>NOS CATÉGORIES</h1>
          <div className={styles.cards}>
            <a href="/cuit"
              onMouseEnter={() => setOnHoverLogo(1)}  // Set hovered item on mouse enter
              onMouseLeave={() => setOnHoverLogo(null)} 
            >
              <div className={styles.card}>
                <Image src="/img/categories/cuit.jpeg" width={500} height={500} alt="Cuit" />
                <Image src="/img/logo.png" className={`${styles.cardlogo} animate__animated ${onlogoHover == 1 ? 'animate__fadeIn flex' : 'flex animate__fadeOut'}`} width={300} height={300} alt="logo" />
                <h2>Cuit</h2>
              </div>
            </a>
            <a href="/surgele"
              onMouseEnter={() => setOnHoverLogo(2)}  // Set hovered item on mouse enter
              onMouseLeave={() => setOnHoverLogo(null)} 
            >
              <div className={styles.card}>
                <Image src="/img/categories/surgeler.jpeg" width={500} height={500} alt="surgelé" />
                <Image src="/img/logo.png" className={`${styles.cardlogo} animate__animated ${onlogoHover == 2 ? 'animate__fadeIn flex' : 'flex animate__fadeOut'}`} width={300} height={300} alt="logo" />
                <h2>Surgelé</h2>
              </div>
            </a>
            <a href="/traiteur"
              onMouseEnter={() => setOnHoverLogo(3)}  // Set hovered item on mouse enter
              onMouseLeave={() => setOnHoverLogo(null)} 
            >
              <div className={styles.card}>
                <Image src="/img/categories/traiteur.jpeg" width={500} height={500} alt="Traiteur" />
                <Image src="/img/logo.png" className={`${styles.cardlogo} animate__animated ${onlogoHover == 3 ? 'animate__fadeIn flex' : 'flex animate__fadeOut'}`} width={300} height={300} alt="logo" />
                <h2>Traiteur</h2>
              </div>
            </a>
          </div>
        </div>
      </section>
      <section className={styles.contactForm} id="contact">
        <h1>contactez nous</h1>
          <form action="#">
            <div className="flex flex-row gap-5 w-full justify-center items-center">
              <input type="text" placeholder="nom" name="nom" required />
              <input type="tel" placeholder="téléphone" name="phone" required /> 
            </div>
            <textarea name="message" id="message" placeholder="votre message" required></textarea>
            <button type="submit">envoyer</button>
          </form>
      </section>
    </>
  );
}

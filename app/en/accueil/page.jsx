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
        <Image src="/img/fond.png" className="animate__animated animate__fadeIn" width={1000} height={1000} alt="background" />
        <div className={styles.headerContent}>
          <h1 className="animate__animated animate__fadeInUp">The Bread Tree</h1>
          <p className="animate__animated animate__fadeInUp">
            We are proud to offer you high-quality bakery and pastry products.
          </p>
          <a href="#contact" className="animate__animated animate__fadeIn">Contact&nbsp;us</a>
        </div>
      </section>
      <section className={styles.aboutUs}>
        <ScreenFitText text="Who We Are" />
        <div className={styles.aboutContent}>
          <h1>Who&nbsp;We&nbsp;Are</h1>
          <div className="flex-col-reverse lg:flex-row">
            <Image src="/img/categories/img1.jpg" width={400} height={400} alt="about us" />
            <p className="text-center lg:text-left">
              The Bread Tree offers hospitality and catering professionals a carefully selected range of breads and pastries, rooted in the great French baking and pastry tradition.
            </p>
          </div>
          <div className="flex-col lg:flex-row">
            <p className="text-center lg:text-right">
              More than just a supplier, The Bread Tree aims to be your partner in offering authentic and delicately balanced breads and pastries.
            </p>
            <Image src="/img/categories/img3.jpg" width={400} height={400} alt="about us" />
          </div>
          <p className={styles.aboutConclusion}>
            We remain attentive to market developments and your expectations to provide you with the best quality and optimal service, with a 24/7 hotline (including holidays).
          </p>
        </div>
      </section>
      <section className={styles.partenaires}>
        <ScreenFitTextPart text="Our Partners" />
        <div className={styles.partenairesContent}>
          <h1>Our Partners</h1>
          <PartnersBand />
        </div>
      </section>
      <section className={styles.categories}>
        <ScreenFitTextPart text="OUR CATEGORIES" />
        <div className={styles.categoriesContent}>
          <h1>OUR CATEGORIES</h1>
          <div className={styles.cards}>
            <a href="/en/cuit"
              onMouseEnter={() => setOnHoverLogo(1)}  
              onMouseLeave={() => setOnHoverLogo(null)} 
            >
              <div className={styles.card}>
                <Image src="/img/categories/cuit.jpeg" width={500} height={500} alt="Baked" />
                <Image src="/img/logo.png" className={`${styles.cardlogo} animate__animated ${onlogoHover == 1 ? 'animate__fadeIn flex' : 'flex animate__fadeOut'}`} width={300} height={300} alt="logo" />
                <h2>Baked</h2>
              </div>
            </a>
            <a href="/en/surgeler"
              onMouseEnter={() => setOnHoverLogo(2)}  
              onMouseLeave={() => setOnHoverLogo(null)} 
            >
              <div className={styles.card}>
                <Image src="/img/categories/surgeler.jpeg" width={500} height={500} alt="Frozen" />
                <Image src="/img/logo.png" className={`${styles.cardlogo} animate__animated ${onlogoHover == 2 ? 'animate__fadeIn flex' : 'flex animate__fadeOut'}`} width={300} height={300} alt="logo" />
                <h2>Frozen</h2>
              </div>
            </a>
            <a href="/en/traiteur"
              onMouseEnter={() => setOnHoverLogo(3)}  
              onMouseLeave={() => setOnHoverLogo(null)} 
            >
              <div className={styles.card}>
                <Image src="/img/categories/traiteur.jpeg" width={500} height={500} alt="Catering" />
                <Image src="/img/logo.png" className={`${styles.cardlogo} animate__animated ${onlogoHover == 3 ? 'animate__fadeIn flex' : 'flex animate__fadeOut'}`} width={300} height={300} alt="logo" />
                <h2>Catering</h2>
              </div>
            </a>
          </div>
        </div>
      </section>
      <section className={styles.contactForm} id="contact">
        <h1>Contact Us</h1>
          <form action="#">
            <div className="flex flex-row gap-5 w-full justify-center items-center">
              <input type="text" placeholder="Name" name="nom" required />
              <input type="tel" placeholder="Phone" name="phone" required /> 
            </div>
            <textarea name="message" id="message" placeholder="Your Message" required></textarea>
            <button type="submit">Send</button>
          </form>
      </section>
    </>
  );
}

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
          <h1 className="animate__animated animate__fadeInUp">شجرة الخبز</h1>
          <p className="animate__animated animate__fadeInUp">
            نحن فخورون بتقديم منتجات مخبوزات وحلويات عالية الجودة. 
          </p>
          <a href="#contact" className="animate__animated animate__fadeIn">اتصل&nbsp;بنا</a>
        </div>
      </section>
      <section className={styles.aboutUs}>
        <ScreenFitText text="من نحن" />
        <div className={styles.aboutContent}>
          <h1>من&nbsp;نحن</h1>
          <div className="flex-col-reverse lg:flex-row">
            <Image src="/img/categories/img1.jpg" width={400} height={400} alt="about us" />
            <p className="text-center lg:text-left">
              تقدم شجرة الخبز للمحترفين في الفنادق والمطاعم مجموعة مختارة بدقة من الخبز والمعجنات المستوحاة من التقاليد الفرنسية العريقة في المخابز والحلويات.
            </p>
          </div>
          <div className="flex-col lg:flex-row">
            <p className="text-center lg:text-right">
              أكثر من مجرد مزود، تهدف شجرة الخبز إلى أن تكون شريكك في تقديم خبز ومعجنات أصلية ومتوازنة بدقة.
            </p>
            <Image src="/img/categories/img3.jpg" width={400} height={400} alt="about us" />
          </div>
          <p className={styles.aboutConclusion}>
            نحن نتابع تطورات السوق وتوقعاتكم لنقدم لكم أفضل جودة، بالإضافة إلى خدمة مثالية على مدار 24 ساعة وطوال أيام الأسبوع (بما في ذلك العطل الرسمية).
          </p>
        </div>
      </section>
      <section className={styles.partenaires}>
        <ScreenFitTextPart text="شركاؤنا" />
        <div className={styles.partenairesContent}>
          <h1>شركاؤنا</h1>
          <PartnersBand />
        </div>
      </section>
      <section className={styles.categories}>
        <ScreenFitTextPart text="فئاتنا" />
        <div className={styles.categoriesContent}>
          <h1>فئاتنا</h1>
          <div className={styles.cards}>
            <a href="/ar/cuit"
              onMouseEnter={() => setOnHoverLogo(1)}  
              onMouseLeave={() => setOnHoverLogo(null)} 
            >
              <div className={styles.card}>
                <Image src="/img/categories/cuit.jpeg" width={500} height={500} alt="مخبوز" />
                <Image src="/img/logo.png" className={`${styles.cardlogo} animate__animated ${onlogoHover == 1 ? 'animate__fadeIn flex' : 'flex animate__fadeOut'}`} width={300} height={300} alt="logo" />
                <h2>مخبوز</h2>
              </div>
            </a>
            <a href="/ar/surgeler"
              onMouseEnter={() => setOnHoverLogo(2)}  
              onMouseLeave={() => setOnHoverLogo(null)} 
            >
              <div className={styles.card}>
                <Image src="/img/categories/surgeler.jpeg" width={500} height={500} alt="مجمد" />
                <Image src="/img/logo.png" className={`${styles.cardlogo} animate__animated ${onlogoHover == 2 ? 'animate__fadeIn flex' : 'flex animate__fadeOut'}`} width={300} height={300} alt="logo" />
                <h2>مجمد</h2>
              </div>
            </a>
            <a href="/ar/traiteur"
              onMouseEnter={() => setOnHoverLogo(3)}  
              onMouseLeave={() => setOnHoverLogo(null)} 
            >
              <div className={styles.card}>
                <Image src="/img/categories/traiteur.jpeg" width={500} height={500} alt="مُعالج" />
                <Image src="/img/logo.png" className={`${styles.cardlogo} animate__animated ${onlogoHover == 3 ? 'animate__fadeIn flex' : 'flex animate__fadeOut'}`} width={300} height={300} alt="logo" />
                <h2>مُعالج</h2>
              </div>
            </a>
          </div>
        </div>
      </section>
      <section className={styles.contactForm} id="contact">
        <h1>اتصل بنا</h1>
          <form action="#">
            <div className="flex flex-row gap-5 w-full justify-center items-center">
              <input type="text" placeholder="الاسم" name="nom" required />
              <input type="tel" placeholder="الهاتف" name="phone" required /> 
            </div>
            <textarea name="message" id="message" placeholder="رسالتك" required></textarea>
            <button type="submit">إرسال</button>
          </form>
      </section>
    </>
  );
}

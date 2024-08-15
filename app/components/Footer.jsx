import styles from './components.module.scss'
import Image from 'next/image'
import { FaMapMarkerAlt, FaMailBulk  } from "react-icons/fa";
import { MdOutlineAccessTime } from "react-icons/md";

export default function Footer(){
    return(
        <>
            <section className={styles.footerSection}>
                <Image src="/img/v2t.png" width={300} height={300} alt='logo' />
                <div className='flex flex-col lg:flex-row gap-20 justify-center items-start max-w-7xl mx-auto'>
                    <div className='flex flex-col justify-center items-center text-center'>
                        <h2><FaMapMarkerAlt/>&nbsp;Adresse</h2>
                        <p>102 Av. des Champs-Élysées 75008 Paris</p>
                    </div>
                    <div className='flex flex-col justify-center items-center text-center'>
                        <h2><MdOutlineAccessTime/>&nbsp;Horaires de commandes</h2>
                        <p>Lundi-Dimanche : 08:30 - 16:00</p>
                    </div>
                    <div className='flex flex-col justify-center items-center text-center'>
                        <h2><FaMailBulk />Information supplémentaire</h2>
                        <a href="tel:+33141192015">Téléphone: +33 1 41 19 20 15</a>
                        <a href="mailto: contactlarbreapains@gmail.com">Email : contactlarbreapains@gmail.com</a>
                        <a href="/cgv">CGV: Conditions générales de ventes</a>
                    </div>
                </div>
                <div className='mt-10'>
                    <p className='flex flex-row justify-center items-center'>©2024 L&apos;arbre à Pains. Powered by <a href="https://vkucode.com"><Image src='/img/vkulogo.png' className='!w-[45px]' width={100} height={100} alt='vkucode' /></a></p>
                </div>
            </section>
        </>
    )
}
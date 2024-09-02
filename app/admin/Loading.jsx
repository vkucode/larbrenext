'use client'
import styles from './dashboard/general.module.scss'
import Image from 'next/image'

export default function Loading(){
    return(
        <>
        <section className={styles.loadingPage}>
            <div>
                <Image src="/icon2.png" width={200} height={200} />
                </div>        
        </section>        
        </>
    )
}
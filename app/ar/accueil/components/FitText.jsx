'use client'
import React, { useEffect, useRef } from "react";
import styles from './fittext.module.scss'

export const ScreenFitText = ({text}) => {


  return (
    <div
      className={`${styles.containerText}`}
    >
      <span
        className={`${styles.textFull} ${styles.textScroll}`} // Adaugă clasa pentru animație
      >
       <p>
       {text}
       </p>
       <p>
       {text}
       </p>
       <p>
       {text}
       </p>
       <p>
       {text}
       </p>
       <p>
       {text}
       </p>
       <p>
       {text}
       </p>
       <p>
       {text}
       </p>
      </span>
      
    </div>
  );
};
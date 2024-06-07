'use client'
import React, { useEffect, useRef } from "react";
import styles from './fittextpart.module.scss'

export const ScreenFitTextPart = ({text}) => {


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
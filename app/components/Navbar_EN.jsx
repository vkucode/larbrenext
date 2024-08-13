"use client"
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import '../globals.css'
import styles from './components.module.scss'
import { FaMapMarkerAlt } from "react-icons/fa";
import { FiMenu, FiArrowRight } from "react-icons/fi";
import "../../node_modules/flag-icons/css/flag-icons.min.css"
import 'animate.css'

const Navbar = () => {
  return (
    <div className={`animate__animated animate__fadeInDown ${styles.navBar} fixed z-40 w-screen flex flex-col justify-center items-center`}>
      <FlipNav />
    </div>
  );
};

const FlipNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className={`max-w-7xl min-h-[65px] w-full sm:px-10 px-7 py-2 md:py-6 flex items-center justify-between relative`}>
      <NavLeft setIsOpen={setIsOpen} />
      <NavRight />
      <NavMenu isOpen={isOpen} />
      <NavMobileFlags />
    </nav>
  );
};

const Logo = () => {
  return (
    <Link href='/en/accueil' className="absolute left-[50%] translate-x-[-50%] top-[0%] z-10 text-4xl font-black text-white md:absolute md:left-[50%] md:-translate-x-[50%]">
    <Image src="/img/logoFond.png" alt="Pizzalif" width={90} height={90} />
  </Link>
  );
};

const NavLeft = ({ setIsOpen }) => {
  return (
    <div className="flex items-center gap-6">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="block lg:hidden text-amber-950 text-2xl"
        onClick={() => setIsOpen((pv) => !pv)}
      >
        <FiMenu />
      </motion.button>
      <Logo />
      <NavLink text="Baked" linksite="/en/cuit" />
      <NavLink text="Frozen" linksite="/en/surgeler" />
      <NavLink text="Catering" linksite="/en/traiteur" />
    </div>
  );
};

const NavLink = ({ text, linksite }) => {
  return (
    <a
      href={linksite}
      rel="nofollow"
      className="hidden lg:block h-[30px] overflow-hidden font-medium"
    >
      <motion.div whileHover={{ y: -30 }}>
        <span className="flex items-center h-[30px] text-black">{text}</span>
        <span className="flex items-center h-[30px] text-amber-800">
          {text}
        </span>
      </motion.div>
    </a>
  );
};

const NavRight = () => {
  return (
    <div className="hidden lg:flex items-center gap-4">
       <a href="/en/accueil#contact">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-4 py-2 bg-gradient-to-r flex flex-row justify-center items-center from-amber-800 to-amber-950 text-white font-medium rounded-md whitespace-nowrap"
      >
        Contact Us
      </motion.button>
      </a>
      <a href="/fr/accueil" className="text-2xl fi fi-fr"></a>
      <a href="/ar/accueil" className="text-2xl fi fi-ae"></a>
    </div>
  );
};

const NavMenu = ({ isOpen }) => {
  return (
    <motion.div
      variants={menuVariants}
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      className={`${styles.navBar} absolute py-3 shadow-lg left-0 right-0 top-full origin-top flex flex-col gap-3`}
    >
      <MenuLink text="Baked" linksite="/en/cuit" />
      <MenuLink text="Frozen" linksite="/en/surgeler" />
      <MenuLink text="Catering" linksite="/en/traiteur" />
      <MenuLink text="Contact Us" linksite="/en/#contact" />
    </motion.div>
  );
};

const NavMobileFlags = () => {
  return (
    <div className="flex flex-row gap-5 justify-center items-center lg:hidden">
      <a href="/fr/accueil" className="text-2xl fi fi-fr"></a>
      <a href="/ar/accueil" className="text-2xl fi fi-ae"></a>
    </div>
  );
};

const MenuLink = ({ text, linksite }) => {
  return (
    <motion.a
      variants={menuLinkVariants}
      rel="nofollow"
      href={linksite}
      className="h-[40px] hover:bg-amber-600 pl-4 py-1 w-screen text-black hover:text-white overflow-hidden font-medium text-xl flex items-start gap-2"
    >
      <motion.div whileHover={{ y: -30 }}>
        <span className="flex items-center h-[30px]">{text}</span>
      </motion.div>
    </motion.a>
  );
};

export default Navbar;

const menuVariants = {
  open: {
    scaleY: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  closed: {
    scaleY: 0,
    transition: {
      when: "afterChildren",
      staggerChildren: 0.1,
    },
  },
};

const menuLinkVariants = {
  open: {
    y: 0,
    opacity: 1,
  },
  closed: {
    y: -10,
    opacity: 0,
  },
};

const menuLinkArrowVariants = {
  open: {
    x: 0,
  },
  closed: {
    x: -4,
  },
};

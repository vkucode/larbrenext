'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './admin.module.scss';
import Image from 'next/image';
import { IoLogInOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";

export default function Admin() {
  const [login, setLogin] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Verificăm dacă utilizatorul are deja un token
    const checkSession = async () => {
      const response = await fetch('/api/check-session');
      if (response.ok) {
        router.push('/admin/dashboard');
      }
    };

    checkSession();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: login, pass }),
      });
  
      if (response.ok) {
        router.push('/admin/dashboard'); // Redirecționăm la dashboard
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Authentication failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred');
    }
  };

  return (
    <section className={styles.loginSection}>
      <form onSubmit={handleSubmit}>
        <Image src="/img/v2t.png" width={110} height={110} alt="logo" />
        <h2>Console d&apos;administration</h2>
        <div className={styles.inputDiv}>
          <FaUser />
          <input
            type="text"
            required
            name="login"
            id="login"
            placeholder="login"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
        </div>
        <div className={styles.inputDiv}>
          <RiLockPasswordFill />
          <input
            type="password"
            required
            name="pass"
            id="pass"
            placeholder="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit">
          Se connecter <IoLogInOutline />
        </button>
      </form>
    </section>
  );
}

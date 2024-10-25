'use client'
import { useState } from "react";

export default function UpdateTechnicalFiles() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpdateTechnicalFiles = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/addPrefixToImages", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message || "Fișele tehnice au fost actualizate cu succes.");
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || "A apărut o eroare la actualizarea fișelor tehnice.");
      }
    } catch (error) {
      setMessage("A apărut o eroare: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-dvh flex flex-col justify-center items-center">
      <button
        onClick={handleUpdateTechnicalFiles}
        disabled={loading}
        style={{
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Se actualizează..." : "Actualizează Fișele Tehnice"}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}

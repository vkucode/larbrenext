'use client'
import { useState } from "react";

export default function UpdateImages() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpdateImages = async () => {
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
        setMessage(data.message || "Imaginile au fost actualizate cu succes.");
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || "A apărut o eroare la actualizarea imaginilor.");
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
        onClick={handleUpdateImages}
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
        {loading ? "Se actualizează..." : "Actualizează Imaginile"}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}

import React, { useEffect } from "react";

function DetailPackageModal({ pkg, onClose }) {
  if (!pkg) return null;

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      onClose();
    }
  };

  // Shortcut ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container">
        <h1 className="modal-title">{pkg.nama.toUpperCase()}</h1>
        <h2 className="modal-subtitle">{pkg.resi}</h2>
        <p className="modal-text">
          Dimensi: {pkg.panjang} × {pkg.lebar} × {pkg.tinggi}
        </p>
        <p className="modal-text">Berat Asli: {pkg.berat} kg</p>
        <p className="modal-text">Berat Terpakai: {pkg.berat_dipakai} kg</p>
        <p className="modal-text">Via: {pkg.via}</p>
        <h3>Rp {Number(pkg.harga).toLocaleString("id-ID")}</h3>
        <button className="modal-button" onClick={onClose}>
          Tutup
        </button>
      </div>
    </div>
  );
}

export default DetailPackageModal;

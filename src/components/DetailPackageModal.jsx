import React, { useEffect } from "react";
import { removePackageFromInvoiceApi } from "../utils/api";

function DetailPackageModal({ pkg, invoiceId, onClose, onRemoved }) {
  if (!pkg) return null;

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      onClose();
    }
  };

  // Shortcut ESC untuk menutup modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleRemoveFromInvoice = async () => {
    if (!window.confirm("Yakin hapus paket ini dari invoice?")) return;

    try {
      await removePackageFromInvoiceApi(invoiceId, Number(pkg.id));
      alert("Paket berhasil dihapus dari invoice");
      if (onRemoved) onRemoved(Number(pkg.id));
      onClose();
    } catch (err) {
      alert(`Gagal hapus paket: ${err.message}`);
    }
  };


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

        <div className="modal-actions">
          <button className="modal-button" onClick={onClose}>
            Tutup
          </button>

          {/* Tampilkan tombol hanya jika paket sudah memiliki invoice */}
          {invoiceId && (
            <button
              className="modal-button danger"
              onClick={handleRemoveFromInvoice}
            >
              Hapus dari Invoice
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default DetailPackageModal;
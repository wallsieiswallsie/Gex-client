import React, { useEffect } from "react";
import { removePackageFromInvoiceApi } from "../../utils/api";

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
    <div
      className="modal-overlay fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="modal-container bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
        <h1 className="modal-title text-xl font-bold text-center mb-2">{pkg.nama.toUpperCase()}</h1>
        <h2 className="modal-subtitle text-center text-gray-500 mb-4">{pkg.resi} | {pkg.ekspedisi} </h2>

        {/* Foto paket */}
        {pkg.photo_url && (
          <div className="text-center mb-4">
            <img
              src={pkg.photo_url}
              alt={`Foto ${pkg.nama}`}
              className="max-w-full max-h-60 object-contain rounded-lg mx-auto"
            />
          </div>
        )}

        <div className="modal-details mb-4 rounded-xl overflow-hidden">
  {[
    { label: "Dimensi", value: `${pkg.panjang} × ${pkg.lebar} × ${pkg.tinggi}`, bg: "bg-green-100" },
    { label: "Berat Asli", value: `${pkg.berat} kg`, bg: "bg-green-200" },
    { label: "Berat Terpakai", value: `${pkg.berat_dipakai} kg`, bg: "bg-yellow-100" },
    { label: "Via", value: pkg.via, bg: "bg-blue-100" },
  ].map((item, idx) => (
    <div key={idx} className={`${item.bg} px-4 py-2 flex justify-between`}>
      <span className="font-medium">{item.label}</span>
      <span>{item.value}</span>
    </div>
  ))}
</div>

      <div className="flex justify-center items-center gap-1">
        <h3 className="text-center text-[#3e146d] font-bold text-lg mb-6">
          {pkg.kode}
        </h3>

        <h3 className="text-center text-[#3e146d] font-bold text-lg mb-6">
          Rp {Number(pkg.harga).toLocaleString("id-ID")}
        </h3>
      </div>

        {/* Tombol aksi */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            className="modal-button bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg transition"
            onClick={onClose}
          >
            Tutup
          </button>

          {invoiceId && !pkg.finished && (
            <button
              className="modal-button bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition"
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
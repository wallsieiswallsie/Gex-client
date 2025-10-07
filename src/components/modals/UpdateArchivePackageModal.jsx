import { useState } from "react";

function UpdateArchivePackageModal({ onClose, archivePengantaranApi }) {
  const [resi, setResi] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!resi.trim()) {
      setError("Resi tidak boleh kosong");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await archivePengantaranApi(resi); 
      onClose(); // Tutup modal setelah sukses
    } catch (err) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      onClose();
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={handleOverlayClick}
    >
      <div className="modal-container">
        <h2 className="modal-title">Selesaikan Pengantaran</h2>

        <input
          type="text"
          placeholder="Masukkan nomor resi"
          value={resi}
          onChange={(e) => setResi(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="update_archive_pengantaran_modal-button"
        >
          {loading ? "Memproses..." : "Selesaikan"}
        </button>

        <button
          onClick={onClose}
          className="update_archive_pengantaran_modal-button"
        >
          Batal
        </button>
      </div>
    </div>
  );
}

export default UpdateArchivePackageModal;
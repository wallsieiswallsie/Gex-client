import { useState } from "react";
import { addPackageStatus } from "../../utils/api";

function UpdateActivePackageModal({ onClose, activePengantaranApi}) {
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
      // 1️⃣ Jalankan aktivasi pengantaran (update resi)
      await activePengantaranApi(resi);

      // 3️⃣ Tutup modal setelah sukses
      onClose();
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat update status");
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
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container">
        <h2 className="modal-title">Aktifkan Pengantaran</h2>

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
          className="update_active_pengantaran_modal-button bg-green-600 text-white hover:bg-green-700"
        >
          {loading ? "Memproses..." : "Sudah di Pick Up"}
        </button>

        <button
          onClick={onClose}
          className="update_active_pengantaran_modal-button bg-gray-400 text-white hover:bg-gray-500 mt-2"
        >
          Batal
        </button>
      </div>
    </div>
  );
}

export default UpdateActivePackageModal;

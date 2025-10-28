import { useState } from "react";
import { addPackageToBatchPesawatApi } from "../../utils/api";

export default function AddPackageToBatchPesawatModal({ batchId, onClose, onSuccess }) {
  const [resi, setResi] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTambah = async (e) => {
    e.preventDefault();

    if (!resi.trim()) {
      alert("⚠️ Resi tidak boleh kosong");
      return;
    }

    setLoading(true);
    try {
      const res = await addPackageToBatchPesawatApi(batchId, resi);

      if (res.success || res.status === "success") {
        alert("Paket berhasil ditambahkan ke batch pesawat!");
        setResi("");
        onSuccess?.();
      }
      else if (res.message?.includes("sudah ada di batch")) {
        alert(`Paket dengan resi ${resi} sudah ada di batch ini.`);
      }
      else if (res.message?.includes("tidak ditemukan")) {
        alert(`Paket dengan resi ${resi} tidak ditemukan.`);
      }
      else {
        alert("Gagal menambahkan paket: " + (res.message || "Unknown error"));
      }

    } catch (err) {
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else if (err.message) {
        alert(err.message);
      } else {
        alert("Terjadi kesalahan yang tidak diketahui.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="text-lg font-bold mb-4">Tambah Paket ke Batch Pesawat</h2>

        <form onSubmit={handleTambah} className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Masukkan Resi"
            value={resi}
            onChange={(e) => setResi(e.target.value)}
            className="border px-2 py-1 rounded w-full"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Tambah"}
          </button>
        </form>

        <button
          onClick={onClose}
          className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}
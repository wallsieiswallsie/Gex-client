import { useState } from "react";
import { addPackageToKarungApi } from "../../utils/api";

export default function PackingPackageToKarung({ karung, batchId, onClose, onSuccess }) {
  const [resi, setResi] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTambah = async (e) => {
    e.preventDefault();
    if (!resi.trim()) {
      alert("Resi tidak boleh kosong");
      return;
    }

    setLoading(true);
    try {
      const res = await addPackageToKarungApi(batchId, resi, karung.no_karung);
      if (res.status === "success") {
        alert("Paket berhasil ditambahkan ke karung!");
        setResi("");
        onSuccess?.();   // refresh data
        onClose?.();     // tutup modal
      } else {
        alert("Gagal menambahkan paket: " + res.message);
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menambahkan paket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="text-lg font-bold mb-4">
          Packing Paket ke Karung {karung.no_karung}
        </h2>
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
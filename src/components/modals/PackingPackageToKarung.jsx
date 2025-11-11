import { useState } from "react";
import { addPackageToKarungApi } from "../../utils/api";

export default function PackingPackageToKarung({
  karung,
  batchId,
  onClose,
  onSuccess,
}) {
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
      const res = await addPackageToKarungApi(
        batchId,
        resi,
        karung.no_karung
      );
      if (res.status === "success") {
        alert("Paket berhasil ditambahkan ke karung!");
        setResi("");
        onSuccess?.();
        onClose?.();
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
    <div
      className="modal-overlay fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center"
      onClick={onClose} // ✅ klik overlay menutup modal
    >
      <div
        className="modal-container bg-white p-4 rounded shadow-lg w-[350px]"
        onClick={(e) => e.stopPropagation()} // ✅ supaya klik di dalam modal tidak menutup
      >
        <h2 className="text-lg font-bold mb-4">
          Packing Paket ke Karung {karung.no_karung}
        </h2>

        <form onSubmit={handleTambah} className="flex gap-2 mb-4">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Masukkan Resi"
              value={resi}
              onChange={(e) => setResi(e.target.value)}
              className="border px-2 py-1 rounded w-full pr-8"
              disabled={loading}
            />

            {/* ✅ Tombol X muncul hanya jika ada teks */}
            {resi.length > 0 && (
              <button
                type="button"
                onClick={() => setResi("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-transparent p-0 text-gray-500 hover:text-black"
              >
                ✕
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#3e146d] text-white px-3 py-1 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "..." : "+"}
          </button>
        </form>

        <button
          onClick={onClose}
          className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 w-full"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}
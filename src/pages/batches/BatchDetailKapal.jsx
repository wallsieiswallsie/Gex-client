import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // ✅ tambahkan useNavigate
import { 
  getBatchWithKarungApi,
  addNoKarungToBatchKapalApi,
  addPackageToKarungApi,
} from "../../utils/api";
import PackingPackageToKarung from "../../components/modals/PackingPackageToKarung";

export default function BatchDetailKapal() {
  const { batchId } = useParams();
  const navigate = useNavigate(); // ✅ inisialisasi navigate
  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [noKarung, setNoKarung] = useState("");
  const [selectedKarung, setSelectedKarung] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getBatchWithKarungApi(batchId);
      if (res.status === "success") setBatch(res.data);
    } catch (err) {
      console.error(err);
      alert("Gagal mengambil detail batch kapal");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [batchId]);

  const handleAddKarung = async (e) => {
    e.preventDefault();
    try {
      const res = await addNoKarungToBatchKapalApi(batchId, noKarung);
      if (res.status === "success") {
        alert("Berhasil menambahkan nomor karung");
        setShowForm(false);
        setNoKarung("");
        fetchData();
      } else {
        alert("Gagal menambahkan karung: " + res.message);
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menambahkan karung");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!batch) return <p>Batch tidak ditemukan</p>;

  return (
    <div className="detail_batch_kapal-container">
      <h1 className="text-xl font-bold mb-4">{batch.id}</h1>
      <p><strong>{batch.nama_kapal.toUpperCase()}</strong></p>
      <p><strong>Tanggal Closing:</strong> {batch.tanggal_closing.split('T')[0]}</p>
      <p><strong>Tanggal Berangkat:</strong> {batch.tanggal_berangkat.split('T')[0]}</p>
      <p><strong>Total Berat:</strong> {batch.total_berat} kg</p>
      <p><strong>Total Nilai:</strong> Rp {Number(batch.total_value).toLocaleString("id-ID")}</p>

      <div className="flex justify-between items-center mt-6 mb-2">
        <h2 className="text-lg font-semibold">Daftar Karung</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
        >
          + Add Karung
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddKarung} className="mb-4 flex gap-2">
          <input
            type="text"
            placeholder="Masukkan No Karung"
            value={noKarung}
            onChange={(e) => setNoKarung(e.target.value)}
            className="border px-2 py-1 rounded w-64"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Simpan
          </button>
        </form>
      )}

      {batch.karung && batch.karung.length > 0 ? (
        <div className="karung-container">
          {batch.karung.map((karung) => (
            <div
              className="karung-card"
              key={karung.id}
            >
              <h2 className="font-bold text-lg mb-2">Karung: {karung.no_karung}</h2>
              <p>Total Paket: {karung.packages?.length || 0}</p>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setSelectedKarung(karung)}
                  className="flex-1 bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600"
                >
                  Packing Paket
                </button>

                {/* ✅ Tombol navigasi ke halaman daftar paket karung */}
                <button
                  onClick={() =>
                    navigate(`/batches/kapal/${batchId}/karung/${karung.no_karung}`)
                  }
                  className="flex-1 bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
                >
                  Lihat Paket
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Belum ada karung di batch ini</p>
      )}

      {selectedKarung && (
        <PackingPackageToKarung
          karung={selectedKarung}
          onClose={() => setSelectedKarung(null)}
          onSuccess={fetchData}
          batchId={batchId}
          addPackageToKarungApi={addPackageToKarungApi}
        />
      )}
    </div>
  );
}
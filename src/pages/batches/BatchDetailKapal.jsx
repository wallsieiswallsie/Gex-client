import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchBatchKapalDetailApi, addPackageToBatchKapalApi } from "../../utils/api";

export default function BatchDetailKapal() {
  const { batchId } = useParams();
  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [resi, setPackageId] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchBatchKapalDetailApi(batchId);
      if (data.success) setBatch(data.data);
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

  const handleAddPackage = async (e) => {
    e.preventDefault();
    try {
      const res = await addPackageToBatchKapalApi(batchId, resi);
      if (res.success) {
        alert("Package berhasil ditambahkan!");
        setShowForm(false);
        setPackageId("");
        fetchData();
      } else {
        alert("Gagal menambahkan package: " + res.message);
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menambahkan package");
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
        <h2 className="text-lg font-semibold">Daftar Paket</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
        >
          + Add Package
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddPackage} className="mb-4 flex gap-2">
          <input
            type="text"
            placeholder="Masukkan Resi"
            value={resi}
            onChange={(e) => setPackageId(e.target.value)}
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

      {batch.packages && batch.packages.length > 0 ? (
        <div className="cards-container">
          {batch.packages.map((pkg) => (
            <div className="package-card" key={pkg.id}>
                <h2>{pkg.nama.toUpperCase()}</h2>
                <h4>{pkg.resi}</h4>
                <p>{pkg.berat_dipakai} kg</p>
                <p>Rp {Number(pkg.harga).toLocaleString("id-ID")}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Belum ada paket di batch ini</p>
      )}
    </div>
  );
}
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchBatchPesawatDetailApi } from "../../utils/api";
import AddPackageToBatchPesawatModal from "../../components/modals/AddPackageToBatchPesawatModal";

export default function BatchDetailPesawat() {
  const { batchId } = useParams();
  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchBatchPesawatDetailApi(batchId);
      if (data.success) setBatch(data.data);
    } catch (err) {
      console.error(err);
      alert("Gagal mengambil detail batch pesawat");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [batchId]);

  if (loading) return <p>Loading...</p>;
  if (!batch) return <p>Batch tidak ditemukan</p>;

  return (
    <div className="detail_batch-container">
      <h1>{batch.id}</h1>
      <p><strong>Nama PIC:</strong> {batch.pic.toUpperCase()}</p>
      <p><strong>Tanggal Kirim:</strong> {batch.tanggal_kirim.split("T")[0]}</p>
      <p><strong>Total Berat:</strong> {batch.total_berat} kg</p>
      <p><strong>Total Nilai:</strong> Rp {Number(batch.total_value).toLocaleString("id-ID")}</p>

      <div className="mt-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Daftar Paket</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          + Tambah Paket
        </button>
      </div>

      {batch.packages && batch.packages.length > 0 ? (
        <div className="card-container">
          {batch.packages.map((pkg) => (
            <div key={pkg.id} className="package-card">
              <p>{pkg.nama.toUpperCase()}</p> 
              <p>{pkg.resi.toUpperCase()}</p>
              <p>{pkg.berat_dipakai} kg</p>
              <p>Rp {Number(pkg.harga).toLocaleString("id-ID")}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Belum ada paket di batch ini</p>
      )}

      {showAddModal && (
        <AddPackageToBatchPesawatModal
          batchId={batchId}
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
}
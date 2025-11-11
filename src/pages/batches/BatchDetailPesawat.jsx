import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { fetchBatchPesawatDetailApi } from "../../utils/api";
import AddPackageToBatchPesawatModal from "../../components/modals/AddPackageToBatchPesawatModal";

export default function BatchDetailPesawat() {
  const { batchId } = useParams();
  const { user } = useAuth(); // <-- ambil role user di sini
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

  if (loading)
    return <p className="text-center text-gray-500 mt-10">Loading...</p>;
  if (!batch) return <p className="text-center text-gray-500 mt-10">Batch tidak ditemukan</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 mb-10 px-4 md:px-6 flex flex-col gap-6">
      {/* Info batch */}
      <div className="bg-white border border-[#3e146d]/20 shadow-lg rounded-2xl p-6 flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-[#3e146d]">Batch: {batch.id}</h1>

        {/* Nama PIC hanya untuk Manager/Staff Main Warehouse */}
        {(user?.role === "Manager Main Warehouse" || user?.role === "Staff Main Warehouse") && (
          <p><strong>Nama PIC:</strong> {batch.pic.toUpperCase()}</p>
        )}

        <p><strong>Tanggal Kirim:</strong> {batch.tanggal_kirim.split("T")[0]}</p>
        <p><strong>Total Berat:</strong> {batch.total_berat} kg</p>

        {/* Total Nilai hanya untuk Manager Destination/Main Warehouse */}
        {(user?.role === "Manager Destination Warehouse" || user?.role === "Manager Main Warehouse") && (
          <p><strong>Total Nilai:</strong> Rp {Number(batch.total_value).toLocaleString("id-ID")}</p>
        )}
      </div>

      {/* Header Paket */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-[#3e146d]">Daftar Paket</h2>

        {/* Tombol + hanya untuk Manager/Staff Main Warehouse */}
        {(user?.role === "Manager Main Warehouse" || user?.role === "Staff Main Warehouse") && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#3e146d] text-white px-4 py-2 rounded-3xl hover:opacity-90"
          >
            +
          </button>
        )}
      </div>

      {/* List Paket */}
      {batch.packages && batch.packages.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {batch.packages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white border border-[#3e146d]/20 shadow-lg rounded-2xl p-4 flex flex-col gap-1 hover:shadow-xl transition"
            >
              <p className="font-semibold text-[#3e146d]">{pkg.nama.toUpperCase()}</p>
              <p className="text-gray-600">Resi: {pkg.resi.toUpperCase()}</p>
              <p className="text-gray-600">Berat: {pkg.berat_dipakai} kg</p>

              {/* Harga hanya untuk Manager Main/Manager Destination Warehouse */}
              {(user?.role === "Manager Main Warehouse" || user?.role === "Manager Destination Warehouse") && (
                <p className="text-gray-600">Harga: Rp {Number(pkg.harga).toLocaleString("id-ID")}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Belum ada paket di batch ini</p>
      )}

      {/* Modal Add Paket */}
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
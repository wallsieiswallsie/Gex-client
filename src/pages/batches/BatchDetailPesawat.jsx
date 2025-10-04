import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchBatchPesawatDetailApi } from "../../utils/api";

export default function BatchDetailPesawat() {
  const { batchId } = useParams();
  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchData();
  }, [batchId]);

  if (loading) return <p>Loading...</p>;
  if (!batch) return <p>Batch tidak ditemukan</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Detail Batch Pesawat {batch.id}</h1>
      <p><strong>Nama Pesawat:</strong> {batch.nama_pesawat}</p>
      <p><strong>Tanggal Closing:</strong> {batch.tanggal_closing}</p>
      <p><strong>Tanggal Berangkat:</strong> {batch.tanggal_berangkat}</p>

      <h2 className="text-lg font-semibold mt-4 mb-2">Daftar Paket</h2>
      {batch.packages && batch.packages.length > 0 ? (
        <ul className="list-disc pl-6">
          {batch.packages.map(pkg => (
            <li key={pkg.id}>
              {pkg.name} (Resi: {pkg.resi}, Berat: {pkg.berat_dipakai})
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">Belum ada paket di batch ini</p>
      )}
    </div>
  );
}
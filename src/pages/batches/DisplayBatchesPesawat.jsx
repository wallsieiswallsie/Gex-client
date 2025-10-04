import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchBatchesPesawatApi } from "../../utils/api";

export default function DisplayBatchesPesawat() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchBatchesPesawatApi();
        if (data.success) setBatches(data.data);
      } catch (err) {
        console.error(err);
        alert("Gagal mengambil data batch pesawat");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Daftar Batch Pesawat</h1>
      <table className="w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Nama Pesawat</th>
            <th className="border px-4 py-2">Tanggal Closing</th>
            <th className="border px-4 py-2">Tanggal Berangkat</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {batches.map(batch => (
            <tr key={batch.id}>
              <td className="border px-4 py-2">{batch.id}</td>
              <td className="border px-4 py-2">{batch.nama_pesawat}</td>
              <td className="border px-4 py-2">{batch.tanggal_closing}</td>
              <td className="border px-4 py-2">{batch.tanggal_berangkat}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => navigate(`/batches/pesawat/${batch.id}`)}
                  className="bg-indigo-500 text-white px-2 py-1 rounded hover:bg-indigo-600"
                >
                  Detail
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
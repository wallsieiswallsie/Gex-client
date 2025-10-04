// src/pages/batches/DisplayBatchesKapal.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { fetchBatchesKapalApi, createBatchesKapalApi } from "../../utils/api";
import UpdateStatusBatchModal from "../../components/modals/UpdateStatusBatchModal";

export default function DisplayBatchesKapal() {
  const { user } = useAuth();
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    namaKapal: "",
    tanggalClosing: "",
    tanggalBerangkat: "",
    namaVendor: "",
  });
  const [selectedBatch, setSelectedBatch] = useState(null); // batch yang mau diupdate

  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchBatchesKapalApi();
      if (data.success) setBatches(data.data);
    } catch (err) {
      console.error(err);
      alert("Gagal mengambil data batch kapal");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddBatch = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        nama_kapal: formData.namaKapal,
        tanggal_closing: formData.tanggalClosing,
        tanggal_berangkat: formData.tanggalBerangkat,
        vendor: formData.namaVendor,
        packageIds: [],
        userId: user?.id || null,
      };

      const res = await createBatchesKapalApi(payload);
      if (res.success) {
        alert("Batch berhasil dibuat!");
        setShowForm(false);
        setFormData({ 
          namaKapal: "",
          tanggalClosing: "",
          tanggalBerangkat: "",
          namaVendor: "",
        });
        fetchData();
      } else {
        alert("Gagal membuat batch: " + res.message);
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat membuat batch");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="ddp_batch_kapal-container">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Daftar Batch Kapal</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          + Add Batch
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleAddBatch}
          className="mb-6 p-4 border rounded bg-gray-50"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-1">Nama Kapal</label>
              <input
                type="text"
                value={formData.namaKapal}
                onChange={(e) =>
                  setFormData({ ...formData, namaKapal: e.target.value })
                }
                className="border px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="block mb-1">Tanggal Closing</label>
              <input
                type="date"
                value={formData.tanggalClosing}
                onChange={(e) =>
                  setFormData({ ...formData, tanggalClosing: e.target.value })
                }
                className="border px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="block mb-1">Tanggal Berangkat</label>
              <input
                type="date"
                value={formData.tanggalBerangkat}
                onChange={(e) =>
                  setFormData({ ...formData, tanggalBerangkat: e.target.value })
                }
                className="border px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="block mb-1">Vendor</label>
              <input
                type="text"
                value={formData.namaVendor}
                onChange={(e) =>
                  setFormData({ ...formData, namaVendor: e.target.value })
                }
                className="border px-2 py-1 w-full"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Simpan
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Batal
            </button>
          </div>
        </form>
      )}

      <div className="batch-container">
        {batches.map((batch) => (
          <div className="batch-card" key={batch.id}>
            <h2>{batch.id}</h2>
            <h5>{batch.nama_kapal.toUpperCase()}</h5>
            <p>{batch.tanggal_closing.split("T")[0]}</p>
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/batches/kapal/${batch.id}`)}
                className="bg-indigo-500 text-white px-2 py-1 rounded hover:bg-indigo-600"
              >
                Detail
              </button>
              <button
                onClick={() => setSelectedBatch(batch)}
                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
              >
                Update
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Update */}
      {selectedBatch && (
        <UpdateStatusBatchModal
          batch={selectedBatch}
          onClose={() => setSelectedBatch(null)}
          onUpdated={fetchData}
        />
      )}
    </div>
  );
}
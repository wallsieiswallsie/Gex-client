import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { fetchBatchesPesawatApi, createBatchesPesawatApi } from "../../utils/api";
import UpdateStatusBatchModal from "../../components/modals/UpdateStatusBatchModal";

export default function DisplayBatchesPesawat() {
  const { user } = useAuth();
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    namaPIC: "",
    tanggalKirim: "",
    namaVendor: "",
  });
  const [selectedBatch, setSelectedBatch] = useState(null);

  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchBatchesPesawatApi();
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
        pic: formData.namaPIC,
        tanggal_kirim: formData.tanggalKirim,
        vendor: formData.namaVendor,
        packageIds: [],
        userId: user?.id || null,
      };

      const res = await createBatchesPesawatApi(payload);
      if (res.success) {
        alert("Batch berhasil dibuat!");
        setShowForm(false);
        setFormData({ 
          namaPIC: "",
          tanggalKirim: "",
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
    <div className="ddp_batch-container">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Daftar Batch Pesawat</h1>
        <button
          onClick={() => setShowForm(true)}
        >
          + 
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleAddBatch}
          className="mb-6 p-4 border rounded bg-gray-50"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-1">Nama PIC</label>
              <input
                type="text"
                value={formData.namaPIC}
                onChange={(e) =>
                  setFormData({ ...formData, namaPIC: e.target.value })
                }
                className="border px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="block mb-1">Tanggal Kirim</label>
              <input
                type="date"
                value={formData.tanggalKirim}
                onChange={(e) =>
                  setFormData({ ...formData, tanggalKirim: e.target.value })
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

      <div className="cards-container">
        {batches.map((batch) => (
          <div className="card" key={batch.id}>
            <h3>{batch.id}</h3>
            <p>{batch.tanggal_kirim.split("T")[0]}</p>
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/batches/pesawat/${batch.id}`)}
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
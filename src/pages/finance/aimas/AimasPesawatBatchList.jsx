import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchBatchesPesawatApi } from "../../../utils/api";

const AimasPesawatBatchList = () => {
  const navigate = useNavigate();
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getBatches = async () => {
      try {
        setLoading(true);
        const res = await fetchBatchesPesawatApi();
        setBatches(res.data || res);
      } catch (err) {
        console.error("Gagal memuat batch kapal:", err);
        setError(err.message || "Terjadi kesalahan saat memuat batch kapal.");
      } finally {
        setLoading(false);
      }
    };

    getBatches();
  }, []);

  if (loading) return <div className="p-6 text-center">Memuat daftar batch...</div>;
  if (error) return <div className="p-6 text-red-500 text-center">{error}</div>;
  if (batches.length === 0) return <div className="p-6 text-center">Belum ada batch pesawat tersedia.</div>;

  return (
    <div className="financial_statement-container">
      <h2>Daftar Batch Pesawat</h2>
      <div className="cards-container">
        {batches.map((batch) => (
          <div
            key={batch.id}
            onClick={() => navigate(`/aimas-pesawat/${batch.id}`)}
            className="batch-card"
          >
            <h3 className="text-lg font-semibold mb-2">{batch.id}</h3>
            <h4 className="text-lg font-semibold mb-2">{(batch.tanggal_kirim).split('T')[0]}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AimasPesawatBatchList;
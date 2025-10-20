import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchBatchesKapalApi } from "../../../utils/api";

const AimasKapalBatchList = () => {
  const navigate = useNavigate();
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getBatches = async () => {
      try {
        setLoading(true);
        const res = await fetchBatchesKapalApi();
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
  if (batches.length === 0) return <div className="p-6 text-center">Belum ada batch kapal tersedia.</div>;

  return (
    <div className="financial_statement-container">
      <h2>Daftar Batch Kapal</h2>
      <div className="cards-container">
        {batches.map((batch) => (
          <div
            key={batch.id}
            onClick={() => navigate(`/aimas-kapal/${batch.id}`)}
            className="batch-card"
          >
            <h2 className="text-lg font-semibold mb-2">{batch.id}</h2>
            <p className="text-gray-600 text-sm mb-1">
              <span className="font-medium">{batch.nama_kapal.toUpperCase()}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AimasKapalBatchList;
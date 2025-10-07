import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchArchivePengantaranApi } from "../../utils/api";

function ArchiveDeliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [showModal, setShowModal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const result = await fetchArchivePengantaranApi();
        setDeliveries(result.data || []);
      } catch (err) {
        console.error("Error fetching active deliveries:", err);
        setError("Gagal memuat data pengantaran aktif");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <p>Loading archive deliveries...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      {deliveries.length === 0 ? (
        <p>Tidak ada arsip pengantaran.</p>
      ) : (
        <div className="delivery-container">
          <h2>Archive Deliveries</h2>
          <div className="cards-container grid gap-4">
            {deliveries.map((inv) => (
              <div
                key={inv.invoice_id}
                className="package-card border p-4 rounded shadow relative"
              >
                <div
                  onClick={() => navigate(`/invoices/${inv.invoice_id}`)}
                  className="cursor-pointer"
                >
                  <h3 className="border px-2 py-1 font-bold">
                    {inv.invoice_id}
                  </h3>
                  <p className="border px-2 py-1">
                    Rp {Number(inv.total_price)?.toLocaleString("id-ID")}
                  </p>
                  <p className="border px-2 py-1">
                    Jumlah Paket: {inv.total_packages}
                  </p>
                </div>

                {showModal === inv.invoice_id && null}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ArchiveDeliveries;
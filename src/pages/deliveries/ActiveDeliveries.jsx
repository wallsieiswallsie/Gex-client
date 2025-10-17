import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchActivePengantaranApi, archivePengantaranApi } from "../../utils/api";
import UpdateArchivePackageModal from "../../components/modals/UpdateArchivePackageModal";

function ActiveDeliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [showModal, setShowModal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const result = await fetchActivePengantaranApi();
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

  if (loading) return <p>Loading active deliveries...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      {deliveries.length === 0 ? (
        <p>Tidak ada pengantaran aktif.</p>
      ) : (
        <div className="delivery-container">
         <h2>Active Deliveries</h2> 
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
                  </div>

                  <button
                    onClick={() => setShowModal(inv.invoice_id)}
                    className="mt-3 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                  >
                    Input Resi Selesai
                  </button>

                  {showModal === inv.invoice_id && (
                    <UpdateArchivePackageModal
                      onClose={() => setShowModal(null)}
                      archivePengantaranApi={archivePengantaranApi}
                    />
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ActiveDeliveries;
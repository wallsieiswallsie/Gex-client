import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchArchivePengantaranApi } from "../../utils/api";

function ArchiveDeliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [search, setSearch] = useState(""); // input pencarian
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Ambil data archive dari backend
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await fetchArchivePengantaranApi();
        const data = res.data || [];
        setDeliveries(data);
        setFilteredDeliveries(data);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat data arsip pengantaran");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter invoice berdasarkan invoice_id atau resi paket
  useEffect(() => {
    if (!search) {
      setFilteredDeliveries(deliveries);
    } else {
      const query = search.toLowerCase();
      const filtered = deliveries.filter(
        (inv) =>
          inv.invoice_id.toLowerCase().includes(query) ||
          inv.packages.some((pkg) =>
            pkg.resi.toLowerCase().includes(query)
          )
      );
      setFilteredDeliveries(filtered);
    }
  }, [search, deliveries]);

  if (loading) return <p>Loading archive deliveries...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Archive Deliveries</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Cari berdasarkan invoice atau resi paket..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-2 py-1 rounded w-full"
        />
      </div>

      {filteredDeliveries.length === 0 ? (
        <p>Tidak ada arsip pengantaran.</p>
      ) : (
        <div className="cards-container">
          {filteredDeliveries.map((inv) => (
            <div key={inv.invoice_id} className="card">
              <div
                onClick={() => navigate(`/invoices/${inv.invoice_id}`)}
                className="cursor-pointer"
              >
                <h3 className="border px-2 py-1 font-bold">{inv.invoice_id}</h3>
                <p className="border px-2 py-1">
                  Rp {Number(inv.total_price).toLocaleString("id-ID")}
                </p>
                <p className="border px-2 py-1">
                  Jumlah Paket: {inv.total_packages}
                </p>
                <div className="mt-2">
                  {inv.packages.map((pkg) => (
                    <p key={pkg.id} className="text-sm border px-2 py-1">
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ArchiveDeliveries;
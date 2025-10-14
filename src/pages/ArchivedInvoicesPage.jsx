import { useEffect, useState, useMemo } from "react";
import { useApi, fetchArchivedInvoicesApi } from "../utils/api";
import { useNavigate } from "react-router-dom";

function ArchivedInvoicesPage() {
  const { request } = useApi();
  const navigate = useNavigate();

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadArchivedInvoices = async () => {
      setLoading(true);
      try {
        const res = await request(fetchArchivedInvoicesApi);
        setInvoices(res.data || []);
      } catch (err) {
        console.error("Gagal ambil invoice arsip:", err);
      } finally {
        setLoading(false);
      }
    };

    loadArchivedInvoices();
  }, [request]);

  // Filter invoice berdasarkan search
  const filteredInvoices = useMemo(() => {
    if (!search.trim()) return invoices;
    return invoices.filter((inv) =>
      inv.nama_invoice.toLowerCase().includes(search.toLowerCase())
    );
  }, [invoices, search]);

  if (loading) return <p>Loading invoice arsip...</p>;

  return (
    <div className="invoice-container">
      <h2>Invoice Arsip</h2>

      {/* Input pencarian */}
      <div style={{ marginBottom: "16px" }}>
        <input
          type="text"
          placeholder="Cari berdasarkan nama invoice..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      {filteredInvoices.length === 0 ? (
        <p>Invoice tidak ditemukan.</p>
      ) : (
        <div className="cards-container">
          {filteredInvoices.map((inv) => (
            <div
              key={inv.id}
              className="package-card"
              onClick={() =>
                navigate(`/invoices/${inv.id}`, { state: { archived: true } })
              }
            >
              <h3>{inv.nama_invoice.toUpperCase()}</h3>
              <h4>{inv.id}</h4>
              <p>Rp {Number(inv.total_price).toLocaleString("id-ID")}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ArchivedInvoicesPage;
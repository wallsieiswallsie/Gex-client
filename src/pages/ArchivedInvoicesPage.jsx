import { useEffect, useState, useMemo } from "react";
import { useApi, fetchArchivedInvoicesApi } from "../utils/api";
import { useNavigate } from "react-router-dom";

function ArchivedInvoicesPage() {
  const { request } = useApi();
  const navigate = useNavigate();

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("semua");

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

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const searchLower = search.toLowerCase();

      // Cek apakah nama atau id mengandung kata pencarian
      const matchesSearch =
        inv.nama_invoice?.toLowerCase().includes(searchLower) ||
        inv.id?.toString().toLowerCase().includes(searchLower);

      const branch = inv.cabang?.toLowerCase() || "";
      const matchesBranch =
        branchFilter === "semua" ||
        branch === branchFilter.toLowerCase();

      return matchesSearch && matchesBranch;
    });
  }, [invoices, search, branchFilter]);

  if (loading) return <p>Loading invoice arsip...</p>;

  return (
    <div className="invoice-container">
      <h2>Invoice Arsip</h2>

      {/* Input pencarian + Filter cabang */}
<div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "20px",
  }}
>
  {/* Input pencarian */}
  <input
    type="text"
    placeholder="Cari berdasarkan nama atau id invoice"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    style={{
      flex: 1,
      padding: "8px",
      borderRadius: "4px",
      border: "1px solid #ccc",
    }}
  />

  {/* Filter cabang */}
  <select
    id="branchFilter"
    value={branchFilter}
    onChange={(e) => setBranchFilter(e.target.value)}
    style={{
      padding: "8px",
      borderRadius: "4px",
      border: "1px solid #ccc",
      minWidth: "120px",
    }}
  >
    <option value="semua">Semua Cabang</option>
    <option value="remu">Remu</option>
    <option value="aimas">Aimas</option>
  </select>
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
                <p>{inv.id}</p>
                <p>Jumlah Paket: {inv.package_count}</p>
                <h4>Rp {Number(inv.total_price).toLocaleString("id-ID")}</h4>
                {inv.cabang && <h3>{inv.cabang.toUpperCase()}</h3>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ArchivedInvoicesPage;
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useInvoices } from "../hooks/useInvoices";
import { archivePackagesByInvoicesApi } from "../utils/api";

function InvoicesPage() {
  const { invoices, loading } = useInvoices();
  const navigate = useNavigate();

  const [selectMode, setSelectMode] = useState(false);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [search, setSearch] = useState("");

  const toggleSelectInvoice = (invId) => {
    if (selectedInvoices.includes(invId)) {
      setSelectedInvoices(selectedInvoices.filter((id) => id !== invId));
    } else {
      setSelectedInvoices([...selectedInvoices, invId]);
    }
  };

  const handleArchive = async () => {
    if (selectedInvoices.length === 0) return;

    try {
      const { data } = await archivePackagesByInvoicesApi(selectedInvoices);
      alert(`Berhasil diarsipkan: ${data.archivedPackageIds.length} paket`);
      setSelectMode(false);
      setSelectedInvoices([]);
    } catch (err) {
      console.error("Gagal arsipkan paket:", err);
      alert(err.message);
    }
  };

  const filteredInvoices = useMemo(() => {
    if (!search.trim()) return invoices;
    return invoices.filter((inv) =>
      inv.nama_invoice.toLowerCase().includes(search.toLowerCase())
    );
  }, [invoices, search]);

  return (
    <div className="invoice-container">
      {/* Baris 1: Judul dan tombol Arsip */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <h2 style={{ margin: 0 }}>Daftar Invoice</h2>
        <button onClick={() => navigate("/archived_invoices")}>Arsip</button>
      </div>

      {/* Baris 2: Pencarian + tombol aksi */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}
      >
        {/* Input pencarian */}
        <input
          type="text"
          placeholder="Cari invoice..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />

        {/* Tombol aksi */}
        {!selectMode ? (
          <button onClick={() => setSelectMode(true)}>Pilih</button>
        ) : (
          <>
            <button onClick={handleArchive} className="btn btn-primary">
              Arsipkan ({selectedInvoices.length})
            </button>
            <button
              onClick={() => {
                setSelectMode(false);
                setSelectedInvoices([]);
              }}
              className="btn btn-secondary"
            >
              Batal
            </button>
          </>
        )}
      </div>

      {/* Daftar invoice */}
      {loading ? (
        <p>Loading daftar invoice...</p>
      ) : filteredInvoices.length === 0 ? (
        <p>Invoice tidak ditemukan.</p>
      ) : (
        <div className="cards-container">
          {filteredInvoices.map((inv) => {
            const isSelected = selectedInvoices.includes(inv.id);
            return (
              <div
                key={inv.id}
                className={`package-card ${isSelected ? "selected" : ""}`}
                style={{
                  cursor: "pointer",
                  border: isSelected ? "2px solid blue" : "1px solid #ccc",
                  backgroundColor: isSelected ? "#e0f0ff" : "#fff",
                }}
                onClick={() => {
                  if (selectMode) {
                    toggleSelectInvoice(inv.id);
                  } else {
                    navigate(`/invoices/${inv.id}`);
                  }
                }}
              >
                <h3>{inv.nama_invoice.toUpperCase()}</h3>
                <p>{inv.id}</p>
                <p>Jumlah Paket: {inv.package_count}</p>
                <h4>Rp {Number(inv.total_price).toLocaleString("id-ID")}</h4>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default InvoicesPage;
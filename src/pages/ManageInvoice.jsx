import { useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useInvoices } from "../hooks/useInvoices";
import { archivePackagesByInvoicesApi } from "../utils/api";

function InvoicesPage() {
  const { invoices, loading } = useInvoices();
  const navigate = useNavigate();

  const [selectMode, setSelectMode] = useState(false);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [search, setSearch] = useState("");
  const timerRef = useRef(null);

  const handleLongPressStart = (invId) => {
    timerRef.current = setTimeout(() => {
      setSelectMode(true);
      setSelectedInvoices([invId]);
    }, 500);
  };

  const handleLongPressEnd = () => clearTimeout(timerRef.current);

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

  // Filter invoices berdasarkan search
  const filteredInvoices = useMemo(() => {
    if (!search.trim()) return invoices;
    return invoices.filter((inv) =>
      inv.nama_invoice.toLowerCase().includes(search.toLowerCase())
    );
  }, [invoices, search]);

  return (
    <div className="invoice-container">
      {/* Header dan tombol Arsip */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h2>Daftar Invoice</h2>
        <button onClick={() => navigate("/archived_invoices")}>Arsip</button>
      </div>

      {/* Input pencarian */}
      <div style={{ marginBottom: "16px" }}>
        <input
          type="text"
          placeholder="Cari invoice..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
      </div>

      {/* Tombol arsip batch saat selectMode aktif */}
      {selectMode && (
        <div style={{ marginBottom: "16px" }}>
          <button onClick={handleArchive} className="btn btn-primary">
            Arsipkan ({selectedInvoices.length})
          </button>
          <button
            onClick={() => {
              setSelectMode(false);
              setSelectedInvoices([]);
            }}
            className="btn btn-secondary"
            style={{ marginLeft: 8 }}
          >
            Batal
          </button>
        </div>
      )}

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
                onMouseDown={() => handleLongPressStart(inv.id)}
                onMouseUp={handleLongPressEnd}
                onTouchStart={() => handleLongPressStart(inv.id)}
                onTouchEnd={handleLongPressEnd}
                onClick={() => {
                  if (selectMode) {
                    toggleSelectInvoice(inv.id);
                  } else {
                    navigate(`/invoices/${inv.id}`);
                  }
                }}
              >
                <h3>{inv.nama_invoice.toUpperCase()}</h3>
                <h4>{inv.id}</h4>
                <p>Total: Rp {Number(inv.total_price).toLocaleString("id-ID")}</p>
                <p>{new Date(inv.created_at).toLocaleString("id-ID")}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default InvoicesPage;
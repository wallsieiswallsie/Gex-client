import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useInvoices } from "../hooks/useInvoices";
import { 
  archivePackagesByInvoicesApi,
  addPaymentMethodApi, 
} from "../utils/api";
import PaymentMethodModal  from "../components/modals/PaymentMethodModal";

function InvoicesPage() {
  const { invoices, loading } = useInvoices();
  const navigate = useNavigate();

  const [selectMode, setSelectMode] = useState(false);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("semua");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleSelectInvoice = (invId) => {
    if (selectedInvoices.includes(invId)) {
      setSelectedInvoices(selectedInvoices.filter((id) => id !== invId));
    } else {
      setSelectedInvoices([...selectedInvoices, invId]);
    }
  };

  const handleArchive = async () => {
    if (selectedInvoices.length === 0) return;
    setIsModalOpen(true); // buka modal
  };

  const handlePaymentSubmit = async (paymentMethod) => {
    try {
      console.log("Payload:", {
        invoiceIds: selectedInvoices,
        paymentMethod,
      });

      const result = await archivePackagesByInvoicesApi({ 
        invoiceIds: selectedInvoices, 
        paymentMethod 
      });

      // pakai result.data, bukan data
      alert(
        `Metode pembayaran: ${paymentMethod}\nBerhasil diarsipkan: ${result.data.archivedPackageIds.length} paket`
      );

      setIsModalOpen(false);
      setSelectMode(false);
      setSelectedInvoices([]);
    } catch (err) {
      console.error("Gagal arsipkan paket:", err);
      alert(err.message);
    }
  };

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

      {/* Baris 2: Pencarian + Filter + Tombol aksi */}
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
              className={`card ${isSelected ? "selected" : ""}`}
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
              <h3>{inv.id}</h3>
              <p>Jumlah Paket: {inv.package_count}</p>
              <h4>Rp {Number(inv.total_price).toLocaleString("id-ID")}</h4>
              {inv.cabang && <h3>{inv.cabang.toUpperCase()}</h3>}
            </div>
          );
        })}

        </div>
      )}

      {/* MODAL */}
      <PaymentMethodModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handlePaymentSubmit}
      />
    </div>
  );
}

export default InvoicesPage;
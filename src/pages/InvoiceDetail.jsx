import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import DetailPackageModal from "../components/modals/DetailPackageModal";
import { useInvoiceDetail } from "../hooks/useInvoiceDetail";
import { 
  removePackageFromInvoiceApi,
  addPackagesByResiToInvoiceApi 
} from "../utils/api";

function InvoiceDetailPage() {
  const { id } = useParams();
  const { invoice, loading, error } = useInvoiceDetail(id);
  const [invoiceData, setInvoiceData] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [showAddResiModal, setShowAddResiModal] = useState(false);
  const [resiList, setResiList] = useState("");

  const longPressTimer = useRef(null);
  const LONG_PRESS_THRESHOLD = 500; // ms

  useEffect(() => {
    if (invoice) setInvoiceData(invoice);
  }, [invoice]);

  if (loading) return <p>Loading detail invoice...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!invoiceData) return <p>Invoice tidak ditemukan.</p>;

  const toggleSelect = (pkg) => {
    if (selectedPackages.find((p) => p.id === pkg.id)) {
      setSelectedPackages(selectedPackages.filter((p) => p.id !== pkg.id));
      if (selectedPackages.length === 1) setSelectMode(false);
    } else {
      setSelectedPackages([...selectedPackages, pkg]);
    }
  };

  const handleLongPress = (pkg) => {
    if (!selectMode) {
      setSelectMode(true);
      toggleSelect(pkg);
    }
  };

  // Desktop
  const handleMouseDown = (pkg) => {
    if (!selectMode) {
      longPressTimer.current = setTimeout(() => handleLongPress(pkg), LONG_PRESS_THRESHOLD);
    }
  };
  const handleMouseUp = () => clearTimeout(longPressTimer.current);
  const handleMouseLeave = () => clearTimeout(longPressTimer.current);

  // Mobile
  const handleTouchStart = (pkg) => {
    if (!selectMode) {
      longPressTimer.current = setTimeout(() => handleLongPress(pkg), LONG_PRESS_THRESHOLD);
    }
  };
  const handleTouchEnd = () => clearTimeout(longPressTimer.current);

  // Hapus paket terpilih
  const handleRemoveSelected = async () => {
    try {
      for (const pkg of selectedPackages) {
        await removePackageFromInvoiceApi(invoiceData.id, pkg.id);
      }
      setInvoiceData((prev) => {
        const updatedPackages = (prev.packages || []).filter(
          (p) => !selectedPackages.some((sp) => sp.id === p.id)
        );
        const updatedTotal = updatedPackages.reduce((sum, p) => sum + Number(p.harga), 0);
        return { ...prev, packages: updatedPackages, total_price: updatedTotal };
      });
      setSelectedPackages([]);
      setSelectMode(false);
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus paket: " + err.message);
    }
  };

  // Tambah paket berdasarkan resi
  const handleAddPackages = async () => {
    if (!resiList.trim()) {
      alert("Masukkan minimal satu nomor resi.");
      return;
    }

    const resiArray = resiList
      .split(/[\s,;]+/)
      .map((r) => r.trim())
      .filter(Boolean);

    try {
      const result = await addPackagesByResiToInvoiceApi(invoiceData.id, resiArray);

      setInvoiceData((prev) => {
        const existingPackages = prev.packages || [];
        const addedPackages = result.data?.addedPackages || [];
        const mergedPackages = [...existingPackages, ...addedPackages];
        const updatedTotal = result.data?.total_price || mergedPackages.reduce((sum, p) => sum + Number(p.harga), 0);

        return { ...prev, packages: mergedPackages, total_price: updatedTotal };
      });

      setResiList("");
      setShowAddResiModal(false);
    } catch (err) {
      console.error(err);
      alert("Gagal menambahkan paket: " + err.message);
    }
  };

  const packages = invoiceData.packages || [];

  return (
    <div className="invoice-detail-container">
      <h2>{invoiceData.nama_invoice.toUpperCase()}</h2>
      <h4>{invoiceData.id}</h4>
      <p>Jumlah Paket: {invoiceData.package_count || (invoiceData.packages?.length || 0)}</p>
      <p>Total: Rp {Number(invoiceData.total_price).toLocaleString("id-ID")}</p>
      
      {selectMode && selectedPackages.length > 0 && (
        <div className="actions-container" style={{ margin: "10px 0" }}>
          <button
            onClick={handleRemoveSelected}
            style={{
              backgroundColor: "red",
              color: "white",
              padding: "6px 12px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Hapus Paket Terpilih ({selectedPackages.length})
          </button>
        </div>
      )}

      <div style={{ marginBottom: "10px" }}>
        <button
          onClick={() => setShowAddResiModal(true)}
          style={{
            backgroundColor: "green",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            fontSize: "20px",
            cursor: "pointer",
          }}
        >
          +
        </button>
      </div>

      <div className="cards-container" style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {packages.map((pkg) => {
          const isSelected = selectedPackages.some((p) => p.id === pkg.id);
          return (
            <div
              key={pkg.id}
              className={`package-card ${isSelected ? "selected" : ""}`}
              style={{
                cursor: "pointer",
                padding: "10px",
                border: isSelected ? "2px solid blue" : "1px solid #ccc",
                borderRadius: "6px",
                position: "relative",
              }}
              onMouseDown={() => handleMouseDown(pkg)}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              onTouchStart={() => handleTouchStart(pkg)}
              onTouchEnd={handleTouchEnd}
              onClick={() => selectMode ? toggleSelect(pkg) : setSelectedPackage(pkg)}
            >
              <h4>{pkg.nama.toUpperCase()}</h4>
              <p>Resi: {pkg.resi}</p>
              <p>
                {pkg.panjang} × {pkg.lebar} × {pkg.tinggi}
              </p>
              <p>Rp {Number(pkg.harga).toLocaleString("id-ID")}</p>
            </div>
          );
        })}
      </div>

      <DetailPackageModal
        pkg={selectedPackage}
        invoiceId={invoiceData.id}
        onClose={() => setSelectedPackage(null)}
        onRemoved={(id) =>
          setInvoiceData((prev) => {
            const updatedPackages = (prev.packages || []).filter((p) => p.id !== id);
            const updatedTotal = updatedPackages.reduce((sum, p) => sum + Number(p.harga), 0);
            return { ...prev, packages: updatedPackages, total_price: updatedTotal };
          })
        }
      />

      {showAddResiModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              width: "300px",
            }}
          >
            <h3>Tambah Paket ke Invoice</h3>
            <p>Masukkan daftar resi (pisahkan dengan spasi, koma, atau enter):</p>
            <textarea
              value={resiList}
              onChange={(e) => setResiList(e.target.value)}
              rows="4"
              style={{ width: "100%", marginBottom: "10px" }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button onClick={() => setShowAddResiModal(false)}>Batal</button>
              <button
                onClick={handleAddPackages}
                style={{ backgroundColor: "green", color: "white", border: "none", padding: "5px 10px" }}
              >
                Tambah
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InvoiceDetailPage;
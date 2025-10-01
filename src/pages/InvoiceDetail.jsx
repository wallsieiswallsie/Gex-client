import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import DetailPackageModal from "../components/DetailPackageModal";
import { useInvoiceDetail } from "../hooks/useInvoiceDetail";
import { removePackageFromInvoiceApi } from "../utils/api";

function InvoiceDetailPage() {
  const { id } = useParams();
  const { invoice, loading, error } = useInvoiceDetail(id);
  const [invoiceState, setInvoice] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedPackages, setSelectedPackages] = useState([]);

  const longPressTimer = useRef(null);
  const LONG_PRESS_THRESHOLD = 500; // ms

  useEffect(() => {
    if (invoice) setInvoice(invoice);
  }, [invoice]);

  if (loading) return <p>Loading detail invoice...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!invoiceState) return <p>Invoice tidak ditemukan.</p>;

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

  const handleRemoveSelected = async () => {
    try {
      for (const pkg of selectedPackages) {
        await removePackageFromInvoiceApi(invoiceState.id, pkg.id);
      }
      setInvoice((prev) => ({
        ...prev,
        packages: prev.packages.filter((p) => !selectedPackages.some(sp => sp.id === p.id)),
        total_price: prev.packages
          .filter((p) => !selectedPackages.some(sp => sp.id === p.id))
          .reduce((sum, p) => sum + p.harga, 0),
      }));
      setSelectedPackages([]);
      setSelectMode(false);
    } catch (err) {
      alert("Gagal menghapus paket: " + err.message);
    }
  };

  return (
    <div className="invoice-detail-container">
      <h2>{invoiceState.nama_invoice.toUpperCase()}</h2>
      <h3>{invoiceState.id}</h3>
      <p>Total: Rp {Number(invoiceState.total_price).toLocaleString("id-ID")}</p>

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

      <div className="cards-container" style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {invoiceState.packages.map((pkg) => {
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
        invoiceId={invoiceState.id}
        onClose={() => setSelectedPackage(null)}
        onRemoved={(id) =>
          setInvoice((prev) => ({
            ...prev,
            packages: prev.packages.filter((p) => p.id !== id),
            total_price:
              prev.total_price -
              prev.packages.find((p) => p.id === id).harga,
          }))
        }
      />
    </div>
  );
}

export default InvoiceDetailPage;
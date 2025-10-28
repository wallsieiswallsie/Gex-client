import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import DetailPackageModal from "../components/modals/DetailPackageModal";
import AddPackageToInvoiceModal from "../components/modals/AddPackageToInvoiceModal";
import { useInvoiceDetail } from "../hooks/useInvoiceDetail";
import {
  removePackageFromInvoiceApi,
  addPackagesByResiToInvoiceApi,
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
  const LONG_PRESS_THRESHOLD = 500;

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

  const handleMouseDown = (pkg) => {
    if (!selectMode) {
      longPressTimer.current = setTimeout(() => handleLongPress(pkg), LONG_PRESS_THRESHOLD);
    }
  };
  const handleMouseUp = () => clearTimeout(longPressTimer.current);
  const handleMouseLeave = () => clearTimeout(longPressTimer.current);
  const handleTouchStart = (pkg) => {
    if (!selectMode) {
      longPressTimer.current = setTimeout(() => handleLongPress(pkg), LONG_PRESS_THRESHOLD);
    }
  };
  const handleTouchEnd = () => clearTimeout(longPressTimer.current);

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

    const addedPackages = result.data?.data?.addedPackages || [];
    const totalPrice = result.data?.data?.total_price;

    if (addedPackages.length > 0) {
      setInvoiceData((prev) => {
        const merged = [...(prev.packages || []), ...addedPackages];
        return { ...prev, packages: merged, total_price: totalPrice };
      });

      alert(`✅ Berhasil menambahkan ${addedPackages.length} paket ke invoice.`);
    }

    setResiList("");
    setShowAddResiModal(false);
  } catch (err) {
    console.error("Gagal menambahkan paket:", err);

    const message =
      err?.response?.data?.message ||
      err?.message ||
      "Terjadi kesalahan saat menambahkan paket.";

    let alertMessage = "⚠️ Terjadi kesalahan saat menambahkan paket.\n\n";

    // 🔹 Deteksi kasus error berdasarkan isi pesan
    if (message.includes("Tidak ada paket ditemukan")) {
      // Semua resi tidak ditemukan
      alertMessage += "Nomor resi berikut tidak ditemukan di database:\n";
      alertMessage += resiArray.join(", ");
    } else if (message.includes("sudah masuk invoice")) {
      // Ambil daftar resi dari pesan error server
      const match = message.match(/:(.*)/);
      const resiSudahMasuk = match ? match[1].split(",").map(r => r.trim()) : [];
      alertMessage += "Nomor resi berikut sudah di-invoice:\n";
      alertMessage += resiSudahMasuk.join(", ");
    } else if (message.includes("Remu") || message.includes("Aimas")) {
      alertMessage = "❌ Paket dari cabang Remu (QA) dan Aimas (QB) tidak boleh digabung dalam satu invoice.";
    } else {
      alertMessage = message;
    }

    alert(alertMessage);
  }
};

  const packages = invoiceData.packages || [];

  return (
    <div className="invoice-detail-container">
      <h2>{invoiceData.nama_invoice.toUpperCase()}</h2>
      <p>{invoiceData.id}</p>
      <p>
        Jumlah Paket: {invoiceData.package_count || (invoiceData.packages?.length || 0)}
      </p>
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

      <div
        className="cards-container"
        style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}
      >
        {packages.map((pkg) => {
          const isSelected = selectedPackages.some((p) => p.id === pkg.id);
          return (
            <div
              key={pkg.id}
              className={`card ${isSelected ? "selected" : ""}`}
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
              onClick={() =>
                selectMode ? toggleSelect(pkg) : setSelectedPackage(pkg)
              }
            >
              <h4>{pkg.nama.toUpperCase()}</h4>
              <p>Resi: {pkg.resi.toUpperCase()}</p>
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
            const updatedTotal = updatedPackages.reduce(
              (sum, p) => sum + Number(p.harga),
              0
            );
            return { ...prev, packages: updatedPackages, total_price: updatedTotal };
          })
        }
      />

      {showAddResiModal && (
        <AddPackageToInvoiceModal
          resiList={resiList}
          setResiList={setResiList}
          onClose={() => setShowAddResiModal(false)}
          onAdd={handleAddPackages}
        />
      )}
    </div>
  );
}

export default InvoiceDetailPage;
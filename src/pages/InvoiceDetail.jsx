import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DetailPackageModal from "../components/DetailPackageModal";
import { useInvoiceDetail } from "../hooks/useInvoiceDetail";

function InvoiceDetailPage() {
  const { id } = useParams();
  const { invoice, loading, error } = useInvoiceDetail(id);
  const [invoiceState, setInvoice] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);

  // Sinkronisasi state lokal dengan data dari hook
  useEffect(() => {
    if (invoice) {
      setInvoice(invoice);
    }
  }, [invoice]);

  if (loading) return <p>Loading detail invoice...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!invoiceState) return <p>Invoice tidak ditemukan.</p>;

  const handlePackageRemoved = (removedId) => {
    setInvoice((prev) => ({
      ...prev,
      packages: prev.packages.filter((p) => p.id !== removedId),
      total_price:
        prev.total_price -
        prev.packages.find((p) => p.id === removedId).harga,
    }));
  };

  return (
    <div className="invoice-detail-container">
      <h2>{invoiceState.id}</h2>
      <p>Total: Rp {Number(invoiceState.total_price).toLocaleString("id-ID")}</p>

      <h3>Daftar Paket</h3>
      <div className="cards-container">
        {invoiceState.packages.map((pkg) => (
          <div
            key={pkg.id}
            className="package-card"
            onClick={() => setSelectedPackage(pkg)}
            style={{ cursor: "pointer" }}
          >
            <h4>{pkg.nama.toUpperCase()}</h4>
            <p>Resi: {pkg.resi}</p>
            <p>
              {pkg.panjang} × {pkg.lebar} × {pkg.tinggi}
            </p>
            <p>Rp {Number(pkg.harga).toLocaleString("id-ID")}</p>
          </div>
        ))}
      </div>

      <DetailPackageModal
        pkg={selectedPackage}
        invoiceId={invoiceState.id}
        onClose={() => setSelectedPackage(null)}
        onRemoved={handlePackageRemoved}
      />
    </div>
  );
}

export default InvoiceDetailPage;
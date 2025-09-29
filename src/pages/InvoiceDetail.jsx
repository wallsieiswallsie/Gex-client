import { useState } from "react";
import { useParams } from "react-router-dom";
import DetailPackageModal from "../components/DetailPackageModal";
import { useInvoiceDetail } from "../hooks/useInvoiceDetail";

function InvoiceDetailPage() {
  const { id } = useParams();
  const { invoice, loading, error } = useInvoiceDetail(id);
  const [selectedPackage, setSelectedPackage] = useState(null);

  if (loading) return <p>Loading detail invoice...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!invoice) return <p>Invoice tidak ditemukan.</p>;

  return (
    <div className="invoice-detail-container">
      <h2>{invoice.invoice_id}</h2>
      <p>Total: Rp {Number(invoice.total_price).toLocaleString("id-ID")}</p>

      <h3>Daftar Paket</h3>
      <div className="cards-container">
        {invoice.packages.map((pkg) => (
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
        onClose={() => setSelectedPackage(null)}
      />
    </div>
  );
}

export default InvoiceDetailPage;
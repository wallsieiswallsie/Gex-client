import { useNavigate } from "react-router-dom";
import { useInvoices } from "../hooks/useInvoices";

function InvoicesPage() {
  const { invoices, loading } = useInvoices(); // ⬅️ hapus error
  const navigate = useNavigate();

  if (loading) return <p>Loading daftar invoice...</p>;

  if (invoices.length === 0) return <p>Belum ada invoice.</p>;

  return (
    <div className="invoice-container">
      <h2>Daftar Invoice</h2>
      <div className="cards-container">
        {invoices.map((inv) => (
          <div
            key={inv.invoice_id}
            className="package-card"
            onClick={() => navigate(`/invoices/${inv.invoice_id}`)}
            style={{ cursor: "pointer" }}
          >
            <h3>{inv.invoice_id}</h3>
            <p>Total: Rp {Number(inv.total_price).toLocaleString("id-ID")}</p>
            <p>{new Date(inv.created_at).toLocaleString("id-ID")}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InvoicesPage;
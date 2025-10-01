import { useNavigate } from "react-router-dom";
import { useInvoices } from "../hooks/useInvoices";
import { createInvoiceApi } from "../utils/api";

function InvoicesPage() {
  const { invoices, loading } = useInvoices();
  const navigate = useNavigate();

  const handleCreate = async () => {
    try {
      const res = await createInvoiceApi({ packageIds: [1, 2, 3] });
      console.log("Invoice created:", res);
      navigate(`/invoices/${res.data.id}`);
    } catch (err) {
      console.error("Gagal buat invoice:", err);
    }
  };

  if (loading) return <p>Loading daftar invoice...</p>;
  if (invoices.length === 0) return <p>Belum ada invoice.</p>;

  return (
    <div className="invoice-container">
      <h2>Daftar Invoice</h2>
      <div className="cards-container">
        {invoices.map((inv) => (
          <div
            key={inv.id}
            className="package-card"
            onClick={() => navigate(`/invoices/${inv.id}`)}
            style={{ cursor: "pointer" }}
          >
            <h3>{inv.id}</h3>
            <p>Total: Rp {Number(inv.total_price).toLocaleString("id-ID")}</p>
            <p>{new Date(inv.created_at).toLocaleString("id-ID")}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InvoicesPage;
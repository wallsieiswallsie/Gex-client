import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  createPengantaranApi, 
  fetchPengantaranApi, 
  activePengantaranApi 
} from "../../utils/api";
import UpdateActivePackageModal from "../../components/modals/UpdateActivePackageModal"; // path pastikan sesuai

export default function ManageDelivery() {
  const [invoiceId, setInvoiceId] = useState("");
  const [deliveries, setDeliveries] = useState([]);
  const [showModal, setShowModal] = useState(null); // null = tidak ada modal terbuka
  const navigate = useNavigate();

  const loadDeliveries = async () => {
    try {
      const data = await fetchPengantaranApi();
      setDeliveries(data);
    } catch (err) {
      console.error("Gagal ambil deliveries:", err.message);
    }
  };

  const handleAdd = async () => {
    try {
      if (!invoiceId) return;
      await createPengantaranApi({ invoice_id: invoiceId });
      setInvoiceId("");
      await loadDeliveries(); // refresh list
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    loadDeliveries();
  }, []);

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={invoiceId}
          onChange={(e) => setInvoiceId(e.target.value)}
          placeholder="Masukkan Invoice ID"
          className="border p-2 rounded"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          +
        </button>
      </div>

      <div className="delivery-container">
        <h2>Daftar Request</h2>
        <div className="cards-container grid gap-4">
          {deliveries.map((inv) => (
            <div 
              key={inv.id}
              className="package-card border p-4 rounded shadow relative"
            >
              <div onClick={() => navigate(`/invoices/${inv.id}`)} className="cursor-pointer">
                <h3 className="border px-2 py-1">{inv.nama_invoice.toUpperCase()}</h3>
                <h4 className="border px-2 py-1">{inv.id}</h4>
                <p className="border px-2 py-1">
                  Rp {Number(inv.total_price).toLocaleString("id-ID")}
                </p>
                <p className="border px-2 py-1">{inv.created_at}</p>
              </div>

              {/* Tombol input resi pickup */}
              <button
                onClick={() => setShowModal(inv.id)}
                className="mt-3 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                Input Resi Pickup
              </button>

              {/* Modal khusus untuk card ini */}
              {showModal === inv.id && (
                <UpdateActivePackageModal
                  onClose={() => setShowModal(null)}
                  activePengantaranApi={activePengantaranApi}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  createPengantaranApi, 
  fetchPengantaranApi, 
  activePengantaranApi,
  addPackageStatus,
  addPaymentMethodApi
} from "../../utils/api";
import UpdateActivePackageModal from "../../components/modals/UpdateActivePackageModal";
import PaymentMethodModal from "../../components/modals/PaymentMethodModal";

export default function ManageDelivery() {
  const [invoiceId, setInvoiceId] = useState("");
  const [deliveries, setDeliveries] = useState([]);
  const [showModal, setShowModal] = useState(null); // modal untuk Input Resi Pickup
  const [showPaymentModal, setShowPaymentModal] = useState(false); // modal untuk metode pembayaran
  const navigate = useNavigate();

  const loadDeliveries = async () => {
    try {
      const data = await fetchPengantaranApi();
      setDeliveries(data);
    } catch (err) {
      console.error("Gagal ambil deliveries:", err.message);
    }
  };

  const handleAdd = () => {
    if (!invoiceId) {
      alert("Masukkan Invoice ID terlebih dahulu");
      return;
    }
    setShowPaymentModal(true); // buka modal pembayaran
  };

  const handlePaymentSubmit = async (paymentMethod) => {
    try {
      // 1️⃣ Buat pengantaran baru
      const response = await createPengantaranApi({ invoice_id: invoiceId });

      if (response.inserted?.length > 0) {
        // 2️⃣ Update status paket ke 6
        for (const pkgId of response.inserted) {
          await addPackageStatus(pkgId, 6);
          console.log(`Status 6 berhasil dikirim untuk paket ${pkgId}`);
        }

        // 3️⃣ Tambahkan payment method
        await addPaymentMethodApi({
          invoiceIds: [invoiceId],
          paymentMethod,
        });
        console.log(`Payment method "${paymentMethod}" berhasil ditambahkan`);

      } else {
        console.warn("pkgId tidak ditemukan dalam response, status 6 tidak dikirim");
      }

      // 4️⃣ Bersihkan input dan refresh list
      setInvoiceId("");
      await loadDeliveries();

    } catch (err) {
      alert(err.message);
      console.error("Gagal menambah pengantaran:", err);
    } finally {
      setShowPaymentModal(false); // tutup modal
    }
  };

  useEffect(() => {
    loadDeliveries();
  }, []);

  return (
    <div className="p-4">
      {/* Input invoice + tombol + */}
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
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          +
        </button>
      </div>

      {/* Daftar pengantaran */}
      <div className="delivery-container">
        <h2>Daftar Request</h2>
        <div className="cards-container grid gap-4">
          {deliveries.map((inv) => (
            <div 
              key={inv.id}
              className="card"
            >
              <div 
                onClick={() => navigate(`/invoices/${inv.id}`)} 
                className="cursor-pointer"
              >
                <h3 className="border px-2 py-1">{inv.nama_invoice?.toUpperCase()}</h3>
                <h4 className="border px-2 py-1">{inv.id}</h4>
                <p className="border px-2 py-1">
                  Rp {Number(inv.total_price).toLocaleString("id-ID")}
                </p>
                <p className="border px-2 py-1">{inv.created_at}</p>
              </div>

              <button
                onClick={() => setShowModal(inv.id)}
                className="mt-3 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                Input Resi Pickup
              </button>

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

      {/* Modal Payment Method */}
      <PaymentMethodModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSubmit={handlePaymentSubmit}
      />
    </div>
  );
}
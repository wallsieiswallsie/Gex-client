// src/pages/batches/UpdateStatusBatchModal.jsx
import { useState } from "react";
import { addPackageStatus, fetchBatchKapalDetailApi } from "../../utils/api";

export default function UpdateStatusBatchModal({ batch, onClose, onUpdated }) {
  const [status, setStatus] = useState(batch.status || "");

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      onClose();
    }
  };

const handleSubmit3 = async (e) => {
  e.preventDefault();
  try {
    // Ambil detail batch + packages
    const resJson = await fetchBatchKapalDetailApi(batch.id);
    const batchData = resJson.data;

    console.log("packages:", batchData.packages);

    if (!batchData || !batchData.packages || batchData.packages.length === 0) {
      alert("Tidak ada paket dalam batch ini");
      return;
    }

    // Karena status 3 berlaku untuk seluruh batch
    await addPackageStatus(null, 3, batch.id);

    alert("Semua paket dalam batch berhasil diupdate ke status 3!");
    onUpdated();
    onClose();
  } catch (err) {
    console.error(err);
    alert("Terjadi kesalahan saat update status batch");
  }
};

const handleSubmit4 = async (e) => {
  e.preventDefault();
  try {
    // Ambil detail batch + packages
    const resJson = await fetchBatchKapalDetailApi(batch.id);
    const batchData = resJson.data;

    console.log("packages:", batchData.packages);

    if (!batchData || !batchData.packages || batchData.packages.length === 0) {
      alert("Tidak ada paket dalam batch ini");
      return;
    }

    // Karena status 3 berlaku untuk seluruh batch
    await addPackageStatus(null, 4, batch.id);

    alert("Semua paket dalam batch berhasil diupdate ke status 4!");
    onUpdated();
    onClose();
  } catch (err) {
    console.error(err);
    alert("Terjadi kesalahan saat update status batch");
  }
};

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container">
        <h2 className="modal-title">Update Status Batch</h2>
        <form onSubmit={handleSubmit3}>
            <button
              type="submit"
              className="update_status_batch_modal-button"
            >
              Sudah Berangkat
            </button>
        </form>
        <form onSubmit={handleSubmit4}>
            <button
              type="submit"
              className="update_status_batch_modal-button"
            >
              Sudah Sampai
            </button>
        </form>
      </div>
    </div>
  );
}
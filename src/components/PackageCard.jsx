import { useEffect } from "react";
import { usePackageStatus } from "../hooks/usePackageStatus";
import { getStatusLabel } from "../utils/statusLabels";

function PackageCard({ pkg, invoiceId, isSelected, isDisabled, onClick, onRightClick }) {
  const { latestStatus, fetchLatest, loading, error } = usePackageStatus(pkg?.id);

  // Hanya fetch data saat packageId berubah
  useEffect(() => {
    if (!pkg?.id) return;
    fetchLatest().catch((err) => console.error(err));
  }, [pkg?.id, fetchLatest]);

  const statusLabel = loading
    ? "Loading..."
    : error
    ? "Gagal ambil status"
    : latestStatus
    ? getStatusLabel(latestStatus.status)
    : "Belum ada status";

  return (
    <div
      className={`package-card ${isSelected ? "selected" : ""} ${isDisabled ? "disabled" : ""}`}
      onClick={onClick}
      onContextMenu={onRightClick}
    >
      <h2>{pkg.nama.toUpperCase()}</h2>
      <h3>{pkg.resi}</h3>
      <p>
        {pkg.panjang} × {pkg.lebar} × {pkg.tinggi} | {pkg.berat_dipakai} kg
      </p>
      <p>{pkg.via}</p>
      <h3>Rp {Number(pkg.harga).toLocaleString("id-ID")}</h3>
      <p>Status: {statusLabel}</p>

      {isDisabled && <small className="disabled-note">Sudah invoiced</small>}
      {invoiceId && <p className="invoice-number">{invoiceId}</p>}
    </div>
  );
}

export default PackageCard;
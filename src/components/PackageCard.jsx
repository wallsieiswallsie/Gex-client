import { useEffect } from "react";
import { usePackageStatus } from "../hooks/usePackageStatus";
import { getStatusLabel } from "../utils/statusLabels";

function PackageCard({ pkg, invoiceId, isSelected, isDisabled, onClick, onRightClick }) {
  const { latestStatus, fetchLatest, loading, error } = usePackageStatus(pkg?.id);

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

  // tentukan background color berdasarkan kode
  let bgColor = "bg-purple-50"; // default
  if (pkg.kode === "JPSOQA" || pkg.kode === "JKSOQA") {
    bgColor = "bg-[#fcffe0]"; // kuning pastel
  } else if (pkg.kode === "JPSOQB" || pkg.kode === "JKSOQB") {
    bgColor = "bg-[#e0ffe4]"; // hijau pastel
  }

  // jika sudah invoiced, override warna menjadi abu-abu transparan
  if (invoiceId) {
    bgColor = "bg-gray-100 opacity-80";
  }

  return (
    <div
      onClick={onClick}
      onContextMenu={onRightClick}
      className={`
        w-full max-w-md mx-auto p-4 rounded-xl border shadow-sm flex flex-col gap-1
        ${isSelected ? "border-blue-500 shadow-md" : "border-gray-300"}
        ${isDisabled ? "opacity-60" : ""}
        ${bgColor}
      `}
    >
      <h2 className="font-bold text-lg">{pkg.nama.toUpperCase()}</h2>
      <h3 className="font-semibold text-sm text-gray-600">{pkg.resi.toUpperCase()} | {pkg.ekspedisi}</h3>

      <p className="text-sm text-gray-700">
        {pkg.panjang} × {pkg.lebar} × {pkg.tinggi} | {pkg.berat_dipakai} kg
      </p>

      <p className="text-sm text-gray-500">{pkg.kode}</p>

      <h3 className="font-semibold text-base">
        Rp {Number(pkg.harga).toLocaleString("id-ID")}
      </h3>

      <p className="text-sm font-medium">{statusLabel}</p>

      {invoiceId && <p className="text-xs text-gray-500">{invoiceId}</p>}
    </div>
  );
}

export default PackageCard;
function PackageCard({ pkg, invoiceId, isSelected, isDisabled, onClick, onRightClick }) {
  return (
    <div
      className={`package-card ${isSelected ? "selected" : ""} ${
        isDisabled ? "disabled" : ""
      }`}
      onClick={onClick}
      onContextMenu={onRightClick}
    >
      <h2>{pkg.nama.toUpperCase()}</h2>
      <h3>{pkg.resi}</h3>
      <p>
        {pkg.panjang} × {pkg.lebar} × {pkg.tinggi} | {pkg.berat_dipakai} kg
      </p>
      <h3>Rp {Number(pkg.harga).toLocaleString("id-ID")}</h3>

      {isDisabled && <small className="disabled-note">Sudah invoiced</small>}
      {invoiceId ? (
        <p className="invoice-number">{invoiceId}</p>
      ) : null}
    </div>
  );
}

export default PackageCard;
function PackageControls({
  filter,
  setFilter,
  invoicedFilter,
  setInvoicedFilter,
  viaFilter,
  setViaFilter,
  cabangFilter,
  setCabangFilter,
  selectMode,
  setSelectMode,
  setSelectedPackages,
}) {
  const handleToggleSelect = () => {
    setSelectMode(!selectMode);
    setSelectedPackages([]);
  };

  return (
    <div className="ddp-controls">
      <input
        type="text"
        placeholder="Cari nama atau resi..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      <select
        value={invoicedFilter}
        onChange={(e) => setInvoicedFilter(e.target.value)}
      >
        <option value="all">Semua Paket</option>
        <option value="yes">Sudah Invoiced</option>
        <option value="no">Belum Invoiced</option>
      </select>

      <select
        value={viaFilter}
        onChange={(e) => setViaFilter(e.target.value)}
      >
        <option value="all">Semua Moda</option>
        <option value="Kapal">Kapal</option>
        <option value="Pesawat">Pesawat</option>
      </select>

      <select
        value={cabangFilter}
        onChange={(e) => setCabangFilter(e.target.value)}
      >
        <option value="all">Semua Cabang</option>
        <option value="Remu">Remu</option>
        <option value="Aimas">Aimas</option>
      </select>

      <button
        className={`select-toggle-button ${selectMode ? "active" : ""}`}
        onClick={handleToggleSelect}
      >
        {selectMode ? "Batal Pilih" : "Pilih"}
      </button>
    </div>
  );
}

export default PackageControls;
function PackageControls({
  filter,
  setFilter,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  invoicedFilter,
  setInvoicedFilter,
  viaFilter,
  setViaFilter,
  onApply,
}) {
  return (
    <div className="ddp-controls">
      <input
        type="text"
        placeholder="Cari nama atau resi..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="created_at">Tanggal Input</option>
        <option value="nama">Nama Paket</option>
        <option value="resi">Resi</option>
        <option value="berat">Berat</option>
      </select>

      <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
        <option value="asc">Terkecil - Terbesar</option>
        <option value="desc">Terbesar - Terkecil</option>
      </select>

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

      <button onClick={onApply}>Terapkan</button>
    </div>
  );
}

export default PackageControls;
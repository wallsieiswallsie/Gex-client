function PackageControls({ filter, setFilter, sortBy, setSortBy, sortOrder, setSortOrder, onApply }) {
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
      <button onClick={onApply}>Terapkan</button>
    </div>
  );
}

export default PackageControls;
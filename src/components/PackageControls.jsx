import { useState, useRef, useEffect } from "react";

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
  const [showFilters, setShowFilters] = useState(false);
  const popoverRef = useRef(null);

  const handleToggleSelect = () => {
    setSelectMode(!selectMode);
    setSelectedPackages([]);
  };

  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Tutup popover jika klik di luar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setShowFilters(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="ddp-controls flex items-center gap-2 relative">
      {/* Input pencarian */}
      <input
        type="text"
        placeholder="Cari nama atau resi..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="border rounded px-2 py-1 w-48"
      />

      {/* Tombol titik tiga */}
      <button
        onClick={handleToggleFilters}
        className="border rounded px-2 py-1 hover:bg-gray-100"
        title="Filter lainnya"
      >
        ⋮
      </button>

      {/* Popover berisi filter tambahan */}
      {showFilters && (
        <div
          ref={popoverRef}
          className="absolute top-full left-0 mt-2 bg-white border shadow-lg rounded-lg p-3 z-50 flex flex-col gap-2 w-52"
        >
          <select
            value={invoicedFilter}
            onChange={(e) => setInvoicedFilter(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="all">Semua Paket</option>
            <option value="yes">Sudah Invoiced</option>
            <option value="no">Belum Invoiced</option>
          </select>

          <select
            value={viaFilter}
            onChange={(e) => setViaFilter(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="all">Semua Moda</option>
            <option value="Kapal">Kapal</option>
            <option value="Pesawat">Pesawat</option>
          </select>

          <select
            value={cabangFilter}
            onChange={(e) => setCabangFilter(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="all">Semua Cabang</option>
            <option value="Remu">Remu</option>
            <option value="Aimas">Aimas</option>
          </select>
        </div>
      )}

      {/* Tombol mode pilih */}
      <button
        className={`border rounded px-2 py-1 ${
          selectMode ? "bg-blue-500 text-white" : "hover:bg-gray-100"
        }`}
        onClick={handleToggleSelect}
      >
        {selectMode ? "Batal Pilih" : "Pilih"}
      </button>
    </div>
  );
}

export default PackageControls;
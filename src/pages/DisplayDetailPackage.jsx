import { useEffect, useState } from "react";
import DetailPackageModal from "../components/DetailPackageModal";
import { calculatePackageDetails } from "../utils/calculations";

function DisplayDetailPackage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filter, setFilter] = useState(""); 
  const [sortBy, setSortBy] = useState("created_at"); 
  const [sortOrder, setSortOrder] = useState("desc"); 

  const [selectedPackage, setSelectedPackage] = useState(null);

  const fetchPackages = async (query = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams(query);
      const res = await fetch(`http://localhost:5000/packages?${params.toString()}`);
      if (!res.ok) throw new Error("Gagal fetch data");
      const data = await res.json();
      setPackages(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleApplyFilterSort = () => {
    fetchPackages({ filter, sortBy, sortOrder });
  };

  return (
    <div className="ddp-container">
      <h2>Daftar Detail Paket</h2>

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
        <button onClick={handleApplyFilterSort}>Terapkan</button>
      </div>

      {loading && <p>Loading data paket...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <div className="cards-container">
        {packages.map((pkg) => {
          const details = calculatePackageDetails(pkg);
          return (
            <div
              className="package-card"
              key={pkg.id}
              onClick={() => setSelectedPackage(pkg)}
            >
              <h2>{pkg.nama.toUpperCase()}</h2>
              <h3>{pkg.resi}</h3>
              <p>
                {pkg.panjang} × {pkg.lebar} × {pkg.tinggi} |{" "}
                {details.weightUsed} kg
              </p>
              <h3>Rp {details.price.toLocaleString("id-ID")}</h3>
            </div>
          );
        })}
      </div>

      {/* Modal tampil jika ada paket terpilih */}
      {selectedPackage && (
        <DetailPackageModal
          pkg={selectedPackage}
          onClose={() => setSelectedPackage(null)}
        />
      )}
    </div>
  );
}

export default DisplayDetailPackage;

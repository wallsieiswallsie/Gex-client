import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPackagesByKarungApi } from "../utils/api";

const PackagesByKarungPage = () => {
  const { batchId, noKarung } = useParams();
  const [packages, setPackages] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const res = await getPackagesByKarungApi(batchId, noKarung, search);
      if (res.status === "success") {
        setPackages(res.data.packages);
      } else {
        setPackages([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, [search]);

  return (
    <div className="cards-container">
      <h2>
        Karung {noKarung} | {batchId}
      </h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Cari berdasarkan nama atau nomor resi..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : packages.length === 0 ? (
        <p>Tidak ada paket ditemukan</p>
      ) : (
        <div className="cards-container">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="card"
            >
              <p> {pkg.nama.toUpperCase()}</p>
              <p>{pkg.resi.toUpperCase()}</p>
              <p>{pkg.berat_dipakai} kg</p>
              <p> Rp {Number(pkg.harga).toLocaleString("id-ID")}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PackagesByKarungPage;
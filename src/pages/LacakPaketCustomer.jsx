import { useState } from "react";
import { usePackages } from "../hooks/usePackages";
import ErrorBoundary from "../components/ErrorBoundary";
import PackageCard from "../components/PackageCard";
import DetailPackageModal from "../components/modals/DetailPackageModal";
import { usePackageStatus } from "../hooks/usePackageStatus";
import { getStatusLabel } from "../utils/statusLabels";

function LacakPaketCustomer() {
  const [resiQuery, setResiQuery] = useState("");
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [latestStatuses, setLatestStatuses] = useState({});

  const { packages } = usePackages();        
  const { fetchLatest } = usePackageStatus();

  // hanya filter berdasarkan resi
  const matchedPackage = packages.find(
    (pkg) => pkg.resi.toLowerCase() === resiQuery.toLowerCase()
  );

  const handleSearch = async () => {
    if (!matchedPackage) {
      setLatestStatuses({});
      return;
    }

    try {
      const res = await fetchLatest(matchedPackage.id);
      setLatestStatuses({
        [matchedPackage.id]: res?.latest ? Number(res.latest.status) : null,
      });
    } catch {
      setLatestStatuses({ [matchedPackage.id]: null });
    }
  };

  return (
    <div className="lpc-container">
      <h2>Lacak Paket Customer</h2>

      <div className="search-box">
        <input
          type="text"
          placeholder="Masukkan nomor resi..."
          value={resiQuery}
          onChange={(e) => setResiQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Cari</button>
      </div>

      {/* default: halaman kosong */}
      {!resiQuery && (
        <p style={{ marginTop: "20px", color: "#666" }}>
          Masukkan nomor resi untuk mencari paket.
        </p>
      )}

      {/* resi diinput tapi tidak ditemukan */}
      {resiQuery && !matchedPackage && (
        <p style={{ marginTop: "20px", color: "red" }}>
          Resi tidak ditemukan.
        </p>
      )}

      {/* resi ditemukan → tampilkan card */}
      {matchedPackage && (
        <div style={{ marginTop: "20px" }}>
          <ErrorBoundary>
            <PackageCard
              pkg={matchedPackage}
              invoiceId={matchedPackage.invoice_id || null}
              isSelected={false}
              isDisabled={matchedPackage.invoiced}
              statusLabel={getStatusLabel(latestStatuses[matchedPackage.id])}
              onClick={() => setSelectedPackage(matchedPackage)}
            />
          </ErrorBoundary>
        </div>
      )}

      {/* Modal detail paket */}
      {selectedPackage && (
        <DetailPackageModal
          pkg={selectedPackage}
          invoiceId={selectedPackage.invoice_id}
          onClose={() => setSelectedPackage(null)}
        />
      )}
    </div>
  );
}

export default LacakPaketCustomer;
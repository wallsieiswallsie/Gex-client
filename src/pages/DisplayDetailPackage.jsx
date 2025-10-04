import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePackages } from "../hooks/usePackages";
import { createInvoiceApi } from "../utils/api";
import { usePackageStatus } from "../hooks/usePackageStatus";
import { getStatusLabel } from "../utils/statusLabels";

import PackageControls from "../components/PackageControls";
import ErrorBoundary from "../components/ErrorBoundary";
import PackageCard from "../components/PackageCard";
import InvoiceActions from "../components/InvoiceActions";
import DetailPackageModal from "../components/modals/DetailPackageModal";

function DisplayDetailPackage() {
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [invoicedFilter, setInvoicedFilter] = useState("all");
  const [viaFilter, setViaFilter] = useState("all");

  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedPackages, setSelectedPackages] = useState([]);

  const [latestStatuses, setLatestStatuses] = useState({});

  const navigate = useNavigate();
  const { packages, loading, error, fetchPackages } = usePackages();
  const { fetchLatest } = usePackageStatus();

  // ambil latest status setiap kali packages berubah
  useEffect(() => {
    const fetchStatuses = async () => {
      const statusesMap = {};
      for (const pkg of packages) {
        try {
          const res = await fetchLatest(pkg.id);
          if (res && res.latest) {
            statusesMap[pkg.id] = Number(res.latest.status);
          } else {
            statusesMap[pkg.id] = null;
          }
        } catch (err) {
          console.warn(`Gagal ambil status untuk paket ${pkg.id}:`, err);
          statusesMap[pkg.id] = null;
        }
      }
      setLatestStatuses(statusesMap);
    };

    if (packages.length > 0) {
      fetchStatuses().catch((err) => console.error("Fatal fetchStatuses error:", err));
    }
  }, [packages, fetchLatest]);


  const handleApplyFilterSort = () => {
    fetchPackages({ filter, sortBy, sortOrder });
  };

  const toggleSelect = (pkg) => {
    if (selectedPackages.find((p) => p.id === pkg.id)) {
      setSelectedPackages(selectedPackages.filter((p) => p.id !== pkg.id));
    } else {
      setSelectedPackages([...selectedPackages, pkg]);
    }
  };

  const handleCardRightClick = (e, pkg) => {
    e.preventDefault();
    if (!selectMode) setSelectMode(true);
    toggleSelect(pkg);
  };

  const handleCreateInvoice = async (namaInvoice) => {
    if (selectedPackages.length === 0) return;
    try {
      await createInvoiceApi({
        packageIds: selectedPackages.map((p) => p.id),
        nama_invoice: namaInvoice,
      });
      alert("Invoice berhasil dibuat!");
      setSelectedPackages([]);
      setSelectMode(false);
      fetchPackages({ filter, sortBy, sortOrder });
    } catch (err) {
      alert(`Gagal buat invoice: ${err.message}`);
    }
  };

  // filter tambahan berdasarkan invoiced
  const filteredPackages = packages
    .filter((pkg) => {
      if (!filter) return true;
      const lowerFilter = filter.toLowerCase();
      return (
        pkg.nama.toLowerCase().includes(lowerFilter) ||
        pkg.resi.toLowerCase().includes(lowerFilter)
      );
    })
    .filter((pkg) => {
      if (invoicedFilter === "all") return true;
      if (invoicedFilter === "yes") return pkg.invoiced;
      if (invoicedFilter === "no") return !pkg.invoiced;
      return true;
    })
    .filter((pkg) => {
      if (viaFilter === "all") return true;
      return pkg.via === viaFilter;
    });

  return (
    <div className="ddp-container">
      <h2>Daftar Detail Paket</h2>

      <PackageControls
        filter={filter}
        setFilter={setFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        invoicedFilter={invoicedFilter}
        setInvoicedFilter={setInvoicedFilter}
        viaFilter={viaFilter}
        setViaFilter={setViaFilter}
        onApply={handleApplyFilterSort}
      />

      {loading && <p>Loading data paket...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <div className="cards-container">
        {filteredPackages.map((pkg) => {
          const isSelected = selectedPackages.some((p) => p.id === pkg.id);
          const isDisabled = pkg.invoiced;

          const latestStatus = latestStatuses[pkg.id];
          const statusLabel = getStatusLabel(latestStatus);

          return (
            <ErrorBoundary key={pkg.id}>
            <PackageCard
              pkg={pkg}
              invoiceId={pkg.invoice_id || null}
              isSelected={isSelected}
              isDisabled={isDisabled}
              statusLabel={statusLabel}
              onClick={() =>
                selectMode
                  ? !isDisabled && toggleSelect(pkg)
                  : setSelectedPackage(pkg)
              }
              onRightClick={(e) => handleCardRightClick(e, pkg)}
            /> </ErrorBoundary>
          );
        })}
      </div>

      {selectMode && selectedPackages.length > 0 && (
        <InvoiceActions onCreate={handleCreateInvoice} />
      )}

      {selectedPackage && (
        <DetailPackageModal
          pkg={selectedPackage}
          invoiceId={selectedPackage.invoice_id || null}
          onClose={() => setSelectedPackage(null)}
        />
      )}
    </div>
  );
}

export default DisplayDetailPackage;
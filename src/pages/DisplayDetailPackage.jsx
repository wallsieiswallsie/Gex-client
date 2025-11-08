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
    const [invoicedFilter, setInvoicedFilter] = useState("all");
    const [viaFilter, setViaFilter] = useState("all");
    const [cabangFilter, setCabangFilter] = useState("all");
    const [visibleCount, setVisibleCount] = useState(10);

    const [selectedPackage, setSelectedPackage] = useState(null);
    const [selectMode, setSelectMode] = useState(false);
    const [selectedPackages, setSelectedPackages] = useState([]);
    const [latestStatuses, setLatestStatuses] = useState({});

    const navigate = useNavigate();
    const { packages, loading, error, fetchPackages } = usePackages();
    const { fetchLatest } = usePackageStatus();

    useEffect(() => {
      const fetchStatuses = async () => {
        const statusesMap = {};
        for (const pkg of packages) {
          try {
            const res = await fetchLatest(pkg.id);
            statusesMap[pkg.id] = res?.latest ? Number(res.latest.status) : null;
          } catch (err) {
            console.warn(`Gagal ambil status untuk paket ${pkg.id}:`, err);
            statusesMap[pkg.id] = null;
          }
        }
        setLatestStatuses(statusesMap);
      };

      if (packages.length > 0) {
        fetchStatuses().catch((err) =>
          console.error("Fatal fetchStatuses error:", err)
        );
      }
    }, [packages, fetchLatest]);

    useEffect(() => {
      const handleScroll = () => {
        if (
          window.innerHeight + window.scrollY >= document.body.offsetHeight - 200
        ) {
          setVisibleCount((prev) => prev + 10);
        }
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleSelect = (pkg) => {
      if (selectedPackages.find((p) => p.id === pkg.id)) {
        setSelectedPackages(selectedPackages.filter((p) => p.id !== pkg.id));
      } else {
        setSelectedPackages([...selectedPackages, pkg]);
      }
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
        fetchPackages({});
      } catch (err) {
        alert(`Gagal buat invoice: ${err.message}`);
      }
    };

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
      })
      .filter((pkg) => {
        if (cabangFilter === "all") return true;

        const kode = pkg.kode?.toUpperCase();
        const cabang =
          kode === "JKSOQA" || kode === "JPSOQA"
            ? "Remu"
            : kode === "JKSOQB" || kode === "JPSOQB"
            ? "Aimas"
            : null;

        return cabang === cabangFilter;
      });

    return (
      <div className="ddp-container">
        <div className="header">
          <h2>Paket Aktif</h2>

          <button
            className="archive-button"
            onClick={() => navigate("/archive_packages")}
          >
            Arsip
          </button>
        </div>

        <PackageControls
          filter={filter}
          setFilter={setFilter}
          invoicedFilter={invoicedFilter}
          setInvoicedFilter={setInvoicedFilter}
          viaFilter={viaFilter}
          setViaFilter={setViaFilter}
          cabangFilter={cabangFilter}
          setCabangFilter={setCabangFilter}
          selectMode={selectMode}
          setSelectMode={setSelectMode}
          setSelectedPackages={setSelectedPackages}
        />

        {loading && <p>Loading data paket...</p>}
        {error && <p style={{ color: "red" }}>Error: {error}</p>}

        {selectMode && selectedPackages.length > 0 && (
          <InvoiceActions onCreate={handleCreateInvoice} />
        )}

        <div className="cards-container">
          {filteredPackages.slice(0, visibleCount).map((pkg) => {
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
                />
              </ErrorBoundary>
            );
          })}
        </div>

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
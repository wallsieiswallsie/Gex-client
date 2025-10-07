// src/utils/api.js
import { useCallback } from "react";
import { useErrors } from "../context/ErrorsContext";
import { API_URL, ACCESS_TOKEN_KEY } from "./constants";

/** low-level fetch wrapper */
export const apiFetch = async (path, options = {}) => {
  const url = path.startsWith("http") ? path : `${API_URL}${path}`;
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(url, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || data.message || "Terjadi kesalahan");
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
};

/** endpoints (pure, tidak menulis localStorage) */
export const loginApi = async (payload) =>
  apiFetch("/auth/login", { method: "POST", body: JSON.stringify(payload) });

export const registerApi = async (payload) =>
  apiFetch("/auth/register", { method: "POST", body: JSON.stringify(payload) });

export const createPackageApi = async (payload) =>
  apiFetch("/packages", { method: "POST", body: JSON.stringify(payload) });

export const fetchPackagesApi = async () => apiFetch("/packages");

export const createInvoiceApi = async (payload) =>
  apiFetch("/invoices", { method: "POST", body: JSON.stringify(payload) });

export const fetchInvoicesApi = async () => apiFetch("/invoices");

export const fetchInvoiceDetailApi = async (id) =>
  apiFetch(`/invoices/${id}`);

export const removePackageFromInvoiceApi = async (invoiceId, packageId) =>
  apiFetch(`/invoices/${invoiceId}/packages/${Number(packageId)}`, { method: "DELETE" });

export const removeActivePackageApi = async (packageId) =>
  apiFetch(`/activePackages/${(packageId)}`, { method: "DELETE" });

export const fetchArchivePackagesApi = async ({
  filter = "",
  sortBy = "created_at",
  sortOrder = "desc",
  page = 1,
  limit = 50,
} = {}) => {
  const params = new URLSearchParams({
    filter,
    sortBy,
    sortOrder,
    page,
    limit,
  });

  return apiFetch(`/archive_packages?${params.toString()}`);
};

export const createBatchesKapalApi = async (payload) =>
  apiFetch("/batches/kapal", { method: "POST", body: JSON.stringify(payload) });

export const createBatchesPesawatApi = async (payload) =>
  apiFetch("/batches/pesawat", { method: "POST", body: JSON.stringify(payload) });

export const fetchBatchesKapalApi = async () => apiFetch("/batches/kapal");

export const fetchBatchesPesawatApi = async () => apiFetch("/batches/pesawat");

export const fetchBatchKapalDetailApi = async (batchId) =>
  apiFetch(`/batches/kapal/${batchId}`);

export const fetchBatchPesawatDetailApi = async (batchId) =>
  apiFetch(`/batches/pesawat/${batchId}`);

export const addPackageToBatchKapalApi = async (batchId, resi) =>
  apiFetch(`/batches/kapal/${batchId}/packages`, { method: "POST", body: JSON.stringify({ resi }) });

export const addPackageToBatchPesawatApi = async (batchId, resi) =>
  apiFetch(`/batches/pesawat/${batchId}/packages`, { method: "POST", body: JSON.stringify({ resi }) });

/** PENGANTARAN API */

// Tambah invoice ke deliveries
export const createPengantaranApi = async (payload) =>
  apiFetch("/pengantaran", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const activePengantaranApi = async (resi) =>
  apiFetch("/pengantaran", {
    method: "PATCH",
    body: JSON.stringify({ resi }),
  });

export const archivePengantaranApi = async (resi) =>
  apiFetch("/pengantaran_archive", {
    method: "PATCH",
    body: JSON.stringify({ resi }),
  });

// Ambil semua invoice yang sudah masuk ke deliveries
export const fetchPengantaranApi = async () =>
  apiFetch("/pengantaran");

export const fetchActivePengantaranApi = async () =>
  apiFetch("/pengantaran_active");

export const fetchArchivePengantaranApi = async () =>
  apiFetch("/pengantaran_archive");

// Ambil detail invoice tertentu dari deliveries
export const fetchPengantaranDetailApi = async (id) =>
  apiFetch(`/pengantaran/${id}`);


/** STATUS API */
// Tambah atau update status paket (status wajib, batchId opsional)
// Tambah atau update status paket / batch
export const addPackageStatus = async (packageId, status, batchId) => {
  const payload = { status };

  // kalau status 3, pakai endpoint batch
  if (status === 3) {
    if (!batchId) {
      throw new Error("batchId wajib untuk status 3");
    }
    payload.batchId = batchId;
    return apiFetch(`/batches/${batchId}/status3`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  }

  else if (status === 4) {
    if (!batchId) {
      throw new Error("batchId wajib untuk status 4");
    }
    payload.batchId = batchId;
    return apiFetch(`/batches/${batchId}/status4`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  }

  // default: pakai endpoint package
  return apiFetch(`/packages/${packageId}/status`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
};

// Ambil status terakhir sebuah paket
export const fetchLatestPackageStatusApi = async (packageId) =>
  apiFetch(`/packages/${packageId}/status/latest`);

/** useApi hook: memetakan error ke ErrorsContext dan memoize request */
export const useApi = () => {
  const { setError } = useErrors();

  const request = useCallback(
    async (pathOrFetcher, options) => {
      try {
        if (typeof pathOrFetcher === "function") {
          return await pathOrFetcher();
        }
        return await apiFetch(pathOrFetcher, options);
      } catch (err) {
      const status = err.status || 500;

      // hanya kirim error global kalau status benar-benar 500 ke atas
      if (status >= 500) {
        setError(status, err.message || "Terjadi kesalahan");
      } else {
        console.warn(`API Warning (${status}):`, err.message);
      }

      throw err;
    }

    }, [setError]
  );

  return { request };
};
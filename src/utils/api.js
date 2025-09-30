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
export const loginApi = async (payload) => apiFetch("/auth/login", {
  method: "POST",
  body: JSON.stringify(payload),
});

export const registerApi = async (payload) => apiFetch("/auth/register", {
  method: "POST",
  body: JSON.stringify(payload),
});

export const fetchPackagesApi = async () => apiFetch("/invoices");

export const fetchInvoicesApi = async () => apiFetch("/invoices");

export const fetchInvoiceDetailApi = async (invoiceId) => apiFetch(`/invoices/${invoiceId}`);

/** useApi hook: memetakan error ke ErrorsContext dan memoize request */
export const useApi = () => {
  const { setError } = useErrors();

  const request = useCallback(
    async (pathOrFetcher, options) => {
      try {
        if (typeof pathOrFetcher === "function") {
          // jika kamu ingin melewatkan fungsi fetcher custom
          return await pathOrFetcher();
        }
        return await apiFetch(pathOrFetcher, options);
      } catch (err) {
        const status = err.status || 500;
        setError(status, err.message || "Terjadi kesalahan");
        throw err;
      }
    },
    [setError]
  );

  return { request };
};
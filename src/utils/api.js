const API_URL = import.meta.env.VITE_API_URL;
const ACCESS_TOKEN_KEY = "ACCESS_TOKEN_KEY";
const REFRESH_TOKEN_KEY = "REFRESH_TOKEN_KEY";

export const registerApi = async (payload) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Gagal register");

  localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
  localStorage.setItem("USER", JSON.stringify(data.user));

  return data;
};

export const loginApi = async (payload) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Gagal login");

  localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
  localStorage.setItem("USER", JSON.stringify(data.user));

  return data;
};

export const refreshTokenApi = async () => {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Gagal refresh token");

  localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
  return data.accessToken;
};

export const createPackageApi = async (payload) => {
  const res = await fetch(`${API_URL}/packages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Gagal simpan paket");
  return data;
};

export const fetchPackagesApi = async (query = {}) => {
  const params = new URLSearchParams(query);
  const res = await fetch(`${API_URL}/packages?${params.toString()}`);
  if (!res.ok) throw new Error("Gagal fetch data");
  return res.json();
};

export const createInvoiceApi = async (packageIds) => {
  const res = await fetch(`${API_URL}/invoices`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ packageIds }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal buat invoice");
  return data;
};

export const fetchInvoicesApi = async () => {
  const res = await fetch(`${API_URL}/invoices`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Gagal ambil invoice");
  return data;
};

export const fetchInvoiceDetailApi = async (invoiceId) => {
  const res = await fetch(`${API_URL}/invoices/${invoiceId}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Gagal ambil detail invoice");
  return data;
};
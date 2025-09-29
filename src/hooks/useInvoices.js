import { useState, useEffect } from "react";
import { fetchInvoicesApi } from "../utils/api";

export const useInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getInvoices = async () => {
      try {
        const data = await fetchInvoicesApi();
        setInvoices(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getInvoices();
  }, []);

  return { invoices, loading, error };
};
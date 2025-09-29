import { useEffect, useState } from "react";
import { fetchPackagesApi } from "../utils/api";

export function usePackages(initialQuery = {}) {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPackages = async (query = initialQuery) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPackagesApi(query);
      setPackages(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages(initialQuery);
  }, []);

  return { packages, loading, error, fetchPackages };
}
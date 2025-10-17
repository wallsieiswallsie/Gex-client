import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchFinanceTotalApi,
  fetchFinanceFinishedApi,
  fetchFinanceUnfinishedApi,
} from "../../../utils/api";

const RemuKapalFinancialStatements = () => {
  const { batchId } = useParams();
  const [data, setData] = useState({
    total: 0,
    finished: 0,
    unfinished: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const kode = "JKSOQA";

  useEffect(() => {
    const fetchFinanceData = async () => {
      try {
        setLoading(true);

        const [totalRes, finishedRes, unfinishedRes] = await Promise.all([
          fetchFinanceTotalApi(batchId, kode),
          fetchFinanceFinishedApi(batchId, kode),
          fetchFinanceUnfinishedApi(batchId, kode),
        ]);

        setData({
          total: Number(totalRes.data?.total) || 0,
          finished: Number(finishedRes.data?.total) || 0,
          unfinished: Number(unfinishedRes.data?.total) || 0,
        });
      } catch (err) {
        console.error("Gagal ambil data finance:", err);
        setError(err.message || "Terjadi kesalahan saat memuat data.");
      } finally {
        setLoading(false);
      }
    };

    if (batchId) fetchFinanceData();
  }, [batchId]);

  if (loading) return <div className="p-6 text-center">Memuat data...</div>;
  if (error) return <div className="p-6 text-red-500 text-center">{error}</div>;

  return (
    <div className="financial_statement-container">
      <h2>{batchId}</h2>
        <div className="cards-container">
          <div className="package-card">
            <h4>Selesai</h4>
            <p>
             Rp {data.finished.toLocaleString("id-ID")}
            </p>
          </div>
          <div className="package-card">
            <h4>Tertahan</h4>
            <p>
              {data.unfinished.toLocaleString("id-ID")}
            </p>
          </div>
          <div className="package-card">
            <h4>Total Keseluruhan</h4>
            <p>
              {data.total.toLocaleString("id-ID")}
            </p>
          </div>
        </div>
    </div>
  );
};

export default RemuKapalFinancialStatements;

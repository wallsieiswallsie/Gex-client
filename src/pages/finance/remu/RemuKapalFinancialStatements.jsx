import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchFinanceTotalApi,
  fetchFinanceFinishedApi,
  fetchFinanceUnfinishedApi,
  fetchFinanceFinishedGroupedApi,
} from "../../../utils/api";

const PAYMENT_METHODS = ["Qris", "Transfer Bank", "Tunai"];

const RemuKapalFinancialStatements = () => {
  const { batchId } = useParams();
  const [data, setData] = useState({
    total: 0,
    finished: 0,
    unfinished: 0,
  });
  const [finishedGrouped, setFinishedGrouped] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const kode = "JKSOQA";

  useEffect(() => {
    const fetchFinanceData = async () => {
      try {
        setLoading(true);

        const [totalRes, finishedRes, unfinishedRes, finishedGroupedRes] =
          await Promise.all([
            fetchFinanceTotalApi(batchId, kode),
            fetchFinanceFinishedApi(batchId, kode),
            fetchFinanceUnfinishedApi(batchId, kode),
            fetchFinanceFinishedGroupedApi(batchId, kode),
          ]);

        setData({
          total: Number(totalRes.data?.total) || 0,
          finished: Number(finishedRes.data?.total) || 0,
          unfinished: Number(unfinishedRes.data?.total) || 0,
        });

        setFinishedGrouped(finishedGroupedRes.data?.grouped || []);
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

      {/* Summary cards */}
      <div className="cards-container">
        <div className="card">
          <h4>Selesai</h4>
          <p>Rp {data.finished.toLocaleString("id-ID")}</p>
        </div>
        <div className="card">
          <h4>Tertahan</h4>
          <p>{data.unfinished.toLocaleString("id-ID")}</p>
        </div>
        <div className="card">
          <h4>Total Keseluruhan</h4>
          <p>Rp {data.total.toLocaleString("id-ID")}</p>
        </div>
      </div>

      {/* Grouped payment method cards */}
      {finishedGrouped.length > 0 && (
        <div className="grouped-payment-method mt-6">
          <h4>Total per Payment Method</h4>
          <div className="cards-container">
            {PAYMENT_METHODS.map((method) => {
              const item = finishedGrouped.find((d) => d.payment_method === method);
              return (
                <div key={method} className="card">
                  <h5>{method}</h5>
                  <p>Rp {Number(item?.total_harga || 0).toLocaleString("id-ID")}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default RemuKapalFinancialStatements;
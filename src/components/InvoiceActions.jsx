import { useState } from "react";

function InvoiceActions({ onCreate }) {
  const [namaInvoice, setNamaInvoice] = useState("");

  const handleClick = () => {
    if (!namaInvoice.trim()) {
      alert("Nama customer harus diisi!");
      return;
    }
    onCreate(namaInvoice);
  };

  return (
    <div className="invoice-actions">
      <input
        type="text"
        placeholder="Nama Customer"
        value={namaInvoice}
        onChange={(e) => setNamaInvoice(e.target.value)}
      />
      <button onClick={handleClick}>Buat Invoice</button>
    </div>
  );
}

export default InvoiceActions;
import React from "react";

function AddPackageToInvoiceModal({ resiList, setResiList, onClose, onAdd }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          width: "300px",
        }}
      >
        <h3>Tambah Paket ke Invoice</h3>
        <p>Masukkan daftar resi (pisahkan dengan spasi, koma, atau enter):</p>
        <textarea
          value={resiList}
          onChange={(e) => setResiList(e.target.value)}
          rows="4"
          style={{ width: "100%", marginBottom: "10px" }}
        />
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button onClick={onClose}>Batal</button>
          <button
            onClick={onAdd}
            style={{
              backgroundColor: "green",
              color: "white",
              border: "none",
              padding: "5px 10px",
            }}
          >
            Tambah
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddPackageToInvoiceModal;

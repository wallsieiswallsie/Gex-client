function InvoiceActions({ onCreate }) {
  return (
    <div className="invoice-actions">
      <button onClick={onCreate}>Buat Invoice</button>
    </div>
  );
}

export default InvoiceActions;
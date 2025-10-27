function InputDetailPackageForm({
  formData,
  errors,
  handleChange,
  handleSave,
  handleCancel,
  handleFileChange,
}) {
  return (
    <form onSubmit={handleSave} className="form-container">
      <div>
        <label>Nama</label>
        <input type="text" name="nama" value={formData.nama} onChange={handleChange} />
        {errors.nama && <p className="error">{errors.nama}</p>}
      </div>

      <div>
        <label>Resi</label>
        <input type="text" name="resi" value={formData.resi} onChange={handleChange} />
        {errors.resi && <p className="error">{errors.resi}</p>}
      </div>

      <div>
        <label>Panjang</label>
        <input type="number" name="panjang" value={formData.panjang} onChange={handleChange} />
      </div>
      <div>
        <label>Lebar</label>
        <input type="number" name="lebar" value={formData.lebar} onChange={handleChange} />
      </div>
      <div>
        <label>Tinggi</label>
        <input type="number" name="tinggi" value={formData.tinggi} onChange={handleChange} />
      </div>
      <div>
        <label>Berat</label>
        <input type="number" name="berat" value={formData.berat} onChange={handleChange} />
      </div>

      {/* Input foto paket */}
      <div>
        <label>Foto Paket</label>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
        />
        {formData.preview && (
          <img
            src={formData.preview}
            alt="Preview paket"
            style={{ width: "100px", borderRadius: "8px", marginTop: "8px" }}
          />
        )}
      </div>

      <div>
        <label>Kode Pengiriman</label>
        <select name="kode" value={formData.kode} onChange={handleChange} required>
          <option value="" disabled hidden />
          <option value="JKSOQA">JKSOQA</option>
          <option value="JKSOQB">JKSOQB</option>
          <option value="JPSOQA">JPSOQA</option>
          <option value="JPSOQB">JPSOQB</option>
        </select>
        {errors.kode && <p className="error">{errors.kode}</p>}
      </div>

      <div className="button_InputDetailPackage">
        <button type="button" onClick={handleCancel}>
          Cancel
        </button>
        <button type="submit">Save</button>
      </div>
    </form>
  );
}

export default InputDetailPackageForm;
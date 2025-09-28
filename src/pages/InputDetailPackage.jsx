import { useState } from "react";

function InputDetailPackage() {
  const [formData, setFormData] = useState({
    nama: "",
    resi: "",
    panjang: "",
    lebar: "",
    tinggi: "",
    berat: "",
    kode: "",
  });

  const [errors, setErrors] = useState({});

  // fungsi validasi per-field (biar real-time)
  const validateField = (name, value) => {
    let message = "";

    if (name === "nama") {
      if (!value.trim()) message = "Nama wajib diisi";
      else if (value.length < 3) message = "Nama minimal 3 karakter";
    }

    if (name === "resi") {
      if (!value.trim()) message = "Resi wajib diisi";
    }

    if (["panjang", "lebar", "tinggi", "berat"].includes(name)) {
      if (!value) message = `${name} wajib diisi`;
      else if (isNaN(value) || Number(value) <= 0)
        message = `${name} harus angka > 0`;
    }

    if (name === "kode") {
      if (!value.trim()) message = "Kode pengiriman wajib diisi";
    }

    return message;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // jalankan validasi real-time
    const errorMessage = validateField(name, value);
    setErrors({ ...errors, [name]: errorMessage });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // cek semua field saat submit
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
        const errorMsg = validateField(key, formData[key]);
        if (errorMsg) newErrors[key] = errorMsg;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
        try {
        const response = await fetch("http://localhost:5000/packages", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            const data = await response.json();
            alert("Data berhasil disimpan! Resi: " + data.resi);
            console.log("Response server:", data);

            // reset form
            handleCancel();
        } else {
            const err = await response.json();
            alert("Gagal simpan: " + (err.error || "Unknown error"));
        }
        } catch (err) {
        console.error("Network error:", err);
        alert("Terjadi kesalahan jaringan");
        }
    }
    };


  const handleCancel = () => {
    setFormData({
      nama: "",
      resi: "",
      panjang: "",
      lebar: "",
      tinggi: "",
      berat: "",
      kode: "",
    });
    setErrors({});
  };

  return (
    <form onSubmit={handleSave} className="form-container">
      <div>
        <label>Nama</label>
        <input
          type="text"
          name="nama"
          value={formData.nama}
          onChange={handleChange}
        />
        {errors.nama && <p className="error">{errors.nama}</p>}
      </div>

      <div>
        <label>Resi</label>
        <input
          type="text"
          name="resi"
          value={formData.resi}
          onChange={handleChange}
        />
        {errors.resi && <p className="error">{errors.resi}</p>}
      </div>

      <div>
        <label>Panjang</label>
        <input
          type="number"
          name="panjang"
          value={formData.panjang}
          onChange={handleChange}
        />
        {errors.panjang && <p className="error">{errors.panjang}</p>}
      </div>

      <div>
        <label>Lebar</label>
        <input
          type="number"
          name="lebar"
          value={formData.lebar}
          onChange={handleChange}
        />
        {errors.lebar && <p className="error">{errors.lebar}</p>}
      </div>

      <div>
        <label>Tinggi</label>
        <input
          type="number"
          name="tinggi"
          value={formData.tinggi}
          onChange={handleChange}
        />
        {errors.tinggi && <p className="error">{errors.tinggi}</p>}
      </div>

      <div>
        <label>Berat</label>
        <input
          type="number"
          name="berat"
          value={formData.berat}
          onChange={handleChange}
        />
        {errors.berat && <p className="error">{errors.berat}</p>}
      </div>

      <div>
        <label>Kode Pengiriman</label>
        <div className="shipping-code_InputDetailPackage">
        <select
          name="kode"
          value={formData.kode}
          onChange={handleChange}
          required
        >
          <option value="" disabled hidden className="placeHolderCode_InputDetailPackage">
            
          </option>
          <option value="JKSOQA">JKSOQA</option>
          <option value="JKSOQB">JKSOQB</option>
          <option value="JPSOQA">JPSOQA</option>
          <option value="JPSOQB">JPSOQB</option>
        </select>
        </div>
        {errors.kode && <p className="error">{errors.kode}</p>}
      </div>


      <div className="button_InputDetailPackage">
      <button
        type="button"
        className="cancel-btn_InputDetailPackage"
        onClick={handleCancel}
      >
        Cancel
      </button>
      <button type="submit">Save</button>
      </div>
    </form>
  );
}

export default InputDetailPackage;

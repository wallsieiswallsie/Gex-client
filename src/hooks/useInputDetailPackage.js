import { useState } from "react";
import { validateField } from "../utils/validations";
import { createPackageApi } from "../utils/api";

export const useInputDetailPackage = () => {
  const [formData, setFormData] = useState({
    nama: "",
    resi: "",
    panjang: "",
    lebar: "",
    tinggi: "",
    berat: "",
    kode: "",
    invoiced: false,
    finished: false,
    via: "Kapal",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const errorMessage = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: errorMessage }));
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
      via: "",
    });
    setErrors({});
  };

const handleSave = async (e) => {
  e.preventDefault();

  const newErrors = {};
  Object.keys(formData).forEach((key) => {
    const errorMsg = validateField(key, formData[key]);
    if (errorMsg) newErrors[key] = errorMsg;
  });

  setErrors(newErrors);

  if (Object.keys(newErrors).length === 0) {
    try {
      const payload = {
        ...formData,
        panjang: Number(formData.panjang),
        lebar: Number(formData.lebar),
        tinggi: Number(formData.tinggi),
        berat: Number(formData.berat),
        invoiced: Boolean(formData.invoiced),
        finished: Boolean(formData.finished),
      };

      const data = await createPackageApi(payload);
      alert("Data berhasil disimpan!");
      handleCancel();
    } catch (err) {
      alert("Gagal simpan: " + err.message);
    }
  }
};


  return {
    formData,
    errors,
    handleChange,
    handleSave,
    handleCancel,
  };
};
import React, { useRef } from "react";

function InputDetailPackageForm({
  formData,
  errors,
  handleChange,
  handleSave,
  handleCancel,
  handleFileChange,
}) {
  const fileInputRef = useRef(null); // ✅ ref untuk reset file

  const onSave = async (e) => {
    e.preventDefault();
    await handleSave(e);

    // Reset input file dan preview setelah berhasil save
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-start px-4 py-10 bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border border-[#3e146d]/20">
        <h2 className="text-2xl font-bold text-center text-[#3e146d] mb-6">
          {formData.id ? "Edit Paket" : "Tambah Paket"}
        </h2>

        <form onSubmit={onSave} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="font-medium text-gray-700">Nama</label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3e146d]"
            />
            {errors.nama && <p className="text-red-500 text-sm">{errors.nama}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-medium text-gray-700">Resi</label>
            <input
              type="text"
              name="resi"
              value={formData.resi}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3e146d]"
            />
            {errors.resi && <p className="text-red-500 text-sm">{errors.resi}</p>}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1">
              <label className="font-medium text-gray-700">Panjang</label>
              <input
                type="number"
                name="panjang"
                value={formData.panjang}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3e146d]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-medium text-gray-700">Lebar</label>
              <input
                type="number"
                name="lebar"
                value={formData.lebar}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3e146d]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-medium text-gray-700">Tinggi</label>
              <input
                type="number"
                name="tinggi"
                value={formData.tinggi}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3e146d]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-medium text-gray-700">Berat</label>
            <input
              type="number"
              name="berat"
              value={formData.berat}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3e146d]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-medium text-gray-700">Foto Paket</label>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="w-full text-sm text-gray-500"
            />
            {formData.preview && (
              <img
                src={formData.preview}
                alt="Preview paket"
                className="w-32 h-32 object-cover rounded-lg mt-2"
              />
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-medium text-gray-700">Kode Pengiriman</label>
            <select
              name="kode"
              value={formData.kode}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3e146d]"
            >
              <option value="" disabled hidden />
              <option value="JKSOQA">JKSOQA</option>
              <option value="JKSOQB">JKSOQB</option>
              <option value="JPSOQA">JPSOQA</option>
              <option value="JPSOQB">JPSOQB</option>
            </select>
            {errors.kode && <p className="text-red-500 text-sm">{errors.kode}</p>}
          </div>

          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 py-2 bg-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-[#3e146d] text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InputDetailPackageForm;
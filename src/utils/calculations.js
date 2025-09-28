const calculatePackageDetails = (pkg) => {
  const actualWeight = Number(pkg.berat);

  // Hitung berat volume untuk tiap moda
  const volumeWeightKapal = (pkg.panjang * pkg.lebar * pkg.tinggi) / 4000;
  const volumeWeightPesawat = (pkg.panjang * pkg.lebar * pkg.tinggi) / 6000;

  // Tentukan berat terpakai berdasarkan moda pengiriman
  const getVia = (kode) => {
    if (kode === "JKSOQA" || kode === "JKSOQB") return "Kapal";
    if (kode === "JPSOQA" || kode === "JPSOQB") return "Pesawat";
    return "-";
  };

  const via = getVia(pkg.kode);
  let weightUsed = actualWeight;
  if (via === "Kapal") weightUsed = Math.max(volumeWeightKapal, actualWeight);
  if (via === "Pesawat") weightUsed = Math.max(volumeWeightPesawat, actualWeight);

  // Hitung harga
  let price = 0;
  if (via === "Kapal") price = weightUsed * 12000;
  if (via === "Pesawat") price = weightUsed * 80000;

  return {
    actualWeight,
    volumeWeightKapal,
    volumeWeightPesawat,
    weightUsed,
    price,
    via,
  };
};

export { calculatePackageDetails };

import { useEffect } from "react";
import { useCustomerApi } from "../../../hooks/useCustomerApi";

function LokasiKontakPageDisplay() {
  const { items, loading, error, fetchItems } = useCustomerApi("lokasiKontak");

  useEffect(() => {
    fetchItems();
  }, []);

  const getEmbedLink = (url) => {
    if (!url) return "";

    if (url.includes("maps/embed")) return url;

    if (url.includes("maps.app.goo.gl") || url.includes("goo.gl/maps")) {
      return `https://www.google.com/maps/embed/v1/place?q=${encodeURIComponent(
        url
      )}&key=AIzaSyDd0GigMQWL7AuiFQLHYisCLY3_NBOJAxw`;
    }

    if (url.includes("/maps/")) {
      return url.replace("/maps/", "/maps/embed/");
    }

    return "";
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-[#3e146d] mb-6">
          Lokasi & Kontak Cabang
        </h2>

        {loading && <p className="text-center">Memuat...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-4 border rounded-2xl shadow-sm bg-white hover:shadow-md transition"
            >
              {/* Alamat */}
              <h6 className="font-semibold text-[#3e146d] text-lg whitespace-pre-wrap break-words mb-2">
                {item.alamat_cabang || "(Tanpa alamat)"}
              </h6>

              {/* No HP */}
              {item.no_hp && (
                <p className="text-gray-700 text-sm mb-2">{item.no_hp}</p>
              )}

              {/* WhatsApp */}
              {item.link_whatsapp && (
                <a
                  href={item.link_whatsapp}
                  target="_blank"
                  className="text-green-600 underline text-sm mb-2 block"
                >
                  WhatsApp
                </a>
              )}

              {/* Map */}
              {item.link_map && (
                <div
                  className="cursor-pointer mt-2"
                  onClick={() => window.open(item.link_map, "_blank")}
                >
                  <iframe
                    className="w-full h-48 rounded-lg border pointer-events-none"
                    src={getEmbedLink(item.link_map)}
                    loading="lazy"
                  ></iframe>

                  <p className="text-center text-sm text-blue-600 underline mt-1">
                    Lihat di Google Maps
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LokasiKontakPageDisplay;

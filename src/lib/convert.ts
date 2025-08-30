function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

function formatWaktu(value: Date) {
  return new Date(value).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
}

// Fungsi untuk format angka ke string dengan titik
const formatNumber = (value: string) => {
  // Jika value adalah string kosong, kembalikan string kosong
  if (value === "") return "";
  // Hapus semua karakter non-numerik (kecuali titik jika ada)
  const numericValue = String(value).replace(/\D/g, "");
  // Format dengan Intl.NumberFormat
  return new Intl.NumberFormat("id-ID").format(Number(numericValue));
};

// Fungsi untuk parsing angka dari string yang sudah diformat
const parseNumber = (value: string) => {
  if (typeof value === "string") {
    // Hapus semua karakter non-numerik (termasuk titik/koma)
    return Number(value.replace(/\D/g, ""));
  }
  return value;
};

export { formatRupiah, formatWaktu, formatNumber, parseNumber };

import Link from "next/link";
import {
  FaFacebookSquare,
  FaInstagramSquare,
  FaTwitterSquare,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 px-6 mt-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Kolom 1: Tentang Kami */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Tentang Kami</h3>
          <ul>
            <li>
              <Link href="/about" className="text-gray-300 hover:text-white">
                Sejarah
              </Link>
            </li>
            <li>
              <Link href="/careers" className="text-gray-300 hover:text-white">
                Karir
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-gray-300 hover:text-white">
                Kontak
              </Link>
            </li>
          </ul>
        </div>

        {/* Kolom 2: Layanan Pelanggan */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Layanan Pelanggan</h3>
          <ul>
            <li>
              <Link href="/faq" className="text-gray-300 hover:text-white">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/returns" className="text-gray-300 hover:text-white">
                Kebijakan Pengembalian
              </Link>
            </li>
            <li>
              <Link href="/shipping" className="text-gray-300 hover:text-white">
                Informasi Pengiriman
              </Link>
            </li>
          </ul>
        </div>

        {/* Kolom 3: Ikuti Kami */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Ikuti Kami</h3>
          <div className="flex space-x-4">
            {/* Placeholder untuk ikon media sosial */}
            <a href="#" className="text-gray-300 hover:text-white">
              <FaFacebookSquare />
            </a>
            <a href="#" className="text-gray-300 hover:text-white">
              <FaInstagramSquare />
            </a>
            <a href="#" className="text-gray-300 hover:text-white">
              <FaTwitterSquare />
            </a>
          </div>
        </div>

        {/* Kolom 4: Newsletter */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
          <p className="text-gray-300 text-sm mb-4">
            Dapatkan update terbaru dan promo eksklusif.
          </p>
          <input
            type="email"
            placeholder="Email Anda"
            className="w-full px-3 py-2 rounded-md bg-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm transition">
            Daftar
          </button>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
        &copy; 2025 Eco Shop. Semua Hak Dilindungi.
      </div>
    </footer>
  );
}

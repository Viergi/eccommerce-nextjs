"use client";

import { Product } from "@/lib/type";
import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set timeout yang menunda update debouncedValue
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Hapus timeout jika value berubah sebelum delay selesai
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function SearchForm({ mobile }: { mobile: boolean }) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchedProducts, setSearchedProducts] = useState([]);
  const debouncedSearchTerm = useDebounce<string>(searchTerm, 500);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (debouncedSearchTerm) {
      const fetchProduct = async () => {
        try {
          const response = await fetch(
            `/api/products?q=${debouncedSearchTerm}`,
            {
              method: "GET",
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch products");
          }
          const responseJson = await response.json();
          setSearchedProducts(responseJson.data);
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      };

      fetchProduct();
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setSearchedProducts([]);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchedProducts([]);
    router.push(`/search?q=${debouncedSearchTerm}`);
  };

  const handleLinkClick = () => {
    setSearchedProducts([]);
  };

  return (
    <div className="relative" ref={searchContainerRef}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          onChange={handleChange}
          placeholder="Cari produk..."
          className={`w-full rounded-md border border-gray-300 px-4 py-2 ${
            !mobile && "pl-10"
          } text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
        />
        {!mobile && (
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        )}
      </form>
      {searchedProducts.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border-2 border-t-0 pt-2 rounded-md">
          {searchedProducts.slice(0, 5).map((product: Product, index) => (
            <li key={index} className="px-2 py-1 w-full border-b">
              <Link
                href={`/product/${product.id}`}
                className="flex flex-col"
                onClick={handleLinkClick}
              >
                <span className="truncate w-40 md:w-8/10 font-bold">
                  {product.name}
                </span>
                <span className="truncate w-40 md:w-8/10 text-sm text-gray-500">
                  {product.description}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

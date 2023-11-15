"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProductLists() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:3002/products");
        if (!response.ok) {
          throw new Error("Veriler alınamadı");
        }
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-5 bg-slate-100 border-slate-300 rounded m-4">
      <div className="flex space-x-4 bg-amber-400 ">
        <h1 className="space-x-4 bg-amber-400 hover:bg-amber-300 p-5">
          <p className="text-white text-m block uppercase tracking-wide font-bold">
            Ürün LİSTESİ
          </p>
        </h1>
        </div>
        {loading ? (
          <p>Veriler yükleniyor...</p>
        ) : (
          <table className="min-w-full bg-gray-100 mb-4 mt-2 ml-1 mr-1">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Ürün id
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                  İSİM
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                  KATEGORİ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                 FİYAT
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.name}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full text-gray-500">
                      {product.id}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link href={`/products/${product.id}`}>
                      <span className="px-2 inline-flex text-sm leading-5 font-semibold rounded-full uppercase tracking-wide text-gray-800">{`${product.name}`}</span>
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full text-gray-500">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full text-gray-500">
                      {product.price}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <button className="bg-purple-600 hover:bg-purple-500 rounded-lg w-32">
          <Link href={`/products/id/create`}>
            <p className="text-white p-2 ">Yeni Ürün Ekle</p>
          </Link>
        </button>
      </div>
    
  );
}

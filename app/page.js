"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [timeLeft, setTimeLeft] = useState("00h : 15m : 32s");

  useEffect(() => {
    async function getProducts() {
      const { data } = await supabase.from("products").select("*");
      if (data) setProducts(data);
    }
    getProducts();
    const timer = setInterval(() => {
      const now = new Date();
      const h = String(23 - now.getHours()).padStart(2,'0');
      const m = String(59 - now.getMinutes()).padStart(2,'0');
      const s = String(59 - now.getSeconds()).padStart(2,'0');
      setTimeLeft(h + "h : " + m + "m : " + s + "s");
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const categories = [
    { name: "Phones & Tablets", img: "https://cdn-icons-png.flaticon.com/128/644/644458.png" },
    { name: "Home & Appliances", img: "https://cdn-icons-png.flaticon.com/128/2970/2970785.png" },
    { name: "Electronics", img: "https://cdn-icons-png.flaticon.com/128/1055/1055685.png" },
    { name: "Health & Beauty", img: "https://cdn-icons-png.flaticon.com/128/3081/3081559.png" },
    { name: "Fashion", img: "https://cdn-icons-png.flaticon.com/128/892/892458.png" },
    { name: "Groceries", img: "https://cdn-icons-png.flaticon.com/128/3082/3082048.png" },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <header className="bg-black p-3 sticky top-0 z-50 border-b border-blue-900">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <h1 className="font-black text-2xl text-white">SHOPDEX<span className="text-blue-500">★</span></h1>
          <div className="flex-1 flex">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="flex-1 border border-gray-700 bg-[#1e293b] text-white rounded-l-md p-2.5 outline-none"
            />
            <button className="bg-blue-900 text-white px-6 rounded-r-md font-bold">Search</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto mt-4 px-2">
        <div className="bg-gradient-to-r from-black to-[#1e3a8a] rounded-md p-6 flex justify-between items-center text-white border border-blue-900">
          <div className="flex items-center gap-3">
            <span className="bg-blue-600 p-2 rounded">⚡</span>
            <h2 className="text-4xl font-black">FLASH<br/>SALES</h2>
          </div>
          <span className="text-sm">Time Left: {timeLeft}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto bg-[#1e293b] mt-4 p-4 rounded-md mx-2 border border-blue-900/30">
        <h3 className="font-bold mb-3 text-white">Categories</h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map(cat => (
            <div key={cat.name} className="text-center p-2">
              <img src={cat.img} className="w-12 h-12 mx-auto object-contain" style={{filter: 'invert(1)'}} />
              <p className="text-xs mt-2 text-gray-300">{cat.name}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto bg-[#1e293b] mt-4 rounded-md overflow-hidden mx-2 border border-blue-900/30">
        <div className="bg-[#0f172a] text-white p-3 flex justify-between border-b border-blue-900">
          <span className="font-bold text-blue-400">⚡ Flash Sales ({filtered.length})</span>
          <span className="text-sm">Time Left: {timeLeft}</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-px bg-blue-900/20">
          {filtered.map((product) => (
            <div key={product.id} className="bg-[#0f172a] p-3">
              <img src={product.image_url} alt={product.name} className="w-full h-40 object-contain bg-white rounded p-1" />
              <p className="text-sm h-10 mt-2 text-white">{product.name}</p>
              <p className="font-bold mt-1 text-blue-400">₦{Number(product.price).toLocaleString()}</p>
              <a href={`https://wa.me/234YOURNUMBER?text=Hi, I want ${product.name}`} target="_blank" className="mt-2 block w-full bg-blue-900 text-white text-center py-2 rounded font-bold text-xs">ADD TO CART</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

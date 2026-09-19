"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function getProducts() {
      const { data, error } = await supabase.from("products").select("*");
      console.log("Products:", data, "Error:", error);
      if (data) setProducts(data);
    }
    getProducts();
  }, []);

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", color: "white", fontFamily: "sans-serif" }}>
      {/* HEADER - BLACK */}
      <header style={{ background: "black", padding: "15px", display: "flex", gap: "15px", alignItems: "center", borderBottom: "2px solid #1e3a8a" }}>
        <h1 style={{ fontWeight: "900", fontSize: "24px" }}>SHOPDEX<span style={{ color: "#3b82f6" }}>★</span></h1>
        <div style={{ flex: 1, display: "flex" }}>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." style={{ flex: 1, padding: "10px", borderRadius: "5px 0 0 5px", border: "none", color: "black" }} />
          <button style={{ background: "#1e3a8a", color: "white", padding: "10px 20px", borderRadius: "0 5px 5px 0", border: "none", fontWeight: "bold" }}>Search</button>
        </div>
        <a href="/admin" style={{ background: "#3b82f6", padding: "8px 15px", borderRadius: "5px", textDecoration: "none", color: "white", fontWeight: "bold" }}>Admin</a>
      </header>

      {/* BANNER */}
      <div style={{ maxWidth: "1200px", margin: "20px auto", padding: "0 10px" }}>
        <div style={{ background: "linear-gradient(to right, black, #1e3a8a)", padding: "30px", borderRadius: "10px", display: "flex", justifyContent: "space-between", border: "1px solid #1e3a8a" }}>
          <h2 style={{ fontSize: "36px", fontWeight: "900", lineHeight: "1" }}>⚡ FLASH<br/>SALES</h2>
          <p>Best Deals in Nigeria</p>
        </div>
      </div>

      {/* PRODUCTS */}
      <div style={{ maxWidth: "1200px", margin: "20px auto", padding: "0 10px" }}>
        <div style={{ background: "#1e293b", padding: "15px", borderRadius: "10px 10px 0 0", fontWeight: "bold", color: "#60a5fa", border: "1px solid #1e3a8a" }}>
          ⚡ Flash Sales ({filtered.length} products) - If 0, check Supabase
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "1px", background: "#1e3a8a" }}>
          {filtered.length === 0 ? (
            <div style={{ gridColumn: "1/-1", background: "#0f172a", padding: "40px", textAlign: "center" }}>
              <p>No products found. Check Supabase table 'products' or RLS policy.</p>
              <p style={{ marginTop: "10px", color: "#60a5fa" }}>Go to Supabase Dashboard → Authentication → Policies → Enable Read for all</p>
            </div>
          ) : (
            filtered.map((product) => (
              <div key={product.id} style={{ background: "#0f172a", padding: "15px" }}>
                <img src={product.image_url} alt={product.name} style={{ width: "100%", height: "150px", objectFit: "contain", background: "white", borderRadius: "5px" }} />
                <p style={{ marginTop: "10px", fontSize: "14px", height: "35px", overflow: "hidden" }}>{product.name}</p>
                <p style={{ fontWeight: "bold", color: "#60a5fa", marginTop: "5px" }}>₦{Number(product.price).toLocaleString()}</p>
                <a href={`https://wa.me/2349034567890?text=Hi, I want ${product.name}`} target="_blank" style={{ display: "block", marginTop: "10px", background: "#1e3a8a", color: "white", textAlign: "center", padding: "10px", borderRadius: "5px", textDecoration: "none", fontWeight: "bold", fontSize: "12px" }}>ADD TO CART</a>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

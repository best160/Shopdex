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
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [activeCat, setActiveCat] = useState("All");
  const [flashTime, setFlashTime] = useState({ h: 2, m: 14, s: 33 });
  const [showSocial, setShowSocial] = useState(true);

  const categories = ["All", "Phones", "Shoes", "Clothes", "Electronics", "Bags", "Watches"];
  const socialProofs = [
    "Tunde from Ikeja just bought Nike Shoes - 2m ago",
    "Amaka from Lekki bought iPhone Case - 5m ago",
    "Chinedu from Surulere bought School Bag - 1m ago",
    "Fatima from Yaba bought Wristwatch - 3m ago",
  ];
  const [socialIndex, setSocialIndex] = useState(0);

  useEffect(() => {
    async function get() {
      const { data } = await supabase.from("products").select("*");
      if (data) setProducts(data);
    }
    get();
    const saved = localStorage.getItem("shopdex_cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  useEffect(() => { localStorage.setItem("shopdex_cart", JSON.stringify(cart)); }, [cart]);

  useEffect(() => {
    const i = setInterval(() => {
      setFlashTime((t) => {
        if (t.s > 0) return {...t, s: t.s - 1 };
        if (t.m > 0) return { h: t.h, m: t.m - 1, s: 59 };
        if (t.h > 0) return { h: t.h - 1, m: 59, s: 59 };
        return { h: 2, m: 0, s: 0 };
      });
    }, 1000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    const s = setInterval(() => { setSocialIndex((prev) => (prev + 1) % socialProofs.length); setShowSocial(true); }, 8000);
    return () => clearInterval(s);
  }, []);

  const filtered = products.filter((p) => {
    const ms = p.name.toLowerCase().includes(search.toLowerCase());
    const mc = activeCat === "All" || p.category === activeCat;
    return ms && mc;
  });

  function addToCart(p) {
    const ex = cart.find((c) => c.id === p.id);
    if (ex) setCart(cart.map((c) => (c.id === p.id? {...c, qty: c.qty + 1 } : c)));
    else setCart([...cart, {...p, qty: 1 }]);
    setShowCart(true);
  }
  function changeQty(id, delta) {
    setCart((prev) => prev.map((c) => (c.id === id? {...c, qty: c.qty + delta } : c)).filter((c) => c.qty > 0));
  }

  const total = cart.reduce((s, c) => s + Number(c.price) * c.qty, 0);
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  return (
    <div style={{ background: "#f5f5f5", minHeight: "100vh", color: "#111", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <style>{`
       .header-top{ display:flex; align-items:center; justify-content:space-between; gap:10px; }
       .search-row{ display:flex; flex:1; max-width:500px; }
       .grid{ display:grid; grid-template-columns:repeat(6, 1fr); gap:12px; }
        @media(max-width:1100px){.grid{ grid-template-columns:repeat(4, 1fr); }}
        @media(max-width:750px){.grid{ grid-template-columns:repeat(3, 1fr); }}
        @media(max-width:600px){
         .header{ flex-direction:column!important; align-items:stretch!important; gap:10px!important; }
         .header-top{ width:100%!important; }
         .search-row{ max-width:100%!important; width:100%!important; }
         .grid{ grid-template-columns:repeat(2, 1fr)!important; gap:10px!important; }
         .footer-grid{ grid-template-columns:1fr!important; }
         .flash-box{ margin:10px!important; }
        }
        @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        @keyframes slideIn{from{transform:translateX(-120%)}to{transform:translateX(0)}}
      `}</style>

      {/* HEADER */}
      <div className="header" style={{ background: "black", padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "15px", position: "sticky", top: 0, zIndex: 100 }}>
        <div className="header-top">
          <h1 style={{ fontWeight: 900, fontSize: "20px", margin: 0, color: "white", letterSpacing: "-0.5px" }}>SHOPDEX.NG</h1>
          <div style={{ display: "flex", gap: "6px" }}>
            <button onClick={() => setShowCart(true)} style={{ background: "#222", color: "white", padding: "8px 14px", borderRadius: "8px", border: "1px solid #333", fontWeight: 800, fontSize: "13px" }}>🛒 {cartCount > 0? `(${cartCount})` : ""}</button>
            <a href="/admin" style={{ background: "white", color: "black", padding: "8px 10px", borderRadius: "8px", textDecoration: "none", fontSize: "12px", fontWeight: 900 }}>ADMIN</a>
          </div>
        </div>
        <div className="search-row">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." style={{ flex: 1, padding: "11px 12px", borderRadius: "8px 0 0 8px", border: "none", outline: "none", fontSize: "13px" }} />
          <button style={{ background: "white", color: "black", border: "none", padding: "0 18px", borderRadius: "0 8px 8px 0", fontWeight: 900 }}>⌕</button>
        </div>
      </div>

      <div style={{ background: "black", color: "white", textAlign: "center", padding: "7px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.5px", borderTop: "1px solid #222" }}>FREE DELIVERY IN LAGOS TODAY • PAY ON DELIVERY AVAILABLE</div>

      {/* CATEGORIES */}
      <div style={{ display: "flex", gap: "8px", overflowX: "auto", padding: "12px", background: "white", borderBottom: "1px solid #eee" }}>
        {categories.map((c) => (
          <button key={c} onClick={() => setActiveCat(c)} style={{ padding: "6px 14px", borderRadius: "20px", border: "1px solid #ddd", whiteSpace: "nowrap", fontWeight: 700, fontSize: "12px", background: activeCat === c? "black" : "white", color: activeCat === c? "white" : "#333", cursor: "pointer" }}>{c}</button>
        ))}
      </div>

      {/* FLASH TIMER - BLACK WHITE ONLY */}
      <div className="flash-box" style={{ background: "white", margin: "12px", borderRadius: "10px", border: "2px solid black", padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "1400px", marginLeft: "auto", marginRight: "auto" }}>
        <div><div style={{ fontSize: "10px", fontWeight: 900, color: "#666" }}>⚡ FLASH SALES</div><div style={{ fontWeight: 900, fontSize: "13px", color: "black" }}>50% OFF ENDS IN</div></div>
        <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
          <span style={{ background: "black", color: "white", padding: "6px 8px", borderRadius: "6px", fontWeight: 900, fontSize: "13px" }}>{String(flashTime.h).padStart(2, "0")}</span><span style={{ fontWeight: 900 }}>:</span>
          <span style={{ background: "black", color: "white", padding: "6px 8px", borderRadius: "6px", fontWeight: 900, fontSize: "13px" }}>{String(flashTime.m).padStart(2, "0")}</span><span style={{ fontWeight: 900 }}>:</span>
          <span style={{ background: "black", color: "white", padding: "6px 8px", borderRadius: "6px", fontWeight: 900, fontSize: "13px" }}>{String(flashTime.s).padStart(2, "0")}</span>
        </div>
      </div>

      {/* PRODUCTS */}
      <div style={{ padding: "12px", maxWidth: "1400px", margin: "0 auto" }}>
        <div className="grid">
          {filtered.map((p) => {
            const oldPrice = Math.round(Number(p.price) * 1.7);
            const rating = (4.3 + Math.random() * 0.6).toFixed(1);
            const sold = Math.floor(80 + Math.random() * 300);
            return (
              <div key={p.id} style={{ background: "white", borderRadius: "10px", overflow: "hidden", position: "relative", border: "1px solid #e5e5e5" }}>
                <div style={{ position: "absolute", top: "6px", left: "6px", background: "black", color: "white", fontSize: "11px", fontWeight: 900, padding: "3px 6px", borderRadius: "4px", zIndex: 2 }}>-45%</div>
                <img src={p.image_url || p.image} alt={p.name} style={{ width: "100%", height: "150px", objectFit: "cover", background: "#f9f9f9" }} />
                <div style={{ padding: "8px 10px" }}>
                  <div style={{ fontSize: "10px", color: "#888", textTransform: "uppercase" }}>{p.category}</div>
                  <div style={{ fontSize: "12px", fontWeight: 600, height: "32px", overflow: "hidden", lineHeight: "1.25", color: "#111" }}>{p.name}</div>
                  <div style={{ display: "flex", gap: "4px", alignItems: "center", margin: "5px 0" }}>
                    <span style={{ color: "black", fontSize: "11px", fontWeight: 700 }}>★ {rating}</span>
                    <span style={{ fontSize: "10px", color: "#666" }}>({Math.floor(Math.random() * 80) + 20})</span>
                    <span style={{ fontSize: "10px", color: "black", marginLeft: "auto", fontWeight: 700, background: "#f3f3f3", padding: "2px 5px", borderRadius: "4px" }}>{sold} sold</span>
                  </div>
                  <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                    <b style={{ fontSize: "14px", color: "black" }}>₦{Number(p.price).toLocaleString()}</b>
                    <span style={{ fontSize: "10px", color: "#999", textDecoration: "line-through" }}>₦{oldPrice.toLocaleString()}</span>
                  </div>
                  <button onClick={() => addToCart(p)} style={{ width: "100%", marginTop: "8px", background: "black", color: "white", border: "none", padding: "9px", borderRadius: "6px", fontWeight: 800, fontSize: "11px", cursor: "pointer" }}>ADD TO CART</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FOOTER - COOL FOOTER BACK */}
      <footer style={{ background: "black", color: "white", marginTop: "30px", padding: "30px 15px 15px" }}>
        <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", maxWidth: "1200px", margin: "0 auto" }}>
          <div><h3 style={{ fontWeight: 900, marginBottom: "10px" }}>SHOPDEX.NG</h3><p style={{ fontSize: "12px", color: "#aaa", lineHeight: "1.6" }}>Your No.1 trusted online store in Nigeria. Quality products, fast delivery, pay on delivery in Lagos.</p></div>
          <div><h4 style={{ fontWeight: 800, fontSize: "13px", marginBottom: "10px" }}>CUSTOMER SERVICE</h4><div style={{ fontSize: "12px", color: "#aaa", display: "flex", flexDirection: "column", gap: "6px" }}><span>Contact Us</span><span>Track Order</span><span>Returns & Refunds</span><span>FAQs</span></div></div>
          <div><h4 style={{ fontWeight: 800, fontSize: "13px", marginBottom: "10px" }}>ABOUT US</h4><div style={{ fontSize: "12px", color: "#aaa", display: "flex", flexDirection: "column", gap: "6px" }}><span>About Shopdex</span><span>Terms & Conditions</span><span>Privacy Policy</span><span>Become a Seller</span></div></div>
          <div><h4 style={{ fontWeight: 800, fontSize: "13px", marginBottom: "10px" }}>CONTACT</h4><div style={{ fontSize: "12px", color: "#aaa", display: "flex", flexDirection: "column", gap: "6px" }}><span>📍 Lagos, Nigeria</span><span>📞 +234 905 979 1761</span><span>✉️ agadabest4@gmail.com</span><span style={{ marginTop: "8px", background: "white", color: "black", padding: "6px 10px", borderRadius: "6px", fontWeight: 800, width: "fit-content" }}>PAY ON DELIVERY</span></div></div>
        </div>
        <div style={{ borderTop: "1px solid #222", marginTop: "25px", paddingTop: "12px", textAlign: "center", fontSize: "11px", color: "#666" }}>© 2026 SHOPDEX.NG - All Rights Reserved. Built in Lagos</div>
      </footer>

      {/* CART WITH DELETE */}
      {showCart && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 200, display: "flex", justifyContent: "flex-end" }}>
          <div style={{ background: "white", width: "92%", maxWidth: "400px", height: "100%", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "16px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center", background: "black", color: "white" }}>
              <h2 style={{ fontWeight: 900, fontSize: "16px", margin: 0 }}>🛒 CART ({cartCount})</h2>
              <button onClick={() => setShowCart(false)} style={{ border: "none", background: "white", color: "black", width: "32px", height: "32px", borderRadius: "50%", fontWeight: 900, cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "12px" }}>
              {cart.length === 0? (
                <div style={{ textAlign: "center", padding: "60px 20px" }}><div style={{ fontSize: "50px" }}>🛒</div><p style={{ fontWeight: 700, color: "black" }}>Your cart is empty</p><button onClick={() => setShowCart(false)} style={{ marginTop: "15px", background: "black", color: "white", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: 800 }}>SHOP NOW</button></div>
              ) : cart.map((c) => (
                <div key={c.id} style={{ display: "flex", gap: "12px", marginBottom: "12px", border: "1px solid #eee", borderRadius: "10px", padding: "10px", position: "relative" }}>
                  <img src={c.image_url || c.image} style={{ width: "65px", height: "65px", objectFit: "cover", borderRadius: "8px" }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "12px", fontWeight: 600, color: "black", paddingRight: "25px" }}>{c.name}</div>
                    <div style={{ fontWeight: 900, fontSize: "14px", margin: "4px 0", color: "black" }}>₦{Number(c.price).toLocaleString()}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px" }}>
                      <button onClick={() => changeQty(c.id, -1)} style={{ width: "28px", height: "28px", border: "1px solid #ddd", background: "white", borderRadius: "6px", fontWeight: 900, cursor: "pointer" }}>-</button>
                      <span style={{ fontWeight: 800, fontSize: "13px", minWidth: "20px", textAlign: "center" }}>{c.qty}</span>
                      <button onClick={() => changeQty(c.id, 1)} style={{ width: "28px", height: "28px", border: "1px solid #ddd", background: "black", color: "white", borderRadius: "6px", fontWeight: 900, cursor: "pointer" }}>+</button>
                      <span style={{ marginLeft: "auto", fontSize: "11px", color: "#666" }}>₦{(Number(c.price) * c.qty).toLocaleString()}</span>
                    </div>
                  </div>
                  <button onClick={() => setCart(cart.filter((item) => item.id!== c.id))} style={{ position: "absolute", top: "8px", right: "8px", border: "none", background: "#f5f5f5", width: "24px", height: "24px", borderRadius: "50%", cursor: "pointer" }}>🗑️</button>
                </div>
              ))}
            </div>
            {cart.length > 0 && (
              <div style={{ borderTop: "1px solid #eee", padding: "14px", background: "#fafafa" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}><span style={{ fontSize: "13px", color: "#666" }}>Total ({cartCount} items)</span><span style={{ fontWeight: 900, fontSize: "16px", color: "black" }}>₦{total.toLocaleString()}</span></div>
                <a href={`https://wa.me/2349059791761?text=${encodeURIComponent(`Hello SHOPDEX! I want to order:\n\n${cart.map((c) => `• ${c.name} x${c.qty} - ₦${Number(c.price).toLocaleString()}`).join("\n")}\n\nTotal: ₦${total.toLocaleString()}`)}`} target="_blank" style={{ display: "block", background: "black", color: "white", textAlign: "center", padding: "13px", borderRadius: "10px", textDecoration: "none", fontWeight: 900, fontSize: "13px" }}>ORDER ON WHATSAPP →</a>
                <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                  <button onClick={() => setCart([])} style={{ flex: 1, background: "white", color: "black", border: "1px solid #ddd", padding: "10px", borderRadius: "8px", fontWeight: 700, fontSize: "12px", cursor: "pointer" }}>🗑️ CLEAR</button>
                  <button onClick={() => setShowCart(false)} style={{ flex: 1, background: "#eee", color: "black", border: "none", padding: "10px", borderRadius: "8px", fontWeight: 700, fontSize: "12px", cursor: "pointer" }}>CONTINUE</button>
                </div>
              </div>

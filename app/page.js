"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [activeCat, setActiveCat] = useState("All");
  const [flashTime, setFlashTime] = useState({ h: 2, m: 14, s: 33 });

  const categories = ["All", "Phones", "Shoes", "Clothes", "Electronics", "Bags", "Watches"];

  useEffect(() => {
    supabase.from("products").select("*").then(({ data }) => { if (data) setProducts(data); });
    const saved = localStorage.getItem("shopdex_cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  useEffect(() => { localStorage.setItem("shopdex_cart", JSON.stringify(cart)); }, [cart]);

  useEffect(() => {
    const id = setInterval(() => {
      setFlashTime((t) => {
        if (t.s > 0) return { h: t.h, m: t.m, s: t.s - 1 };
        if (t.m > 0) return { h: t.h, m: t.m - 1, s: 59 };
        if (t.h > 0) return { h: t.h - 1, m: 59, s: 59 };
        return { h: 2, m: 0, s: 0 };
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const filtered = products.filter((p) => {
    const okSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const okCat = activeCat === "All" || p.category === activeCat;
    return okSearch && okCat;
  });

  function addToCart(p) {
    const ex = cart.find((c) => c.id === p.id);
    if (ex) setCart(cart.map((c) => (c.id === p.id? {...c, qty: c.qty + 1 } : c)));
    else setCart([...cart, {...p, qty: 1 }]);
  }

  function changeQty(id, d) {
    setCart((prev) => prev.map((c) => (c.id === id? {...c, qty: c.qty + d } : c)).filter((c) => c.qty > 0));
  }

  function removeItem(id) {
    setCart((prev) => prev.filter((c) => c.id!== id));
  }

  const total = cart.reduce((s, c) => s + Number(c.price) * c.qty, 0);
  const count = cart.reduce((s, c) => s + c.qty, 0);

  return (
    <div style={{ background: "#f5f5f5", minHeight: "100vh", color: "#111", fontFamily: "system-ui" }}>
      <style>{`
       .grid{ display:grid; grid-template-columns:repeat(6, 1fr); gap:12px; }
        @media(max-width:1100px){.grid{grid-template-columns:repeat(4, 1fr)}}
        @media(max-width:750px){.grid{grid-template-columns:repeat(3, 1fr)}}
        @media(max-width:600px){
         .top{flex-direction:column!important; align-items:stretch!important;}
         .grid{grid-template-columns:repeat(2, 1fr)!important;}
         .foot{grid-template-columns:1fr!important;}
        }
      `}</style>

      <div className="top" style={{ background: "black", padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", position: "sticky", top: 0, zIndex: 100 }}>
        <h1 style={{ color: "white", fontWeight: 900, margin: 0, fontSize: "20px" }}>SHOPDEX.NG</h1>
        <div style={{ display: "flex", flex: 1, maxWidth: "500px" }}>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." style={{ flex: 1, padding: "10px", borderRadius: "8px 0 0 8px", border: "none", outline: "none" }} />
          <button style={{ background: "white", color: "black", border: "none", padding: "0 16px", borderRadius: "0 8px 8px 0", fontWeight: 900 }}>⌕</button>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={() => setShowCart(true)} style={{ background: "#222", color: "white", border: "1px solid #333", padding: "8px 14px", borderRadius: "8px", fontWeight: 800 }}>🛒 {count? `(${count})` : ""}</button>
          <a href="/admin" style={{ background: "white", color: "black", padding: "8px 10px", borderRadius: "8px", textDecoration: "none", fontSize: "12px", fontWeight: 900 }}>ADMIN</a>
        </div>
      </div>

      <div style={{ background: "black", color: "white", textAlign: "center", padding: "7px", fontSize: "11px", fontWeight: 700, borderTop: "1px solid #222" }}>FREE DELIVERY IN LAGOS TODAY - PAY ON DELIVERY</div>

      <div style={{ display: "flex", gap: "8px", overflowX: "auto", padding: "10px", background: "white", borderBottom: "1px solid #eee" }}>
        {categories.map((c) => (
          <button key={c} onClick={() => setActiveCat(c)} style={{ padding: "6px 14px", borderRadius: "20px", border: "1px solid #ddd", whiteSpace: "nowrap", fontWeight: 700, fontSize: "12px", background: activeCat === c? "black" : "white", color: activeCat === c? "white" : "#333" }}>{c}</button>
        ))}
      </div>

      <div style={{ background: "white", margin: "12px", border: "2px solid black", borderRadius: "10px", padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "1400px", marginLeft: "auto", marginRight: "auto" }}>
        <div><div style={{ fontSize: "10px", fontWeight: 900, color: "#666" }}>FLASH SALES</div><div style={{ fontWeight: 900, fontSize: "13px" }}>50% OFF ENDS IN</div></div>
        <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
          <span style={{ background: "black", color: "white", padding: "6px 8px", borderRadius: "6px", fontWeight: 900 }}>{String(flashTime.h).padStart(2, "0")}</span>
          <span style={{ fontWeight: 900 }}>:</span>
          <span style={{ background: "black", color: "white", padding: "6px 8px", borderRadius: "6px", fontWeight: 900 }}>{String(flashTime.m).padStart(2, "0")}</span>
          <span style={{ fontWeight: 900 }}>:</span>
          <span style={{ background: "black", color: "white", padding: "6px 8px", borderRadius: "6px", fontWeight: 900 }}>{String(flashTime.s).padStart(2, "0")}</span>
        </div>
      </div>

      <div style={{ padding: "12px", maxWidth: "1400px", margin: "0 auto" }}>
        <div className="grid">
          {filtered.map((p) => {
            const oldPrice = Math.round(Number(p.price) * 1.7);
            return (
              <div key={p.id} style={{ background: "white", borderRadius: "10px", overflow: "hidden", border: "1px solid #e5e5e5", position: "relative" }}>
                <div style={{ position: "absolute", top: "6px", left: "6px", background: "black", color: "white", fontSize: "11px", fontWeight: 900, padding: "3px 6px", borderRadius: "4px" }}>-45%</div>
                <img src={p.image_url || p.image} alt={p.name} style={{ width: "100%", height: "150px", objectFit: "cover" }} />
                <div style={{ padding: "8px 10px" }}>
                  <div style={{ fontSize: "10px", color: "#888" }}>{p.category}</div>
                  <div style={{ fontSize: "12px", fontWeight: 600, height: "32px", overflow: "hidden" }}>{p.name}</div>
                  <div style={{ display: "flex", gap: "5px", alignItems: "center", marginTop: "4px" }}>
                    <b style={{ fontSize: "14px" }}>₦{Number(p.price).toLocaleString()}</b>
                    <span style={{ fontSize: "10px", color: "#999", textDecoration: "line-through" }}>₦{oldPrice.toLocaleString()}</span>
                  </div>
                  <button onClick={() => addToCart(p)} style={{ width: "100%", marginTop: "8px", background: "black", color: "white", border: "none", padding: "9px", borderRadius: "6px", fontWeight: 800, fontSize: "11px" }}>ADD TO CART</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <footer style={{ background: "black", color: "white", marginTop: "30px", padding: "30px 15px 15px" }}>
        <div className="foot" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", maxWidth: "1200px", margin: "0 auto" }}>
          <div><h3 style={{ fontWeight: 900, marginBottom: "10px" }}>SHOPDEX.NG</h3><p style={{ fontSize: "12px", color: "#aaa" }}>Your No.1 trusted online store in Nigeria. Quality products, fast delivery, pay on delivery in Lagos.</p></div>
          <div><h4 style={{ fontWeight: 800, fontSize: "13px", marginBottom: "10px" }}>CUSTOMER SERVICE</h4><div style={{ fontSize: "12px", color: "#aaa" }}>Contact Us<br />Track Order<br />Returns</div></div>
          <div><h4 style={{ fontWeight: 800, fontSize: "13px", marginBottom: "10px" }}>ABOUT US</h4><div style={{ fontSize: "12px", color: "#aaa" }}>About Shopdex<br />Terms<br />Privacy</div></div>
          <div><h4 style={{ fontWeight: 800, fontSize: "13px", marginBottom: "10px" }}>CONTACT</h4><div style={{ fontSize: "12px", color: "#aaa" }}>📍 Lagos, Nigeria<br />📞 +234 905 979 1761<br />✉️ agadabest4@gmail.com</div></div>
        </div>
        <div style={{ borderTop: "1px solid #222", marginTop: "20px", paddingTop: "12px", textAlign: "center", fontSize: "11px", color: "#666" }}>© 2026 SHOPDEX.NG - All Rights Reserved</div>
      </footer>

      {showCart && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 200, display: "flex", justifyContent: "flex-end" }}>
          <div style={{ background: "white", width: "92%", maxWidth: "400px", height: "100%", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "16px", background: "black", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 900 }}>CART ({count})</h2>
              <button onClick={() => setShowCart(false)} style={{ background: "white", color: "black", border: "none", width: "32px", height: "32px", borderRadius: "50%", fontWeight: 900 }}>X</button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "12px" }}>
              {cart.length === 0? (
                <div style={{ textAlign: "center", padding: "50px 20px" }}><div style={{ fontSize: "40px" }}>🛒</div><p style={{ fontWeight: 700 }}>Cart is empty</p></div>
              ) : (
                cart.map((c) => (
                  <div key={c.id} style={{ display: "flex", gap: "10px", border: "1px solid #eee", borderRadius: "10px", padding: "10px", marginBottom: "10px", position: "relative" }}>
                    <img src={c.image_url || c.image} style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px" }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "12px", fontWeight: 600, paddingRight: "20px" }}>{c.name}</div>
                      <div style={{ fontWeight: 900, margin: "4px 0" }}>₦{Number(c.price).toLocaleString()}</div>
                      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                        <button onClick={() => changeQty(c.id, -1)} style={{ width: "28px", height: "28px", border: "1px solid #ddd", borderRadius: "6px", background: "white" }}>-</button>
                        <span style={{ fontWeight: 800 }}>{c.qty}</span>
                        <button onClick={() => changeQty(c.id, 1)} style={{ width: "28px", height: "28px", border: "1px solid #ddd", borderRadius: "6px", background: "black", color: "white" }}>+</button>
                      </div>
                    </div>
                    <button onClick={() => removeItem(c.id)} style={{ position: "absolute", top: "8px", right: "8px", border: "none", background: "#f5f5f5", width: "24px", height: "24px", borderRadius: "50%" }}>🗑️</button>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div style={{ borderTop: "1px solid #eee", padding: "14px", background: "#fafafa" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontWeight: 900 }}>
                  <span>Total</span><span>₦{total.toLocaleString()}</span>
                </div>
                <a href={`https://wa.me/2349059791761?text=${encodeURIComponent(`Hello SHOPDEX! I want:\n${cart.map((c) => `${c.name} x${c.qty}`).join("\n")}\nTotal: ₦${total}`)}`} target="_blank" style={{ display: "block", background: "black", color: "white", textAlign: "center", padding: "13px", borderRadius: "10px", textDecoration: "none", fontWeight: 900 }}>ORDER ON WHATSAPP</a>
                <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                  <button onClick={() => setCart([])} style={{ flex: 1, background: "white", border: "1px solid #ddd", padding: "10px", borderRadius: "8px", fontWeight: 700 }}>CLEAR CART</button>
                  <button onClick={() => setShowCart(false)} style={{ flex: 1, background: "#eee", border: "none", padding: "10px", borderRadius: "8px", fontWeight: 700 }}>CONTINUE</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <a href="https://wa.me/2349059791761" target="_blank" style={{ position: "fixed", bottom: "20px", right: "15px", background: "#25D366", width: "56px", height: "56px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", boxShadow: "0 4px 15px rgba(0,0,0,0.3)", zIndex: 99, textDecoration: "none" }}>

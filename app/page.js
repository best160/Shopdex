"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function Home() {
  const [products,setProducts]=useState([]);
  const [search,setSearch]=useState("");
  const [cart,setCart]=useState([]);
  const [showCart,setShowCart]=useState(false);
  const [activeCat,setActiveCat]=useState("All");
  const categories=["All","Phones","Shoes","Clothes","Electronics","Bags","Watches"];

  useEffect(()=>{
    async function get(){ const {data}=await supabase.from("products").select("*"); if(data) setProducts(data); }
    get(); const s=localStorage.getItem("shopdex_cart"); if(s) setCart(JSON.parse(s));
  },[]);
  useEffect(()=>{ localStorage.setItem("shopdex_cart", JSON.stringify(cart)); },[cart]);

  const filtered=products.filter(p=>{
    const ms=p.name.toLowerCase().includes(search.toLowerCase());
    const mc=activeCat==="All"||p.category===activeCat;
    return ms&&mc;
  });

  function addToCart(p){
    const ex=cart.find(c=>c.id===p.id);
    if(ex) setCart(cart.map(c=>c.id===p.id?{...c,qty:c.qty+1}:c));
    else setCart([...cart,{...p,qty:1}]);
  }
  function changeQty(id,delta){ setCart(cart.map(c=>c.id===id?{...c,qty:Math.max(1,c.qty+delta)}:c).filter(c=>c.qty>0)); }
  const total=cart.reduce((s,c)=>s+Number(c.price)*c.qty,0);
  const cartCount=cart.reduce((s,c)=>s+c.qty,0);

  return (
    <div style={{background:"#f5f5f5", minHeight:"100vh", color:"#111", fontFamily:"system-ui"}}>
      <style>{`
      .header-top{ display:flex; align-items:center; justify-content:space-between; gap:10px; }
      .search-row{ display:flex; flex:1; max-width:500px; }
      .grid{ display:grid; grid-template-columns:repeat(6, 1fr); gap:12px; }
       @media(max-width:1100px){.grid{ grid-template-columns:repeat(4, 1fr); } }
       @media(max-width:750px){.grid{ grid-template-columns:repeat(3, 1fr); } }
       @media(max-width:600px){
        .header{ flex-direction:column; align-items:stretch!important; gap:10px!important; }
        .header-top{ width:100%; }
        .search-row{ max-width:100%!important; width:100%; }
        .grid{ grid-template-columns:repeat(2, 1fr)!important; gap:10px!important; }
        .footer-grid{ grid-template-columns:1fr!important; gap:20px!important; }
       }
      `}</style>

      <div className="header" style={{background:"black", padding:"10px 12px", display:"flex", justifyContent:"space-between", alignItems:"center", gap:"15px", position:"sticky", top:0, zIndex:100}}>
        <div className="header-top">
          <h1 style={{fontWeight:900, fontSize:"20px", margin:0, whiteSpace:"nowrap", color:"white"}}>SHOPDEX<span style={{color:"white"}}>.NG</span></h1>
          <div style={{display:"flex", gap:"6px"}}>
            <button onClick={()=>setShowCart(true)} style={{background:"#222", color:"white", padding:"7px 12px", borderRadius:"8px", border:"1px solid #333", fontWeight:"700"}}>🛒 {cartCount>0?`(${cartCount})`:""}</button>
            <a href="/admin" style={{background:"white", color:"black", padding:"7px 10px", borderRadius:"8px", textDecoration:"none", fontSize:"12px", fontWeight:"900"}}>ADMIN</a>
          </div>
        </div>
        <div className="search-row">
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products..." style={{flex:1, padding:"10px 12px", borderRadius:"8px 0 0 8px", border:"none", outline:"none"}} />
          <button style={{background:"white", color:"black", border:"none", padding:"0 16px", borderRadius:"0 8px 8px 0", fontWeight:"900"}}>⌕</button>
        </div>
      </div>

      {/* NO ORANGE - BLACK TRUST BAR */}
      <div style={{background:"black", color:"white", textAlign:"center", padding:"7px", fontSize:"12px", fontWeight:"700", borderTop:"1px solid #222", letterSpacing:"0.5px"}}>FREE DELIVERY IN LAGOS TODAY • PAY ON DELIVERY AVAILABLE</div>

      <div style={{display:"flex", gap:"8px", overflowX:"auto", padding:"12px", background:"white", borderBottom:"1px solid #eee"}}>
        {categories.map(c=>(
          <button key={c} onClick={()=>setActiveCat(c)} style={{padding:"6px 14px", borderRadius:"20px", border:"1px solid #ddd", whiteSpace:"nowrap", fontWeight:"700", fontSize:"12px", background:activeCat===c?"black":"white", color:activeCat===c?"white":"#333"}}>{c}</button>
        ))}
      </div>

      <div style={{padding:"12px", maxWidth:"1400px", margin:"0 auto"}}>
        <div className="grid">
          {filtered.map((p)=>{
            const oldPrice = Math.round(Number(p.price)*1.7);
            const rating = (4.3 + Math.random()*0.6).toFixed(1);
            const sold = Math.floor(80+Math.random()*300);
            return(
              <div key={p.id} style={{background:"white", borderRadius:"10px", overflow:"hidden", position:"relative", border:"1px solid #e5e5e5"}}>
                <div style={{position:"absolute", top:"6px", left:"6px", background:"black", color:"white", fontSize:"11px", fontWeight:"900", padding:"3px 6px", borderRadius:"4px"}}>-45%</div>
                <img src={p.image_url || p.image} style={{width:"100%", height:"150px", objectFit:"cover", background:"#f9f9f9"}} />
                <div style={{padding:"8px 10px"}}>
                  <div style={{fontSize:"10px", color:"#888", textTransform:"uppercase"}}>{p.category}</div>
                  <div style={{fontSize:"12px", fontWeight:"600", height:"32px", overflow:"hidden", lineHeight:"1.25", color:"#111"}}>{p.name}</div>
                  <div style={{display:"flex", gap:"4px", alignItems:"center", margin:"5px 0"}}>
                    <span style={{color:"black", fontSize:"11px", fontWeight:"700"}}>★ {rating}</span>
                    <span style={{fontSize:"10px", color:"#666"}}>({Math.floor(Math.random()*80)+20})</span>
                    <span style={{fontSize:"10px", color:"black", marginLeft:"auto", fontWeight:"700", background:"#f3f3f3", padding:"2px 5px", borderRadius:"4px"}}>{sold} sold</span>
                  </div>
                  <div style={{display:"flex", gap:"5px", alignItems:"center"}}>
                    <b style={{fontSize:"14px", color:"black"}}>₦{Number(p.price).toLocaleString()}</b>
                    <span style={{fontSize:"10px", color:"#999", textDecoration:"line-through"}}>₦{oldPrice.toLocaleString()}</span>
                  </div>
                  <button onClick={()=>addToCart(p)} style={{width:"100%", marginTop:"8px", background:"black", color:"white", border:"none", padding:"9px", borderRadius:"6px", fontWeight:"800", fontSize:"11px"}}>ADD TO CART</button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* COOL FOOTER BACK - BLACK & WHITE ONLY */}
      <footer style={{background:"black", color:"white", marginTop:"30px", padding:"30px 15px 15px"}}>
        <div className="footer-grid" style={{display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:"20px", maxWidth:"1200px", margin:"0 auto"}}>
          <div><h3 style={{fontWeight:900, marginBottom:"10px"}}>SHOPDEX.NG</h3><p style={{fontSize:"12px", color:"#aaa", lineHeight:"1.6"}}>Your No.1 trusted online store in Nigeria. Quality products, fast delivery, pay on delivery in Lagos.</p></div>
          <div><h4 style={{fontWeight:800, fontSize:"13px", marginBottom:"10px"}}>CUSTOMER SERVICE</h4><div style={{fontSize:"12px", color:"#aaa", display:"flex", flexDirection:"column", gap:"6px"}}><span>Contact Us</span><span>Track Order</span><span>Returns & Refunds</span><span>FAQs</span></div></div>
          <div><h4 style={{fontWeight:800, fontSize:"13px", marginBottom:"10px"}}>ABOUT US</h4><div style={{fontSize:"12px", color:"#aaa", display:"flex", flexDirection:"column", gap:"6px"}}><span>About Shopdex</span><span>Terms & Conditions</span><span>Privacy Policy</span><span>Become a Seller</span></div></div>
          <div><h4 style={{fontWeight:800, fontSize:"13px", marginBottom:"10px"}}>CONTACT</h4><div style={{fontSize:"12px", color:"#aaa", display:"flex", flexDirection:"column", gap:"6px"}}><span>📍 Lagos, Nigeria</span><span>📞 +234 9059 791 161</span><span>✉️ agadabest4@gmail.com</span><span style={{marginTop:"8px", background:"white", color:"black", padding:"6px 10px", borderRadius:"6px", fontWeight:"800", width:"fit-content"}}>PAY ON DELIVERY</span></div></div>
        </div>
        <div style={{borderTop:"1px solid #222", marginTop:"25px", paddingTop:"12px", textAlign:"center", fontSize:"11px", color:"#666"}}>© 2026 SHOPDEX.NG - All Rights Reserved. Built with ❤️ in Lagos</div>
      </footer>

      {showCart && (
        <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", zIndex:200, display:"flex", justifyContent:"flex-end"}}>
          <div style={{background:"white", width:"90%", maxWidth:"360px", height:"100%", padding:"15px", overflowY:"auto"}}>
            <div style={{display:"flex", justifyContent:"space-between"}}><h2 style={{fontWeight:900, color:"black"}}>Cart ({cartCount})</h2><button onClick={()=>setShowCart(false)} style={{border:"none", background:"#eee", width:"30px", height:"30px", borderRadius:"50%"}}>✕</button></div>
            {cart.map(c=>(
              <div key={c.id} style={{display:"flex", gap:"10px", margin:"12px 0", borderBottom:"1px solid #eee", paddingBottom:"10px"}}>
                <img src={c.image_url||c.image} style={{width:"50px", height:"50px", objectFit:"cover", borderRadius:"8px"}}/>
                <div style={{flex:1}}><div style={{fontSize:"12px", fontWeight:"600", color:"black"}}>{c.name}</div><div style={{fontWeight:"900", color:"black"}}>₦{c.price}</div>
                <div style={{display:"flex", gap:"8px", marginTop:"4px"}}><button onClick={()=>changeQty(c.id,-1)}>-</button><span>{c.qty}</span><button onClick={()=>changeQty(c.id,1)}>+</button></div></div>
              </div>
            ))}
            <h3 style={{color:"black"}}>Total: ₦{total.toLocaleString()}</h3>
            <a href={`https://wa.me/2349059791761?text=${encodeURIComponent(`Hello SHOPDEX! I want to order:\n${cart.map(c=>`• ${c.name} x${c.qty}`).join("\n")}\nTotal: ₦${total}`)}`} target="_blank" style={{display:"block", background:"black", color:"white", textAlign:"center", padding:"12px", borderRadius:"8px", textDecoration:"none", fontWeight:"900", marginTop:"10px"}}>ORDER ON WHATSAPP</a>
          </div>
        </div>
      )}
    </div>
  );
}

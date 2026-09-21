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
  function changeQty(id,delta){
    setCart(cart.map(c=>c.id===id?{...c,qty:Math.max(1,c.qty+delta)}:c).filter(c=>c.qty>0));
  }
  const total=cart.reduce((s,c)=>s+Number(c.price)*c.qty,0);
  const cartCount=cart.reduce((s,c)=>s+c.qty,0);
  const whatsappText=`Hello SHOPDEX! I want to order:\n\n${cart.map(c=>`• ${c.name} x${c.qty} - ₦${c.price}`).join("\n")}\n\nTotal: ₦${total.toLocaleString()}`;

  return (
    <div style={{background:"#f5f5f5", minHeight:"100vh", color:"#111", fontFamily:"system-ui"}}>
      <style>{`
       .header-top{ display:flex; align-items:center; justify-content:space-between; gap:10px; }
       .search-row{ display:flex; flex:1; max-width:500px; }
       .grid{ display:grid; grid-template-columns:repeat(auto-fill, minmax(160px, 1fr)); gap:12px; }
        @media(max-width:600px){
         .header{ flex-direction:column; align-items:stretch!important; gap:10px!important; }
         .header-top{ width:100%; }
         .search-row{ max-width:100%!important; width:100%; }
         .grid{ grid-template-columns:repeat(2, 1fr)!important; }
         .banner{ flex-direction:column!important; min-height:auto!important; }
         .banner img{ width:100%!important; height:150px!important; }
        }
      `}</style>

      <div className="header" style={{background:"black", padding:"10px 12px", display:"flex", justifyContent:"space-between", alignItems:"center", gap:"15px", position:"sticky", top:0, zIndex:100}}>
        <div className="header-top">
          <h1 style={{fontWeight:900, fontSize:"20px", margin:0, whiteSpace:"nowrap", color:"white"}}>SHOPDEX<span style={{color:"#fbbf24"}}>.NG</span></h1>
          <div style={{display:"flex", gap:"6px"}}>
            <button onClick={()=>setShowCart(true)} style={{background:"#1e293b", color:"white", padding:"7px 12px", borderRadius:"8px", border:"none", fontWeight:"700"}}>🛒 {cartCount>0?`(${cartCount})`:""}</button>
            <a href="/admin" style={{background:"#3b82f6", color:"white", padding:"7px 10px", borderRadius:"8px", textDecoration:"none", fontSize:"12px", fontWeight:"700"}}>ADMIN</a>
          </div>
        </div>
        <div className="search-row">
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products..." style={{flex:1, padding:"10px 12px", borderRadius:"8px 0 0 8px", border:"none", outline:"none"}} />
          <button style={{background:"#f1e3a8a", color:"white", border:"none", padding:"0 16px", borderRadius:"0 8px 8px 0"}}>🔍</button>
        </div>
      </div>

      {/* TOP TRUST BAR */}
      <div style={{background:"#fbbf24", color:"black", textAlign:"center", padding:"6px", fontSize:"12px", fontWeight:"800"}}>🚚 FREE DELIVERY IN LAGOS TODAY + PAY ON DELIVERY!</div>

      {/* CATEGORIES */}
      <div style={{display:"flex", gap:"8px", overflowX:"auto", padding:"12px", background:"white"}}>
        {categories.map(c=>(
          <button key={c} onClick={()=>setActiveCat(c)} style={{padding:"6px 14px", borderRadius:"20px", border:"none", whiteSpace:"nowrap", fontWeight:"700", fontSize:"12px", background:activeCat===c?"black":"#f3f4f6", color:activeCat===c?"white":"#333"}}>{c}</button>
        ))}
      </div>

      {/* PRODUCTS - NEW JUMIA STYLE */}
      <div style={{padding:"12px"}}>
        <div className="grid">
          {filtered.map((p)=>{
            const discount = 45;
            const oldPrice = Math.round(Number(p.price)*1.7);
            const rating = (4.3 + Math.random()*0.6).toFixed(1);
            const sold = Math.floor(80+Math.random()*300);
            return(
              <div key={p.id} style={{background:"white", borderRadius:"12px", overflow:"hidden", position:"relative", border:"1px solid #eee"}}>
                <div style={{position:"absolute", top:"6px", left:"6px", background:"#e11d48", color:"white", fontSize:"11px", fontWeight:"900", padding:"3px 6px", borderRadius:"5px"}}>-{discount}%</div>
                <img src={p.image_url || p.image} style={{width:"100%", height:"150px", objectFit:"cover"}} />
                <div style={{padding:"8px 10px"}}>
                  <div style={{fontSize:"11px", color:"#888"}}>{p.category}</div>
                  <div style={{fontSize:"12px", fontWeight:"600", height:"32px", overflow:"hidden", lineHeight:"1.2"}}>{p.name}</div>
                  <div style={{display:"flex", gap:"4px", alignItems:"center", margin:"4px 0"}}>
                    <span style={{color:"#f59e0b", fontSize:"11px"}}>★ {rating}</span>
                    <span style={{fontSize:"10px", color:"#16a34a", marginLeft:"auto", fontWeight:"700"}}>{sold} sold</span>
                  </div>
                  <div style={{display:"flex", gap:"5px", alignItems:"center"}}>
                    <b style={{fontSize:"14px"}}>₦{Number(p.price).toLocaleString()}</b>
                    <span style={{fontSize:"10px", color:"#999", textDecoration:"line-through"}}>₦{oldPrice.toLocaleString()}</span>
                  </div>
                  <button onClick={()=>addToCart(p)} style={{width:"100%", marginTop:"8px", background:"black", color:"white", border:"none", padding:"8px", borderRadius:"7px", fontWeight:"800", fontSize:"11px"}}>ADD TO CART</button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* CART */}
      {showCart && (
        <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", zIndex:200, display:"flex", justifyContent:"flex-end"}}>
          <div style={{background:"white", width:"90%", maxWidth:"360px", height:"100%", padding:"15px", overflowY:"auto"}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}><h2 style={{fontWeight:900}}>Cart ({cartCount})</h2><button onClick={()=>setShowCart(false)} style={{border:"none", background:"#eee", width:"30px", height:"30px", borderRadius:"50%"}}>✕</button></div>
            {cart.map(c=>(
              <div key={c.id} style={{display:"flex", gap:"10px", margin:"12px 0", borderBottom:"1px solid #eee", paddingBottom:"10px"}}>
                <img src={c.image_url||c.image} style={{width:"50px", height:"50px", objectFit:"cover", borderRadius:"8px"}}/>
                <div style={{flex:1}}><div style={{fontSize:"12px", fontWeight:"600"}}>{c.name}</div><div style={{fontSize:"13px", fontWeight:"900"}}>₦{c.price}</div>
                <div style={{display:"flex", gap:"8px", alignItems:"center", marginTop:"4px"}}><button onClick={()=>changeQty(c.id,-1)} style={{width:"24px"}}>-</button><span>{c.qty}</span><button onClick={()=>changeQty(c.id,1)} style={{width:"24px"}}>+</button></div></div>
              </div>
            ))}
            <h3 style={{marginTop:"15px"}}>Total: ₦{total.toLocaleString()}</h3>
            <a href={`https://wa.me/234000000000?text=${encodeURIComponent(whatsappText)}`} target="_blank" style={{display:"block", background:"#25D366", color:"white", textAlign:"center", padding:"12px", borderRadius:"8px", textDecoration:"none", fontWeight:"900", marginTop:"10px"}}>ORDER ON WHATSAPP</a>
          </div>
        </div>
      )}
    </div>
  );
}

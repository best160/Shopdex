"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function Home() {
  const [products,setProducts]=useState([]); const [search,setSearch]=useState(""); const [selected,setSelected]=useState(null);
  const [cart,setCart]=useState([]); const [showCart,setShowCart]=useState(false); const [activeCat,setActiveCat]=useState("All");
  const categories=["All","Phones","Shoes","Clothes","Electronics","Bags","Watches","General"];

  useEffect(()=>{
    async function get(){ const {data}=await supabase.from("products").select("*").order("id",{ascending:false}); if(data) setProducts(data); }
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
    setShowCart(true);
  }
  function removeFromCart(id){ setCart(cart.filter(c=>c.id!==id)); }
  function changeQty(id,delta){
    setCart(cart.map(c=>{
      if(c.id===id){ const n=c.qty+delta; return n<=0?null:{...c,qty:n}; }
      return c;
    }).filter(Boolean));
  }

  const total=cart.reduce((s,c)=>s+Number(c.price)*c.qty,0);
  const cartCount=cart.reduce((s,c)=>s+c.qty,0);
  const whatsappText=`Hello SHOPDEX! I want to order:\n\n${cart.map(c=>`• ${c.name} x${c.qty} - ₦${(Number(c.price)*c.qty).toLocaleString()}`).join("\n")}\n\nTotal: ₦${total.toLocaleString()}`;

  return (
    <div style={{background:"#020617", minHeight:"100vh", color:"white", fontFamily:"system-ui", display:"flex", flexDirection:"column"}}>
      <style>{`
     .header-top{ display:flex; align-items:center; justify-content:space-between; gap:10px; }
     .search-row{ display:flex; flex:1; max-width:500px; }
     .grid{ display:grid; grid-template-columns:repeat(auto-fill, minmax(160px, 1fr)); gap:1px; background:#1e3a8a33; padding:1px; border-radius:10px; }
        @media(max-width:600px){
       .header{ flex-direction:column; align-items:stretch!important; gap:10px!important; }
       .header-top{ width:100%; }
       .search-row{ max-width:100%!important; width:100%; }
       .grid{ grid-template-columns:repeat(2, 1fr)!important; }
       .banner{ flex-direction:column!important; min-height:auto!important; }
       .banner img{ width:100%!important; height:150px!important; }
        }
      `}</style>

      <div className="header" style={{background:"black", padding:"10px 12px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:"2px solid #1e3a8a", position:"sticky", top:0, zIndex:40, gap:"10px"}}>
        <div className="header-top">
          <h1 style={{fontWeight:900, fontSize:"20px", margin:0, whiteSpace:"nowrap"}}>SHOPDEX<span style={{color:"#3b82f6"}}>★</span></h1>
          <div style={{display:"flex", gap:"6px"}}>
            <button onClick={()=>setShowCart(true)} style={{background:"#1e293b", color:"white", padding:"7px 12px", borderRadius:"6px", border:"1px solid #1e3a8a", fontWeight:"bold", fontSize:"13px"}}>🛒 {cartCount>0&&<span style={{background:"#ef4444", borderRadius:"50%", padding:"2px 6px", fontSize:"10px", marginLeft:"4px"}}>{cartCount}</span>}</button>
            <a href="/admin" style={{background:"#3b82f6", color:"white", padding:"7px 10px", borderRadius:"6px", textDecoration:"none", fontWeight:"bold", fontSize:"12px"}}>Admin</a>
          </div>
        </div>
        <div className="search-row">
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products..." style={{flex:1, padding:"10px", borderRadius:"6px 0 0 6px", border:"none", color:"black", fontSize:"14px"}}/>
          <button style={{background:"#1e3a8a", color:"white", border:"none", padding:"0 16px", borderRadius:"0 6px 6px 0", fontWeight:"bold"}}>Search</button>
        </div>
      </div>

      <div style={{maxWidth:"1200px", margin:"0 auto", padding:"10px", flex:1, width:"100%"}}>
        <div style={{display:"flex", gap:"8px", overflowX:"auto", paddingBottom:"10px", marginBottom:"12px"}}>
          {categories.map(cat=>(
            <button key={cat} onClick={()=>setActiveCat(cat)} style={{whiteSpace:"nowrap", padding:"7px 14px", borderRadius:"20px", border:"1px solid #1e3a8a", background:activeCat===cat?"#1e3a8a":"#1e293b", color:"white", fontWeight:"bold", fontSize:"12px"}}>{cat}</button>
          ))}
        </div>

        <div className="banner" style={{background:"linear-gradient(to right, black, #1e3a8a)", borderRadius:"12px", border:"1px solid #1e3a8a", marginBottom:"12px", display:"flex", alignItems:"center", justifyContent:"space-between", overflow:"hidden", minHeight:"120px"}}>
          <div style={{padding:"16px"}}>
            <h2 style={{fontSize:"22px", fontWeight:900, margin:0}}>⚡ {activeCat==="All"?"FLASH SALES":activeCat.toUpperCase()}</h2>
            <p style={{color:"#93c5fd", margin:"4px 0 0 0", fontSize:"12px"}}>{filtered.length} products</p>
            <p style={{color:"white", background:"#3b82f6", display:"inline-block", padding:"4px 10px", borderRadius:"20px", fontSize:"11px", fontWeight:"bold", marginTop:"8px"}}>Up to 80% OFF</p>
          </div>
          <img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400" style={{width:"45%", height:"120px", objectFit:"cover", opacity:0.9}} alt="banner"/>
        </div>

        <div className="grid">
          {filtered.map(p=>(
            <div key={p.id} style={{background:"#0f172a", padding:"8px"}}>
              <div onClick={()=>setSelected(p)} style={{cursor:"pointer"}}>
                <img src={p.image_url} style={{width:"100%", height:"130px", objectFit:"contain", background:"white", borderRadius:"6px"}} alt={p.name}/>
                <p style={{fontSize:"10px", color:"#60a5fa", margin:"5px 0 2px 0"}}>{p.category||"General"}</p>
                <p style={{fontSize:"12px", height:"30px", overflow:"hidden", margin:0, lineHeight:"15px"}}>{p.name}</p>
                <p style={{fontWeight:"bold", color:"#60a5fa", margin:"4px 0 0 0", fontSize:"13px"}}>₦{Number(p.price).toLocaleString()}</p>
              </div>
              <button onClick={()=>addToCart(p)} style={{width:"100%", background:"#1e3a8a", color:"white", border:"none", padding:"8px", borderRadius:"6px", fontWeight:"bold", marginTop:"8px", fontSize:"12px"}}>ADD TO CART</button>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{background:"black", borderTop:"2px solid #1e3a8a", marginTop:"40px", padding:"30px 15px 15px"}}>
        <div style={{maxWidth:"1200px", margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:"25px"}}>
          <div>
            <h3 style={{fontWeight:900, fontSize:"18px", marginBottom:"10px"}}>SHOPDEX<span style={{color:"#3b82f6"}}>★</span></h3>
            <p style={{color:"#94a3b8", fontSize:"13px", lineHeight:"1.6"}}>About Me: I build fast and affordable online stores with Next.js & Supabase. Based in Port Harcourt, we deliver nationwide. Quality products, fast WhatsApp checkout.</p>
          </div>
          <div>
            <h4 style={{fontWeight:700, marginBottom:"10px", fontSize:"14px"}}>Shop</h4>
            <p style={{color:"#94a3b8", fontSize:"13px", lineHeight:"2"}}>All Products<br/>Phones<br/>Shoes<br/>Clothes<br/>Electronics</p>
          </div>
          <div>
            <h4 style={{fontWeight:700, marginBottom:"10px", fontSize:"14px"}}>Contact Us</h4>
            <p style={{color:"#94a3b8", fontSize:"13px", lineHeight:"2"}}>📧 agadabest4@gmail.com<br/>📞 +234 90 5979 1761<br/>📍 Port Harcourt, Nigeria<br/>🕒 8am - 9pm Daily</p>
          </div>
        </div>
        <div style={{textAlign:"center", color:"#475569", fontSize:"12px", marginTop:"30px", paddingTop:"15px", borderTop:"1px solid #1e293b"}}>
          © 2026 SHOPDEX BEZT2. All Rights Reserved. Built with ❤️ in Nigeria.
        </div>
      </footer>

      {selected && (
        <div onClick={()=>setSelected(null)} style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:100, padding:"15px"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:"#1e293b", maxWidth:"460px", width:"100%", borderRadius:"12px", overflow:"hidden", border:"1px solid #1e3a8a"}}>
            <img src={selected.image_url} style={{width:"100%", height:"280px", objectFit:"contain", background:"white"}} alt={selected.name}/>
            <div style={{padding:"18px"}}>
              <p style={{fontSize:"11px", color:"#60a5fa", margin:0}}>{selected.category}</p>
              <h2 style={{margin:"4px 0 8px 0", fontSize:"18px"}}>{selected.name}</h2>
              <p style={{fontSize:"20px", fontWeight:"bold", color:"#60a5fa", margin:"0 0 10px 0"}}>₦{Number(selected.price).toLocaleString()}</p>
              <div style={{background:"#020617", padding:"10px", borderRadius:"8px", color:"#cbd5e1", fontSize:"13px", lineHeight:"1.5", whiteSpace:"pre-wrap"}}>{selected.description||"No description"}</div>
              <div style={{display:"flex", gap:"8px", marginTop:"12px"}}>
                <button onClick={()=>{addToCart(selected); setSelected(null);}} style={{flex:1, background:"#1e3a8a", color:"white", border:"none", padding:"12px", borderRadius:"8px", fontWeight:"bold"}}>ADD TO CART</button>
                <button onClick={()=>setSelected(null)} style={{background:"#334155", color:"white", border:"none", padding:"12px 16px", borderRadius:"8px", fontWeight:"bold"}}>CLOSE</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showCart && (
        <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:110, display:"flex", justifyContent:"flex-end"}}>
          <div style={{background:"#0f172a", width:"100%", maxWidth:"380px", height:"100%", display:"flex", flexDirection:"column", borderLeft:"1px solid #1e3a8a"}}>
            <div style={{padding:"18px", background:"black", borderBottom:"1px solid #1e3a8a", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
              <h3 style={{margin:0, fontWeight:900}}>🛒 CART ({cartCount})</h3>
              <button onClick={()=>setShowCart(false)} style={{background:"#1e293b", color:"white", border:"1px solid #1e3a8a", padding:"6px 12px", borderRadius:"6px"}}>X</button>
            </div>
            <div style={{flex:1, overflowY:"auto", padding:"15px"}}>
              {cart.length===0? <p style={{textAlign:"center", color:"#64748b", marginTop:"40px"}}>Cart empty.<br/>Add products!</p> : cart.map(c=>(
                <div key={c.id} style={{display:"flex", gap:"10px", background:"#1e293b", padding:"10px", borderRadius:"8px", marginBottom:"10px"}}>
                  <img src={c.image_url} style={{width:"55px", height:"55px", objectFit:"contain", background:"white", borderRadius:"5px"}} alt={c.name}/>
                  <div style={{flex:1}}>
                    <p style={{fontSize:"12px", margin:"0 0 3px 0", height:"16px", overflow:"hidden"}}>{c.name}</p>
                    <p style={{fontSize:"13px", fontWeight:"bold", color:"#60a5fa", margin:0}}>₦{Number(c.price).toLocaleString()}</p>
                    <div style={{display:"flex", gap:"8px", marginTop:"6px", alignItems:"center"}}>
                      <button onClick={()=>changeQty(c.id,-1)} style={{background:"#020617", color:"white", border:"1px solid #1e3a8a", width:"24px", height:"24px", borderRadius:"4px"}}>-</button>
                      <span style={{fontSize:"13px", fontWeight:"bold"}}>{c.qty}</span>
                      <button onClick={()=>changeQty(c.id,1)} style={{background:"#020617", color:"white", border:"1px solid #1e3a8a", width:"24px", height:"24px", borderRadius:"4px"}}>+</button>
                      <button onClick={()=>removeFromCart(c.id)} style={{marginLeft:"auto", background:"#7f1d1d", color:"white", border:"none", padding:"3px 8px", borderRadius:"4px", fontSize:"10px"}}>Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {cart.length>0 && (
              <div style={{padding:"15px", background:"#1e293b", borderTop:"1px solid #1e3a8a"}}>
                <div style={{display:"flex", justifyContent:"space-between", fontWeight:"bold", fontSize:"18px", marginBottom:"12px"}}>
                  <span>Total:</span><span style={{color:"#60a5fa"}}>₦{total.toLocaleString()}</span>
                </div>
                <a href={`https://wa.me/2349059791761? text=${encodeURIComponent(whatsappText)}`} target="_blank" style={{display:"block", background:"#22c55e", color:"white", textAlign:"center", padding:"14px", borderRadius:"8px", textDecoration:"none", fontWeight:900}}>CHECKOUT ON WHATSAPP</a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
    }

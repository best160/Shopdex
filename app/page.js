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
    get(); const saved=localStorage.getItem("shopdex_cart"); if(saved) setCart(JSON.parse(saved));
  },[]);
  useEffect(()=>{ localStorage.setItem("shopdex_cart", JSON.stringify(cart)); },[cart]);

  const filtered = products.filter(p=>{
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCat==="All" || p.category===activeCat;
    return matchSearch && matchCat;
  });

  function addToCart(p){
    const exist=cart.find(c=>c.id===p.id);
    if(exist) setCart(cart.map(c=>c.id===p.id?{...c, qty:c.qty+1}:c));
    else setCart([...cart,{...p, qty:1}]);
    setShowCart(true);
  }
  function removeFromCart(id){ setCart(cart.filter(c=>c.id!==id)); }
  function changeQty(id, delta){
    setCart(cart.map(c=>{
      if(c.id===id){ const newQty=c.qty+delta; return newQty<=0?null:{...c, qty:newQty}; }
      return c;
    }).filter(Boolean));
  }
  const total = cart.reduce((sum,c)=>sum + Number(c.price)*c.qty, 0);
  const cartCount = cart.reduce((sum,c)=>sum+c.qty,0);
  const whatsappText = `Hello SHOPDEX! I want to order:\n\n${cart.map(c=>`• ${c.name} x${c.qty} - ₦${(Number(c.price)*c.qty).toLocaleString()}`).join("\n")}\n\nTotal: ₦${total.toLocaleString()}`;

  return (
    <div style={{background:"#020617", minHeight:"100vh", color:"white", fontFamily:"system-ui"}}>
      <div style={{background:"black", color:"white", padding:"12px 15px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:"2px solid #1e3a8a", position:"sticky", top:0, zIndex:40}}>
        <h1 style={{fontWeight:900, fontSize:"20px", margin:0}}>SHOPDEX<span style={{color:"#3b82f6"}}>★</span></h1>
        <div style={{display:"flex", flex:1, maxWidth:"450px", margin:"0 12px"}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." style={{flex:1, padding:"9px", borderRadius:"6px 0 0 6px", border:"none", color:"black"}}/>
          <button style={{background:"#1e3a8a", color:"white", border:"none", padding:"0 15px", borderRadius:"0 6px 6px 0", fontWeight:"bold"}}>Search</button>
        </div>
        <div style={{display:"flex", gap:"8px"}}>
          <button onClick={()=>setShowCart(true)} style={{background:"#1e293b", color:"white", padding:"8px 14px", borderRadius:"6px", border:"1px solid #1e3a8a", fontWeight:"bold", position:"relative"}}>🛒 Cart {cartCount>0 && <span style={{background:"#ef4444", color:"white", borderRadius:"50%", padding:"2px 6px", fontSize:"11px", marginLeft:"5px"}}>{cartCount}</span>}</button>
          <a href="/admin" style={{background:"#3b82f6", color:"white", padding:"8px 12px", borderRadius:"6px", textDecoration:"none", fontWeight:"bold", fontSize:"13px"}}>Admin</a>
        </div>
      </div>

      <div style={{maxWidth:"1200px", margin:"0 auto", padding:"15px"}}>
        <div style={{display:"flex", gap:"8px", overflowX:"auto", paddingBottom:"10px", marginBottom:"15px"}}>
          {categories.map(cat=>(
            <button key={cat} onClick={()=>setActiveCat(cat)} style={{whiteSpace:"nowrap", padding:"8px 16px", borderRadius:"20px", border:"1px solid #1e3a8a", background: activeCat===cat? "#1e3a8a" : "#1e293b", color:"white", fontWeight:"bold", fontSize:"13px"}}>{cat}</button>
          ))}
        </div>

          <div style={{background:"linear-gradient(to right, black, #1e3a8a)", padding:"0", borderRadius:"12px", border:"1px solid #1e3a8a", marginBottom:"15px", display:"flex", alignItems:"center", justifyContent:"space-between", overflow:"hidden", minHeight:"140px"}}>
            <div style={{padding:"20px"}}>
            <h2 style={{fontSize:"28px", fontWeight:900, margin:0}}>⚡ {activeCat==="All"? "FLASH SALES" : activeCat.toUpperCase()}</h2>
            <p style={{color:"#93c5fd", margin:"5px 0 0 0", fontSize:"13px"}}>{filtered.length} products • Tap to view description</p>
            <p style={{color:"white", background:"#3b82f6", display:"inline-block", padding:"5px 12px", borderRadius:"20px", fontSize:"12px", fontWeight:"bold", marginTop:"10px"}}>Up to 80% OFF</p>
          </div>
          <img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400" style={{width:"55%", height:"140px", objectFit:"cover", opacity:0.9}} alt="banner" />
        </div>
          <h2 style={{fontSize:"28px", fontWeight:900, margin:0}}>⚡ {activeCat==="All"? "FLASH SALES" : activeCat.toUpperCase()}</h2>
          <p style={{color:"#93c5fd", margin:"5px 0 0 0", fontSize:"13px"}}>{filtered.length} products • Tap to view description</p>
        </div>

        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(160px, 1fr))", gap:"1px", background:"#1e3a8a33", padding:"1px", borderRadius:"10px"}}>
          {filtered.map(p=>(
            <div key={p.id} style={{background:"#0f172a", padding:"10px"}}>
              <div onClick={()=>setSelected(p)} style={{cursor:"pointer"}}>
                <img src={p.image_url} style={{width:"100%", height:"140px", objectFit:"contain", background:"white", borderRadius:"6px"}}/>
                <p style={{fontSize:"11px", color:"#60a5fa", margin:"6px 0 2px 0"}}>{p.category || "General"}</p>
                <p style={{fontSize:"13px", height:"32px", overflow:"hidden", margin:"0"}}>{p.name}</p>
                <p style={{fontWeight:"bold", color:"#60a5fa", margin:"4px 0 0 0", fontSize:"14px"}}>₦{Number(p.price).toLocaleString()}</p>
              </div>
              <button onClick={()=>addToCart(p)} style={{width:"100%", background:"#1e3a8a", color:"white", border:"none", padding:"8px", borderRadius:"6px", fontWeight:"bold", marginTop:"8px", fontSize:"12px"}}>ADD TO CART</button>
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div onClick={()=>setSelected(null)} style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:100, padding:"15px"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:"#1e293b", maxWidth:"460px", width:"100%", borderRadius:"12px", overflow:"hidden", border:"1px solid #1e3a8a"}}>
            <img src={selected.image_url} style={{width:"100%", height:"280px", objectFit:"contain", background:"white"}}/>
            <div style={{padding:"18px"}}>
              <p style={{fontSize:"11px", color:"#60a5fa", margin:0}}>{selected.category}</p>
              <h2 style={{margin:"4px 0 8px 0", fontSize:"18px"}}>{selected.name}</h2>
              <p style={{fontSize:"20px", fontWeight:"bold", color:"#60a5fa", margin:"0 0 10px 0"}}>₦{Number(selected.price).toLocaleString()}</p>
              <div style={{background:"#020617", padding:"10px", borderRadius:"8px", color:"#cbd5e1", fontSize:"13px", lineHeight:"1.5", whiteSpace:"pre-wrap"}}>{selected.description || "No description"}</div>
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
              {cart.length===0? <p style={{textAlign:"center", color:"#64748b", marginTop:"40px"}}>Cart empty.<br/>Add products!</p> :
                cart.map(c=>(
                  <div key={c.id} style={{display:"flex", gap:"10px", background:"#1e293b", padding:"10px", borderRadius:"8px", marginBottom:"10px", border:"1px solid #1e3a8a33"}}>
                    <img src={c.image_url} style={{width:"55px", height:"55px", objectFit:"contain", background:"white", borderRadius:"5px"}}/>
                    <div style={{flex:1}}>
                      <p style={{fontSize:"12px", margin:"0 0 3px 0", height:"16px", overflow:"hidden"}}>{c.name}</p>
                      <p style={{fontSize:"13px", fontWeight:"bold", color:"#60a5fa", margin:0}}>₦{Number(c.price).toLocaleString()}</p>
                      <div style={{display:"flex", gap:"8px", marginTop:"6px", alignItems:"center"}}>
                        <button onClick={()=>changeQty(c.id, -1)} style={{background:"#020617", color:"white", border:"1px solid #1e3a8a", width:"24px", height:"24px", borderRadius:"4px"}}>-</button>
                        <span style={{fontSize:"13px", fontWeight:"bold"}}>{c.qty}</span>
                        <button onClick={()=>changeQty(c.id, 1)} style={{background:"#020617", color:"white", border:"1px solid #1e3a8a", width:"24px", height:"24px", borderRadius:"4px"}}>+</button>
                        <button onClick={()=>removeFromCart(c.id)} style={{marginLeft:"auto", background:"#7f1d1d", color:"white", border:"none", padding:"3px 8px", borderRadius:"4px", fontSize:"10px"}}>Remove</button>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
            {cart.length>0 && (
              <div style={{padding:"15px", background:"#1e293b", borderTop:"1px solid #1e3a8a"}}>
                <div style={{display:"flex", justifyContent:"space-between", fontWeight:"bold", fontSize:"18px", marginBottom:"12px"}}><span>Total:</span><span style={{color:"#60a5fa"}}>₦{total.toLocaleString()}</span></div>
                <a href={`https://wa.me/2349059791761?text=${encodeURIComponent(whatsappText)}`} target="_blank" style={{display:"block", background:"#22c55e", color:"white", textAlign:"center", padding:"14px", borderRadius:"8px", textDecoration:"none", fontWeight:"900"}}>CHECKOUT ON WHATSAPP</a>
                <button onClick={()=>{setCart([]); setShowCart(false);}} style={{width:"100%", marginTop:"8px", background:"transparent", color:"#64748b", border:"1px solid #334155", padding:"10px", borderRadius:"8px", fontSize:"12px"}}>Clear Cart</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

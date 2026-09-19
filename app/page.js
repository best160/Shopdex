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
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    async function get() {
      const { data } = await supabase.from("products").select("*").order("id",{ascending:false});
      if (data) setProducts(data);
    }
    get();
  }, []);

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="header">
        <h1 style={{fontWeight:900, fontSize:"22px", margin:0}}>SHOPDEX<span style={{color:"#3b82f6"}}>★</span></h1>
        <div style={{display:"flex", flex:1, maxWidth:"500px", margin:"0 20px"}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products..." style={{flex:1, borderRadius:"5px 0 0 5px", color:"black"}} />
          <button style={{background:"#1e3a8a", color:"white", border:"none", padding:"0 20px", borderRadius:"0 5px 5px 0", fontWeight:"bold"}}>Search</button>
        </div>
        <a href="/admin" style={{background:"#3b82f6", color:"white", padding:"8px 15px", borderRadius:"5px", textDecoration:"none", fontWeight:"bold"}}>Admin</a>
      </div>

      <div style={{maxWidth:"1200px", margin:"0 auto", padding:"0 15px"}}>
        <div className="banner">
          <h2 style={{fontSize:"36px", fontWeight:900, margin:0}}>⚡ FLASH SALES</h2>
          <p>Tap any product to see description</p>
        </div>

        <div style={{background:"#1e293b", padding:"15px", borderRadius:"10px 10px 0 0", border:"1px solid #1e3a8a33", borderBottom:"none", fontWeight:"bold", color:"#60a5fa"}}>
          ⚡ Flash Sales ({filtered.length} products)
        </div>

        <div className="grid">
          {filtered.map(p => (
            <div key={p.id} className="card" style={{background:"#0f172a", cursor:"pointer"}} onClick={()=>setSelected(p)}>
              <img src={p.image_url} style={{width:"100%", height:"150px", objectFit:"contain", background:"white", borderRadius:"5px"}} />
              <p style={{fontSize:"14px", height:"36px", overflow:"hidden", margin:"10px 0 5px 0"}}>{p.name}</p>
              <p style={{fontWeight:"bold", color:"#60a5fa"}}>₦{Number(p.price).toLocaleString()}</p>
              <div className="btn" style={{textAlign:"center"}}>VIEW DETAILS</div>
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div onClick={()=>setSelected(null)} style={{position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.85)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:100, padding:"20px"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:"#1e293b", maxWidth:"500px", width:"100%", borderRadius:"12px", overflow:"hidden", border:"1px solid #1e3a8a"}}>
            <img src={selected.image_url} style={{width:"100%", height:"300px", objectFit:"contain", background:"white"}} />
            <div style={{padding:"20px"}}>
              <h2 style={{margin:"0 0 10px 0"}}>{selected.name}</h2>
              <p style={{fontSize:"24px", fontWeight:"bold", color:"#60a5fa", margin:"0 0 15px 0"}}>₦{Number(selected.price).toLocaleString()}</p>
              <div style={{color:"#cbd5e1", lineHeight:"1.6", fontSize:"14px", background:"#0f172a", padding:"12px", borderRadius:"8px", minHeight:"60px", whiteSpace:"pre-wrap"}}>
                {selected.description || "No description yet. Add one from Admin!"}
              </div>
              <div style={{display:"flex", gap:"10px", marginTop:"15px"}}>
                <a href={`https://wa.me/2349034567890?text=Hi, I want ${selected.name} - ${selected.description || ''}`} target="_blank" style={{flex:1, background:"#1e3a8a", color:"white", textAlign:"center", padding:"12px", borderRadius:"8px", textDecoration:"none", fontWeight:"bold"}}>ORDER ON WHATSAPP</a>
                <button onClick={()=>setSelected(null)} style={{background:"#334155", color:"white", border:"none", padding:"12px 20px", borderRadius:"8px", fontWeight:"bold"}}>CLOSE</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

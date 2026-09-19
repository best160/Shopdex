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
    <div style={{background:"#020617", minHeight:"100vh", color:"white"}}>
      <div style={{background:"black", color:"white", padding:"15px 20px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:"2px solid #1e3a8a", position:"sticky", top:0, zIndex:50}}>
        <h1 style={{fontWeight:900, fontSize:"22px", margin:0}}>SHOPDEX<span style={{color:"#3b82f6"}}>★</span></h1>
        <div style={{display:"flex", flex:1, maxWidth:"500px", margin:"0 20px"}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products..." style={{flex:1, padding:"10px", borderRadius:"6px 0 0 6px", border:"none", color:"black"}} />
          <button style={{background:"#1e3a8a", color:"white", border:"none", padding:"0 20px", borderRadius:"0 6px 6px 0", fontWeight:"bold"}}>Search</button>
        </div>
        <a href="/admin" style={{background:"#3b82f6", color:"white", padding:"8px 15px", borderRadius:"6px", textDecoration:"none", fontWeight:"bold"}}>Admin</a>
      </div>

      <div style={{maxWidth:"1200px", margin:"0 auto", padding:"20px"}}>
        <div style={{background:"linear-gradient(to right, black, #1e3a8a)", padding:"30px", borderRadius:"12px", border:"1px solid #1e3a8a", marginBottom:"20px"}}>
          <h2 style={{fontSize:"36px", fontWeight:900, margin:0}}>⚡ FLASH SALES</h2>
          <p style={{color:"#93c5fd", margin:"5px 0 0 0"}}>Tap any product to see description</p>
        </div>

        <div style={{background:"#1e293b", padding:"15px", borderRadius:"10px 10px 0 0", border:"1px solid #1e3a8a33", borderBottom:"none", fontWeight:"bold", color:"#60a5fa"}}>
          ⚡ Flash Sales ({filtered.length} products)
        </div>

        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(170px, 1fr))", gap:"1px", background:"#1e3a8a33", padding:"1px", borderRadius:"0 0 10px 10px"}}>
          {filtered.map(p => (
            <div key={p.id} onClick={()=>setSelected(p)} style={{background:"#0f172a", padding:"12px", cursor:"pointer"}}>
              <img src={p.image_url} style={{width:"100%", height:"150px", objectFit:"contain", background:"white", borderRadius:"6px"}} />
              <p style={{fontSize:"14px", height:"36px", overflow:"hidden", margin:"10px 0 5px 0"}}>{p.name}</p>
              <p style={{fontWeight:"bold", color:"#60a5fa", margin:"0"}}>₦{Number(p.price).toLocaleString()}</p>
              <div style={{background:"#1e3a8a", color:"white", padding:"9px", borderRadius:"6px", textAlign:"center", fontWeight:"bold", marginTop:"8px", fontSize:"12px"}}>VIEW DETAILS</div>
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div onClick={()=>setSelected(null)} style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:100, padding:"20px"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:"#1e293b", maxWidth:"480px", width:"100%", borderRadius:"12px", overflow:"hidden", border:"1px solid #1e3a8a"}}>
            <img src={selected.image_url} style={{width:"100%", height:"300px", objectFit:"contain", background:"white"}} />
            <div style={{padding:"20px"}}>
              <h2 style={{margin:"0 0 8px 0"}}>{selected.name}</h2>
              <p style={{fontSize:"22px", fontWeight:"bold", color:"#60a5fa", margin:"0 0 12px 0"}}>₦{Number(selected.price).toLocaleString()}</p>
              <div style={{background:"#020617", padding:"12px", borderRadius:"8px", color:"#cbd5e1", fontSize:"14px", lineHeight:"1.6", whiteSpace:"pre-wrap", maxHeight:"150px", overflowY:"auto"}}>
                {selected.description || "No description yet."}
              </div>
              <div style={{display:"flex", gap:"10px", marginTop:"15px"}}>
                <a href={`https://wa.me/2349059791761?text=Hi, I want ${selected.name}`} target="_blank" style={{flex:1, background:"#1e3a8a", color:"white", textAlign:"center", padding:"12px", borderRadius:"8px", textDecoration:"none", fontWeight:"bold"}}>ORDER WHATSAPP</a>
                <button onClick={()=>setSelected(null)} style={{background:"#334155", color:"white", border:"none", padding:"12px 18px", borderRadius:"8px", fontWeight:"bold"}}>CLOSE</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

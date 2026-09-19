"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function Admin() {
  const [password,setPassword]=useState(""); const [isLogged,setIsLogged]=useState(false);
  const [products,setProducts]=useState([]); const [name,setName]=useState(""); const [price,setPrice]=useState("");
  const [image,setImage]=useState(""); const [description,setDescription]=useState(""); const [category,setCategory]=useState("Phones");
  const categories = ["Phones","Shoes","Clothes","Electronics","Bags","Watches","General"];

  useEffect(()=>{ if(isLogged) getProducts(); },[isLogged]);
  async function getProducts(){ const {data}=await supabase.from("products").select("*").order("id",{ascending:false}); if(data) setProducts(data); }
  function login(){ if(password==="best1234##") setIsLogged(true); else alert("Wrong password!, try again"); }
  async function addProduct(){
    if(!name||!price||!image) return alert("Fill fields");
    const {error}=await supabase.from("products").insert([{name, price:Number(price), image_url:image, description, category}]);
    if(!error){ alert("Added! 🔥"); setName(""); setPrice(""); setImage(""); setDescription(""); getProducts(); } else alert(error.message);
  }
  async function deleteProduct(id){ if(!confirm("Delete?")) return; await supabase.from("products").delete().eq("id",id); getProducts(); }

  if(!isLogged) return (
    <div style={{minHeight:"100vh", background:"#020617", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"system-ui"}}>
      <div style={{background:"#1e293b", padding:"30px", borderRadius:"12px", border:"1px solid #1e3a8a", width:"90%", maxWidth:"350px"}}>
        <h2 style={{color:"white", fontWeight:900}}>SHOPDEX<span style={{color:"#3b82f6"}}>★</span> ADMIN</h2>
        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" style={{width:"100%", padding:"12px", borderRadius:"8px", background:"#0f172a", border:"1px solid #1e3a8a", color:"white", marginTop:"20px", boxSizing:"border-box"}}/>
        <button onClick={login} style={{width:"100%", marginTop:"15px", background:"#1e3a8a", color:"white", border:"none", padding:"12px", borderRadius:"8px", fontWeight:"bold"}}>LOGIN</button>
      </div>
    </div>
  );

  return (
    <div style={{minHeight:"100vh", background:"#020617", color:"white", fontFamily:"system-ui", padding:"20px"}}>
      <div style={{maxWidth:"1000px", margin:"0 auto"}}>
        <div style={{display:"flex", justifyContent:"space-between", background:"black", padding:"15px 20px", borderRadius:"10px", border:"1px solid #1e3a8a", marginBottom:"20px"}}>
          <h1 style={{margin:0, fontWeight:900}}>ADMIN <span style={{color:"#3b82f6"}}>• {products.length}</span></h1>
          <a href="/" style={{background:"#1e293b", color:"white", padding:"8px 15px", borderRadius:"6px", textDecoration:"none", border:"1px solid #1e3a8a"}}>View Shop</a>
        </div>
        <div style={{background:"#1e293b", padding:"20px", borderRadius:"10px", border:"1px solid #1e3a8a", marginBottom:"20px"}}>
          <h3 style={{marginTop:0, color:"#60a5fa"}}>+ Add Product</h3>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"10px"}}>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" style={{padding:"12px", borderRadius:"6px", background:"#0f172a", border:"1px solid #1e3a8a", color:"white"}}/>
            <input value={price} onChange={e=>setPrice(e.target.value)} type="number" placeholder="Price" style={{padding:"12px", borderRadius:"6px", background:"#0f172a", border:"1px solid #1e3a8a", color:"white"}}/>
            <select value={category} onChange={e=>setCategory(e.target.value)} style={{padding:"12px", borderRadius:"6px", background:"#0f172a", border:"1px solid #1e3a8a", color:"white"}}>
              {categories.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <input value={image} onChange={e=>setImage(e.target.value)} placeholder="Image URL" style={{width:"100%", marginTop:"10px", padding:"12px", borderRadius:"6px", background:"#0f172a", border:"1px solid #1e3a8a", color:"white", boxSizing:"border-box"}}/>
          <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Description" style={{width:"100%", marginTop:"10px", padding:"12px", borderRadius:"6px", background:"#0f172a", border:"1px solid #1e3a8a", color:"white", minHeight:"70px", boxSizing:"border-box"}}/>
          <button onClick={addProduct} style={{width:"100%", marginTop:"10px", background:"#1e3a8a", color:"white", border:"none", padding:"12px", borderRadius:"6px", fontWeight:"bold"}}>ADD PRODUCT</button>
        </div>
        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(180px, 1fr))", gap:"10px"}}>
          {products.map(p=>(
            <div key={p.id} style={{background:"#1e293b", padding:"12px", borderRadius:"8px", border:"1px solid #1e3a8a33"}}>
              <img src={p.image_url} style={{width:"100%", height:"110px", objectFit:"contain", background:"white", borderRadius:"5px"}}/>
              <p style={{fontSize:"12px", color:"#3b82f6", margin:"5px 0 0 0"}}>{p.category}</p>
              <p style={{fontSize:"13px", margin:"4px 0"}}>{p.name}</p>
              <p style={{fontWeight:"bold", color:"#60a5fa"}}>₦{Number(p.price).toLocaleString()}</p>
              <button onClick={()=>deleteProduct(p.id)} style={{width:"100%", marginTop:"6px", background:"#7f1d1d", color:"white", border:"none", padding:"6px", borderRadius:"5px", fontSize:"11px"}}>DELETE</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

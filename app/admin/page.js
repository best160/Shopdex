"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Admin() {
  const [isAuth, setIsAuth] = useState(false);
  const [passInput, setPassInput] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("Phones");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const categories = ["Phones","Shoes","Clothes","Electronics","Bags","Watches","General"];

  // CHANGE YOUR PASSWORD HERE
  const ADMIN_PASSWORD = "maventer123";

  useEffect(()=>{
    const savedAuth = localStorage.getItem("shopdex_admin_auth");
    if(savedAuth === "true") setIsAuth(true);
    fetchProds();
  },[]);

  async function fetchProds(){
    const {data} = await supabase.from("products").select("*").order("id",{ascending:false});
    if(data) setProducts(data);
  }

  function handleLogin(e){
    e.preventDefault();
    if(passInput === ADMIN_PASSWORD){
      setIsAuth(true);
      localStorage.setItem("shopdex_admin_auth","true");
    } else {
      alert("Wrong Password! ❌ I know you tried the default password bro 😂");
    }
  }

  function handleLogout(){
    setIsAuth(false);
    localStorage.removeItem("shopdex_admin_auth");
  }

  async function addProduct(e){
    e.preventDefault();
    if(!name || !price || !image) return alert("Fill Name, Price, Image");
    setLoading(true);
    const {error} = await supabase.from("products").insert([{name, price, image_url:image, description:desc, category}]);
    setLoading(false);
    if(error) alert(error.message);
    else { alert("Product Added! ✅"); setName(""); setPrice(""); setImage(""); setDesc(""); fetchProds(); }
  }

  async function deleteProd(id){
    if(!confirm("Delete this product?")) return;
    await supabase.from("products").delete().eq("id", id);
    fetchProds();
  }

  if(!isAuth){
    return (
      <div style={{background:"#020617", minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"15px", fontFamily:"system-ui"}}>
        <form onSubmit={handleLogin} style={{background:"#1e293b", padding:"25px", borderRadius:"12px", border:"1px solid #1e3a8a", width:"100%", maxWidth:"360px"}}>
          <h2 style={{textAlign:"center", margin:"0 0 5px 0", fontWeight:900}}>SHOPDEX ADMIN</h2>
          <p style={{textAlign:"center", color:"#64748b", fontSize:"12px", margin:"0 0 20px 0"}}>Enter password to access</p>
          <input value={passInput} onChange={e=>setPassInput(e.target.value)} type="password" placeholder="Admin Password" style={{width:"100%", padding:"14px", borderRadius:"8px", border:"1px solid #334155", background:"#0f172a", color:"white", marginBottom:"12px", fontSize:"14px", boxSizing:"border-box"}}/>
          <button type="submit" style={{width:"100%", background:"#1e3a8a", color:"white", border:"none", padding:"14px", borderRadius:"8px", fontWeight:900, fontSize:"15px"}}>UNLOCK 🔓</button>
          <a href="/" style={{display:"block", textAlign:"center", marginTop:"15px", color:"#64748b", textDecoration:"none", fontSize:"12px"}}>← Back to Shop</a>
          <p style={{textAlign:"center", color:"#334155", fontSize:"10px", marginTop:"15px"}}>Default: shopdex123</p>
        </form>
      </div>
    );
  }

  return (
    <div style={{background:"#020617", minHeight:"100vh", color:"white", padding:"10px", fontFamily:"system-ui"}}>
      <style>{`
        .form-grid{ display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; }
        .admin-wrap{ max-width:700px; margin:0 auto; }
        @media(max-width:600px){
          .form-grid{ grid-template-columns:1fr!important; }
          .top-bar{ flex-direction:column!important; gap:10px!important; }
          .top-bar h1{ font-size:20px!important; }
        }
      `}</style>
      <div className="admin-wrap">
        <div className="top-bar" style={{display:"flex", justifyContent:"space-between", alignItems:"center", background:"black", padding:"14px", borderRadius:"10px", border:"1px solid #1e3a8a", marginBottom:"15px"}}>
          <h1 style={{margin:0, fontWeight:900, fontSize:"22px"}}>SHOPDEX Admin</h1>
          <div style={{display:"flex", gap:"8px"}}>
            <a href="/" style={{background:"#1e293b", color:"white", padding:"8px 14px", borderRadius:"6px", textDecoration:"none", border:"1px solid #1e3a8a", fontWeight:"bold", fontSize:"13px"}}>View Shop</a>
            <button onClick={handleLogout} style={{background:"#7f1d1d", color:"white", padding:"8px 14px", borderRadius:"6px", border:"none", fontWeight:"bold", fontSize:"13px"}}>Logout</button>
          </div>
        </div>

        <form onSubmit={addProduct} style={{background:"#1e293b", padding:"15px", borderRadius:"12px", border:"1px solid #1e3a8a"}}>
          <h3 style={{margin:"0 0 12px 0", fontSize:"16px"}}>Add New Product</h3>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Product Name e.g iPhone 14" style={{width:"100%", padding:"12px", borderRadius:"8px", border:"1px solid #334155", background:"#0f172a", color:"white", marginBottom:"10px", fontSize:"14px", boxSizing:"border-box"}}/>
          <div className="form-grid" style={{marginBottom:"10px"}}>
            <input value={price} onChange={e=>setPrice(e.target.value)} placeholder="Price e.g 250000" type="number" style={{padding:"12px", borderRadius:"8px", border:"1px solid #334155", background:"#0f172a", color:"white", fontSize:"14px", width:"100%", boxSizing:"border-box"}}/>
            <select value={category} onChange={e=>setCategory(e.target.value)} style={{padding:"12px", borderRadius:"8px", border:"1px solid #334155", background:"#0f172a", color:"white", fontSize:"14px", width:"100%", boxSizing:"border-box"}}>
              {categories.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
            <div style={{background:"#0f172a", padding:"8px", borderRadius:"8px", border:"1px solid #334155", fontSize:"11px", color:"#93c5fd", display:"flex", alignItems:"center"}}>Category: {category}</div>
          </div>
          <input value={image} onChange={e=>setImage(e.target.value)} placeholder="Image URL (copy image address)" style={{width:"100%", padding:"12px", borderRadius:"8px", border:"1px solid #334155", background:"#0f172a", color:"white", marginBottom:"10px", fontSize:"14px", boxSizing:"border-box"}}/>
          <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Description... (Features, Warranty, Delivery)" rows={4} style={{width:"100%", padding:"12px", borderRadius:"8px", border:"1px solid #334155", background:"#0f172a", color:"white", marginBottom:"12px", fontSize:"14px", boxSizing:"border-box", resize:"vertical"}}/>
          <button type="submit" disabled={loading} style={{width:"100%", background:"#1e3a8a", color:"white", border:"none", padding:"14px", borderRadius:"8px", fontWeight:900, fontSize:"15px"}}>{loading?"Adding...":"ADD PRODUCT"}</button>
        </form>

        <div style={{marginTop:"20px"}}>
          <h3 style={{fontSize:"16px", marginBottom:"10px"}}>All Products ({products.length})</h3>
          <div style={{display:"grid", gap:"8px"}}>
            {products.map(p=>(
              <div key={p.id} style={{background:"#1e293b", padding:"10px", borderRadius:"8px", display:"flex", gap:"10px", alignItems:"center", border:"1px solid #1e3a8a33"}}>
                <img src={p.image_url} style={{width:"50px", height:"50px", objectFit:"contain", background:"white", borderRadius:"6px"}} alt={p.name}/>
                <div style={{flex:1, minWidth:0}}>
                  <p style={{margin:0, fontSize:"13px", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>{p.name}</p>
                  <p style={{margin:"2px 0 0 0", fontSize:"11px", color:"#60a5fa"}}>{p.category} • ₦{Number(p.price).toLocaleString()}</p>
                </div>
                <button onClick={()=>deleteProd(p.id)} style={{background:"#7f1d1d", color:"white", border:"none", padding:"7px 10px", borderRadius:"6px", fontSize:"11px", fontWeight:"bold"}}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

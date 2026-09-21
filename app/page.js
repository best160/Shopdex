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
  const cats=["All","Phones","Shoes","Clothes","Electronics","Bags","Watches"];

  useEffect(()=>{
    supabase.from("products").select("*").then(({data})=>{if(data)setProducts(data)});
    const s=localStorage.getItem("shopdex_cart"); if(s)setCart(JSON.parse(s));
  },[]);
  useEffect(()=>{localStorage.setItem("shopdex_cart",JSON.stringify(cart))},[cart]);

  const filtered=products.filter(p=>{
    const a=p.name.toLowerCase().includes(search.toLowerCase());
    const b=activeCat==="All"||p.category===activeCat;
    return a&&b;
  });

  function addToCart(p){
    const ex=cart.find(c=>c.id===p.id);
    if(ex)setCart(cart.map(c=>c.id===p.id?{...c,qty:c.qty+1}:c));
    else setCart([...cart,{...p,qty:1}]);
  }
  function changeQty(id,d){setCart(prev=>prev.map(c=>c.id===id?{...c,qty:c.qty+d}:c).filter(c=>c.qty>0))}
  function removeItem(id){setCart(prev=>prev.filter(c=>c.id!==id))}

  const total=cart.reduce((s,c)=>s+Number(c.price)*c.qty,0);
  const count=cart.reduce((s,c)=>s+c.qty,0);

  return(
    <div style={{background:"#f5f5f5",minHeight:"100vh"}}>
      <style>{`.grid{display:grid;grid-template-columns:repeat(6,1fr);gap:12px}@media(max-width:600px){.grid{grid-template-columns:repeat(2,1fr)!important}}`}</style>

      <div style={{background:"black",padding:"10px 12px",display:"flex",justifyContent:"space-between",alignItems:"center",gap:"10px",position:"sticky",top:0,zIndex:100}}>
        <h1 style={{color:"white",fontWeight:900,margin:0,fontSize:"18px"}}>SHOPDEX.NG</h1>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." style={{flex:1,padding:"9px",borderRadius:"8px",border:"none",maxWidth:"400px"}}/>
        <button onClick={()=>setShowCart(true)} style={{background:"#222",color:"white",border:"1px solid #333",padding:"8px 12px",borderRadius:"8px",fontWeight:800}}>🛒{count?`(${count})`:""}</button>
      </div>

      <div style={{background:"black",color:"white",textAlign:"center",padding:"6px",fontSize:"11px",fontWeight:700}}>FREE DELIVERY IN LAGOS TODAY</div>

      <div style={{display:"flex",gap:"8px",overflowX:"auto",padding:"10px",background:"white"}}>
        {cats.map(c=><button key={c} onClick={()=>setActiveCat(c)} style={{padding:"6px 12px",borderRadius:"20px",border:"1px solid #ddd",fontSize:"12px",fontWeight:700,background:activeCat===c?"black":"white",color:activeCat===c?"white":"#333"}}>{c}</button>)}
      </div>

      <div style={{padding:"12px",maxWidth:"1400px",margin:"0 auto"}}>
        <div className="grid">
          {filtered.map(p=>{
            const old=Math.round(Number(p.price)*1.7);
            return(
              <div key={p.id} style={{background:"white",borderRadius:"10px",overflow:"hidden",border:"1px solid #e5e5e5"}}>
                <img src={p.image_url||p.image} style={{width:"100%",height:"150px",objectFit:"cover"}}/>
                <div style={{padding:"8px"}}>
                  <div style={{fontSize:"11px",fontWeight:600,height:"32px",overflow:"hidden"}}>{p.name}</div>
                  <div style={{display:"flex",gap:"5px",alignItems:"center",marginTop:"4px"}}><b>₦{Number(p.price).toLocaleString()}</b><span style={{fontSize:"10px",color:"#999",textDecoration:"line-through"}}>₦{old.toLocaleString()}</span></div>
                  <button onClick={()=>addToCart(p)} style={{width:"100%",marginTop:"8px",background:"black",color:"white",border:"none",padding:"8px",borderRadius:"6px",fontWeight:800,fontSize:"11px"}}>ADD TO CART</button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <footer style={{background:"black",color:"white",padding:"20px",marginTop:"30px",textAlign:"center",fontSize:"11px"}}>© 2026 SHOPDEX.NG - Lagos</footer>

      {showCart&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:200,display:"flex",justifyContent:"flex-end"}}>
          <div style={{background:"white",width:"92%",maxWidth:"380px",height:"100%",display:"flex",flexDirection:"column"}}>
            <div style={{padding:"16px",background:"black",color:"white",display:"flex",justifyContent:"space-between"}}>
              <b>CART ({count})</b><button onClick={()=>setShowCart(false)} style={{background:"white",border:"none",borderRadius:"50%",width:"28px",height:"28px",fontWeight:900}}>X</button>
            </div>
            <div style={{flex:1,overflowY:"auto",padding:"10px"}}>
              {cart.length===0?<div style={{textAlign:"center",padding:"40px"}}>🛒 Empty</div>:cart.map(c=>(
                <div key={c.id} style={{display:"flex",gap:"10px",border:"1px solid #eee",borderRadius:"8px",padding:"8px",marginBottom:"8px",position:"relative"}}>
                  <img src={c.image_url||c.image} style={{width:"60px",height:"60px",objectFit:"cover",borderRadius:"6px"}}/>
                  <div style={{flex:1}}><div style={{fontSize:"12px",fontWeight:600,paddingRight:"20px"}}>{c.name}</div><div style={{fontWeight:900}}>₦{Number(c.price).toLocaleString()}</div>
                  <div style={{display:"flex",gap:"6px",marginTop:"4px"}}><button onClick={()=>changeQty(c.id,-1)} style={{width:"24px",height:"24px"}}>-</button><span style={{fontWeight:800}}>{c.qty}</span><button onClick={()=>changeQty(c.id,1)} style={{width:"24px",height:"24px",background:"black",color:"white"}}>+</button></div></div>
                  <button onClick={()=>removeItem(c.id)} style={{position:"absolute",top:"6px",right:"6px",border:"none",background:"#f5f5f5",width:"22px",height:"22px",borderRadius:"50%"}}>🗑️</button>
                </div>
              ))}
            </div>
            {cart.length>0&&(
              <div style={{padding:"12px",borderTop:"1px solid #eee"}}>
                <div style={{display:"flex",justifyContent:"space-between",fontWeight:900,marginBottom:"10px"}}><span>Total</span><span>₦{total.toLocaleString()}</span></div>
                <a href={`https://wa.me/2349059791761?text=${encodeURIComponent(`Order:\n${cart.map(c=>`${c.name} x${c.qty}`).join("\n")}\nTotal: ₦${total}`)}`} target="_blank" style={{display:"block",background:"black",color:"white",textAlign:"center",padding:"12px",borderRadius:"8px",textDecoration:"none",fontWeight:900}}>ORDER WHATSAPP</a>
                <button onClick={()=>setCart([])} style={{width:"100%",marginTop:"8px",padding:"8px",borderRadius:"8px",border:"1px solid #ddd",background:"white"}}>CLEAR CART</button>
              </div>
            )}
          </div>
        </div>
      )}

      <a href="https://wa.me/2349059791761" target="_blank" style={{position:"fixed",bottom:"20px",right:"15px",background:"#25D366",width:"54px",height:"54px",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"26px",textDecoration:"none"}}>💬</a>
    </div>
  )
}

'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Home(){
  const [products,setProducts]=useState([])
  useEffect(()=>{ fetchProducts() },[])
  async function fetchProducts(){
    const {data}=await supabase.from('products').select('*').order('created_at',{ascending:false})
    setProducts(data||[])
  }
  const orderOnWhatsApp = (p) => {
    const msg = `Hello ShopDex, I want to order: ${p.name} - ₦${p.price}`
    window.open(`https://wa.me/234YOURNUMBER?text=${encodeURIComponent(msg)}`,'_blank')
  }
  return (
    <div>
      <div className="header"><h2>ShopDex</h2><a href="/admin" style={{color:'white'}}>Admin</a></div>
      <div className="grid">
        {products.map(p=>(
          <div key={p.id} className="card">
            <img src={p.image_url} style={{width:'100%',height:'150px',objectFit:'cover',borderRadius:'5px'}} />
            <h4 style={{margin:'8px 0 4px'}}>{p.name}</h4>
            <p style={{color:'#f68b1e',fontWeight:'bold'}}>₦{p.price.toLocaleString()}</p>
            <button className="btn" onClick={()=>orderOnWhatsApp(p)}>Order via WhatsApp</button>
          </div>
        ))}
      </div>
    </div>
  )
}

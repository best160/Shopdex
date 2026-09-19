'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function Admin(){
  const [isLogin,setIsLogin]=useState(false)
  const [pass,setPass]=useState('')
  const [form,setForm]=useState({name:'',price:'',image_url:'',description:''})
  const [products,setProducts]=useState([])

  useEffect(()=>{ if(isLogin) fetchProducts() },[isLogin])
  async function fetchProducts(){
    const {data}=await supabase.from('products').select('*').order('created_at',{ascending:false})
    setProducts(data||[])
  }
  const handleLogin=()=>{ if(pass==='best1234##'){setIsLogin(true)}else{alert('Wrong password')}}
  const handleUpload=async(e)=>{
    e.preventDefault()
    const {error}=await supabase.from('products').insert([{...form,price:parseInt(form.price)}])
    if(!error){alert('Product Added!'); setForm({name:'',price:'',image_url:'',description:''}); fetchProducts()}
  }
  const handleDelete=async(id)=>{
    await supabase.from('products').delete().eq('id',id); fetchProducts()
  }

  if(!isLogin) return (
    <div style={{maxWidth:'400px',margin:'100px auto',background:'white',padding:'20px',borderRadius:'8px'}}>
      <h2>ShopDex Admin Login</h2>
      <input type="password" placeholder="Password: input admin pass" value={pass} onChange={e=>setPass(e.target.value)} style={{width:'100%',padding:'10px',margin:'10px 0'}}/>
      <button className="btn" onClick={handleLogin}>Login</button>
    </div>
  )
  return (
    <div style={{maxWidth:'800px',margin:'20px auto',padding:'15px'}}>
      <h1>ShopDex Admin Dashboard</h1>
      <div style={{background:'white',padding:'15px',borderRadius:'8px',marginBottom:'20px'}}>
        <h3>Add New Product</h3>
        <form onSubmit={handleUpload} style={{display:'flex',flexDirection:'column',gap:'10px'}}>
          <input required placeholder="Product Name e.g iPhone 13" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} style={{padding:'10px'}}/>
          <input required type="number" placeholder="Price e.g 250000" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} style={{padding:'10px'}}/>
          <input required placeholder="Image URL - paste from google or imgbb.com" value={form.image_url} onChange={e=>setForm({...form,image_url:e.target.value})} style={{padding:'10px'}}/>
          <textarea placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} style={{padding:'10px'}}/>
          <button className="btn" type="submit">Upload Product</button>
        </form>
      </div>
      <h3>All Products ({products.length})</h3>
      {products.map(p=>(
        <div key={p.id} style={{background:'white',padding:'10px',margin:'5px 0',display:'flex',justifyContent:'space-between'}}>
          <span>{p.name} - ₦{p.price}</span><button onClick={()=>handleDelete(p.id)} style={{background:'red',color:'white',border:'none',padding:'5px 10px',borderRadius:'4px'}}>Delete</button>
        </div>
      ))}
    </div>
  )
}

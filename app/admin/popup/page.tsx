"use client";
import { useState, useEffect } from "react";

export default function PopupAdmin(){
  const [form,setForm]=useState({title:"",subtitle:"",code:"",buttonText:"",active:true})
  useEffect(()=>{
    const saved=localStorage.getItem("shopdex_popup")
    if(saved) setForm(JSON.parse(saved))
  },[])
  const save=()=>{
    localStorage.setItem("shopdex_popup", JSON.stringify(form))
    alert("✅ Popup Updated! Go check homepage in private tab")
  }
  return(
    <div style={{maxWidth:'500px', margin:'30px auto', padding:'20px'}}>
      <h1 style={{fontSize:'24px', fontWeight:'900', marginBottom:'20px'}}>🎛️ Control Popup - SHOPDEX</h1>
      <label>Title</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} style={{width:'100%', padding:'10px', margin:'8px 0 15px', border:'1px solid #ddd', borderRadius:'8px'}} />
      <label>Subtitle</label><input value={form.subtitle} onChange={e=>setForm({...form,subtitle:e.target.value})} style={{width:'100%', padding:'10px', margin:'8px 0 15px', border:'1px solid #ddd', borderRadius:'8px'}} />
      <label>Coupon Code</label><input value={form.code} onChange={e=>setForm({...form,code:e.target.value})} style={{width:'100%', padding:'10px', margin:'8px 0 15px', border:'1px solid #ddd', borderRadius:'8px'}} />
      <label>Button Text</label><input value={form.buttonText} onChange={e=>setForm({...form,buttonText:e.target.value})} style={{width:'100%', padding:'10px', margin:'8px 0 15px', border:'1px solid #ddd', borderRadius:'8px'}} />
      <label><input type="checkbox" checked={form.active} onChange={e=>setForm({...form,active:e.target.checked})} /> Active (show popup?)</label>
      <button onClick={save} style={{width:'100%', background:'black', color:'white', padding:'14px', borderRadius:'10px', marginTop:'20px', fontWeight:'bold'}}>SAVE POPUP SETTINGS</button>
    </div>
  )
}

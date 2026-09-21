"use client";
import { useState, useEffect } from "react";

export default function PromoPopup() {
  const [settings, setSettings] = useState({
    title: "GET 50% OFF TODAY ONLY!",
    subtitle: "Best deals in Nigeria - Don't miss out!",
    code: "BEZT50",
    buttonText: "SHOP NOW & SAVE 50%",
    active: true
  });
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Load from Admin saved settings
    const saved = localStorage.getItem("shopdex_popup");
    if (saved) {
      setSettings(JSON.parse(saved));
    }
    const t = setTimeout(() => {
      const currentSaved = localStorage.getItem("shopdex_popup");
      const isActive = currentSaved ? JSON.parse(currentSaved).active : true;
      if(isActive) setShow(true);
    }, 1500);
    return () => clearTimeout(t);
  }, []);

  if (!show || !settings.active) return null;

  return (
    // KEEP YOUR VIBRANT STYLE HERE - just replace text with:
    // {settings.title}, {settings.subtitle}, {settings.code}, {settings.buttonText}
    <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:99999, padding:'15px'}}>
      <div style={{background:'white', borderRadius:'24px', maxWidth:'380px', width:'90%', padding:'28px 22px', textAlign:'center', position:'relative', boxShadow:'0 25px 50px rgba(0,0,0,0.3), 0 0 0 4px #fbbf24', border:'2px solid #f59e0b'}}>
        <button onClick={()=>setShow(false)} style={{position:'absolute', top:'12px', right:'12px', width:'32px', height:'32px', borderRadius:'50%', background:'#f3f4f6', border:'none', cursor:'pointer'}}>✕</button>
        <div style={{background:'linear-gradient(135deg, #f59e0b, #ef4444)', width:'70px', height:'70px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', fontSize:'36px'}}>🔥</div>
        <div style={{background:'#fef3c7', color:'#92400e', display:'inline-block', padding:'4px 12px', borderRadius:'20px', fontSize:'12px', fontWeight:'800', marginBottom:'12px'}}>LIMITED TIME OFFER</div>
        <h2 style={{fontSize:'28px', fontWeight:'900', marginBottom:'10px'}}>{settings.title}</h2>
        <p style={{color:'#6b7280', fontSize:'14px', marginBottom:'16px'}}>{settings.subtitle}</p>
        <div style={{background:'black', color:'white', borderRadius:'12px', padding:'12px', marginBottom:'18px'}}>
          <span style={{fontSize:'12px', opacity:0.7}}>USE CODE: </span>
          <span style={{background:'white', color:'black', padding:'4px 12px', borderRadius:'6px', fontWeight:'900'}}>{settings.code}</span>
        </div>
        <button onClick={()=>setShow(false)} style={{width:'100%', background:'black', color:'white', padding:'14px', borderRadius:'50px', fontWeight:'900', border:'none', cursor:'pointer'}}>{settings.buttonText} 🛒</button>
      </div>
    </div>
  );
}

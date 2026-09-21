"use client";
import { useState, useEffect } from "react";

export default function PromoPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 2000);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.7)', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      zIndex: 99999, padding: '20px'
    }}>
      <div style={{
        background: 'white', borderRadius: '20px', maxWidth: '350px',
        width: '100%', padding: '30px', textAlign: 'center', position: 'relative'
      }}>
        <button onClick={() => setShow(false)} style={{position:'absolute', top:'10px', right:'15px', fontSize:'20px', border:'none', background:'none', cursor:'pointer'}}>✕</button>
        <div style={{fontSize:'50px', marginBottom:'10px'}}>🔥</div>
        <h2 style={{fontSize:'24px', fontWeight:'900', marginBottom:'10px'}}>GET 50% OFF TODAY!</h2>
        <p style={{marginBottom:'15px'}}>Use code <b style={{background:'#fef08a', padding:'4px 8px', borderRadius:'5px'}}>BEZT50</b> at checkout!</p>
        <button onClick={() => setShow(false)} style={{width:'100%', background:'black', color:'white', padding:'12px', borderRadius:'30px', fontWeight:'bold', border:'none', cursor:'pointer'}}>
          SHOP NOW - 50% OFF
        </button>
      </div>
    </div>
  );
}

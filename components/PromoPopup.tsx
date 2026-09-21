"use client";
import { useState, useEffect } from "react";

export default function PromoPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Clear any bad saved data wey dey cause blank
    localStorage.removeItem("shopdex_popup");
    const t = setTimeout(() => setShow(true), 1500);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed', inset: '0px',
      background: 'rgba(0,0,0,0.8)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 99999, padding: '15px'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '24px', maxWidth: '380px', width: '90%',
        padding: '28px 22px', textAlign: 'center', position: 'relative',
        border: '4px solid #fbbf24',
        boxShadow: '0 25px 50px rgba(0,0,0,0.4)'
      }}>
        <button onClick={() => setShow(false)} style={{
          position:'absolute', top:'12px', right:'12px', 
          width:'32px', height:'32px', borderRadius:'50%',
          background:'#f3f4f6', border:'none', fontSize:'18px', 
          cursor:'pointer', fontWeight:'bold', color:'#000'
        }}>✕</button>
        
        <div style={{
          background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
          width:'70px', height:'70px', borderRadius:'50%',
          display:'flex', alignItems:'center', justifyContent:'center',
          margin:'0 auto 16px', fontSize:'36px'
        }}>🔥</div>

        <div style={{
          background:'#fef3c7', color:'#92400e', display:'inline-block',
          padding:'4px 12px', borderRadius:'20px', fontSize:'12px',
          fontWeight:'800', letterSpacing:'1px', marginBottom:'12px'
        }}>LIMITED TIME OFFER</div>

        <h2 style={{
          fontSize:'28px', fontWeight:'900', lineHeight:'1.1',
          marginBottom:'10px', color:'#000000'
        }}>GET 50% OFF<br/>TODAY ONLY!</h2>
        
        <p style={{color:'#4b5563', fontSize:'14px', marginBottom:'16px', fontWeight:'500'}}>
          Best deals in Nigeria - Don't miss out!
        </p>

        <div style={{
          background:'#000000', color:'#ffffff', borderRadius:'12px',
          padding:'12px', marginBottom:'18px', display:'flex',
          alignItems:'center', justifyContent:'center', gap:'8px'
        }}>
          <span style={{fontSize:'12px'}}>USE CODE:</span>
          <span style={{
            background:'#ffffff', color:'#000000', padding:'4px 12px',
            borderRadius:'6px', fontWeight:'900', letterSpacing:'2px'
          }}>BEZT50</span>
        </div>

        <button onClick={() => setShow(false)} style={{
          width:'100%', 
          background:'#000000',
          color:'#ffffff', padding:'14px', borderRadius:'50px',
          fontWeight:'900', fontSize:'15px', border:'none',
          cursor:'pointer'
        }}>
          SHOP NOW & SAVE 50% 🛒
        </button>

        <p style={{fontSize:'11px', color:'#6b7280', marginTop:'12px'}}>
          *Valid for next 24 hours only
        </p>
      </div>
    </div>
  );
}

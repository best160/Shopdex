"use client";
import { useEffect, useState } from "react";

export default function PromoPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 2000);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center relative">
        <button onClick={() => setShow(false)} className="absolute top-3 right-3 text-xl">✕</button>
        <div className="text-5xl mb-2">🔥</div>
        <h2 className="text-2xl font-black">GET 50% OFF TODAY!</h2>
        <p className="my-3">Use code <b className="bg-yellow-200 px-2 rounded">BEZT50</b></p>
        <button onClick={() => setShow(false)} className="w-full bg-black text-white py-3 rounded-full font-bold">SHOP NOW</button>
      </div>
    </div>
  );
}

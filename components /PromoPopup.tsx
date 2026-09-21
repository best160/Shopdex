"use client";
import { useEffect, useState } from "react";

export default function PromoPopup() {
  const [show, setShow] = useState(false);
  const [promo, setPromo] = useState<any>(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("shopdex_promo") || "null");
    // Default promo if admin never set
    const defaultPromo = { enabled: true, title: "GET 50% OFF TODAY!", discount: 50, code: "BEZT50", image: "🔥" };
    const finalPromo = saved || defaultPromo;
    setPromo(finalPromo);

    if (finalPromo.enabled) {
      setTimeout(() => setShow(true), 2000); // pop after 2 sec every visit
    }
  }, []);

  if (!show ||!promo) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center relative animate-bounce-in">
        <button onClick={() => setShow(false)} className="absolute top-3 right-3 text-xl">✕</button>
        <div className="text-5xl mb-3">{promo.image}</div>
        <h2 className="text-2xl font-black mb-2">{promo.title}</h2>
        <p className="mb-4">Use code <span className="font-bold bg-yellow-200 px-2 py-1 rounded">{promo.code}</span> at checkout!</p>
        <button onClick={() => setShow(false)} className="w-full bg-black text-white py-3 rounded-full font-bold">
          SHOP NOW - {promo.discount}% OFF
        </button>
      </div>
    </div>
  );
}

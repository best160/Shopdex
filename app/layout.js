import PromoPopup from "../components/PromoPopup"
import './globals.css'
export const metadata = { title: 'ShopDex - Best Deals in Nigeria', description: 'ShopDex Online Store' }
export default function RootLayout({ children }) {
  return (
    <html lang="en"><body><PromoPopup />{children}</body></html>
  )
}

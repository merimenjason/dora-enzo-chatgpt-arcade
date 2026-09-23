import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:"Dora & Enzo's Arcade",description:'Fifteen browser games starring Dora and Enzo the chinchillas, from the original Snack Heist through 3D adventures, action, racing, soccer, fighting, stealth, survival and cozy mountain games.'};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body>{children}</body></html>}

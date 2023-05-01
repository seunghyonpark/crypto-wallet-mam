'use client';

import './globals.css';
///import { Bebas_Neue } from '@next/font/google';
import { Inter } from '@next/font/google';

//import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";

//import { MetamaskProvider } from "../hooks/useMetamask";



/*
import RootProvider from "./providers";
*/


///const activeChainId = ChainId.BinanceSmartChainTestnet;

//////const activeChainId = 4002;

/*
const BebasNeue = Bebas_Neue({
  subsets: ['latin'],
  variable: '--font-bebasNeue',
  weight: "400",
});
*/

const BebasNeue = Inter({
  subsets: ['latin'],
  variable: '--font-bebasNeue',
  weight: "400",
});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (

      <html lang="en">
        <head />
        <body className={`${BebasNeue.className}`} >
          
          {/*
          <RootProvider>
  */}


            {children}



{/*
          </RootProvider>
*/}

        </body>
      </html>

   

  )
}

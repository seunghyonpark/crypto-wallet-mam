import Chat from "@/components/layout/chat"
import Footer from "@/components/layout/footer"
import Navbar from "@/components/layout/navbar"

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {

    return (
        <html lang="en" data-theme='light'>
            <head />
            <body>
                <header>
                    <Navbar />
                </header>
                <div className="bg-[#1f2029] relative font-bebasNeue">

{/*
                    <Chat />
    */}
                    <div className="w-full h-full min-h-[75vh]">
                        {children}
                    </div>
                    <footer>
                        <Footer />
                    </footer>
                </div>
            </body>
        </html>
    )
}

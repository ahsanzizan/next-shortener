import "@/styles/globals.css"
import { Bebas_Neue } from "next/font/google";
import Footer from "@/components/Footer";

const bebasNeue = Bebas_Neue({
    subsets: ['latin'],
    weight: '400',
    variable: '--font-bebas-neue',
});

export const metadata = {
    title: 'URL Shortener',
    description: "Ahsan's Personal URL Shortener",
}

const RootLayout = ({ children }) => (
    (
        <html lang='en' className="scroll-smooth selection:bg-gray-500 selection:text-white">
            <head> 
                <link href="https://fonts.cdnfonts.com/css/sequel" rel="stylesheet" />
            </head>
            <body className={`${bebasNeue.variable}`}>
                {children}
                <Footer />
            </body>
        </html>
));

export default RootLayout;
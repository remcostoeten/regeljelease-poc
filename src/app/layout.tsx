import type { Metadata } from "next";
import { Gochi_Hand, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

const gochiHand = Gochi_Hand({
    variable: "--font-gochi-hand",
    subsets: ["latin"],
    weight: "400",
});

export const metadata: Metadata = {
    title: "Regeljelease.nl",
    description: "De lease van je voertuig binnen 15 minuten geregeld.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
            <html
                lang="nl"
                className={`${inter.variable} ${gochiHand.variable} h-full antialiased`}
            >
            <body className="min-h-full flex flex-col">
                {children}
            </body>
        </html>
    );
}


import type { Metadata } from "next";
import { Gochi_Hand, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { DevWidget } from "@remcostoeten/dev-widget/client";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

const gochiHand = Gochi_Hand({
    variable: "--font-gochi-hand",
    subsets: ["latin"],
    weight: "400",
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
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
                className={`${inter.variable} ${gochiHand.variable} ${geistMono.variable} h-full antialiased`}
            >
            <body className="min-h-full flex flex-col">
                {children}
                <DevWidget />
            </body>
        </html>
    );
}

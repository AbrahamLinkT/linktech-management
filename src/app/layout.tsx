import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import GlobalWrapper from "@/components/GlobalWrapper";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider>
            <html lang="es" suppressHydrationWarning>
                <body>
                    <GlobalWrapper>
                        {children}
                    </GlobalWrapper>
                </body>
            </html>
        </ClerkProvider>
    );
}

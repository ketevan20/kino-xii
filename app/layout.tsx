import "./globals.css";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { Archivo } from 'next/font/google'
import { getFilterOptions } from "@/lib/api/filterOptions";
import { FilterOptionsProvider } from "@/providers/FilterOptionsProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import AuthModals from "@/components/modals/AuthModals";

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '600', '800'],
  variable: '--font-archivo',
})


export default async function RootLayout({ children }: LayoutProps<"/">) {
  const filterOptions = await getFilterOptions();
  return (
    <html
      lang="en"
      className={`${archivo.variable} h-full antialiased`}
    >
      <body className="flex min-h-screen flex-col bg-page">
        <FilterOptionsProvider value={filterOptions}>
          <AuthProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <AuthModals />
          </AuthProvider>
        </FilterOptionsProvider>
      </body>
    </html>
  );
}

import ContactFooter from "@/components/contact-footer";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

export default function PublicPagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1">{children}</div>
      <ContactFooter />
      <Footer />
    </div>
  );
}

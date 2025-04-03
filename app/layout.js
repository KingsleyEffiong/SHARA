import "../styles/global.css";
import ThreeDBackground from "@/components/Background";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Share File",
  description: "A share file platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="top-0 left-0 w-full h-full bg-[#091919] px-6">
        {/* 3D Background */}
        <Navbar />
        <div className="absolute inset-0 pointer-events-none">
          <ThreeDBackground />
        </div>

        {/* Page Content */}
        {children}
      </body>
    </html>
  );
}

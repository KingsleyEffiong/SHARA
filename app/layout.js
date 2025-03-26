import "../styles/global.css";
import ThreeDBackground from "@/components/Background";

export const metadata = {
  title: "Share File",
  description: "A share file platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="fixed top-0 left-0 w-full h-full bg-[#091919]">
        {/* 3D Background */}
        <div className="absolute inset-0 pointer-events-none">
          <ThreeDBackground />
        </div>

        {/* Page Content */}
        <div className="flex items-center justify-center w-full h-full">
          {children}
        </div>
      </body>
    </html>
  );
}

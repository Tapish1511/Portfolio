import "./globals.css"

import RootServerComponent from "@/UI/Contexts/RootServerContext";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <RootServerComponent>
          {children}
        </RootServerComponent>
        <div id="PortalElements" className="fixed top-0 left-0"></div>
      </body>
    </html>
  );
}

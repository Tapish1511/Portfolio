import BaseContext from "@/UI/Contexts/RootContext";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <BaseContext>
          {children}
        </BaseContext>
      </body>
    </html>
  );
}

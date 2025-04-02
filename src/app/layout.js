import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-amber-50 m-0">{children}</body>
    </html>
  )
}

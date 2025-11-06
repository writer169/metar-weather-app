import './globals.css'

export const metadata = {
  title: 'METAR Weather Dashboard',
  description: 'Отображение авиационной погоды в реальном времени',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}
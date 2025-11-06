import './globals.css';

export const metadata = {
  title: 'METAR Viewer',
  description: 'Просмотр метео-сводок METAR для аэродромов ICAO',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 text-gray-800">
        <header className="bg-white/20 backdrop-blur-md shadow-md p-4 text-center">
          <h1 className="text-3xl font-bold text-white tracking-wide drop-shadow-lg">
            METAR Viewer
          </h1>
          <p className="text-white/80 text-sm mt-1">
            Актуальная погода по ICAO коду аэродрома
          </p>
        </header>

        <main className="pt-6 pb-12">{children}</main>

        <footer className="text-center text-white/70 text-sm py-4">
          © {new Date().getFullYear()} METAR Viewer | Powered by aviationweather.gov
        </footer>
      </body>
    </html>
  );
}
'use client';

import React, { useState, useEffect } from 'react';
import { Cloud, Wind, Eye, Thermometer, Gauge, CloudRain, AlertCircle, RefreshCw } from 'lucide-react';

export default function Home() {
  const [metarData, setMetarData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [icaoCode, setIcaoCode] = useState('UAAA');

  const fetchMetar = async (code) => {
    setLoading(true);
    setError(null);
    try {
      // ✅ теперь запрос идёт через твой backend (без CORS)
      const response = await fetch(`/api/metar?icao=${code}`);
      if (!response.ok) throw new Error('Не удалось получить данные');
      const data = await response.json();
      if (data && data.length > 0) {
        setMetarData(data[0]);
      } else {
        throw new Error('Данные не найдены');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetar(icaoCode);
  }, []);

  const getFlightCategoryColor = (cat) => {
    const colors = {
      VFR: 'bg-green-500',
      MVFR: 'bg-blue-500',
      IFR: 'bg-red-500',
      LIFR: 'bg-purple-500'
    };
    return colors[cat] || 'bg-gray-500';
  };

  const getCloudCoverText = (cover) => {
    const covers = {
      SKC: 'Ясно',
      CLR: 'Чисто',
      FEW: 'Малооблачно',
      SCT: 'Рассеянная',
      BKN: 'Облачно',
      OVC: 'Сплошная облачность'
    };
    return covers[cover] || cover;
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  const handleSearch = () => {
    if (icaoCode.trim()) fetchMetar(icaoCode.toUpperCase());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center p-4">
        <div className="text-white text-center">
          <RefreshCw className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p className="text-xl">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">Ошибка</h2>
          <p className="text-gray-600 text-center mb-4">{error}</p>
          <button
            onClick={() => fetchMetar(icaoCode)}
            className="w-full bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 p-4 pb-8">
      <div className="max-w-2xl mx-auto">
        {/* Поиск */}
        <div className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={icaoCode}
              onChange={(e) => setIcaoCode(e.target.value)}
              placeholder="Введите ICAO код"
              className="flex-1 px-4 py-3 rounded-xl text-lg font-semibold bg-white/90 backdrop-blur shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
              maxLength="4"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-white/90 backdrop-blur rounded-xl shadow-lg hover:bg-white transition"
            >
              <RefreshCw className="w-6 h-6 text-blue-600" />
            </button>
          </div>
        </div>

        {/* Дальше остаётся весь твой UI без изменений */}
        {/* ... */}
      </div>
    </div>
  );
}
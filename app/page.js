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
      const response = await fetch(`https://aviationweather.gov/api/data/metar?ids=${code}&format=json`);
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

  const handleSearch = (e) => {
    if (icaoCode.trim()) {
      fetchMetar(icaoCode.toUpperCase());
    }
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
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
            />
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-white/90 backdrop-blur rounded-xl shadow-lg hover:bg-white transition"
            >
              <RefreshCw className="w-6 h-6 text-blue-600" />
            </button>
          </div>
        </div>

        {/* Заголовок */}
        <div className="bg-white/90 backdrop-blur rounded-3xl p-6 mb-4 shadow-2xl">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{metarData.name}</h1>
              <p className="text-gray-600 text-lg">{metarData.icaoId}</p>
            </div>
            <span className={`${getFlightCategoryColor(metarData.fltCat)} text-white px-4 py-2 rounded-xl font-bold text-sm`}>
              {metarData.fltCat}
            </span>
          </div>
          <p className="text-gray-500 text-sm">Обновлено: {formatTime(metarData.obsTime)}</p>
        </div>

        {/* Температура */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white/90 backdrop-blur rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center mb-2">
              <Thermometer className="w-6 h-6 text-red-500 mr-2" />
              <span className="text-gray-600 font-semibold">Температура</span>
            </div>
            <p className="text-4xl font-bold text-gray-800">{metarData.temp}°C</p>
          </div>
          <div className="bg-white/90 backdrop-blur rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center mb-2">
              <CloudRain className="w-6 h-6 text-blue-500 mr-2" />
              <span className="text-gray-600 font-semibold">Точка росы</span>
            </div>
            <p className="text-4xl font-bold text-gray-800">{metarData.dewp}°C</p>
          </div>
        </div>

        {/* Ветер */}
        <div className="bg-white/90 backdrop-blur rounded-3xl p-6 mb-4 shadow-2xl">
          <div className="flex items-center mb-4">
            <Wind className="w-6 h-6 text-cyan-500 mr-2" />
            <span className="text-gray-700 font-bold text-xl">Ветер</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 text-sm mb-1">Направление</p>
              <p className="text-3xl font-bold text-gray-800">{metarData.wdir}°</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Скорость</p>
              <p className="text-3xl font-bold text-gray-800">{metarData.wspd} м/с</p>
            </div>
          </div>
        </div>

        {/* Видимость и давление */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white/90 backdrop-blur rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center mb-2">
              <Eye className="w-6 h-6 text-purple-500 mr-2" />
              <span className="text-gray-600 font-semibold text-sm">Видимость</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{metarData.visib} км</p>
          </div>
          <div className="bg-white/90 backdrop-blur rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center mb-2">
              <Gauge className="w-6 h-6 text-orange-500 mr-2" />
              <span className="text-gray-600 font-semibold text-sm">Давление</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{metarData.altim} гПа</p>
          </div>
        </div>

        {/* Облачность */}
        <div className="bg-white/90 backdrop-blur rounded-3xl p-6 mb-4 shadow-2xl">
          <div className="flex items-center mb-4">
            <Cloud className="w-6 h-6 text-gray-500 mr-2" />
            <span className="text-gray-700 font-bold text-xl">Облачность</span>
          </div>
          {metarData.clouds && metarData.clouds.length > 0 ? (
            <div className="space-y-3">
              {metarData.clouds.map((cloud, idx) => (
                <div key={idx} className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                  <span className="font-semibold text-gray-700">{getCloudCoverText(cloud.cover)}</span>
                  <span className="text-gray-600">{cloud.base} фт</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Нет данных об облачности</p>
          )}
        </div>

        {/* Raw METAR */}
        <div className="bg-white/90 backdrop-blur rounded-3xl p-6 shadow-2xl">
          <h3 className="text-gray-700 font-bold mb-3 text-lg">METAR (исходный)</h3>
          <p className="text-gray-600 font-mono text-sm break-all leading-relaxed">{metarData.rawOb}</p>
        </div>
      </div>
    </div>
  );
}
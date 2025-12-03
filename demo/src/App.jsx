import { useState, useEffect } from 'react';
import Statistics from './pages/Statistics';
import Slots from './pages/Slots';
import Profile from './pages/Profile';

function App() {
  const [currentPage, setCurrentPage] = useState('slots');

  useEffect(() => {
    // Initialize Telegram WebApp
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();

      // Set theme colors
      document.documentElement.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color || '#ffffff');
      document.documentElement.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color || '#000000');
    }
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'statistics':
        return <Statistics />;
      case 'slots':
        return <Slots />;
      case 'profile':
        return <Profile />;
      default:
        return <Slots />;
    }
  };

  return (
    <div className="app">
      <div className="content">
        {renderPage()}
      </div>

      <nav className="bottom-nav">
        <button
          className={`nav-item ${currentPage === 'statistics' ? 'active' : ''}`}
          onClick={() => setCurrentPage('statistics')}
        >
          <svg fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
          </svg>
          <span>Статистика</span>
        </button>

        <button
          className={`nav-item ${currentPage === 'slots' ? 'active' : ''}`}
          onClick={() => setCurrentPage('slots')}
        >
          <svg fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z"/>
          </svg>
          <span>Слоты</span>
        </button>

        <button
          className={`nav-item ${currentPage === 'profile' ? 'active' : ''}`}
          onClick={() => setCurrentPage('profile')}
        >
          <svg fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
          <span>Профиль</span>
        </button>
      </nav>
    </div>
  );
}

export default App;

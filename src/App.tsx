import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './App.module.css';
import ThemeToggle from './components/ThemeToggle';


interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
}

function App() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

   useEffect(() => {
  const apiUrl = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false";

  const fetchData = ( ) => {
    axios.get(apiUrl)
      .then(response => {
        setCoins(response.data);
        if (loading) setLoading(false);  
      })
      .catch(err => {
        console.error("Failed to fetch currency data:", err);
        setError(t('error'));
        if (loading) setLoading(false);
      });
  };

  fetchData();  

   
  const intervalId = setInterval(fetchData, 60000);

   
  return () => clearInterval(intervalId);

}, [t, loading]);  

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const filteredCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentLang = i18n.language.split('-')[0];

  return (
    <div className={styles.outerContainer}>
      <div className={styles.container}>
        <header className={styles.header}>
  <ThemeToggle />
  <div className={styles.langSelector}>
    {['en', 'ru', 'ar'].map((lang) => (
      <button
        key={lang}
        onClick={() => changeLanguage(lang)}
        className={`${styles.langButton} ${currentLang === lang ? styles.active : ''}`}
      >
        {lang.toUpperCase()}
      </button>
    ))}
  </div>
</header>


        <h1 className={styles.title}>{t('title')}</h1>

        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder={t('search_placeholder')}
            className={styles.searchInput}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading && <p>{t('loading')}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        {!loading && !error && (
          <div className={styles.tableContainer}>
            <table className={styles.cryptoTable}>
              <thead>
                <tr>
                  <th>{t('coin')}</th>
                  <th>{t('price')}</th>
                  <th>{t('change')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredCoins.map(coin => (
                  <tr key={coin.id} className={styles.tableRowClickable} onClick={() => navigate(`/coin/${coin.id}`)}>
                    <td data-label={t('coin')} className={styles.coinCell}>
                      <img src={coin.image} alt={coin.name} className={styles.coinImage} />
                      {coin.name} ({coin.symbol.toUpperCase()})
                    </td>
                    <td data-label={t('price')}>${coin.current_price.toLocaleString()}</td>
                    <td data-label={t('change')} className={coin.price_change_percentage_24h >= 0 ? styles.priceUp : styles.priceDown}>
                      {coin.price_change_percentage_24h.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

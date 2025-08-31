import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import styles from '../App.module.css';
import CoinChart from '../components/CoinChart';

interface CoinDetail {
  name: string;
  symbol: string;
  image: {
    large: string;
  };
  description: {
    [key: string]: string;
  };
  market_data: {
    current_price: { usd: number };
    market_cap: { usd: number };
    total_volume: { usd: number };
    high_24h: { usd: number };
    low_24h: { usd: number };
  };
}

function CoinDetailPage() {
  const { coinId } = useParams<{ coinId: string }>();
  const { t, i18n } = useTranslation();

  const [coin, setCoin] = useState<CoinDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  if (!coinId) return;

  const apiUrl = `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`;

  const fetchData = ( ) => {
    axios.get(apiUrl)
      .then(response => {
        setCoin(prevCoin => ({ ...prevCoin, ...response.data }));
        if (loading) setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch coin details:", err);
        setError(t('error_details'));
        if (loading) setLoading(false);
      });
  };

  fetchData();

  const intervalId = setInterval(fetchData, 60000);

  return () => clearInterval(intervalId);

}, [coinId, t, loading]);


  const getLocalizedDescription = () => {
    if (!coin) return "";
    const lang = i18n.language.split('-')[0];
    const description = coin.description[lang] || coin.description.en;
    const doc = new DOMParser().parseFromString(description, 'text/html');
    return doc.body.textContent || "";
  };

  if (loading) {
    return <div className={styles.outerContainer}><p style={{color: 'white', fontSize: '1.5rem'}}>{t('loading_details')}</p></div>;
  }

  if (error) {
    return <div className={styles.outerContainer}><p style={{color: 'red', fontSize: '1.5rem'}}>{error}</p></div>;
  }

  if (!coin) {
    return <div className={styles.outerContainer}><p>{t('not_found')}</p></div>;
  }

  const descriptionText = getLocalizedDescription();

  return (
    <div className={styles.outerContainer}>
      <div className={styles.container}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
          <img src={coin.image.large} alt={coin.name} style={{ width: '80px', height: '80px' }} />
          <div>
            <h1 className={styles.title} style={{ textAlign: 'left', marginBottom: '0.5rem' }}>{coin.name} ({coin.symbol.toUpperCase()})</h1>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--gold-accent)' }}>
              ${coin.market_data.current_price.usd.toLocaleString()}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          <div className={styles.dataCard}>
            <h4>{t('market_cap')}</h4>
            <p>${coin.market_data.market_cap.usd.toLocaleString()}</p>
          </div>
          <div className={styles.dataCard}>
            <h4>{t('volume_24h')}</h4>
            <p>${coin.market_data.total_volume.usd.toLocaleString()}</p>
          </div>
          <div className={styles.dataCard}>
            <h4>{t('high_24h')}</h4>
            <p style={{color: 'var(--price-up)'}}>${coin.market_data.high_24h.usd.toLocaleString()}</p>
          </div>
          <div className={styles.dataCard}>
            <h4>{t('low_24h')}</h4>
            <p style={{color: 'var(--price-down)'}}>${coin.market_data.low_24h.usd.toLocaleString()}</p>
          </div>
        </div>

        <div style={{ marginBottom: '3rem' }}>
          {coinId && <CoinChart coinId={coinId} />}
        </div>

        <div style={{ marginBottom: '3rem' }}>
          <h3 style={{ borderBottom: '2px solid var(--gold-accent)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>{t('about', { coinName: coin.name })}</h3>
          <p style={{ lineHeight: '1.8', color: 'var(--secondary-text)' }}>
            {descriptionText.substring(0, 500) + (descriptionText.length > 500 ? '...' : '')}
          </p>
        </div>

        <Link to="/" style={{ color: 'var(--gold-accent)', textDecoration: 'none', display: 'block', textAlign: 'center', fontSize: '1.2rem' }}>
          {t('back_to_main')}
        </Link>
      </div>
    </div>
  );
}

export default CoinDetailPage;

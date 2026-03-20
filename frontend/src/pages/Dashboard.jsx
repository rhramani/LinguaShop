import { useState, useEffect } from 'react';
import { SUPPORTED_LANGUAGES, getDemoTranslation, formatNumber, getUsageColor } from '../utils/languages';

const Dashboard = ({ shop }) => {
  const [usage, setUsage] = useState({
    charsUsed: 12847,
    limit: 500000,
    remaining: 487153,
    percent: 2.6,
    wordsTranslated: 2856,
    apiCalls: 156,
  });
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [shop]);

  const loadData = async () => {
    try {
      const shopDomain = shop || 'demo-store.myshopify.com';
      const token = localStorage.getItem('linguashop_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const [usageRes, langRes] = await Promise.all([
        fetch(`/api/usage/${shopDomain}`, { headers }).catch(() => null),
        fetch(`/api/settings/${shopDomain}/languages`, { headers }).catch(() => null),
      ]);

      if (usageRes?.ok) {
        const data = await usageRes.json();
        if (data.usage) setUsage(data.usage);
      }

      if (langRes?.ok) {
        const data = await langRes.json();
        if (data.languages) setLanguages(data.languages);
      } else {
        setLanguages(SUPPORTED_LANGUAGES.filter(l => l.enabled !== false).slice(0, 5));
      }
    } catch (err) {
      console.log('Using demo data');
      setLanguages(SUPPORTED_LANGUAGES.filter((_, i) => i < 5).map(l => ({ ...l, enabled: true })));
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner}>⏳</div>
        <div>Loading...</div>
      </div>
    );
  }

  const enabledCount = languages.length;
  const percent = usage?.percent || 0;
  const usageColor = getUsageColor(percent);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Dashboard</h1>
          <p style={styles.subtitle}>Welcome to LinguaShop! Here's your translation overview.</p>
        </div>
        <div style={styles.demoBadge}>
          <span style={styles.demoDot}></span>
          Demo Mode
        </div>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statHeader}>
            <span style={styles.statLabel}>Monthly Usage</span>
            <span style={{ ...styles.badge, background: usageColor }}>{percent}%</span>
          </div>
          <div style={styles.statValue}>{formatNumber(usage?.charsUsed || 0)}</div>
          <div style={styles.statSubtext}>/ {formatNumber(usage?.limit || 500000)} chars</div>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${percent}%`, background: usageColor }}></div>
          </div>
          <div style={styles.statMeta}>Remaining: {formatNumber(usage?.remaining || 0)} chars</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statLabel}>Enabled Languages</div>
          <div style={styles.statValue}>{enabledCount}</div>
          <div style={styles.statSubtext}>languages available</div>
          <a href="/languages" style={styles.link}>Manage Languages →</a>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statLabel}>Total Translations</div>
          <div style={styles.statValue}>{formatNumber(usage?.wordsTranslated || 0)}</div>
          <div style={styles.statSubtext}>words translated</div>
          <div style={styles.statMeta}>API Calls: {formatNumber(usage?.apiCalls || 0)}</div>
        </div>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Supported Languages</h3>
        <div style={styles.languageGrid}>
          {SUPPORTED_LANGUAGES.slice(0, 12).map(lang => (
            <div key={lang.code} style={styles.languageChip}>
              <span style={styles.langFlag}>{lang.flag}</span>
              <span>{lang.name}</span>
              {lang.rtl && <span style={styles.rtlBadge}>RTL</span>}
            </div>
          ))}
          <div style={styles.moreChip}>+{SUPPORTED_LANGUAGES.length - 12} more</div>
        </div>
      </div>

      <div style={styles.grid2}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Quick Actions</h3>
          <div style={styles.buttonGroup}>
            <a href="/languages" style={styles.btnOutline}>Add Language</a>
            <a href="/editor" style={styles.btnOutline}>Translation Editor</a>
            <a href="/widget" style={styles.btnPrimary}>Customize Widget</a>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Your Plan</h3>
            <span style={styles.planBadge}>Free</span>
          </div>
          <p style={styles.planText}>2 languages, 500K chars/month</p>
          <p style={styles.planSubtext}>Upgrade for more languages and higher limits</p>
          <a href="/billing" style={styles.btnPrimary}>Upgrade Plan</a>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' },
  title: { margin: '0 0 4px 0', fontSize: '28px', fontWeight: '600', color: '#1a1a1a' },
  subtitle: { margin: 0, color: '#666', fontSize: '14px' },
  demoBadge: { display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: '#fff3cd', borderRadius: '16px', fontSize: '12px', fontWeight: '500', color: '#856404' },
  demoDot: { width: '8px', height: '8px', borderRadius: '50%', background: '#ffc107' },
  loading: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px', gap: '12px', color: '#666' },
  spinner: { fontSize: '24px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' },
  statCard: { background: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e3e3e3' },
  statHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  statLabel: { fontSize: '14px', fontWeight: '500', color: '#1a1a1a' },
  statValue: { fontSize: '32px', fontWeight: '700', color: '#1a1a1a', marginBottom: '4px' },
  statSubtext: { fontSize: '14px', color: '#666', marginBottom: '12px' },
  statMeta: { fontSize: '12px', color: '#666', marginTop: '8px' },
  badge: { padding: '2px 8px', borderRadius: '12px', fontSize: '12px', color: 'white' },
  progressBar: { height: '8px', background: '#e3e3e3', borderRadius: '4px', overflow: 'hidden' },
  progressFill: { height: '100%', transition: 'width 0.3s' },
  link: { color: '#008060', textDecoration: 'none', fontSize: '14px' },
  section: { background: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e3e3e3' },
  sectionTitle: { margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' },
  languageGrid: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  languageChip: { display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: '#f6f6f7', borderRadius: '16px', fontSize: '13px' },
  langFlag: { fontSize: '16px' },
  rtlBadge: { padding: '1px 4px', background: '#e3e3e3', borderRadius: '4px', fontSize: '10px', fontWeight: '500' },
  moreChip: { padding: '6px 12px', background: '#008060', color: 'white', borderRadius: '16px', fontSize: '13px' },
  grid2: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' },
  card: { background: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e3e3e3' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  cardTitle: { margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600' },
  buttonGroup: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  btnOutline: { padding: '8px 16px', background: 'white', border: '1px solid #e3e3e3', borderRadius: '4px', color: '#1a1a1a', textDecoration: 'none', fontSize: '14px', cursor: 'pointer' },
  btnPrimary: { padding: '8px 16px', background: '#008060', border: 'none', borderRadius: '4px', color: 'white', textDecoration: 'none', fontSize: '14px', cursor: 'pointer', display: 'inline-block' },
  planBadge: { padding: '2px 8px', background: '#008060', color: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: '500' },
  planText: { margin: '0 0 4px 0', fontSize: '14px', color: '#1a1a1a' },
  planSubtext: { margin: '0 0 12px 0', fontSize: '12px', color: '#666' },
};

export default Dashboard;

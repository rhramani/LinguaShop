import express from 'express';
import axios from 'axios';

const router = express.Router();

const LINGVA_URL = process.env.LINGVA_URL || 'https://lingva.ml/api/v1';

const translationCache = new Map();
const CACHE_TTL = 60 * 60 * 1000;

const getCachedTranslation = (text, targetLang) => {
  const key = `${targetLang}:${text}`;
  const cached = translationCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.translation;
  }
  return null;
};

const setCachedTranslation = (text, targetLang, translation) => {
  const key = `${targetLang}:${text}`;
  translationCache.set(key, { translation, timestamp: Date.now() });
  if (translationCache.size > 1000) {
    const firstKey = translationCache.keys().next().value;
    translationCache.delete(firstKey);
  }
};

async function translateWithLingva(text, targetLang) {
  try {
    const encodedText = encodeURIComponent(text);
    const url = `${LINGVA_URL}/auto/${targetLang}/${encodedText}`;
    
    console.log('Calling Lingva:', url);
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
      timeout: 15000,
    });

    console.log('Lingva response:', JSON.stringify(response.data));

    if (response.data) {
      return response.data.translation || response.data.translationText || response.data;
    }
    return null;
  } catch (error) {
    console.error('Lingva translate error:', error.message);
    return null;
  }
}

const DEMO_TRANSLATIONS = {
  'Hello': { es: 'Hola', fr: 'Bonjour', de: 'Hallo', it: 'Ciao', ja: 'こんにちは', ko: '안녕하세요', zh: '你好', ar: 'مرحبا', hi: 'नमस्ते', pt: 'Olá' },
  'Welcome': { es: 'Bienvenido', fr: 'Bienvenue', de: 'Willkommen', it: 'Benvenuto', ja: 'ようこそ', ko: '환영합니다', zh: '欢迎', ar: 'أهلا', hi: 'स्वागत', pt: 'Bem-vindo' },
  'Add to Cart': { es: 'Añadir al carrito', fr: 'Ajouter au panier', de: 'In den Warenkorb', it: 'Aggiungi al carrello', ja: 'カートに追加', ko: '장바구니에 담기', zh: '加入购物车', ar: 'أضف إلى السلة', hi: 'कार्ट में जोड़ें', pt: 'Adicionar ao carrinho' },
  'Shop': { es: 'Tienda', fr: 'Boutique', de: 'Shop', it: 'Negozio', ja: 'ショップ', ko: '쇼핑', zh: '商店', ar: 'متجر', hi: 'दुकान', pt: 'Loja' },
  'Products': { es: 'Productos', fr: 'Produits', de: 'Produkte', it: 'Prodotti', ja: '製品', ko: '제품', zh: '产品', ar: 'المنتجات', hi: 'उत्पाद', pt: 'Produtos' },
  'Sale': { es: 'Oferta', fr: 'Solde', de: 'Angebot', it: 'Saldi', ja: 'セール', ko: '세일', zh: '促销', ar: 'تخفيض', hi: 'बिक्री', pt: 'Promoção' },
  'Buy Now': { es: 'Comprar ahora', fr: 'Acheter maintenant', de: 'Jetzt kaufen', it: 'Acquista ora', ja: '今すぐ購入', ko: '지금 구매', zh: '立即购买', ar: 'اشتري الآن', hi: 'अभी खरीदें', pt: 'Compre agora' },
  'Free Shipping': { es: 'Envío gratis', fr: 'Livraison gratuite', de: 'Kostenloser Versand', it: 'Spedizione gratuita', ja: '送料無料', ko: '무료 배송', zh: '免费送货', ar: 'شحن مجاني', hi: 'मुफ्त शिपिंग', pt: 'Frete grátis' },
  'Price': { es: 'Precio', fr: 'Prix', de: 'Preis', it: 'Prezzo', ja: '価格', ko: '가격', zh: '价格', ar: 'السعر', hi: 'कीमत', pt: 'Preço' },
  'Cart': { es: 'Carrito', fr: 'Panier', de: 'Warenkorb', it: 'Carrello', ja: 'カート', ko: '카트', zh: '购物车', ar: 'سلة', hi: 'कार्ट', pt: 'Carrinho' },
  'Checkout': { es: 'Pagar', fr: 'Paiement', de: 'Kasse', it: 'Pagamento', ja: '決済', ko: '결제', zh: '结账', ar: 'الدفع', hi: 'चेकआउट', pt: 'Finalizar' },
  'Search': { es: 'Buscar', fr: 'Rechercher', de: 'Suchen', it: 'Cerca', ja: '検索', ko: '검색', zh: '搜索', ar: 'بحث', hi: 'खोजें', pt: 'Pesquisar' },
  'Menu': { es: 'Menú', fr: 'Menu', de: 'Menü', it: 'Menu', ja: 'メニュー', ko: '메뉴', zh: '菜单', ar: 'قائمة', hi: 'मेनू', pt: 'Menu' },
  'Login': { es: 'Iniciar sesión', fr: 'Connexion', de: 'Anmelden', it: 'Accedi', ja: 'ログイン', ko: '로그인', zh: '登录', ar: 'تسجيل الدخول', hi: 'लॉगिन', pt: 'Entrar' },
  'Account': { es: 'Cuenta', fr: 'Compte', de: 'Konto', it: 'Account', ja: 'アカウント', ko: '계정', zh: '账户', ar: 'حساب', hi: 'खाता', pt: 'Conta' },
  'New': { es: 'Nuevo', fr: 'Nouveau', de: 'Neu', it: 'Nuovo', ja: '新着', ko: '신규', zh: '新', ar: 'جديد', hi: 'नया', pt: 'Novo' },
  'In Stock': { es: 'En stock', fr: 'En stock', de: 'Auf Lager', it: 'Disponibile', ja: '在庫あり', ko: '재고 있음', zh: '有货', ar: 'متوفر', hi: 'स्टॉक में', pt: 'Em estoque' },
  'Out of Stock': { es: 'Agotado', fr: 'Rupture de stock', de: 'Nicht auf Lager', it: 'Non disponibile', ja: '在庫切れ', ko: '품절', zh: '缺货', ar: 'نفذت', hi: 'स्टॉक में नहीं', pt: 'Fora de estoque' },
};

function getDemoTranslation(text, targetLang) {
  let result = text;
  for (const [eng, translations] of Object.entries(DEMO_TRANSLATIONS)) {
    if (translations[targetLang]) {
      const regex = new RegExp(`\\b${eng}\\b`, 'gi');
      result = result.replace(regex, translations[targetLang]);
    }
  }
  return result;
}

router.post('/', async (req, res) => {
  try {
    const { text, targetLang } = req.body;
    
    if (!text || !targetLang) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const charCount = text.length;
    
    const cached = getCachedTranslation(text, targetLang);
    if (cached) {
      return res.json({
        success: true,
        original: text,
        translated: cached,
        targetLang,
        cached: true,
        charsUsed: charCount,
        usage: { used: 0, limit: 500000, remaining: 500000, percent: 0 }
      });
    }
    
    let translated = text;
    
    const lingvaResult = await translateWithLingva(text, targetLang);
    if (lingvaResult) {
      translated = lingvaResult;
    } else {
      translated = getDemoTranslation(text, targetLang);
    }
    
    setCachedTranslation(text, targetLang, translated);
    
    res.json({
      success: true,
      original: text,
      translated,
      targetLang,
      cached: false,
      charsUsed: charCount,
      usage: { used: 0, limit: 500000, remaining: 500000, percent: 0 }
    });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: 'Translation failed', message: error.message });
  }
});

router.post('/bulk', async (req, res) => {
  try {
    const { texts, targetLang } = req.body;
    
    if (!texts || !Array.isArray(texts) || texts.length === 0) {
      return res.status(400).json({ error: 'Texts array is required' });
    }
    
    const validTexts = texts.filter(t => typeof t === 'string' && t.trim().length > 0);
    const translations = [];
    
    for (const text of validTexts) {
      const cached = getCachedTranslation(text, targetLang);
      if (cached) {
        translations.push(cached);
        continue;
      }
      
      let translated = text;
      const lingvaResult = await translateWithLingva(text, targetLang);
      if (lingvaResult) {
        translated = lingvaResult;
      } else {
        translated = getDemoTranslation(text, targetLang);
      }
      
      setCachedTranslation(text, targetLang, translated);
      translations.push(translated);
    }
    
    res.json({
      success: true,
      translations,
      totalChars: validTexts.reduce((sum, t) => sum + t.length, 0),
      cached: validTexts.length - translations.length,
      uncached: translations.length,
      usage: { used: 0, limit: 500000, remaining: 500000, percent: 0 }
    });
  } catch (error) {
    console.error('Bulk translation error:', error);
    res.status(500).json({ error: 'Bulk translation failed', message: error.message });
  }
});

router.get('/languages', async (req, res) => {
  const languages = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', rtl: false },
    { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', rtl: false },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', rtl: false },
    { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', rtl: false },
    { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', rtl: false },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', rtl: false },
    { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', rtl: false },
    { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', rtl: false },
    { code: 'zh', name: 'Chinese (Simplified)', nativeName: '简体中文', flag: '🇨🇳', rtl: false },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', rtl: true },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', rtl: false },
    { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', rtl: false },
    { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱', rtl: false },
    { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱', rtl: false },
    { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', rtl: false },
    { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳', rtl: false },
    { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭', rtl: false },
    { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', rtl: false },
    { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾', rtl: false },
    { code: 'he', name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱', rtl: true },
  ];
  
  res.json({ success: true, languages, total: languages.length });
});

router.get('/history/:shop?', async (req, res) => {
  res.json({
    success: true,
    translations: [],
    pagination: { page: 1, limit: 100, total: 0, pages: 0 }
  });
});

export default router;

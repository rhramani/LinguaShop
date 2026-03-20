const axios = require('axios');

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
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json',
      },
      timeout: 15000,
    });

    if (response.data) {
      return response.data.translation || response.data.translationText || response.data;
    }
    return null;
  } catch (error) {
    console.error('Lingva error:', error.message);
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

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { text, targetLang } = req.body;
    
    if (!text || !targetLang) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const cached = getCachedTranslation(text, targetLang);
    if (cached) {
      return res.json({
        success: true,
        original: text,
        translated: cached,
        targetLang,
        cached: true,
        charsUsed: text.length,
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
      charsUsed: text.length,
      usage: { used: 0, limit: 500000, remaining: 500000, percent: 0 }
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};

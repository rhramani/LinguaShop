import '@shopify/shopify-api/adapters/node';
import { shopifyApi, ApiVersion } from '@shopify/shopify-api';

const config = {
  apiKey: process.env.SHOPIFY_API_KEY || 'demo_key',
  apiSecretKey: process.env.SHOPIFY_API_SECRET || 'demo_secret',
  appName: 'LinguaShop - AI Language Translate',
  apiVersion: ApiVersion.October23,
  hostName: process.env.APP_URL?.replace(/https?:\/\//, '') || 'localhost:3000',
  scopes: process.env.SHOPIFY_SCOPES?.split(',') || [
    'write_script_tags',
    'read_products',
    'write_products',
    'write_translations',
    'read_translations',
    'read_locales',
    'write_locales',
    'read_script_tags',
  ],
  shopify: {
    shopDomain: process.env.SHOPIFY_SHOP_DOMAIN,
    accessToken: process.env.SHOPIFY_ACCESS_TOKEN,
  },
  isEmbeddedApp: true,
  isCustomStoreApp: false,
};

export const shopify = shopifyApi(config);

export const getEmbeddedAppUrl = (host) => {
  return `https://${process.env.APP_URL}/?host=${host}`;
};

export const authCallbackPath = '/auth/callback';

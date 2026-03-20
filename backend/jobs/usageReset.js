import cron from 'node-cron';
import Store from '../models/Store.js';
import Usage from '../models/Usage.js';
import Translation from '../models/Translation.js';

const PLAN_LIMITS = {
  free: 500000,
  basic: 5000000,
  growth: 20000000,
  premium: 100000000,
};

const resetUsage = async () => {
  try {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    console.log(`[UsageReset] Starting monthly reset for ${currentMonth}`);
    
    const stores = await Store.find({ isActive: true });
    
    for (const store of stores) {
      try {
        const planLimit = PLAN_LIMITS[store.plan] || PLAN_LIMITS.free;
        
        await Usage.findOneAndUpdate(
          { shop: store.shop, month: currentMonth },
          {
            $setOnInsert: {
              shop: store.shop,
              charsUsed: 0,
              wordsTranslated: 0,
              apiCalls: 0,
              limit: planLimit,
              lastUpdated: now,
            }
          },
          { upsert: true, new: true }
        );
        
      } catch (storeError) {
        console.error(`[UsageReset] Error for ${store.shop}:`, storeError.message);
      }
    }
    
    console.log(`[UsageReset] Monthly reset completed for ${stores.length} stores`);
  } catch (error) {
    console.error('[UsageReset] Job failed:', error);
  }
};

const cleanupOldTranslations = async () => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const result = await Translation.deleteMany({
      createdAt: { $lt: thirtyDaysAgo }
    });
    
    console.log(`[UsageReset] Cleaned ${result.deletedCount} old translations`);
  } catch (error) {
    console.error('[UsageReset] Cleanup failed:', error.message);
  }
};

export const usageResetJob = cron.schedule('0 0 1 * *', async () => {
  console.log('[UsageReset] ==================');
  console.log('[UsageReset] Monthly reset triggered');
  console.log('[UsageReset] ==================');
  await resetUsage();
  await cleanupOldTranslations();
}, {
  scheduled: true,
  timezone: 'UTC',
});

export { resetUsage, cleanupOldTranslations };

export default usageResetJob;

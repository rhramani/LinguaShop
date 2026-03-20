import { Banner, Button, InlineStack, BlockStack, Text } from '@shopify/polaris';

const PlanBanner = ({ currentPlan, onUpgrade }) => {
  if (currentPlan?.id !== 'free') return null;

  return (
    <Banner
      title="Upgrade Your Plan"
      tone="info"
      action={{
        content: 'Upgrade Now',
        onAction: onUpgrade,
      }}
    >
      <BlockStack gap="100">
        <Text variant="bodyMd">
          You're on the free plan. Upgrade to unlock more languages and higher translation limits.
        </Text>
        <Text variant="bodySm" tone="subdued">
          Starting at just $9.99/month for 10 languages and 50,000 characters.
        </Text>
      </BlockStack>
    </Banner>
  );
};

export default PlanBanner;

import { Card, Text, BlockStack, ProgressBar, Badge, InlineStack } from '@shopify/polaris';
import { formatNumber, getUsageColor } from '../utils/constants';

const UsageCard = ({ usage, loading }) => {
  if (!usage) return null;

  const percent = usage.percent || 0;
  const color = getUsageColor(percent);

  return (
    <Card>
      <BlockStack gap="200">
        <InlineStack align="space-between" wrap={false}>
          <Text variant="headingSm">Monthly Usage</Text>
          <Badge tone={percent >= 80 ? 'warning' : 'success'}>
            {percent}%
          </Badge>
        </InlineStack>

        <BlockStack gap="100">
          <Text variant="body2xl" fontWeight="bold" as="p">
            {formatNumber(usage.charsUsed || 0)}
            <Text variant="bodyMd" tone="subdued">
              {' '}/ {formatNumber(usage.limit || 500000)} chars
            </Text>
          </Text>

          <ProgressBar
            progress={percent}
            color={color}
            size="large"
          />
        </BlockStack>

        <InlineStack gap="200">
          <Text variant="bodySm" tone="subdued">
            Remaining: {formatNumber(usage.remaining || 0)} chars
          </Text>
        </InlineStack>

        {usage.isBlocked && (
          <Badge tone="critical">Limit Reached</Badge>
        )}

        {usage.isWarning && !usage.isBlocked && (
          <Badge tone="warning">80% Used</Badge>
        )}
      </BlockStack>
    </Card>
  );
};

export default UsageCard;

import { Card, Text, BlockStack, EmptyState } from '@shopify/polaris';

const TranslationTable = ({ translations, loading }) => {
  if (!translations || translations.length === 0) {
    return (
      <Card>
        <EmptyState
          heading="No translation history"
          image=""
        >
          <Text variant="bodyMd" tone="subdued">
            Your translation history will appear here.
          </Text>
        </EmptyState>
      </Card>
    );
  }

  return (
    <BlockStack gap="200">
      {translations.slice(0, 20).map((item, index) => (
        <Card key={index} padding="200">
          <BlockStack gap="100">
            <Text variant="bodySm" fontWeight="semibold">
              {item.original?.substring(0, 100)}
              {item.original?.length > 100 ? '...' : ''}
            </Text>
            <Text variant="bodySm" tone="subdued">
              {item.translated?.substring(0, 100)}
              {item.translated?.length > 100 ? '...' : ''}
            </Text>
            <Text variant="bodyXs" tone="subdued">
              {item.targetLang} • {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </BlockStack>
        </Card>
      ))}
    </BlockStack>
  );
};

export default TranslationTable;

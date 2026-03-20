import {
  IndexTable,
  Text,
  Badge,
  Button,
  InlineStack,
} from '@shopify/polaris';

const LanguageTable = ({ languages, onToggle, onSetDefault, loading }) => {
  const resourceName = {
    singular: 'language',
    plural: 'languages',
  };

  return (
    <IndexTable
      resourceName={resourceName}
      itemCount={languages?.length || 0}
      headings={[
        { title: 'Language' },
        { title: 'Code' },
        { title: 'Status' },
        { title: 'Actions' },
      ]}
    >
      {languages?.map((lang) => (
        <IndexTable.Row key={lang.code} id={lang.code}>
          <IndexTable.Cell>
            <InlineStack gap="200" wrap={false}>
              {lang.flag && <Text>{lang.flag}</Text>}
              <Text fontWeight="semibold">{lang.name}</Text>
              {lang.rtl && <Badge tone="info">RTL</Badge>}
            </InlineStack>
          </IndexTable.Cell>
          <IndexTable.Cell>
            <Text variant="bodySm" tone="subdued">{lang.code}</Text>
          </IndexTable.Cell>
          <IndexTable.Cell>
            <Badge tone={lang.enabled ? 'success' : 'subdued'}>
              {lang.enabled ? 'Enabled' : 'Disabled'}
            </Badge>
            {lang.isDefault && <Badge tone="info">Default</Badge>}
          </IndexTable.Cell>
          <IndexTable.Cell>
            <InlineStack gap="100">
              <Button
                size="slim"
                onClick={() => onToggle(lang.code, lang.enabled)}
                disabled={lang.isDefault}
              >
                {lang.enabled ? 'Disable' : 'Enable'}
              </Button>
              {!lang.isDefault && lang.enabled && (
                <Button
                  size="slim"
                  variant="primary"
                  onClick={() => onSetDefault(lang.code)}
                >
                  Set Default
                </Button>
              )}
            </InlineStack>
          </IndexTable.Cell>
        </IndexTable.Row>
      ))}
    </IndexTable>
  );
};

export default LanguageTable;

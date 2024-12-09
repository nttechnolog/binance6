import React from 'react';
import {
  Box,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Text,
} from '@chakra-ui/react';
import { SecuritySettings } from './SecuritySettings';
import { GeneralSettings } from './GeneralSettings';
import { NotificationSettings } from './NotificationSettings';

export function AdminSettings() {
  return (
    <Box>
      <Text fontSize="2xl" fontWeight="bold" mb={6}>
        Настройки админ-панели
      </Text>

      <Tabs variant="enclosed">
        <TabList>
          <Tab>Основные</Tab>
          <Tab>Безопасность</Tab>
          <Tab>Уведомления</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <GeneralSettings />
          </TabPanel>
          <TabPanel>
            <SecuritySettings />
          </TabPanel>
          <TabPanel>
            <NotificationSettings />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
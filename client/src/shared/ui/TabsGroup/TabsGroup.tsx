import { useState, FC, ReactNode, SyntheticEvent } from 'react';
import { Box, Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';

interface TabGroupProps {
  tabs: ReactNode[];
  tabLabels?: string[];
}

const TabGroup: FC<TabGroupProps> = (props) => {
  const labels = props.tabLabels || props.tabs.map((_, index) => `Tab ${index + 1}`);
  const [value, setValue] = useState("0");

  const handleChange = (_: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <TabContext value={value}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <TabList onChange={handleChange}>
          {labels.map((label, index) => (
            <Tab key={index} label={label} value={index.toString()} />
          ))}
        </TabList>
      </Box>
      {props.tabs.map((tabContent, index) => (
        <TabPanel key={index} value={index.toString()}>
          {tabContent}
        </TabPanel>
      ))}
    </TabContext>
  );
};

export default TabGroup;

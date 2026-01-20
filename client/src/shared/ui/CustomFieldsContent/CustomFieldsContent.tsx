import { useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';

const CustomFieldsContent = ({ data }: { data: Record<string, unknown> }) => {
  const [copied, setCopied] = useState(false);
  const entries = Object.entries(data);

  const handleCopy = async () => {
    const text = JSON.stringify(data, null, 2);

      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      } else {
        
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          const successful = document.execCommand('copy');
          if (!successful) {
            throw new Error('Failed to copy');
          }
        } finally {
          document.body.removeChild(textArea);
        }
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  if (entries.length === 0) return null;

  return (
    <Box position="relative">
      <IconButton
        aria-label="copy"
        onClick={handleCopy}
        size="small"
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 1,
          backgroundColor: 'background.paper',
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        }}
      >
        {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
      </IconButton>

      <Typography
        component="pre"
        sx={{
          p: 2,
          backgroundColor: (theme) => theme.palette.grey[100],
          borderRadius: 1,
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          maxHeight: '200px',
          overflowY: 'auto',
          lineHeight: '1.5',
          position: 'relative',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { 
            display: 'none',
          },
        }}
      >
        {JSON.stringify(data, null, 2)}
      </Typography>
    </Box>
  );
};

export default CustomFieldsContent;

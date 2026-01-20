import { Box, Typography, Paper, useTheme } from '@mui/material';
import { isMobile } from 'react-device-detect';

const RequestExamplePage = () => {
  const theme = useTheme();
  const apiUrl = import.meta.env.VITE_API_URL || 'no-api-url-provided';

  const exampleJson = `{
    "project_id": "f0f1bb39-7fe2-4336-a834-3f8afa66bb60",
    "error_message": "[failed to load data, Internal Server Error, critical]",
    "custom_fields": {
      "environment": "production",
      "severity": "critical",
      "status": 500,
      "component": "user-profile",
      "timestamp": "2025-06-29T15:42:24Z",
      "browser": "Chrome 114.0.5735.199",
      "os": "Windows 10",
      "url": "https://app.example.com/user/12345/profile",
      "user_id": "550e8400-e29b-41d4-a716-446655440000"
    }
  }`;

  return (
    <Box sx={{
      maxWidth: isMobile ? '100%' : '70%', 
      mx: 'auto',
      mt: 0,
      mb: 4
    }}>
      <Typography variant="h4" component="h1" sx={{ mt: 4, mb: 3, fontWeight: 'bold', color: 'text.secondary' }}>
        Client-Side Error Monitoring
      </Typography>

      
      <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7, color: 'text.secondary' }}>
        errcatcher is a simple error monitoring and tracking solution that helps developers identify, track, and resolve issues in their applications. 
        With real-time error reporting and detailed error context, you can quickly understand and fix issues affecting your users.
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, p: 2, backgroundColor: 'warning.light', borderRadius: 1, color: 'text.secondary' }}>
        <strong>Note:</strong> This is an example deployment for demonstration purposes. All routes are exposed and accessible without authentication.
        In the production version, access is protected by IP whitelisting.
      </Typography>
      
      <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2, fontWeight: 'bold', color: 'text.secondary' }}>
        How to Use
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7, color: 'text.secondary' }}>
        1. Send error data to our API endpoint using the URL below.<br/>
        2. Include your project's <code style={{
          padding: '2px 4px',
          borderRadius: 3,
          fontSize: '0.9em',
          backgroundColor: theme.palette.grey[800],
          color: theme.palette.grey[100]
        }}>project_id</code> and error details in the request body.<br/>
        3. View and manage errors in your dashboard for quick resolution.
      </Typography>
      
      <Typography variant="h6" sx={{ mt: 4, mb: 1, color: 'text.secondary' }}>
        API Endpoint (Publicly Accessible):
      </Typography>
      <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary', fontStyle: 'italic' }}>
        Note: This API endpoint is publicly accessible. All other endpoints, including this web interface, are not exposed and require VPN access.
      </Typography>
      <Paper 
        elevation={2} 
        sx={{ 
          p: 2, 
          mb: 2, 
          backgroundColor: theme.palette.grey[900],
          color: theme.palette.grey[100],
          overflowX: 'auto',
          fontFamily: 'monospace',
          borderRadius: 1
        }}
      >
        {apiUrl}/api/errors
      </Paper>
      
      <Typography variant="h6" sx={{ mt: 2, mb: 1, color: 'text.secondary' }}>
        Request Body (JSON):
      </Typography>
      <Paper 
        elevation={2} 
        sx={{ 
          p: 2, 
          mb: 2, 
          backgroundColor: theme.palette.grey[900],
          color: theme.palette.grey[100],
          overflowX: 'auto',
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap',
          borderRadius: 1
        }}
      >
        {exampleJson}
      </Paper>
      
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontSize: '0.9rem' }}>
        Note: The <code style={{
          padding: '2px 4px',
          borderRadius: 3,
          fontSize: '0.9em'
        }}>project_id</code> should be a valid UUID of your project.
        Custom fields can be any additional metadata you want to include with the error.
      </Typography>
    </Box>
  );
};

export default RequestExamplePage;

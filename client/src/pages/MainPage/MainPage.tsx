import { useState, useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import TabGroup from '../../shared/ui/TabsGroup/TabsGroup';
import ErrorsPage from '../ErrorsPage/ErrorsPage';
import ProjectsPage from '../ProjectsPage/ProjectsPage';
import RequestExamplePage from '../RequestExamplePage/RequestExamplePage';

const MainPage = () => {
  const [showMobileWarning, setShowMobileWarning] = useState(false);
  const [showCloudflareWarning, setShowCloudflareWarning] = useState(false);

  useEffect(() => {
    if (isMobile) {
      setShowMobileWarning(true);
    }
    if (!isMobile) {
      setShowCloudflareWarning(true);
    }
  }, []);

  const handleContinue = () => {
    setShowMobileWarning(false);
  };

  const handleCloudflareContinue = () => {
    setShowCloudflareWarning(false);
  };

  return (
    <>
      <div style={{ textAlign: 'center', userSelect: 'none' }}>
        <img 
          src="/logo.svg" 
          alt="errcatcher Logo" 
          draggable="false"
          style={{ 
            height: '20px',
            pointerEvents: 'none'
          }} 
        />
      </div>
      <TabGroup
        tabs={[
          <ErrorsPage />,
          <ProjectsPage />,
          <RequestExamplePage />
        ]}
        tabLabels={[
          'Errors',
          'Projects',
          'How to use'
        ]}
      />

      <Dialog
        open={showMobileWarning}
        onClose={handleContinue}
        aria-labelledby="mobile-warning-dialog"
      >
        <DialogTitle id="mobile-warning-dialog">Mobile Device</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This site was supposed to be used on desktop, so don't expect it to work well on mobile.
          </DialogContentText>
          <DialogContentText>
            It may not work in Russia due to Cloudflare restrictions.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleContinue} color="primary" variant="contained" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={!isMobile && showCloudflareWarning}
        onClose={handleCloudflareContinue}
        aria-labelledby="cloudflare-warning-dialog"
      >
        <DialogTitle id="cloudflare-warning-dialog">Important Notice</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This site may not work in Russia due to Cloudflare restrictions.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloudflareContinue} color="primary" variant="contained" autoFocus>
          OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MainPage;

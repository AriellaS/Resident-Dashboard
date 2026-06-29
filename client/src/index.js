import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'rsuite/dist/rsuite-no-reset.min.css';
import '~/index.css';

import App from '~/App';

const theme = {
    fontFamily: 'Suse, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen',
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <MantineProvider theme={theme} withGlobalStyles>
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </MantineProvider>
);

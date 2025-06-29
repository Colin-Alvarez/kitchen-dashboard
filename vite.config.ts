import { defineConfig } from 'vite';
import '@fullcalendar/daygrid';
import '@fullcalendar/react';
// and register them in your calendar options

import react from '@vitejs/plugin-react';


export default defineConfig({
  server: {
    hmr: {
      overlay: false
    }
  }
});

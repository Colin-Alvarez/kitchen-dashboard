declare const gapi: any;

const API_KEY = 'AIzaSyBoIqpe2bkLWPob0fSerTYNU6Gtu8wxBHY';

// 🗂️ Map of Calendar Names to IDs
const CALENDARS = {
  gigs: 'colinalvarez5@gmail.com',
  beanie: '9ae41ca07ad5e61786a2415fbbf32e3500be55e311baf52827dd6af357685184@group.calendar.google.com',
  connor: '85ad4de500de9967a38551cf32b67e563259e7aba1f2fe25757f9733d14401c8@group.calendar.google.com',
  family: 'abe84984aaee3022ff0dc40cd8a9ebae425e33c5c30e67cbb1e91e7c5b8b47a3@group.calendar.google.com',
  bills: 'b266b2bd2e76919e29203800c608d763fd6b8600d6d9eb3a1aadbddf06d6fe45@group.calendar.google.com',
};

export const initGoogleClient = () => {
  return new Promise<void>((resolve, reject) => {
    gapi.load('client', async () => {
      try {
        await gapi.client.init({ apiKey: API_KEY });
        await gapi.client.load('calendar', 'v3');
        console.log('✅ Google API initialized');
        resolve();
      } catch (err) {
        console.error('Google API init error:', err);
        reject(err);
      }
    });
  });
};

export const fetchCalendarEvents = async (): Promise<any[]> => {
  const now = new Date().toISOString();
  let allEvents: any[] = [];

  try {
    if (!gapi?.client?.calendar) {
      console.warn('gapi.client.calendar not loaded, loading...');
      await new Promise<void>((resolve, reject) => {
        gapi.load('client', async () => {
          try {
            await gapi.client.init({ apiKey: API_KEY });
            await gapi.client.load('calendar', 'v3');
            resolve();
          } catch (err) {
            console.error('Failed to init gapi.client in fallback:', err);
            reject(err);
          }
        });
      });
    }

    // 📅 Loop through each calendar and fetch events
    for (const [source, calendarId] of Object.entries(CALENDARS)) {
      try {
        const response = await gapi.client.calendar.events.list({
          calendarId,
          timeMin: now,
          showDeleted: false,
          singleEvents: true,
          orderBy: 'startTime',
          maxResults: 100,
        });

        const events = (response.result.items || []).map(event => {
          const start = event.start?.dateTime || event.start?.date;
          const end = event.end?.dateTime || event.end?.date;
        
          return {
            title: event.summary || '(No Title)',
            start,
            end,
            display: 'auto',
            extendedProps: {
              calendarSource: source,
              location: event.location || '',
              description: event.description || '',
            },
          };
        });
        

        allEvents.push(...events);
        console.log(`📆 Fetched ${events.length} events from ${source}`);
      } catch (err) {
        console.error(`❌ Failed to fetch events from ${source}:`, err);
      }
    }

    return allEvents;
  } catch (err) {
    console.error('❌ fetchCalendarEvents error:', err);
    return [];
  }
};

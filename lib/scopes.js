// Broad Google Workspace scope set: Drive, Sheets, Docs, Calendar, Forms, Gmail,
// Slides, Sites, Meet (via Calendar), Contacts, Tasks. Keep the app in "Testing"
// in Google Cloud Console with yourself as a test user to avoid full verification.
export const GOOGLE_SCOPES = [
  "openid",
  "email",
  "profile",
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/documents",
  "https://www.googleapis.com/auth/presentations",
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/forms.body",
  "https://www.googleapis.com/auth/forms.responses.readonly",
  "https://www.googleapis.com/auth/gmail.modify",
  "https://www.googleapis.com/auth/contacts",
  "https://www.googleapis.com/auth/tasks",
];

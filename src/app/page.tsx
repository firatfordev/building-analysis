import { redirect } from 'next/navigation';

// This page is a fallback — the middleware handles locale detection
// and redirects users to /en or /tr automatically.
// This redirect acts as a safety net in case middleware is bypassed.
export default function RootPage() {
  redirect('/en');
}

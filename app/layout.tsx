import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'StudEx Factory — Founder Workspace',
  description: 'A founder-led workspace for StudEx businesses, content and agent integration readiness.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}

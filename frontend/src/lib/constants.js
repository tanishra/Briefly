export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export const REPORT_TYPES = {
  SALES: 'sales',
  MARKETING: 'marketing',
  SUMMARY: 'summary',
  ALL: 'all'
};

export const NAVIGATION_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
  { name: 'Ask AI', path: '/ask-ai', icon: 'MessageSquare' },
  { name: 'Reports', path: '/reports', icon: 'FileText' }
];

export const ANIMATION_DELAYS = {
  STAGGER_CHILDREN: 0.1,
  FADE_IN: 0.3,
  SLIDE_UP: 0.5
};
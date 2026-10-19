export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  avatarUrl?: string;
  favoriteOrigin?: string;
}

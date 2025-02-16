export interface User {
  id: string;
  email: string;
  nickname?: string;
  description?: string;
  avatar?: string;
  savedRoutes?: any[];
  createdAt: Date;
}

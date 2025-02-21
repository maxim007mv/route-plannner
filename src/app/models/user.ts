export interface User {
  id: string;
  email: string;
  name: string;
  nickname?: string;
  description?: string;
  avatar?: string;
  savedRoutes?: any[];
  createdAt: Date;
}

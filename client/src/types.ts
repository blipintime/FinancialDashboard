export type Role = 'Admin' | 'Billing' | 'Collector' | 'IR';

export const ALL_ROLES: Role[] = ['Admin', 'Billing', 'Collector', 'IR'];

export type User = {
  id: number;
  name: string;
  email: string;
  created_at: string;
  roles: Role[];
};

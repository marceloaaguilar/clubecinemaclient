
export interface Establishment {
  id: string;
  name: string;
  category: string;
  logo_url: string | File;
  createdAt?: Date;
}

export interface Voucher {
  id: string;
  title: string;
  description: string;
  code: string;
  rules: string;
  value: number;
  quantity: number;
  isPaid: boolean;
  establishmentId: string;
  establishment?: Establishment;
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

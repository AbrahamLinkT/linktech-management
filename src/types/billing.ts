export interface BillingPlan {
  id: string;
  projectId: string;
  milestones: BillingMilestone[];
  totalAmount: number;
  currency: string;
  status: BillingStatus;
}

export interface BillingMilestone {
  id: string;
  description: string;
  amount: number;
  dueDate: Date;
  status: PaymentStatus;
  invoiceNumber?: string;
}

export enum BillingStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  INVOICED = 'INVOICED',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE'
}
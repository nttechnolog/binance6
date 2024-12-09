export type DisputeStatus = 
  | 'new'
  | 'in_progress'
  | 'waiting_info'
  | 'proposed'
  | 'resolved'
  | 'closed';

export interface DisputeParticipant {
  id: number;
  name: string;
  email: string;
}

export interface DisputeAttachment {
  id: number;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface DisputeMessage {
  text: string;
  sender: string;
  timestamp: Date;
  attachments?: DisputeAttachment[];
}

export interface Dispute {
  id: number;
  status: DisputeStatus;
  buyer: DisputeParticipant;
  seller: DisputeParticipant;
  amount: string;
  amountUsd: string;
  asset: string;
  createdAt: Date;
  updatedAt: Date;
  messages: DisputeMessage[];
}
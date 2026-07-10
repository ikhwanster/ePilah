export interface Citizen {
  id: string;
  block: string;
  houseNo: string;
  name: string;
  points: number;
  weight: number;
  lastActive: string;
  claimedBy?: string;
  email?: string;
  phone?: string;
  isVerified?: boolean;
}

export interface ActivityLog {
  id: string;
  name: string;
  house: string;
  type: string;
  amount: string;
  points: number;
  time: string;
  icon: string;
  bg: string;
  isNew?: boolean;
  timestamp?: any;
}

export interface WasteGuideItem {
  name: string;
  category: 'organik' | 'anorganik' | 'b3' | 'residu';
  type: string;
  instruction: string;
}

export interface GameItem {
  icon: string;
  name: string;
  type: 'organik' | 'anorganik' | 'b3' | 'residu';
}

export type TabId = 'dashboard' | 'panduan' | 'setor' | 'leaderboard' | 'game';

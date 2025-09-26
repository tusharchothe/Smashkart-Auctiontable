export interface Player {
  id: string;
  name: string;
  kdr: number;
  classification: 'Pro' | 'Noob';
  contact: string;
  currentBid?: number;
  team?: string;
  status: 'available' | 'sold' | 'unsold';
  registered: boolean;
}

export interface Team {
  id: string;
  name: string;
  contact: string;
  captain: string; // captain name or id
  credits: number;
  initialCredits: number;
  roster: {
    pro: string[];
    noob: string[];
  };
  teamSize: number; // max team size
}
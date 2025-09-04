export interface Startup {
  id: string;
  name: string;
  website?: string;
  founderLinkedIn?: string;
  deckUrl?: string;
}

export enum VoteCategory {
  DemoDay = 'DEMO_DAY',
  PrivatePitch = 'PRIVATE_PITCH',
  None = 'NONE',
}

export type Selections = Record<string, VoteCategory>;

export interface Ballot {
  id?: number;
  voterName: string;
  voterNameLower: string; // For case-insensitive voter lookup
  selections: Selections;
  timestamp: number;
}
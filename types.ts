export interface DrawResult {
  giver: string;
  receiver: string;
}

export interface ParticipantLink {
  name: string;
  url: string;
}

export interface DecodedSecret {
  giver: string;
  receiver: string;
}

export enum AppMode {
  ADMIN = 'ADMIN',
  PARTICIPANT = 'PARTICIPANT',
}

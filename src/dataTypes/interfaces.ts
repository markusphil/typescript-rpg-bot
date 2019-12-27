import { Message } from 'discord.js';

export interface players extends Array<player> {}

export interface player {
  id: number;
  name: string;
  discordId: string;
  raceId: number;
  race: string;
  modId: number;
  modifier: string;
  str: number;
  dex: number;
  int: number;
  lck: number;
  exp: number;
  lvl: number;
  ap: number;
  hp?: number;
}

export interface enemies extends Array<enemyType> {}

export interface enemyType {
  id?: number;
  name: string;
  description: string;
  str: number;
  dex: number;
  int: number;
  lck: number;
  strMultiplier: number;
  dexMultiplier: number;
  intMultiplier: number;
  lckMultiplier: number;
}

export interface enemy {
  name: string;
  description: string;
  modifier: string;
  lvl: number;
  str: number;
  dex: number;
  int: number;
  lck: number;
  hp: number;
  isPlayer: boolean;
}

export interface fighter {
  name: string;
  str: number;
  dex: number;
  int: number;
  lck: number;
  lvl: number;
  hp: number;
  isPlayer: boolean;
}

export interface modifiers extends Array<modifier> {}

export interface modifier {
  id: number;
  name: string;
  message: string;
  bonus_str: number;
  bonus_dex: number;
  bonus_int: number;
  bonus_lck: number;
  malus_str: number;
  malus_dex: number;
  malus_int: number;
  malus_lck: number;
}

export interface races extends Array<race> {}

export interface race {
  id: number;
  name: string;
  name_s: string;
  description: string;
  message: string;
  base_str: number;
  base_dex: number;
  base_int: number;
  base_lck: number;
}

export interface items extends Array<item> {}

export interface item {
  id?: number;
  name: string;
  description: string;
  value: number;
  type: string;
}

export interface command {
  name: string;
  description: string;
  usage?: string;
  aliases?: string[];
  requireArgs?: boolean;
  guildOnly?: boolean;
  execute: commandExecute;
}

export interface commandExecute {
  (args: string[], message: Message): void;
}

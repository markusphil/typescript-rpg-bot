import { item, weapon } from './interfaces';
export function isWeapon(item: item | weapon): item is weapon {
  return (item as weapon).weaponType !== undefined && (item as weapon).baseDMG !== undefined;
}

export function isValidItemType(s: string | itemType): s is itemType {
  return (s as itemType) === 'loot' || (s as itemType) === 'weapon' || (s as itemType) === 'armor';
}
export function hasValidItemType(itm: any | item): itm is item {
  return (itm as item).type === 'loot' || (itm as item).type === 'weapon' || (itm as item).type === 'armor';
}

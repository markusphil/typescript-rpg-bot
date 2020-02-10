import { item, weapon } from './interfaces';
export function isWeapon(item: item | weapon): item is weapon {
  return (item as weapon).weaponType !== undefined && (item as weapon).baseDMG !== undefined;
}

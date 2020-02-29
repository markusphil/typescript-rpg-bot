import { bot } from '..';

export async function equipWeapon(playerID: number, weaponID: number) {
  // check if player has weapon equiped => remove Weapon
  const activeWeapon = await bot.playerRepo.getPlayerWeapon(playerID);
  if (activeWeapon) {
    await unequipWeapon(playerID, activeWeapon.id);
  }
  // equip weapon
  return bot.playerRepo
    .playerWeaponAdd(playerID, weaponID)
    .then(() => {
      // remove weapon from inventory
      bot.playerRepo.inventoryRemove(playerID, weaponID);
    })
    .catch(err => {
      throw err;
    });
}

export async function unequipWeapon(playerID: number, weaponID: number) {
  // remove weapon from weapon repo
  return bot.playerRepo
    .playerWeaponRemove(playerID, weaponID)
    .then(() => {
      // add weapon to inventory
      bot.playerRepo.inventoryAdd(playerID, weaponID);
    })
    .catch(err => {
      throw err;
    });
}

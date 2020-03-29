import { ItemRepo } from './../database/items';
import { inventoryItems, inventoryItem } from './../dataTypes/interfaces';
// how to best implement the shopkeeper?
// maybe I should use a class here.
// This would also allow to have multiple shopkeepers

export class ShopKeeper {
  stock: inventoryItems;

  constructor(startItems: inventoryItems | undefined) {
    if (!startItems) {
      // get random items here!
      this.stock = [];
    } else {
      this.stock = startItems;
    }
    // set intervall for item refreching
  }

  sell(itemId: number, repo: ItemRepo) {
    const itm = this.stock.find(ii => ii.id === itemId);
    if (itm) {
      itm.amount++;
    } else {
      // fetch item from db
      // add item to list
    }
  }

  buy(itemId: number) {
    // TODO: should I move the whole process to the shopKeeper class?
    // -- check if player has enogh money,
    // -- remove money from player
    // -- add item to player inventory
    // -- remove item from stock
    // Other option: handle everything as I've done so far and only do the stock calculation in here
    // ------------------------
    // I guess in general it would be nice for this game setup to use an object-oriented approach
    // but it would need some serious refactoring!

    // find item in stock
    const itm = this.stock.find(ii => ii.id === itemId);
    if (!itm) {
      throw Error('the requested item is not in stock!');
    }
    if (itm.amount > 1) {
      itm.amount--;
    } else {
      this.stock = this.stock.filter(si => si.id != itm.id);
    }
  }
}

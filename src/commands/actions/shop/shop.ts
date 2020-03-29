// TODO: the shop should allow different actions
// - show stock
// - buy items
// - sell items --> this functionality is allready realized in "sell.ts"

import { commandExecute } from '../../../dataTypes/interfaces';

export const handleShopRequest: commandExecute = (args, message) => {
  if (args.length < 1) {
    // send error
  }
  const requestType = args.shift();
  switch (requestType) {
    case 'sell':
      // execute sell function with args and message
      break;
    case 'buy':
      // execute buy function with args and message
      break;
    case 'show':
      // execute show function
      break;
    // TODO: allow aliases
    default:
    // send error msg
  }
};

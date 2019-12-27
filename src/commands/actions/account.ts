import { bot } from '../../index';
import { GuildMember } from 'discord.js';
import { commandExecute } from '../../dataTypes/interfaces';

export const joinByCommand: commandExecute = (args, message) => {
  addPlayer(message.member);
};

export const addPlayer = (user: GuildMember) => {
  const player = bot.players.get(user.id);
  if (player) {
    user.send(`Hey ${user.displayName}, you already joined!`);
    return;
  }
  console.log('adding new player');
  const raceId = bot.races.randomKey();
  const modId = bot.modifiers.randomKey();
  bot.playerRepo.add(user.displayName, user.id, raceId, modId).then(() => {
    const playerRace = bot.races.get(raceId);
    const playerMod = bot.modifiers.get(modId);
    if (playerRace && playerMod) {
      user.send(
        `${playerRace.message} \nAs typical for most ${playerRace.name}. \nBut ${playerMod.message} \nWelcome ${user.displayName}, ${playerMod.name} ${playerRace.name_s}!`
      );
    }
  });
  bot.playerRepo
    .getById(user.id)
    .then(player => {
      bot.players.set(player.discordId, player);
    })
    .catch(err => console.log(err));
};

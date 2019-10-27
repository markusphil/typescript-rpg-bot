import { commandExecute, bot } from './../index';
import { GuildMember } from 'discord.js';

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
  bot.playerRepo.add(user.displayName, user.id, raceId).then(() => {
    const playerRace = bot.races.get(raceId);
    if (playerRace) {
      user.send(`Your name is ${user.displayName}, \n ${playerRace.message} \n As typical for most ${playerRace.name}`);
    }
  });
  bot.playerRepo
    .getById(user.id)
    .then(player => {
      bot.players.set(player.discordId, player);
    })
    .catch(err => console.log(err));
};
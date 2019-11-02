import { sendError } from './../utility/error';
import { RichEmbed } from 'discord.js';
import { bot, commandExecute } from '../index';
import { infoColor } from '../config.json';
import { capitalize } from 'lodash';

export const racesInfo: commandExecute = (args, message) => {
  let embed = new RichEmbed().setColor(infoColor).setTitle('Known Races');
  bot.races.forEach(race => {
    embed.addField(race.name, race.description);
  });
  message.reply(embed);
};

export const singleRaceInfo: commandExecute = (args, message) => {
  const embed = new RichEmbed().setColor(infoColor); //ToDo: get colors for races
  if (args.length > 0) {
    const race = bot.races.find(race => race.name === capitalize(args[0]) || race.name_s === capitalize(args[0]));
    if (race) {
      embed.setTitle(race.name).setDescription(race.description);
    } else {
      sendError(`race "${args[0]}" not found`, message);
      return;
    }
  } else {
    randomRace(embed);
  }
  message.reply(embed);
};

function randomRace(embed: RichEmbed) {
  const randomRace = bot.races.random();
  embed.setTitle('Random Race: ' + randomRace.name).setDescription(randomRace.description);
}

import * as dotenv from 'dotenv';
dotenv.config();

import { Client, Collection, Channel, TextChannel, RichEmbed } from 'discord.js';
import { AppDAO } from './database/dao';
import { RaceRepo, race, races } from './database/races';

const dao = new AppDAO('../database.sqlite3');
const racesRepo = new RaceRepo(dao);

class Bot {
  races: Collection<number, race>;
  client: Client;
  logChannel?: TextChannel;
  constructor() {
    this.client = new Client();
    this.races = new Collection();
  }
}

const bot = new Bot();

bot.client.once('ready', () => {
  console.log('ready!');
  const targetChannel: Channel | undefined = bot.client.channels.get('627866917394317334');
  if (targetChannel instanceof TextChannel) bot.logChannel = targetChannel;
  if (bot.logChannel) {
    bot.logChannel.send('I am awake');
  }
  racesRepo
    .getAll()
    .then(res => {
      res.forEach(race => {
        bot.races.set(race.id, race);
      });
      if (bot.logChannel) {
        const randomRace = bot.races.random();
        const message = new RichEmbed()
          .setColor(0xde1738)
          .setTitle(randomRace.name)
          .setDescription(randomRace.description);

        bot.logChannel.send(message);
      }
    })
    .catch(err => console.error(err));
});

bot.client.login(process.env.BOT_TOKEN);

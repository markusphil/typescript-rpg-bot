import { PlayerRepo } from './database/players';
import * as dotenv from 'dotenv';
dotenv.config();

import { Client, Collection, Channel, TextChannel, RichEmbed, GuildMember } from 'discord.js';
import { AppDAO } from './database/dao';
import { RaceRepo, race, races } from './database/races';

const dao = new AppDAO('./database.sqlite3');
const racesRepo = new RaceRepo(dao);
const playerRepo = new PlayerRepo(dao);

class Bot {
  races: Collection<number, race>;
  client: Client;
  // todo: move textchannel check to constructor so that logChannel is either defined or the app get's stoped
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

bot.client.on('guildMemberAdd', member => {
  addPlayer(member);
});

bot.client.on('message', message => {
  // TODO: make use of command handling like I did for the rss bot
  if (!message.content.startsWith('!') || message.author.bot) return;

  const args = message.content.slice(1).split(/ +/);
  if (!args || args.length < 1) {
    return;
  }
  const commandName = args[0].toLowerCase();

  if (commandName === 'join') {
    addPlayer(message.member);
  } else if (commandName === 'list') {
    playerRepo.getAll().then(res => {
      if (bot.logChannel) {
        bot.logChannel.send(JSON.stringify(res));
      }
    });
  }
});

function addPlayer(member: GuildMember) {
  // TODO: implement check if player exists => players collection
  console.log('add new player');
  const raceId = bot.races.randomKey();
  playerRepo.add(member.displayName, member.id, raceId).then(() => {
    const playerRace = bot.races.get(raceId);
    if (playerRace) {
      member.send(playerRace.message);
    }
  });
}

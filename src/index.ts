import { sendError } from './utility/error';
import { addPlayer } from './actions/account';
import { actions } from './actions/actions';
import { infos } from './infos/infos';
import * as dotenv from 'dotenv';
dotenv.config();
import { logChannelId } from './config.json';

import { Client, Collection, TextChannel, RichEmbed, GuildMember, Message } from 'discord.js';

import { AppDAO } from './database/dao';
import { RaceRepo, race, races } from './database/races';
import { PlayerRepo, player } from './database/players';

const dao = new AppDAO('./database.sqlite3');

export class Bot {
  client: Client;
  logChannel!: TextChannel;
  races: Collection<number, race>;
  players: Collection<string, player>;
  actions: Collection<string, command>;
  infos: Collection<string, command>;

  //database
  racesRepo = new RaceRepo(dao);
  playerRepo = new PlayerRepo(dao);

  constructor() {
    this.client = new Client();

    this.races = new Collection();
    this.players = new Collection();

    this.actions = new Collection();
    this.infos = new Collection();

    this.racesRepo = new RaceRepo(dao);
    this.playerRepo = new PlayerRepo(dao);
  }
}

export const bot = new Bot();

// init bot
bot.client.once('ready', () => {
  const targetChannel = bot.client.channels.get(logChannelId);
  if (targetChannel instanceof TextChannel) {
    bot.logChannel = targetChannel;
  } else {
    throw new Error('Log Channel has to be a textchannel');
  }

  console.log('ready!');
  bot.logChannel.send('I am awake');
});

// load database collections
bot.racesRepo
  .getAll()
  .then(res => {
    res.forEach(race => {
      bot.races.set(race.id, race);
    });
  })
  .catch(err => console.error(err));

bot.playerRepo
  .getAll()
  .then(res => {
    res.forEach(player => {
      bot.players.set(player.discordId, player);
    });
  })
  .catch(err => console.error(err));

// load actions / info collections
actions.forEach(act => bot.actions.set(act.name, act));
infos.forEach(info => bot.infos.set(info.name, info));

// login in bot after setup started
bot.client.login(process.env.BOT_TOKEN);

// eventhandlers
bot.client.on('guildMemberAdd', member => {
  addPlayer(member);
});

bot.client.on('message', message => {
  if (message.author.bot) return;
  let commandType = null;
  if (message.content.startsWith('!')) {
    commandType = 'action';
  } else if (message.content.startsWith('?')) {
    commandType = 'info';
  } else {
    return;
  }

  const args = message.content.slice(1).split(/ +/);
  if (!args || args.length < 1) {
    return;
  }
  const commandName = args.shift()!.toLowerCase();

  // separate info and actions
  switch (commandType) {
    case 'action':
      const action =
        bot.actions.get(commandName) ||
        bot.actions.find(act => (act.aliases ? act.aliases.includes(commandName) : false));
      if (!action) {
        sendError('unknown action', message);
      } else if (action.guildOnly && message.channel.type !== 'text') {
        sendError('This action can only be performed in a Guild Textchannel', message);
      } else {
        action.execute(args, message);
      }
      break;
    case 'info':
      const info =
        bot.infos.get(commandName) || bot.infos.find(inf => (inf.aliases ? inf.aliases.includes(commandName) : false));
      if (info) {
        info.execute(args, message);
      } else {
        sendError("this info command dosn't exist!", message);
        bot.infos.get('help')!.execute(args, message);
      }
      break;
  }
});

export interface command {
  name: string;
  description: string;
  usage?: string;
  aliases?: string[];
  requireArgs?: boolean;
  guildOnly?: boolean;
  execute: commandExecute;
}

export interface commandExecute {
  (args: string[], message: Message): void;
}

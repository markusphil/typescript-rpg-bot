import { ItemRepo } from './database/items';
import { EnemyRepo } from './database/enemies';
import { sendError } from './utility/error';
import { addPlayer } from './commands/actions/player/account';
import { actions } from './commands/actions/actions';
import { infos } from './commands/infos/infos';
import * as dotenv from 'dotenv';
dotenv.config();
import { logChannelId } from './config.json';

import { Client, Collection, TextChannel, Message } from 'discord.js';

import { AppDAO } from './database/dao';
import { RaceRepo } from './database/races';
import { PlayerRepo } from './database/players';
import { ModifierRepo } from './database/modifiers';
import { race, player, modifier, enemyType, command } from './dataTypes/interfaces';

const dao = new AppDAO('./database.sqlite3');

export class Bot {
  client: Client;
  logChannel!: TextChannel;

  races: Collection<number, race>;
  players: Collection<string, player>;
  modifiers: Collection<number, modifier>;
  enemies: Collection<number, enemyType>;

  actions: Collection<string, command>;
  infos: Collection<string, command>;

  //database
  racesRepo = new RaceRepo(dao);
  playerRepo = new PlayerRepo(dao);
  modifierRepo = new ModifierRepo(dao);
  enemyRepo = new EnemyRepo(dao);
  itemRepo = new ItemRepo(dao);

  constructor() {
    this.client = new Client();

    this.races = new Collection();
    this.players = new Collection();
    this.modifiers = new Collection();
    this.enemies = new Collection();

    this.actions = new Collection();
    this.infos = new Collection();
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

bot.modifierRepo
  .getAll()
  .then(res => {
    res.forEach(mod => {
      bot.modifiers.set(mod.id, mod);
    });
  })
  .catch(err => console.error(err));

bot.enemyRepo.getAll().then(res => {
  res.forEach((en, key) => {
    bot.enemies.set(en.id || key, en);
  });
});

// load actions / info collections
actions.forEach(act => bot.actions.set(act.name, act));
infos.forEach(info => bot.infos.set(info.name, info));

// login in bot after setup started
bot.client.login(process.env.BOT_TOKEN).catch(err => console.log(err));

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

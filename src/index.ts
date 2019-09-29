import * as dotenv from 'dotenv';
dotenv.config();

import * as Discord from 'discord.js';

const client = new Discord.Client();

let rpgChannel: Discord.TextChannel;

client.once('ready', () => {
  console.log('ready!');
  const targetChannel: Discord.Channel | undefined = client.channels.get('627866917394317334');
  if (targetChannel instanceof Discord.TextChannel) rpgChannel = targetChannel;
  if (targetChannel) {
    rpgChannel.send('I am awake');
  }
});

client.login(process.env.BOT_TOKEN);

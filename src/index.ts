import * as dotenv from 'dotenv';
dotenv.config();

import Discord from 'discord.js';

const client = new Discord.Client();

client.once('ready', () => console.log('ready!'));

client.login(process.env.BOT_TOKEN);

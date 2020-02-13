import { bot } from './../index';
import { Message, RichEmbed } from 'discord.js';
// a function that sends a rich Embed with the error description to the reffered user
export const sendError = (description: string, message?: Message) => {
  const embed = new RichEmbed()
    .setColor(0xe04050)
    .setTitle('Error')
    .setDescription(description);
  if (message) {
    message.author.send(embed);
  } else {
    bot.logChannel.send(embed);
  }
};

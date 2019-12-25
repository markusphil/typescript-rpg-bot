import { player } from './../database/players';
import { User } from "discord.js";
import { bot } from '..';

export function getPlayer(member: User): player | undefined {
    return bot.players.get(member.id);
}
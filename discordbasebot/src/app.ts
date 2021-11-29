import { Client } from "discord.js";
import Bot from "./classes/actors/bot";
import * as dotenv from 'dotenv';

dotenv.config();

const client = new Client({ intents: ['GUILDS',
'DIRECT_MESSAGES',
'GUILD_MESSAGES' ],
partials: ['MESSAGE', 'CHANNEL']});


const bot = new Bot(client);

client.login(process.env.TOKEN);


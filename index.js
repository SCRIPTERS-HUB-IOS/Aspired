// index.js
const { 
  Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder 
} = require('discord.js');
require('dotenv').config();

// ENV VARIABLES (set these in Railway)
// TOKEN = your bot token
// CLIENT_ID = your bot client ID
// GUILD_ID = your server ID (for dev/testing)

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// Register Slash Commands
const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),

  new SlashCommandBuilder()
    .setName('railway')
    .setDescription('Check Railway bot status')
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Registering slash commands...');
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );
    console.log('✅ Slash commands registered.');
  } catch (err) {
    console.error(err);
  }
})();

// Bot Events
client.once('ready', () => {
  console.log(`🚀 Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('🏓 Pong!');
  }

  if (interaction.commandName === 'railway') {
    await interaction.reply('🚂 Railway bot is online and running!');
  }
});

client.login(process.env.TOKEN);

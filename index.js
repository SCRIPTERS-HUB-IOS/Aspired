// index.js
const express = require('express');
const { 
  Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder 
} = require('discord.js');
require('dotenv').config();

// --- Keep Alive Web Server (Render requirement) ---
const app = express();
app.get('/', (req, res) => res.send('🚀 Bot is running on Render.'));
app.listen(3000, () => console.log('🌐 Render keep-alive server started.'));

// --- Discord Client ---
const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// --- Slash Commands ---
const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),

  new SlashCommandBuilder()
    .setName('render')
    .setDescription('Check if bot is running on Render')
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

// --- Register Commands ---
(async () => {
  try {
    console.log('Registering slash commands...');

    // Guild commands (instant in your test server)
    if (process.env.GUILD_ID) {
      await rest.put(
        Routes.applicationGuildCommands(
          process.env.CLIENT_ID,
          process.env.GUILD_ID
        ),
        { body: commands }
      );
      console.log('✅ Guild slash commands registered.');
    }

    // Global commands (take up to 1h to appear everywhere)
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log('🌍 Global slash commands registered.');
  } catch (err) {
    console.error('❌ Error registering commands:', err);
  }
})();

// --- Bot Events ---
client.once('ready', () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('🏓 Pong!');
  }

  if (interaction.commandName === 'render') {
    await interaction.reply('🌐 Bot is alive and running on Render!');
  }
});

client.login(process.env.TOKEN);

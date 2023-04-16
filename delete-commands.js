const { REST, Routes } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
require("dotenv").config();
const clientId = process.env.CLIENT_ID;
const token = process.env.BOT_TOKEN;

// Delete all existing commands before syncing new commands

const newrest = new REST().setToken(token);

newrest
  .put(Routes.applicationCommands(clientId), { body: [] })
  .then(() => console.log("Successfully deleted all application commands."))
  .catch(console.error);

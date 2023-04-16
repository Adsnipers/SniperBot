const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("server")
    .setDescription("Provides information about the server."),
  async execute(interaction) {
    // launch MongoDB connection and query database
    const { MongoClient } = require("mongodb");
    const uri = process.env.MONGODB_URI;
    const dbClient = new MongoClient(uri);
    async function run() {
      try {
        const database = dbClient.db("sb_servers");
        const servers = database.collection("servers");
        const query = { id: `${interaction.guild.id}` };
        const server = await servers.findOne(query);
        if (server != null) {
          await interaction.reply(
            `This server is ${interaction.guild.id} (${server.id}) and has ${interaction.guild.memberCount} members\rGPTChecking = ${server.gptChecking}`
          );
        } else {
          await interaction.reply(
            `This server is  ${interaction.guild.name} and has ${interaction.guild.memberCount} members.`
          );
        }
      } finally {
        await dbClient.close();
      }
    }
    run().catch(console.dir);
  },
};
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Provides information about the user.'),
		
	async execute(interaction) {
		const { MongoClient } = require("mongodb");
		const uri = process.env.MONGODB_URI;
		const dbClient = new MongoClient(uri);
		async function run() {
			try {
			  const database = dbClient.db('sb_users');
			  const admins = database.collection('admins');
			  const query = { uid: `${interaction.user.id}` };
			  const user = await admins.findOne(query);
			  console.log(user);

			// interaction.user is the object representing the User who ran the command
			// interaction.member is the GuildMember object, which represents the user in the specific guild
			  await interaction.reply(`This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}. This user's role in SniperBot's backend is **${user.role}**`);
			} finally {
			  // Ensures that the client will close when you finish/error
			  await dbClient.close();
			}
		  }
		  run().catch(console.dir);

	},
};
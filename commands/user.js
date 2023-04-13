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
				
			// Respond to the command with user information
			// If user exists in the database, print database information, if not, print base discord information.
			if (user != null) {
			  await interaction.reply(`Hi ${interaction.user.username}! \rYour UID is: ${interaction.user.id} \rYou joined this server on ${interaction.member.joinedAt} \rand your role in my backend system is ***${user.role}***`);
			} else {
				await interaction.reply(`Hi ${interaction.user.username}! \rYour UID is: ${interaction.user.id} \rand you joined this server on ${interaction.member.joinedAt}`);
			};
			} finally {
			  // Ensure the MongoDB client is closed
			  await dbClient.close();
			}
		  }
		  run().catch(console.dir);
	},
};
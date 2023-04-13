const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Bans a user')
		.addUserOption(option =>
		option
			.setName('target')
			.setDescription('The user to ban')
			.setRequired(true))
			.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
			.setDMPermission(false),
		
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
			if (user != null && user.permission_level >= 1) {
			  const user = interaction.options.getUser('target');
				guild.members.ban(user);
			} else {
				
			};
			} finally {
			  // Ensure the MongoDB client is closed
			  await dbClient.close();
			}
		  }
		  run().catch(console.dir);
	},
};
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	cooldown: 5,
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
		const guild = interaction.guild
		async function run() {
			try {
				const database = dbClient.db('sb_users');
				const admins = database.collection('admins');
				const query = { uid: `${interaction.user.id}` };
				const user = await admins.findOne(query);

				// Check if command initiator is a global admin
				// ban mentioned user
				// If not global admin, check if Server Admin
				// Ban mentioned user
				if (user != null) {
					const banuser = interaction.options.getUser('target');
					await guild.members.ban(banuser);
					await interaction.reply(`Banned ${banuser}`);
					console.log(`${user.nickname} banned ${banuser} from ${guild.name}`)
				} else {
					await interaction.reply(`Bro, Just right click them....`);
				};
			} finally {
				// Ensure the MongoDB client is closed
				await dbClient.close();
			}
		}
		run().catch(console.dir);
	},
};
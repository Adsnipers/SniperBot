const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ask-gpt')
		.setDescription('Send a message to GPT-4')
		.addStringOption(option =>
			option
				.setName('message')
				.setDescription('Message that you want to send to GPT-4')
				.setRequired(true)),
	async execute(interaction) {
		console.log(interaction.options.getString('message'))
		const { Configuration, OpenAIApi } = require("openai");
		const configuration = new Configuration({
			apiKey: process.env.OPENAI_API_KEY,
		});

		const openai = new OpenAIApi(configuration);

		async function runCompletion() {
			const completion = await openai.createCompletion({
				model: "text-davinci-003",
				max_tokens: 7,
				temperature: 0.80,
				stop: '(?!\\?$)|($|\\n)$',
				prompt: `Respond to: ${interaction.options.getString('message')}`,
			});
			if (completion) {
				await interaction.reply(`**>** ${interaction.options.getString('message')}\r${completion.data.choices[0].text}`);
				console.log(completion.data)
			} else {
				await interaction.reply(`Hmm. something went wrong. please try again later.\rIf this persists, please let my developer know!`);
			}
		}

		runCompletion();
	}
}
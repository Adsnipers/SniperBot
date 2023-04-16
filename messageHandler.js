async function check(message) {
	if (message.author.bot) return;
	const { Configuration, OpenAIApi } = require("openai");
	const configuration = new Configuration({
  	apiKey: process.env.OPENAI_API_KEY,
});
	
const openai = new OpenAIApi(configuration);

async function runCompletion () {
	const completion = await openai.createCompletion({
  	model: "text-davinci-003",
  	prompt: `Reply true or false if the following chat message contains any racism, toxicity or bullying: ${message.content}: `,
	});
	if (completion.data.choices[0].text.includes("True")) {
		console.log(message.author.username)
		message.delete(1000);
		console.log(message.content)
	}
}

runCompletion();
}

module.exports = {
	check
}
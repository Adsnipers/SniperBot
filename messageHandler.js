async function check(message, Client) {
  if (message.author.bot) return;
  const { Configuration, OpenAIApi } = require("openai");
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  async function runCompletion() {
		const prompt = require('./autodelete_prompt.json');
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt[0]} ${message.content}: `,
    });
    if (completion.data.choices[0].text.includes("True")) {
			console.log(`DELETED: ${message.author.username}: ${message.content}`)
      message.delete(1000);
    }
  }

  // launch MongoDB connection and query database
  const { MongoClient } = require("mongodb");
  const uri = process.env.MONGODB_URI;
  const dbClient = new MongoClient(uri);
  async function run() {
    try {
      const database = dbClient.db("sb_servers");
      const servers = database.collection("servers");
      const query = { id: `${message.guild.id}` };
      const server = await servers.findOne(query);
			// If serverLocked = true, delete any message.
      if (server != null) {
				if (server.gptChecking == true) {
					if (!message.member.roles.cache.has(server.immunityRole)) {
					// If server has gptChecking enabled and user is not immune, run AI checking
        	runCompletion();
				} else {
					// If user is immune, return
					return;
				}
				}
				if (server.lockdown == true) {
					message.delete(1000);
				}
      } else {
				// If server does not have gptChecking enabled, return.
        return;
      }
    } finally {
      await dbClient.close();
    }
  }
  run().catch(console.dir);
}



module.exports = {
  check,
};

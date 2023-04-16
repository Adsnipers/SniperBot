async function check(message) {
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
      console.log(message.author.username);
      message.delete(1000);
      console.log(message.content);
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
      if (server != null && server.gptChecking == true) {
				// If server has gptChecking enabled, run AI checking
        runCompletion();
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

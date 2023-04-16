async function check(message) {
  if (message.author.bot) return;
  const { Configuration, OpenAIApi } = require("openai");
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  async function runCompletion() {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Reply true or false if the following chat message contains any racism, toxicity or bullying: ${message.content}: `,
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
        runCompletion();
      } else {
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

const { MongoClient } = require("mongodb");
const uri =
    "mongodb://localhost:27017/?readPreference=primary&directConnection=true&ssl=false";

export default async function handler(req, res) {
    const client = new MongoClient(uri);
    const { query } = req;

    try {
        if (!query["sender"] || !query["password"] || query["password"] != process.env.PASSWORD) throw new Error("Invalid query");

        await client.connect();
        const database = client.db('MessangerDB');
        const messages = await database.collection('Messages').deleteMany({sender: query["sender"]});
        res.status(200).json({ messages })
    } catch (e) {
        console.log(e)
        res.status(500).json({ error: true })
    } finally {
        await client.close();
    }
}
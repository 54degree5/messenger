const { MongoClient } = require("mongodb");
const uri =
    "mongodb://localhost:27017/?readPreference=primary&directConnection=true&ssl=false";

export default async function handler(req, res) {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const database = client.db('MessangerDB');
        const messages = await database.collection('Messages').find({}).toArray();
        res.status(200).json({ messages })
    } catch (e) {
        console.log(e)
        res.status(500).json({ messages: [] })
    } finally {
        await client.close();
    }
}
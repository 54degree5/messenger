const { MongoClient } = require("mongodb");
const uri =
    "mongodb://localhost:27017/?readPreference=primary&directConnection=true&ssl=false";

export default async function handler(req, res) {
    const client = new MongoClient(uri);
    try {
        const body = req.body

        await client.connect();
        const database = client.db('MessangerDB');
        const messages = database.collection('Messages')
        const doc = {
            sender: body.sender,
            content: body.content,
        }
        await messages.insertOne(doc);      
        res.status(200).json({})
    } catch (e) {
        console.log(e)
        res.status(500).json({})
    } finally {
        await client.close();
    }
    
}
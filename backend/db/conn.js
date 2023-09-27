require('dotenv').config()

const { MongoClient, ServerApiVersion } = require('mongodb')

const uri = process.env.ATLAS_URI

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

async function connect() {
  try {
    console.log('Connecting to MongoDB Atlas...')
    await client.connect()
    console.log('Connected to MongoDB Atlas...')
  } catch (e) {
    console.error(e)
  }
}

connect()

let db = client.db('researchhubdb')

module.exports = db

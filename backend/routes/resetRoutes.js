const express = require('express')
const router = express.Router()
const { MongoClient, ServerApiVersion } = require('mongodb')
const db = require('../db/conn')

const uri = process.env.ATLAS_URI

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

// Endpoint to clear all collections and create a new database
router.delete('/', async (req, res) => {
  try {
    const collections = await db.listCollections().toArray()
    for (let collection of collections) {
      await db.collection(collection.name).drop()
    }

    const newDb = client.db('researchhubdb')
    await newDb.createCollection('adminusers')

    res.status(204).send()
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

module.exports = router

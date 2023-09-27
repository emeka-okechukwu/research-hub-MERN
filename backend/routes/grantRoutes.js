const express = require('express')
const router = express.Router()
const db = require('../db/conn.js')
const { ObjectId } = require('mongodb')
const { authenticateToken } = require('../middleware/auth')

// Endpoint to add a new grant
router.post('/', authenticateToken, async (req, res) => {
  try {
    const collection = await db.collection('grants')
    const newGrant = {
      grantName: req.body.grantName,
      currency: req.body.currency,
      maximumAward: req.body.maximumAward,
      closingDate: req.body.closingDate,
      websiteLink: req.body.websiteLink,
      grantDescription: req.body.grantDescription,
      submittedBy: new ObjectId(req.user.id),
      lastModified: new Date(),
    }
    const result = await collection.insertOne(newGrant)
    res.status(204).send(result)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Endpoint to get all grants
router.get('/', authenticateToken, async (req, res) => {
  try {
    const collection = await db.collection('grants')
    const currentDate = new Date().toISOString().substring(0, 16)
    const grantList = await collection
      .find({ closingDate: { $gte: currentDate } })
      .sort({ closingDate: 1 })
      .toArray()
    res.json(grantList)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Endpoint to get details of a specific grant
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const collection = await db.collection('grants')
    const grant = await collection.findOne({
      _id: new ObjectId(req.params.id),
    })
    if (!grant) {
      return res.status(404).json({ message: 'Grant not found' })
    }
    res.status(200).send(grant)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Endpoint to update a grant
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const collection = await db.collection('grants')
    const grantId = req.params.id
    const updatedGrant = {
      grantName: req.body.grantName,
      currency: req.body.currency,
      maximumAward: req.body.maximumAward,
      closingDate: req.body.closingDate,
      websiteLink: req.body.websiteLink,
      grantDescription: req.body.grantDescription,
      submittedBy: new ObjectId(req.user.id),
      lastModified: new Date(),
    }
    const result = await collection.updateOne(
      { _id: new ObjectId(grantId), submittedBy: new ObjectId(req.user.id) },
      { $set: updatedGrant }
    )
    if (result.modifiedCount === 1) {
      res.status(204).send()
    } else {
      res.status(404).json({ message: 'Grant not found' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Endpoint to delete a grant
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const collection = await db.collection('grants')
    const grantId = req.params.id
    const result = await collection.deleteOne({
      _id: new ObjectId(grantId),
      submittedBy: new ObjectId(req.user.id),
    })
    if (result.deletedCount === 1) {
      res.status(204).send()
    } else {
      res.status(404).json({ message: 'Grant not found' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

module.exports = router

const express = require('express')
const router = express.Router()
const db = require('../db/conn.js')
const { ObjectId } = require('mongodb')
const { authenticateToken } = require('../middleware/auth')

// Endpoint to add a new event
router.post('/', authenticateToken, async (req, res) => {
  try {
    const collection = await db.collection('events')
    const newEvent = {
      eventName: req.body.eventName,
      eventDate: req.body.eventDate,
      eventType: req.body.eventType,
      eventVenue: req.body.eventVenue,
      eventContent: req.body.eventContent,
      submittedBy: new ObjectId(req.user.id),
      lastModified: new Date(),
    }
    const result = await collection.insertOne(newEvent)
    res.status(204).send(result)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Endpoint to get all events
router.get('/', authenticateToken, async (req, res) => {
  try {
    const collection = await db.collection('events')
    const currentDate = new Date().toISOString().substring(0, 16)
    const eventList = await collection
      .find({ eventDate: { $gte: currentDate } })
      .sort({ eventDate: 1 })
      .toArray()
    res.json(eventList)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Endpoint to get details of a specific event
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const collection = await db.collection('events')
    const event = await collection.findOne({
      _id: new ObjectId(req.params.id),
    })
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }
    res.status(200).send(event)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Endpoint to update an event
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const collection = await db.collection('events')
    const eventId = req.params.id
    const updatedEvent = {
      eventName: req.body.eventName,
      eventDate: req.body.eventDate,
      eventType: req.body.eventType,
      eventVenue: req.body.eventVenue,
      eventContent: req.body.eventContent,
      submittedBy: new ObjectId(req.user.id),
      lastModified: new Date(),
    }
    const result = await collection.updateOne(
      { _id: new ObjectId(eventId), submittedBy: new ObjectId(req.user.id) },
      { $set: updatedEvent }
    )
    if (result.modifiedCount === 1) {
      res.status(204).send()
    } else {
      res.status(404).json({ message: 'Event not found' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Endpoint to delete an event
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const collection = await db.collection('events')
    const eventId = req.params.id
    const result = await collection.deleteOne({
      _id: new ObjectId(eventId),
      submittedBy: new ObjectId(req.user.id),
    })
    if (result.deletedCount === 1) {
      res.status(204).send()
    } else {
      res.status(404).json({ message: 'Event not found' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

module.exports = router

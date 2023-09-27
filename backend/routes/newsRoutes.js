const express = require('express')
const router = express.Router()
const db = require('../db/conn.js')
const { ObjectId } = require('mongodb')
const { authenticateToken } = require('../middleware/auth')

// Endpoint to add a new news article
router.post('/', authenticateToken, async (req, res) => {
  try {
    const collection = await db.collection('news')
    const newNewsArticle = {
      newsTitle: req.body.newsTitle,
      newsContent: req.body.newsContent,
      publishedOn: req.body.publishedOn,
      submittedBy: new ObjectId(req.user.id),
      lastModified: new Date(),
    }
    const result = await collection.insertOne(newNewsArticle)
    res.status(204).send(result)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Endpoint to get all news articles
router.get('/', authenticateToken, async (req, res) => {
  try {
    const collection = await db.collection('news')
    const newsList = await collection
      .find({})
      .sort({ publishedOn: -1 })
      .toArray()
    res.json(newsList)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Endpoint to get details of a specific news article
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const collection = await db.collection('news')
    const news = await collection.findOne({
      _id: new ObjectId(req.params.id),
    })
    if (!news) {
      return res.status(404).json({ message: 'News not found' })
    }
    res.status(200).send(news)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Endpoint to update a news article
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const collection = await db.collection('news')
    const newsId = req.params.id
    const updatedNewsArticle = {
      newsTitle: req.body.newsTitle,
      newsContent: req.body.newsContent,
      publishedOn: req.body.publishedOn,
      submittedBy: new ObjectId(req.user.id),
      lastModified: new Date(),
    }
    const result = await collection.updateOne(
      { _id: new ObjectId(newsId), submittedBy: new ObjectId(req.user.id) },
      { $set: updatedNewsArticle }
    )
    if (result.modifiedCount === 1) {
      res.status(204).send()
    } else {
      res.status(404).json({ message: 'News not found' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Endpoint to delete a news article
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const collection = await db.collection('news')
    const newsId = req.params.id
    const result = await collection.deleteOne({
      _id: new ObjectId(newsId),
      submittedBy: new ObjectId(req.user.id),
    })
    if (result.deletedCount === 1) {
      res.status(204).send()
    } else {
      res.status(404).json({ message: 'News not found' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

module.exports = router

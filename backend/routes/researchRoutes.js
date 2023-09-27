const express = require('express')
const router = express.Router()
const db = require('../db/conn.js')
const { ObjectId } = require('mongodb')
const { authenticateToken } = require('../middleware/auth')

// Endpoint to add a new research
router.post('/', authenticateToken, async (req, res) => {
  try {
    const collection = await db.collection('researches')
    const newResearch = {
      researchTopic: req.body.researchTopic,
      researchProblem: req.body.researchProblem,
      researchHypothesis: req.body.researchHypothesis,
      dataCollectionMethod: req.body.dataCollectionMethod,
      dataFindings: req.body.dataFindings,
      researchAbstract: req.body.researchAbstract,
      grantInformation: req.body.grantInformation,
      publication: req.body.publication,
      published: 0,
      submittedBy: new ObjectId(req.user.id),
      lastModified: new Date(),
    }
    const result = await collection.insertOne(newResearch)
    res.status(204).send(result)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Endpoint to get ongoing research submitted by the user
router.get('/ongoing', authenticateToken, async (req, res) => {
  try {
    const collection = await db.collection('researches')
    const ongoingResearch = await collection
      .find({
        submittedBy: new ObjectId(req.user.id),
        published: 0,
      })
      .sort({ lastModified: -1 })
      .toArray()
    res.status(200).send(ongoingResearch)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Endpoint to get published research submitted by the user
router.get('/published', authenticateToken, async (req, res) => {
  try {
    const collection = await db.collection('researches')
    const publishedResearch = await collection
      .find({
        submittedBy: new ObjectId(req.user.id),
        published: 1,
      })
      .sort({ lastModified: -1 })
      .toArray()
    res.status(200).send(publishedResearch)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Endpoint to get all ongoing research with user details
router.get('/all/ongoing', authenticateToken, async (req, res) => {
  try {
    const collection = await db.collection('researches')
    const ongoingResearch = await collection
      .aggregate([
        {
          $match: { published: 0 },
        },
        {
          $lookup: {
            from: 'researchers',
            localField: 'submittedBy',
            foreignField: '_id',
            as: 'userDetails',
          },
        },
        {
          $unwind: '$userDetails',
        },
        {
          $project: {
            _id: 1,
            researchTopic: 1,
            researchProblem: 1,
            researchHypothesis: 1,
            dataCollectionMethod: 1,
            dataFindings: 1,
            researchAbstract: 1,
            grantInformation: 1,
            publication: 1,
            published: 1,
            submittedBy: 1,
            lastModified: 1,
            userDetails: {
              firstName: 1,
              lastName: 1,
              department: 1,
              email: 1,
            },
          },
        },
      ])
      .toArray()
    res.status(200).send(ongoingResearch)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Endpoint to get all published research with user details
router.get('/all/published', authenticateToken, async (req, res) => {
  try {
    const collection = await db.collection('researches')
    const ongoingResearch = await collection
      .aggregate([
        {
          $match: { published: 1 },
        },
        {
          $lookup: {
            from: 'researchers',
            localField: 'submittedBy',
            foreignField: '_id',
            as: 'userDetails',
          },
        },
        {
          $unwind: '$userDetails',
        },
        {
          $project: {
            _id: 1,
            researchTopic: 1,
            researchProblem: 1,
            researchHypothesis: 1,
            dataCollectionMethod: 1,
            dataFindings: 1,
            researchAbstract: 1,
            grantInformation: 1,
            publication: 1,
            published: 1,
            submittedBy: 1,
            lastModified: 1,
            userDetails: {
              firstName: 1,
              lastName: 1,
              department: 1,
              email: 1,
            },
          },
        },
      ])
      .toArray()
    res.status(200).send(ongoingResearch)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Endpoint to add a new team
router.post('/team', authenticateToken, async (req, res) => {
  try {
    const collection = await db.collection('teams')
    const existingTeam = await collection.findOne({
      researchId: new ObjectId(req.body.researchId),
      userId: new ObjectId(req.user.id),
    })
    if (existingTeam) {
      res.status(409).json({ message: 'Team already exists' })
    } else {
      const newTeam = {
        researchId: new ObjectId(req.body.researchId),
        userId: new ObjectId(req.user.id),
      }
      const result = await collection.insertOne(newTeam)
      res.status(204).send(result)
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Endpoint to get collaborative research submitted by the user
router.get('/collaborative', authenticateToken, async (req, res) => {
  try {
    const collection = await db.collection('researches')
    const collaborativeResearch = await collection
      .aggregate([
        {
          $lookup: {
            from: 'researchers',
            localField: 'submittedBy',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $lookup: {
            from: 'teams',
            localField: '_id',
            foreignField: 'researchId',
            as: 'team',
          },
        },
        {
          $match: {
            'team.userId': new ObjectId(req.user.id),
          },
        },
        {
          $sort: {
            lastModified: -1,
          },
        },
      ])
      .toArray()
    res.status(200).send(collaborativeResearch)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Endpoint to get a specific research details
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const collection = await db.collection('researches')
    const research = await collection.findOne({
      _id: new ObjectId(req.params.id),
      submittedBy: new ObjectId(req.user.id),
    })
    if (!research) {
      return res.status(404).json({ message: 'Research not found' })
    }
    res.status(200).send(research)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Endpoint to update a research
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const collection = await db.collection('researches')
    const researchId = req.params.id
    const updatedResearch = {
      researchTopic: req.body.researchTopic,
      researchProblem: req.body.researchProblem,
      researchHypothesis: req.body.researchHypothesis,
      dataCollectionMethod: req.body.dataCollectionMethod,
      dataFindings: req.body.dataFindings,
      researchAbstract: req.body.researchAbstract,
      grantInformation: req.body.grantInformation,
      publication: req.body.publication,
      lastModified: new Date(),
    }
    const result = await collection.updateOne(
      { _id: new ObjectId(researchId), submittedBy: new ObjectId(req.user.id) },
      { $set: updatedResearch }
    )
    if (result.modifiedCount === 1) {
      res.status(204).send()
    } else {
      res.status(404).json({ message: 'Research not found' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Endpoint to publish a research
router.put('/publish/:id', authenticateToken, async (req, res) => {
  try {
    const collection = await db.collection('researches')
    const researchId = req.params.id
    const updatedResearch = {
      researchTopic: req.body.researchTopic,
      researchProblem: req.body.researchProblem,
      researchHypothesis: req.body.researchHypothesis,
      dataCollectionMethod: req.body.dataCollectionMethod,
      dataFindings: req.body.dataFindings,
      researchAbstract: req.body.researchAbstract,
      grantInformation: req.body.grantInformation,
      publication: req.body.publication,
      published: 1,
      lastModified: new Date(),
    }
    const result = await collection.updateOne(
      { _id: new ObjectId(researchId), submittedBy: new ObjectId(req.user.id) },
      { $set: updatedResearch }
    )
    if (result.modifiedCount === 1) {
      res.status(204).send()
    } else {
      res.status(404).json({ message: 'Research not found' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Endpoint to delete a research
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const collection = await db.collection('researches')
    const researchId = req.params.id
    const result = await collection.deleteOne({
      _id: new ObjectId(researchId),
      submittedBy: new ObjectId(req.user.id),
    })
    if (result.deletedCount === 1) {
      res.status(204).send()
    } else {
      res.status(404).json({ message: 'Research not found' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Endpoint to get a specific research details (public)
router.get('/public/:id', authenticateToken, async (req, res) => {
  try {
    const collection = await db.collection('researches')
    const research = await collection.findOne({
      _id: new ObjectId(req.params.id),
    })
    if (!research) {
      return res.status(404).json({ message: 'Research not found' })
    }
    res.status(200).send(research)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Endpoint to update a research as a team member
router.put('/team/research/:id', authenticateToken, async (req, res) => {
  try {
    const collection = await db.collection('researches')
    const researchId = req.params.id
    const updatedResearch = {
      researchTopic: req.body.researchTopic,
      researchProblem: req.body.researchProblem,
      researchHypothesis: req.body.researchHypothesis,
      dataCollectionMethod: req.body.dataCollectionMethod,
      dataFindings: req.body.dataFindings,
      researchAbstract: req.body.researchAbstract,
      grantInformation: req.body.grantInformation,
      publication: req.body.publication,
      lastModified: new Date(),
    }
    const result = await collection.updateOne(
      { _id: new ObjectId(researchId) },
      { $set: updatedResearch }
    )
    if (result.modifiedCount === 1) {
      res.status(204).send()
    } else {
      res.status(404).json({ message: 'Research not found' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Endpoint for researcher to leave a team
router.delete('/team/:id', authenticateToken, async (req, res) => {
  try {
    const collection = await db.collection('teams')
    const result = await collection.deleteOne({
      researchId: new ObjectId(req.params.id),
      userId: new ObjectId(req.user.id),
    })
    if (result.deletedCount === 0) {
      res.status(404).json({ message: 'Team not found' })
    } else {
      res.status(204).send()
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Endpoint to get the research leader
router.get('/team/:id/leader', authenticateToken, async (req, res) => {
  try {
    const collection = await db.collection('researches')
    const research = await collection.findOne({
      _id: new ObjectId(req.params.id),
    })
    const userCollection = await db.collection('researchers')
    const researchLeader = await userCollection.findOne({
      _id: new ObjectId(research.submittedBy),
    })
    res.status(200).send(researchLeader)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Endpoint to get research team members
router.get('/team/:id/members', authenticateToken, async (req, res) => {
  try {
    const teamCollection = await db.collection('teams')
    const teamMembers = await teamCollection
      .aggregate([
        { $match: { researchId: new ObjectId(req.params.id) } },
        {
          $lookup: {
            from: 'researchers',
            localField: 'userId',
            foreignField: '_id',
            as: 'user',
          },
        },
        { $unwind: '$user' },
      ])
      .toArray()
    res.status(200).send(teamMembers)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

module.exports = router

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const express = require('express')
const router = express.Router()
const db = require('../db/conn.js')
const { ObjectId } = require('mongodb')
const { authenticateToken } = require('../middleware/auth')

// Endpoint to authenticate a researcher
router.post('/researcher/login', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body
    const collection = db.collection('researchers')

    let user = await collection.findOne({ email })
    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10)
      const newUser = {
        firstName,
        lastName,
        gender: '',
        phoneNumber: '',
        department: '',
        rank: '',
        interestAreas: '',
        photoUrl: '',
        email,
        verified: 2,
        password: hashedPassword,
      }
      await collection.insertOne(newUser)
      user = newUser
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.SECRET_KEY
    )
    res.status(200).json({ token })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Endpoint to authenticate an admin user
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body
    const collection = db.collection('adminusers')

    let user = await collection.findOne({ email })
    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10)
      const newAdminUser = {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        email,
      }
      await collection.insertOne(newAdminUser)
      user = newAdminUser
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.SECRET_KEY
    )
    res.status(200).json({ token })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Endpoint to get all researchers as an admin user
router.get('/admin/researchers', authenticateToken, async (req, res) => {
  try {
    const collection = db.collection('researchers')
    const users = await collection.find().toArray()
    if (!users) {
      return res.status(404).json({ message: 'No users found' })
    }
    res.status(200).json({ users })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Endpoint to get all other researchers as a researcher
router.get(
  '/researcher/other-researchers',
  authenticateToken,
  async (req, res) => {
    try {
      const collection = db.collection('researchers')
      const userId = req.user.id
      const users = await collection
        .find({ verified: 2, _id: { $ne: new ObjectId(userId) } })
        .toArray()
      if (!users) {
        return res.status(404).json({ message: 'No users found' })
      }
      res.status(200).json({ users })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }
)

// Endpoint to get a researcher profile
router.get('/researcher/profile/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const collection = db.collection('researchers')
    const user = await collection.findOne({ _id: new ObjectId(id) })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.status(200).json({ user })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Endpoint to update a researcher profile
router.put('/researcher/profile/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const {
      firstName,
      lastName,
      gender,
      phoneNumber,
      department,
      rank,
      interestAreas,
    } = req.body
    const collection = db.collection('researchers')
    const user = await collection.findOne({ _id: new ObjectId(id) })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    if (req.user.id !== id) {
      return res.status(401).json({ message: 'Unauthorized access' })
    }
    await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          firstName,
          lastName,
          gender,
          phoneNumber,
          department,
          rank,
          interestAreas,
        },
      }
    )
    res.status(200).json({ message: 'User profile updated successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Endpoint to get an admin user profile
router.get('/admin/profile/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const collection = db.collection('adminusers')
    const user = await collection.findOne({ _id: new ObjectId(id) })
    if (!user) {
      return res.status(404).json({ message: 'Admin User not found' })
    }
    res.status(200).json({ user })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Endpoint to update an admin user profile
router.put('/admin/profile/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { firstName, lastName } = req.body
    const collection = db.collection('adminusers')
    const user = await collection.findOne({ _id: new ObjectId(id) })
    if (!user) {
      return res.status(404).json({ message: 'Admin User not found' })
    }
    if (req.user.id !== id) {
      return res.status(401).json({ message: 'Unauthorized access' })
    }
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { firstName, lastName } }
    )
    res.status(200).json({ message: 'Admin user profile updated successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

module.exports = router

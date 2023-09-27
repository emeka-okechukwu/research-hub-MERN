const express = require('express')
const cors = require('cors')
const userRoutes = require('./routes/userRoutes')
const researchRoutes = require('./routes/researchRoutes')
const grantRoutes = require('./routes/grantRoutes')
const eventRoutes = require('./routes/eventRoutes')
const newsRoutes = require('./routes/newsRoutes')
const resetRoutes = require('./routes/resetRoutes')

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.use('/users', userRoutes)
app.use('/research', researchRoutes)
app.use('/grant', grantRoutes)
app.use('/event', eventRoutes)
app.use('/news', newsRoutes)
app.use('/reset', resetRoutes)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

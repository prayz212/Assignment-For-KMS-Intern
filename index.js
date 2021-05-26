require('dotenv').config()
const express = require('express')
const mongose = require('mongoose')
const bookRoute = require('./routes/bookRoute')
const accountRoute = require('./routes/accountRoute')

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use('/book', bookRoute)
app.use('/account', accountRoute)

const PORT = process.env.PORT || 8080
const URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/Assignments'
const OPTIONS = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

mongose.connect(URI, OPTIONS)
.then(() => {
    app.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`))
})
.catch(error => console.log(error))
const express = require('express')
const router = require('./router')

const server = express()
const port = 777

server.use(express.json())
server.use('/api/posts', router)

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})
const express = require('express')
const path = require('path')
const app = express()
const port = 8092
app.use(express.static(path.join(__dirname, 'dist')))
app.listen(8092, () => {
    console.log('app listening on port' + ` ${port}`)
})
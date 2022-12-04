// Import required AWS SDK clients and commands for Node.js
import { CreateTableCommand } from "@aws-sdk/client-dynamodb";
import { ddbClient } from "./ddbClient.js";

const express = require('express')
const app = express()
const port = 3000

app.get('/', (req: any, res: { send: (arg0: string) => void }) => {
    res.send('Hello Worsld!')
})

app.listen(port, () => {
    console.log(`Example app listening on portss ${port}`)
})

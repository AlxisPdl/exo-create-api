const express = require('express');
const app = express();
const port = 3030;
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./config/database.config')

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        console.log(`Example app listening at http://localhost:${port}`)
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})
app.use(cors());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', require('./src/routes/user.routes'));


const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const app = express();
dotenv.config();

const dbService = require('./dBService');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//create
app.post('/insert', (req, res) => {
    const { product } = req.body;
    const db = dbService.getDbServiceInstance();

    const result = db.insertNewProduct(product);

    result
    .then(data => res.json({ data : data}))
    .catch(err => console.error(err))

});

//read
app.get('/getAll', (req, res) => {
    const db = dbService.getDbServiceInstance();

    const result = db.getAllData();

    result
    .then(data => res.json({data : data}))
    .catch(err => console.error(err));
});

//delete
app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    const db = dbService.getDbServiceInstance();

    const result = db.deleteRowById(id);

    result
    .then(data => res.json({ success : data}))
    .catch(err => console.error(err));
})

//search
app.get('/search/:name', (req, res) => {
    const { name } = req.params;
    const db = dbService.getDbServiceInstance();

    const result = db.searchByProduct(name);

    result
    .then(data => res.json({data : data}))
    .catch(err => console.error(err));
});

//patch
app.patch('/update', (req, res) => {
    const { id, product, price, quantity, mass} = req.body;
    const db = dbService.getDbServiceInstance();

    const result = db.updateRowById(id, product, price, quantity, mass);

    result
    .then(data => res.json({ success : data}))
    .catch(err => console.error(err));
});

app.listen(process.env.PORT, () => console.log('app is running'));
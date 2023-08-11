const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');

const app = express();
dotenv.config();

const dbService = require('./dBService');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve HTML files from the html directory
app.use('/html', express.static(path.join(__dirname, '../client/html')));

// Serve CSS files from the css directory
app.use('/css', express.static(path.join(__dirname, '../client/css')));

// Serve JS files from the js directory
app.use('/js', express.static(path.join(__dirname, '../client/js')));

// Serve img assets from the img directory
app.use('/client_img', express.static(path.join(__dirname, '../client/img')));

//app.use(express.static('../client'));

const imgPath = path.join(__dirname, 'img');
app.use('/img', express.static(imgPath));

const storage = multer.diskStorage({
    destination: './img/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage
}).single('file');

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/html/index.html'));
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/html/home.html'));
});

app.get('/store', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/html/store.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/html/about.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/html/contact.html'));
});

//create
app.post('/insert', (req, res) => {
    const { product } = req.body;
    const db = dbService.getDbServiceInstance();

    const result = db.insertNewProduct(product);

    result
    .then(data => res.json({ data : data}))
    .catch(err => console.error(err));

});

//read
app.get('/getAll', (req, res) => {
    const db = dbService.getDbServiceInstance();

    const result = db.getAllData();

    result
    .then(data => res.json({data : data}))
    .catch(err => console.error(err));
});

//new arrivals
app.get('/newArrivals', (req, res) =>{
    const db = dbService.getDbServiceInstance();

    const result = db.showNewProducts();

    result
    .then(data => res.json({data : data}))
    .catch(err => console.error(err))
})

//read product data to client side
app.get('/clientProducts', (req, res) =>{
    const db = dbService.getDbServiceInstance();

    const result = db.getClientProducts();

    result
    .then(data => res.json({data : data}))
    .catch(err => console.error(err))
})

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
    .then(data => res.json({ success : data }))
    .catch(err => console.error(err));
});

//image upload route
app.post('/upload', (req, res) => {
    
    upload(req, res, (err) => {
        if (err){
            console.log("err uploading image");
        } else {
            //console.log(req);
            const { id } = req.body;
            const filename = req.file.filename;

            const db = dbService.getDbServiceInstance();

            const result = db.addImageById(filename, id);

            result
            .then(data => res.json({ data : data }))
            .catch(err => console.error(err));
        }
    });
});

app.listen(process.env.PORT, () => console.log('app is running'));
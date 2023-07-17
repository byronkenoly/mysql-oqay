const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

let instance = null;

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.MTUMIZI,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT
});

connection.connect(err => {
    if (err){
        console.error(err.message);
    }
});

class DbService {
    static getDbServiceInstance(){
        return instance ? instance : new DbService();
    }

    async getAllData(){
        try {
            const res = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM catalogue";

                connection.query(query, (err, results) => {
                    if (err){
                        reject(new Error(err.message));
                    }

                    resolve(results);
                })
            });

            return res;
        } catch(error){
            console.error(error);
        }
    }

    async getClientProducts(){
        try {
            const res = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM catalogue LEFT JOIN (SELECT DISTINCT id, filename, image_id FROM images) images ON catalogue.id = images.id;";

                connection.query(query, (err, results) => {
                    if (err){
                        reject(new Error(err.message));
                    }

                    resolve(results);
                })
            });

            return res;
        } catch (err){
            console.error(err);
        }
    }

    async insertNewProduct(product){
        try {
            const dateAdded = new Date();

            const insertId = await new Promise((resolve, reject) => {
                const query = "INSERT INTO catalogue (product, date_added) VALUES (?, ?);";

                connection.query(query, [product, dateAdded],(err, result) => {
                    if (err){
                        reject(new Error(err.message));
                    }

                    resolve(result.insertId);
                })
            });

            return {
                id: insertId,
                product: product,
                dateAdded: dateAdded
            }
        } catch(error){
            console.error(error);
        }
    }

    async deleteRowById(id){
        try {
            id = parseInt(id, 10);

            const deleteId = await new Promise((resolve, reject) => {
                const query = "DELETE FROM catalogue WHERE id = ?;";

                connection.query(query, [id],(err, result) => {
                    if (err){
                        reject(new Error(err.message));
                    }

                    resolve(result.affectedRows);
                })
            });
            
            return deleteId === 1 ? true : false;
        } catch(error){
            console.error(error);
            return false;
        }
    }

    async updateRowById(id, product, price, quantity, mass){
        try {
            id = parseInt(id, 10);
            const updateId = await new Promise((resolve, reject) => {
                const query = "UPDATE catalogue SET product = ?, price = ?, quantity = ?, mass = ? WHERE id = ?;";

                connection.query(query, [product, price, quantity, mass, id], (err, result) => {
                    if (err){
                        reject(new Error(err.message));
                    }

                    resolve(result.affectedRows);
                })
            })

            return updateId === 1 ? true : false
        } catch (error){
            console.error(error);
            return false;
        }
    }

    async searchByProduct(product){
        try {
            const res = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM catalogue WHERE product = ?;";

                connection.query(query, [product], (err, results) => {
                    if (err){
                        reject(new Error(err.message));
                    }

                    resolve(results);
                })
            });

            return res;
        } catch(error){
            console.error(error);
        }
    }

    async addImageById(filename, id){
        try {
            id = parseInt(id, 10);

            if (isNaN(id)) {
                throw new Error('Invalid ID');
            }
            const insertImgId = await new Promise((resolve, reject) => {
                const query = "INSERT INTO images (filename, id) VALUES (?, ?);";

                connection.query(query, [filename, id], (err, result) => {
                    if (err){
                        reject(new Error(err.message));
                    }

                    resolve(result);
                })
            });

            return {
                image_id: insertImgId,
                filename: filename
            }
        } catch (err){
            console.error(err);
        }
    }
}

module.exports = DbService;
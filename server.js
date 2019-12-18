const express = require('express');
require('dotenv').config();
const cors = require('cors');
const port = process.env.PORT || 8080;
const app = express();

let DNARecognizer = require('./DNARecognizer');

app.use(cors());
var mysql = require('mysql');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname));

app.get('/stats', function (req, res) {
    conectiondb.query("SELECT * FROM stats", function (err, result) {
        if (err) throw err;
        return res.send(JSON.parse(JSON.stringify(result))[0]);
    });
});


app.post('/mutant', function (req, res) {
    try {
        let arr = req.body.dna;
        let dnafunction = new DNARecognizer(JSON.parse(arr));
        let isMutant = dnafunction.isMutant();
        let sql = `INSERT INTO dna (dna, dna_type) VALUES ('${JSON.stringify(arr)}', '${isMutant ? 'M' : 'H'}')`;
        conectiondb.query(sql, function (err) {
             if (err) throw err;
             console.log("1 record inserted");
         });

        if (isMutant) {
            res.status(200);
            res.send("The DNA is from a Mutant");
        } else {
            res.status(200)
            res.send('The DNA is from a Human');
        }
    } catch (e) {
        return res.status(422).send({msg: e});
    }

});

app.listen(port);

// Conection to  database with mysql
var conectiondb = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "mutantdb"
});

conectiondb.connect(function (err) {
    if (err) throw err;
    console.log("Connected mutant-api!");
});

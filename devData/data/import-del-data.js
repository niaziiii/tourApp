
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs')
dotenv.config({ path: `./../../config.env` });

const Tour = require(`./../../models/tourmodel`)
const User = require(`./../../models/newUsermodel`)
const Reviews = require('./../../models/reviewmodel')

//  using mongoose labriry to set mongoDb
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DBPASS)
mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => console.log('db integrated with express()')).catch(err => {
        console.log(err, 'not connected');
    })



//  delete all data from DB collection in Tour
const deleteAllDataFromCollection = async () => {
    try {
        await user.deleteMany();
        console.log('all data is deleted inside the colection of DB')

    }
    catch (err) {
        console.log(err)
    }
}


// read and upload json file data to DB collection
const readAndUploadDataToDB = async () => {
    try {
        // const data = await JSON.parse(fs.readFileSync(`./../toursApi/tours.json`, 'utf-8'))
        const data = await JSON.parse(fs.readFileSync(`./../toursApi/reviews.json`, 'utf-8'))
        
        await Reviews.create(data.reviews)
        console.log('data is uploaded to DB collection sucessfully !  ')
    }

    catch (err) {
        console.log(err)
    }
}


//  making this file functions to usable in commond-line

if (process.argv.find(el => el === "--import--")) {
    readAndUploadDataToDB()
}
else if (process.argv.find(el => el === "--delete-All--")) {
    deleteAllDataFromCollection()
} else {
    "not wokring";
}
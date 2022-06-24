const express = require('express')
const homePageRouter = express.Router();

let pageVisit = {};


let visits =  (req,res,next) => {
    let counter = pageVisit[req.originalUrl];
    if (counter || counter === 0) pageVisit[req.originalUrl] = counter + 1;
    else pageVisit[req.originalUrl] = 1;
    next()
}


const CheckNoOfStatus = (req,res,next)=>{
    res.status(200).json({
        status : "sucess",
        data : pageVisit
    })
}

const setToZero = (req,res,next) => {
    pageVisit = {}
    next()
}


// //  home page router
// homePageRouter
//     .route('/')
//     .get(this.visits)

homePageRouter
     .route('/status')
     .get(CheckNoOfStatus)
     
homePageRouter
     .route('/resetstatus')
     .get(setToZero)


module.exports = {
    homeRoute:homePageRouter,
    visitFn : visits
};
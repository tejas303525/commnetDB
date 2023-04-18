const {logevents} =require("./logevent")


const errorHandler =(err,req,res,next)=>{
    logevents(`${err.name}: ${err.message}\n`, 'errLog.txt');
    console.error(err.stack)
    res.status(500).send(err.message)
}


module.exports = {errorHandler};

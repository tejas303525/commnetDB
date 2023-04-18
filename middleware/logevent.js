const {format}=require("date-fns")
const {v4:uuid} =require("uuid")

const path=require("path")
const fs=require("fs")
const fsPromises=require("fs").promises


const logevents=async (message,logname)=>{
    const dateTime=format(new Date(),'yyyy|MM|dd\tHH:mm:ss')
    const logItem=`${dateTime}\t${uuid()}\t${message}`
    try{
        if(!fs.existsSync(path.join(__dirname,"..","logs"))){
            await fsPromises.mkdir(path.join(__dirname,"..","logs"))
        }
        await fsPromises.appendFile(path.join(__dirname,"..","logs",logname),logItem)
    }
    catch(err){
        console.log(err)
    }
}

const logger=(req,res,next)=>{
    logevents(`${req.method}\t${req.headers.origin}\t${req.url}\n`,"reqLog.txt")
    console.log(req.url)
    console.log(`${req.method}:${req.path}`)
    next()
}

module.exports= {logger,logevents} 

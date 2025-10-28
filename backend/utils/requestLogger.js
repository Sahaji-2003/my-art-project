const fs = require('fs');
const requestLogger = (req, res, next)=>{
    console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
    const log = `${new Date().toISOString()} - ${req.method} ${req.originalUrl}\n`;
    fs.appendFile('requests.log', log, (err)=>{
        if(err){
            console.error('Failed to write request log:', err);
        }   
    });
    next();
}
module.exports = requestLogger;
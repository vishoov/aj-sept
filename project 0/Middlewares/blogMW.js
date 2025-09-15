const logging = (req, res, next)=>{
    const method = req.method;
    const path = req.path;
    const time = new Date().toISOString();
    const ip = req.ip;

    console.log(`[${time}] : ${method} = '${path}' - ${ip}`);
    next();
}

module.exports = {
    logging
}
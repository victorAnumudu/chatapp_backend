const jwt = require('jsonwebtoken')


exports.validToken = async (req, res, next) => {
    const token = req.body.token
    if(!token) return res.status(401).json({status:0, message:'unauthorized'})
    try { 
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
        res.locals = decodedToken
        next()
    } catch (error) {
        if(error.message == 'jwt expired') res.status(401).json({status:0, message:'Session expired'})
        else if (error.message == 'invalid signature') res.status(401).json({status:0, message:'Invalid Token'})
        else res.status(401).json({status:0, message:'Something went wrong'})
    }
}
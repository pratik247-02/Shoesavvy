import JWT from "jsonwebtoken";

//private route middleware to check for token   
export  const requireSignin = (req, res, next) => {
    try {
        const decode = JWT.verify(req.headers.authorization, process.env.JWT_SECRET);
        req.user = decode;
        next();
       
    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: "Unauthorized" });
    } }

//admin route middleware to check for token and admin role
export const adminMiddleware = (req, res, next) => {
    try {
        const decode = JWT.verify(req.headers.authorization, process.env.JWT_SECRET);
        if(decode.role == "admin"){
            return res.status(403).json({ success: false, message: "Admin resource. Access denied" });
        }
        req.user = decode;
        next();
       
    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: "Error in admin MW" });
    } }

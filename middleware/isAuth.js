import jwt from 'jsonwebtoken';

const AuthMiddleware = (req, res, next) => {
    if (!req || !req.get || !req.get("Authorization")) {
        return res.status(401).json({ message: "Not authorized bearer token is not present" });
    }
    
    const token = req.get("Authorization").split(" ")[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, "somesecretsecret");
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
    
    if (!decodedToken) {
        return res.status(401).json({ message: "Not authorized" });
    }
    
    req.userId = decodedToken.userId;
    next();
};

export default AuthMiddleware;

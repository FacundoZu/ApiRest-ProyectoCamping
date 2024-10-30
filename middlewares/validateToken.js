import jwt from 'jsonwebtoken'

export const authRequire = (req, res, next) => {
    const secret = process.env.JWT_SECRET;
    const token = req.cookies.token
    if (!token) {
        return res.status(401).json({
            message: "No hay token, autorizacion denegada"
        });
    }
    jwt.verify(token, secret, (err, user) => {
        if (err) {
            return res.status(401).json({
                message: "token invalido"
            });
        }
        req.user = user
        next()
    });
};
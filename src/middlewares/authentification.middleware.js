const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

const authenticateUser = (minRank = 0) => async (req, res, next) => {
    try {
        // Récupérer le token d'authentification dans l'entête de la requête
        const authorizationHeader = req.headers.authorization;
        console.log("Rank minimum :", minRank)

        // Vérifier si le token existe dans l'entête de la requête
        if (!authorizationHeader || !authorizationHeader.split(' ')[1]) {
            // Si le token n'existe pas, retourner une erreur
            return res.status(401).json({ 
                error: true,
                message: "Accès interdit."
            });
        }

        // Récupérer le token d'authentification et l'affecter à une variable
        // Exemple de token d'authentification: "Bearer 1234567890"
        const accessToken = authorizationHeader.split(' ')[1];

        // On vérifie si l'accessToken est attribué à un utilisateur dans la base de données
        const user = await User.findOne({ where: { accessToken: accessToken } });

        // Si l'utilisateur n'existe pas, retourner une erreur
        if (!user) {
            return res.status(403).json({ 
                error: true,
                message: "Accès interdit."
            });
        }

        // Si l'utilisateur existe, on vérifie si le token d'authentification est valide
        // Si le token n'est pas valide, retourner une erreur
        const result = await jwt.verify(accessToken, "LKKJSDFEFKONERLNERLNK", { expiresIn: "1h" });

        // Si le token n'est pas valide, retourner une erreur
        if (!result) {
            return res.status(401).json({ 
                error: true,
                message: "Accès interdit."
            });
        }

        req.decoded = {
            id: user.id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            bio: user.bio,
            profilePicture: user.profilePicture,
        }

     // Si le token est valide, on passe à la fonction suivante
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: true,
            message: "Une erreur interne est survenue, veuillez réessayer plus tard."
        });
    }
};

// Exporter le middleware
module.exports = authenticateUser;
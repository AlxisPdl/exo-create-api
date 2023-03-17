const { Op } = require("sequelize");
const User = require("../models/user.model");
const { sendMail } = require("../utils/mailer.utils");
const { encryptPassword, comparePassword } = require("../utils/passwordHandler.utils");
const jwt = require('jsonwebtoken');

exports.SignUp = async (req, res) => {
    try {
        const { firstName, lastName, email, password, username } = req.body;
        if (!firstName || !lastName || !email || !password || !username) {
            return res.status(400).json({
                error: true,
                message: "Requête invalide."
            });
        }

        const nameRegex = /^[a-zA-Z]{MIN_CHARS,MAX_CHARS}$/i;
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/i;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/i;
        const usernameRegex = /^[a-zA-Z0-9._-]{MIN_CHARS,MAX_CHARS}$/i;


        if (!emailRegex.test(email)) {
            return res.status(400).json({
                error: true,
                message: "L'adresse email est invalide."
            });
        }

        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                error: true,
                message: "Le mot de passe doit contenir au moins 8 caractères dont une majuscule, une minuscule, un chiffre et un caractère spécial."
            });
        }

        if (!nameRegex.test(firstName)) {
            return res.status(400).json({
                error: true,
                message: "Le prénom doit contenir au moins 2 caractères."
            });
        }

        if (!nameRegex.test(lastName)) {
            return res.status(400).json({
                error: true,
                message: "Le nom doit contenir au moins 2 caractères."
            });
        }

        if (!usernameRegex.test(username)) {
            return res.status(400).json({
                error: true,
                message: "Le nom d'utilisateur doit contenir au moins 2 caractères."
            });
        }



        const isExist = await User.findOne({ where: { [Op.or]: [{ email: email }, { username: username }] } });

        if (isExist) {
            return res.status(409).json({
                error: true,
                message: "L'utilisateur existe déjà."
            });
        }



        const encodedPassword = await encryptPassword(password);
        const code = Math.floor(100000 + Math.random() * 900000);

        const userData = {
            firstName: firstName,
            lastName: lastName,
            username: username,
            email: email,
            password: encodedPassword,
            emailVerificationCode: code,
            emailVerificationCodeExpiration: new Date(Date.now() + 15 * 60 * 1000)
        }

        await sendMail("accountVerification", { code: code }, email);

        await new User(userData).save();
        return res.status(201).json({
            error: false,
            message: "L'utilisateur a été créé avec succès."
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Une erreur interne est survenue, veuillez réessayer plus tard."
        });
    }
}

exports.SignIn = async (req, res) => {
    try {
        const { identifier, password } = req.body;
        if (!identifier || !password) {
            return res.status(400).json({
                error: true,
                message: "Requête invalide."
            });
        }

        const emailRegex = /[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/igm;
        let user;
        if (emailRegex.test(identifier)) {
            user = await User.findOne({ where: { email: identifier } });
        } else {
            user = await User.findOne({ where: { username: identifier } });
        }

        if (!user) {
            return res.status(401).json({
                error: true,
                message: "L'identifiant et/ou le mot de passe est incorrect."
            });
        }

        const isPasswordValid = await comparePassword(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                error: true,
                message: "L'identifiant et/ou le mot de passe est incorrect."
            });
        }

        if (!user.isActive) {
            return res.status(401).json({
                error: true,
                message: "Ce compte n'est pas activé."
            });
        }

        const token = jwt.sign({ id: user.id }, "LKKJSDFEFKONERLNERLNK", { expiresIn: "1h" });

        const userData = {
            accessToken: token,
        }

        await user.update(userData);

        return res.status(200).json({
            error: false,
            message: "Vous êtes connecté.",
            token: token
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Une erreur interne est survenue, veuillez réessayer plus tard."
        });
    }
}
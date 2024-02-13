"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const index_1 = require("../models/index");
const config = __importStar(require("../config/default.json"));
const router = express_1.default.Router();
const jsonParser = body_parser_1.default.json();
// Constants
const TOKEN_EXPIRES = 3600;
// @route       GET api/auth
// @desc        Get logged in user
router.post('/refreshToken/', jsonParser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        const user = yield index_1.User.findById(id).select('-password');
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials!' });
        }
        const payload = {
            user: {
                _id: user._id
            }
        };
        // Make a json web token
        jwt.sign(payload, config.jwtSecret, {
            expiresIn: TOKEN_EXPIRES
        }, (err, token) => {
            if (err) {
                return res.status(500).send(err.message);
            }
            res.json({ token, user });
        });
    }
    catch (err) {
        res.status(500).send('Server error');
    }
}));
// @route       GET api/auth
// @desc        Log user in
router.post('/login/', jsonParser, [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').exists()
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        // Find a user with email
        const user = yield index_1.User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Email!' });
        }
        // Check if passwords match eachother
        const isMatch = yield bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Password!' });
        }
        const payload = {
            user: {
                _id: user._id
            }
        };
        // Make a json web token
        jwt.sign(payload, config.jwtSecret, {
            expiresIn: TOKEN_EXPIRES
        }, (err, token) => {
            if (err) {
                return res.status(500).send(err.message);
            }
            res.json({ token, user });
        });
    }
    catch (err) {
        res.status(500).send('server error');
    }
}));
// @route       GET api/auth
// @desc        Regiser user
router.post('/', jsonParser, [
    body('email').isEmail(),
    body('password').isLength({ min: 6 })
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = validationResult(req.body);
    if (!errors.isEmpty())
        return res.status(400).json({ erros: errors.array() });
    const { firstName, lastName, email, password } = req.body;
    try {
        let fetchedUser = yield index_1.User.findOne({ email });
        if (fetchedUser) {
            return res.status(400).json({ msg: 'Email already exists' });
        }
        // Generate a hashed password
        const salt = yield bcrypt.genSalt(10);
        let userSettings = new index_1.UserSettings({
            backgroundColour: '#435452',
            backgroundImage: '',
            useBackground: false,
            theme: 'standard'
        });
        let user = new index_1.User({
            firstName,
            lastName,
            email,
            password: yield bcrypt.hash(password, salt),
            installedPrograms: ['645be25c282005257c879cbc'],
            settings: userSettings._id
        });
        console.log("CREATED USERSETTINGS", userSettings);
        console.log("CREATED USER", user);
        yield userSettings.save();
        yield user.save();
        const payload = {
            user: {
                _id: user._id
            }
        };
        const id = user._id;
        const role = user.type;
        jwt.sign(payload, config.jwtSecret, {
            expiresIn: TOKEN_EXPIRES
        }, (err, token) => {
            if (err) {
                return res.status(500).send(err.message);
            }
            res.json({ token, id, role });
        });
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
module.exports = router;

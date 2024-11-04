"use strict";
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
const models_1 = require("../models");
const auth_1 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
const jsonParser = body_parser_1.default.json();
// @route       GET api/user
// @desc        GET all users
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const userFound = yield models_1.User.findById({ _id: id }).populate('settings');
        res.send({ user: userFound });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send('server error');
    }
}));
// @route       PUT api/user/:id
// @desc        Update user by id
router.put('/:id', auth_1.default, jsonParser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const userUpdate = req.query;
    try {
        const updatedUser = yield models_1.User.findByIdAndUpdate(id, userUpdate, {
            new: true,
        }).populate('settings');
        if (!updatedUser)
            return res.status(404).send({ error: 'User not found' });
        res.send(updatedUser);
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send('server error');
    }
}));
// @route       PUT api/user/settings/:id
// @desc        Update userSettings by id
router.put('/settings/:id', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const userSettingsUpdate = req.query;
    console.log('UPDATE USERSETTINGS', id, userSettingsUpdate);
    try {
        const updateUserSetting = yield models_1.UserSettings.findByIdAndUpdate(id, userSettingsUpdate, { new: true });
        if (!updateUserSetting)
            return res.status(404).send({ error: 'Program not found' });
        res.send(updateUserSetting);
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send('server error');
    }
}));
// @route       GET api/program
// @desc        Get all programs
router.get('/', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fetchedItems = yield models_1.User.find().populate('settings');
        res.json({ users: fetchedItems });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send('server error');
    }
}));
module.exports = router;

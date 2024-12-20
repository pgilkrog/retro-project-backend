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
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const models_1 = require("../../models");
const router = express_1.default.Router();
const jsonParser = body_parser_1.default.json();
router.post('/', auth_1.default, jsonParser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, title, text, image, type } = req.body;
        const newSlide = new models_1.Slide({
            id,
            title,
            text,
            image,
            type,
        });
        yield newSlide.save();
        res.json(newSlide);
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send('server error');
    }
}));
module.exports = router;

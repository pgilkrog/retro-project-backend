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
const index_1 = require("../models/index");
const router = express_1.default.Router();
const jsonParser = body_parser_1.default.json();
// @route      GET
// @desc       Get all erros
router.get('/', jsonParser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fetchedErros = yield index_1.Error.find();
        res.json({ errors: fetchedErros });
    }
    catch (error) {
        res.status(500).send('server error');
    }
}));
// @route     CREATE
// @desc      Create error
router.post('/', jsonParser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { text, date, userId } = req.query;
    try {
        const newError = new index_1.Error({
            text,
            date,
            userId
        });
        yield newError.save();
        res.json(newError);
    }
    catch (error) {
        console.log(error);
        res.status(500).send('server error');
    }
}));
module.exports = router;

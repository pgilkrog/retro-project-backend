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
const models_1 = require("../models");
const auth_1 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
const jsonParser = body_parser_1.default.json();
router.get('/', jsonParser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fetchedPaintings = yield models_1.Painting.find();
        res.json({ paintings: fetchedPaintings });
    }
    catch (error) {
        console.log(error);
        res.status(500).send('error gettings all paintings');
    }
}));
router.get('/:id', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.params);
    try {
        const fetchedPaintings = yield models_1.Painting.find({ uId: req.params.id }).exec();
        res.json({ paintings: fetchedPaintings });
    }
    catch (error) {
        console.log(error);
        res.status(500).send('error getting paintings with userId');
    }
}));
router.post('/', jsonParser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, canvas, uId } = req.body;
        const newPainting = new models_1.Painting({
            name,
            canvas,
            uId,
        });
        yield newPainting.save();
        res.json(newPainting);
    }
    catch (error) {
        console.log(error);
        res.status(500).send('server error');
    }
}));
module.exports = router;

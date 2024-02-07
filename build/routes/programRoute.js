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
const auth_1 = __importDefault(require("../middleware/auth"));
const index_1 = require("../models/index");
const router = express_1.default.Router();
const jsonParser = body_parser_1.default.json();
// @route       GET api/program
// @desc        Get all programs
router.get('/', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fetchedItems = yield index_1.Program.find();
        res.json({ programs: fetchedItems });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send('server error');
    }
}));
// @route       DELETE api/program
// @desc        Delete program by id
router.delete('/:id', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedItem = yield index_1.Program.findByIdAndDelete({ _id: req.params.id });
        res.send({ item: deletedItem });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send('server error');
    }
}));
// @route       POST api/program
// @desc        Create a program
router.post('/', auth_1.default, jsonParser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, image, color, displayName, sortOrder, type } = req.query;
    try {
        const newProgram = new index_1.Program({
            name,
            displayName,
            image,
            color,
            sortOrder,
            type
        });
        yield newProgram.save();
        res.json(newProgram);
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send('server error');
    }
}));
// @route       PUT api/program/:id
// @desc        Update program by id
router.put('/:id', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("UPDATE USER");
    const id = req.params.id;
    const programToUpdate = req.query;
    console.log("body", programToUpdate);
    try {
        const updateProgram = yield index_1.Program.findByIdAndUpdate(id, programToUpdate, { new: true });
        if (!updateProgram)
            return res.status(404).send({ error: 'Program not found' });
        res.send(updateProgram);
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send('server error');
    }
}));
module.exports = router;

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
const multer = require('multer');
const index_1 = require("../models/index");
const router = express_1.default.Router();
const jsonParser = body_parser_1.default.json();
// const upload = multer({ dest: 'uploads'})
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const originalname = Date.now() + '-' + file.originalname;
        const filename = originalname.trim().replace(/\s+/g, "-");
        cb(null, filename);
    }
});
// File filter function to only allow images and PDFs
const fileFilter = function (req, file, cb) {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
        cb(null, true);
    }
    else {
        cb(new Error('Invalid file type. Only images and PDFs are allowed.'));
    }
};
// Set up Multer middleware
const upload = multer({ storage: storage, fileFilter: fileFilter });
// @route       GET files
// @desc        Get all files
router.get('/', auth_1.default, jsonParser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fetchedItems = yield index_1.File.find();
        res.json({ files: fetchedItems });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send('server error');
    }
}));
// @route       POST api/files/upload
// @desc        Uploads a file
router.post('/upload', auth_1.default, upload.single('image'), jsonParser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send({ file: req.file });
}));
// @route       POST api/files/upload
// @desc        Uploads a file object to db
router.post('/', auth_1.default, jsonParser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, originalName, size, type, url, userId } = req.query;
    try {
        const newFile = new index_1.File({
            name,
            originalName,
            size,
            type,
            url,
            userId
        });
        yield newFile.save();
        res.json(newFile);
    }
    catch (error) {
        res.status(500).send('server error');
    }
}));
// @route       DELETE api/files/:id
// @desc        Delete file by id
router.delete('/:id', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleteItem = yield index_1.File.findByIdAndDelete({ _id: req.params.id });
        res.send({ item: deleteItem });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send('server error');
    }
}));
// @route       PUT api/files/:id
// @desc        Update file by id
router.put('/:id', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const fileToUpdate = req.query;
        const updateFile = yield index_1.File.findByIdAndUpdate(id, fileToUpdate, { new: true });
        if (!updateFile)
            return res.status(404).send({ error: 'File not found' });
        res.send(updateFile);
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send('server error');
    }
}));
module.exports = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slide = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const slideSchema = new mongoose_1.default.Schema({
    id: {
        required: true,
        type: Number,
    },
    title: {
        required: true,
        type: String,
    },
    text: {
        required: false,
        type: String,
    },
    image: {
        required: false,
        type: String,
    },
    type: {
        required: true,
        type: String,
    },
});
const Slide = mongoose_1.default.model('Slide', slideSchema);
exports.Slide = Slide;

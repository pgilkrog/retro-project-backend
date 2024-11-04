"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Painting = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const PaintingSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true
    },
    canvas: {
        type: String,
        required: true
    },
    uId: {
        type: String,
        required: true
    },
    width: {
        type: Number,
        required: true
    },
    height: {
        type: Number,
        required: true
    }
});
const Painting = mongoose_1.default.model('Painting', PaintingSchema);
exports.Painting = Painting;

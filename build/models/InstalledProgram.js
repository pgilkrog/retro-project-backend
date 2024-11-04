"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstalledProgram = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const installedProgramSchema = new mongoose_1.default.Schema({
    programId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    gridPosition: {
        type: Number,
        required: true
    }
});
const InstalledProgram = mongoose_1.default.model('InstalledProgram', installedProgramSchema);
exports.InstalledProgram = InstalledProgram;

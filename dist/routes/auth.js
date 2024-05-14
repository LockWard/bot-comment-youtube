"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const router = (0, express_1.Router)();
router.get('/google', passport_1.default.authenticate('google'), (_req, res) => res.send(200));
router.get('/google/redirect', passport_1.default.authenticate('google'), (_req, res) => res.send(200));
exports.default = router;

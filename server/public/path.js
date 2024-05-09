"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpcomingMovies = exports.TopRatedMovies = exports.TelguMovies = exports.TamilMovies = exports.PopularMovies = exports.NowPlayingMovies = exports.BollywoodMovies = exports.ALL_MOVIES = void 0;
const path_1 = __importDefault(require("path"));
exports.ALL_MOVIES = path_1.default.resolve(__dirname, './data/AllMovies.json');
exports.BollywoodMovies = path_1.default.resolve(__dirname, './data/BollywoodMovies.json');
exports.NowPlayingMovies = path_1.default.resolve(__dirname, './data/NowPlayingMovies.json');
exports.PopularMovies = path_1.default.resolve(__dirname, './data/PopularMovies.json');
exports.TamilMovies = path_1.default.resolve(__dirname, './data/TamilMovies.json');
exports.TelguMovies = path_1.default.resolve(__dirname, './data/TelguMovies.json');
exports.TopRatedMovies = path_1.default.resolve(__dirname, './data/TopRatedMovies.json');
exports.UpcomingMovies = path_1.default.resolve(__dirname, './data/UpcomingMovies.json');
//# sourceMappingURL=path.js.map
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var express_dynacl_1 = __importDefault(require("express-dynacl"));
var db_1 = require("../db");
exports.router = express_1.default.Router({ mergeParams: true });
exports.router.get("/", express_dynacl_1.default("profile-payments", "list"), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var payments;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.db("payments")
                    .where({ profile_id: req.params.profile })
                    .limit(req.query.limit ? Math.min(Number(req.query.limit), 100) : req.query.limit)
                    .offset(req.query.offset || 0)
                    .modify(function () {
                    if (req.query.sort)
                        this.orderBy(db_1.sort2order(req.query.sort));
                    if (req.query.dateFrom)
                        this.where("date", ">=", req.query.dateFrom);
                    if (req.query.dateTo)
                        this.where("date", "<", req.query.dateTo);
                })];
            case 1:
                payments = _a.sent();
                res.json(payments);
                return [2 /*return*/];
        }
    });
}); });
exports.router.get("/months", express_dynacl_1.default("profile-payments", "list"), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var months;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.db("payments")
                    .select(db_1.db.raw("DISTINCT date_part('month', date) AS month, date_part('year', date) AS year"))
                    .where({ profile_id: req.params.profile })];
            case 1:
                months = _a.sent();
                res.json(months);
                return [2 /*return*/];
        }
    });
}); });
exports.router.get("/:year/csv", express_dynacl_1.default("profile-payments", "list"), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var payments, events, eventIndex, header;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.db("payments").where({ profile_id: req.params.profile, year: req.params.year })];
            case 1:
                payments = _a.sent();
                return [4 /*yield*/, db_1.db("events").where({ profile_id: req.params.profile, year: req.params.year })];
            case 2:
                events = _a.sent();
                eventIndex = events.reduce(function (acc, cur) { acc[String(cur.id)] = cur.name; return acc; }, {});
                res.statusCode = 200;
                res.setHeader("Content-disposition", "attachment; filename=" + req.params.profile + "-" + req.params.year + ".payments.csv");
                res.setHeader('Content-Type', 'text/csv');
                header = ['profileId', 'year', 'paragraph', 'item', 'unit', 'eventId', 'eventName', 'date', 'amount', 'counterpartyId', 'counterpartyName', 'description'];
                // UTF BOM for MS EXCEL
                res.write("\ufeff");
                // write header
                res.write(header.map(function (field) { return '"' + field + '"'; }).join(";") + '\r\n');
                // write data
                payments.forEach(function (payment) {
                    res.write(makeCSVLine(header.map(function (field) {
                        switch (field) {
                            case "eventName":
                                return eventIndex[String(payment.eventId)];
                            default:
                                return payment[field];
                        }
                    })));
                });
                res.end();
                return [2 /*return*/];
        }
    });
}); });
function makeCSVLine(array) {
    // clean and format values
    array = array.map(function (value) { return makeCSVItem(value); });
    return array.join(";") + "\r\n";
}
function makeCSVItem(value) {
    // number, replace , to . and no quotes
    if (typeof (value) === 'number' || (typeof (value) === 'string' && value.match(/^\d+([\.,]\d+)?$/))) {
        value = value + "";
        return value.replace(",", ".");
    }
    // boolean, replace to binary 0/1
    if (typeof (value) === "boolean")
        return value ? 1 : 0;
    // empty values
    if (Number.isNaN(value) || value === null)
        return "";
    // string, escape quotes and encapsulate in quotes
    value = value + "";
    return "\"" + value.replace("\"", "\"\"") + "\"";
}

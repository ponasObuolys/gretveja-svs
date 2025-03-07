"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Truck = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Company_1 = require("./Company");
const Issuance_1 = require("./Issuance");
let Truck = class Truck extends sequelize_typescript_1.Model {
};
exports.Truck = Truck;
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false
    }),
    __metadata("design:type", String)
], Truck.prototype, "plateNumber", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true
    }),
    __metadata("design:type", String)
], Truck.prototype, "model", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Company_1.Company),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Truck.prototype, "companyId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Company_1.Company),
    __metadata("design:type", Company_1.Company)
], Truck.prototype, "company", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Issuance_1.Issuance),
    __metadata("design:type", Array)
], Truck.prototype, "issuances", void 0);
exports.Truck = Truck = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'trucks'
    })
], Truck);

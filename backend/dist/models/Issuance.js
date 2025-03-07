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
exports.Issuance = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Product_1 = require("./Product");
const Truck_1 = require("./Truck");
let Issuance = class Issuance extends sequelize_typescript_1.Model {
};
exports.Issuance = Issuance;
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Product_1.Product),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Issuance.prototype, "productId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Product_1.Product),
    __metadata("design:type", Product_1.Product)
], Issuance.prototype, "product", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }),
    __metadata("design:type", Boolean)
], Issuance.prototype, "isIssued", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        defaultValue: sequelize_typescript_1.DataType.NOW
    }),
    __metadata("design:type", Date)
], Issuance.prototype, "issuanceDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false
    }),
    __metadata("design:type", Number)
], Issuance.prototype, "quantity", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false
    }),
    __metadata("design:type", String)
], Issuance.prototype, "driverName", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Truck_1.Truck),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Issuance.prototype, "truckId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Truck_1.Truck),
    __metadata("design:type", Truck_1.Truck)
], Issuance.prototype, "truck", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true
    }),
    __metadata("design:type", String)
], Issuance.prototype, "notes", void 0);
exports.Issuance = Issuance = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'issuances'
    })
], Issuance);

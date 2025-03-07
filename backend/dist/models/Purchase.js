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
exports.Purchase = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Product_1 = require("./Product");
const Supplier_1 = require("./Supplier");
const Company_1 = require("./Company");
let Purchase = class Purchase extends sequelize_typescript_1.Model {
};
exports.Purchase = Purchase;
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false
    }),
    __metadata("design:type", String)
], Purchase.prototype, "invoiceNumber", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Product_1.Product),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Purchase.prototype, "productId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Product_1.Product),
    __metadata("design:type", Product_1.Product)
], Purchase.prototype, "product", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Supplier_1.Supplier),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Purchase.prototype, "supplierId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Supplier_1.Supplier),
    __metadata("design:type", Supplier_1.Supplier)
], Purchase.prototype, "supplier", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false
    }),
    __metadata("design:type", Number)
], Purchase.prototype, "quantity", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        defaultValue: sequelize_typescript_1.DataType.NOW
    }),
    __metadata("design:type", Date)
], Purchase.prototype, "purchaseDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(10, 2),
        allowNull: false
    }),
    __metadata("design:type", Number)
], Purchase.prototype, "unitPrice", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Company_1.Company),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Purchase.prototype, "companyId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Company_1.Company),
    __metadata("design:type", Company_1.Company)
], Purchase.prototype, "company", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(10, 2),
        allowNull: false
    }),
    __metadata("design:type", Number)
], Purchase.prototype, "totalAmount", void 0);
exports.Purchase = Purchase = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'purchases'
    })
], Purchase);

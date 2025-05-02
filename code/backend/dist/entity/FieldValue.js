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
exports.FieldValue = void 0;
const typeorm_1 = require("typeorm");
const Node_1 = require("./Node");
const Field_1 = require("./Field");
let FieldValue = class FieldValue {
};
exports.FieldValue = FieldValue;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], FieldValue.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], FieldValue.prototype, "value", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], FieldValue.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], FieldValue.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Node_1.Node, node => node.fieldValues),
    (0, typeorm_1.JoinColumn)({ name: 'nodeId' }),
    __metadata("design:type", Node_1.Node)
], FieldValue.prototype, "node", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], FieldValue.prototype, "nodeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Field_1.Field, field => field.fieldValues),
    (0, typeorm_1.JoinColumn)({ name: 'fieldId' }),
    __metadata("design:type", Field_1.Field)
], FieldValue.prototype, "field", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], FieldValue.prototype, "fieldId", void 0);
exports.FieldValue = FieldValue = __decorate([
    (0, typeorm_1.Entity)()
], FieldValue);
//# sourceMappingURL=FieldValue.js.map
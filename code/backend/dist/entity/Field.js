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
exports.Field = void 0;
const typeorm_1 = require("typeorm");
const SuperTag_1 = require("./SuperTag");
const FieldValue_1 = require("./FieldValue");
let Field = class Field {
};
exports.Field = Field;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Field.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Field.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Field.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Field.prototype, "isRequired", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Field.prototype, "defaultValue", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Field.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Field.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => SuperTag_1.SuperTag, superTag => superTag.fields),
    (0, typeorm_1.JoinColumn)({ name: 'superTagId' }),
    __metadata("design:type", SuperTag_1.SuperTag)
], Field.prototype, "superTag", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Field.prototype, "superTagId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => FieldValue_1.FieldValue, fieldValue => fieldValue.field),
    __metadata("design:type", Array)
], Field.prototype, "fieldValues", void 0);
exports.Field = Field = __decorate([
    (0, typeorm_1.Entity)()
], Field);
//# sourceMappingURL=Field.js.map
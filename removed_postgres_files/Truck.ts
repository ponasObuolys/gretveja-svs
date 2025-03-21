import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Company } from './Company';
import { Issuance } from './Issuance';

@Table({
  tableName: 'trucks'
})
export class Truck extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  plateNumber!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  model!: string;

  @ForeignKey(() => Company)
  @Column
  companyId!: number;

  @BelongsTo(() => Company)
  company!: Company;

  @HasMany(() => Issuance)
  issuances!: Issuance[];
} 
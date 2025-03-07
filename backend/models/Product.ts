import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Purchase } from './Purchase';
import { Issuance } from './Issuance';

@Table({
  tableName: 'products'
})
export class Product extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  code!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  nameEn!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  nameRu!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  description!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: 'vnt'
  })
  unit!: string; // pvz., "vnt", "kg", "l" ir t.t.

  @HasMany(() => Purchase)
  purchases!: Purchase[];

  @HasMany(() => Issuance)
  issuances!: Issuance[];
} 
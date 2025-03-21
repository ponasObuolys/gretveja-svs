import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Purchase } from './Purchase';

@Table({
  tableName: 'suppliers'
})
export class Supplier extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  contactPerson!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  phone!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  email!: string;

  @HasMany(() => Purchase)
  purchases!: Purchase[];
} 
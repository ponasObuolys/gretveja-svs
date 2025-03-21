import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Purchase } from './Purchase';
import { Truck } from './Truck';

@Table({
  tableName: 'companies'
})
export class Company extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  code!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  vatCode!: string;

  @HasMany(() => Purchase)
  purchases!: Purchase[];

  @HasMany(() => Truck)
  trucks!: Truck[];
} 
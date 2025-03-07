import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Product } from './Product';
import { Truck } from './Truck';

@Table({
  tableName: 'issuances'
})
export class Issuance extends Model {
  @ForeignKey(() => Product)
  @Column
  productId!: number;

  @BelongsTo(() => Product)
  product!: Product;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false
  })
  isIssued!: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW
  })
  issuanceDate!: Date;

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  quantity!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  driverName!: string;

  @ForeignKey(() => Truck)
  @Column
  truckId!: number;

  @BelongsTo(() => Truck)
  truck!: Truck;

  // Įmonė ateina iš vilkiko, todėl nėra tiesioginio ryšio čia
  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  notes!: string;
} 
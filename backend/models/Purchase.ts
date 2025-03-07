import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Product } from './Product';
import { Supplier } from './Supplier';
import { Company } from './Company';

@Table({
  tableName: 'purchases'
})
export class Purchase extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  invoiceNumber!: string;

  @ForeignKey(() => Product)
  @Column
  productId!: number;

  @BelongsTo(() => Product)
  product!: Product;

  @ForeignKey(() => Supplier)
  @Column
  supplierId!: number;

  @BelongsTo(() => Supplier)
  supplier!: Supplier;

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  quantity!: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW
  })
  purchaseDate!: Date;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false
  })
  unitPrice!: number;

  @ForeignKey(() => Company)
  @Column
  companyId!: number;

  @BelongsTo(() => Company)
  company!: Company;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false
  })
  totalAmount!: number;
} 
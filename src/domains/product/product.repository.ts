import { Transaction, Attributes, CreationAttributes, Model, IncludeOptions } from 'sequelize';
import { Product, Auction } from "../../entities";

export class ProductRepository {
  
  async createProduct( product: CreationAttributes<Product>, transaction?: Transaction ) {
    return await Product.create( product, { transaction });
  }

  async saveProduct( product: Product, transaction?: Transaction ) {
    return await product.save({ transaction });
  }

  async update<T extends keyof Attributes<Product>, K extends keyof Attributes<Product>>( body: Record<T, Product[T]>, { where, transaction }: UpdateOptions<K>={}) {
    const result = await Product.update( body, { where, transaction });
    
    return result[0];
  }

  async findOneBy<T extends keyof Attributes<Product>>( 
    where: Record<T, Product[T]>, {
      includeAuctions, 
      transaction, 
    }: FindOnyByOptions={}) {
    const include: IncludeOptions = includeAuctions ? { model: Auction, as: 'auctions' } : null;

    return await Product.findOne({ 
      where, 
      include, 
      order: includeAuctions ? [ [ 'auctions', 'id', 'desc' ] ] : null, 
      transaction, 
    });
  }

  async findAndCountAll<T extends keyof Attributes<Product>>(
    { page, limit }: PaginationOptions, 
    where?: Record<T, Product[T]>, 
    transaction?: Transaction 
  ) {
    if ( where instanceof Transaction ) {
      transaction = where;
      where = null;
    }

    limit = limit || 20;
    page = page || 1;
    const offset = ( page - 1 ) * limit;
    
    const { count, rows: products } = await Product.findAndCountAll({ where, offset, limit, transaction });

    return { count, products };
  }
}

interface UpdateOptions<T extends keyof Attributes<Product>> {
  where?: Record<T, any>;
  transaction?: Transaction;
}
export interface PaginationOptions {
  page: number;
  limit: number;
}
interface FindOnyByOptions {
  includeAuctions?: boolean;
  transaction?: Transaction;
}

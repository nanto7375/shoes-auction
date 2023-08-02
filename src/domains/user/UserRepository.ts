import { Transaction, Attributes, CreationAttributes } from 'sequelize';
import User from '../../entities/UserEntity';
import ResException from '../../utils/ResException';

export default class UserRepository {
  async createUser( user: CreationAttributes<User>, transaction?: Transaction ) {
    try {
      return await User.create( user, { transaction });
    } catch ( error ) {
      throw ( 
        error.errors[0]?.type === 'Validation error' ? 
          new ResException( 400, 'validation error', error ) : 
          new ResException( 500, error ) );
    }
  }

  async findOneBy<T extends keyof Attributes<User>>( where: Record<T, User[T]>, transaction?: Transaction ) {
    return await User.findOne({ where, transaction });
  }
}

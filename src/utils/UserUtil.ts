import bcrypt from 'bcrypt';
import envConfig from '../configs/envConfig';
import { EMAIL_REGEX } from "../constants/const";

export default class UserUtil {
  static isEmail( value: string ): boolean {
    return EMAIL_REGEX.test( value );
  }

  static async hashPassword( password: string ): Promise<string> { 
    const salt = await bcrypt.genSalt( +envConfig.passwordSalt );
    return await bcrypt.hash( password, salt );
  }

  static async isCorrectPassword( password: string, target: string ): Promise<boolean> {
    return await bcrypt.compare( password, target );
  }
}
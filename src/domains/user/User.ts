import bcrypt from 'bcrypt';
import envConfig from '../../configs/envConfig';
import { EMAIL_REGEX } from "../../constants/const";
import ResException from "../../models/ResException";

export default class User {
  private _email: string;
  private _password: string;

  constructor({ email, password }) {
    this._email = email;
    this._password = password;
  }

  validateEmail(): void {
    if ( !EMAIL_REGEX.test( this._email ) ) {
      throw new ResException( 400, 'wrong email format' ); 
    }
  }

  async hashPassword(): Promise<void> {
    this._password = await bcrypt.hash( this._password, await bcrypt.genSalt( +envConfig.passwordSalt ) );
  }
  
  async validatePassword( value: string ): Promise<boolean> {
    return await bcrypt.compare( this._password, value );
  }

  format() {
    return {
      email: this._email,
      password: this._password,
    };
  }

  get email(): string {
    return this._email;
  }
  get password() {
    return this._password;
  }
}
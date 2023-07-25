import jwt, { JwtPayload } from 'jsonwebtoken';
import ResException from '../models/ResException';
import envConfig from '../configs/envConfig';

const jwtSecret = envConfig.jwtSecret;

const HS256 = 'HS256';
const EXPIRY_OF_ACCESS_TOKEN_BY_DAY = '7d';
const EXPIRY_OF_REFRESH_TOKEN_BY_DAY = '30d';
const EXPIRY_OF_REFRESH_TOKEN_BY_SECOND = 60 * 60 * 24 * 30;

// TODO: issueAccessToken, issueRefreshToken 하나로 합치기?
export const issueAccessToken = ( payload ) => jwt.sign( payload, jwtSecret, { algorithm: HS256, expiresIn: EXPIRY_OF_ACCESS_TOKEN_BY_DAY });

export const issueRefreshToken = ( payload={}) => jwt.sign( payload, jwtSecret, { algorithm: HS256, expiresIn: EXPIRY_OF_REFRESH_TOKEN_BY_DAY });

export const verify = ( token: string ) => {
  try {
    return jwt.verify( token, jwtSecret ) as JwtPayload;
  } catch ( error ) {
    if ( error.message === 'invalid signature' ) {
      throw new ResException( 401, 'not authenticated' );
    }
    if ( error.message === 'jwt expired' ) {
      throw new ResException( 401, 'login expired' );
    }
  }
};

interface Verified {
  exp: number;
  iat: number;
}

export const needReissueRefreshToken = ( verified: Verified ) => verified.exp - verified.iat < EXPIRY_OF_REFRESH_TOKEN_BY_SECOND;
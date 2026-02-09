import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const JWT_ACCESS_EXPIRATION = process.env.JWT_ACCESS_EXPIRATION || '15m'
const JWT_REFRESH_EXPIRATION = process.env.JWT_REFRESH_EXPIRATION || '7d'

export interface JwtPayload {
  userId: string
  role: string
}

export const jwtService = {
  // Generate access token
  generateAccessToken: (payload: JwtPayload): string => {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_ACCESS_EXPIRATION,
    })
  },

  // Generate refresh token
  generateRefreshToken: (payload: JwtPayload): string => {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_REFRESH_EXPIRATION,
    })
  },

  // Verify token
  verifyToken: (token: string): JwtPayload => {
    return jwt.verify(token, JWT_SECRET) as JwtPayload
  },

  // Generate both tokens
  generateTokens: (payload: JwtPayload) => {
    return {
      accessToken: jwtService.generateAccessToken(payload),
      refreshToken: jwtService.generateRefreshToken(payload),
    }
  },
}

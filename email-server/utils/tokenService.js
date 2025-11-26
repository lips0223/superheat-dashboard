const jwt = require('jsonwebtoken');

class TokenService {
  static generateMagicToken(email, expiresIn = '10m') {
    return jwt.sign(
      { 
        email, 
        type: 'magic_link',
        timestamp: Date.now()
      },
      process.env.JWT_SECRET,
      { expiresIn }
    );
  }

  static verifyMagicToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      if (decoded.type !== 'magic_link') {
        throw new Error('Invalid token type');
      }
      
      return {
        valid: true,
        email: decoded.email,
        timestamp: decoded.timestamp
      };
    } catch (error) {
      return {
        valid: false,
        error: error.message
      };
    }
  }

  static generateMagicLink(email) {
    const token = this.generateMagicToken(email);
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    return `${baseUrl}/auth/verify?token=${token}`;
  }
}

module.exports = TokenService;
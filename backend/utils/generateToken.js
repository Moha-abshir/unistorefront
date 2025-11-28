import jwt from 'jsonwebtoken';

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, isVerified: user.isVerified },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export default generateToken;
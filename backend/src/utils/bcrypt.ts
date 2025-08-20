import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

export const hashValue = async (value: string): Promise<string> => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(value, salt);
};

export const compareValue = (value: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(value, hash);
};


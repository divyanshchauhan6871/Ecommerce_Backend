import bcrypt from "bcrypt";

export const hashpassword = async (password) => {
  try {
    const setRounds = 10;
    const hashedpassword = await bcrypt.hash(password, setRounds);
    return hashedpassword;
  } catch (error) {}
};

export const compare_password = async (password, hashedpassword) => {
  return bcrypt.compare(password, hashedpassword);
};

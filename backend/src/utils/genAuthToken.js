import jwt from "jsonwebtoken";

const genToken = (userId, res) => {
  try {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });

    res.cookie("BhojanLoginKey", token, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      sameSite: "lax",
      secure: true,
    });
    console.log(token);

    return true;
  } catch (error) {
    return false;
  }
};

export default genToken;
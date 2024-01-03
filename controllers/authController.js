import bcrypt from "bcrypt";
import user from "../modals/user.js";
import jwt from "jsonwebtoken";

  export const register = async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password ) {
        return res.status(400).send({ error: "incomplete data" });
      }

      const existingUser = await user.findOne({ email: email });

      if (existingUser) {
        return res.status(400).send({ error: "user already exists" });
      }

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      const CreateUser = await user.create({
        email,
        password: hash,
      });
      return res.status(200).send({ message: " user has been created" });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  };
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(404).send({ error: "enter required field" });
  }
  try {
    const existingUser = await user.findOne({ email: email });

    if (!existingUser) {
      return res.status(404).send({ error: "User not found !" });
    }
    console.log("existingUser", existingUser);

    const isPasswordCorrect = bcrypt.compareSync(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).send({ error: "Invalid credentils" });
    }

    const data = {
      user: {
        id: existingUser._id,
      },
    };

    const token = jwt.sign(data, process.env.SECRET_KEY);

    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .send({ message: "Logged in successfully" });
  } catch (error) {
    return res
      .status(500)
      .send({ error: "internal server error", message: error.message });
  }
};
export const logOut = (req, res) => {
  res
    .clearCookie("access_token", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .send({ message: "user logout successfully" });
};

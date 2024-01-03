import jwt from "jsonwebtoken";

const isLogggedIn = function (req, res, next) {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).send({ error: "Unauthorized" });
  }

  const data = jwt.verify(token, process.env.SECRET_KEY, (error, user) => {
    if (error) {
      return res
        .status(403)
        .send({ error: "Invalid token", message: error.message });
    }
    // console.log("user", user);
    req.user = user.user;
  });

  next();
};

export default isLogggedIn;

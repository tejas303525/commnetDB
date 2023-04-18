// const userDB = {
//   users: require("../model/users.json"),
//   setUser: function (data) {
//     this.users = data;
//   },
// };

const User=require("./../model/User")


const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd) {
    return res.status(400).json({ message: "Username and password required" });
  } //badreq
  // const foundUser = userDB.users.find((person) => person.username === user);

  const foundUser=await User.findOne({username:user}).exec()


  if (!foundUser) return res.sendStatus(401); //unauthorised

  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    const roles = Object.values(foundUser.roles);
    const accesstoken = jwt.sign(
      {
        "UserInfo": {
          "username": foundUser.username,
          "roles": roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    const refreshtoken = jwt.sign(
      { "username": foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "2d" }
    );
    foundUser.refreshToken=refreshtoken
    const result =await foundUser.save()
    console.log(result)

    res.cookie("jwt", refreshtoken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accesstoken });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };

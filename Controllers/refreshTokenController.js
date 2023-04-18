// const userDB = {
//   users: require("../model/users.json"),
//   setUser: function (data) {
//     this.users = data;
//   },
// };

const User=require("./../model/User")


const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.jwt) return res.sendStatus(401); //To check if we have cookie and if we do, do we also have jwt...the ! represents that if it doesnt then its going to throw an error
  console.log(cookie.jwt);
  const refreshToken = cookie.jwt;
  // const foundUser = User.find(
  //   (person) => person.refreshtoken === refreshtoken
  // );


  const foundUser=await User.findOne({refreshToken}).exec()


  if (!foundUser) return res.sendStatus(403); //forbidden
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.username !== decoded.username) return sendStatus(403);
    const roles = Object.values(foundUser.roles);
    const accessToken = jwt.sign(
      {
        "UserInfo": {
          "username": decoded.username,
          "roles": roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    res.json({ accessToken });
  });
};

module.exports = { handleRefreshToken };

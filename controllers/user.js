const User = require('../models/user');

//for new user
const newUser = async (req, res, next) => {
  const user = User.findOne();
  try {
    if (!user) {
      const user = new User({
        name: 'yogesh mishra',
        email: 'yogeshmishra667@gmail.com',
        cart: {
          items: [],
        },
      });
      const newUser = await user.save();
      res.send(newUser);
    }
  } catch (error) {
    res.send({ msg: error.message });
  }
};

module.exports = newUser;

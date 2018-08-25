module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    'username': DataTypes.STRING,
    'password': DataTypes.STRING,
    'token': DataTypes.STRING,
    'role': DataTypes.STRING,
  });

  User.authorize = function (username, password) {
    return User.findOne({
      'where': {
        username,
        password,
      },
    });
  };

  User.register = async function (username, password) {
    const newUser = await User.findOne({
      'where': {
        username,
      },
    });
    if (!newUser) {
      return User.create({
        username,
        password,
        'role': 'user',
      });
    }
    return null;
  };

    User.associate = function ({ Session }) {
        this.belongsTo(Session);
    };

  return User;
};

module.exports = (sequelize, DataTypes) => {
  const Session = sequelize.define('Session', {
    'token': DataTypes.STRING
  });

  return Session;
};
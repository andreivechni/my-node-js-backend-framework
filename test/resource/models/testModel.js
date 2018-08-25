module.exports = (sequelize, DataTypes) => {
    const Test = sequelize.define('Test', {
        'testString': DataTypes.STRING,
        'testInteger': DataTypes.INTEGER
    });

    return Test;
};

module.exports = (sequelize, DataTypes) => {
    const Test2 = sequelize.define('Test2', {
        'testString2': DataTypes.STRING,
        'testInteger2': DataTypes.INTEGER
    });

    return Test2;
};

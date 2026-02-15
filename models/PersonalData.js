module.exports = (sequelize, DataTypes) => {
  const PersonalData = sequelize.define("PersonalData", {
    account_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },

    first_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    last_name: {
      type: DataTypes.STRING(50),
      allowNull
      : false,
    },

    date_of_birth: {
      type: DataTypes.DATE,
    },
    
    gender: {
      type: DataTypes.ENUM("male", "female", "other"),
    },

    telephone: {
      type: DataTypes.STRING(20),
    },
    
  }, {
    tableName: "personaldata",
    timestamps: false,
  });

  PersonalData.associate = (models) => {
    PersonalData.belongsTo(models.Accounts, {
      foreignKey: "account_id",
      onDelete: "CASCADE",
    });
  };

  return PersonalData;
};

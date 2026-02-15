module.exports = (sequelize, DataTypes) => {
  const RegistrationDepartment = sequelize.define("RegistrationDepartment", {
    admin_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    account_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },

    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },

    admin_code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },

  }, 
  {
    tableName: "registrationdepartment",
    timestamps: false,
  });

  RegistrationDepartment.associate = (models) => {
    RegistrationDepartment.belongsTo(models.Accounts, {
      foreignKey: "account_id",
      onDelete: "CASCADE",
    });
  };

  return RegistrationDepartment;
};
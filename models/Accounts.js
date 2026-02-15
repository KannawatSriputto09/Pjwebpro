module.exports = (sequelize, DataTypes) => {
  const Accounts = sequelize.define("Accounts", {
    account_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },

    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    role: {
      type: DataTypes.ENUM("student", "teacher", "admin"),
      allowNull: false,
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

  }, 
  {
    tableName: "accounts",
    timestamps: false,
  });

  Accounts.associate = (models) => {
    Accounts.hasOne(models.PersonalData, { foreignKey: "account_id" });
    Accounts.hasOne(models.Students, { foreignKey: "account_id" });
    Accounts.hasOne(models.Teacher, { foreignKey: "account_id" });
    Accounts.hasOne(models.RegistrationDepartment, { foreignKey: "account_id" });
  };

  return Accounts;
};

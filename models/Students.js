module.exports = (sequelize, DataTypes) => {
  const Students = sequelize.define("Students", {
    student_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    account_id: {
      type: DataTypes.INTEGER,
      unique: true,
    },

    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },

    student_code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    
  }, {
    tableName: "students",
    timestamps: false,
  });

  Students.associate = (models) => {
    Students.belongsTo(models.Accounts, { foreignKey: "account_id" });
    Students.hasMany(models.Enrollments, { foreignKey: "student_code" });
  };

  return Students;
};

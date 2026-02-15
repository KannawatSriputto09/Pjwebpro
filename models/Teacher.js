module.exports = (sequelize, DataTypes) => {
  const Teacher = sequelize.define("Teacher", {
    teacher_id: {
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

    department_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    teacher_code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },

  }, {
    tableName: "teacher",
    timestamps: false,
  });

  Teacher.associate = (models) => {
    Teacher.belongsTo(models.Accounts, { foreignKey: "account_id" });
    Teacher.belongsTo(models.Department, { foreignKey: "department_id" });
    Teacher.belongsToMany(models.Subject, {
      through: models.TeacherSubject,
      foreignKey: "teacher_id",
      otherKey: "subject_id",
    });
  };

  return Teacher;
};

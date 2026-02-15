module.exports = (sequelize, DataTypes) => {
  const Department = sequelize.define("Department", {
    department_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    department_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    
  }, {
    tableName: "department",
    timestamps: false,
  });

  Department.associate = (models) => {
    Department.hasMany(models.Subject, { foreignKey: "department_id" });
    Department.hasMany(models.Teacher, { foreignKey: "department_id" });
  };

  return Department;

};
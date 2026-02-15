module.exports = (sequelize, DataTypes) => {
  const Classroom = sequelize.define("Classroom", {
    classroom_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    classroom_name: {
      type: DataTypes.STRING(100),
    },

    classroom_location: {
      type: DataTypes.STRING(100),
    },

  }, {
    tableName: "classroom",
    timestamps: false,
  });

  Classroom.associate = (models) => {
    Classroom.hasMany(models.Subject, { foreignKey: "classroom_id" });
  };

  return Classroom;
};

module.exports = (sequelize, DataTypes) => {
  const TeacherSubject = sequelize.define("TeacherSubject", {
    teacher_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },

    subject_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
  }, 
  {
    tableName: "teachersubject",
    timestamps: false,
  });

  TeacherSubject.associate = (models) => {
    TeacherSubject.belongsTo(models.Teacher, {
      foreignKey: "teacher_id",
    });

    TeacherSubject.belongsTo(models.Subject, {
      foreignKey: "subject_id",
    });
  };

  return TeacherSubject;
};

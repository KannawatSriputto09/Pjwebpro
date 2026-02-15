module.exports = (sequelize, DataTypes) => {
  const Enrollments = sequelize.define("Enrollments", {
    student_code: {
      type: DataTypes.STRING(20),
      primaryKey: true,
    },

    subject_code: {
      type: DataTypes.STRING(20),
      primaryKey: true,
    },

    section: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    
    student_midterm_score: DataTypes.INTEGER,
    student_final_score: DataTypes.INTEGER,
    student_assignment_score: DataTypes.INTEGER,
  }, {
    tableName: "enrollments",
    timestamps: false,
  });

  Enrollments.associate = (models) => {
    Enrollments.belongsTo(models.Students, {
      foreignKey: "student_code",
      targetKey: "student_code",
    });

    Enrollments.belongsTo(models.SubjectSection, {
      foreignKey: "section",
      targetKey: "section",
    });

    Enrollments.belongsTo(models.Subject, {
      foreignKey: "subject_code",
      targetKey: "subject_code",
    });
  };

  return Enrollments;
};

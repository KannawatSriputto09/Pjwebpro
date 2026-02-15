module.exports = (sequelize, DataTypes) => {
  const Subject = sequelize.define("Subject",
    {
      subject_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      department_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      subject_code: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },

      subject_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      classroom_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      year: {
        type: DataTypes.INTEGER,
      },

      hours: {
        type: DataTypes.INTEGER,
      },

    },
    {
      tableName: "subject",
      timestamps: false,
    }
  );

  Subject.associate = (models) => {
    Subject.belongsTo(models.Department, {
      foreignKey: "department_id",
    });

    Subject.belongsTo(models.Classroom, {
      foreignKey: "classroom_id",
    });

    Subject.hasMany(models.SubjectSection, {
      foreignKey: "subject_id",
    });

    Subject.belongsToMany(models.Teacher, {
      through: models.TeacherSubject,
      foreignKey: "subject_id",
      otherKey: "teacher_id",
    });
  };
  
  return Subject;
};

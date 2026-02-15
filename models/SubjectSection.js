module.exports = (sequelize, DataTypes) => {
  const SubjectSection = sequelize.define("SubjectSection", {
    subject_code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      primaryKey: true,
    },
    
    section: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },

  }, 
  {
    tableName: "subjectsection",
    timestamps: false,
  });

  SubjectSection.associate = (models) => {
    SubjectSection.belongsTo(models.Subject, {
      foreignKey: "subject_code",
      targetKey: "subject_code",
      onDelete: "CASCADE",
    });

    SubjectSection.hasMany(models.Enrollments, {
      foreignKey: "section",
      sourceKey: "section",
    });

    SubjectSection.hasMany(models.SubjectSchedule, {
      foreignKey: "section",
      sourceKey: "section",
    });
  };

  return SubjectSection;
};
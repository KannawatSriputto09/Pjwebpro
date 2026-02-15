module.exports = (sequelize, DataTypes) => {
  const SubjectSchedule = sequelize.define("SubjectSchedule", {
    subject_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    
    section: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },

    day_of_week: {
      type: DataTypes.ENUM("Mon", "Tue", "Wed", "Thu", "Fri"),
      primaryKey: true,
    },

    start_time: {
      type: DataTypes.TIME,
      primaryKey: true,
    },

    end_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },

  }, 
  {
    tableName: "subjectschedule",
    timestamps: false,
  });

  SubjectSchedule.associate = (models) => {
    SubjectSchedule.belongsTo(models.SubjectSection, {
      foreignKey: "section",
      targetKey: "section",
    });
    SubjectSchedule.belongsTo(models.Subject, {
      foreignKey: "subject_id",
      targetKey: "subject_id",
    });
  };

  return SubjectSchedule;
};

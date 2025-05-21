'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class File extends Model {
    static associate(models) {
      File.belongsTo(models.User, { foreignKey: 'uploadUserId' });
    }
  }

  File.init({
    uploadedFilename: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    uploadUserId: {
      type: DataTypes.INTEGER
    }
  }, {
    sequelize,
    modelName: 'File',
    timestamps: true
  });

  return File;
};

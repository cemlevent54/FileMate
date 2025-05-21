'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
      static associate(models) {
        // ilişkiler buraya tanımlanır 
        User.belongsTo(models.Role, { foreignKey: 'roleId' });
      }
    }
    User.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      email: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      firstName: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'firstname'
      },
      lastName: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'lastname'
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      roleId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Roles',
          key: 'id'
        }
      }
    }, {
      sequelize,
      modelName: 'User',
      timestamps: true // createdAt & updatedAt otomatik oluşturulur
    });
  
    return User;
  };
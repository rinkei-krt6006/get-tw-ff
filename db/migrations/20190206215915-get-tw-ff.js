'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    
    return queryInterface.createTable('get-tw-ff', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      username: {
        type: Sequelize.STRING(200),
        unique: true,
        allowNull: false
      },
      icon: {
        type: Sequelize.STRING(200),
        unique: true,
        allowNull: false
      },
      following: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      followers: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */

    return queryInterface.dropTable('get-tw-ff');
  }
};

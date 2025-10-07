"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("imi_role_permissions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      role_id: {
        type: Sequelize.INTEGER,
      },
      menu_id: {
        type: Sequelize.INTEGER,
      },
      sub_menu_id: {
        type: Sequelize.INTEGER,
      },
      can_view: {
        type: Sequelize.BOOLEAN,
      },
      can_edit: {
        type: Sequelize.BOOLEAN,
      },
      can_add: {
        type: Sequelize.BOOLEAN,
      },
      can_del: {
        type: Sequelize.BOOLEAN,
      },
      can_status: {
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("imi_role_permissions");
  },
};

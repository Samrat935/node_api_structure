"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("imi_users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: true, // Allow null for first_name
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: true, // Allow null for last_name
      },
      email: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      user_type: {
        type: Sequelize.ENUM("admin", "frontend"), // Adjusted to use ENUM for user_type
      },
      type: {
        type: Sequelize.ENUM(
          "student",
          "teacher",
          "recruiter",
          "admin",
          "superadmin"
        ), // Adjusted to use ENUM for type
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: false, // Default value for is_active
      },
      last_login_date: {
        type: Sequelize.DATE,
        allowNull: true, // Allow null for last_login_date
      },
      last_login_ip_address: {
        type: Sequelize.STRING,
        allowNull: true, // Allow null for last_login_ip_address
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
    await queryInterface.dropTable("imi_users");
  },
};

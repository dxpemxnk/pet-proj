/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Categories",
      [
        { name: "Фантастика", createdAt: new Date(), updatedAt: new Date() },
        { name: "Роман", createdAt: new Date(), updatedAt: new Date() },
        { name: "Полина", createdAt: new Date(), updatedAt: new Date() },
        { name: "Детектив", createdAt: new Date(), updatedAt: new Date() },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Categories", null, {});
  },
};

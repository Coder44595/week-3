const {sequelize, DataTypes, Model} = require('./sequelize_index');
const {Menu} = require('./Menu')

/**
 * Represents a Restaurant
 */
class Restaurant extends Model {

    // add methods here

}
Restaurant.init({
    name: DataTypes.STRING,
    image: DataTypes.STRING,
}, {
    sequelize,
    timestamps: false,
});

Restaurant.hasMany(Menu, {as: 'menus', foreignKey: 'restaurant_id'})
Menu.belongsTo(Restaurant, {foreignKey: 'restaurant_id'})

module.exports = {
    Restaurant
};


// local testing - remove when using Jest

/*(async () => {
    await sequelize.sync({ force: true }); // recreate db
    const r = await Restaurant.create({ name: 'Ronalds', image: 'http://some.image.url' })
    console.log("Inserted restaurant name is:" + r.name);
})();*/


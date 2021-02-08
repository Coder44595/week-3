const {Restaurant} = require('./Restaurant')
const {Menu} = require('./Menu')
const {MenuItem} = require('./MenuItem')
const fsp = require('fs').promises; // Node.js file system module with promises
const {sequelize} = require('./sequelize_index');

/**
 * Load the data from the file and
 * insert it in the database
 */
async function loadAndInsert() { 
    const restaurantFile = './restaurants.json'; //asynchronously reads the contents of the restaurant data file
    const buffer = await fsp.readFile(restaurantFile); // wait for the restaurant data file to be read
    const restaurantsArray = (JSON.parse(String(buffer))); //converts the read file data into JS objects (arrays)

    // recreate the database tables
    await sequelize.sync({ force: true });

    let menuCounter = 1;

    for (let i = 0; i < restaurantsArray.length; i++) {

        const currentRestaurant = restaurantsArray[i];

        await Restaurant.create({name: currentRestaurant.name, image: currentRestaurant.image})

        for (let j = 0; j < currentRestaurant.menus.length; j++) {
            const currentMenu = currentRestaurant.menus[j]

            await Menu.create({title: currentMenu.title, restaurant_id: i+1})

            for (let k = 0; k < currentMenu.items.length; k++) {
                const currentMenuItem = currentMenu.items[k]

                await MenuItem.create ({name: currentMenuItem.name, price: currentMenuItem.price, menu_id: menuCounter})
            }

            menuCounter++;
        }

    }
}

module.export = loadAndInsert;

// local testing
loadAndInsert() 
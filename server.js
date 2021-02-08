const express = require('express');
const Handlebars = require('handlebars')
const expressHandlebars = require('express-handlebars')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const { Restaurant } = require('./Restaurant')
const { Menu } = require('./Menu');
const { MenuItem } = require('./MenuItem');
const { check, validationResult } = require('express-validator');


const app = express();
const port = 3001;

// setup our templating engine
const handlebars = expressHandlebars({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})
app.engine('handlebars', handlebars)
app.set('view engine', 'handlebars')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())


// serve static assets from the public/ folder
app.use(express.static('public'));

// this route matches any GET request to the top level URL
app.get('/', async(req, res) => {
    const restaurant = await Restaurant.findAll({
      include: [
          {
              model: Menu, as: 'menus',
              include: [{model:MenuItem, as: 'items'}]
          }
      ],
      nest: true
    })
    res.render('home', {restaurant})
})

app.get('/restaurant/:id', async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id)
    console.log(req.params.id)
    const menus = await restaurant.getMenus({
        include: [{model: MenuItem, as: 'items'}],
        nest: true
    })
    res.render('restaurant', {restaurant, menus})
})


app.get('/about', (request, response) => {
    response.render('about', { date: new Date() })
})
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})

app.post('/restaurants', check('name').isLength({ min: 2 }),
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
         console.log(req.body); // this is the JSON body
    const restaurant= await Restaurant.create(req.body)
    // TODO - add code to insert data into the database!

    res.redirect('/')
})
app.get('/add', async(req, res) => {
   
    res.render('new')
}) 
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/restaurants/:id/edit', async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id)
    res.render('edit', {restaurant})
})

app.get('/restaurant/:id/delete', async (req, res) => {
        await Restaurant.findByPk(req.params.id)
            .then(restaurant => {
                restaurant.destroy()
                res.redirect('/')
            })
    })    

    

    
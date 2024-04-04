const express = require('express');
const router = express.Router();
const userModel = require('./users.js');
const passport = require('passport');
const upload = require('./multer.js');
const Product = require('./seller'); // Assuming Product is your model/schema for products
const Cart = require('./product'); // Assuming Cart is your model/schema for the cart
const localStrategy = require('passport-local');

passport.use(new localStrategy(userModel.authenticate()));

/* GET home page */
router.get('/', isloggedIn, async function(req, res, next) {
  try {
    const product = await Product.find();
    // console.log(products);
    res.render('index', { title: 'Express', product });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.get('/login', (req, res) => {
  res.render('login');
});

/* User registration */
router.post('/register', function (req, res) {
  var userData = new userModel({
    username: req.body.username,
    cata: req.body.cata
  });

  userModel.register(userData, req.body.password)
    .then(function (registeredUser) {
      passport.authenticate('local')(req, res, function () {
        res.redirect('/check');
      });
    });
});

// Check user role and redirect accordingly
router.get('/check', async function(req, res, next) {
  const user = await userModel.findOne({ username: req.session.passport.user });
  if (user) {
    if (user.cata === 'buyer') {
      res.redirect('/');
    } else if (user.cata === 'seller') {
      res.redirect('/g');
    } else {
      res.send("Something wrong");
    }
  } else {
    res.redirect('/login');
  }
});

// Route to render seller upload page
router.get('/g', (req, res) => {
  res.render('sellerUpload');
});

// Handle product upload
router.post('/uploads', upload.single('media'), async (req, res, next) => {
  try {
    const newProduct = await Product.create({
      name: req.body.name,
      media: req.file.filename, // Assuming you're saving the filename
      // productDescription: req.body.ProductDescription,
      price: req.body.price,
      category: req.body.category
    });
    console.log('Product uploaded:', newProduct);
    res.redirect('/');
  } catch (error) {
    console.error('Error uploading product:', error);
    res.status(500).send('Error uploading product');
  }
});

// User login
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

// User logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('login');
});

// Middleware to check if user is logged in
function isloggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  }
}

// Route to handle adding products to the cart
router.post('/cart', async (req, res) => {
  const productId = req.body.productId;
  const product = await Product.findOne({ _id: productId });

  let userCart = await Cart.findOne({ userId: req.user._id });
  if (!userCart) {
    userCart = new Cart({ userId: req.user._id, items: [], totalItems: 0 });
  }

  const existingProductIndex = userCart.items.findIndex(item => item.productId.equals(productId));
  if (existingProductIndex !== -1) {
    return res.json({ cartItem: { total: userCart.totalItems } });
  } else {
    userCart.items.push({
      productId: productId,
      productName: product.productName,
      productImage: product.ProductImage,
      price: product.price,
      quantity: 1
    });

    userCart.totalItems = userCart.items.reduce((total, item) => total + item.quantity, 0);

    await userCart.save();

    res.json({ cartItem: { total: userCart.totalItems } });
  }
});




router.get('/product', async (req, res) => {
  
    const userCart = await Cart.findOne({ userId: req.user._id });
    res.render('product', { cartItems: userCart.items });
  
});
router.get("/seller",isloggedIn, function(req,res){
  res.render("sellerUpload")

})

module.exports = router;

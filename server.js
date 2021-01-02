var path = require('path');
const Joi = require('joi');
const express = require('express');
const port = process.env.PORT || 3005

var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));

let user;
let canNavigate = false;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('pages/home');
});

app.get('/registration', (req, res) => {
    res.render('pages/registration');
});

app.post('/registration', (req, res) => {
    user = req.body;
    canNavigate = true;

    const schema = Joi.object({
        firstName: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required(),
        lastName: Joi.string()
            .alphanum()
            .min(3).max(30)
            .required(),
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
            .required(),
        checkCatalogue: Joi.string().optional()
    });

    const { error } = schema.validate(user);
    if (error) return res.status(400).send(error.details[0].message);

    canNavigate = true;

    return user.checkCatalogue ? res.redirect("/subscription") : res.redirect("/welcome");
});

app.get('/subscription', (req, res) => {

    if (canNavigate) {
        return res.render('pages/subscription', { user });
    }

    res.redirect('/registration');
});

app.post('/subscription', (req, res) => {
    const schema = Joi.object({
        address: Joi.string()
            .min(3)
            .max(30)
            .required(),
    });

    const { error } = schema.validate({ address: req.body.address });
    if (error) return res.status(400).send(error.details[0].message);

    res.redirect("/welcome");
});

app.get('/welcome', (req, res) => {

    if (canNavigate) {
        return res.render('pages/welcome', { user });
    }

    res.redirect('/registration');
});

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});

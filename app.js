const express = require('express');
const app = express();
const port = 3000;
const session = require('express-session');

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(session
  ({ secret: 'all my secret away', // for porto only not for production
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        sameSite: true, // security for csrf attack
    }
  })
);

app.use('/', require('./routers'));

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    });

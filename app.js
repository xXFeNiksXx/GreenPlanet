const express = require('express');
const app = express();
const PORT = 3000;
const mongoose = require('mongoose');
const path = require('path');
let nodemailer = require('nodemailer');
const multer = require('multer');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'superWords';


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


const TOKEN1 = '7189616163:AAErM6ZRzHy3tNlOeoL9knSsD7D4yp9fNSM';
const TOKEN2 = '7319494521:AAEUUm5mrK4J03l0tG-0ALM2qvb8pH-0Mo0';
const chatid = '5365010134';
const bot1 = new TelegramBot(TOKEN1, { polling: false });
const bot2 = new TelegramBot(TOKEN2, { polling: false });









const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  })
  
  const upload = multer({ storage });


app.use(express.json());
app.use(express.static('public'));



var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'nikitarich888@gmail.com',
      pass: 'zczy ulbk tnra dylz'
    }
  });

// mongoDB connect
mongoose.connect(`mongodb+srv://nikitarich888:MX58nOgEJgUkmEKf@cluster0.56uudpl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
    .then(() => {
        console.log(`Connect to mongo DB`);
    })

const Goods = mongoose.model('Goods', { title: String, price: Number, file: String });
const Mail = mongoose.model('Mail', { email: String });

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);



// post
app.post('/api/upload', upload.single('file'), async (req, res) =>{
    try {
        const uploadedFile = req.file;
        console.log('Saved successfuly!');
    } catch (err) {
        res.status(500).json({ message: err });
    }
})
app.post('/add-goods', async (req, res) => {
    try {
        const { title } = req.body;
        const { price } = req.body;
        const { file } = req.body;
        const goods = new Goods({ title, price, file });
        await goods.save();
        console.log('Add new goods');
        res.status(201).json(goods);
    } catch (err) {
        res.status(500).json({ message: err });
    }
});


const Orders = mongoose.model('Orders', { 
    list: Object, 
    name: String,
    phone: String,
    time: Date
});
const Adress = mongoose.model('Adress', { 
    adress: String
});

app.post('/save-order', async (req, res) => {
    try {
        const { list, name, phone, time } = req.body;

        const order = new Orders({ list, name, phone, time });

        await order.save();
        const title = list[0].title;
        bot2.sendMessage(chatid, `new order!!!!! \n name: ${name} \n phone: ${phone} \n list: ${title}`);
        console.log('Order saved successfully!!!!!!!!!!');
        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ message: err });
    }
});
app.post('/adress', async (req, res) => {
    try {
        const { adress } = req.body;

        const adressShop = new Adress({ adress });

        await adressShop.save();

        console.log('adress refreshed');
        res.status(201).json(adressShop);
    } catch (err) {
        res.status(500).json({ message: err });
    }
});
app.get('/auth/register', async (req, res) => {
    try {
        const userCount = await User.countDocuments();

        if (userCount > 0) {
            return res.status(403).json({ message: 'Registration is disabled because a user already exists.' });
        }

        // No users exist, create a default admin user
        const username = 'admin';
        const password = '111';
        const hashedPassword = await bcrypt.hash(password, 10);

        const userDataDefault = {
            username,
            password: hashedPassword,
        };

        const user = new User(userDataDefault);
        await user.save();

        // Generate a token after saving the user
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, secure: false });

        res.status(201).json({ message: 'Default user created', userId: user._id });

    } catch (err) {
        res.status(500).json({ message: 'Error during registration', error: err.message });
    }
});



app.post('/auth/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and Password are required' });
    }

    const user = await User.findOne({ username });
    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, secure: false });
    res.status(200).json({ message: 'Logged in successfully', userId: user._id });
});app.post('/updateuser', async (req, res) => {
    let { username, password, id } = req.body;

    console.log('Received data:', { username, password, id });

    if (!username || !password || !id) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        let updateData = { username, password: hashedPassword };

        const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


app.post('/send-message', async (req, res) => {
    const { message } = req.body;
    const testCookieValue = req.cookies.pushmessage;
    try {
        const mail = await Mail.find();
        console.log(mail);
        for (let el of mail) {
            let a = el.email;
            console.log(a);

            var mailOptions = {
                from: 'nikitarich888@gmail.com',
                to: `${a}`,
                subject: 'Daunku',
                text: message
            };

            await transporter.sendMail(mailOptions);
        }

        res.status(200).json({ message: 'Emails sent successfully', pushMessageCookie: testCookieValue, pushMes: message });
    } catch (err) {
        console.log('Error occurred: ' + err.message);
        res.status(500).json({ message: 'Failed to send emails', error: err.message });
    }
});

app.post('/send-mail', async (req, res) => {
    try {
        const { email } = req.body;
        const mail = new Mail({ email });
        await mail.save();
        console.log('Add new mail');
        res.status(201).json(mail);
    } catch (err) {
        res.status(500).json({ message: err });
    }
})


app.post('/doneorders', async (req, res) => {
    try {
        const { list, name, phone, time } = req.body;

        const doneOrder = new doneOrders({ list, name, phone, time });

        await doneOrder.save();

        console.log('Order done');
        res.status(201).json(doneOrder);
        await doneOrder.save();
    } catch (err) {
        res.status(500).json({ message: err });
    }
})



// midlewhere
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

// get
app.get('/goods', async (req, res) => {
    try {
        const goods = await Goods.find();
        res.json(goods);
    } catch (err) {
        res.status(500).json({ message: err });
    }
})


app.get('/ouradress', async (req, res) => {
    try {
        const adress = await Adress.find();
        res.json(adress);
    } catch (err) {
        res.status(500).json({ message: err });
    }
})


app.get('/emails', async (req, res) => {
    try {
        const mail = await Mail.find();
        res.json(mail);

    } catch (err) {
        res.status(500).json({ message: err });
    }
})



app.get('/getorders', async (req, res) => {
    try {
        const order = await Orders.find();
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err });
    }
})


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})


app.get('/admin/:id', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin', 'index.html'))
})

app.get('/allgoods', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'allgoods', 'index.html'))
})
app.get('/auth', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login', 'index.html'));
});

// delete
app.delete('/goods/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await Goods.findByIdAndDelete(id);
        res.status(204).json({ message: 'successfully deleted' });
    } catch (err) {
        res.status(500).json({ message: err });
    }

})



app.delete('/adress/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await Adress.findByIdAndDelete(id);
        res.status(204).json({ message: 'successfully deleted' });
    } catch (err) {
        res.status(500).json({ message: err });
    }

})












app.delete('/orders/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await Orders.findByIdAndDelete(id);
        res.status(204).json({ message: 'order successfully deleted' });
    } catch (err) {
        res.status(500).json({ message: err });
    }

})


// listen
app.listen(PORT, () => {
    console.log(`Server work on port: ${PORT}`);
})
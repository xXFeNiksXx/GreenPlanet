const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
let nodemailer = require('nodemailer');
const multer = require('multer');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require("axios");
require('dotenv').config();
const JWT_SECRET = 'superWords';
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { type } = require('os');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const PORT = process.env.PORT;



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const TOKEN1 = process.env.TOKEN1;
const TOKEN2 = process.env.TOKEN2;
const chatid = process.env.chatid;
const bot1 = new TelegramBot(TOKEN1, { polling: false });
const bot2 = new TelegramBot(TOKEN2, { polling: false });








const storage = multer.memoryStorage();
  
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
mongoose.connect(`mongodb+srv://nikitarich888:MX58nOgEJgUkmEKf@cluster0.56uudpl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
    .then(() => {
        console.log(`Connect to mongo DB`);
    })
const Goods = mongoose.model('Goods', { title: String, price: Number, data: Buffer, contentType: String });
const Mail = mongoose.model('Mail', { email: String });

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    data: Buffer,
    contentType: String
});

const User = mongoose.model('User', userSchema);
const feedbackSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    data: Buffer,
    contentType: String,
    message: {
        type: String,
        required: true
    }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);
const articleSchema = new mongoose.Schema({
    title: { type: String, required: true},
    message: {
        type: String,
        required: true
    },
    goodinfo: { type: Boolean, default: false }
});

const Article = mongoose.model('Article', articleSchema);


app.post('/chatbotask', async (req, res) => {
    try {
        const { inpvalue } = req.body;
        const result1 = await model.generateContent( 'Перевірь чи цей текст має відношення до рослин, рослинництва чи ботаніки.Не пиши нічого окрім так чи ні, тільки одне слово:' + inpvalue);
        
        console.log("Response from model1:", result1.response);

        const resultText = result1.response.text().trim();
        console.log("Result text after trimming:", resultText);

        if(resultText.toLowerCase() === 'так'){
            const prompt = inpvalue;
            const result = await model.generateContent(prompt);
            console.log("Final generated result:", result.response.text());
            res.json(result.response.text());
        } else {
            res.json("Вибачте, проте я можу допомогти вам тільки з питаннями, які пов'язані з ботанікою.");
        }
    } catch (err) {
        console.error('Помилка при генерації тексту:', err);
        res.status(500).json({ message: err });
    }
});


app.post('/add-goods', upload.single('photo'), async (req, res) => {
    try {
        const { title } = req.body;
        const { price } = req.body;
        let newgoods = {
            title,
            price
        };
        if (req.file) {
            newgoods.data = req.file.buffer,
            newgoods.contentType = req.file.mimetype
        }else{
            return res.status(400).json({ message: 'Image is required' });
        }
        const goods = new Goods(newgoods);
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
        bot2.sendMessage(chatid, `new order! \n name: ${name} \n phone: ${phone} \n list: ${title}`);
        console.log('Order saved successfully!');
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

app.post('/updateuser', async (req, res) => {
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
app.post('/article', async (req, res) => {
    console.log(req.body);
    try {
        const { message, title } = req.body;

        if (!message || !title) {
            return res.status(400).json({ message: 'Message and title are required' });
        }
        const article = new Article({
            title: title,
            message: message
        });

        await article.save();
        console.log('Article saved successfully');
        res.status(201).json({ message: 'Article saved successfully', article });
    } catch (err) {
        console.error('Error saving feedback:', err.message);
        res.status(500).json({ message: 'Failed to save feedback', error: err.message });
    }
});
app.post('/goodinfo/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { goodinfo } = req.body;

        const updatedArticle = await Article.findByIdAndUpdate(
            id,
            { goodinfo },
            { new: true }
        );

        if (!updatedArticle) {
            return res.status(404).json({ message: 'Article not found' });
        }

        res.json(updatedArticle);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
app.post('/feedback', async (req, res) => {
    try {
        const { message, ID } = req.body;

        if (!message || !ID) {
            return res.status(400).json({ message: 'Message and User ID are required' });
        }

        const user = await User.findById(ID);
        console.log(user);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const feedback = new Feedback({
            username: user.username,
            data: user.data,
            contentType: user.contentType,
            message: message
        });

        await feedback.save();
        console.log('Feedback saved successfully');
        res.status(201).json({ message: 'Feedback saved successfully', feedback });
    } catch (err) {
        console.error('Error saving feedback:', err.message);
        res.status(500).json({ message: 'Failed to save feedback', error: err.message });
    }
});


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
app.post('/adminchek', async (req, res) => {
    try {
        const { ID } = req.body;
        const user = await User.findById(ID);
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err });
    }
})
app.post('/findorderbyname', async (req, res) => {
    const { name } = req.body;
    try {
        const order = await Orders.findOne({ name });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err });
    }
});


app.post('/auth/register', upload.single('photo'), async (req, res) => {
    const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and Password are required' });
        }
        try{
            const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        let userData = {
            username,
            password: hashedPassword,
        };
    
        if (req.file) {
            userData.data = req.file.buffer,
            userData.contentType = req.file.mimetype
        }
    
        const user = new User(userData);
         const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
         res.cookie('token', token, { httpOnly: true, secure: false });
            await user.save();
            res.status(201).json({ message: 'User created successfully',  userId: user._id });
        } catch (err) {
            res.status(400).json({ message: 'User already exists' });
        }
});
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required!' });
    }

    try {
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
    } catch (err) {
        res.status(500).json({ message: 'Login failed', error: err.message });
    }
});
app.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
});

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
      res.status(401).json({ message: 'Unauthorized' });
    }
  };

  app.get('/auth/check-token', authMiddleware, (req, res) => {
    res.status(200).json({ message: 'Authenticated', userId: req.userId });
});
app.get('/goods', async (req, res) => {
    try {
        const goods = await Goods.find();
        res.json(goods);
    } catch (err) {
        res.status(500).json({ message: err });
    }
})
app.get('/createadmin', async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        if (userCount === 0) {
            const adminUsername = 'admin';
            const adminPassword = '123456789';
            const hashedPassword = await bcrypt.hash(adminPassword, 10);

            const admin = new User({ username: adminUsername, password: hashedPassword });
            await admin.save();
            console.log('Admin user created with username: "admin" and password: "123456789"');
        } else {
            console.log('Admin user already exists or database contains other users.');
        }
    } catch (err) {
        console.error('Error while creating admin user:', err.message);
    }try {
        const userCount = await User.countDocuments();
        if (userCount === 0) {
            const adminUsername = 'admin';
            const adminPassword = '123456789';
            const hashedPassword = await bcrypt.hash(adminPassword, 10);

            const admin = new User({ username: adminUsername, password: hashedPassword });
            await admin.save();
            console.log('Admin user created with username: "admin" and password: "123456789"');
        } else {
            console.log('Admin user already exists or database contains other users.');
        }
    } catch (err) {
        console.error('Error while creating admin user:', err.message);
    }
});
app.get('/ouradress', async (req, res) => {
    try {
        const adress = await Adress.find();
        res.json(adress);
    } catch (err) {
        res.status(500).json({ message: err });
    }
})
app.get('/getfeedback', async (req, res) => {
    try {
        const feedback = await Feedback.find();
        res.json(feedback);
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
app.get('/getarticles', async (req, res) => {
    try {
        const articles = await Article.find();
        res.json(articles);
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
app.get('/admin/:id', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin', 'index.html'));
});
app.get('/allgoods', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'allgoods', 'index.html'))
})
app.get('/chatbot', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'chatbot', 'index.html'))
})
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'firstpage', 'index.html'))
})
app.get('/articles', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'articlepage', 'index.html'))
})
app.get('/logining', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'logining', 'index.html'))
})
app.get('/auth', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'authing', 'index.html'));
});
app.get('/auth/sign', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'authing', 'sign.html'));
});
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
app.listen(PORT, () => {
    console.log(`Server work on port: ${PORT}`);
})
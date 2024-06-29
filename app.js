const express = require('express');
const app = express();
const PORT = 3000;
const mongoose = require('mongoose');
const path = require('path');
let nodemailer = require('nodemailer');
const multer = require('multer');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');



app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));


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
      pass: 'laqz gadj osrb janw'
    }
  });

// mongoDB connect
mongoose.connect(`mongodb+srv://nikitarich888:MX58nOgEJgUkmEKf@cluster0.56uudpl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
    .then(() => {
        console.log(`Connect to mongo DB`);
    })

const Goods = mongoose.model('Goods', { title: String, price: Number, file: String });
const Mail = mongoose.model('Mail', { email: String });



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


app.post('/send-message', async (req, res) => {
    const { message } = req.body;

    const mail = await Mail.find();

    console.log(mail);

    let emails = '';

    for (let el of mail) {
        let a = el.email;
        console.log(a);
        try {
            var mailOptions = {
                from: 'nikitarich888@gmail.com',
                to: `${a}`,
                subject: 'Daunku',
                text: message
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        } catch (err) {
            res.status(500).json({ message: err });
        }
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
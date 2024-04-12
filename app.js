const express = require("express");
const app = express();
const PORT = 3000;
const mongoose = require("mongoose");
const path = require("path");


app.use(express.json());
app.use(express.static('public'));


// mongodb


mongoose.connect(`mongodb+srv://root:ZZW5X5T9sWe3hlLs@cluster0.rf62wzr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
    .then(() => {
        console.log(`Connect to mongo DB`);
    })



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin', 'index.html'));
})

const Goods = mongoose.model('Goods', 
{title: String, price: Number});
const Contact = mongoose.model('Contact', 
{phone: String, adress: Number, mail: String});

app.post ('/add-contact', async (req, res) => {
    try {
        const {phone} = req.body;
        const {adress} = req.body;
        const {mail} = req.body;
        const contact = new Contact({phone, adress, mail});
        await contact.save();
        console.log(`new contact created`);
        res.status(201).json(contact);
    } catch (err) {
        res.status(500).json({message: err});
    };
})
app.post ('/add-goods', async (req, res) => {
    try {
        const {title} = req.body;
        const {price} = req.body;
        const goods = new Goods({title, price});
        await goods.save();
        console.log(`new goods creaated`);
        res.status(201).json(goods);
    } catch (err) {
        res.status(500).json({message: err});
    };
})
app.get('/goods', async (req, res) => {
    try {
        const goods = await Goods.find();
        res.json(goods);
        res.status(201).json(goods);
    } catch (err) {
        res.status(500).json({message: err});
    };
})
app.delete('/goods/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await Goods.findByIdAndDelete(id);
        res.status(201).json({message: "successfull"});
    } catch (err) {
        res.status(500).json({message: err});
    };
})
app.put('/edit-goods/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const goods = await Goods.findByIdAndUpdate(id, req.body, {new: true});
        res.status(201).json(goods);
    } catch (err) {
        res.status(500).json({message: err});
    };
})

app.listen(PORT, () => {
    console.log(`server work in port: ${PORT}`);
});
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: false }));


async function readContactsFile() {
    const data = await fs.readFile('./data/contacts.json', 'utf8');
    return JSON.parse(data)
};

async function writeContactsFile(contacts) {
    await fs.writeFile('./data/contacts.json', JSON.stringify(contacts));
};

app.get('/', async (req, res) => {
    try {
        const contacts = await readContactsFile();
        res.render('index', { contacts });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error')
    };
});

app.get('/add', (req, res) => {
    res.render("add")
});

app.post('/add', async (req, res) => {
    try {
        const newContact = req.body;
        const contacts = await readContactsFile();
        contacts.push(newContact);
        await writeContactsFile(contacts);
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
})

app.get('/edit/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const contacts = await readContactsFile();
        const contact = contacts[id];
        res.render('edit', { id, contact });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
})

app.post('/edit/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updateContact = req.body;
        const contacts = await readContactsFile();
        contacts[id] = updateContact;
        await writeContactsFile(contacts);
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

app.get('/view/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const contacts = await readContactsFile();
        const contact = contacts[id];
        res.render('view', { contact });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
})

app.get('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const contacts = await readContactsFile();
        contacts.splice(id, 1);
        await writeContactsFile(contacts);
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
})

app.listen(port, () => {
    console.log("Server is running at", port);
});
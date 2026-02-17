const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = 3000;
const DB_FILE = './database.json';

app.use(express.static('public'));
app.use(bodyParser.json());

const lerBanco = () => {
    if (!fs.existsSync(DB_FILE)) {
        const iniciais = [{ id: 1, nome: "ADMIN EXEMPLO", categoria: "Encanador", avaliacao: 5.0, preco: 150, whatsapp: "11900000000", notas: [5] }];
        fs.writeFileSync(DB_FILE, JSON.stringify(iniciais, null, 2));
        return iniciais;
    }
    return JSON.parse(fs.readFileSync(DB_FILE));
};

const salvarNoBanco = (dados) => fs.writeFileSync(DB_FILE, JSON.stringify(dados, null, 2));

app.get('/api/profissionais', (req, res) => res.json(lerBanco()));

app.post('/api/cadastrar', (req, res) => {
    const profissionais = lerBanco();
    const novo = { id: Date.now(), ...req.body, avaliacao: 0, notas: [] };
    profissionais.push(novo);
    salvarNoBanco(profissionais);
    res.status(201).json({ success: true });
});

app.post('/api/avaliar', (req, res) => {
    const { id, nota } = req.body;
    let profissionais = lerBanco();
    const index = profissionais.findIndex(p => p.id === parseInt(id));
    if (index !== -1) {
        if (!profissionais[index].notas) profissionais[index].notas = [];
        profissionais[index].notas.push(parseInt(nota));
        const soma = profissionais[index].notas.reduce((a, b) => a + b, 0);
        profissionais[index].avaliacao = (soma / profissionais[index].notas.length).toFixed(1);
        salvarNoBanco(profissionais);
        res.json({ success: true });
    }
});

app.put('/api/atualizar', (req, res) => {
    let profissionais = lerBanco();
    const index = profissionais.findIndex(p => p.id === parseInt(req.body.id));
    if (index !== -1) {
        profissionais[index] = { ...profissionais[index], ...req.body };
        salvarNoBanco(profissionais);
        res.json({ success: true });
    }
});

app.delete('/api/deletar/:id', (req, res) => {
    const novaLista = lerBanco().filter(p => p.id !== parseInt(req.params.id));
    salvarNoBanco(novaLista);
    res.json({ success: true });
});

app.post('/api/login', (req, res) => {
    const { nome, whatsapp } = req.body;
    const user = lerBanco().find(p => p.nome.toUpperCase() === nome.toUpperCase() && p.whatsapp === whatsapp);
    user ? res.json({ success: true, usuario: user }) : res.status(401).json({ success: false });
});

app.listen(PORT, () => console.log(`🚀 Sistema Online: http://localhost:${PORT}`));

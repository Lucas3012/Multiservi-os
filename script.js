const API_URL = "https://multiservicos-pro.serveo.net"; // Mude para o seu link fixo
const SENHA_MASTER = "1234";
let listaOriginal = [];

// Funções de Interface
function toggleMenu() {
    document.getElementById('sidebar').classList.toggle('active');
    document.querySelector('.sidebar-overlay').classList.toggle('active');
}
function fecharEIr(f) { toggleMenu(); f(); }

// Carregar Dados
async function carregarProfissionais() {
    const container = document.getElementById('lista-profissionais');
    container.innerHTML = Array(3).fill('<div class="skeleton"></div>').join('');
    try {
        const res = await fetch(`${API_URL}/api/profissionais`);
        listaOriginal = await res.json();
        renderizar(listaOriginal);
    } catch (err) {
        container.innerHTML = "<p style='text-align:center; color:red;'>Erro ao conectar com o servidor no Termux.</p>";
    }
}

function renderizar(lista) {
    const container = document.getElementById('lista-profissionais');
    container.innerHTML = lista.map(p => `
        <div class="card">
            <h3 style="margin-bottom:5px;">${p.nome}</h3>
            <p style="color:var(--primary); font-weight:bold; margin-top:0;">${p.categoria}</p>
            <p style="font-size:1.4rem; font-weight:800;">R$ ${p.preco},00</p>
            <button onclick="window.open('https://wa.me/55${p.whatsapp.replace(/\D/g,'')}')" style="background:#25d366; color:white; border:none; padding:12px; border-radius:10px; width:100%; cursor:pointer; font-weight:bold;">
                <i class="fab fa-whatsapp"></i> Contatar Profissional
            </button>
        </div>
    `).join('');
}

// Cadastro
async function abrirFormularioCadastro() {
    const { value: v } = await Swal.fire({
        title: 'Novo Cadastro',
        html: `
            <input id="n" class="swal2-input" placeholder="Nome">
            <input id="w" class="swal2-input" placeholder="WhatsApp">
            <input id="p" type="number" class="swal2-input" placeholder="Preço">
            <select id="c" class="swal2-input">
                <option>Encanador</option><option>Eletricista</option>
                <option>Diarista</option><option>Montador</option>
            </select>`,
        preConfirm: () => ({
            nome: document.getElementById('n').value,
            whatsapp: document.getElementById('w').value,
            preco: document.getElementById('p').value,
            categoria: document.getElementById('c').value
        })
    });
    if (v && v.nome) {
        await fetch(`${API_URL}/api/cadastrar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(v)
        });
        carregarProfissionais();
    }
}

// Painel Master (Admin)
async function abrirPainelMaster() {
    const { value: s } = await Swal.fire({ title: 'Acesso Admin', input: 'password', inputPlaceholder: 'Senha' });
    if (s === SENHA_MASTER) exibirModalGerenciamento();
}

async function exibirModalGerenciamento() {
    const res = await fetch(`${API_URL}/api/profissionais`);
    const dados = await res.json();
    const html = `
        <table class="painel-tabela">
            <thead><tr><th>Nome</th><th>Ações</th></tr></thead>
            <tbody>
                ${dados.map(p => `
                    <tr>
                        <td>${p.nome}</td>
                        <td>
                            <button onclick='prepararEdicao(${JSON.stringify(p)})' style="background:#f59e0b; color:white; border:none; padding:5px 8px; border-radius:4px; cursor:pointer;"><i class="fas fa-edit"></i></button>
                            <button onclick="deletarProfissional(${p.id})" style="background:#ef4444; color:white; border:none; padding:5px 8px; border-radius:4px; cursor:pointer;"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>`;
    Swal.fire({ title: 'Gerenciamento', html, width: '600px', showConfirmButton: false });
}

async function prepararEdicao(p) {
    const { value: v } = await Swal.fire({
        title: 'Editar Perfil',
        html: `<input id="e-n" class="swal2-input" value="${p.nome}">
               <input id="e-p" type="number" class="swal2-input" value="${p.preco}">`,
        preConfirm: () => ({ id: p.id, nome: document.getElementById('e-n').value, preco: document.getElementById('e-p').value })
    });
    if (v) {
        await fetch(`${API_URL}/api/atualizar`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(v) });
        carregarProfissionais(); exibirModalGerenciamento();
    }
}

async function deletarProfissional(id) {
    if (confirm("Deseja excluir?")) {
        await fetch(`${API_URL}/api/deletar/${id}`, { method: 'DELETE' });
        carregarProfissionais(); exibirModalGerenciamento();
    }
}

carregarProfissionais();

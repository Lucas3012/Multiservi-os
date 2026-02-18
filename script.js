// Substitua pelo link gerado no Termux pelo comando: ssh -R 80:localhost:3000 serveo.net
const API_URL = 'https://SEU_LINK_DO_SERVEO_AQUI.serveo.net';
const SENHA_MESTRE = "1234"; 

let profissionaisGlobal = [];

// CARREGAR DADOS DO TERMUX
async function carregarProfissionais() {
    const container = document.getElementById('lista-profissionais');
    container.innerHTML = '<p style="grid-column:1/-1; text-align:center;">Conectando ao celular-servidor...</p>';

    try {
        const res = await fetch(`${API_URL}/profissionais`);
        const data = await res.json();
        profissionaisGlobal = data;
        renderizar(data);
    } catch (err) {
        container.innerHTML = "<p style='grid-column:1/-1; text-align:center; color:red;'>O servidor Termux está offline ou o link do Serveo mudou.</p>";
    }
}

function renderizar(lista) {
    const container = document.getElementById('lista-profissionais');
    if (lista.length === 0) {
        container.innerHTML = "<p style='grid-column:1/-1; text-align:center;'>Nenhum profissional no banco local.</p>";
        return;
    }

    container.innerHTML = lista.map(p => `
        <div class="card">
            <button class="btn-delete" onclick="deletarProfissional('${p.id}', '${p.nome}')">
                <i class="fas fa-trash-alt"></i>
            </button>
            <h3>${p.nome}</h3>
            <span style="color:var(--primary); font-weight:bold; font-size:0.8rem;">${p.categoria.toUpperCase()}</span>
            <div style="font-size:1.6rem; font-weight:800; margin:15px 0;">R$ ${p.preco},00</div>
            <div class="card-buttons">
                <a href="https://wa.me/${p.whatsapp.replace(/\D/g,'')}" target="_blank" class="btn-card btn-orcamento">
                    <i class="fab fa-whatsapp"></i> Orçamento
                </a>
                <a href="https://wa.me/${p.whatsapp.replace(/\D/g,'')}" target="_blank" class="btn-card btn-perfil">
                    <i class="fas fa-user"></i> Perfil
                </a>
            </div>
        </div>
    `).join('');
}

// CADASTRO NO TERMUX
async function abrirFormularioCadastro() {
    const { value: senha } = await Swal.fire({
        title: 'Senha Admin',
        input: 'password',
        showCancelButton: true
    });

    if (senha === SENHA_MESTRE) {
        const { value: f } = await Swal.fire({
            title: 'Novo Registro',
            html: `
                <input id="n" class="swal2-input" placeholder="Nome">
                <input id="c" class="swal2-input" placeholder="Categoria">
                <input id="p" type="number" class="swal2-input" placeholder="Preço">
                <input id="w" class="swal2-input" placeholder="WhatsApp">`,
            preConfirm: () => ({
                nome: document.getElementById('n').value,
                categoria: document.getElementById('c').value,
                preco: document.getElementById('p').value,
                whatsapp: document.getElementById('w').value
            })
        });

        if (f && f.nome) {
            await fetch(`${API_URL}/profissionais`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(f)
            });
            Swal.fire('Sucesso!', 'Salvo no Termux!', 'success');
            carregarProfissionais();
        }
    }
}

// APAGAR NO TERMUX
async function deletarProfissional(id, nome) {
    const { value: senha } = await Swal.fire({
        title: `Apagar ${nome}?`,
        input: 'password',
        showCancelButton: true
    });

    if (senha === SENHA_MESTRE) {
        await fetch(`${API_URL}/profissionais/${id}`, { method: 'DELETE' });
        Swal.fire('Removido!', '', 'success');
        carregarProfissionais();
    }
}

// BUSCA E INTERFACE
document.getElementById('filtro').addEventListener('input', (e) => {
    const termo = e.target.value.toLowerCase();
    const filtrados = profissionaisGlobal.filter(p => 
        p.nome.toLowerCase().includes(termo) || p.categoria.toLowerCase().includes(termo)
    );
    renderizar(filtrados);
});

function toggleMenu() {
    document.getElementById('sidebar').classList.toggle('active');
    document.querySelector('.sidebar-overlay').classList.toggle('active');
}
function fecharEIr(f) { toggleMenu(); f(); }
function sobreNos() { Swal.fire('MultiServiços PRO', 'Servidor Local via Termux.', 'info'); }

carregarProfissionais();

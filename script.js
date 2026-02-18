// --- CONFIGURAÇÃO ---
// Substitua pelo seu link atual do Serveo ou LocalTunnel
const API_URL = "https://multiservicos-pro.serveo.net"; 
const SENHA_MASTER = "1234";

let listaOriginal = [];

// --- INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
    carregarProfissionais();
});

// --- CONTROLE DE INTERFACE ---
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

function fecharEIr(f) {
    toggleMenu();
    f();
}

// --- BUSCA E FILTRO ---
document.getElementById('filtro')?.addEventListener('input', (e) => {
    const termo = e.target.value.toLowerCase();
    const filtrados = listaOriginal.filter(p => 
        p.nome.toLowerCase().includes(termo) || 
        p.categoria.toLowerCase().includes(termo)
    );
    renderizar(filtrados);
});

// --- COMUNICAÇÃO COM O BACK-END ---
async function carregarProfissionais() {
    const container = document.getElementById('lista-profissionais');
    // Exibe os Skeletons (efeito de carregamento)
    container.innerHTML = Array(3).fill('<div class="skeleton"></div>').join('');

    try {
        const res = await fetch(`${API_URL}/api/profissionais`);
        if (!res.ok) throw new Error();
        listaOriginal = await res.json();
        
        // Pequeno delay para o efeito visual ser percebido
        setTimeout(() => renderizar(listaOriginal), 500);
    } catch (err) {
        console.error("Erro ao conectar ao servidor:", err);
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; background: white; border-radius: 20px;">
                <i class="fas fa-plug" style="font-size: 3rem; color: #cbd5e1; margin-bottom: 15px;"></i>
                <h3 style="margin:0">Servidor em Manutenção</h3>
                <p style="color: #64748b;">No momento não conseguimos carregar os perfis. Tente novamente mais tarde.</p>
            </div>
        `;
    }
}

function renderizar(lista) {
    const container = document.getElementById('lista-profissionais');
    if (lista.length === 0) {
        container.innerHTML = "<p style='grid-column:1/-1; text-align:center;'>Nenhum profissional encontrado.</p>";
        return;
    }

    container.innerHTML = lista.map(p => `
        <div class="card">
            <h3 style="margin-bottom:5px; font-weight:800;">${p.nome}</h3>
            <p style="color:var(--primary); font-weight:600; margin-top:0; font-size:0.9rem; text-transform: uppercase;">${p.categoria}</p>
            <div style="margin: 15px 0; font-size: 1.5rem; font-weight: 800;">R$ ${p.preco},00</div>
            <button onclick="window.open('https://wa.me/55${p.whatsapp.replace(/\D/g,'')}')" 
                    style="background:#25d366; color:white; border:none; padding:14px; border-radius:12px; width:100%; cursor:pointer; font-weight:bold; display:flex; align-items:center; justify-content:center; gap:10px;">
                <i class="fab fa-whatsapp" style="font-size:1.2rem;"></i> Contatar Agora
            </button>
        </div>
    `).join('');
}

// --- FUNÇÕES DE CADASTRO ---
async function abrirFormularioCadastro() {
    const { value: v } = await Swal.fire({
        title: 'Criar Perfil Profissional',
        html: `
            <input id="n" class="swal2-input" placeholder="Nome Completo">
            <input id="w" class="swal2-input" placeholder="WhatsApp (com DDD)">
            <input id="p" type="number" class="swal2-input" placeholder="Preço Médio">
            <select id="c" class="swal2-input">
                <option>Encanador</option><option>Eletricista</option>
                <option>Diarista</option><option>Montador</option>
                <option>Pintor</option><option>Pedreiro</option>
            </select>`,
        showCancelButton: true,
        confirmButtonText: 'Cadastrar',
        cancelButtonText: 'Cancelar',
        preConfirm: () => ({
            nome: document.getElementById('n').value,
            whatsapp: document.getElementById('w').value,
            preco: document.getElementById('p').value,
            categoria: document.getElementById('c').value
        })
    });

    if (v && v.nome) {
        try {
            await fetch(`${API_URL}/api/cadastrar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(v)
            });
            Swal.fire('Sucesso!', 'Seu perfil foi publicado.', 'success');
            carregarProfissionais();
        } catch (err) {
            Swal.fire('Erro', 'Não foi possível salvar o cadastro.', 'error');
        }
    }
}

// --- PAINEL ADMINISTRATIVO (MASTER) ---
async function abrirPainelMaster() {
    const { value: senha } = await Swal.fire({
        title: 'Acesso Restrito',
        input: 'password',
        inputPlaceholder: 'Digite a Senha Master',
        showCancelButton: true
    });

    if (senha === SENHA_MASTER) {
        exibirModalGerenciamento();
    } else if (senha) {
        Swal.fire('Acesso Negado', 'Senha incorreta.', 'error');
    }
}

async function exibirModalGerenciamento() {
    try {
        const res = await fetch(`${API_URL}/api/profissionais`);
        const dados = await res.json();
        
        const tabela = `
            <div style="overflow-x:auto;">
                <table style="width:100%; border-collapse: collapse; text-align:left;">
                    <thead>
                        <tr style="border-bottom: 2px solid #eee;">
                            <th style="padding:10px;">Nome</th>
                            <th style="padding:10px;">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${dados.map(p => `
                            <tr style="border-bottom: 1px solid #eee;">
                                <td style="padding:10px;">${p.nome}</td>
                                <td style="padding:10px; display:flex; gap:5px;">
                                    <button onclick='prepararEdicao(${JSON.stringify(p)})' style="background:#f59e0b; color:white; border:none; padding:8px; border-radius:6px; cursor:pointer;"><i class="fas fa-edit"></i></button>
                                    <button onclick="deletarProfissional(${p.id})" style="background:#ef4444; color:white; border:none; padding:8px; border-radius:6px; cursor:pointer;"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        Swal.fire({ title: 'Painel de Controle', html: tabela, width: '600px', showConfirmButton: false, showCloseButton: true });
    } catch (err) {
        Swal.fire('Erro', 'O servidor está offline.', 'error');
    }
}

async function prepararEdicao(p) {
    const { value: v } = await Swal.fire({
        title: 'Editar Perfil',
        html: `
            <input id="e-n" class="swal2-input" value="${p.nome}">
            <input id="e-p" type="number" class="swal2-input" value="${p.preco}">`,
        showCancelButton: true,
        confirmButtonText: 'Salvar',
        preConfirm: () => ({ id: p.id, nome: document.getElementById('e-n').value, preco: document.getElementById('e-p').value })
    });

    if (v) {
        await fetch(`${API_URL}/api/atualizar`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(v)
        });
        carregarProfissionais();
        exibirModalGerenciamento();
    }
}

async function deletarProfissional(id) {
    const confirm = await Swal.fire({ title: 'Excluir?', text: "Esta ação não pode ser desfeita!", icon: 'warning', showCancelButton: true });
    if (confirm.isConfirmed) {
        await fetch(`${API_URL}/api/deletar/${id}`, { method: 'DELETE' });
        carregarProfissionais();
        exibirModalGerenciamento();
    }
}

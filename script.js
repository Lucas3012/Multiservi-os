// CONFIGURAÇÃO SUPABASE
const SUPABASE_URL = 'https://nyggspwfktngppwyovc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55Z2dzcHdma3RuZ3Bwd3lvaXZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzODE2MzcsImV4cCI6MjA4Njk1NzYzN30.mOTBqnqjNCwcGs8-UeJAsBTXzymGoO9iqYUQH8Dl-3s';
const SENHA_MESTRE = "1234"; // Sua senha para gerenciar

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
let profissionaisGlobal = [];

// BUSCAR DADOS DO BANCO
async function carregarProfissionais() {
    const container = document.getElementById('lista-profissionais');
    container.innerHTML = '<p style="grid-column:1/-1; text-align:center;">Carregando dados da nuvem...</p>';

    const { data, error } = await _supabase
        .from('profissionais')
        .select('*')
        .order('nome', { ascending: true });

    if (error) {
        container.innerHTML = "<p>Erro ao conectar ao banco. Verifique o RLS no Supabase.</p>";
    } else {
        profissionaisGlobal = data;
        renderizar(data);
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
            <button class="btn-delete" onclick="deletarProfissional('${p.id}', '${p.nome}')">
                <i class="fas fa-trash-alt"></i>
            </button>
            <h3>${p.nome}</h3>
            <span style="color:var(--primary); font-weight:bold; font-size:0.8rem;">${p.categoria.toUpperCase()}</span>
            <div style="margin: 20px 0; font-size: 1.6rem; font-weight: 800;">R$ ${p.preco},00</div>
            
            <div class="card-buttons">
                <a href="https://wa.me/${p.whatsapp.replace(/\D/g,'')}?text=Orçamento com ${p.nome}" target="_blank" class="btn-card btn-orcamento">
                    <i class="fab fa-whatsapp"></i> Orçamento
                </a>
                <a href="https://wa.me/${p.whatsapp.replace(/\D/g,'')}?text=Vi seu perfil ${p.nome}" target="_blank" class="btn-card btn-perfil">
                    <i class="fas fa-user"></i> Perfil
                </a>
            </div>
        </div>
    `).join('');
}

// CADASTRO COM SENHA
async function abrirFormularioCadastro() {
    const { value: senha } = await Swal.fire({
        title: 'Acesso Restrito',
        input: 'password',
        inputPlaceholder: 'Senha do Administrador',
        showCancelButton: true
    });

    if (senha === SENHA_MESTRE) {
        const { value: f } = await Swal.fire({
            title: 'Novo Cadastro',
            html: `
                <input id="n" class="swal2-input" placeholder="Nome">
                <input id="c" class="swal2-input" placeholder="Categoria">
                <input id="p" type="number" class="swal2-input" placeholder="Preço">
                <input id="w" class="swal2-input" placeholder="WhatsApp (ex: 739...)">`,
            preConfirm: () => ({
                nome: document.getElementById('n').value,
                categoria: document.getElementById('c').value,
                preco: document.getElementById('p').value,
                whatsapp: document.getElementById('w').value
            })
        });

        if (f && f.nome) {
            const { error } = await _supabase.from('profissionais').insert([f]);
            if (!error) {
                Swal.fire('Sucesso!', 'Salvo no banco de dados!', 'success');
                carregarProfissionais();
            } else {
                Swal.fire('Erro', 'Verifique se a tabela permite inserção (RLS).', 'error');
            }
        }
    } else if (senha) {
        Swal.fire('Erro', 'Senha incorreta!', 'error');
    }
}

// APAGAR COM SENHA
async function deletarProfissional(id, nome) {
    const { value: senha } = await Swal.fire({
        title: `Apagar ${nome}?`,
        input: 'password',
        inputPlaceholder: 'Senha para confirmar',
        showCancelButton: true,
        confirmButtonColor: '#ef4444'
    });

    if (senha === SENHA_MESTRE) {
        const { error } = await _supabase.from('profissionais').delete().eq('id', id);
        if (!error) {
            Swal.fire('Removido!', '', 'success');
            carregarProfissionais();
        }
    } else if (senha) {
        Swal.fire('Erro', 'Senha incorreta!', 'error');
    }
}

// FILTRO E MENU
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
function sobreNos() { Swal.fire('MultiServiços PRO', 'Banco de dados na nuvem via Supabase.', 'info'); }

carregarProfissionais();

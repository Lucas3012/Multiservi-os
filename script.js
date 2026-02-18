// BANCO DE DADOS LOCAL
const profissionais = [
    {
        id: 1,
        nome: "Exemplo Profissional",
        categoria: "Serviços",
        preco: "100",
        whatsapp: "5573988478170"
    }
];

// Funções de Interface
function toggleMenu() {
    document.getElementById('sidebar').classList.toggle('active');
    document.querySelector('.sidebar-overlay').classList.toggle('active');
}

function fecharEIr(f) {
    toggleMenu();
    f();
}

// Renderização dos Cards
function renderizar(lista) {
    const container = document.getElementById('lista-profissionais');
    if (lista.length === 0) {
        container.innerHTML = "<p style='grid-column:1/-1; text-align:center;'>Nenhum profissional encontrado.</p>";
        return;
    }

    container.innerHTML = lista.map(p => `
        <div class="card">
            <h3 style="margin:0">${p.nome}</h3>
            <span style="color:var(--primary); font-weight:bold; font-size:0.8rem; text-transform:uppercase;">${p.categoria}</span>
            <div style="margin: 20px 0; font-size: 1.6rem; font-weight: 800;">
                R$ ${p.preco},00
            </div>
            <a href="https://wa.me/${p.whatsapp.replace(/\D/g,'')}" target="_blank" class="btn-whats">
                <i class="fab fa-whatsapp"></i> Chamar no WhatsApp
            </a>
        </div>
    `).join('');
}

// Lógica de busca
document.getElementById('filtro').addEventListener('input', (e) => {
    const termo = e.target.value.toLowerCase();
    const filtrados = profissionais.filter(p => 
        p.nome.toLowerCase().includes(termo) || 
        p.categoria.toLowerCase().includes(termo)
    );
    renderizar(filtrados);
});

// Funções do Menu
function avisarCadastro() {
    Swal.fire({
        title: 'Seja um Parceiro!',
        text: 'Deseja entrar em contato para cadastrar seu perfil profissional?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sim, chamar no WhatsApp',
        cancelButtonText: 'Agora não'
    }).then((result) => {
        if (result.isConfirmed) {
            window.open('https://wa.me/5573988478170?text=Olá, gostaria de cadastrar meu perfil profissional no site.');
        }
    });
}

function sobreNos() {
    Swal.fire({
        title: 'Sobre a Plataforma',
        text: 'Conectando os melhores profissionais aos clientes da região.',
        icon: 'info'
    });
}

// Iniciar página
renderizar(profissionais);

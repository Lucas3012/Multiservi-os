// BANCO DE DADOS LOCAL (Adicione ou remova perfis aqui)
const profissionais = [
    {
        id: 1,
        nome: "Ricardo Santos",
        categoria: "Eletricista",
        preco: "120",
        whatsapp: "5573988478170"
    },
    {
        id: 2,
        nome: "Juliana Mendes",
        categoria: "Diarista",
        preco: "180",
        whatsapp: "5573988478170"
    },
    {
        id: 3,
        nome: "Marcos Oliveira",
        categoria: "Pintor",
        preco: "250",
        whatsapp: "5573988478170"
    },
    {
        id: 4,
        nome: "Lucas Silva",
        categoria: "Montador de Móveis",
        preco: "90",
        whatsapp: "5573988478170"
    }
];

// Interface do Menu
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

// Renderização dos Profissionais
function renderizar(lista) {
    const container = document.getElementById('lista-profissionais');
    if (lista.length === 0) {
        container.innerHTML = "<p style='grid-column:1/-1; text-align:center; padding: 40px; color: #64748b;'>Nenhum profissional encontrado com esse nome.</p>";
        return;
    }

    container.innerHTML = lista.map(p => `
        <div class="card">
            <h3 style="margin:0; font-size: 1.5rem; font-weight: 800;">${p.nome}</h3>
            <span style="color:var(--primary); font-weight:bold; font-size:0.85rem; text-transform:uppercase; letter-spacing: 1px;">${p.categoria}</span>
            <div style="margin: 25px 0; font-size: 1.8rem; font-weight: 800; color: #0f172a;">
                R$ ${p.preco},00
            </div>
            <a href="https://wa.me/${p.whatsapp.replace(/\D/g,'')}?text=Olá ${p.nome}, vi seu anúncio no MultiServiços PRO." target="_blank" class="btn-whats">
                <i class="fab fa-whatsapp" style="font-size: 1.3rem;"></i> Chamar no WhatsApp
            </a>
        </div>
    `).join('');
}

// Filtro de Busca em Tempo Real
document.getElementById('filtro').addEventListener('input', (e) => {
    const termo = e.target.value.toLowerCase();
    const filtrados = profissionais.filter(p => 
        p.nome.toLowerCase().includes(termo) || 
        p.categoria.toLowerCase().includes(termo)
    );
    renderizar(filtrados);
});

// Ações do Menu Lateral
function avisarCadastro() {
    Swal.fire({
        title: 'Quer ser um parceiro?',
        text: 'Cadastre seu perfil e apareça para centenas de clientes na região!',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#2563eb',
        confirmButtonText: 'Falar com Administrador',
        cancelButtonText: 'Depois'
    }).then((result) => {
        if (result.isConfirmed) {
            window.open('https://wa.me/5573988478170?text=Olá! Gostaria de cadastrar meu serviço no MultiServiços PRO.');
        }
    });
}

function sobreNos() {
    Swal.fire({
        title: 'MultiServiços PRO',
        text: 'Nossa missão é facilitar a conexão entre profissionais qualificados e clientes que buscam excelência e rapidez.',
        icon: 'info',
        confirmButtonColor: '#2563eb'
    });
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    renderizar(profissionais);
});

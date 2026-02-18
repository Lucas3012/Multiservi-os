// BANCO DE DADOS LOCAL
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
    }
];

// Controles do Menu
function toggleMenu() {
    document.getElementById('sidebar').classList.toggle('active');
    document.querySelector('.sidebar-overlay').classList.toggle('active');
}

function fecharEIr(f) {
    toggleMenu();
    f();
}

// Renderização dos Cards com 2 Botões
function renderizar(lista) {
    const container = document.getElementById('lista-profissionais');
    if (lista.length === 0) {
        container.innerHTML = "<p style='grid-column:1/-1; text-align:center; padding: 40px;'>Nenhum profissional encontrado.</p>";
        return;
    }

    container.innerHTML = lista.map(p => `
        <div class="card">
            <h3 style="margin:0; font-size: 1.5rem; font-weight: 800;">${p.nome}</h3>
            <span style="color:var(--primary); font-weight:bold; font-size:0.85rem; text-transform:uppercase;">${p.categoria}</span>
            <div style="margin: 25px 0; font-size: 1.8rem; font-weight: 800; color: #0f172a;">
                R$ ${p.preco},00
            </div>
            
            <div class="card-buttons">
                <a href="https://wa.me/${p.whatsapp.replace(/\D/g,'')}?text=Olá ${p.nome}, gostaria de um orçamento." 
                   target="_blank" class="btn-card btn-orcamento">
                    <i class="fab fa-whatsapp"></i> Orçamento
                </a>
                
                <a href="https://wa.me/${p.whatsapp.replace(/\D/g,'')}?text=Olá ${p.nome}, vi seu perfil no site e gostaria de mais informações." 
                   target="_blank" class="btn-card btn-perfil">
                    <i class="fas fa-user"></i> Perfil
                </a>
            </div>
        </div>
    `).join('');
}

// Busca em tempo real
document.getElementById('filtro').addEventListener('input', (e) => {
    const termo = e.target.value.toLowerCase();
    const filtrados = profissionais.filter(p => 
        p.nome.toLowerCase().includes(termo) || 
        p.categoria.toLowerCase().includes(termo)
    );
    renderizar(filtrados);
});

// Ações do Menu
function avisarCadastro() {
    Swal.fire({
        title: 'Seja um Parceiro!',
        text: 'Deseja cadastrar o seu serviço no nosso site?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Falar com Administrador',
        cancelButtonText: 'Agora não'
    }).then((result) => {
        if (result.isConfirmed) {
            window.open('https://wa.me/5573988478170?text=Olá! Gostaria de cadastrar meu serviço no site.');
        }
    });
}

function sobreNos() {
    Swal.fire({
        title: 'Sobre a Plataforma',
        text: 'O MultiServiços PRO liga os melhores profissionais aos clientes da região de forma rápida e segura.',
        icon: 'info'
    });
}

// Iniciar
document.addEventListener('DOMContentLoaded', () => {
    renderizar(profissionais);
});

// BANCO DE DADOS FIXO (Como não tem servidor, os dados ficam aqui)
const profissionais = [
    {
        id: 1,
        nome: "João Silva",
        categoria: "Encanador",
        preco: 150,
        whatsapp: "5511999999999"
    },
    {
        id: 2,
        nome: "Maria Oliveira",
        categoria: "Diarista",
        preco: 200,
        whatsapp: "5511888888888"
    }
    // Para adicionar mais, basta copiar e colar um bloco acima aqui
];

function renderizar(lista) {
    const container = document.getElementById('lista-profissionais');
    container.innerHTML = lista.map(p => `
        <div class="card">
            <h3 style="margin:0">${p.nome}</h3>
            <p style="color:var(--primary); font-weight:bold; font-size:0.8rem">${p.categoria.toUpperCase()}</p>
            <p style="font-size:1.5rem; font-weight:800; margin:15px 0;">R$ ${p.preco},00</p>
            <a href="https://wa.me/${p.whatsapp}" target="_blank" class="btn-whats">
                <i class="fab fa-whatsapp"></i> Contatar
            </a>
        </div>
    `).join('');
}

// Filtro de Busca
document.getElementById('filtro').addEventListener('input', (e) => {
    const termo = e.target.value.toLowerCase();
    const filtrados = profissionais.filter(p => 
        p.nome.toLowerCase().includes(termo) || 
        p.categoria.toLowerCase().includes(termo)
    );
    renderizar(filtrados);
});

// Inicializar a página
renderizar(profissionais);

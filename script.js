// --- IMPORTANTE: Altere para o seu link do LocalTunnel ou IP do Celular ---
const API_URL = "http://localhost:3000"; 

let listaOriginal = [];

function toggleMenu() {
    document.getElementById('sidebar').classList.toggle('active');
    document.querySelector('.sidebar-overlay').classList.toggle('active');
}

function fecharEIr(f) { toggleMenu(); f(); }

async function carregarProfissionais() {
    const container = document.getElementById('lista-profissionais');
    container.innerHTML = Array(3).fill('<div class="skeleton"></div>').join('');
    
    try {
        const res = await fetch(`${API_URL}/api/profissionais`);
        listaOriginal = await res.json();
        renderizar(listaOriginal);
    } catch (err) {
        container.innerHTML = "<p>Servidor offline ou link expirado.</p>";
    }
}

function renderizar(lista) {
    const container = document.getElementById('lista-profissionais');
    container.innerHTML = lista.map(p => `
        <div class="card">
            <h3>${p.nome}</h3>
            <p style="color:var(--primary)">${p.categoria}</p>
            <p><strong>R$ ${p.preco},00</strong></p>
            <button onclick="window.open('https://wa.me/55${p.whatsapp}')" style="background:#25d366; color:white; border:none; padding:10px; border-radius:5px; width:100%; cursor:pointer;">
                <i class="fab fa-whatsapp"></i> Contatar
            </button>
        </div>
    `).join('');
}

async function abrirFormularioCadastro() {
    const { value: v } = await Swal.fire({
        title: 'Novo Perfil',
        html: `
            <input id="n" class="swal2-input" placeholder="Nome">
            <input id="w" class="swal2-input" placeholder="WhatsApp">
            <input id="p" type="number" class="swal2-input" placeholder="Preço">
            <select id="c" class="swal2-input"><option>Encanador</option><option>Eletricista</option></select>`,
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

carregarProfissionais();

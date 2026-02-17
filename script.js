let listaOriginal = [];
const SENHA_MASTER = "1234";

function toggleMenu() {
    document.getElementById('sidebar').classList.toggle('active');
    document.querySelector('.sidebar-overlay').classList.toggle('active');
}

function fecharEIr(funcao) { toggleMenu(); funcao(); }

async function carregarProfissionais() {
    const container = document.getElementById('lista-profissionais');
    const rankingBox = document.getElementById('ranking-container');
    
    // Iniciar com Skeletons
    rankingBox.style.display = 'none';
    container.innerHTML = Array(6).fill('<div class="skeleton"></div>').join('');
    
    try {
        const res = await fetch('/api/profissionais');
        listaOriginal = await res.json();
        
        // Simular delay para mostrar o Skeleton de forma elegante
        setTimeout(() => {
            renderizarRanking(listaOriginal);
            renderizar(listaOriginal);
        }, 800);
    } catch (err) {
        container.innerHTML = "<p>Erro ao conectar com o servidor.</p>";
    }
}

function renderizar(lista) {
    const container = document.getElementById('lista-profissionais');
    if (lista.length === 0) {
        container.innerHTML = "<p>Nenhum profissional encontrado.</p>";
        return;
    }
    container.innerHTML = lista.map(p => `
        <div class="card">
            <h3 style="margin:0">${p.nome}</h3>
            <span style="color:var(--primary); font-weight:bold; font-size:0.8rem">${p.categoria.toUpperCase()}</span>
            <div class="estrelas-container" onclick="abrirVotacao(${p.id}, '${p.nome}')">
                ${gerarEstrelas(p.avaliacao)} <span>(${p.avaliacao || 0})</span>
            </div>
            <p style="font-weight:800; font-size:1.3rem; margin: 10px 0;">R$ ${p.preco},00</p>
            <button class="btn-agendar" onclick="abrirAgendamento('${p.nome}','${p.whatsapp}')">WhatsApp</button>
        </div>`).join('');
}

function renderizarRanking(lista) {
    const container = document.getElementById('lista-ranking');
    const box = document.getElementById('ranking-container');
    const top3 = [...lista].filter(p => p.avaliacao > 0).sort((a,b) => b.avaliacao - a.avaliacao).slice(0,3);
    
    if(top3.length > 0) {
        box.style.display = 'block';
        container.innerHTML = top3.map(p => `
            <div class="card card-ranking">
                <i class="fas fa-crown" style="position:absolute; top:15px; right:15px; color:#f59e0b; font-size:1.2rem"></i>
                <h4 style="margin:0">${p.nome}</h4>
                <div class="estrelas-container">${gerarEstrelas(p.avaliacao)} <b>${p.avaliacao}</b></div>
                <button class="btn-agendar" style="background:#f59e0b" onclick="abrirAgendamento('${p.nome}','${p.whatsapp}')">Elite</button>
            </div>`).join('');
    } else { box.style.display = 'none'; }
}

function gerarEstrelas(n) {
    let h = '';
    for(let i=1; i<=5; i++) h += `<i class="${i <= Math.round(n) ? 'fas' : 'far'} fa-star"></i>`;
    return h;
}

async function abrirVotacao(id, nome) {
    const { value: nota } = await Swal.fire({ title: `Avaliar ${nome}`, text: "Nota de 1 a 5", input: 'range', inputAttributes: {min:1, max:5, step:1}, inputValue:5 });
    if(nota) {
        await fetch('/api/avaliar', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({id, nota}) });
        carregarProfissionais();
    }
}

function filtrarPorCategoria(cat) {
    document.querySelectorAll('.btn-categoria').forEach(b => b.classList.toggle('active', b.innerText.toLowerCase().includes(cat.toLowerCase()) || (cat=='todos' && b.innerText=='Todos')));
    renderizar(cat === 'todos' ? listaOriginal : listaOriginal.filter(p => p.categoria === cat));
}

document.getElementById('filtro').addEventListener('input', e => {
    const t = e.target.value.toLowerCase();
    renderizar(listaOriginal.filter(p => p.nome.toLowerCase().includes(t) || p.categoria.toLowerCase().includes(t)));
});

async function abrirFormularioCadastro() {
    const { value: v } = await Swal.fire({
        title: 'Criar Perfil',
        html: `<input id="s-n" class="swal2-input" placeholder="Nome"><input id="s-w" class="swal2-input" placeholder="WhatsApp"><input id="s-p" type="number" class="swal2-input" placeholder="Preço"><select id="s-c" class="swal2-input"><option>Encanador</option><option>Eletricista</option><option>Diarista</option><option>Montador</option></select>`,
        preConfirm: () => ({ nome: document.getElementById('s-n').value, whatsapp: document.getElementById('s-w').value, preco: document.getElementById('s-p').value, categoria: document.getElementById('s-c').value })
    });
    if(v && v.nome) { await fetch('/api/cadastrar', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(v) }); carregarProfissionais(); }
}

async function abrirPainelMaster() {
    const { value: s } = await Swal.fire({ title: 'Acesso Master', input: 'password', confirmButtonColor: '#2563eb' });
    if(s === SENHA_MASTER) {
        let t = `<div style="max-height:300px;overflow-y:auto"><table style="width:100%">${listaOriginal.map(p => `<tr style="border-bottom:1px solid #eee"><td style="padding:10px;text-align:left">${p.nome}</td><td><button onclick="excluirQualquerUm(${p.id})" style="background:#ef4444; color:white; border:none; padding:8px; border-radius:6px; cursor:pointer">Apagar</button></td></tr>`).join('')}</table></div>`;
        Swal.fire({ title: 'Gestão de Perfis', html: t, showConfirmButton: false });
    }
}

async function excluirQualquerUm(id) {
    if(confirm("Eliminar este perfil?")) {
        await fetch(`/api/deletar/${id}`, { method: 'DELETE' });
        carregarProfissionais(); Swal.close();
    }
}

function abrirAgendamento(n, w) { window.open(`https://api.whatsapp.com/send?phone=55${w.replace(/\D/g,'')}&text=Olá ${n}, gostaria de um orçamento.`); }

async function abrirLoginProfissional() {
    const { value: log } = await Swal.fire({ title: 'Meu Perfil', html: `<input id="l-n" class="swal2-input" placeholder="Nome"><input id="l-w" class="swal2-input" placeholder="WhatsApp">`, preConfirm: () => ({ nome: document.getElementById('l-n').value, whatsapp: document.getElementById('l-w').value }) });
    if (log) {
        const res = await fetch('/api/login', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(log) });
        if(res.ok) { const d = await res.json(); abrirEdicao(d.usuario); } else { Swal.fire("Erro", "Dados incorretos", "error"); }
    }
}

async function abrirEdicao(u) {
    const { value: n } = await Swal.fire({ title: 'Editar Perfil', html: `<input id="e-n" class="swal2-input" value="${u.nome}"><input id="e-w" class="swal2-input" value="${u.whatsapp}"><input id="e-p" type="number" class="swal2-input" value="${u.preco}">`, preConfirm: () => ({ id: u.id, nome: document.getElementById('e-n').value, whatsapp: document.getElementById('e-w').value, preco: document.getElementById('e-p').value, categoria: u.categoria }) });
    if(n) { await fetch('/api/atualizar', { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(n) }); carregarProfissionais(); }
}

carregarProfissionais();

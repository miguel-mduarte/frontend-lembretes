const API_URL = 'http://localhost:4000/lembretes';
const form = document.getElementById('form-lembretes');
const lembretesContainer = document.getElementById('lembretes');
const btnObs = document.getElementById('btn-obs');
const obsForms = document.getElementById('obs-forms');

// Evento para criar um novo lembrete
form.addEventListener('submit', (event) => {
    event.preventDefault(); // Evita o comportamento padrão do formulário
    const texto = document.getElementById('texto').value;

    fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto }),
    })
        .then(() => carregarLembretes())
        .catch((err) => console.error('Erro ao criar lembrete:', err));
    document.getElementById('texto').value = '';
});

// Função para carregar os lembretes
const carregarLembretes = () => {
    fetch(API_URL)
        .then((res) => res.json())
        .then((data) => {
            lembretesContainer.innerHTML = ''; // Limpa o contêiner antes de adicionar os lembretes
            Object.values(data).forEach((lembrete) => {
                const novoLembrete = criarLembrete(lembrete.id, lembrete.texto);
                lembretesContainer.appendChild(novoLembrete);
            });
        })
        .catch((err) => console.error('Erro ao carregar lembretes:', err));
};

// Função para criar um elemento DOM para o lembrete
const criarLembrete = (id, texto) => {
    const novoLembrete = document.createElement('div');
    novoLembrete.classList.add('card', 'lembrete');
    novoLembrete.id = `lembrete-${id}`;
    novoLembrete.innerHTML = `
        <div class="card-header d-flex justify-content-between align-items-center">
            <h3 class="mb-0">${texto}</h3>
            <button type="button" class="btn btn-outline-danger btn-delete-lembrete">
                <i class="bi bi-trash3-fill"></i>
            </button>
        </div>
        <ul class="list-group list-group-flush" id="lembrete-observacoes-${id}"></ul>
        <div class="d-flex justify-content-center mt-3 mb-3">
            <button type="button" class="btn btn-primary btn-add-obs" data-id="${id}">
                <i class="bi bi-plus-circle"></i> Adicionar Observação
            </button>
        </div>
    `;

    // Adiciona eventos aos botões do lembrete
    novoLembrete.querySelector('.btn-delete-lembrete').addEventListener('click', () => excluirLembrete(id));
    novoLembrete.querySelector('.btn-add-obs').addEventListener('click', () => adicionarFormularioObservacao(id));

    return novoLembrete;
};

// Função para excluir um lembrete
// const excluirLembrete = (id) => {
//     fetch(`${API_URL}/${id}`, { method: 'DELETE' })
//         .then(() => carregarLembretes())
//         .catch((err) => console.error('Erro ao excluir lembrete:', err));
// };

// Função para adicionar o formulário de observação
const adicionarFormularioObservacao = (id) => {
    const observacoesContainer = document.getElementById(`lembrete-observacoes-${id}`);
    const novaObservacao = document.createElement('li');
    novaObservacao.classList.add('list-group-item');
    novaObservacao.innerHTML = `
        <form class="form-container form-lembrete-obs" id="form-obs-${id}">
            <textarea class="form-control mb-2" id="texto-obs-${id}" rows="1" placeholder="Digite sua observação"></textarea>
            <div class="d-flex justify-content-center">
                <button type="submit" class="btn btn-primary">
                    <i class="bi bi-upload btn-enviar"></i> Enviar
                </button>
            </div>
        </form>
    `;

    observacoesContainer.appendChild(novaObservacao);

    // Evento para enviar a observação
    const formObs = document.getElementById(`form-obs-${id}`);
    formObs.addEventListener('submit', (event) => {
        event.preventDefault();
        const texto = document.getElementById(`texto-obs-${id}`).value;

        // Substitui o formulário pela observação definitiva
        novaObservacao.classList.add('d-flex', 'justify-content-between', 'align-items-center');
        novaObservacao.innerHTML = `
            <span>${texto}</span>
            <button type="button" class="btn btn-outline-danger btn-delete-obs">
                <i class="bi bi-trash3-fill"></i>
            </button>
        `;

        // Evento para excluir a observação
        novaObservacao.querySelector('.btn-delete-obs').addEventListener('click', () => novaObservacao.remove());
    });
};

// Evento para o botão de adicionar observação no formulário principal
btnObs.addEventListener('click', () => {
    const novaObservacao = document.createElement('li');
    novaObservacao.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    novaObservacao.innerHTML = `
        <textarea class="form-control obs-input me-2" rows="1" placeholder="Digite sua observação"></textarea>
        <button type="button" class="btn btn-outline-danger btn-delete-obs">
            <i class="bi bi-trash3-fill"></i>
        </button>
    `;

    // Evento para excluir a observação
    novaObservacao.querySelector('.btn-delete-obs').addEventListener('click', () => novaObservacao.remove());

    obsForms.appendChild(novaObservacao);
});

// Carrega os lembretes ao iniciar
carregarLembretes();
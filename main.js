// URL base do seu projeto no MockAPI
const API_URL = 'https://6a29decff59cb8f65f1dae28.mockapi.io/cadastro';

// Cache para evitar carregar a lista novamente evitando uma nova requisição
let listaMateriaisCache = [];

// limpa campos do formulário
const limparFormulario = () => {
    document.getElementById('input-nome').value = '';
    document.getElementById('input-quantidade').value = '';
    document.getElementById('select-categoria').value = '1';
    document.getElementById('input-data-cadastro').value = '';
};

// Mostra a tabela e recebe um array com objetos da api
const preencherTabela = (listaDeCadastros) => {
    const tabela = document.getElementById('lista-materiais');

    tabela.innerHTML = `
        <tr>
            <th>ID</th>
            <th>Nome do Material</th>
            <th>Quantidade</th>
            <th>Categoria</th>
            <th>Data de Cadastro</th>
            <th>Ações</th>
        </tr>
        ${listaDeCadastros.map(item => `
            <tr>
                <td>${item.id}</td>
                <td>${item.nomeMaterial}</td>
                <td>${item.quantidade}</td>
                <td>${item.categoria === '1' ? 'Material de consumo' : 'Material permanente'}</td>
                <td>${item.dataCadastro}</td>
                <td>
                    <button class="btn-excluir" onclick="deletarCadastro('${item.id}')">Excluir</button>
                </td>
            </tr>
        `).join('')}
    `;
};

// Preencher select da seção de retirada com materiais já cadastrados
const preencherSelectRetirada = (listaDeCadastros) => {
    const select = document.getElementById('select-item-retirada');
 
    if (listaDeCadastros.length === 0) {
        select.innerHTML = '<option value="">Nenhum material cadastrado</option>';
        return;
    }
 
    select.innerHTML = listaDeCadastros.map(item => `
        <option value="${item.id}">${item.nomeMaterial} (estoque: ${item.quantidade})</option>
    `).join('');
};

// Busca cadastros e chama o preencher tabela
const buscarCadastros = () => {
    fetch(API_URL, {
        method: 'GET',
        headers: { 'content-type': 'application/json' }
    })
    .then(res => res.json())
    .then(dados => {
        listaMateriaisCache = dados;
        preencherTabela(dados);
        preencherSelectRetirada(dados);
    })
    .catch(erro => console.error('Erro ao buscar:', erro));
};

// Envia para a API usando o POST
const cadastrarApi = (event) => {
    event.preventDefault();

    const nome = document.getElementById('input-nome').value;
    const quantidade = document.getElementById('input-quantidade').value;
    const categoria = document.getElementById('select-categoria').value;
    const dataCadastro = document.getElementById('input-data-cadastro').value;

    if (!nome || !quantidade || !dataCadastro) {
        alert('Preencha todos os campos antes de cadastrar.');
        return;
    }

    const botao = document.getElementById('btn-cadastrar');
    botao.disabled = true;
    botao.textContent = 'Cadastrando...';

    const novoCadastro = {
        nomeMaterial: nome,
        quantidade: Number(quantidade),
        categoria: categoria, // '1' = consumo, '2' = permanente
        dataCadastro: dataCadastro
    };

    fetch(API_URL, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(novoCadastro)
    })
    .then(res => res.json())
    .then(cadastroCriado => {
        console.log('Cadastrado com sucesso:', cadastroCriado);
        limparFormulario();
        buscarCadastros();
    })
    .catch(erro => console.error('Erro ao cadastrar:', erro))
    .finally(() => {
        botao.disabled = false;
        botao.textContent = 'Cadastrar';
    });

};

// Remover cadastro de item
const deletarCadastro = (id) => {
    fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    })
    .then(res => res.json())
    .then(() => {
        buscarCadastros();
    })
    .catch(erro => console.error('Erro ao deletar:', erro));
};

// Chama o botão cadastrar e deixa os dados em exibição
document.getElementById('btn-cadastrar').addEventListener('click', (event) => cadastrarApi(event));

buscarCadastros();
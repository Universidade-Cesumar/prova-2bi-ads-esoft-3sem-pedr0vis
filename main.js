// URL base do seu projeto no MockAPI
const API_URL = 'https://6a29decff59cb8f65f1dae28.mockapi.io/cadastro';

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
            <th>Acoes</th>
        </tr>
        ${listaDeCadastros.map(item => `
            <tr>
                <td>${item.id}</td>
                <td>${item.nomeMaterial}</td>
                <td>${item.quantidade}</td>
                <td>${item.categoria === '1' ? 'Material de consumo' : 'Material permanente'}</td>
                <td>${item.dataCadastro}</td>
                <td>
                    <button onclick="deletarCadastro('${item.id}')">Remover</button>
                </td>
            </tr>
        `).join('')}
    `;
};

// Busca cadastros e chama o preencher tabela
const buscarCadastros = () => {
    fetch(API_URL, {
        method: 'GET',
        headers: { 'content-type': 'application/json' }
    })
    .then(res => res.json())
    .then(dados => {
        preencherTabela(dados);
    })
    .catch(erro => console.error('Erro ao buscar:', erro));
};

// Envia para a API usando o POST
const cadastrarApi = () => {
    const nome = document.getElementById('input-nome').value;
    const quantidade = document.getElementById('input-quantidade').value;

    if (!nome || !quantidade) {
        alert('Preencha todos os campos antes de cadastrar.');
        return;
    }
    const novoCadastro = {
        nomeMaterial: nome,
        quantidade: Number(quantidade)
    };

    // Envia o POST para o MockAPI
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
    .catch(erro => console.error('Erro ao cadastrar:', erro));
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
document.getElementById('btn-cadastrar').addEventListener('click', cadastrarApi);

buscarCadastros();
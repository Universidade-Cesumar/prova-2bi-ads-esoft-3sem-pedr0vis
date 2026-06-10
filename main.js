// URL base do seu projeto no MockAPI
const API_URL = 'https://6a29decff59cb8f65f1dae28.mockapi.io/cadastro';

// limpa campos do formulário
const limparFormulario = () => {
    document.getElementById('input-nome').value = '';
    document.getElementById('input-quantidade').value = '';
};

// Mostra a tabela e recebe um array com objetos da api
const preencherTabela = (listaDeCadastros) => {
    const tabela = document.getElementById('lista-materiais');

    // Monta o cabeçalho e as linhas em HTML
    tabela.innerHTML = `
        <tr>
            <th>ID</th>
            <th>Nome do Material</th>
            <th>Quantidade</th>
            <th>Acoes</th>
        </tr>
        ${listaDeCadastros.map(item => `
            <tr>
                <td>${item.id}</td>
                <td>${item.nomeMaterial}</td>
                <td>${item.quantidade}</td>
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


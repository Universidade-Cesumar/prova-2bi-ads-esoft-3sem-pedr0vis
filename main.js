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
// URL base do seu projeto no MockAPI
const API_URL = 'https://6a29decff59cb8f65f1dae28.mockapi.io/cadastro';

// Resource de movimentações para registrar histórico de retiradas
const API_MOVIMENTACOES = 'https://6a29decff59cb8f65f1dae28.mockapi.io/movimentacoes';

// Cache para evitar carregar a lista novamente evitando uma nova requisição
let listaMateriaisCache = [];

// limpa campos do formulário
const limparFormulario = () => {
    document.getElementById('input-nome').value = '';
    document.getElementById('input-quantidade').value = '';
    document.getElementById('select-categoria').value = '1';
    document.getElementById('input-data-cadastro').value = '';
    document.getElementById('input-data-validade').value = '';
};

// Mostra a tabela e recebe um array com objetos da api
const preencherTabela = (listaDeCadastros) => {
    const tabela = document.getElementById('lista-materiais');
 
    tabela.innerHTML = `
        <tr>
            <th>Nome do Material</th>
            <th>Quantidade</th>
            <th>Status</th>
            <th>Categoria</th>
            <th>Data de Cadastro</th>
            <th>Data de Validade</th>
            <th>Ações</th>
        </tr>
        ${listaDeCadastros.map(item => {
            const estoque = verificarEstoque(item.quantidade);
            const validade = verificarValidade(item.dataValidade);
            return `
            <tr class="${estoque.classe} ${validade.background}">
                <td>${item.nomeMaterial}</td>
                <td>${item.quantidade}</td>
                <td>${estoque.status}</td>
                <td>${item.categoria === '1' ? 'Material de consumo' : 'Material permanente'}</td>
                <td>${item.dataCadastro}</td>
                <td>${item.dataValidade || '—'}</td>
                <td>
                    <button class="btn-excluir" onclick="deletarCadastro('${item.id}')">Excluir</button>
                </td>
            </tr>
        `}).join('')}
    `;
 
    document.getElementById('total-itens').textContent = listaDeCadastros.length;
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

// Filtra a lista pelo termo digitado no input de busca
const filtrarMateriais = () => {
    const termo = document.getElementById('input-busca').value.toLowerCase().trim();

    const listaFiltrada = listaMateriaisCache.filter(item =>
        item.nomeMaterial.toLowerCase().includes(termo)
    );

    preencherTabela(listaFiltrada);
};

// Busca cadastros e chama o preencher tabela
const buscarCadastros = async () => {
    try {
        const res = await fetch(API_URL, {
            method: 'GET',
            headers: { 'content-type': 'application/json' }
        });

        if (!res.ok) throw new Error(`Erro HTTP ${res.status}`);

        const dados = await res.json();
        listaMateriaisCache = dados;
        preencherTabela(dados);
        preencherSelectRetirada(dados);

    } catch (erro) {
        console.error('Erro ao buscar cadastros:', erro);
        alert('Não foi possível carregar os materiais. Verifique sua conexão e tente novamente.');
    }
};

// Envia para a API usando o POST
const cadastrarApi = async (event) => {
    event.preventDefault();

    const nome = document.getElementById('input-nome').value;
    const quantidade = document.getElementById('input-quantidade').value;
    const categoria = document.getElementById('select-categoria').value;
    const dataCadastro = document.getElementById('input-data-cadastro').value;
    const dataValidade = document.getElementById('input-data-validade').value;

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
        dataCadastro: dataCadastro,
        dataValidade: dataValidade || null
    };

    // Try chamando o cadastro com sucesso e usando funções de limpar formulário e buscar cadastros atualizados
    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(novoCadastro)
        });

        if (!res.ok) throw new Error(`Erro HTTP ${res.status}`);

        const cadastroCriado = await res.json();
        console.log('Cadastrado com sucesso:', cadastroCriado);
        limparFormulario();
        buscarCadastros();

    } catch (erro) {
        console.error('Erro ao cadastrar:', erro);
        alert('Não foi possível cadastrar o material. Verifique sua conexão e tente novamente.');
    } finally {
        botao.disabled = false;
        botao.textContent = 'Cadastrar';
    }
};

// Remover cadastro de item
const deletarCadastro = async (id) => {
    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!res.ok) throw new Error(`Erro HTTP ${res.status}`);

        await res.json();
        buscarCadastros();

    } catch (erro) {
        console.error('Erro ao deletar:', erro);
        alert('Não foi possível excluir o material. Verifique sua conexão e tente novamente.');
    }
};

// Validações de retirada de itens do estoque
const validarRetirada = (estoqueAtual, quantidadeRetirada) => {
    const estoque = Number(estoqueAtual);
    const retirada = Number(quantidadeRetirada);

    if (Number.isNaN(estoque) || Number.isNaN(retirada)) { // bloqueando valores inválidos
        return false;
    }

    if (retirada <= 0) { // Bloqueia retirada de 0 itens ou negativo
        return false;
    }

    if (estoque < 0) { // bloqueia estoque atual inválido
        return false;
    }

    if (retirada > estoque) { // Bloqueia a retirada de mais itens do que se tem em estoque
        return false;
    }

    return true;
};

// Verificar a validade do material
const verificarValidade = (dataValidade) => {
    if (!dataValidade) return { classe: '', background: '' };
 
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
 
    const validade = new Date(dataValidade);
    validade.setHours(0, 0, 0, 0);
 
    const diffMs = validade - hoje;
    const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
 
    if (diffDias < 0) return { background: 'validade-vencida' };
    if (diffDias <= 15) return { background: 'validade-proxima' };
    return { background: '' };
};

// Verificar o estoque disponível
const verificarEstoque = (quantidade) => {
    if (quantidade === 0) return { classe: 'estoque-critico', status: '🔴 Estoque zerado' };
    if (quantidade <= 10) return { classe: 'estoque-critico estoque-alerta', status: '🟡 Alerta' };
    return { classe: '', status: '🟢 Disponível' };
};

// Exibir na mensagem itens retirados ou erros de retirada
const exibirMensagemRetirada = (texto, tipoErro) => {
    const mensagem = document.getElementById('mensagem-retirada');
    mensagem.textContent = texto;
    mensagem.style.color = tipoErro ? '#c0392b' : '#1a6faf';
};

// Registrar movimentação de materiais
const registrarMovimentacao = async (material, quantidadeRetirada, novoEstoque, responsavel) => {
    const movimentacao = {
        responsavel: responsavel,
        nomeMaterial: material.nomeMaterial,
        dataRetirada: new Date().toLocaleDateString('pt-BR'),
        quantidadeRetirada: Number(quantidadeRetirada),
        estoqueAposRetirada: novoEstoque
    };
 
    try {
        const res = await fetch(API_MOVIMENTACOES, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(movimentacao)
        });
 
        if (!res.ok) throw new Error(`Erro HTTP ${res.status}`);
 
        const registro = await res.json();
        console.log('Movimentação registrada:', registro);
 
    } catch (erro) {
        console.error('Erro ao registrar movimentação:', erro);
    }
};

// Confirma a baixa dos itens retirados e atualiza no MockAPI
const confirmarBaixa = async (event) => {
    event.preventDefault();

    const idSelecionado = document.getElementById('select-item-retirada').value;
    const quantidadeRetirada = document.getElementById('input-retirada').value;
    const responsavel = document.getElementById('input-responsavel-retirada').value;

    if (!idSelecionado) {
        exibirMensagemRetirada('Selecione um material para retirar.', true);
        return;
    }

    if (!responsavel) {
        exibirMensagemRetirada('Informe o responsável pela retirada.', true);
        return;
    }

    // Busca o material correspondente no cache local para saber o estoque atual
    const material = listaMateriaisCache.find(item => item.id === idSelecionado);

    if (!material) {
        exibirMensagemRetirada('Material não encontrado. Atualize a página.', true);
        return;
    }

    const estoqueAtual = material.quantidade;

    if (!validarRetirada(estoqueAtual, quantidadeRetirada)) {
        exibirMensagemRetirada(
            `Retirada inválida. Estoque atual: ${estoqueAtual}, tentativa: ${quantidadeRetirada}.`,
            true
        );
        return;
    }

    const novoEstoque = estoqueAtual - Number(quantidadeRetirada);

    const botao = document.getElementById('btn-confirmar-baixa');
    botao.disabled = true;
    botao.textContent = 'Processando...';

    // Atualizando o estoque do material no MockAPI e informando o responsável pela retirada
    try {
        const res = await fetch(`${API_URL}/${idSelecionado}`, {
            method: 'PUT',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                ...material,
                quantidade: novoEstoque
            })
        });

        if (!res.ok) throw new Error(`Erro HTTP ${res.status}`);

        await res.json();

        await registrarMovimentacao(material, quantidadeRetirada, novoEstoque, responsavel);

        exibirMensagemRetirada(
            `Retirada confirmada por ${responsavel}. Novo estoque: ${novoEstoque}.`,
            false
        );
        document.getElementById('input-retirada').value = '';
        document.getElementById('input-responsavel-retirada').value = '';
        buscarCadastros();

    } catch (erro) {
        console.error('Erro ao confirmar baixa:', erro);
        exibirMensagemRetirada('Erro ao conectar com o servidor. Tente novamente.', true);
    } finally {
        botao.disabled = false;
        botao.textContent = 'Confirmar retirada';
    }
};

// Chama o botão cadastrar e deixa os dados em exibição
document.getElementById('btn-cadastrar').addEventListener('click', (event) => cadastrarApi(event));
document.getElementById('btn-confirmar-baixa').addEventListener('click', (event) => confirmarBaixa(event));

// filtra em tempo real os materiais cadastrados
document.getElementById('input-busca').addEventListener('input', filtrarMateriais);

// condição para evitar erros devido ao fetch não ser suportado em alguns navegadores ou ambientes
if (typeof fetch === 'function') {
    buscarCadastros();
}
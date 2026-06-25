# 🏥 Sistema de Gerenciamento de Almoxarifado Hospitalar

> **Projeto acadêmico supervisionado pelo Prof. [Leonardo Rocha](https://github.com/leonardossrocha).**
> Desenvolvido como solução prática para otimizar a rotina de aulas técnicas de enfermagem.
> [Acesse o projeto clicando aqui!](https://almoxarifado-hospitalar.vercel.app/)

---

## 📌 Sobre o Projeto

Este projeto consiste em uma **aplicação web completa (Front-end conectado a uma API)** desenvolvida para melhorar o gerenciamento de itens de saúde (como seringas, cotonetes, ataduras, etc.).

O objetivo principal é auxiliar a enfermeira responsável pela organização e controle dos insumos utilizados nas **aulas práticas do curso técnico de enfermagem**, trazendo agilidade, organização e controle de estoque para a rotina educacional.

---

## 🛠️ Tecnologias Utilizadas

O ecossistema do projeto foi construído utilizando tecnologias nativas da web para garantir leveza e facilidade de execução local:

* **HTML5** - Estruturação visual e semântica do projeto.
* **CSS3** - Estilização, layout e responsividade do website.
* **JavaScript (ES6+)** - Lógica de programação, manipulação do DOM e consumo da API.
* **[MockAPI.io](https://mockapi.io/)** - Plataforma utilizada para simular a API RESTful do back-end.
* **Jest + jest-environment-jsdom** - Testes automatizados de estrutura HTML e de regras de negócio.

---

## ⚙️ Funcionalidades Implementadas

### 📋 Sprint 1 - Cadastro de Materiais

* Cadastro de novos materiais com nome, quantidade, categoria (*material de consumo* ou *material permanente*) e data de cadastro.
* Listagem em tabela de todos os materiais cadastrados, atualizada automaticamente após cada operação.
* Validação de campos obrigatórios antes do envio à API.
* Bloqueio do botão de cadastro durante a requisição, evitando envios duplicados.

### 📦 Sprint 2 - Retirada (Baixa de Estoque) e Exclusão

* Seção exclusiva para retirada de materiais, com seleção do item, quantidade a retirar e responsável pela retirada.
* Função `validarRetirada(estoqueAtual, quantidadeRetirada)` que garante que o sistema **não aceite retiradas negativas, iguais a zero, ou maiores que o estoque disponível**.
* Atualização do estoque diretamente no MockAPI via `PUT`, subtraindo a quantidade retirada do valor atual.
* Exclusão completa de um material via `DELETE`, removendo o item tanto do servidor quanto da tabela exibida em tela.
* Mensagens de retorno na própria tela informando sucesso ou o motivo de uma retirada ter sido bloqueada.

---

## 🌐 Integração com a API (MockAPI.io)

O **MockAPI** foi a ferramenta escolhida para simular nosso banco de dados e endpoints. Ele gera uma URL base única para o projeto, onde o recurso `cadastro` é manipulado.

```
https://6a29decff59cb8f65f1dae28.mockapi.io/cadastro
```

### Métodos HTTP Utilizados no Projeto

| Método | Ação | Onde é usado |
| :--- | :--- | :--- |
| `GET` | Ler | Carrega a tabela de materiais e o seletor da seção de retirada |
| `POST` | Criar | Cadastra um novo material a partir do formulário principal |
| `PUT` | Editar | Atualiza a quantidade em estoque após uma retirada validada |
| `DELETE`| Apagar | Remove definitivamente um material da lista |

---

## 💻 Exemplos de Código (Consumo da API com Fetch)

Abaixo estão trechos reais do `main.js` mostrando como cada operação é feita:

### 🔍 GET - Buscar todos os materiais cadastrados
```javascript
const buscarCadastros = () => {
    fetch(API_URL, {
        method: 'GET',
        headers: { 'content-type': 'application/json' }
    })
    .then(res => res.json())
    .then(dados => {
        listaMateriaisCache = dados; // usado depois na validacao de retirada
        preencherTabela(dados);
        preencherSelectRetirada(dados);
    })
    .catch(erro => console.error('Erro ao buscar:', erro));
};
```

### ➕ POST - Cadastrar um novo material

```javascript
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
    limparFormulario();
    buscarCadastros();
});
```

### ✏️ PUT - Confirmar retirada e atualizar o estoque

```javascript
// A validacao acontece ANTES da requisicao ser feita
if (!validarRetirada(estoqueAtual, quantidadeRetirada)) {
    exibirMensagemRetirada('Retirada invalida.', true);
    return;
}

const novoEstoque = estoqueAtual - Number(quantidadeRetirada);

fetch(`${API_URL}/${idSelecionado}`, {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
        ...material, // preserva nomeMaterial, categoria e dataCadastro
        quantidade: novoEstoque
    })
})
.then(res => res.json())
.then(() => buscarCadastros());
```

### ❌ DELETE - Excluir um material

```javascript
const deletarCadastro = (id) => {
    fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    })
    .then(res => res.json())
    .then(() => buscarCadastros())
    .catch(erro => console.error('Erro ao deletar:', erro));
};
```

---

## 🧪 Lógica de Validação - `validarRetirada()`

Uma das peças centrais da Sprint 2 é garantir que o estoque nunca fique inconsistente. A função abaixo é pura (não acessa a API nem o DOM) e cobre todos os cenários de erro exigidos:

```javascript
const validarRetirada = (estoqueAtual, quantidadeRetirada) => {
    const estoque = Number(estoqueAtual);
    const retirada = Number(quantidadeRetirada);

    if (Number.isNaN(estoque) || Number.isNaN(retirada)) return false;
    if (retirada <= 0) return false;          // bloqueia zero e negativos
    if (estoque < 0) return false;            // protege contra estado invalido
    if (retirada > estoque) return false;     // bloqueia retirar mais do que existe

    return true;
};
```

| Situação | Exemplo | Resultado |
| :--- | :--- | :--- |
| Retirada normal | `validarRetirada(10, 5)` | `true` |
| Retirada igual ao estoque total | `validarRetirada(5, 5)` | `true` |
| Retirada maior que o estoque | `validarRetirada(5, 10)` | `false` |
| Retirada negativa | `validarRetirada(10, -2)` | `false` |
| Retirada zero | `validarRetirada(10, 0)` | `false` |

---

## ✅ Testes Automatizados

O projeto utiliza **Jest** com **jest-environment-jsdom** para validar tanto a estrutura HTML quanto as regras de negócio, sem depender de uma conexão real com o MockAPI durante os testes.

```bash
npm install --save-dev jest jest-environment-jsdom
npx jest
```

Suítes de teste cobertas:

* Presença dos IDs obrigatórios do formulário de cadastro (`input-nome`, `input-quantidade`, `btn-cadastrar`, `lista-materiais`).
* Presença dos elementos da seção de retirada (`input-retirada`, `.btn-baixar`, `.btn-excluir`).
* Todos os cenários lógicos da função `validarRetirada`, incluindo limites (retirada igual ao estoque) e entradas inválidas.

---

## 📁 Estrutura do Projeto

```
almoxarifado-hospitalar/
├── index.html       # Estrutura do formulario, secao de retirada e tabela
├── style.css        # Estilizacao responsiva (paleta azul institucional)
├── main.js          # Logica de consumo da API e regras de negocio
└── tests/
    ├── sprint1.test.js             # IDs do formulario de cadastro
    ├── sprint2-html.test.js        # IDs e classes da retirada/exclusao
    └── sprint2-validacao.test.js   # Regras da funcao validarRetirada
```

---

## 🎓 Conclusão & Agradecimentos

O uso do **MockAPI** provou ser uma excelente escolha para o ambiente de aprendizado, prototipagem rápida e testes. A experiência adquirida na implementação desta API foi um passo fundamental para o desenvolvimento da minha carreira técnica, solidificando conceitos de requisições assíncronas, validação de regras de negócio e arquitetura web.

Fica aqui o meu sincero agradecimento ao professor **[Leonardo Rocha](https://github.com/leonardossrocha)** por lecionar, guiar e apoiar com excelência esta jornada no universo da programação.

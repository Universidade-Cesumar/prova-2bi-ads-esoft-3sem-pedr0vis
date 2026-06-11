# 🏥 Sistema de Gerenciamento de Almoxarifado Hospitalar

> **Projeto acadêmico supervisionado pelo Prof. Leonardo Rocha.**
> Desenvolvido como solução prática para otimizar a rotina de aulas técnicas de enfermagem.

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

---

## 🌐 Integração com a API (MockAPI.io)

O **MockAPI** foi a ferramenta escolhida para simular nosso banco de dados e endpoints. Ele gera uma URL base única para o projeto, onde todos os recursos (*resources*) são manipulados.

### Métodos HTTP Suportados

| Método | Ação | Descrição |
| :--- | :--- | :--- |
| `GET` | Ler | Recupera dados do servidor (lista ou item único) |
| `POST` | Criar | Envia novos dados para salvar no servidor |
| `PUT` | Editar | Atualiza completamente um registro existente |
| `PATCH`| Editar Parcial | Atualiza apenas campos específicos de um registro |
| `DELETE`| Apagar | Remove definitivamente um registro do servidor |

---

## 💻 Exemplos de Código (Consumo da API com Fetch)

Abaixo estão os exemplos práticos de como o JavaScript realiza as requisições para a API utilizando o método nativo `fetch()`:

### 🔍 GET - Buscar todos os dados
```javascript
fetch('https://SEU_TOKEN.mockapi.io/tasks', {
  method: 'GET',
  headers: { 'content-type': 'application/json' }, // Avisa que espera um JSON
})
.then(res => res.json()) // Converte a resposta para objeto JavaScript
.then(tasks => {
  console.log(tasks); // Aqui os dados são usados (ex: mostra na tela)
});

```

### ➕ POST - Criar um novo registro

```javascript
const novaTarefa = { title: 'Estudar MockAPI', completed: false };

fetch('https://SEU_TOKEN.mockapi.io/tasks', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(novaTarefa) // Converte objeto JS para texto JSON
})
.then(res => res.json())
.then(tarefa => console.log('Criada:', tarefa));

```

### ✏️ PUT - Atualizar um registro existente

```javascript
const tarefaAtualizada = { title: 'Estudar MockAPI - Concluído', completed: true };

fetch('https://SEU_TOKEN.mockapi.io/tasks/1', { // Atualizando o item de ID 1
  method: 'PUT',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(tarefaAtualizada)
})
.then(res => res.json())
.then(tarefa => console.log('Atualizada:', tarefa));

```

### ❌ DELETE - Deletar um registro

```javascript
fetch('https://SEU_TOKEN.mockapi.io/tasks/1', {
  method: 'DELETE'
})
.then(res => res.json())
.then(tarefa => console.log('Deletada:', tarefa));

```

---

## ⚡ Recursos Avançados da API

### 🧩 Filtros e Paginação

Para evitar a sobrecarga de dados na tela, a API suporta parâmetros diretamente na URL (`URLSearchParams`):

```javascript
// Buscar apenas tarefas não concluídas, página 1, limitando a 10 itens por vez
const url = new URL('https://SEU_TOKEN.mockapi.io/tasks');
url.searchParams.append('completed', false);
url.searchParams.append('page', 1);
url.searchParams.append('limit', 10);

```

* **Filtro (`?completed=false`):** Retorna apenas os itens que condizem com a condição.
* **Paginação (`?page=1&limit=10`):** Retorna os 10 primeiros itens, ideal para performance.

### 🔗 Relação entre Recursos (Endpoints Aninhados)

O sistema permite criar vínculos entre diferentes entidades (ex: usuários e suas tarefas), gerando URLs dinâmicas e organizadas:

* `GET /users/1/tasks` ➔ Lista todas as tarefas atreladas exclusivamente ao usuário 1.
* `POST /users/1/tasks` ➔ Cria uma nova tarefa diretamente para o usuário 1.
* `DELETE /users/1/tasks/3` ➔ Apaga a tarefa de ID 3 que pertence ao usuário 1.

---

## 🎓 Conclusão & Agradecimentos

O uso do **MockAPI** provou ser uma excelente escolha para o ambiente de aprendizado, prototipagem rápida e testes. A experiência adquirida na implementação desta API foi um passo fundamental para o desenvolvimento da minha carreira técnica, solidificando conceitos de requisições assíncronas e arquitetura web.

Fica aqui o meu sincero agradecimento ao professor **Leonardo Rocha** por lecionar, guiar e apoiar com excelência esta jornada no universo da programação.

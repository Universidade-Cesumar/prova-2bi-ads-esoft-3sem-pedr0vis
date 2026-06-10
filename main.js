// Arquivo para código javascript



const limparFormulario = () => {

    document.getElementById('input-nome').value = '';
    document.getElementById('input-quantidade').value = '';

}

const preencherFormulario = (cadastro) => {

    document.getElementById('input-nome').value = cadastro.nomeMaterial;
    document.getElementById('input-quantidade').value = cadastro.inputQuantidade;

}

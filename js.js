document.getElementById('enviar').addEventListener('click', function() {
    const novoProduto = document.createElement('tr');
    novoProduto.innerHTML = `
        <td>${document.getElementById('nome_produto').value}</td>
        <td>${document.getElementById('codigo_barras').value}</td>
        <td>${document.getElementById('categoria').value}</td>
        <td>${parseFloat(document.getElementById('preco').value).toFixed(2)}</td>
        <td>${parseInt(document.getElementById('quantidade').value)}</td>
        <td>${document.getElementById('fornecedor').value}</td>
        <td>${document.getElementById('data_validade').value}</td>
        <td>${document.getElementById('data_cadastro').value}</td>
        <td><button class="btn btn-danger excluir">Excluir</button></td>
    `;

    document.getElementById('historico_corpo').appendChild(novoProduto);

    document.getElementById('nome_produto').value = '';
    document.getElementById('codigo_barras').value = '';
    document.getElementById('categoria').value = '';
    document.getElementById('preco').value = '';
    document.getElementById('quantidade').value = '';
    document.getElementById('fornecedor').value = '';
    document.getElementById('data_validade').value = '';
    document.getElementById('data_cadastro').value = '';

    salvarHistorico();
    calcularTotal();
    atualizarCorHistorico();

    novoProduto.querySelector('.excluir').addEventListener('click', function() {
        novoProduto.remove();
        salvarHistorico();
        calcularTotal();
        atualizarCorHistorico();
    });
});

document.getElementById('imprimir').addEventListener('click', function() {
    window.print();
});

document.getElementById('pesquisar').addEventListener('click', function() {
    const dataFiltro = document.getElementById('data_filtro').value;
    filtrarPorData(dataFiltro);
});

function salvarHistorico() {
    const historicoDiv = document.getElementById('historico_corpo');
    localStorage.setItem('historico', historicoDiv.innerHTML);
}

function carregarHistorico() {
    const historicoDiv = document.getElementById('historico_corpo');
    historicoDiv.innerHTML = localStorage.getItem('historico') || '';

    const botoesExcluir = historicoDiv.querySelectorAll('.excluir');
    botoesExcluir.forEach(botao => {
        botao.addEventListener('click', function() {
            botao.parentElement.parentElement.remove();
            salvarHistorico();
            calcularTotal();
            atualizarCorHistorico();
        });
    });
    atualizarCorHistorico();
}

function filtrarPorData(dataFiltro) {
    const historicoDiv = document.getElementById('historico_corpo');
    const pedidos = historicoDiv.getElementsByTagName('tr');
    for (let pedido of pedidos) {
        const dataPedido = pedido.cells[7].innerText;
        if (dataPedido === dataFiltro || dataFiltro === '') {
            pedido.style.display = '';
        } else {
            pedido.style.display = 'none';
        }
    }
}

function calcularTotal() {
    let valorTotal = 0;
    let valorPagoTotal = 0;

    const pedidos = document.getElementById('historico_corpo').getElementsByTagName('tr');
    for (let pedido of pedidos) {
        const preco = parseFloat(pedido.cells[3].innerText);
        const quantidade = parseInt(pedido.cells[4].innerText);

        valorTotal += preco * quantidade;
    }

    document.getElementById('total_valor').innerText = 'Total: R$ ' + valorTotal.toFixed(2);
    document.getElementById('diferenca_valor').innerText = 'Diferença: R$ ' + valorPagoTotal.toFixed(2);
}

function atualizarCorHistorico() {
    const pedidos = document.getElementById('historico_corpo').getElementsByTagName('tr');
    for (let pedido of pedidos) {
        const preco = parseFloat(pedido.cells[3].innerText);
        const quantidade = parseInt(pedido.cells[4].innerText);

        const valorItem = preco * quantidade;

        if (valorItem > 0) {
            pedido.style.backgroundColor = 'darkgreen'; // Verde escuro
        } else if (valorItem < 0) {
            pedido.style.backgroundColor = 'darkred'; // Vermelho bem escuro
        } else if (valorItem === 0) {
            pedido.style.backgroundColor = 'black'; // Preto
        }
    }
}

document.querySelector('.navbar-nav .nav-link[href="#caixa"]').addEventListener('click', function() {
    document.getElementById('caixaModal').style.display = 'block';
});

function fecharCaixa() {
    document.getElementById('caixaModal').style.display = 'none';
}

function calcularTroco() {
    const valorPago = parseFloat(document.getElementById('valor_pago_caixa').value);
    const quantidadeItens = parseInt(document.getElementById('quantidade_itens').value);
    const valorItem = parseFloat(document.getElementById('produto_info').dataset.valorItem);
    const totalCompra = quantidadeItens * valorItem;

    const troco = valorPago - totalCompra;
    document.getElementById('troco').value = troco.toFixed(2);
}

document.getElementById('buscar_produto_btn').addEventListener('click', function() {
    const busca = document.getElementById('buscar_produto').value.toLowerCase();
    const produtoInfoDiv = document.getElementById('produto_info');

    const historicoDiv = document.getElementById('historico_corpo');
    const pedidos = historicoDiv.getElementsByTagName('tr');
    for (let pedido of pedidos) {
        const nomeProduto = pedido.cells[0].innerText.toLowerCase();
        if (nomeProduto.includes(busca)) {
            const codigoBarras = pedido.cells[1].innerText;
            const categoria = pedido.cells[2].innerText;
            const preco = parseFloat(pedido.cells[3].innerText);
            const quantidade = pedido.cells[4].innerText;
            const fornecedor = pedido.cells[5].innerText;
            const dataValidade = pedido.cells[6].innerText;
            const dataCadastro = pedido.cells[7].innerText;

            produtoInfoDiv.innerHTML = `
                <p>Nome: ${nomeProduto}</p>
                <p>Código de Barras: ${codigoBarras}</p>
                <p>Categoria: ${categoria}</p>
                <p>Preço: R$ ${preco.toFixed(2)}</p>
                <p>Quantidade Disponível: ${quantidade}</p>
                <p>Fornecedor: ${fornecedor}</p>
                <p>Data de Validade: ${dataValidade}</p>
                <p>Data de Cadastro: ${dataCadastro}</p>
            `;
            produtoInfoDiv.dataset.valorItem = preco;
            produtoInfoDiv.classList.remove('produto-nao-cadastrado');
            return;
        }
    }

    produtoInfoDiv.innerHTML = '<p>Produto não cadastrado</p>';
    produtoInfoDiv.classList.add('produto-nao-cadastrado');
    delete produtoInfoDiv.dataset.valorItem;
});



carregarHistorico();

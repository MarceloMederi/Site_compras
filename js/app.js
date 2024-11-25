// Exibe a página de login
function showLogin() {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
  }
  
  // Exibe a página de cadastro de usuários
  function showCadastroUsuario() {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('cadastro-usuario').style.display = 'block';
  }
  
  // Exibe a página de cadastro de produtos
  function showCadastroProduto() {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('cadastro-produto').style.display = 'block';
  }
  
  // Volta para a página inicial
  function backToHome() {
    document.getElementById('login-page').style.display = 'block';
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('cadastro-usuario').style.display = 'none';
    document.getElementById('cadastro-produto').style.display = 'none';
    document.getElementById('loja').style.display = 'none';
    document.getElementById('carrinho').style.display = 'none';
  }
  
  // Exibe a loja
  function showLoja() {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('loja').style.display = 'block';
  }
  
  // Exibe o carrinho
  function showCarrinho() {
    document.getElementById('loja').style.display = 'none';
    document.getElementById('carrinho').style.display = 'block';
  }
  
  // Função para cadastrar usuário
  function salvarUsuario() {
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const cpf = document.getElementById('cpf').value;
    const telefone = document.getElementById('telefone').value;
    const dataNascimento = document.getElementById('data-nascimento').value;
    const senha = document.getElementById('senha').value;
  
    const usuario = { nome, email, cpf, telefone, dataNascimento, senha };
  
    // Requisição para cadastrar o usuário no backend
    fetch('http://localhost:3000/cadastrarUsuario', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(usuario),
    })
      .then(response => response.json())
      .then(data => {
        alert(data.message || 'Usuário cadastrado com sucesso!');
      })
      .catch(error => {
        console.error('Erro ao cadastrar usuário:', error);
      });
  }
  
  // Função de login
  function login() {
    const nome = document.getElementById('login-nome').value;
    const senha = document.getElementById('login-senha').value;

    fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nome, senha }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.message === 'Login bem-sucedido!') {
          // Armazena o usuário no localStorage (ou pode usar sessão ou cookies)
          localStorage.setItem('usuarioLogado', JSON.stringify({ nome }));

          alert('Login bem-sucedido!');
          showLoja(); // Redireciona para a loja
        } else {
          alert(data.message || 'Erro no login');
        }
      })
      .catch(error => {
        console.error('Erro no login:', error);
      });
  }

  // Chama a verificação de login quando o aplicativo carregar
  window.onload = verificarLogin;


  // Verifica se o usuário está logado e exibe o botão de logout
  function verificarLogin() {
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    if (usuarioLogado) {
      document.getElementById('loja').style.display = 'block'; // Exibe a loja
    } else {
      backToHome(); // Volta à página inicial
    }
  }

  // Função de logout
  function logout() {
    // Limpa os dados de login (pode ser feito de várias formas, dependendo de onde os dados estão armazenados)
    // Se você estiver usando localStorage para armazenar os dados de login, você pode limpar assim:
    localStorage.removeItem('usuarioLogado'); // Remover usuário do localStorage (caso tenha utilizado)

    // Exibe novamente a página inicial
    backToHome();

    alert('Você foi desconectado!');
  }

  
  // Função para cadastrar produtos (somente admin)
  function salvarProduto() {
    const nomeProduto = document.getElementById('produto-nome').value;
    const descricaoProduto = document.getElementById('produto-descricao').value;
    const valorProduto = document.getElementById('produto-valor').value;

    const produto = { nome: nomeProduto, descricao: descricaoProduto, valor: valorProduto };

    const userRole = localStorage.getItem('role'); // Recuperar o role do usuário logado

    // Requisição para cadastrar o produto no backend
    fetch('http://localhost:3000/cadastrarProduto', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'user-role': userRole // Enviar o role no header
      },
      body: JSON.stringify(produto),
    })
      .then(response => response.json())
      .then(data => {
        alert(data.message || 'Produto cadastrado com sucesso!');
      })
      .catch(error => {
        console.error('Erro ao cadastrar produto:', error);
      });
  }

  
  // Função para carregar os produtos
  function mostrarProdutos() {
    fetch('http://localhost:3000/produtos')
      .then(response => response.json())
      .then(produtos => {
        const produtosContainer = document.getElementById('produtos');
        produtosContainer.innerHTML = '';
  
        produtos.forEach((produto, index) => {
          const div = document.createElement('div');
          div.innerHTML = `${produto.nome} - ${produto.valor} <button onclick="adicionarCarrinho(${index})">Adicionar ao Carrinho</button>`;
          produtosContainer.appendChild(div);
        });
      })
      .catch(error => {
        console.error('Erro ao carregar produtos:', error);
      });
  }
  
  // Função para adicionar ao carrinho
  function adicionarCarrinho(index) {
    // Adiciona o produto ao carrinho (localStorage ou backend, dependendo do caso)
    alert(`Produto de índice ${index} adicionado ao carrinho!`);
  }
  
const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();

// Middleware para processar o corpo das requisições como JSON
app.use(express.json());

// Configura o servidor para servir os arquivos estáticos
app.use(express.static(path.join(__dirname, "../public")));
app.use("/css", express.static(path.join(__dirname, "../css")));
app.use("/js", express.static(path.join(__dirname, "../js")));
app.use("/assets", express.static(path.join(__dirname, "../assets")));

// Rota principal para o index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Rota para cadastrar o usuário
app.post("/cadastrarUsuario", (req, res) => {
    const novoUsuario = req.body;

    // Caminho do arquivo usuarios.json
    const usuariosFilePath = path.join(__dirname, "../usuarios.json");

    // Lê o arquivo usuarios.json
    fs.readFile(usuariosFilePath, "utf8", (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // Se o arquivo não existir, cria um novo com um array vazio
                return fs.writeFile(usuariosFilePath, JSON.stringify([novoUsuario], null, 2), (err) => {
                    if (err) {
                        return res.status(500).json({ message: "Erro ao salvar o usuário" });
                    }
                    return res.status(200).json({ message: "Usuário cadastrado com sucesso!" });
                });
            } else {
                return res.status(500).json({ message: "Erro ao ler o arquivo de usuários" });
            }
        }

        // Parsea os dados do arquivo (se o arquivo não estiver vazio)
        let usuarios;
        try {
            usuarios = JSON.parse(data);
        } catch (parseError) {
            return res.status(500).json({ message: "Erro ao parsear os dados do arquivo de usuários" });
        }

        // Adiciona o novo usuário ao array de usuários
        usuarios.push(novoUsuario);

        // Escreve os dados de volta no arquivo
        fs.writeFile(usuariosFilePath, JSON.stringify(usuarios, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: "Erro ao salvar o usuário" });
            }
            res.status(200).json({ message: "Usuário cadastrado com sucesso!" });
        });
    });
});

// Rota para login
app.post("/login", (req, res) => {
    const { nome, senha } = req.body;

    const usuariosFilePath = path.join(__dirname, "../usuarios.json");

    fs.readFile(usuariosFilePath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({ message: "Erro ao ler o arquivo de usuários" });
        }

        let usuarios;
        try {
            usuarios = JSON.parse(data);
        } catch (parseError) {
            return res.status(500).json({ message: "Erro ao parsear os dados do arquivo de usuários" });
        }

        // Verifica se existe um usuário com o nome e senha fornecidos
        const usuario = usuarios.find(u => u.nome === nome && u.senha === senha);

        if (usuario) {
            // Retorna o role do usuário (admin ou normal)
            return res.status(200).json({ 
                message: "Login bem-sucedido!", 
                role: usuario.role 
            });
        } else {
            return res.status(401).json({ message: "Nome ou senha incorretos" });
        }
    });
});

app.post("/cadastrarProduto", (req, res) => {
    const produto = req.body;

    // Verifica se o usuário está logado e se é admin (pode vir do front-end ou do token)
    const usuarioLogado = req.header('user-role'); // Você pode passar isso via header ou via sessão

    if (usuarioLogado !== 'admin') {
        return res.status(403).json({ message: "Acesso negado. Apenas administradores podem cadastrar produtos." });
    }

    const produtosFilePath = path.join(__dirname, "../produtos.json");

    fs.readFile(produtosFilePath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({ message: "Erro ao ler o arquivo de produtos" });
        }

        let produtos;
        try {
            produtos = JSON.parse(data);
        } catch (parseError) {
            return res.status(500).json({ message: "Erro ao parsear os dados do arquivo de produtos" });
        }

        produtos.push(produto);

        fs.writeFile(produtosFilePath, JSON.stringify(produtos, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: "Erro ao salvar o produto" });
            }
            res.status(200).json({ message: "Produto cadastrado com sucesso!" });
        });
    });
});

// Rota para listar os produtos
app.get("/produtos", (req, res) => {
    const produtosFilePath = path.join(__dirname, "../produtos.json");

    fs.readFile(produtosFilePath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({ message: "Erro ao ler o arquivo de produtos" });
        }

        let produtos;
        try {
            produtos = JSON.parse(data);
        } catch (parseError) {
            return res.status(500).json({ message: "Erro ao parsear os dados do arquivo de produtos" });
        }

        res.status(200).json(produtos); // Retorna os produtos em formato JSON
    });
});

// Inicia o servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

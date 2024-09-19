const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const app = express();

// Configuração do armazenamento do multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'arquivos_de_murais'));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

// Middleware para servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para servir arquivos estáticos da pasta arquivos_de_murais
app.use('/murais', express.static(path.join(__dirname, 'arquivos_de_murais')));

// Middleware para análise de formulários
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rota para upload de arquivos
app.post('/upload', upload.single('muralFile'), (req, res) => {
  res.send('Arquivo enviado com sucesso!');
});

// Rota para obter a lista de arquivos
app.get('/murais/list', (req, res) => {
  const dirPath = path.join(__dirname, 'arquivos_de_murais');

  // Verifica se a rota de onde o pedido foi feito é a principal (index.html ou raiz)
  if (req.headers.referer && req.headers.referer.includes('/upload')) {
    // Se a requisição veio da página de uploads, apenas retorna uma lista vazia ou outro comportamento desejado
    return res.json([]); // Ou outra resposta adequada para a página de uploads
  }

  fs.readdir(dirPath, (err, files) => {
    if (err) {
      console.error('Erro ao ler o diretório:', err);
      return res.status(500).send('Erro ao ler o diretório.');
    }

    if (files.length === 0) {
      // Quando não há arquivos e a requisição veio da página principal, servir a página de contato
      res.sendFile(path.join(__dirname, 'public', 'contato.html'));
    } else {
      // Envia a lista de arquivos como JSON
      res.json(files);
    }
  });
});


// Iniciar o servidor
const port = 3000;
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

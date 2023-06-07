const bcrypt = require("bcrypt-nodejs"); //importando biblioteca para criptografar as senhas

module.exports = (app) => {
  // sempre trabalharemos dentro de modulos

  // padrao para criptografar senhas
  const obterHash = (password, callback) => {
    //funcao para descriptografar a senha
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, null, (err, hash) => callback(hash));
    });
  };

  const save = async (req, res) => {
    // funcao de cricao de criptografia
    obterHash(req.body.senha, (hash) => {
      const senha = hash;
      app
        .db("usuario")
        .insert({
          nome: req.body.nome,
          email: req.body.email.toLowerCase(),
          cpf: req.body.cpf,
          telefone: req.body.telefone,
          senha: senha, // senha criptografada
        })
        .then((_) => res.status(204).send())
        .catch((err) => res.status(400).json(err));
    });
  };

  const getAll = async (req, res) => {
    const admins = await app
      .db("admins")
      .where("usuario_id", req.user.id)
      .first();
    if (!admins) {
      res.status(403).send("Acesso nao autorizado");
    } else {
      app.db("usuario").then((usuarios) => res.status(200).json(usuarios));
    }
  };

  const delet = async (req, res) => {
    const admins = await app
      .db("admins")
      .where("usuario_id", req.user.id)
      .first();
    if (req.user.id == req.params.id) {
      return res.status(406).send("Nao e possivel excluir a si mesmo");
    }
    app
      .db("usuario")
      .where({ id: req.params.id })
      .del()
      .then((rowsDeleted) => {
        if (rowsDeleted > 0) {
          return res.status(204).send();
        } else {
          const msg = `Usuario nao encontrado ${req.params.id}.`;
          return res.status(400).send(msg);
        }
      })
      .catch((err) => res.status(400).send(msg));
  };

  const pesquisauser = async (req, res) => {
    const pesqnome = req.query.nome;
    const pesqemail = req.query.email;
    const pesqsenha = req.query.senha;
    const pesqtelefone = req.query.telefone;
    const pesqcpf = req.query.cpf;

    var querybuilder = {};

    if (req.query.nome) {
      querybuilder.nome = pesqnome;
    }
    if (req.query.email) {
      querybuilder.email = pesqemail;
    }
    if (req.query.senha) {
      querybuilder.senha = pesqsenha;
    }
    if (req.query.telefone) {
      querybuilder.telefone = pesqtelefone;
    }
    if (req.query.cpf) {
      querybuilder.cpf = pesqcpf;
    }

    const pesq = await app.db("usuario").where(querybuilder);

    return res.status(200).json(pesq);
  };
  const update = (req, res) => {
    //funcao para editar usuario
    console.log("AQUI ESTÁ!");
    let querybuilder = {}; //o querybuilder serve para adicionar as variaveis que serao modificadas no banco de dados
    if (req.body.nome) querybuilder.nome = req.body.nome; //caso o usuario informe o nome, acrescentar no querybuilder
    if (req.body.email) querybuilder.email = req.body.email; //caso o usuario informe a descricao, acrescentar no querybuilder
    if (req.body.senha) querybuilder.senha = req.body.senha; //caso o usuario informe a categoria, acrescentar no querybuilder
    if (req.body.cpf) querybuilder.cpf = req.body.cpf;
    if (req.body.telefone) querybuilder.telefone = req.body.telefone;

    app
      .db("usuario") // pesquisando no banco de dados na tabela usuario
      .where({ id: req.params.id })
      .update({
        // os tres pontos servem para adicionar um json  dentro de outro json
        ...querybuilder,
      })
      .then((_) => res.status(204).send())
      .catch((err) => res.status(400).json(err));
  };

  return { save, getAll, delet, pesquisauser, update };
};

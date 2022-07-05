const db = require("../models");
const {validateKey, empty} = require("../utils/validators");
const Account = db.account;

exports.create = (req, res) => {

  if (empty(req.body.key)) {
    return res.status(400).json({ message: "Insira a chave!" });
  }

  let key = req.body.key
  let isValid = validateKey(key)
  if (isValid.key === false) {
    return res.status(400).json({message: "Insira uma chave válida (email ou CPF) e/ou verifique se foi digitada corretamente   "})
  }

  const account= new Account({
    key: isValid.key
  });

  account.save(account)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      let errMessage = err.code === 11000 ? 'Chave já cadastrada.' : 'Ocorreu algum erro ao cadastrar chave pix.'
      res.status(500).send({
        message: errMessage,
        code: err.code || ''
      });
    });
};

exports.list = (req, res) => {

  Account.find()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Ocorreu algum erro."
      });
    });
};

exports.addTransaction = (req, res) => {

  if (empty(req.body.key)){
    return res.status(400).json({ message: "Insira a chave!" });
  }
  let isValid = validateKey(req.body.key)
  if (isValid.key === false) {
    return res.status(400).json({message: "Insira uma chave válida (email ou CPF) e/ou verifique se foi digitada corretamente   "})
  }
  const key = isValid.key;
  const transaction = req.body.transaction
  transaction.createdAt = new Date().toISOString()
  const value = transaction.value

  if (value <= 0) {
    return res.status(422).json({'message': 'Valor inválido'})
  }

  Account.findOneAndUpdate({key: key}, { $push: {transactions: [transaction]}, $inc: { balance: value }})
    .then(data => {
      if (!empty(data)) {
        const formattedValue = Intl.NumberFormat('pt-br', {style: 'currency', currency: 'BRL'}).format(value)
        res.json({message: `Pix de ${formattedValue} para ${key} efetuado!`});
      } else {
        res.status(404).json({message: 'Chave não cadastrada na instituição Will Bank.'})
      }
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Ocorreu algum erro. Tente verifique a chave e o valor e tente novamente mais tarde."
      });
    });
};

exports.findOne = (req, res) => {
  const key = req.params.key;

  Account.findOne({key: key})
    .then(data => {
      if (empty(data)) {
        res.status(404).send({ message: "Conta com a chave " + key + " não é cadastrada na instituição Will Bank."});
      }
      else {
        res.send(data);
      }
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Erro ao buscar conta com a chave " + key });
    });
};

exports.updateKey = (req, res) => {
  if (empty(req.params.key) || empty(req.body.newKey)) {
    res.status(400).json({ message: "Insira a chave!" });
    return;
  }
  const key = req.params.key
  let isValid = validateKey(req.body.newKey)
  if (isValid.key === false) {
    return res.status(400).json({message: "Insira uma chave válida (email ou CPF) e/ou verifique se foi digitada corretamente"})
  }
  const newKey = isValid.key

      Account.findOneAndUpdate({key: key}, {key: newKey})
      .then(data => {
        if (!empty(data)) {
          res.json({message: `Chave pix atualizada de ${key} para ${newKey}`});
        } else {
          res.status(404).json({message: 'Chave não cadastrada na instituição Will Bank.'})
        }
      })
      .catch(err => {
        res.status(500).send({
          message:
              err.message || "Ocorreu algum erro. Tente verifique a chave e tente novamente mais tarde."
        });
      });
}

exports.delete = (req, res) => {
  const key = req.params.key;
  console.log(req.params)

  Account.findOneAndDelete({key: key}, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).json({
          message: `Não foi possível deletar a conta com a chave ${key}. Talvez esta conta não tenha sido encontrada.`
        });
      } else {
        res.json({
          message: "Conta deletada com sucesso."
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: "Não foi possível deletar a conta com a chave " + key
      });
    });
};

exports.deleteAll = (req, res) => {
  Account.deleteMany({})
    .then(data => {
      res.send({
        message: data.deletedCount > 0 ? `${data.deletedCount} contas foram deletadas com sucesso.` : 'Não há contas para serem deletadas. Talvez o banco de dados já se encontre vazio.'
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Ocorreu algum erro."
      });
    });
};
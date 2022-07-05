# Desafio Will Bank - API de PIX

## Executar a aplicação

```bash
docker-compose up
```

O Docker irá baixar as imagens MongoDB e Node.js (se a máquina não tiver antes).

Os serviços podem ser executados em segundo plano com o comando:
```bash
docker-compose up -d
```

## Parar a aplicação
Todos os contêineres em execução podem ser parados com o comando:

```bash
docker-compose down
```

Se você precisar parar e remover todos os contêineres, redes e todas as imagens usadas por qualquer serviço no arquivo <em>docker-compose.yml</em>, use o comando:

```bash
docker-compose down --rmi all
```

## Variáveis de ambiente

É possível configurar as variáveis de ambiente em um arquivo .env, o mesmo será utilizado pelo docker-compose e pela aplicação

## Rotas

Todas as rotas e variáveis disponíveis se encontram na raiz do projeto, em arquivos de collection do postman.
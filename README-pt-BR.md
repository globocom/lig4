# lig4
Lig4 é um jogo de tabuleiro trazido para a web pela globo.com. Feito para fazer parte de sua presença na conferência Braziljs, desafiando os participantes a escrever um algoritmo que lutaria contra o código de outros participantes.

Fizemos este pequeno torneio na conferência Braziljs 2015 e também na TDC 2015 Porto Alegre. Cada vencedor recebeu um Kindle Paperwhite como prêmio.

Durante ambas as conferências e discussões posteriores, fomos solicitados a lançar um torneio permanente (estamos trabalhando nisso) e abrir o código do nosso código.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/globocom/lig4/tree/master)

# Requerimentos

* nodejs >4.x com working npm
* MongoDB


# Instalação (ou apenas realizar o deploy no heroku)

Depois de clonar este repo e verificar se você tem os requisitos instalados

```
$ npm install
```

A maioria dos comandos `make` são muito diretos, todas as tarefas necessárias devem estar lá. Cadastre um bug se você encontrar algo

Dê uma olhada no final deste leia-me, há alguns env vars que você deve definir antes de executar o servidor da web ou o worker.

Tudo configurado, agora você pode deixar os workers trabalharem (eles cuidam da classificação e execução das lutas de código) e / ou servidor da web.

# Rodando Workers

```
$ make worker
```

# Rodando Web Server

```
$ make run
```

# Vars de ambiente a serem definidas

```
NODE_ENV=development (dev somente)
PORT=9999 (dev somente)

# mongodb endpoint

MONGOLAB_URI="mongodb://localhost:27017"  (dev somente)
SESSION_SECRET=secret

#github client ID e client secret

GITHUB_ID=
GITHUB_SECRET=
```

*Este artigo foi traduzido do [Inglês](README.md) para o [Português (Brasil)](README-pt-BR.md).*

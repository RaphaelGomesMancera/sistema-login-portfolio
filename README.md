# Sistema de Login

Fluxo completo de autenticação construído do zero em **HTML, CSS e JavaScript puro** — sem frameworks e sem back-end, ideal para demonstrar domínio de front-end.

## Funcionalidades

- **Cadastro** de novos usuários (nome, e-mail, senha)
- **Login** com validação de credenciais
- **Sessão persistente** — o usuário continua logado ao recarregar a página
- **Logout**
- Medidor de **força de senha** em tempo real (avalia comprimento, letras maiúsculas/minúsculas, números e símbolos)
- Botão de **mostrar/ocultar senha**
- Layout **responsivo**, com suporte a tema claro e escuro

## Estrutura do projeto

```
sistema-login/
├── index.html          # Estrutura da página
├── css/
│   └── style.css        # Estilos e paleta de cores
├── js/
│   └── app.js            # Lógica de cadastro, login, sessão e validações
└── README.md
```

## Como executar

Basta abrir o arquivo `index.html` em qualquer navegador — não há dependências de back-end. Os dados de usuários são salvos no `localStorage` do navegador, apenas para fins de demonstração (não use este armazenamento em produção).

## Tecnologias

- HTML5
- CSS3 (variáveis CSS, grid, media queries)
- JavaScript (ES6+)

## Observação

Este projeto é uma demonstração de front-end. Em uma aplicação real, a autenticação e o armazenamento de senhas devem ser feitos em um back-end seguro, com hashing de senhas (bcrypt, por exemplo) e um banco de dados apropriado.

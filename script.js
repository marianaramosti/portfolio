// =========================================================
// 1. MENU NO CELULAR
// Abre/fecha o menu ao clicar no botão "hambúrguer".
// =========================================================
const menuBotao = document.getElementById("menuBotao");
const menu = document.getElementById("menu");

menuBotao.addEventListener("click", () => {
  const aberto = menu.classList.toggle("aberto");
  menuBotao.setAttribute("aria-expanded", aberto);
});

// Fecha o menu quando a pessoa clica em um link
menu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menu.classList.remove("aberto");
    menuBotao.setAttribute("aria-expanded", false);
  });
});

// =========================================================
// 2. TEMA CLARO / ESCURO
// Guarda a escolha no navegador (localStorage) para lembrar
// na próxima visita. O try/catch evita erro se o navegador
// bloquear o armazenamento.
// =========================================================
const temaBotao = document.getElementById("temaBotao");

function aplicarTema(tema) {
  if (tema === "escuro") {
    document.documentElement.setAttribute("data-tema", "escuro");
  } else {
    document.documentElement.removeAttribute("data-tema");
  }
}

function lerTemaSalvo() {
  try {
    return localStorage.getItem("tema");
  } catch (erro) {
    return null;
  }
}

// Se não houver escolha salva, segue a preferência do sistema
const temaSalvo = lerTemaSalvo();
const sistemaEscuro = window.matchMedia("(prefers-color-scheme: dark)").matches;
aplicarTema(temaSalvo || (sistemaEscuro ? "escuro" : "claro"));

temaBotao.addEventListener("click", () => {
  const atual = document.documentElement.getAttribute("data-tema") === "escuro" ? "escuro" : "claro";
  const novo = atual === "escuro" ? "claro" : "escuro";
  aplicarTema(novo);
  try {
    localStorage.setItem("tema", novo);
  } catch (erro) {
    // Sem armazenamento: o tema funciona, só não fica salvo
  }
});

// =========================================================
// 3. FILTRO DE PROJETOS
// Cada botão tem data-filtro; cada card tem data-categoria.
// =========================================================
const filtros = document.querySelectorAll(".filtro");
const projetos = document.querySelectorAll(".projeto");

filtros.forEach((botao) => {
  botao.addEventListener("click", () => {
    filtros.forEach((b) => b.classList.remove("ativo"));
    botao.classList.add("ativo");

    const escolhido = botao.dataset.filtro;
    projetos.forEach((card) => {
      const mostrar = escolhido === "todos" || card.dataset.categoria === escolhido;
      card.classList.toggle("escondido", !mostrar);
    });
  });
});

// =========================================================
// 4. ANIMAÇÃO AO ROLAR A PÁGINA
// Os blocos aparecem suavemente quando entram na tela.
// =========================================================
const blocos = document.querySelectorAll(".secao, .numero");
blocos.forEach((bloco) => bloco.classList.add("revelar"));

const observador = new IntersectionObserver(
  (entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add("visivel");
        observador.unobserve(entrada.target);
      }
    });
  },
  { threshold: 0.12 }
);

blocos.forEach((bloco) => observador.observe(bloco));

// =========================================================
// 5. ANO AUTOMÁTICO NO RODAPÉ
// =========================================================
document.getElementById("ano").textContent = new Date().getFullYear();

// =========================================================
// 1. MENU NO CELULAR
// =========================================================
const menuBotao = document.getElementById("menuBotao");
const menu = document.getElementById("menu");

menuBotao.addEventListener("click", () => {
  const aberto = menu.classList.toggle("aberto");
  menuBotao.setAttribute("aria-expanded", aberto);
});

menu.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    menu.classList.remove("aberto");
    menuBotao.setAttribute("aria-expanded", false);
  })
);

// =========================================================
// 2. CABEÇALHO E BOTÃO "VOLTAR AO TOPO" AO ROLAR
// =========================================================
const topo = document.getElementById("topo");
const voltarTopo = document.getElementById("voltarTopo");

function aoRolar() {
  topo.classList.toggle("rolou", window.scrollY > 30);
  voltarTopo.classList.toggle("visivel", window.scrollY > 600);
}
window.addEventListener("scroll", aoRolar);
aoRolar();

// =========================================================
// 3. EFEITO DE DIGITAÇÃO
// Escreve e apaga cada frase da lista, uma por vez.
// =========================================================
const frases = [
  "Desenvolvimento Web",
  "PHP, JavaScript e SQL",
  "Gestão de Projetos",
  "Dados e Power BI",
];
const alvo = document.getElementById("digitando");
let fraseAtual = 0;
let letra = 0;
let apagando = false;

function digitar() {
  const frase = frases[fraseAtual];
  letra += apagando ? -1 : 1;
  alvo.textContent = frase.slice(0, letra);

  let espera = apagando ? 45 : 90;

  if (!apagando && letra === frase.length) {
    espera = 1800;           // pausa com a frase completa
    apagando = true;
  } else if (apagando && letra === 0) {
    apagando = false;
    fraseAtual = (fraseAtual + 1) % frases.length;
    espera = 350;
  }
  setTimeout(digitar, espera);
}

const reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (reduzirMovimento) {
  alvo.textContent = frases.join(" · ");
} else {
  digitar();
}

// =========================================================
// 4. FOTO E CURRÍCULO OPCIONAIS
// Se "foto.jpg" existir no repositório, ela aparece no círculo.
// Se "curriculo.pdf" existir, o botão "Baixar CV" aparece.
// =========================================================
const foto = new Image();
foto.onload = () => {
  const avatar = document.getElementById("avatar");
  avatar.style.setProperty("--foto", "url('foto.jpg')");
  avatar.classList.add("com-foto");
};
foto.src = "foto.jpg";

fetch("curriculo.pdf", { method: "HEAD" })
  .then((resposta) => {
    if (resposta.ok) {
      document.getElementById("botaoCV").hidden = false;
      document.getElementById("botaoProjetos").hidden = true;
    }
  })
  .catch(() => { /* sem currículo: mantém "Ver projetos" */ });

// =========================================================
// 5. FILTRO DE PROJETOS
// =========================================================
const filtros = document.querySelectorAll(".filtro");
const projetos = document.querySelectorAll(".projeto");

filtros.forEach((botao) =>
  botao.addEventListener("click", () => {
    filtros.forEach((b) => b.classList.remove("ativo"));
    botao.classList.add("ativo");
    const escolhido = botao.dataset.filtro;
    projetos.forEach((card) => {
      const mostrar = escolhido === "todos" || card.dataset.categoria === escolhido;
      card.classList.toggle("escondido", !mostrar);
    });
  })
);

// =========================================================
// 6. ABAS "EXPERIÊNCIA" / "FORMAÇÃO"
// =========================================================
const abas = document.querySelectorAll(".aba");
abas.forEach((aba) =>
  aba.addEventListener("click", () => {
    abas.forEach((a) => a.classList.remove("ativa"));
    document.querySelectorAll(".painel").forEach((p) => p.classList.remove("ativo"));
    aba.classList.add("ativa");
    document.getElementById(aba.dataset.aba).classList.add("ativo");
  })
);

// =========================================================
// 7. CONTADORES ANIMADOS (0 → número final)
// =========================================================
function contar(elemento) {
  const final = Number(elemento.dataset.contar);
  const duracao = 1400;
  const inicio = performance.now();

  function passo(agora) {
    const progresso = Math.min((agora - inicio) / duracao, 1);
    elemento.textContent = Math.round(final * progresso);
    if (progresso < 1) requestAnimationFrame(passo);
  }
  requestAnimationFrame(passo);
}

// =========================================================
// 8. ANIMAÇÕES AO ENTRAR NA TELA
// =========================================================
const blocos = document.querySelectorAll(".secao, .cartao, .projeto");
blocos.forEach((b) => b.classList.add("revelar"));

const observador = new IntersectionObserver(
  (entradas) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;
      entrada.target.classList.add("visivel");
      entrada.target.querySelectorAll("[data-contar]").forEach(contar);
      observador.unobserve(entrada.target);
    });
  },
  { threshold: 0.12 }
);
blocos.forEach((b) => observador.observe(b));

// Marca no menu a seção que está na tela
const secoes = document.querySelectorAll("main section[id]");
const linksMenu = document.querySelectorAll(".menu a");
const observadorMenu = new IntersectionObserver(
  (entradas) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;
      linksMenu.forEach((l) =>
        l.classList.toggle("atual", l.getAttribute("href") === "#" + entrada.target.id)
      );
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
secoes.forEach((s) => observadorMenu.observe(s));

// =========================================================
// 9. ANO AUTOMÁTICO NO RODAPÉ
// =========================================================
document.getElementById("ano").textContent = new Date().getFullYear();

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
  if (elemento.dataset.contado) return;   // evita contar duas vezes
  elemento.dataset.contado = "sim";
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
      const alvoVisivel = entrada.target;
      alvoVisivel.classList.add("visivel");
      alvoVisivel.querySelectorAll("[data-contar]").forEach(contar);
      // Depois que apareceu, tira o atraso para o hover responder na hora
      setTimeout(() => alvoVisivel.style.setProperty("--atraso", "0s"), 1500);
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
// 9. EFEITOS DINÂMICOS
// Só rodam se a pessoa não pediu "reduzir movimento".
// Os efeitos de mouse só rodam em computador (não em celular).
// =========================================================
const temMouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

// 9.1 Barra de progresso da rolagem
const progresso = document.getElementById("progresso");
function atualizarProgresso() {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const fracao = total > 0 ? window.scrollY / total : 0;
  progresso.style.transform = `scaleX(${fracao})`;
}
window.addEventListener("scroll", atualizarProgresso, { passive: true });
atualizarProgresso();

// 9.2 Revelação escalonada: itens de cada grade aparecem um após o outro
document
  .querySelectorAll(".habilidades-grade, .projetos-grade, .servicos-grade, .contato-grade, .numeros")
  .forEach((grade) => {
    [...grade.children].forEach((item, i) => {
      item.style.setProperty("--atraso", `${i * 0.12}s`);
      if (!item.classList.contains("revelar")) {
        item.classList.add("revelar");
        observador.observe(item);
      }
    });
  });

if (!reduzirMovimento && temMouse) {
  // 9.3 Brilho que segue o mouse
  const brilho = document.getElementById("brilhoMouse");
  window.addEventListener("mousemove", (e) => {
    brilho.style.left = e.clientX + "px";
    brilho.style.top = e.clientY + "px";
    brilho.classList.add("ativo");
  });
  document.addEventListener("mouseleave", () => brilho.classList.remove("ativo"));

  // 9.4 Cartões com inclinação 3D e luz na posição do mouse
  document.querySelectorAll(".cartao, .projeto").forEach((card) => {
    card.addEventListener("mouseenter", () => card.classList.add("inclinando"));

    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;   // 0 (esquerda) a 1 (direita)
      const y = (e.clientY - r.top) / r.height;   // 0 (topo) a 1 (base)
      card.style.setProperty("--mx", `${x * 100}%`);
      card.style.setProperty("--my", `${y * 100}%`);
      card.style.transform =
        `perspective(900px) rotateX(${(0.5 - y) * 8}deg) rotateY(${(x - 0.5) * 8}deg) translateY(-6px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.classList.remove("inclinando");
      card.style.transform = "";
    });
  });
}

// 9.5 Rede de partículas no fundo da apresentação
const canvas = document.getElementById("particulas");
if (!reduzirMovimento && canvas.getContext) {
  const ctx = canvas.getContext("2d");
  let pontos = [];
  let largura, altura;
  const mouse = { x: null, y: null };

  function redimensionar() {
    const escala = window.devicePixelRatio || 1;
    largura = canvas.offsetWidth;
    altura = canvas.offsetHeight;
    canvas.width = largura * escala;
    canvas.height = altura * escala;
    ctx.setTransform(escala, 0, 0, escala, 0, 0);

    // Menos pontos em telas pequenas, para não pesar no celular
    const quantidade = Math.min(70, Math.floor((largura * altura) / 16000));
    pontos = Array.from({ length: quantidade }, () => ({
      x: Math.random() * largura,
      y: Math.random() * altura,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
    }));
  }

  function desenhar() {
    ctx.clearRect(0, 0, largura, altura);

    pontos.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > largura) p.vx *= -1;
      if (p.y < 0 || p.y > altura) p.vy *= -1;

      ctx.fillStyle = "rgba(167, 139, 250, 0.7)";
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
      ctx.fill();

      // Liga pontos próximos com linhas
      for (let j = i + 1; j < pontos.length; j++) {
        const q = pontos[j];
        const d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 120) {
          ctx.strokeStyle = `rgba(34, 211, 238, ${0.18 * (1 - d / 120)})`;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }

      // Liga pontos ao mouse
      if (mouse.x !== null) {
        const d = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (d < 160) {
          ctx.strokeStyle = `rgba(139, 92, 246, ${0.35 * (1 - d / 160)})`;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    });
    requestAnimationFrame(desenhar);
  }

  const hero = document.getElementById("inicio");
  hero.addEventListener("mousemove", (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });
  hero.addEventListener("mouseleave", () => { mouse.x = mouse.y = null; });

  window.addEventListener("resize", redimensionar);
  redimensionar();
  desenhar();
}

// =========================================================
// 10. ANO AUTOMÁTICO NO RODAPÉ
// =========================================================
document.getElementById("ano").textContent = new Date().getFullYear();

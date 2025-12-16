/* ============================================================
       🎨 GESTION DARK MODE
    ============================================================ */

// Charger thème sauvegardé
const savedTheme = localStorage.getItem("theme");

if (savedTheme) {
  document.documentElement.classList.toggle("dark", savedTheme === "dark");
} else {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.classList.toggle("dark", prefersDark);
}

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

/* ============================================================
       🧭 CHOIX MODE
    ============================================================ */

function chooseMode(mode) {
  document.getElementById("mode-selection-page").classList.add("hidden");
  if (mode === "terminal") {
    setMode("terminal");
  } else {
    setMode("gui");
  }
}

function returnToModeSelection() {
  // Cacher tout
  document.getElementById("gui-container").classList.add("hidden");
  document.getElementById("terminal-container").classList.add("hidden");

  // Nettoyer le terminal (important !)
  const terminalContainer = document.getElementById("terminal-container");
  if (terminalContainer) {
    terminalContainer.innerHTML = "";
  }

  // Afficher les effets darkmode (si cachés)
  document.getElementById("darkmode-effects").classList.remove("hidden");

  // Afficher la page de sélection
  document.getElementById("mode-selection-page").classList.remove("hidden");

  // Sauvegarder le choix
  localStorage.setItem("app-mode", "selection");
}

/* ============================================================
       📦 LOAD JSON + INITIALISATION
    ============================================================ */

function generateMobileExperience() {
  const data = window.portfolioData;
  if (!data || !data.experience) return;

  const mobileContainer = document.getElementById("experience-mobile");
  if (!mobileContainer) return;

  const expHTML = data.experience
    .map(
      (exp, index) => `
        <div class="bg-white border-2 border-black rounded-xl p-4 md:p-6 shadow-hard animate-slideUp" 
             style="animation-delay: ${index * 100}ms">
            <div class="text-sm font-black px-3 py-1 border-2 border-black shadow-hard-sm inline-block mb-3 ${
              exp.bg_year
            }">
                ${exp.year}
            </div>
            <p class="font-black text-base md:text-lg uppercase">${
              exp.title
            }</p>
            ${
              exp.duration
                ? `<p class="text-xs font-bold text-gray-500 mt-1">(${exp.duration})</p>`
                : ""
            }
            <p class="text-gray-700 mt-2 text-sm">${exp.desc}</p>
        </div>
    `
    )
    .join("");

  mobileContainer.innerHTML = expHTML;
}

document.addEventListener("DOMContentLoaded", async function () {
  try {
    // 1. On récupère le fichier
    const response = await fetch("data.json");
    const data = await response.json();
    window.portfolioData = data;

    // 2. Remplissage Header & Bio
    document.getElementById("profile-name").textContent = data.about.name;
    document.getElementById("profile-job").textContent = data.about.job;
    document.getElementById("profile-location").textContent =
      data.about.location;

    // On combine la bio courte et les détails pour la section "À propos"
    const fullBio = `${data.about.bio} <br><br> ${data.about.details}`;
    document.getElementById("about-bio").innerHTML = fullBio;

    // Mise à jour de l'image (si l'ID existe)
    const imgElement = document.getElementById("profile-image");
    if (imgElement && data.about.avatar) imgElement.src = data.about.avatar;

    // 3. Génération des Compétences (Skills)
    const skillsContainer = document.getElementById("skills-container");
    skillsContainer.innerHTML = data.skills
      .map(
        (skill) => `
    <div class="flex flex-col items-center bg-white border-2 border-black p-2 md:p-3 rounded-xl shadow-hard hover:-translate-y-1 transition-transform">
        <div class="${skill.color} mb-1">
            <span class="material-symbols-outlined text-2xl md:text-3xl">${skill.icon}</span>
        </div>
        <span class="text-xs font-bold uppercase text-center">${skill.name}</span>
    </div>
`
      )
      .join("");

    // 4. Génération des Outils (Tools)
    const toolsContainer = document.getElementById("tools-container");
    toolsContainer.innerHTML = data.tools
      .map(
        (tool) => `
            <div class="w-20 h-20 rounded-full border-3 border-black bg-white shadow-hard flex items-center justify-center font-bold text-sm hover:scale-105 transition-transform">
                <div class="">
                    <img 
                        src="./tools/${tool.img}" 
                        alt="${tool.name} logo" 
                        class="rounded-full w-full h-full object-contain"
                    />
                </div>
            </div>
        `
      )
      .join("");

    // 5. Génération des Projets
    const projectsContainer = document.getElementById("projects-container");
    projectsContainer.innerHTML = data.projects
      .map(
        (project) => `
            <div class="flex items-center gap-4 bg-white border-2 border-black p-3 rounded-xl shadow-hard-sm">
                <div class="w-10 h-10 flex items-center justify-center border-2 border-black rounded ${project.bg}">
                    <span class="material-symbols-outlined">${project.icon}</span>
                </div>
                <div>
                    <h3 class="font-bold text-sm uppercase">${project.title}</h3>
                    <p class="text-[10px] text-gray-500">${project.desc}</p>
                </div>
            </div>
        `
      )
      .join("");

    // 6. Génération de l'Expérience
    const expContainer = document.getElementById("experience-container");
    const verticalLine =
      '<div class="timeline-vertical-line absolute left-20 top-0 bottom-0 w-1.5 bg-black rounded-full z-0"></div>';

    const expHTML = data.experience
      .map(
        (exp, index) => `
            <div class="relative pl-10 mb-10 z-20 group animate-slideUp" style="animation-delay: ${
              index * 100
            }ms">
                <div class="timeline-horizontal-line absolute -left-[14px] top-1/2 -translate-y-1/2 w-10 h-1.5 bg-black rounded-r-none"></div>
                
                <div class="absolute -left-28 top-1/2 -translate-y-1/2 text-sm font-black whitespace-nowrap px-2 py-1 border-2 border-black shadow-hard-sm transform ${
                  exp.rotation
                } ${exp.bg_year}">
                    ${exp.year}
                </div>

                <div class="p-6 bg-white border-2 border-black rounded-xl shadow-hard transition-transform group-hover:scale-[1.02]">
                    <p class="font-black text-lg uppercase">${exp.title}</p>
                    ${
                      exp.duration
                        ? `<p class="text-xs font-bold text-gray-500 mt-1">(${exp.duration})</p>`
                        : ""
                    }
                    <p class="text-gray-700 mt-2">${exp.desc}</p>
                </div>
            </div>
        `
      )
      .join("");

    expContainer.innerHTML = verticalLine + expHTML;

    // 7. Lancement de l'effet "Typing" avec les phrases du JSON
    startTypingEffect(data.about.typing_phrases);

    // 8. Génération de l'Expérience Mobile
    generateMobileExperience();
  } catch (error) {
    console.error("Erreur chargement JSON:", error);
  }

  // Une fois le JSON chargé, on active le mode sauvegardé
  const saved = localStorage.getItem("app-mode") || "selection";
  setMode(saved);
});

/* ============================================================
       ⌨️ TYPING EFFECT
    ============================================================ */

function startTypingEffect(phrases) {
  const typingElement = document.getElementById("typing-text");
  if (!typingElement) return;

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 70;
  const deletingSpeed = 40;
  const pauseTime = 1500;

  function type() {
    const currentPhrase = phrases[phraseIndex];
    let timeout = typingSpeed;

    if (isDeleting) {
      typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      timeout = deletingSpeed;
      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        timeout = pauseTime / 2;
      }
    } else {
      typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === currentPhrase.length) {
        isDeleting = true;
        timeout = pauseTime;
      }
    }
    setTimeout(type, timeout);
  }
  type();
}

/* ============================================================
       ⌨️ TERMINAL FUNCTIONS
    ============================================================ */

function printToTerminal(text, addNewLine = true) {
  const output = document.getElementById("terminal-output");
  if (!output) return;
  const line = document.createElement("div");
  line.className = "terminal-line font-mono text-sm";
  line.innerHTML = text + (addNewLine ? "" : "");
  output.appendChild(line);
  output.scrollTop = output.scrollHeight;
}

function clearTerminalOutput() {
  const output = document.getElementById("terminal-output");
  if (output) output.innerHTML = "";
}

function createTerminalShell() {
  const term = document.getElementById("terminal-container");
  term.classList.remove("hidden");

  // Récupérer les données depuis le JSON
  const data = window.portfolioData || {};
  const about = data.about || {};

  term.innerHTML = `
        <div id="terminal-shell" style="height:100vh" class="w-full h-screen bg-black text-green-400 p-4 font-mono text-sm overflow-auto">
            <!-- En-tête personnalisé avec vos informations -->
            <div class="text-center mb-6">
                <div class="text-cyan-300 text-lg font-bold mb-2">${
                  about.name || "Portfolio Terminal"
                }</div>
                <div class="text-green-300 mb-1">Profession : ${
                  about.job || "Développeur"
                }</div>
                <div class="text-green-300 mb-1">Localisation : ${
                  about.location || "Non spécifié"
                }</div>
                <div class="text-green-300 mb-3">GitHub : https://github.com/oabdoulwahab</div>
                <div class="text-green-500 mb-4">~~~~~~~~~~~~~~~~~~~~~~ ${
                  about.name ? about.name.split(" ")[0] : "Portfolio"
                } Terminal ~~~~~~~~~~~~~~~~~~~~~~~~</div>
                
                <!-- Menu d'options adapté à votre portfolio -->
                <div class="grid grid-cols-2 gap-2 text-left ml-8 mb-6">
                    <div class="text-green-400">[1] ✓ Afficher Bio</div>
                    <div class="text-green-400">[2] ✓ Compétences</div>
                    <div class="text-green-400">[3] ✓ Projets</div>
                    <div class="text-green-400">[4] ✓ Expérience</div>
                    <div class="text-green-400">[5] ✓ Outils</div>
                    <div class="text-green-400">[6] ✓ Télécharger CV</div>
                    <div class="text-green-400">[7] ✓ Contact</div>
                    <div class="text-green-400">[8] ✓ Mode Graphique</div>
                    <div class="text-green-400">[h] ✓ Aide</div>
                    <div class="text-green-400">[c] ✓ Effacer</div>
                    <div class="text-green-400">[q] ✓ Quitter</div>
                </div>
                
                <!-- Prompt personnalisé -->
                <div class="text-yellow-400 font-bold mb-4 border-t border-green-700 pt-2">
                    [${
                      about.name
                        ? about.name.split(" ")[0].toLowerCase()
                        : "dev"
                    }@portfolio] = [~/terminal.sh]
                </div>
            </div>
            
            <div id="terminal-output" class="mb-4"></div>
            <div class="flex gap-2 items-center border-t border-green-800 pt-2">
                <span class="text-green-300 font-bold">${
                  about.name ? about.name.split(" ")[0].toLowerCase() : "user"
                }@portfolio</span>
                <span class="text-white">:</span>
                <span class="text-cyan-300">~</span>
                <span class="text-white">$</span>
                <input id="terminal-input" autocomplete="off" autocapitalize="off"
                       class="flex-1 bg-transparent border-none outline-none text-green-400 font-mono ml-2" 
                       placeholder="Tapez une commande..." />
            </div>
            <div class="text-[11px] text-gray-500 mt-2">Appuyez sur 'h' pour l'aide | 'q' pour quitter</div>
        </div>
    `;

  const input = document.getElementById("terminal-input");
  input.focus();

  // Enter handler
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      const raw = input.value.trim();
      handleCommand(raw);
      input.value = "";
    } else if (e.key === "c" && (e.ctrlKey || e.metaKey)) {
      // Ctrl+C behaviour: clear input
      printToTerminal("<span class='text-yellow-400'>^C</span>");
      input.value = "";
    }
  });

  // Message de bienvenue
  setTimeout(() => {
    printToTerminal(
      "<span class='text-cyan-400'>Bienvenue dans le terminal de portfolio de " +
        (about.name || "Abdoul Wahab") +
        "</span>"
    );
    printToTerminal(
      "<span class='text-green-400'>Terminal initialisé. Tapez 'h' pour voir les commandes disponibles.</span>"
    );
    printToTerminal("");
  }, 300);
}

/* Command implementation */
function handleCommand(raw) {
  if (!raw) return;
  const args = raw.split(" ").filter(Boolean);
  const cmd = args.shift().toLowerCase();

  // Afficher la commande entrée
  const data = window.portfolioData || {};
  const about = data.about || {};
  const username = about.name ? about.name.split(" ")[0].toLowerCase() : "user";

  printToTerminal(
    `<span class="text-green-300">${username}@portfolio</span>:<span class="text-cyan-300">~</span>$ ${escapeHtml(
      raw
    )}`
  );

  switch (cmd) {
    case "h":
    case "help":
      printToTerminal(
        "<span class='text-yellow-400 font-bold'>=== COMMANDES DISPONIBLES ===</span>"
      );
      printToTerminal(
        "<span class='text-cyan-300'>  help / h</span> - Affiche cette aide"
      );
      printToTerminal(
        "<span class='text-cyan-300'>  about / 1</span> - Affiche ma bio et informations"
      );
      printToTerminal(
        "<span class='text-cyan-300'>  skills / 2</span> - Liste toutes mes compétences"
      );
      printToTerminal(
        "<span class='text-cyan-300'>  projects / 3</span> - Affiche mes projets"
      );
      printToTerminal(
        "<span class='text-cyan-300'>  experience / 4</span> - Mon parcours professionnel"
      );
      printToTerminal(
        "<span class='text-cyan-300'>  tools / 5</span> - Mes outils de travail"
      );
      printToTerminal(
        "<span class='text-cyan-300'>  contact / 7</span> - Me contacter"
      );
      printToTerminal(
        "<span class='text-cyan-300'>  gui / 8</span> - Retour à l'interface graphique"
      );
      printToTerminal(
        "<span class='text-cyan-300'>  clear / c</span> - Efface l'écran"
      );
      printToTerminal(
        "<span class='text-cyan-300'>  quit / q</span> - Quitter le terminal"
      );
      printToTerminal("");
      break;

    case "1":
    case "about":
      if (data && data.about) {
        printToTerminal(
          "<span class='text-yellow-400'>=== À PROPOS DE MOI ===</span>"
        );
        printToTerminal(
          `<span class='text-green-300'>Nom:</span> ${escapeHtml(
            data.about.name || "—"
          )}`
        );
        printToTerminal(
          `<span class='text-green-300'>Profession:</span> ${escapeHtml(
            data.about.job || ""
          )}`
        );
        printToTerminal(
          `<span class='text-green-300'>Localisation:</span> ${escapeHtml(
            data.about.location || ""
          )}`
        );
        printToTerminal("");
        printToTerminal("<span class='text-yellow-400'>BIO:</span>");
        printToTerminal(escapeHtml(data.about.bio || ""));
        printToTerminal("");
        printToTerminal("<span class='text-yellow-400'>DÉTAILS:</span>");
        printToTerminal(escapeHtml(data.about.details || ""));
      } else {
        printToTerminal(
          "<span class='text-red-400'>Erreur: Données non disponibles.</span>"
        );
      }
      break;

    case "2":
    case "skills":
      if (data && Array.isArray(data.skills) && data.skills.length) {
        printToTerminal(
          "<span class='text-yellow-400'>=== MES COMPÉTENCES ===</span>"
        );
        data.skills.forEach((skill, index) => {
          printToTerminal(
            `${index + 1}. <span class='text-cyan-300'>${escapeHtml(
              skill.name
            )}</span>`
          );
        });
      } else {
        printToTerminal(
          "<span class='text-red-400'>Aucune compétence trouvée.</span>"
        );
      }
      break;

    case "3":
    case "projects":
      if (data && Array.isArray(data.projects) && data.projects.length) {
        printToTerminal(
          "<span class='text-yellow-400'>=== MES PROJETS ===</span>"
        );
        data.projects.forEach((project, index) => {
          printToTerminal(
            `${index + 1}. <span class='text-cyan-300'>${escapeHtml(
              project.title
            )}</span>`
          );
          printToTerminal(
            `   <span class='text-gray-400'>${escapeHtml(project.desc)}</span>`
          );
        });
      } else {
        printToTerminal(
          "<span class='text-red-400'>Aucun projet trouvé.</span>"
        );
      }
      break;

    case "4":
    case "experience":
    case "exp":
      if (data && Array.isArray(data.experience) && data.experience.length) {
        printToTerminal(
          "<span class='text-yellow-400'>=== EXPÉRIENCE PROFESSIONNELLE ===</span>"
        );
        data.experience.forEach((exp, index) => {
          printToTerminal(
            `<span class='text-green-300'>[${escapeHtml(
              exp.year
            )}]</span> <span class='text-cyan-300'>${escapeHtml(
              exp.title
            )}</span>`
          );
          if (exp.duration) {
            printToTerminal(
              `   <span class='text-gray-400'>Durée: ${escapeHtml(
                exp.duration
              )}</span>`
            );
          }
          printToTerminal(`   ${escapeHtml(exp.desc)}`);
          if (index < data.experience.length - 1) printToTerminal("");
        });
      } else {
        printToTerminal(
          "<span class='text-red-400'>Aucune expérience trouvée.</span>"
        );
      }
      break;

    case "5":
    case "tools":
      if (data && Array.isArray(data.tools) && data.tools.length) {
        printToTerminal(
          "<span class='text-yellow-400'>=== MES OUTILS ===</span>"
        );
        data.tools.forEach((tool, index) => {
          printToTerminal(
            `${index + 1}. <span class='text-cyan-300'>${escapeHtml(
              tool.name
            )}</span>`
          );
        });
        printToTerminal("");
        printToTerminal(
          "<span class='text-gray-400'>Ces outils sont utilisés quotidiennement pour le développement.</span>"
        );
      } else {
        printToTerminal(
          "<span class='text-red-400'>Aucun outil trouvé.</span>"
        );
      }
      break;

    case "6":
    case "cv":
    case "download":
      printToTerminal(
        "<span class='text-yellow-400'>Téléchargement du CV...</span>"
      );
      printToTerminal(
        "<span class='text-green-400'>Redirection vers l'interface graphique pour le téléchargement.</span>"
      );
      setTimeout(() => setMode("gui"), 1500);
      break;

    case "7":
    case "contact":
      printToTerminal("<span class='text-yellow-400'>=== CONTACT ===</span>");
      printToTerminal("<span class='text-cyan-300'>Pour me contacter:</span>");
      printToTerminal(
        "1. Utilisez le formulaire de contact dans l'interface graphique (tapez 'gui')"
      );
      printToTerminal("2. GitHub: https://github.com/oabdoulwahab");
      printToTerminal("3. Basé à Abidjan, Côte d'Ivoire");
      break;

    case "8":
    case "gui":
      printToTerminal(
        "<span class='text-yellow-400'>Retour à la sélection de mode...</span>"
      );
      setTimeout(() => returnToModeSelection(), 800);
      break;

    case "c":
    case "clear":
      clearTerminalOutput();
      printToTerminal("<span class='text-green-400'>Terminal nettoyé.</span>");
      break;

    case "q":
    case "quit":
    case "exit":
      printToTerminal(
        "<span class='text-yellow-400'>Retour à la sélection de mode...</span>"
      );
      setTimeout(() => returnToModeSelection(), 1000);
      break;

    default:
      printToTerminal(
        `<span class='text-red-400'>Commande inconnue: ${escapeHtml(
          cmd
        )}</span>`
      );
      printToTerminal(
        "<span class='text-yellow-400'>Tapez 'h' ou 'help' pour la liste des commandes.</span>"
      );
      break;
  }
}

/* Helper: simple escape pour éviter HTML injection dans terminal */
function escapeHtml(str) {
  if (!str && str !== 0) return "";
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function truncate(str, n) {
  if (!str) return "";
  return str.length > n ? str.slice(0, n) + "…" : str;
}

/* ============================================================
       🖥 MODE GUI / TERMINAL
    ============================================================ */

function setMode(mode) {
  const gui = document.getElementById("gui-container");
  const term = document.getElementById("terminal-container");
  const selectionPage = document.getElementById("mode-selection-page");

  if (mode === "terminal") {
    if (selectionPage) selectionPage.classList.add("hidden");
    if (gui) gui.classList.add("hidden");
    if (term) {
      createTerminalShell();
      term.classList.remove("hidden");
    }
    localStorage.setItem("app-mode", "terminal");
    setTimeout(() => {
      const input = document.getElementById("terminal-input");
      if (input) input.focus();
    }, 120);
  } else if (mode === "gui") {
    if (selectionPage) selectionPage.classList.add("hidden");
    if (term) {
      term.classList.add("hidden");
      term.innerHTML = "";
    }
    if (gui) gui.classList.remove("hidden");

    /* === Correction : lancer les particules GUI === */
    if (typeof initGUIParticles === "function") {
      initGUIParticles();
    }

    localStorage.setItem("app-mode", "gui");
  } else if (mode === "selection") {
    // Pour retourner à la sélection
    returnToModeSelection();
  }

  if (mode === "gui") {
    if (selectionPage) selectionPage.classList.add("hidden");
    if (term) {
      term.classList.add("hidden");
      term.innerHTML = "";
    }
    if (gui) gui.classList.remove("hidden");

    // S'assurer que les particules GUI sont visibles
    const guiParticles = document.getElementById("particles-gui");
    if (guiParticles && document.body.classList.contains("dark")) {
      guiParticles.style.display = "block";
    }

    localStorage.setItem("app-mode", "gui");
  }
}

/* ============================================================
       🎭 ANIMATIONS MODE SELECTION
    ============================================================ */

/* === Typing Effect Logo === */
function typeLogo() {
  const logoText = "ABDOUL WAHAB";
  let i = 0;
  const logoElement = document.getElementById("logo-typing");

  if (!logoElement) return;

  function type() {
    if (i <= logoText.length) {
      logoElement.textContent = logoText.slice(0, i);
      i++;
      setTimeout(type, 300);
    }
  }
  type();
}

/* === Particules animées === */
function initParticlesBackground() {
  const canvas = document.getElementById("particles-bg");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let particles = [];
  const total = 40;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.onresize = resize;

  for (let i = 0; i < total; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 1,
      dx: Math.random() * 0.6 - 0.3,
      dy: Math.random() * 0.6 - 0.3,
    });
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(59,130,246,0.6)";
      ctx.fill();

      p.x += p.dx;
      p.y += p.dy;

      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });

    requestAnimationFrame(animateParticles);
  }
  animateParticles();
}

/* === Transition animée lors du choix === */
function animatedSelect(mode) {
  const page = document.getElementById("mode-selection-page");
  page.style.opacity = "0";
  page.style.transition = "opacity 0.5s ease";

  setTimeout(() => {
    chooseMode(mode);
    page.style.opacity = "1";
  }, 500);
}

/* ============================================================
       🌌 PARTICULES INTERFACE
    ============================================================ */

/* === PARTICULES + RADAR POUR L'INTERFACE GRAPHIQUE (DARKMODE SEULEMENT) === */
function initInterfaceParticles() {
  // On vérifie que les éléments existent
  const canvas = document.getElementById("particles-interface");
  if (!canvas) return;

  // On active uniquement en darkmode
  if (!document.body.classList.contains("dark")) {
    canvas.style.display = "none";
    return;
  }

  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  let particles = [];
  const total = 45;

  for (let i = 0; i < total; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 1,
      dx: Math.random() * 0.4 - 0.2,
      dy: Math.random() * 0.4 - 0.2,
    });
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(59,130,246,0.5)";
      ctx.fill();

      p.x += p.dx;
      p.y += p.dy;

      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });

    requestAnimationFrame(animateParticles);
  }

  animateParticles();
}

/* === PARTICULES POUR GUI EN DARKMODE === */
function initGUIParticles() {
  const canvas = document.createElement("canvas");
  canvas.id = "particles-gui";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  let particles = [];
  const total = 40;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  // Créer les particules
  for (let i = 0; i < total; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 1,
      dx: Math.random() * 0.4 - 0.2,
      dy: Math.random() * 0.4 - 0.2,
    });
  }

  function animate() {
    if (
      !document.body.classList.contains("dark") ||
      document.getElementById("gui-container").classList.contains("hidden")
    ) {
      requestAnimationFrame(animate);
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(59,130,246,0.5)"; /* Bleu comme page sélection */
      ctx.fill();

      p.x += p.dx;
      p.y += p.dy;

      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });

    requestAnimationFrame(animate);
  }
  animate();
}

/* ============================================================
       📧 CONTACT FORM
    ============================================================ */

// function initContactForm() {
//     const contactForm = document.getElementById('contact-form');
//     if (!contactForm) return;

//     contactForm.addEventListener('submit', function (event) {
//         event.preventDefault();

//         const btn = document.getElementById('btn-submit');
//         const status = document.getElementById('form-status');
//         const form = this;

//         btn.innerText = 'Envoi en cours...';

//         // 1. VOS IDs (À REMPLACER)
//         const serviceID = 'service_0f71uyc';
//         const templateAdminID = 'template_de284b5'; // Celui qui vous notifie
//         const templateAutoReplyID = 'template_uxqylb7'; // Le nouveau pour le client

//         // 2. Envoi du mail à VOUS (Admin)
//         emailjs.sendForm(serviceID, templateAdminID, form)
//             .then(() => {
//                 // 3. Si succès, envoi de l'auto-réponse au CLIENT
//                 const userEmail = document.getElementById('email').value;
//                 const userName = document.getElementById('name').value;

//                 // Params pour l'auto-reply
//                 const autoReplyParams = {
//                     name: userName,
//                     email: userEmail,
//                 };

//                 return emailjs.send(serviceID, templateAutoReplyID, autoReplyParams);
//             })
//             .then(() => {
//                 // 4. Tout est fini avec succès
//                 btn.innerText = 'Envoyé !';
//                 btn.classList.replace('bg-accent-teal', 'bg-green-500');
//                 status.innerText = "Message reçu ! nous vous recontacterons sous peu.";
//                 status.classList.remove('hidden', 'text-red-500');
//                 status.classList.add('text-green-600');
//                 form.reset();

//                 setTimeout(() => {
//                     btn.innerText = 'Envoyer le message';
//                     btn.classList.replace('bg-green-500', 'bg-accent-teal');
//                     status.classList.add('hidden');
//                 }, 6000);
//             })
//             .catch((err) => {
//                 btn.innerText = 'Erreur';
//                 btn.classList.replace('bg-accent-teal', 'bg-red-500');
//                 status.innerText = "Une erreur est survenue.";
//                 status.classList.remove('hidden', 'text-green-600');
//                 status.classList.add('text-red-500');
//                 console.error('Erreur EmailJS:', err);
//             });
//     });
// }

/* ============================================================
       🚀 INITIALISATION GLOBALE
    ============================================================ */

// Initialiser tout quand le DOM est chargé
document.addEventListener("DOMContentLoaded", function () {
  // Initialiser les animations de la page de sélection
  typeLogo();
  initParticlesBackground();

  // Initialiser les particules d'interface
  initInterfaceParticles();

  // Initialiser le formulaire de contact
  // initContactForm();

  // Initialiser les particules GUI (sera appelée plus tard si besoin)
  // initGUIParticles est déjà définie et sera appelée par setMode("gui")
});

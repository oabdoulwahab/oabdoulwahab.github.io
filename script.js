
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

// Logger helper
function log(...args) {
  try {
    console.log("[portfolio]", new Date().toISOString(), ...args);
  } catch (e) {
    // ignore
  }
}

function logError(...args) {
  try {
    console.error("[portfolio][ERROR]", new Date().toISOString(), ...args);
  } catch (e) {
    // ignore
  }
}

// Global error handlers
window.addEventListener('error', function (evt) {
  logError('Uncaught error', evt.message, evt.filename, evt.lineno, evt.colno, evt.error);
});

window.addEventListener('unhandledrejection', function (evt) {
  logError('Unhandled rejection', evt.reason);
});

function toggleTheme() {  // <-- AJOUTÉ "function" ici
  const isDark = document.documentElement.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  log('Theme toggled', isDark ? 'dark' : 'light');
  initInterfaceParticles();
}


/* ============================================================
       🧭 CHOIX MODE
    ============================================================ */
// ... reste du code inchangé ...

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  log('Theme toggled', isDark ? 'dark' : 'light');
  initInterfaceParticles();
}


/* ============================================================
       🧭 CHOIX MODE
    ============================================================ */

function chooseMode(mode) {
  log('chooseMode called', mode);
  document.getElementById("mode-selection-page").classList.add("hidden");
  setMode(mode);
}

function returnToModeSelection() {
  // Cacher les containers
  document.getElementById("gui-container").classList.add("hidden");
  document.getElementById("gui-nav").classList.add("hidden");
  document.getElementById("terminal-container").classList.add("hidden");

  // Nettoyer le terminal
  const terminalContainer = document.getElementById("terminal-container");
  if (terminalContainer) {
    terminalContainer.innerHTML = "";
  }

  // Afficher la sélection
  document.getElementById("darkmode-effects").classList.remove("hidden");
  document.getElementById("mode-selection-page").classList.remove("hidden");

  localStorage.setItem("app-mode", "selection");
  log('Returned to mode selection');
}

/* ============================================================
       📦 LOAD JSON + INITIALISATION
    ============================================================ */

function generateMobileExperience() {
  const data = window.portfolioData;
  if (!data?.experience) return;

  log('generateMobileExperience', data.experience.length);

  const mobileContainer = document.getElementById("experience-mobile");
  if (!mobileContainer) return;

  mobileContainer.innerHTML = data.experience
    .map((exp, index) => {
      // Déterminer l'icône en fonction du type d'expérience
      let icon = "work";
      if (exp.title.includes("MOBILE")) icon = "smartphone";
      else if (exp.title.includes("FRONTEND")) icon = "code";
      else if (exp.title.includes("BACKEND")) icon = "terminal";
      else if (exp.title.includes("FREELANCE")) icon = "business_center";

      return `
        <div class="bg-white border-2 border-black rounded-xl p-4 md:p-6 shadow-hard animate-slideUp cursor-pointer hover:scale-[1.02] transition-transform"
             onclick="showExperienceDetails(${index})"
             style="animation-delay: ${index * 100}ms">
            <div class="flex items-start gap-3">
                <div class="flex-shrink-0">
                    <div class="w-10 h-10 flex items-center justify-center rounded-lg ${exp.bg_year
        }">
                        <span class="material-symbols-outlined">${icon}</span>
                    </div>
                </div>
                <div class="flex-1">
                    <div class="flex flex-wrap items-center gap-2 mb-2">
                        <div class="text-sm font-black px-2 py-1 border-2 border-black shadow-hard-sm ${exp.bg_year
        }">
                            ${exp.year}
                        </div>
                        ${exp.duration
          ? `<span class="text-xs font-bold text-gray-500">${exp.duration}</span>`
          : ""
        }
                    </div>
                    <h3 class="font-black text-base md:text-lg uppercase mb-2">${exp.title
        }</h3>
                    <p class="text-gray-700 text-sm leading-relaxed">${exp.desc || exp.details?.role || ""
        }</p>
                    <div class="mt-3 text-xs text-accent-teal font-bold flex items-center gap-1">
                        <span>Cliquer pour voir les détails</span>
                        <span class="material-symbols-outlined text-sm">arrow_forward</span>
                    </div>
                </div>
            </div>
        </div>
        `;
    })
    .join("");
}

window.showExperienceDetails = function (index) {
  log('showExperienceDetails called', index);
  const exp = window.portfolioData?.experience?.[index];
  if (!exp?.details) return;

  setTimeout(() => {
    log('opening modal for experience', index);
    openModal({
      title: exp.title,
      desc: exp.details.role,
      sections: [
        {
          label: "Responsabilités clés",
          value: `<ul class="list-disc ml-5">
          ${exp.details.tasks.map((t) => `<li>${t}</li>`).join("")}
        </ul>`,
        },
      ],
    });
  }, 0);
}

async function loadPortfolioData() {
  try {
    log('loadPortfolioData start');
    const response = await fetch("data.json");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    log('JSON loaded', {
      projects: data.projects?.length || 0,
      skills: data.skills?.length || 0,
      experience: data.experience?.length || 0,
      tools: data.tools?.length || 0,
    });
    if (data.projects && data.projects.length > 6) {
      data.projects = data.projects.slice(0, 6);
    }
    window.portfolioData = data;

    // Mise à jour des informations personnelles
    updatePersonalInfo(data);

    // Génération des sections
    generateSkills(data.skills);
    generateTools(data.tools);
    generateProjects(data.projects);
    generateExperience(data.experience);
    generateMobileExperience();

    // Effet typing
    startTypingEffect(data.about.typing_phrases);

    // Restaurer le mode sauvegardé
    const saved = localStorage.getItem("app-mode") || "selection";
    setMode(saved);
  } catch (error) {
    logError("Erreur chargement JSON:", error);
    showErrorMessage();
  }
}

function updatePersonalInfo(data) {
  const about = data.about || {};

  // Informations de base
  document.getElementById("profile-name").textContent = about.name || "";
  document.getElementById("profile-job").textContent = about.job || "";
  document.getElementById("profile-location").textContent =
    about.location || "";

  // Bio complète
  const fullBio = `${about.bio || ""} <br><br> ${about.details || ""}`;
  document.getElementById("about-bio").innerHTML = fullBio;

  // Image de profil
  const imgElement = document.getElementById("profile-image");
  if (imgElement && about.avatar) {
    imgElement.src = about.avatar;
    imgElement.alt = `Portrait de ${about.name}`;
  }
}

function generateSkills(skills = []) {
  const container = document.getElementById("skills-container");
  if (!container) return;

  log('generateSkills', skills.length);

  container.innerHTML = skills
    .map(
      (skill) => `
    <div class="flex flex-col items-center bg-white border-2 border-black p-2 md:p-3 rounded-xl shadow-hard hover:-translate-y-1 transition-transform">
        <div class="${skill.color || "text-gray-600"} mb-1">
            <span class="material-symbols-outlined text-2xl md:text-3xl">${skill.icon || "code"
        }</span>
        </div>
        <span class="text-xs font-bold uppercase text-center">${skill.name
        }</span>
    </div>
    `
    )
    .join("");
}

function generateTools(tools = []) {
  const container = document.getElementById("tools-container");
  if (!container) return;

  log('generateTools', tools.length);

  container.innerHTML = tools
    .map(
      (tool) => `
            <div class="w-20 h-20 rounded-full border-3 border-black bg-white shadow-hard flex items-center justify-center font-bold text-sm hover:scale-105 transition-transform">
                <div>
                    <img 
                        src="./tools/${tool.img}" 
                        alt="${tool.name} logo" 
                        class="rounded-full w-full h-full object-contain"
                        loading="lazy"
                    />
                </div>
            </div>
        `
    )
    .join("");
}

function generateProjects(projects = []) {
  const container = document.getElementById("projects-container");
  if (!container) return;

  log('generateProjects', projects.length);

  // Limiter à 6 projets maximum pour une grille 3x2
  const displayProjects = projects.slice(0, 6);

  container.innerHTML = displayProjects
    .map(
      (project, index) => `
      <div class="project-card animate-slideUp" 
           onclick="showProjectDetails(${index})"
           style="animation-delay: ${index * 30}ms">
          <div class="project-card-content">
              <div class="project-header">
                  <div class="project-icon ${project.bg || "bg-gray-50"}">
                      <span class="material-symbols-outlined">${project.icon || "folder"
        }</span>
                  </div>
                  <div class="project-title">
                      <h3 title="${project.title}">${project.title}</h3>
                  </div>
              </div>
              
              <p class="project-desc" title="${project.desc}">${project.desc
        }</p>
              
              ${project.details
          ? `
              <div class="project-footer">
                  <button class="project-button ">
                      <span>Détails</span>
                      <span class="material-symbols-outlined text-xs">arrow_forward</span>
                  </button>
              </div>
              `
          : ""
        }
          </div>
      </div>
    `
    )
    .join("");

  // Fallback: attacher des écouteurs de clics aux cartes projets (meilleure compatibilité)
  try {
    const cards = container.querySelectorAll('.project-card');
    cards.forEach((card, idx) => {
      card.style.cursor = 'pointer';
      card.addEventListener('click', (e) => {
        e.stopPropagation();
        log('project card clicked', idx);
        window.showProjectDetails(idx);
      });
    });
  } catch (e) {
    logError('Error attaching project click handlers', e);
  }
}

window.showProjectDetails = function (index) {
  log('showProjectDetails called', index);
  const project = window.portfolioData?.projects?.[index];
  if (!project?.details) return;

  setTimeout(() => {
    log('opening modal for project', index);
    openModal({
      title: project.title,
      desc: project.desc,
      sections: [
        { label: "Problème", value: project.details.problem },
        { label: "Solution", value: project.details.solution },
        { label: "Impact", value: project.details.impact },
      ],
    });
  }, 0);
};

function generateExperience(experience = []) {
  const container = document.getElementById("experience-container");
  if (!container) return;

  log('generateExperience', experience.length);

  const verticalLine =
    '<div class="timeline-vertical-line absolute left-20 top-0 bottom-0 w-1.5 bg-black rounded-full z-0"></div>';

  const expHTML = experience
    .map(
      (exp, index) => `
            <div class="relative pl-10 mb-10 z-20 group animate-slideUp" style="animation-delay: ${index * 100
        }ms">
                <div class="timeline-horizontal-line absolute -left-[14px] top-1/2 -translate-y-1/2 w-10 h-1.5 bg-black rounded-r-none"></div>
                
                <div class="absolute -left-28 top-1/2 -translate-y-1/2 text-sm font-black whitespace-nowrap px-2 py-1 border-2 border-black shadow-hard-sm transform ${exp.rotation || ""
        } ${exp.bg_year || "bg-white"}">
                    ${exp.year}
                </div>

                <div class="p-6 bg-white border-2 border-black rounded-xl shadow-hard transition-transform group-hover:scale-[1.02]">
                    <p class="font-black text-lg uppercase">${exp.title}</p>
                    ${exp.duration
          ? `<p class="text-xs font-bold text-gray-500 mt-1">(${exp.duration})</p>`
          : ""
        }
                    <p class="text-gray-700 mt-2">${exp.desc}</p>
                    
                    <!-- Bouton Voir détails -->
                    ${exp.details
          ? `
                    <button onclick="showExperienceDetails(${index})" 
                            class="mt-4 flex items-center gap-1 text-xs font-bold text-accent-teal hover:text-teal-600 transition-colors">
                        <span>Voir les détails</span>
                        <span class="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                    `
          : ""
        }
                </div>
            </div>
        `
    )
    .join("");

  container.innerHTML = verticalLine + expHTML;

  // Fallback: attacher des écouteurs de clics pour les éléments d'expérience
  try {
    const items = container.querySelectorAll('.group');
    items.forEach((item, idx) => {
      item.style.cursor = 'pointer';
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        log('experience item clicked', idx);
        window.showExperienceDetails(idx);
      });
    });
  } catch (e) {
    logError('Error attaching experience click handlers', e);
  }
}

function showErrorMessage() {
  const elements = [
    "profile-name",
    "profile-job",
    "profile-location",
    "about-bio",
  ];

  elements.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.textContent = "Données non disponibles";
  });
}

/* ============================================================
       ⌨️ TYPING EFFECT
    ============================================================ */

function startTypingEffect(phrases = []) {
  const typingElement = document.getElementById("typing-text");
  if (!typingElement || !phrases.length) {
    log('startTypingEffect skipped', !!typingElement, (phrases || []).length);
    return;
  }

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 70;
  let deletingSpeed = 40;
  const pauseTime = 3500;

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
  line.className = "terminal-line font-mono text-sm mb-1";
  line.innerHTML = text;
  output.appendChild(line);
  output.scrollTop = output.scrollHeight;
}

function clearTerminalOutput() {
  const output = document.getElementById("terminal-output");
  if (output) output.innerHTML = "";
}

function createTerminalShell() {
  const term = document.getElementById("terminal-container");
  if (!term) return;

  term.classList.remove("hidden");
  log('createTerminalShell opened');

  const data = window.portfolioData || {};
  const about = data.about || {};

  term.innerHTML = `
        <div id="terminal-shell" class="w-full min-h-screen bg-black text-green-400 p-4 font-mono text-sm overflow-auto pb-20">
            <div class="text-center mb-6">
                <div class="text-cyan-300 text-lg font-bold mb-2">${about.name || "Portfolio Terminal"
    }</div>
                <div class="text-green-300 mb-1">Profession : ${about.job || "Développeur"
    }</div>
                <div class="text-green-300 mb-1">Localisation : ${about.location || "Non spécifié"
    }</div>
                <div class="text-green-300 mb-3">GitHub : https://github.com/oabdoulwahab</div>
                <div class="text-green-500 mb-4">~~~~~~~~~~~~~~~~~~~~~~ ${about.name ? about.name.split(" ")[0] : "Portfolio"
    } Terminal ~~~~~~~~~~~~~~~~~~~~~~~~</div>
                
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
                
                <div class="text-yellow-400 font-bold mb-4 border-t border-green-700 pt-2">
                    [${about.name
      ? about.name.split(" ")[0].toLowerCase()
      : "dev"
    }@portfolio] = [~/terminal.sh]
                </div>
            </div>
            
            <div id="terminal-output" class="mb-4"></div>
            <div class="flex gap-2 items-center border-t border-green-800 pt-2 sticky bottom-0 bg-black">
                <span class="text-green-300 font-bold">${about.name ? about.name.split(" ")[0].toLowerCase() : "user"
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

  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      const raw = input.value.trim();
      handleCommand(raw);
      input.value = "";
    } else if (e.key === "c" && (e.ctrlKey || e.metaKey)) {
      printToTerminal("<span class='text-yellow-400'>^C</span>");
      input.value = "";
    }
  });

  setTimeout(() => {
    printToTerminal(
      `<span class='text-cyan-400'>Bienvenue dans le terminal de portfolio de ${about.name || "Abdoul Wahab"
      }</span>`
    );
    printToTerminal(
      `<span class='text-green-400'>Terminal initialisé. Tapez 'h' pour voir les commandes disponibles.</span>`
    );
    printToTerminal("");
  }, 300);
}

function handleCommand(raw) {
  if (!raw) return;
  log('handleCommand', raw);

  const args = raw.split(" ").filter(Boolean);
  const cmd = args.shift().toLowerCase();
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
      showHelp();
      break;

    case "1":
    case "about":
      showAbout(data);
      break;

    case "2":
    case "skills":
      showSkills(data);
      break;

    case "3":
    case "projects":
      showProjects(data);
      break;

    case "4":
    case "experience":
    case "exp":
      showExperience(data);
      break;

    case "5":
    case "tools":
      showTools(data);
      break;

    case "6":
    case "cv":
    case "download":
      showDownload();
      break;

    case "7":
    case "contact":
      showContact();
      break;

    case "8":
    case "gui":
      returnToGUI();
      break;

    case "c":
    case "clear":
      clearTerminalOutput();
      printToTerminal("<span class='text-green-400'>Terminal nettoyé.</span>");
      break;

    case "q":
    case "quit":
    case "exit":
      returnToSelection();
      break;

    default:
      printToTerminal(
        `<span class='text-red-400'>Commande inconnue: ${escapeHtml(
          cmd
        )}</span>`
      );
      printToTerminal(
        `<span class='text-yellow-400'>Tapez 'h' ou 'help' pour la liste des commandes.</span>`
      );
      break;
  }
}

function showHelp() {
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
}

function showAbout(data) {
  if (data?.about) {
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
}

function showSkills(data) {
  if (data?.skills?.length) {
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
}

function showProjects(data) {
  if (data?.projects?.length) {
    printToTerminal("<span class='text-yellow-400'>=== MES PROJETS ===</span>");
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
    printToTerminal("<span class='text-red-400'>Aucun projet trouvé.</span>");
  }
}

function showExperience(data) {
  if (data?.experience?.length) {
    printToTerminal(
      "<span class='text-yellow-400'>=== EXPÉRIENCE PROFESSIONNELLE ===</span>"
    );
    data.experience.forEach((exp, index) => {
      printToTerminal(
        `<span class='text-green-300'>[${escapeHtml(
          exp.year
        )}]</span> <span class='text-cyan-300'>${escapeHtml(exp.title)}</span>`
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
}

function showTools(data) {
  if (data?.tools?.length) {
    printToTerminal("<span class='text-yellow-400'>=== MES OUTILS ===</span>");
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
    printToTerminal("<span class='text-red-400'>Aucun outil trouvé.</span>");
  }
}

function showDownload() {
  printToTerminal(
    "<span class='text-yellow-400'>Téléchargement du CV...</span>"
  );
  printToTerminal(
    "<span class='text-green-400'>Redirection vers l'interface graphique pour le téléchargement.</span>"
  );
  setTimeout(() => setMode("gui"), 1500);
}

function showContact() {
  printToTerminal("<span class='text-yellow-400'>=== CONTACT ===</span>");
  printToTerminal("<span class='text-cyan-300'>Pour me contacter:</span>");
  printToTerminal(
    "1. Utilisez le formulaire de contact dans l'interface graphique (tapez 'gui')"
  );
  printToTerminal("2. GitHub: https://github.com/oabdoulwahab");
  printToTerminal("3. Basé à Abidjan, Côte d'Ivoire");
}

function returnToGUI() {
  printToTerminal(
    "<span class='text-yellow-400'>Retour à la sélection de mode...</span>"
  );
  setTimeout(() => returnToModeSelection(), 800);
}

function returnToSelection() {
  printToTerminal(
    "<span class='text-yellow-400'>Retour à la sélection de mode...</span>"
  );
  setTimeout(() => returnToModeSelection(), 1000);
}

function escapeHtml(str) {
  if (!str && str !== 0) return "";
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* ============================================================
       🖥 MODE GUI / TERMINAL
    ============================================================ */

function setMode(mode) {
  const gui = document.getElementById("gui-container");
  const term = document.getElementById("terminal-container");
  const selectionPage = document.getElementById("mode-selection-page");

  switch (mode) {
    case "terminal":
      if (selectionPage) selectionPage.classList.add("hidden");
      if (gui) gui.classList.add("hidden");
      createTerminalShell();
      localStorage.setItem("app-mode", "terminal");
      break;

    case "gui":
      showGUI();
      localStorage.setItem("app-mode", "gui");
      break;

    case "selection":
      returnToModeSelection();
      break;

    default:
      returnToModeSelection();
  }
}

function showGUI() {
  const gui = document.getElementById("gui-container");
  const guiNav = document.getElementById("gui-nav");
  const selectionPage = document.getElementById("mode-selection-page");
  const term = document.getElementById("terminal-container");

  if (selectionPage) selectionPage.classList.add("hidden");
  if (term) {
    term.classList.add("hidden");
    term.innerHTML = "";
  }
  if (gui) gui.classList.remove("hidden");
  if (guiNav) guiNav.classList.remove("hidden");

  localStorage.setItem("app-mode", "gui");
}

/* ============================================================
       🎭 ANIMATIONS MODE SELECTION
    ============================================================ */

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

function initParticlesBackground() {
  const canvas = document.getElementById("particles-bg");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let particles = [];
  const total = 40;

  function resize() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }
  resize();

  window.addEventListener("resize", resize);

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
    if (!canvas.parentElement.classList.contains("hidden")) {
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
    }
    requestAnimationFrame(animateParticles);
  }
  animateParticles();
}

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

function initInterfaceParticles() {
  const canvas = document.getElementById("particles-interface");
  if (!canvas) return;

  if (!document.body.classList.contains("dark")) {
    canvas.style.display = "none";
    return;
  }
  

  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
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
    if (!canvas.parentElement.classList.contains("hidden")) {
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
    }
    requestAnimationFrame(animateParticles);
  }
  animateParticles();
}

/* ============================================================
       📧 CONTACT FORM
    ============================================================ */

function initContactForm() {
  const contactForm = document.getElementById("contact-form");
  if (!contactForm) return;

  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const btn = document.getElementById("btn-submit");
    const status = document.getElementById("form-status");
    const form = this;

    btn.innerText = "Envoi en cours...";

    const serviceID = "service_0f71uyc";
    const templateAdminID = "template_de284b5";
    const templateAutoReplyID = "template_uxqylb7";

    emailjs
      .sendForm(serviceID, templateAdminID, form)
      .then(() => {
        const userEmail = document.getElementById("email").value;
        const userName = document.getElementById("name").value;

        const autoReplyParams = {
          name: userName,
          email: userEmail,
        };

        return emailjs.send(serviceID, templateAutoReplyID, autoReplyParams);
      })
      .then(() => {
        btn.innerText = "Envoyé !";
        btn.classList.replace("bg-accent-teal", "bg-green-500");
        status.innerText = "Message reçu ! Nous vous recontacterons sous peu.";
        status.classList.remove("hidden", "text-red-500");
        status.classList.add("text-green-600");
        form.reset();

        setTimeout(() => {
          btn.innerText = "Envoyer le message";
          btn.classList.replace("bg-green-500", "bg-accent-teal");
          status.classList.add("hidden");
        }, 6000);
      })
      .catch((err) => {
        btn.innerText = "Erreur";
        btn.classList.replace("bg-accent-teal", "bg-red-500");
        status.innerText = "Une erreur est survenue.";
        status.classList.remove("hidden", "text-green-600");
        status.classList.add("text-red-500");
        console.error("Erreur EmailJS:", err);
      });
  });
}

/* ============================================================
       🚀 INITIALISATION GLOBALE
    ============================================================ */

document.addEventListener("DOMContentLoaded", function () {
  log('DOM ready - initialization start');
  typeLogo();
  initParticlesBackground();
  initInterfaceParticles();
  initContactForm();
  loadPortfolioData();
});

/* ============================================================
       📂 MODAL DETAILS PROJECT
    ============================================================ */

function openModal({ title, desc, sections = [] }) {
  const modal = document.getElementById("details-modal");
  if (!modal) {
    logError('openModal: details-modal element not found');
    return;
  }

  document.getElementById("modal-title").textContent = title || "";
  document.getElementById("modal-desc").textContent = desc || "";

  const content = document.getElementById("modal-content");
  content.innerHTML = sections
    .map(
      (s) => `
      <div class="border-l-4 border-accent-teal pl-4">
        <h3 class="font-black uppercase mb-1">${s.label}</h3>
        <div class="text-sm text-gray-700 dark:text-gray-300">
          ${s.value}
        </div>

      </div>
    `
      )
      .join("");
  }

  // FORCER l'affichage du modal
  modal.classList.remove("hidden");
  // Force display and high z-index to ensure visibility when CSS or other scripts interfere
  try {
    modal.style.display = 'block';
    modal.style.zIndex = 100000;
    modal.style.opacity = 1;
    modal.style.pointerEvents = 'auto';
  } catch (e) {
    logError('openModal: error forcing styles', e);
  }
  document.body.style.overflow = "hidden";
  // Force overlay/dialog stacking order and log computed state for diagnosis
  try {
    const modalChildren = Array.from(modal.children);
    const overlay = modalChildren[0];
    const dialog = modalChildren[1];

    if (overlay) {
      overlay.style.zIndex = String(Number(modal.style.zIndex || 100000));
      overlay.style.pointerEvents = 'auto';
    }
    if (dialog) {
      dialog.style.zIndex = String(Number(modal.style.zIndex || 100000) + 1);
      dialog.style.position = dialog.style.position || 'relative';
      dialog.style.display = 'block';
    }

    // Log computed styles and bounding boxes
    const modalStyle = window.getComputedStyle(modal);
    const overlayStyle = overlay ? window.getComputedStyle(overlay) : null;
    const dialogStyle = dialog ? window.getComputedStyle(dialog) : null;
    const modalRect = modal.getBoundingClientRect ? modal.getBoundingClientRect() : null;
    const dialogRect = dialog && dialog.getBoundingClientRect ? dialog.getBoundingClientRect() : null;

    log('modal opened', {
      title,
      desc,
      sectionsCount: sections.length,
      modalClasses: modal.className,
      modalStyle: {
        display: modalStyle.display,
        visibility: modalStyle.visibility,
        opacity: modalStyle.opacity,
      },
      overlayStyle: overlayStyle
        ? { display: overlayStyle.display, zIndex: overlayStyle.zIndex, pointerEvents: overlayStyle.pointerEvents }
        : null,
      dialogStyle: dialogStyle
        ? { display: dialogStyle.display, zIndex: dialogStyle.zIndex, pointerEvents: dialogStyle.pointerEvents }
        : null,
      modalRect,
      dialogRect,
    });
  } catch (err) {
    logError('openModal: error inspecting children', err);
  }
function openModal({ title, desc, sections = [] }) {
  const modal = document.getElementById("details-modal");
  if (!modal) {
    logError('openModal: details-modal element not found');
    return;
  }

  // Mettre à jour le contenu
  document.getElementById("modal-title").textContent = title || "";
  document.getElementById("modal-desc").textContent = desc || "";

  const content = document.getElementById("modal-content");
  if (content) {
    content.innerHTML = sections
      .map(
        (s) => `
      <div class="border-l-4 border-accent-teal pl-4 mb-4">
        <h3 class="font-black uppercase mb-2">${s.label}</h3>
        <div class="text-sm text-gray-700 dark:text-gray-300">
          ${s.value}
        </div>
      </div>
    `
      )
      .join("");
  }

  // FORCER l'affichage du modal
  modal.classList.remove("hidden");
  
  // Ajouter des styles inline pour garantir l'affichage
  modal.style.display = "block";
  modal.style.opacity = "1";
  modal.style.visibility = "visible";
  modal.style.zIndex = "999999";
  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.width = "100%";
  modal.style.height = "100%";
  
  // Ajouter une classe au body pour empêcher le défilement
  document.body.classList.add("modal-open");
  document.body.style.overflow = "hidden";
  document.body.style.position = "fixed";
  document.body.style.width = "100%";
  document.body.style.height = "100%";
  
  log('Modal ouvert avec succès', { 
    title,
    modalVisible: modal.style.display,
    modalClasses: modal.className 
  });
}


function closeModal() {
  const modal = document.getElementById("details-modal");
  if (modal) {
    modal.classList.add("hidden");
    
    // Réinitialiser les styles
    modal.style.display = "none";
    modal.style.opacity = "0";
    modal.style.visibility = "hidden";
    
    // Retirer la classe du body
    document.body.classList.remove("modal-open");
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.width = "";
    document.body.style.height = "";
  }
}

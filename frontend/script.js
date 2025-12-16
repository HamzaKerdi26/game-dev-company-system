// script.js - Merged: Matrix + Particles + Dashboard + RPG System
document.addEventListener("DOMContentLoaded", function () {
    // ===========================
    // RPG PLAYER DATA (from addition)
    // ===========================
    let playerData = {
        level: 1,
        xp: 0,
        maxXP: 100,
        stats: {
            strength: 45,
            intelligence: 88,
            agility: 62,
            luck: 77
        },
        skills: {
            coding: 10,
            design: 8,
            debug: 9,
            leadership: 7
        },
        achievements: [
            { id: 'first_login', name: 'First Login', unlocked: true, xp: 10 },
            { id: 'ten_tasks', name: '10 Tasks', unlocked: false, xp: 50 },
            { id: 'master_coder', name: 'Master Coder', unlocked: false, xp: 100 },
            { id: 'speed_demon', name: 'Speed Demon', unlocked: false, xp: 75 }
        ]
    };

    // ===========================
    // MATRIX RAIN EFFECT
    // ===========================
    const matrixCanvas = document.getElementById('matrixCanvas');
    const matrixCtx = matrixCanvas ? matrixCanvas.getContext('2d') : null;
    if (matrixCanvas && matrixCtx) {
        matrixCanvas.width = window.innerWidth;
        matrixCanvas.height = window.innerHeight;

        const matrixChars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        const fontSize = 14;
        const columns = Math.floor(matrixCanvas.width / fontSize);
        const drops = [];

        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * -100;
        }

        function drawMatrix() {
            matrixCtx.fillStyle = 'rgba(5, 5, 8, 0.05)';
            matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

            matrixCtx.fillStyle = '#00ff88';
            matrixCtx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
                matrixCtx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }

        setInterval(drawMatrix, 35);
    }

    // ===========================
    // PARTICLE CANVAS ANIMATION
    // ===========================
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas ? canvas.getContext('2d') : null;
    if (canvas && ctx) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const particleCount = 100;

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 2;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 255, 136, 0.5)';
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((particle, index) => {
                particle.update();
                particle.draw();

                particles.slice(index + 1).forEach(otherParticle => {
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(0, 255, 136, ${0.2 - distance / 500})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(otherParticle.x, otherParticle.y);
                        ctx.stroke();
                    }
                });
            });

            requestAnimationFrame(animateParticles);
        }

        animateParticles();
    }

    // ===========================
    // RESIZE HANDLER
    // ===========================
    window.addEventListener('resize', () => {
        if (canvas) { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
        if (matrixCanvas) { matrixCanvas.width = window.innerWidth; matrixCanvas.height = window.innerHeight; }
    });

    // ===========================
    // MAIN ELEMENTS
    // ===========================
    const loginForm = document.getElementById("loginForm");
    const messageBox = document.getElementById("message");
    const contentSection = document.getElementById("content");
    const myTasksSection = document.getElementById("myTasks");
    const assetsSection = document.getElementById("assets");
    const adminOverviewSection = document.getElementById("adminOverview");
    const logoutBtn = document.getElementById("logoutBtn");
    const togglePassword = document.getElementById("togglePassword");
    const passwordInput = document.getElementById("password");
    const loginBtn = document.querySelector(".cyber-btn");
    const userNameSpan = document.getElementById("userName");
    const userRoleBadge = document.getElementById("userRole");
    const userIdSpan = document.getElementById("userId");
    const sessionTimeSpan = document.getElementById("sessionTime");
    const statTasks = document.getElementById("statTasks");
    const statItems = document.getElementById("statItems");
    const timeDisplay = document.getElementById("liveTime");
    const systemLoad = document.getElementById("systemLoad");

    // Session start time
    let sessionStart = null;

    // Hide dashboard initially
    if (contentSection) contentSection.style.display = "none";

    // ===========================
    // ENHANCED ACHIEVEMENT (replaces original simple one)
    // Accepts optional xpReward
    // ===========================
    function showAchievement(text, xpReward = 0) {
        const popup = document.getElementById('achievementPopup');
        const textEl = document.getElementById('achievementText');
        const xpEl = document.getElementById('achievementXP');

        if (!popup || !textEl) return;

        textEl.textContent = text;
        if (xpEl) xpEl.textContent = xpReward > 0 ? xpReward : 0;
        popup.classList.add('show');

        setTimeout(() => {
            popup.classList.remove('show');
        }, 4000);
    }

    // ===========================
    // LOAD / SAVE PLAYER DATA (localStorage)
    // ===========================
    function loadPlayerData(username) {
        if (!username) return;
        const saved = localStorage.getItem(`player_${username}`);
        if (saved) {
            try {
                playerData = JSON.parse(saved);
            } catch (e) {
                console.error("Failed parsing player data, resetting.", e);
                playerData.level = 1;
                playerData.xp = 0;
                playerData.maxXP = 100;
            }
        } else {
            // First time login - initialize and grant first-login XP if unlocked flag set
            playerData.level = playerData.level || 1;
            playerData.xp = playerData.xp || 0;
            playerData.maxXP = playerData.maxXP || 100;
            savePlayerData(username);
        }
        updatePlayerUI();
        updateAchievementBadges();
    }

    function savePlayerData(username) {
        if (!username) return;
        try {
            localStorage.setItem(`player_${username}`, JSON.stringify(playerData));
        } catch (e) {
            console.error("Failed to save player data:", e);
        }
    }

    // ===========================
    // UPDATE PLAYER UI
    // ===========================
    function updatePlayerUI() {
        // Update level
        const levelEl = document.getElementById('playerLevel');
        if (levelEl) levelEl.textContent = playerData.level;

        // Update XP bar
        const currentXPEl = document.getElementById('currentXP');
        const maxXPEl = document.getElementById('maxXP');
        const xpBarFill = document.getElementById('xpBarFill');

        if (currentXPEl) currentXPEl.textContent = playerData.xp;
        if (maxXPEl) maxXPEl.textContent = playerData.maxXP;
        if (xpBarFill) {
            const percentage = Math.max(0, Math.min(100, (playerData.xp / playerData.maxXP) * 100));
            xpBarFill.style.width = percentage + '%';
        }

        // Update stats if present
        const sStrength = document.getElementById('statStrength');
        const sInt = document.getElementById('statIntelligence');
        const sAgility = document.getElementById('statAgility');
        const sLuck = document.getElementById('statLuck');
        if (sStrength) sStrength.textContent = playerData.stats.strength;
        if (sInt) sInt.textContent = playerData.stats.intelligence;
        if (sAgility) sAgility.textContent = playerData.stats.agility;
        if (sLuck) sLuck.textContent = playerData.stats.luck;

        // Update skills UI
        document.querySelectorAll('.skill-item').forEach(el => {
            const skillName = el.dataset.skill;
            if (skillName && playerData.skills[skillName] !== undefined) {
                const levelSpan = el.querySelector('.skill-level span');
                if (levelSpan) levelSpan.textContent = playerData.skills[skillName];
            }
        });
    }

    // ===========================
    // XP & LEVELING
    // ===========================
    function addXP(amount, username) {
        playerData.xp += amount;

        // Check for level up
        while (playerData.xp >= playerData.maxXP) {
            levelUp(username);
        }

        updatePlayerUI();
        savePlayerData(username);
    }

    function levelUp(username) {
        playerData.xp -= playerData.maxXP;
        playerData.level++;
        playerData.maxXP = Math.floor(playerData.maxXP * 1.5); // Increase XP needed

        // Increase stats
        playerData.stats.strength += Math.floor(Math.random() * 3) + 2;
        playerData.stats.intelligence += Math.floor(Math.random() * 3) + 2;
        playerData.stats.agility += Math.floor(Math.random() * 3) + 2;
        playerData.stats.luck += Math.floor(Math.random() * 3) + 2;

        // Show level up popup
        showLevelUp(playerData.level);

        // Achievement for reaching certain levels
        if (playerData.level === 5) {
            unlockAchievement('master_coder', username);
        }

        savePlayerData(username);
    }

    // Show level up popup
    function showLevelUp(newLevel) {
        const popup = document.getElementById('levelupPopup');
        const levelSpan = document.getElementById('newLevel');

        if (popup && levelSpan) {
            levelSpan.textContent = newLevel;
            popup.classList.add('show');

            setTimeout(() => {
                popup.classList.remove('show');
            }, 4000);
        }
    }

    // ===========================
    // ACHIEVEMENTS (unlock, update UI)
    // ===========================
    function unlockAchievement(achievementId, username) {
        const achievement = playerData.achievements.find(a => a.id === achievementId);

        if (achievement && !achievement.unlocked) {
            achievement.unlocked = true;
            showAchievement(achievement.name, achievement.xp);
            addXP(achievement.xp, username);
            updateAchievementBadges();
            savePlayerData(username);
        }
    }

    function updateAchievementBadges() {
        const grid = document.getElementById('achievementsGrid');
        if (!grid) return;

        grid.innerHTML = '';

        playerData.achievements.forEach(achievement => {
            const badge = document.createElement('div');
            badge.className = `achievement-badge ${achievement.unlocked ? 'unlocked' : 'locked'}`;
            badge.innerHTML = `
                <div class="badge-icon">${achievement.unlocked ? '🏆' : '🔒'}</div>
                <div class="badge-name">${achievement.name}</div>
            `;
            grid.appendChild(badge);
        });
    }

    // ===========================
    // TASK XP & QUESTS
    // ===========================
    function grantTaskXP(taskCount, username) {
        const xpPerTask = 10;
        const totalXP = taskCount * xpPerTask;

        if (totalXP > 0) {
            setTimeout(() => {
                addXP(totalXP, username);
                showAchievement(`COMPLETED ${taskCount} TASKS`, totalXP);
            }, 2000);
        }

        // Check for task-based achievements
        if (taskCount >= 10) {
            unlockAchievement('ten_tasks', username);
        }
    }

    function updateQuests(tasksData, assetsData) {
        const questsList = document.getElementById('questsList');
        if (!questsList) return;

        // Update quest progress based on actual task count
        const taskQuest = questsList.querySelector('.quest-item');
        if (taskQuest && tasksData) {
            const progressBar = taskQuest.querySelector('.quest-progress-fill');
            const progressText = taskQuest.querySelector('.quest-progress-text');
            const totalTasks = tasksData.length;
            const percentage = Math.min((totalTasks / 5) * 100, 100);

            if (progressBar) progressBar.style.width = percentage + '%';
            if (progressText) progressText.textContent = `${totalTasks}/5`;
        }
    }

    // ===========================
    // RANDOM EVENTS
    // ===========================
    function triggerRandomEvent(username) {
        const events = [
            { text: 'CRITICAL HIT! PRODUCTIVITY BOOST!', xp: 25 },
            { text: 'FOUND EASTER EGG IN CODE!', xp: 15 },
            { text: 'PERFECT CODE REVIEW!', xp: 30 },
            { text: 'BUG SQUASHED INSTANTLY!', xp: 20 }
        ];

        const randomChance = Math.random();
        if (randomChance < 0.1) { // 10% chance
            const event = events[Math.floor(Math.random() * events.length)];
            setTimeout(() => {
                showAchievement(event.text, event.xp);
                addXP(event.xp, username);
            }, 5000);
        }
    }

    // ===========================
    // SKILL INCREASE
    // ===========================
    function increaseSkill(skillName, username) {
        if (playerData.skills[skillName] !== undefined) {
            playerData.skills[skillName]++;

            // Update UI
            const skillItem = document.querySelector(`[data-skill="${skillName}"]`);
            if (skillItem) {
                const levelSpan = skillItem.querySelector('.skill-level span');
                if (levelSpan) levelSpan.textContent = playerData.skills[skillName];
            }

            savePlayerData(username);

            // Grant XP for skill increase
            addXP(5, username);
        }
    }

    // ===========================
    // DAILY LOGIN BONUS
    // ===========================
    function checkDailyBonus(username) {
        if (!username) return;
        const lastLogin = localStorage.getItem(`lastLogin_${username}`);
        const today = new Date().toDateString();

        if (lastLogin !== today) {
            localStorage.setItem(`lastLogin_${username}`, today);

            setTimeout(() => {
                showAchievement('DAILY LOGIN BONUS', 20);
                addXP(20, username);
            }, 3000);
        }
    }

    // ===========================
    // CURSOR TRAIL EFFECT
    // ===========================
    let cursorTrail = [];
    document.addEventListener('mousemove', (e) => {
        if (cursorTrail.length > 15) {
            const oldest = cursorTrail.shift();
            if (oldest && oldest.remove) oldest.remove();
        }

        const trail = document.createElement('div');
        trail.style.position = 'fixed';
        trail.style.width = '5px';
        trail.style.height = '5px';
        trail.style.borderRadius = '50%';
        trail.style.background = 'rgba(0, 255, 136, 0.7)';
        trail.style.boxShadow = '0 0 10px rgba(0, 255, 136, 0.8)';
        trail.style.left = e.clientX + 'px';
        trail.style.top = e.clientY + 'px';
        trail.style.pointerEvents = 'none';
        trail.style.zIndex = '9999';
        trail.style.transition = 'opacity 0.5s';

        document.body.appendChild(trail);
        cursorTrail.push(trail);

        setTimeout(() => {
            trail.style.opacity = '0';
        }, 100);
    });

    // ===========================
    // KONAMI CODE EASTER EGG
    // ===========================
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.key);
        konamiCode = konamiCode.slice(-10);

        if (konamiCode.join('') === konamiSequence.join('')) {
            showAchievement("🔥 KONAMI CODE ACTIVATED 🔥");
            document.body.style.animation = "rainbow 3s infinite";
            setTimeout(() => {
                showMessage("⚡ YOU ARE NOW THE MOST DANGEROUS PERSON IN THE ROOM ⚡", "success");
            }, 500);
        }
    });

    // Add rainbow animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainbow {
            0%, 100% { filter: hue-rotate(0deg); }
            50% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    // ===========================
    // CONSOLE BRANDING
    // ===========================
    console.log('%c⚡ HAMZA INTERACTIVE STUDIOS ⚡', 'color: #00ff88; font-size: 24px; font-weight: bold; text-shadow: 0 0 10px #00ff88; font-family: Orbitron;');
    console.log('%c🎮 WHERE LEGENDS ARE CODED 🎮', 'color: #00d9ff; font-size: 16px; font-weight: bold; font-family: Orbitron;');
    console.log('%cSystem Status: ONLINE | Neural Link: STABLE | Quantum Cores: SYNCED', 'color: #00ff88; font-size: 12px; font-family: Share Tech Mono;');

    // ===========================
    // LIVE TIME & SYSTEM LOAD
    // ===========================
    function updateTime() {
        if (timeDisplay) {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            timeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
        }

        // Update session time
        if (sessionStart && sessionTimeSpan) {
            const elapsed = Math.floor((Date.now() - sessionStart) / 1000);
            const hours = String(Math.floor(elapsed / 3600)).padStart(2, '0');
            const minutes = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
            const seconds = String(elapsed % 60).padStart(2, '0');
            sessionTimeSpan.textContent = `${hours}:${minutes}:${seconds}`;
        }

        // Simulate system load
        if (systemLoad) {
            const load = 95 + Math.floor(Math.random() * 5);
            systemLoad.textContent = `${load}%`;
        }
    }
    setInterval(updateTime, 1000);
    updateTime();

    // ===========================
    // PASSWORD TOGGLE
    // ===========================
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener("click", function () {
            const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
            passwordInput.setAttribute("type", type);

            if (type === "text") {
                togglePassword.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                `;
            } else {
                togglePassword.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                `;
            }
        });
    }

    // ===========================
    // INPUT GLOW EFFECT
    // ===========================
    const inputs = document.querySelectorAll('input[type="text"], input[type="password"]');
    inputs.forEach(input => {
        input.addEventListener('keydown', () => {
            input.style.boxShadow = '0 0 30px rgba(0, 255, 136, 0.6)';
            setTimeout(() => {
                input.style.boxShadow = '';
            }, 100);
        });
    });

    // ===========================
    // MESSAGE HELPER (typing)
    // ===========================
    function showMessage(msg, type) {
        if (!messageBox) return;
        messageBox.textContent = "";
        messageBox.className = `message-box ${type}`;

        let i = 0;
        const typeInterval = setInterval(() => {
            if (i < msg.length) {
                messageBox.textContent += msg.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
            }
        }, 25);

        setTimeout(() => {
            messageBox.className = "message-box";
        }, 5000);
    }

    // ===========================
    // DISPLAY TABLE WITH ANIMATIONS
    // ===========================
    function displayTable(container, data, title) {
        if (!container) return;

        container.innerHTML = `<h2>${title}</h2>`;

        if (!data || data.length === 0) {
            container.innerHTML += '<p style="color: rgba(255,255,255,0.4); text-align: center; padding: 50px; font-size: 16px; font-weight: 700; letter-spacing: 3px; font-family: Orbitron;">⚠ NO DATA STREAM DETECTED</p>';
            return;
        }

        const table = document.createElement("table");
        table.className = "data-table";

        const headers = Object.keys(data[0]);
        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");

        headers.forEach(key => {
            const th = document.createElement("th");
            th.textContent = key.replace(/_/g, ' ');
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement("tbody");

        data.forEach((row, index) => {
            const tr = document.createElement("tr");
            tr.style.opacity = "0";
            tr.style.transform = "translateX(-30px)";

            setTimeout(() => {
                tr.style.transition = "all 0.5s ease";
                tr.style.opacity = "1";
                tr.style.transform = "translateX(0)";
            }, index * 60);

            headers.forEach(key => {
                const td = document.createElement("td");
                td.textContent = row[key] !== null && row[key] !== undefined ? row[key] : 'N/A';
                tr.appendChild(td);
            });

            tbody.appendChild(tr);
        });

        table.appendChild(tbody);
        container.appendChild(table);
    }

    // ===========================
    // LOGIN HANDLER
    // ===========================
    if (loginForm) {
        loginForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();

            // Add loading state
            if (loginBtn) loginBtn.classList.add("loading");
            if (loginBtn) loginBtn.disabled = true;

            showMessage("⚡ INITIATING NEURAL HANDSHAKE...", "success");

            try {
                // NOTE: The fetch endpoints used here (/login) are placeholders.
                // If you don't have a backend, you can stub result below.
                const response = await fetch("/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password }),
                });

                const result = await response.json();

                if (loginBtn) { loginBtn.classList.remove("loading"); loginBtn.disabled = false; }

                if (result.success) {
                    showMessage(`✓ ACCESS GRANTED | OPERATOR ${username.toUpperCase()} VERIFIED`, "success");

                    // Show achievement & staged messages
                    setTimeout(() => { showAchievement(`WELCOME BACK, ${username.toUpperCase()}!`); }, 500);
                    setTimeout(() => { showMessage("⚡ LOADING COMMAND CENTER...", "success"); }, 800);
                    setTimeout(() => { showMessage("⚡ QUANTUM CORES SYNCED", "success"); }, 1300);

                    setTimeout(async () => {
                        // Fade out login
                        const loginWrapper = document.getElementById("loginWrapper");
                        if (loginWrapper) {
                            loginWrapper.style.opacity = "0";
                            loginWrapper.style.transform = "scale(0.9)";
                        }

                        setTimeout(() => {
                            if (loginWrapper) { loginWrapper.style.display = "none"; }
                            if (contentSection) { contentSection.style.display = "block"; contentSection.style.opacity = "0"; }

                            // Set session start time
                            sessionStart = Date.now();

                            // Update user info
                            if (userNameSpan) userNameSpan.textContent = username.toUpperCase();
                            if (userIdSpan) userIdSpan.textContent = `@${username}`;
                            if (userRoleBadge) {
                                userRoleBadge.textContent = result.role ? result.role.toUpperCase() : 'DEVELOPER';
                                // Change badge color based on role
                                if (result.role === 'admin') {
                                    userRoleBadge.style.borderColor = '#ff0055';
                                    userRoleBadge.style.background = 'rgba(255, 0, 85, 0.2)';
                                    userRoleBadge.style.color = '#ff0055';
                                } else if (result.role === 'tester') {
                                    userRoleBadge.style.borderColor = '#00d9ff';
                                    userRoleBadge.style.background = 'rgba(0, 217, 255, 0.2)';
                                    userRoleBadge.style.color = '#00d9ff';
                                }
                            }

                            setTimeout(() => {
                                if (contentSection) contentSection.style.opacity = "1";
                                // Show achievement for successful login
                                setTimeout(() => { showAchievement("NEURAL LINK ESTABLISHED"); }, 500);
                            }, 50);

                            // Load appropriate views & RPG hooks
                            loadViews(result.role || 'developer', username);
                        }, 400);
                    }, 1800);
                } else {
                    if (loginBtn) { loginBtn.classList.remove("loading"); loginBtn.disabled = false; }
                    showMessage(`✕ ACCESS DENIED | ${result.message || "INVALID CREDENTIALS"}`.toUpperCase(), "error");

                    // Shake animation + red flash
                    loginForm.classList.add("shake");
                    if (loginBtn) {
                        loginBtn.style.borderColor = "#ff0055";
                        loginBtn.style.color = "#ff0055";
                    }

                    setTimeout(() => {
                        loginForm.classList.remove("shake");
                        if (loginBtn) { loginBtn.style.borderColor = ""; loginBtn.style.color = ""; }
                    }, 500);
                }
            } catch (error) {
                console.error("Login error:", error);
                if (loginBtn) { loginBtn.classList.remove("loading"); loginBtn.disabled = false; }
                showMessage("✕ SYSTEM ERROR | CONNECTION LOST", "error");
            }
        });
    }

    // ===========================
    // LOAD VIEWS BY ROLE (modified to include RPG hooks)
    // ===========================
    async function loadViews(role, username) {
        try {
            console.log(`%c🔥 Loading views for ${username} | Role: ${role}`, 'color: #00ff88; font-size: 14px; font-weight: bold;');

            // Load player data at the start of view load
            loadPlayerData(username);

            if (role === "developer") {
                const [tasksRes, assetsRes] = await Promise.all([
                    fetch("/api/mytasks", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ username: username })
                    }),
                    fetch("/api/assets", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ username: username })
                    })
                ]);
                const tasksData = await tasksRes.json();
                const assetsData = await assetsRes.json();

                console.log('📊 Tasks:', tasksData);
                console.log('⚡ Assets:', assetsData);

                // Update stats (if elements exist)
                if (statTasks) statTasks.textContent = tasksData.length;
                if (statItems) statItems.textContent = assetsData.length;

                displayTable(myTasksSection, tasksData, "◆ ACTIVE MISSIONS");
                displayTable(assetsSection, assetsData, "◆ DIGITAL ARSENAL");

                // Achievement for data loaded
                if (tasksData.length > 0 || assetsData.length > 0) {
                    setTimeout(() => {
                        showAchievement(`${tasksData.length + assetsData.length} ITEMS LOADED`);
                    }, 1000);
                }

                // RPG hooks
                updateQuests(tasksData, assetsData);
                grantTaskXP(tasksData.length, username);
                checkDailyBonus(username);
                triggerRandomEvent(username);

            } else if (role === "tester") {
                const res = await fetch("/api/bugreports", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username: username })
                });
                const data = await res.json();

                console.log('🐛 Bug Reports:', data);

                // Update stats
                if (statTasks) statTasks.textContent = data.length;
                if (statItems) {
                    const criticalHigh = data.filter(b => b.severity === 'Critical' || b.severity === 'High').length;
                    statItems.textContent = criticalHigh;
                }

                displayTable(myTasksSection, data, "◆ ANOMALY REPORTS");

                if (data.length > 0) {
                    setTimeout(() => {
                        showAchievement(`${data.length} BUGS TRACKED`);
                    }, 1000);
                }

                // RPG hooks
                grantTaskXP(data.length, username);
                checkDailyBonus(username);
                triggerRandomEvent(username);

            } else if (role === "admin") {
                const res = await fetch("/api/adminoverview");
                const data = await res.json();

                console.log('👑 Admin Overview:', data);

                // Update stats
                if (statTasks) statTasks.textContent = data.length;
                if (statItems) {
                    const totalTasks = data.reduce((sum, p) => sum + parseInt(p.totaltasks || 0), 0);
                    statItems.textContent = totalTasks;
                }

                displayTable(adminOverviewSection, data, "◆ COMMAND OVERVIEW");

                setTimeout(() => {
                    showAchievement("ADMIN ACCESS GRANTED");
                }, 1000);

                // RPG hooks
                checkDailyBonus(username);
                triggerRandomEvent(username);
            }
        } catch (err) {
            console.error("Error loading views:", err);
            showMessage("✕ DATA STREAM INTERRUPTED", "error");
        }
    }

    // ===========================
    // LOGOUT HANDLER (save player data before clearing)
    // ===========================
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            // Save player data before logging out
            const username = document.getElementById('userId')?.textContent.replace('@', '');
            if (username) {
                savePlayerData(username);
            }

            showMessage("⚡ TERMINATING NEURAL LINK...", "error");
            showAchievement("SESSION TERMINATED");

            // Fade out dashboard
            if (contentSection) {
                contentSection.style.opacity = "0";
                contentSection.style.transform = "scale(0.95)";
            }

            setTimeout(() => {
                if (contentSection) {
                    contentSection.style.display = "none";
                    contentSection.style.transform = "";
                }
                const loginWrapper = document.getElementById("loginWrapper");
                if (loginWrapper) {
                    loginWrapper.style.display = "block";
                    loginWrapper.style.opacity = "0";
                    loginWrapper.style.transform = "scale(1.1)";
                }

                setTimeout(() => {
                    if (loginWrapper) {
                        loginWrapper.style.opacity = "1";
                        loginWrapper.style.transform = "scale(1)";
                    }
                }, 50);

                // Clear form and sections
                if (loginForm) loginForm.reset();
                if (myTasksSection) myTasksSection.innerHTML = "";
                if (assetsSection) assetsSection.innerHTML = "";
                if (adminOverviewSection) adminOverviewSection.innerHTML = "";

                // Reset session
                sessionStart = null;
                if (sessionTimeSpan) sessionTimeSpan.textContent = "--:--:--";
                if (statTasks) statTasks.textContent = "0";
                if (statItems) statItems.textContent = "0";

                setTimeout(() => {
                    showMessage("✓ DISCONNECT COMPLETE | SYSTEM SECURE", "success");
                }, 300);
            }, 400);
        });
    }

    // ===========================
    // SKILL ITEM CLICK HANDLERS (increase skill)
    // ===========================
    document.querySelectorAll('.skill-item').forEach(skill => {
        skill.addEventListener('click', function () {
            const skillName = this.dataset.skill;
            const username = document.getElementById('userId')?.textContent.replace('@', '');
            if (username) {
                increaseSkill(skillName, username);
                showAchievement(`${skillName.toUpperCase()} IMPROVED!`, 5);
            } else {
                // If user not logged or username missing, still update locally
                increaseSkill(skillName, null);
                showAchievement(`${skillName.toUpperCase()} IMPROVED!`, 5);
            }
        });
    });

    // Final console message for RPG load
    console.log('%c🎮 RPG SYSTEM LOADED 🎮', 'color: #ffd700; font-size: 16px; font-weight: bold;');
    console.log('%cFeatures: Leveling, XP, Skills, Achievements, Quests', 'color: #00ff88; font-size: 12px;');

}); // end DOMContentLoaded

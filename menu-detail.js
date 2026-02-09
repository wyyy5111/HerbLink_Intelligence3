(() => {
  const data = window.MenuData;
  if (!data || !data.modulesByKey) {
    console.error("MenuData 未加载，详情页无法渲染。");
    return;
  }

  const body = document.body;
  const queryKey = new URLSearchParams(window.location.search).get("key");
  const moduleKey = body.dataset.moduleKey || queryKey;
  const module = data.modulesByKey[moduleKey];

  const refs = {
    particles: document.querySelector("#detail-particles"),
    badge: document.querySelector("#detail-badge"),
    title: document.querySelector("#detail-title"),
    summary: document.querySelector("#detail-summary"),
    kpiWrap: document.querySelector("#detail-kpis"),

    mobileSection: document.querySelector("#mobile-preview-section"),
    mobileTitle: document.querySelector("#mobile-preview-title"),
    mobileTop: document.querySelector("#mobile-top-grid"),
    mobileBottom: document.querySelector("#mobile-bottom-grid"),
    mobileFeed: document.querySelector("#mobile-preview-feed"),

    capWrap: document.querySelector("#detail-capabilities"),
    workflowWrap: document.querySelector("#detail-workflow"),
    scene: document.querySelector("#detail-scene"),

    runTitle: document.querySelector("#run-title"),
    runInput: document.querySelector("#run-input"),
    runOutput: document.querySelector("#run-output"),
    runRisk: document.querySelector("#run-risk"),
    runScore: document.querySelector("#run-score"),
    scoreBars: document.querySelector("#score-bars"),
    runSpark: document.querySelector("#run-spark"),
    riskTags: document.querySelector("#risk-tags"),

    terminalTitle: document.querySelector("#terminal-title"),
    terminalFeed: document.querySelector("#terminal-feed"),
    logWrap: document.querySelector("#detail-log"),

    contactSection: document.querySelector("#contact-section"),
    contactBody: document.querySelector("#contact-body"),
    relatedWrap: document.querySelector("#related-grid"),

    navCurrent: document.querySelector("#nav-current"),
    navPrev: document.querySelector("#nav-prev"),
    navNext: document.querySelector("#nav-next")
  };

  const state = {
    runTimers: [],
    workflowIndex: 0,
    previewCursor: 0
  };

  const nowString = () => new Date().toLocaleTimeString("zh-CN", { hour12: false });

  const clearRunTimers = () => {
    state.runTimers.forEach((timer) => clearTimeout(timer));
    state.runTimers = [];
  };

  const appendLog = (line) => {
    if (!refs.logWrap) return;
    const row = document.createElement("div");
    row.className = "log-line";
    row.textContent = `[${nowString()}] ${line}`;
    refs.logWrap.prepend(row);

    const all = refs.logWrap.querySelectorAll(".log-line");
    if (all.length > 36) {
      all[all.length - 1].remove();
    }
  };

  const sortedPlatformModules = (platform) => {
    const list = data.modulesByPlatform[platform] || [];
    return list.slice().sort((a, b) => {
      if (a.section === b.section) return a.order - b.order;
      return a.section === "首页" ? -1 : 1;
    });
  };

  const initParticles = () => {
    if (!refs.particles) return;

    const canvas = refs.particles;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let points = [];

    const setup = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

      const count = Math.max(24, Math.floor((width * height) / 42000));
      points = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        radius: Math.random() * 1.4 + 0.8
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      points.forEach((point) => {
        point.x += point.vx;
        point.y += point.vy;
        if (point.x <= 0 || point.x >= width) point.vx *= -1;
        if (point.y <= 0 || point.y >= height) point.vy *= -1;

        ctx.beginPath();
        ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(103, 168, 107, 0.32)";
        ctx.fill();
      });

      requestAnimationFrame(draw);
    };

    setup();
    draw();
    window.addEventListener("resize", setup);
  };

  const renderError = () => {
    document.title = "模块未找到 | 本草智链";
    if (refs.title) refs.title.textContent = "模块不存在";
    if (refs.summary) refs.summary.textContent = "未找到对应模块，请返回菜单矩阵重新进入。";
  };

  const renderNav = (item) => {
    if (refs.navCurrent) {
      refs.navCurrent.textContent = `${item.platformName} · ${item.section} · ${item.name}`;
    }

    const peers = sortedPlatformModules(item.platform);
    const index = peers.findIndex((entry) => entry.key === item.key);
    const prev = index > 0 ? peers[index - 1] : null;
    const next = index < peers.length - 1 ? peers[index + 1] : null;

    if (refs.navPrev) {
      if (prev) {
        refs.navPrev.hidden = false;
        refs.navPrev.href = prev.path;
      } else {
        refs.navPrev.hidden = true;
      }
    }

    if (refs.navNext) {
      if (next) {
        refs.navNext.hidden = false;
        refs.navNext.href = next.path;
      } else {
        refs.navNext.hidden = true;
      }
    }
  };

  const renderHero = (item) => {
    if (refs.badge) refs.badge.textContent = `${item.platformName} / ${item.section}`;
    if (refs.title) refs.title.textContent = item.name;
    if (refs.summary) refs.summary.textContent = item.summary;
    if (refs.scene) refs.scene.textContent = item.scene;

    if (refs.kpiWrap) {
      refs.kpiWrap.innerHTML = item.kpis
        .map(
          (kpi) => `
            <div class="kpi-item">
              <strong>${kpi.value}</strong>
              <span>${kpi.label}</span>
              <em>${kpi.trend}</em>
            </div>
          `
        )
        .join("");
    }
  };

  const iconPalette = [
    "linear-gradient(130deg,#6ab56f,#3f7e43)",
    "linear-gradient(130deg,#d8b76b,#ab8742)",
    "linear-gradient(130deg,#84a96f,#5f8b4c)",
    "linear-gradient(130deg,#96b87f,#6f9859)",
    "linear-gradient(130deg,#77aa63,#4f8443)",
    "linear-gradient(130deg,#7fb276,#558b53)",
    "linear-gradient(130deg,#d8b76b,#ae8a4a)"
  ];

  const renderPreviewGrid = (target, names) => {
    if (!target) return;
    target.innerHTML = names
      .map((name, idx) => {
        const mark = name.slice(0, 1);
        const tone = iconPalette[idx % iconPalette.length];
        return `
          <article class="preview-icon">
            <div class="preview-mark" style="background:${tone}">${mark}</div>
            <span>${name}</span>
          </article>
        `;
      })
      .join("");
  };

  const previewFeeds = {
    farmer: [
      { type: "直播", title: "岷县当归采收现场", meta: "在线 2,348 · 成交 126 单" },
      { type: "视频", title: "川贝母病害识别实拍", meta: "播放 13,241 次" },
      { type: "直播", title: "专家连线：水肥管理", meta: "在线 1,873 · 互动 4,912" },
      { type: "视频", title: "预售锁价实战教学", meta: "播放 9,423 次" }
    ],
    client: [
      { type: "直播", title: "道地药材溯源专场", meta: "在线 3,006 · 加购 2,104" },
      { type: "视频", title: "拍照鉴真伪操作示范", meta: "播放 18,205 次" },
      { type: "直播", title: "健康调理选品答疑", meta: "在线 2,461 · 下单 731" },
      { type: "视频", title: "认领农场权益说明", meta: "播放 6,832 次" }
    ]
  };

  const renderPreviewFeed = (platform) => {
    if (!refs.mobileFeed) return;
    const feeds = previewFeeds[platform] || previewFeeds.farmer;

    const cards = [];
    const count = Math.min(3, feeds.length);
    for (let i = 0; i < count; i += 1) {
      cards.push(feeds[(state.previewCursor + i) % feeds.length]);
    }

    refs.mobileFeed.innerHTML = cards
      .map(
        (feed) => `
          <article class="preview-feed-item">
            <div class="preview-thumb"></div>
            <div class="preview-meta">
              <strong>${feed.type} · ${feed.title}</strong>
              <span>${feed.meta}</span>
            </div>
          </article>
        `
      )
      .join("");
  };

  const renderMobilePreview = (item) => {
    if (!refs.mobileSection) return;

    const isHomeModule = item.section === "首页" && item.name === "首页";
    if (!isHomeModule) {
      refs.mobileSection.hidden = true;
      return;
    }

    refs.mobileSection.hidden = false;

    const top = item.platform === "farmer" ? ["AI入口", "市场行情", "在线课程", "🔎查找"] : ["AI入口", "市场行情", "商城", "🔎查找"];
    const bottom =
      item.platform === "farmer"
        ? ["首页", "农场情况", "发布直播/作品", "社区", "我的"]
        : ["首页", "今日行情", "拍照鉴真伪", "消息", "我的"];

    if (refs.mobileTitle) {
      refs.mobileTitle.textContent = `${item.platformName}首页移动布局`;
    }

    renderPreviewGrid(refs.mobileTop, top);
    renderPreviewGrid(refs.mobileBottom, bottom);
    renderPreviewFeed(item.platform);
  };

  const renderCapabilities = (item) => {
    if (!refs.capWrap) return;

    refs.capWrap.innerHTML = item.capabilities
      .map(
        (capability, index) => `
          <article class="cap-card">
            <h4>${capability.title}</h4>
            <p>${capability.detail}</p>
            <div class="cap-meta">
              <span>输入 ${capability.input.length} 项</span>
              <span>输出 ${capability.output.length} 项</span>
              <span>风控已接入</span>
            </div>
            <div class="cap-actions">
              <button class="run-btn" data-cap-index="${index}">运行演示</button>
              <a class="jump-btn" href="/index.html#menu-lab">回到总演示</a>
            </div>
          </article>
        `
      )
      .join("");
  };

  const renderWorkflow = (item) => {
    if (!refs.workflowWrap) return;

    refs.workflowWrap.innerHTML = item.workflow
      .map((step, idx) => `<li data-step-index="${idx}">${idx + 1}. ${step}</li>`)
      .join("");
  };

  const animateWorkflow = () => {
    if (!refs.workflowWrap) return;
    const steps = Array.from(refs.workflowWrap.querySelectorAll("li"));
    if (!steps.length) return;

    setInterval(() => {
      steps.forEach((step) => step.classList.remove("is-hot"));
      state.workflowIndex = (state.workflowIndex + 1) % steps.length;
      steps[state.workflowIndex].classList.add("is-hot");
    }, 1400);
  };

  const drawSpark = (seed) => {
    if (!refs.runSpark) return;

    const canvas = refs.runSpark;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const ratio = window.devicePixelRatio || 1;
    const width = canvas.clientWidth || 380;
    const height = canvas.clientHeight || 110;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    const points = Array.from({ length: 12 }, (_, idx) => {
      const value = 58 + Math.sin((seed + idx) * 0.62) * 22 + ((seed + idx * 9) % 9);
      return Math.max(8, Math.min(102, value));
    });

    const min = Math.min(...points);
    const max = Math.max(...points);

    const toX = (idx) => (idx * (width - 12)) / (points.length - 1) + 6;
    const toY = (value) => {
      const t = (value - min) / (max - min || 1);
      return height - 10 - t * (height - 20);
    };

    ctx.clearRect(0, 0, width, height);

    ctx.beginPath();
    for (let i = 0; i < 4; i += 1) {
      const y = 10 + (i * (height - 20)) / 3;
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.strokeStyle = "rgba(113,92,71,0.16)";
    ctx.lineWidth = 1;
    ctx.stroke();

    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, "rgba(103,168,107,0.95)");
    gradient.addColorStop(0.6, "rgba(216,183,107,0.95)");
    gradient.addColorStop(1, "rgba(63,126,67,0.95)");

    ctx.beginPath();
    ctx.moveTo(toX(0), toY(points[0]));
    for (let i = 1; i < points.length; i += 1) {
      ctx.lineTo(toX(i), toY(points[i]));
    }
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2.6;
    ctx.stroke();

    const lx = toX(points.length - 1);
    const ly = toY(points[points.length - 1]);
    ctx.beginPath();
    ctx.arc(lx, ly, 3.6, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(103,168,107,0.95)";
    ctx.fill();
  };

  const setScore = (score) => {
    const value = Math.max(0, Math.min(100, Math.round(score)));

    if (refs.runScore) {
      refs.runScore.textContent = String(value);
    }

    if (refs.scoreBars) {
      const rows = [
        { label: "易用性", value: Math.max(72, Math.min(99, value - 2)) },
        { label: "可读性", value: Math.max(74, Math.min(99, value + 1)) },
        { label: "稳定性", value: Math.max(76, Math.min(99, value + 2)) }
      ];

      refs.scoreBars.innerHTML = rows
        .map(
          (row) => `
            <div class="score-row">
              <div class="score-head">
                <span>${row.label}</span>
                <strong>${row.value}%</strong>
              </div>
              <div class="score-track">
                <span class="score-fill" style="width:${row.value}%"></span>
              </div>
            </div>
          `
        )
        .join("");
    }
  };

  const renderContacts = (item) => {
    if (!refs.contactSection || !refs.contactBody) return;

    if (!Array.isArray(item.contacts) || !item.contacts.length) {
      refs.contactSection.hidden = true;
      return;
    }

    refs.contactSection.hidden = false;
    refs.contactBody.innerHTML = item.contacts
      .map(
        (contact) => `
          <tr>
            <td>${contact.region}</td>
            <td>${contact.phone}</td>
            <td>${contact.email}</td>
            <td>${contact.duty}</td>
          </tr>
        `
      )
      .join("");
  };

  const renderRelated = (item) => {
    if (!refs.relatedWrap) return;

    const peers = sortedPlatformModules(item.platform).filter((entry) => entry.key !== item.key);
    refs.relatedWrap.innerHTML = peers
      .slice(0, 8)
      .map(
        (peer) => `
          <a class="related-link" href="${peer.path}">
            <strong>${peer.name}</strong>
            <span>${peer.section} · ${peer.summary}</span>
          </a>
        `
      )
      .join("");
  };

  const runCapabilityDemo = (item, capability, index) => {
    if (!capability) return;

    clearRunTimers();

    if (refs.runTitle) refs.runTitle.textContent = `${item.name} · ${capability.title}`;
    if (refs.runInput) refs.runInput.innerHTML = capability.input.map((line) => `<li>${line}</li>`).join("");
    if (refs.runOutput) refs.runOutput.innerHTML = capability.output.map((line) => `<li>${line}</li>`).join("");
    if (refs.runRisk) refs.runRisk.textContent = capability.risk;

    if (refs.riskTags) {
      const tags = ["流程校验", "权限控制", "日志审计", "异常回滚"];
      refs.riskTags.innerHTML = tags.map((tag) => `<span>${tag}</span>`).join("");
    }

    const seed = capability.title.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) + index * 19;
    const score = 84 + (seed % 13);
    setScore(score);
    drawSpark(seed);

    if (refs.terminalTitle) {
      refs.terminalTitle.textContent = `${item.platformName} · ${item.name} / ${capability.title}`;
    }

    if (refs.terminalFeed) {
      refs.terminalFeed.innerHTML = "";
      capability.logs.forEach((line, idx) => {
        const timer = setTimeout(() => {
          const row = document.createElement("div");
          row.className = "feed-line";
          row.textContent = `[${nowString()}] ${line}`;
          refs.terminalFeed.prepend(row);
          const list = refs.terminalFeed.querySelectorAll(".feed-line");
          if (list.length > 10) {
            list[list.length - 1].remove();
          }
        }, idx * 230);
        state.runTimers.push(timer);
      });
    }

    appendLog(`触发虚拟演示: ${item.name} / ${capability.title}`);
    capability.logs.forEach((line, idx) => {
      const timer = setTimeout(() => appendLog(line), idx * 240 + 120);
      state.runTimers.push(timer);
    });
  };

  const bindEvents = (item) => {
    document.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;

      const runBtn = target.closest("[data-cap-index]");
      if (!runBtn) return;

      const index = Number(runBtn.getAttribute("data-cap-index") || 0);
      const capability = item.capabilities[index];
      runCapabilityDemo(item, capability, index);
    });
  };

  const seedLogs = (item) => {
    const lines = [
      `已加载模块: ${item.platformName} / ${item.section} / ${item.name}`,
      `场景初始化完成: ${item.scene}`,
      `接入三级功能: ${item.capabilities.length} 项`
    ];
    lines.forEach((line) => appendLog(line));
  };

  const init = () => {
    if (!module) {
      renderError();
      return;
    }

    document.title = `${module.platformName} · ${module.name} | 本草智链二级模块`;

    initParticles();
    renderNav(module);
    renderHero(module);
    renderMobilePreview(module);
    renderCapabilities(module);
    renderWorkflow(module);
    renderContacts(module);
    renderRelated(module);
    seedLogs(module);
    animateWorkflow();

    const first = module.capabilities[0];
    if (first) {
      runCapabilityDemo(module, first, 0);
    }

    bindEvents(module);

    setInterval(() => {
      if (!refs.mobileSection || refs.mobileSection.hidden) return;
      state.previewCursor += 1;
      renderPreviewFeed(module.platform);
    }, 3600);
  };

  init();
})();

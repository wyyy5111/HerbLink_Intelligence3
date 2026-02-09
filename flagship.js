(() => {
  const data = window.MenuData;
  if (!data || !Array.isArray(data.modules)) {
    console.error("MenuData 缺失，无法初始化移动应用页面。");
    return;
  }

  const homeLayout = {
    farmer: {
      top: [
        { name: "AI入口", label: "AI入口", icon: "AI", color: "linear-gradient(135deg,#6ead72,#3f7f45)" },
        { name: "市场行情", label: "市场行情", icon: "市", color: "linear-gradient(135deg,#d5af63,#ae813e)" },
        { name: "在线课程", label: "在线课程", icon: "课", color: "linear-gradient(135deg,#8eb56f,#5f8f4d)" },
        { name: "查找", label: "🔎查找", icon: "搜", color: "linear-gradient(135deg,#90b47a,#6f975a)" }
      ],
      bottom: [
        { name: "首页", label: "首页", icon: "首", color: "linear-gradient(135deg,#78ab62,#4e8341)" },
        { name: "农场情况", label: "农场情况", icon: "农", color: "linear-gradient(135deg,#86b874,#5b8f4f)" },
        { name: "发布直播/作品", label: "发布", icon: "播", color: "linear-gradient(135deg,#d5af63,#ab8244)" },
        { name: "社区", label: "社区", icon: "社", color: "linear-gradient(135deg,#86b079,#5f9158)" },
        { name: "我的", label: "我的", icon: "我", color: "linear-gradient(135deg,#a2b97e,#6d8f52)" }
      ]
    },
    client: {
      top: [
        { name: "AI入口", label: "AI入口", icon: "AI", color: "linear-gradient(135deg,#6ead72,#3f7f45)" },
        { name: "市场行情", label: "市场行情", icon: "市", color: "linear-gradient(135deg,#d5af63,#ae813e)" },
        { name: "商城", label: "商城", icon: "商", color: "linear-gradient(135deg,#8eb56f,#5f8f4d)" },
        { name: "查找", label: "🔎查找", icon: "搜", color: "linear-gradient(135deg,#90b47a,#6f975a)" }
      ],
      bottom: [
        { name: "首页", label: "首页", icon: "首", color: "linear-gradient(135deg,#78ab62,#4e8341)" },
        { name: "今日行情", label: "今日行情", icon: "今", color: "linear-gradient(135deg,#d5af63,#ab8244)" },
        { name: "拍照鉴真伪", label: "拍照鉴真伪", icon: "鉴", color: "linear-gradient(135deg,#86b874,#5b8f4f)" },
        { name: "消息", label: "消息", icon: "讯", color: "linear-gradient(135deg,#86b079,#5f9158)" },
        { name: "我的", label: "我的", icon: "我", color: "linear-gradient(135deg,#a2b97e,#6d8f52)" }
      ]
    }
  };

  const homeFeeds = {
    farmer: [
      { type: "直播", title: "岷县当归采收现场", meta: "在线 2,348 · 成交 126 单", thumb: "/assets/hero.jpg" },
      { type: "视频", title: "川贝母病害识别实拍", meta: "播放 13,241 次", thumb: "/assets/herb.jpg" },
      { type: "直播", title: "专家连线：水肥管理", meta: "在线 1,873 · 互动 4,912", thumb: "/assets/tractor.jpg" },
      { type: "视频", title: "预售锁价实战教学", meta: "播放 9,423 次", thumb: "/assets/panorama.jpg" },
      { type: "直播", title: "文山三七分级展示", meta: "在线 3,005 · 加购 2,104", thumb: "/assets/farm-aerial.jpg" }
    ],
    client: [
      { type: "直播", title: "道地药材溯源专场", meta: "在线 3,006 · 加购 2,104", thumb: "/assets/farm-aerial.jpg" },
      { type: "视频", title: "拍照鉴真伪操作示范", meta: "播放 18,205 次", thumb: "/assets/product.jpg" },
      { type: "直播", title: "健康调理选品答疑", meta: "在线 2,461 · 下单 731", thumb: "/assets/base.jpg" },
      { type: "视频", title: "认领农场权益说明", meta: "播放 6,832 次", thumb: "/assets/panorama.jpg" },
      { type: "直播", title: "福利日直播秒杀", meta: "在线 1,908 · 成交 609 单", thumb: "/assets/hero.jpg" }
    ]
  };

  const realRegionRows = [
    { location: "安国药市", spec: "家种统片", origin: "广东", price: 26, change: -14.0 },
    { location: "安国药市", spec: "野生统片", origin: "较广", price: 26, change: -14.0 },
    { location: "亳州药市", spec: "家种统片", origin: "广东", price: 27, change: -11.0 },
    { location: "亳州药市", spec: "野生统片", origin: "较广", price: 25, change: -10.0 },
    { location: "亳州药市", spec: "家种统片", origin: "安徽", price: 28, change: -12.0 },
    { location: "荷花池药市", spec: "家统片", origin: "较广", price: 24, change: -16.0 },
    { location: "玉林药市", spec: "家种统片", origin: "广东", price: 22, change: -16.0 },
    { location: "玉林药市", spec: "野生统片", origin: "较广", price: 28, change: -11.0 },
    { location: "广东省-茂名市-高州市", spec: "家种统片", origin: "", price: 20, change: -14.0 },
    { location: "贵州省-毕节地区-毕节市", spec: "野生统片", origin: "", price: 25, change: -11.0 },
    { location: "四川省-攀枝花市-盐边县", spec: "野生统片", origin: "", price: 26, change: -11.0 },
    { location: "云南省-丽江市-华坪县", spec: "野生统片", origin: "", price: 24, change: -10.0 }
  ];

  const defaultMarketPayload = {
    range: 12,
    price: realRegionRows.map((item) => item.price),
    volume: [8.6, 8.2, 7.9, 8.1, 7.6, 7.2, 6.9, 7.1, 6.7, 6.8, 6.9, 7.0],
    history: [
      { year: 2021, avg: 34.8, high: 37.5, low: 31.6 },
      { year: 2022, avg: 32.9, high: 35.2, low: 30.5 },
      { year: 2023, avg: 31.2, high: 33.8, low: 28.8 },
      { year: 2024, avg: 29.4, high: 32.0, low: 27.1 },
      { year: 2025, avg: 27.8, high: 30.1, low: 25.4 },
      { year: 2026, avg: 25.5, high: 28.0, low: 22.8 }
    ],
    summary: {
      avg: Number((realRegionRows.reduce((sum, item) => sum + item.price, 0) / realRegionRows.length).toFixed(2)),
      max: 28,
      min: 20,
      volumePeak: 8.6
    }
  };

  const realVisuals = {
    farmer: {
      showcase: {
        image: "/assets/hero.jpg",
        tag: "农户端实景",
        title: "岷县基地全日作业联动",
        meta: "采收、分级、预售、物流全链实时协同"
      },
      strip: [
        { label: "在线农场", value: "6,218" },
        { label: "今日直播", value: "1,280" },
        { label: "预售履约", value: "98.4%" }
      ],
      orbitImage: "/assets/farm-aerial.jpg",
      media: [
        {
          kind: "video",
          style: "aerial",
          title: "玉米长势巡检航拍",
          desc: "无人机巡检 · 长势识别与风险热区标注",
          src: "/assets/corn-monitoring.webm",
          poster: "/assets/farm-aerial.jpg"
        },
        {
          kind: "video",
          style: "process",
          title: "椰材加工工位实录",
          desc: "初加工流水线 · 产线质控联动",
          src: "/assets/coconut-processing.webm",
          poster: "/assets/base.jpg"
        },
        {
          kind: "video",
          style: "field",
          title: "河谷农田作业镜头",
          desc: "地块实景采收 · 物流准备协同",
          src: "/assets/rio-grande-agriculture.webm",
          poster: "/assets/panorama.jpg"
        },
        {
          kind: "video",
          style: "landscape",
          title: "广域农场全景巡航",
          desc: "跨地块调度 · 经营全局监控",
          src: "/assets/western-australia-agriculture.webm",
          poster: "/assets/hero.jpg"
        }
      ],
      gallery: [
        { src: "/assets/farm-aerial.jpg", title: "产区航拍总览" },
        { src: "/assets/panorama.jpg", title: "农场全景实拍" },
        { src: "/assets/hero.jpg", title: "采收现场纪实" },
        { src: "/assets/tractor.jpg", title: "设备作业场景" }
      ]
    },
    client: {
      showcase: {
        image: "/assets/product.jpg",
        tag: "客户端实景",
        title: "可信消费与溯源场景",
        meta: "拍照鉴真伪、选品推荐、福利活动一体联动"
      },
      strip: [
        { label: "活跃会话", value: "28,430" },
        { label: "商城转化", value: "18.6%" },
        { label: "鉴真伪准确率", value: "98.9%" }
      ],
      orbitImage: "/assets/base.jpg",
      media: [
        {
          kind: "video",
          style: "macro",
          title: "重点地块质量巡查",
          desc: "细节放大巡检 · 异常识别回传",
          src: "/assets/corn-monitoring-zoom.webm",
          poster: "/assets/base.jpg"
        },
        {
          kind: "video",
          style: "process",
          title: "药材初加工流程实拍",
          desc: "分拣与加工联动 · 质量全程留痕",
          src: "/assets/coconut-processing.webm",
          poster: "/assets/product.jpg"
        },
        {
          kind: "video",
          style: "field",
          title: "产区与流通场景联动",
          desc: "地块到渠道 · 协同履约追踪",
          src: "/assets/rio-grande-agriculture.webm",
          poster: "/assets/farm-aerial.jpg"
        },
        {
          kind: "video",
          style: "landscape",
          title: "大规模农场全景监控",
          desc: "多地块并行管理 · 场景总览回放",
          src: "/assets/western-australia-agriculture.webm",
          poster: "/assets/base.jpg"
        }
      ],
      gallery: [
        { src: "/assets/product.jpg", title: "消费端样品展示" },
        { src: "/assets/base.jpg", title: "基地设施实景" },
        { src: "/assets/panorama.jpg", title: "产区实景图" },
        { src: "/assets/herb.jpg", title: "药材细节图集" }
      ]
    }
  };

  const enterprisePulse = {
    farmer: {
      pills: [
        { label: "今日协同任务", value: "428", trend: "+6.2%" },
        { label: "重点预警处置", value: "37", trend: "-12%" },
        { label: "履约达成率", value: "98.4%", trend: "+1.3%" }
      ],
      timeline: [
        "07:10 · 岷县地块巡检任务已全量同步",
        "08:45 · 黄芪批次质检完成，进入预售池",
        "10:20 · 物流联动策略自动重排并下发"
      ]
    },
    client: {
      pills: [
        { label: "活跃消费会话", value: "28,430", trend: "+8.9%" },
        { label: "鉴真伪调用量", value: "12,904", trend: "+14.7%" },
        { label: "商城转化率", value: "18.6%", trend: "+2.1%" }
      ],
      timeline: [
        "09:05 · 重点品类价格预警推送完成",
        "10:12 · 福利活动策略切换为高转化模型",
        "11:00 · 监管协同链路全部在线"
      ]
    }
  };

  const state = {
    platform: "farmer",
    tab: "home",
    moduleKey: null,
    market: null,
    regions: [],
    feedCursor: 0,
    workflowCursor: 0,
    searchResults: [],
    runTimers: [],
    sheetCapIndex: 0,
    sheetTimers: [],
    launchDone: false
  };

  const els = {
    phoneApp: document.querySelector(".phone-app"),
    launchScreen: document.querySelector("#launch-screen"),
    launchProgressBar: document.querySelector("#launch-progress-bar"),
    launchProgressText: document.querySelector("#launch-progress-text"),
    launchPhase: document.querySelector("#launch-phase"),

    statusTime: document.querySelector("#status-time"),
    brandDate: document.querySelector("#brand-date"),
    platformSubtitle: document.querySelector("#platform-subtitle"),
    platformToggle: document.querySelector("#platform-toggle"),

    quickSearch: document.querySelector("#quick-search"),
    searchResults: document.querySelector("#search-results"),

    showcaseImage: document.querySelector("#showcase-image"),
    showcaseTag: document.querySelector("#showcase-tag"),
    showcaseTitle: document.querySelector("#showcase-title"),
    showcaseMeta: document.querySelector("#showcase-meta"),
    showcaseStrip: document.querySelector("#showcase-strip"),
    commandPillRow: document.querySelector("#command-pill-row"),
    commandTimeline: document.querySelector("#command-timeline"),

    homeTopGrid: document.querySelector("#home-top-grid"),
    homeBottomGrid: document.querySelector("#home-bottom-grid"),
    homeMoreWrap: document.querySelector("#home-more-wrap"),
    homeMoreRow: document.querySelector("#home-more-row"),
    homeFeed: document.querySelector("#home-feed"),
    homeFeedDots: document.querySelector("#home-feed-dots"),
    mediaWall: document.querySelector("#media-wall"),

    orbitBgPhoto: document.querySelector("#orbit-bg-photo"),
    orbitAiWindow: document.querySelector("#orbit-ai-window"),
    orbitAiPlatform: document.querySelector("#orbit-ai-platform"),
    orbitAiTitle: document.querySelector("#orbit-ai-title"),
    orbitAiSummary: document.querySelector("#orbit-ai-summary"),
    orbitAiTags: document.querySelector("#orbit-ai-tags"),
    orbitAiKpis: document.querySelector("#orbit-ai-kpis"),
    orbitAiOpen: document.querySelector("#orbit-ai-open"),
    orbitAiRun: document.querySelector("#orbit-ai-run"),

    priceChart: document.querySelector("#price-chart"),
    trendChart: document.querySelector("#trend-chart"),
    volumeChart: document.querySelector("#volume-chart"),
    marketAvg: document.querySelector("#market-avg"),
    marketMax: document.querySelector("#market-max"),
    marketMin: document.querySelector("#market-min"),
    marketVolumePeak: document.querySelector("#market-volume-peak"),
    trendNote: document.querySelector("#trend-note"),
    volumeNote: document.querySelector("#volume-note"),
    historyTableBody: document.querySelector("#history-table-body"),
    presaleTableBody: document.querySelector("#presale-table-body"),
    regionList: document.querySelector("#region-list"),
    heatList: document.querySelector("#heat-list"),

    moduleTitle: document.querySelector("#module-title"),
    moduleSection: document.querySelector("#module-section"),
    moduleSummary: document.querySelector("#module-summary"),
    moduleKpis: document.querySelector("#module-kpis"),
    moduleSelector: document.querySelector("#module-selector"),
    moduleCapGrid: document.querySelector("#module-cap-grid"),
    moduleWorkflow: document.querySelector("#module-workflow"),
    moduleLiveLog: document.querySelector("#module-live-log"),
    moduleRunState: document.querySelector("#module-run-state"),

    mineGrid: document.querySelector("#mine-grid"),
    mineTips: document.querySelector("#mine-tips"),
    photoRail: document.querySelector("#photo-rail"),

    tabbar: document.querySelector("#tabbar"),
    views: Array.from(document.querySelectorAll(".view")),

    sheet: document.querySelector("#module-sheet"),
    sheetPlatform: document.querySelector("#sheet-platform"),
    sheetTitle: document.querySelector("#sheet-title"),
    sheetSummary: document.querySelector("#sheet-summary"),
    sheetKpis: document.querySelector("#sheet-kpis"),
    sheetMenuList: document.querySelector("#sheet-menu-list"),
    sheetSimCard: document.querySelector("#sheet-sim-card"),
    sheetLog: document.querySelector("#sheet-log")
  };

  const sortedModules = (platform) =>
    (data.modulesByPlatform[platform] || []).slice().sort((a, b) => {
      if (a.section === b.section) return a.order - b.order;
      if (a.section === "首页") return -1;
      if (b.section === "首页") return 1;
      if (a.section === "我的") return 1;
      if (b.section === "我的") return -1;
      return a.section.localeCompare(b.section, "zh-CN");
    });

  const getModule = (key) => data.modulesByKey[key] || null;

  const nowTime = () =>
    new Date().toLocaleTimeString("zh-CN", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });

  const escapeHtml = (value) =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");

  const normalizeName = (name) => name.replace("🔎", "").trim();

  const moduleByName = (platform, name) => sortedModules(platform).find((item) => item.name === normalizeName(name)) || null;

  const ensureCurrentModule = () => {
    if (state.moduleKey && getModule(state.moduleKey)) return;
    const first = sortedModules(state.platform)[0];
    state.moduleKey = first ? first.key : null;
  };

  const setStatusClock = () => {
    if (els.statusTime) {
      els.statusTime.textContent = nowTime();
    }
  };

  const setBrandDate = () => {
    if (!els.brandDate) return;
    const now = new Date();
    const weekday = now.toLocaleDateString("zh-CN", { weekday: "short" });
    const date = now.toLocaleDateString("zh-CN", { month: "2-digit", day: "2-digit" });
    els.brandDate.textContent = `${date} ${weekday}`;
  };

  const clearRunTimers = () => {
    state.runTimers.forEach((timer) => clearTimeout(timer));
    state.runTimers = [];
  };

  const clearSheetTimers = () => {
    state.sheetTimers.forEach((timer) => clearTimeout(timer));
    state.sheetTimers = [];
  };

  const appendLog = (line) => {
    if (!els.moduleLiveLog) return;
    const row = document.createElement("div");
    row.className = "log-line";
    row.innerHTML = `
      <span class="log-time">${escapeHtml(nowTime())}</span>
      <span class="log-dot" aria-hidden="true"></span>
      <span class="log-msg">${escapeHtml(line)}</span>
    `;
    els.moduleLiveLog.prepend(row);

    const rows = els.moduleLiveLog.querySelectorAll(".log-line");
    if (rows.length > 48) {
      rows[rows.length - 1].remove();
    }
  };

  const renderPlatformToggle = () => {
    if (!els.platformToggle) return;
    const platforms = Object.values(data.platformMeta || {});

    els.platformToggle.innerHTML = platforms
      .map(
        (platform) => `
          <button class="platform-btn ${platform.key === state.platform ? "is-active" : ""}" data-platform="${platform.key}">
            ${platform.name}
          </button>
        `
      )
      .join("");

    if (els.platformSubtitle) {
      const meta = data.platformMeta?.[state.platform];
      els.platformSubtitle.textContent = meta ? `${meta.name}工作台` : "移动端工作台";
    }
  };

  const renderHomeIcons = (target, list) => {
    if (!target) return;

    target.innerHTML = list
      .map((item) => {
        const module = moduleByName(state.platform, item.name);
        const active = module && module.key === state.moduleKey ? "is-active" : "";
        const attrs = module ? `data-select-module="${module.key}"` : "";

        return `
          <button class="app-icon ${active}" ${attrs}>
            <span class="mark" style="background:${item.color}">${item.icon}</span>
            <span>${escapeHtml(item.label)}</span>
          </button>
        `;
      })
      .join("");
  };

  const renderShowcase = () => {
    const visual = realVisuals[state.platform];
    if (!visual) return;

    if (els.showcaseImage) {
      els.showcaseImage.src = visual.showcase.image;
      els.showcaseImage.alt = visual.showcase.title;
    }
    if (els.showcaseTag) els.showcaseTag.textContent = visual.showcase.tag;
    if (els.showcaseTitle) els.showcaseTitle.textContent = visual.showcase.title;
    if (els.showcaseMeta) els.showcaseMeta.textContent = visual.showcase.meta;

    if (els.showcaseStrip) {
      els.showcaseStrip.innerHTML = visual.strip
        .map(
          (item) => `
            <article class="showcase-kpi">
              <strong>${escapeHtml(item.value)}</strong>
              <span>${escapeHtml(item.label)}</span>
            </article>
          `
        )
        .join("");
    }
  };

  const renderCommandPanel = () => {
    const pulse = enterprisePulse[state.platform];
    if (!pulse) return;

    if (els.commandPillRow) {
      els.commandPillRow.innerHTML = pulse.pills
        .map(
          (item) => `
            <article class="command-pill">
              <span>${escapeHtml(item.label)}</span>
              <strong>${escapeHtml(item.value)}</strong>
              <em>${escapeHtml(item.trend)}</em>
            </article>
          `
        )
        .join("");
    }

    if (els.commandTimeline) {
      els.commandTimeline.innerHTML = pulse.timeline
        .map((line) => `<div class="command-step">${escapeHtml(line)}</div>`)
        .join("");
    }
  };

  const renderMediaWall = () => {
    const visual = realVisuals[state.platform];
    if (!visual || !els.mediaWall) return;

    els.mediaWall.innerHTML = visual.media
      .map((item) => {
        const isVideo = item.kind === "video";
        const styleClass = item.style ? ` media-video--${item.style}` : "";
        const cardClass = item.style ? ` media-card--${item.style}` : "";
        const mediaType = String(item.src || "").endsWith(".mp4") ? "video/mp4" : "video/webm";
        const badge = item.badge || (isVideo ? "实景视频" : "实景图");
        const mediaEl =
          isVideo
            ? `
                <video class="media-video${styleClass}" muted autoplay loop playsinline preload="metadata" poster="${item.poster || ""}">
                  <source src="${item.src}" type="${mediaType}" />
                </video>
                <span class="media-badge">${escapeHtml(badge)}</span>
              `
            : `
                <img class="media-image" src="${item.src}" alt="${escapeHtml(item.title)}" loading="lazy" />
                <span class="media-badge">${escapeHtml(badge)}</span>
              `;

        return `
          <article class="media-card${cardClass}">
            <div class="media-frame">
              ${mediaEl}
            </div>
            <div class="media-info">
              <strong>${escapeHtml(item.title)}</strong>
              <span>${escapeHtml(item.desc)}</span>
            </div>
          </article>
        `;
      })
      .join("");

    els.mediaWall.querySelectorAll("video").forEach((video) => {
      const el = video;
      el.muted = true;
      const playPromise = el.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {});
      }
    });
  };

  const renderPhotoRail = () => {
    const visual = realVisuals[state.platform];
    if (!visual || !els.photoRail) return;

    els.photoRail.innerHTML = visual.gallery
      .map(
        (item) => `
          <article class="photo-item">
            <img src="${item.src}" alt="${escapeHtml(item.title)}" loading="lazy" />
            <span>${escapeHtml(item.title)}</span>
          </article>
        `
      )
      .join("");
  };

  const renderHomeFeed = () => {
    const list = homeFeeds[state.platform] || [];
    if (!els.homeFeed || !list.length) return;

    const cards = [];
    const showCount = Math.min(3, list.length);

    for (let i = 0; i < showCount; i += 1) {
      cards.push(list[(state.feedCursor + i) % list.length]);
    }

    els.homeFeed.innerHTML = cards
      .map(
        (feed) => `
          <article class="feed-card">
            <div class="feed-thumb">
              <img src="${feed.thumb || "/assets/hero.jpg"}" alt="${escapeHtml(feed.title)}" loading="lazy" />
              <span class="feed-kind">${escapeHtml(feed.type)}</span>
            </div>
            <div class="feed-meta">
              <strong>${escapeHtml(feed.type)} · ${escapeHtml(feed.title)}</strong>
              <span>${escapeHtml(feed.meta)}</span>
            </div>
          </article>
        `
      )
      .join("");

    if (els.homeFeedDots) {
      els.homeFeedDots.innerHTML = list
        .map((_, index) => `<i class="${index === state.feedCursor ? "is-active" : ""}"></i>`)
        .join("");
    }
  };

  const renderHome = () => {
    const layout = homeLayout[state.platform];
    if (!layout) return;

    renderShowcase();
    renderCommandPanel();
    renderHomeIcons(els.homeTopGrid, layout.top);
    renderHomeIcons(els.homeBottomGrid, layout.bottom);
    renderHomeFeed();
    renderMediaWall();

    const used = new Set([...layout.top.map((item) => normalizeName(item.name)), ...layout.bottom.map((item) => normalizeName(item.name))]);

    const extras = sortedModules(state.platform).filter((item) => item.section === "首页" && !used.has(item.name));

    if (els.homeMoreWrap && els.homeMoreRow) {
      if (!extras.length) {
        els.homeMoreWrap.hidden = true;
      } else {
        els.homeMoreWrap.hidden = false;
        els.homeMoreRow.innerHTML = extras
          .map(
            (item) => `
              <button class="more-chip ${item.key === state.moduleKey ? "is-active" : ""}" data-select-module="${item.key}">
                ${escapeHtml(item.name)}
              </button>
            `
          )
          .join("");
      }
    }
  };

  const renderOrbit = () => {
    const aiModule = moduleByName(state.platform, "AI入口") || sortedModules(state.platform)[0];
    const visual = realVisuals[state.platform];

    if (!aiModule) return;

    if (els.orbitBgPhoto && visual?.orbitImage) {
      els.orbitBgPhoto.src = visual.orbitImage;
      els.orbitBgPhoto.alt = `${aiModule.platformName}AI中枢背景`;
    }

    if (els.orbitAiWindow) {
      els.orbitAiWindow.setAttribute("data-ai-module-key", aiModule.key);
    }

    if (els.orbitAiPlatform) {
      els.orbitAiPlatform.textContent = `${aiModule.platformName} · ${aiModule.section}`;
    }
    if (els.orbitAiTitle) {
      els.orbitAiTitle.textContent = aiModule.name;
    }
    if (els.orbitAiSummary) {
      els.orbitAiSummary.textContent = aiModule.summary;
    }

    if (els.orbitAiTags) {
      els.orbitAiTags.innerHTML = aiModule.capabilities
        .slice(0, 3)
        .map(
          (item) => `
            <span>${escapeHtml(item.title)}</span>
          `
        )
        .join("");
    }

    if (els.orbitAiKpis) {
      els.orbitAiKpis.innerHTML = aiModule.kpis
        .slice(0, 3)
        .map(
          (kpi) => `
            <article>
              <strong>${escapeHtml(kpi.value)}</strong>
              <span>${escapeHtml(kpi.label)}</span>
            </article>
          `
        )
        .join("");
    }

    if (els.orbitAiOpen) {
      els.orbitAiOpen.setAttribute("data-open-ai-module", aiModule.key);
    }

    if (els.orbitAiRun) {
      els.orbitAiRun.setAttribute("data-run-ai-module", aiModule.key);
    }
  };

  const prepareCanvas = (canvas, fallbackWidth, fallbackHeight) => {
    if (!canvas) return null;

    const ratio = window.devicePixelRatio || 1;
    const width = canvas.clientWidth || fallbackWidth;
    const height = canvas.clientHeight || fallbackHeight;

    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    return { ctx, width, height };
  };

  const drawPriceChart = (series) => {
    if (!Array.isArray(series) || series.length < 2 || !els.priceChart) return;
    const layer = prepareCanvas(els.priceChart, 390, 176);
    if (!layer) return;

    const { ctx, width, height } = layer;
    const pad = { top: 18, right: 10, bottom: 20, left: 10 };
    const min = Math.min(...series);
    const max = Math.max(...series);

    const toX = (index) => pad.left + (index * (width - pad.left - pad.right)) / (series.length - 1);
    const toY = (value) => {
      const t = (value - min) / (max - min || 1);
      return height - pad.bottom - t * (height - pad.top - pad.bottom);
    };

    ctx.clearRect(0, 0, width, height);

    ctx.beginPath();
    for (let i = 0; i <= 4; i += 1) {
      const y = pad.top + ((height - pad.top - pad.bottom) / 4) * i;
      ctx.moveTo(pad.left, y);
      ctx.lineTo(width - pad.right, y);
    }
    ctx.strokeStyle = "rgba(111, 87, 62, 0.16)";
    ctx.lineWidth = 1;
    ctx.stroke();

    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, "rgba(110,173,114,0.95)");
    gradient.addColorStop(0.6, "rgba(213,175,99,0.95)");
    gradient.addColorStop(1, "rgba(63,127,69,0.95)");

    ctx.beginPath();
    ctx.moveTo(toX(0), toY(series[0]));
    for (let i = 1; i < series.length; i += 1) {
      ctx.lineTo(toX(i), toY(series[i]));
    }
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2.8;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.stroke();

    const lx = toX(series.length - 1);
    const ly = toY(series[series.length - 1]);
    ctx.beginPath();
    ctx.arc(lx, ly, 3.8, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(63,127,69,0.95)";
    ctx.fill();
  };

  const drawVolumeChart = (series) => {
    if (!Array.isArray(series) || series.length < 2 || !els.volumeChart) return;
    const layer = prepareCanvas(els.volumeChart, 390, 150);
    if (!layer) return;

    const { ctx, width, height } = layer;
    const pad = { top: 16, right: 8, bottom: 18, left: 8 };
    const max = Math.max(...series);
    const barWidth = (width - pad.left - pad.right) / series.length;

    ctx.clearRect(0, 0, width, height);

    ctx.beginPath();
    for (let i = 0; i <= 3; i += 1) {
      const y = pad.top + ((height - pad.top - pad.bottom) / 3) * i;
      ctx.moveTo(pad.left, y);
      ctx.lineTo(width - pad.right, y);
    }
    ctx.strokeStyle = "rgba(111, 87, 62, 0.16)";
    ctx.lineWidth = 1;
    ctx.stroke();

    series.forEach((value, index) => {
      const ratio = value / (max || 1);
      const h = ratio * (height - pad.top - pad.bottom);
      const x = pad.left + index * barWidth + 1.6;
      const y = height - pad.bottom - h;
      const w = Math.max(3, barWidth - 4);

      const gradient = ctx.createLinearGradient(0, y, 0, y + h);
      gradient.addColorStop(0, "rgba(110,173,114,0.95)");
      gradient.addColorStop(1, "rgba(213,175,99,0.62)");

      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, w, h);
    });
  };

  const drawTrendChart = (history) => {
    if (!Array.isArray(history) || history.length < 2 || !els.trendChart) return;
    const layer = prepareCanvas(els.trendChart, 390, 176);
    if (!layer) return;

    const { ctx, width, height } = layer;
    const pad = { top: 16, right: 10, bottom: 28, left: 10 };
    const series = history.map((item) => Number(item.avg || 0));
    const lows = history.map((item) => Number(item.low || item.avg || 0));
    const highs = history.map((item) => Number(item.high || item.avg || 0));
    const min = Math.min(...lows);
    const max = Math.max(...highs);

    const toX = (index) => pad.left + (index * (width - pad.left - pad.right)) / (history.length - 1);
    const toY = (value) => {
      const ratio = (value - min) / (max - min || 1);
      return height - pad.bottom - ratio * (height - pad.top - pad.bottom);
    };

    ctx.clearRect(0, 0, width, height);

    ctx.beginPath();
    for (let i = 0; i <= 4; i += 1) {
      const y = pad.top + ((height - pad.top - pad.bottom) / 4) * i;
      ctx.moveTo(pad.left, y);
      ctx.lineTo(width - pad.right, y);
    }
    ctx.strokeStyle = "rgba(111, 87, 62, 0.14)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(toX(0), toY(series[0]));
    for (let i = 1; i < series.length; i += 1) {
      ctx.lineTo(toX(i), toY(series[i]));
    }
    ctx.lineTo(toX(series.length - 1), height - pad.bottom);
    ctx.lineTo(toX(0), height - pad.bottom);
    ctx.closePath();
    const areaGradient = ctx.createLinearGradient(0, pad.top, 0, height - pad.bottom);
    areaGradient.addColorStop(0, "rgba(110,173,114,0.28)");
    areaGradient.addColorStop(1, "rgba(110,173,114,0)");
    ctx.fillStyle = areaGradient;
    ctx.fill();

    const lineGradient = ctx.createLinearGradient(0, 0, width, 0);
    lineGradient.addColorStop(0, "rgba(63,127,69,0.95)");
    lineGradient.addColorStop(1, "rgba(213,175,99,0.96)");

    ctx.beginPath();
    ctx.moveTo(toX(0), toY(series[0]));
    for (let i = 1; i < series.length; i += 1) {
      ctx.lineTo(toX(i), toY(series[i]));
    }
    ctx.strokeStyle = lineGradient;
    ctx.lineWidth = 3;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.stroke();

    series.forEach((value, index) => {
      const x = toX(index);
      const y = toY(value);
      ctx.beginPath();
      ctx.arc(x, y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(63,127,69,0.95)";
      ctx.fill();
    });

    ctx.fillStyle = "rgba(111, 87, 62, 0.72)";
    ctx.font = '10px "Urbanist", "Noto Sans SC", sans-serif';
    ctx.textAlign = "center";
    history.forEach((item, index) => {
      ctx.fillText(String(item.year), toX(index), height - 8);
    });
  };

  const renderHistoryTable = (history) => {
    if (!els.historyTableBody) return;
    if (!Array.isArray(history) || !history.length) {
      els.historyTableBody.innerHTML = `<tr><td colspan="5">暂无历史数据</td></tr>`;
      return;
    }

    els.historyTableBody.innerHTML = history
      .map((item, index) => {
        const prev = history[index - 1];
        const yoy = prev ? ((Number(item.avg || 0) - Number(prev.avg || 0)) / (Number(prev.avg || 1) || 1)) * 100 : null;
        const yoyText = yoy === null ? "--" : `${yoy >= 0 ? "+" : ""}${yoy.toFixed(2)}%`;
        const yoyClass = yoy === null ? "" : yoy >= 0 ? "up" : "down";
        return `
          <tr>
            <td>${item.year}</td>
            <td>${Number(item.avg || 0).toFixed(2)}</td>
            <td>${Number(item.high || 0).toFixed(2)}</td>
            <td>${Number(item.low || 0).toFixed(2)}</td>
            <td class="${yoyClass}">${yoyText}</td>
          </tr>
        `;
      })
      .join("");
  };

  const renderPresaleForecast = () => {
    if (!els.presaleTableBody) return;
    if (!Array.isArray(state.regions) || !state.regions.length) {
      els.presaleTableBody.innerHTML = `<tr><td colspan="2">暂无预测数据</td></tr>`;
      return;
    }

    els.presaleTableBody.innerHTML = state.regions
      .map((item) => {
        const currentPrice = Number(item.price || 0);
        const yoyDrop = Math.abs(Number(item.change || 0));
        const recovery = yoyDrop * 0.3;
        const specFactor = String(item.spec || "").includes("野生") ? 0.9 : 0.5;
        const channelFactor = String(item.location || "").includes("药市") ? 0.6 : 0.4;
        const predicted = Number((currentPrice + recovery + specFactor + channelFactor).toFixed(2));
        const originRaw = String(item.origin || "").trim();
        return `
          <tr>
            <td>
              <strong>${escapeHtml(item.location || "--")}</strong>
              <span>${escapeHtml(item.spec || "--")}${originRaw ? ` ${escapeHtml(originRaw)}` : ""}</span>
            </td>
            <td>
              <strong>${predicted.toFixed(2)} 元/公斤</strong>
            </td>
          </tr>
        `;
      })
      .join("");
  };

  const renderRegionPanels = () => {
    if (!els.regionList || !els.heatList) return;
    if (!Array.isArray(state.regions) || !state.regions.length) {
      els.regionList.innerHTML = "";
      els.heatList.innerHTML = "";
      return;
    }

    els.regionList.innerHTML = state.regions
      .map((item) => {
        const change = Number(item.change || 0);
        const cls = change >= 0 ? "up" : "down";
        const arrow = change >= 0 ? "⬆" : "⬇";
        const location = escapeHtml(item.location || "--");
        const spec = escapeHtml(item.spec || "--");
        const originRaw = String(item.origin || "").trim();
        const origin = escapeHtml(originRaw);
        const priceValue = Number(item.price || 0);
        const price = Number.isInteger(priceValue) ? String(priceValue) : priceValue.toFixed(2);
        const changeText = `${change.toFixed(2)}${arrow}`;
        return `
          <article class="region-item">
            <div class="region-main">
              <strong>${location}</strong>
              <span>${spec}</span>
              ${originRaw ? `<span>${origin}</span>` : "<span></span>"}
              <b>${price}元/公斤</b>
            </div>
            <div class="region-tail">
              <i class="${cls}">较去年${changeText}</i>
            </div>
          </article>
        `;
      })
      .join("");

    const heatMap = new Map();
    state.regions.forEach((item) => {
      const key = `${item.spec || "统片"} · ${item.origin || "本地"}`;
      const current = heatMap.get(key) || { label: key, sumPrice: 0, sumChange: 0, count: 0 };
      current.sumPrice += Number(item.price || 0);
      current.sumChange += Number(item.change || 0);
      current.count += 1;
      heatMap.set(key, current);
    });

    const heatRows = Array.from(heatMap.values()).map((row) => {
      const avgPrice = row.sumPrice / (row.count || 1);
      const avgChange = row.sumChange / (row.count || 1);
      const score = avgPrice * (1 + (18 - Math.abs(avgChange)) / 100);
      return { ...row, avgPrice, avgChange, score };
    });

    const maxScore = Math.max(...heatRows.map((row) => row.score), 1);

    els.heatList.innerHTML = heatRows
      .sort((a, b) => b.score - a.score)
      .map((item) => {
        const ratio = Math.max(8, Math.round((item.score / maxScore) * 100));
        return `
          <article class="heat-item">
            <div class="heat-head">
              <span>${escapeHtml(item.label)}</span>
              <strong>${item.score.toFixed(1)}</strong>
            </div>
            <div class="heat-sub">
              <span>均价 ${item.avgPrice.toFixed(2)} 元/公斤</span>
              <i>同比 ${item.avgChange.toFixed(2)}%</i>
            </div>
            <div class="heat-track">
              <span class="heat-fill" style="width:${ratio}%"></span>
            </div>
          </article>
        `;
      })
      .join("");

    renderPresaleForecast();
  };

  const renderMarket = () => {
    if (!state.market) return;

    const history = Array.isArray(state.market.history) && state.market.history.length ? state.market.history : defaultMarketPayload.history;
    const summary = state.market.summary || defaultMarketPayload.summary;
    const prices = Array.isArray(state.market.price) && state.market.price.length ? state.market.price : defaultMarketPayload.price;
    const volumes = Array.isArray(state.market.volume) && state.market.volume.length ? state.market.volume : defaultMarketPayload.volume;

    drawPriceChart(prices);
    drawTrendChart(history);
    drawVolumeChart(volumes);
    renderHistoryTable(history);
    renderPresaleForecast();

    if (els.marketAvg) els.marketAvg.textContent = `${Number(summary.avg || 0).toFixed(2)} 元`;
    if (els.marketMax) els.marketMax.textContent = `${Number(summary.max || 0).toFixed(2)} 元`;
    if (els.marketMin) els.marketMin.textContent = `${Number(summary.min || 0).toFixed(2)} 元`;
    if (els.marketVolumePeak) els.marketVolumePeak.textContent = `${Number(summary.volumePeak || 0).toFixed(1)} 万公斤`;

    const latest = volumes.length ? Number(volumes[volumes.length - 1]) : 0;
    const prev = volumes.length > 1 ? Number(volumes[volumes.length - 2]) : latest;
    const diff = latest - prev;
    const trend = diff >= 0 ? "上升" : "下降";

    if (els.volumeNote) {
      els.volumeNote.textContent = `最近时段成交量 ${latest.toFixed(1)} 万公斤，较前一时段${trend} ${Math.abs(diff).toFixed(1)} 万公斤`;
    }

    if (els.trendNote && history.length >= 2) {
      const first = Number(history[0].avg || 0);
      const last = Number(history[history.length - 1].avg || 0);
      const rate = first ? ((last - first) / first) * 100 : 0;
      els.trendNote.textContent = `2021-2026 均价由 ${first.toFixed(2)} 元/公斤变化至 ${last.toFixed(2)} 元/公斤（${rate.toFixed(2)}%）`;
    }

    renderRegionPanels();
  };

  const cloneRealRegionRows = () => realRegionRows.map((item) => ({ ...item }));

  const normalizeRegionRow = (item) => ({
    location: item.location || item.region || "--",
    spec: item.spec || item.herb || "统片",
    origin: item.origin || item.source || "",
    price: Number(item.price || 0),
    change: Number(item.change || item.yoy || 0)
  });

  const renderWorkflow = (module) => {
    if (!els.moduleWorkflow) return;

    const steps = Array.isArray(module.workflow) ? module.workflow : [];
    if (!steps.length) {
      els.moduleWorkflow.innerHTML = "";
      return;
    }

    const activeIndex = state.workflowCursor % steps.length;
    els.moduleWorkflow.innerHTML = steps
      .map((step, index) => `<li class="${index === activeIndex ? "is-hot" : ""}">${index + 1}. ${escapeHtml(step)}</li>`)
      .join("");
  };

  const runCapability = (index) => {
    const module = getModule(state.moduleKey);
    if (!module) return;

    const capability = module.capabilities[index];
    if (!capability) return;

    clearRunTimers();

    if (els.moduleRunState) {
      els.moduleRunState.textContent = `处理中 · ${capability.title}`;
    }

    appendLog(`触发能力流程: ${module.name} / ${capability.title}`);
    capability.logs.forEach((line, lineIndex) => {
      const timer = setTimeout(() => {
        appendLog(line);
      }, lineIndex * 220 + 80);
      state.runTimers.push(timer);
    });
  };

  const renderModuleWorkbench = () => {
    const module = getModule(state.moduleKey);
    if (!module) return;

    if (els.moduleTitle) els.moduleTitle.textContent = module.name;
    if (els.moduleSection) els.moduleSection.textContent = `${module.platformName} · ${module.section}`;
    if (els.moduleSummary) els.moduleSummary.textContent = module.summary;

    if (els.moduleKpis) {
      els.moduleKpis.innerHTML = module.kpis
        .map(
          (kpi) => `
            <article class="kpi-item">
              <strong>${escapeHtml(kpi.value)}</strong>
              <span>${escapeHtml(kpi.label)} · ${escapeHtml(kpi.trend)}</span>
            </article>
          `
        )
        .join("");
    }

    if (els.moduleSelector) {
      els.moduleSelector.innerHTML = sortedModules(state.platform)
        .map(
          (item) => `
            <button class="selector-btn ${item.key === module.key ? "is-active" : ""}" data-select-module="${item.key}">
              ${escapeHtml(item.section)} · ${escapeHtml(item.name)}
            </button>
          `
        )
        .join("");
    }

    if (els.moduleCapGrid) {
      els.moduleCapGrid.innerHTML = module.capabilities
        .map(
          (capability, index) => `
            <article class="cap-card">
              <h4>${escapeHtml(capability.title)}</h4>
              <p>${escapeHtml(capability.detail)}</p>
              <div class="cap-meta">
                <span>输入 ${capability.input.length} 项</span>
                <span>输出 ${capability.output.length} 项</span>
                <span>${escapeHtml(capability.risk)}</span>
              </div>
              <div class="cap-actions">
                <button class="primary" data-run-cap="${index}">查看流程</button>
                <button data-open-sheet="${module.key}">详情</button>
              </div>
            </article>
          `
        )
        .join("");
    }

    renderWorkflow(module);

    if (els.moduleLiveLog && !els.moduleLiveLog.children.length) {
      appendLog(`已加载模块: ${module.platformName} / ${module.section} / ${module.name}`);
      appendLog(`接入核心能力: ${module.capabilities.length} 项`);
      appendLog(`当前场景: ${module.scene}`);
    }
  };

  const renderMine = () => {
    const modules = sortedModules(state.platform);
    const mineModules = modules.filter((module) => module.section === "我的");

    if (els.mineGrid) {
      els.mineGrid.innerHTML = mineModules
        .map(
          (module) => `
            <button class="mine-item" data-select-module="${module.key}">
              <strong>${escapeHtml(module.name)}</strong>
              <span>${escapeHtml(module.summary)}</span>
            </button>
          `
        )
        .join("");
    }

    if (els.mineTips) {
      const current = getModule(state.moduleKey);
      const tips = [
        "在顶部搜索框输入关键词可直接跳转目标功能。",
        "在星云页点击 AI 窗口可快速进入项目详情。",
        current ? `当前建议优先进入：${current.name} 的「${current.capabilities[0]?.title || "核心能力"}」。` : "请选择一个功能模块获取建议。"
      ];

      els.mineTips.innerHTML = tips.map((tip) => `<article class="tip-item">${escapeHtml(tip)}</article>`).join("");
    }

    renderPhotoRail();
  };

  const renderSearchResults = (query) => {
    if (!els.searchResults) return;

    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      els.searchResults.hidden = true;
      els.searchResults.innerHTML = "";
      state.searchResults = [];
      return;
    }

    const list = sortedModules(state.platform)
      .filter((item) => `${item.name} ${item.summary} ${item.section}`.toLowerCase().includes(normalized))
      .slice(0, 8);

    state.searchResults = list;

    if (!list.length) {
      els.searchResults.hidden = false;
      els.searchResults.innerHTML = `<div class="search-empty">没有匹配功能，换个关键词试试。</div>`;
      return;
    }

    els.searchResults.hidden = false;
    els.searchResults.innerHTML = list
      .map(
        (item, index) => `
          <button class="search-item" data-search-item="${item.key}">
            <div>
              <strong>${escapeHtml(item.name)}</strong>
              <span>${escapeHtml(item.platformName)} · ${escapeHtml(item.section)}</span>
            </div>
            ${index === 0 ? "<i>Enter</i>" : ""}
          </button>
        `
      )
      .join("");
  };

  const hideSearchResults = () => {
    if (!els.searchResults) return;
    els.searchResults.hidden = true;
    els.searchResults.innerHTML = "";
    state.searchResults = [];
  };

  const initLaunchScreen = () => {
    if (!els.launchScreen || state.launchDone) return;

    const phaseText = (pct) => {
      if (pct < 28) return "初始化中...";
      if (pct < 58) return "同步产区实景数据...";
      if (pct < 82) return "加载交易与风控链路...";
      return "准备完成，即将进入系统...";
    };

    const duration = 2200;
    const start = performance.now();

    const frame = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const pct = Math.round(eased * 100);

      if (els.launchProgressBar) {
        els.launchProgressBar.style.width = `${pct}%`;
      }
      if (els.launchProgressText) {
        els.launchProgressText.textContent = `${pct}%`;
      }
      if (els.launchPhase) {
        els.launchPhase.textContent = phaseText(pct);
      }

      if (progress < 1) {
        requestAnimationFrame(frame);
        return;
      }

      els.launchScreen.classList.add("is-hidden");
      setTimeout(() => {
        if (els.launchScreen) {
          els.launchScreen.hidden = true;
        }
      }, 540);
      state.launchDone = true;
    };

    requestAnimationFrame(frame);
  };

  const renderSheetPanel = (module) => {
    const cap = module.capabilities[state.sheetCapIndex] || module.capabilities[0];
    if (!cap) return;

    if (els.sheetKpis) {
      els.sheetKpis.innerHTML = module.kpis
        .slice(0, 3)
        .map(
          (kpi) => `
            <article class="sheet-kpi-item">
              <strong>${escapeHtml(kpi.value)}</strong>
              <span>${escapeHtml(kpi.label)}</span>
              <em>${escapeHtml(kpi.trend)}</em>
            </article>
          `
        )
        .join("");
    }

    if (els.sheetMenuList) {
      els.sheetMenuList.innerHTML = module.capabilities
        .map(
          (item, index) => `
            <button class="sheet-menu-item ${index === state.sheetCapIndex ? "is-active" : ""}" type="button" data-sheet-cap-index="${index}">
              <strong>${escapeHtml(item.title)}</strong>
              <span>${escapeHtml(item.detail)}</span>
              <em>输入 ${item.input.length} 项 · 输出 ${item.output.length} 项</em>
            </button>
          `
        )
        .join("");
    }

    if (els.sheetSimCard) {
      els.sheetSimCard.innerHTML = `
        <div class="sheet-sim-head">
          <strong>${escapeHtml(cap.title)}</strong>
          <span>${escapeHtml(cap.detail)}</span>
        </div>
        <div class="sheet-sim-grid">
          <section>
            <h5>输入参数</h5>
            <ul>${cap.input.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul>
          </section>
          <section>
            <h5>输出结果</h5>
            <ul>${cap.output.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul>
          </section>
        </div>
        <p class="sheet-risk">风控规则：${escapeHtml(cap.risk)}</p>
      `;
    }
  };

  const runSheetSimulation = () => {
    const module = getModule(state.moduleKey);
    if (!module || !els.sheetLog) return;
    const cap = module.capabilities[state.sheetCapIndex] || module.capabilities[0];
    if (!cap) return;

    clearSheetTimers();
    els.sheetLog.innerHTML = "";

    cap.logs.forEach((line, index) => {
      const timer = setTimeout(() => {
        const row = document.createElement("div");
        row.className = "sheet-log-line";
        row.innerHTML = `
          <span>${escapeHtml(nowTime())}</span>
          <i></i>
          <strong>${escapeHtml(line)}</strong>
        `;
        els.sheetLog.prepend(row);
      }, index * 220 + 90);
      state.sheetTimers.push(timer);
    });

    appendLog(`已查看能力详情: ${module.name} / ${cap.title}`);
  };

  const showModuleSheet = (moduleKey) => {
    const module = getModule(moduleKey);
    if (!module || !els.sheet) return;

    state.moduleKey = module.key;
    state.sheetCapIndex = 0;

    renderHome();
    renderOrbit();
    renderModuleWorkbench();
    renderMine();

    if (els.sheetPlatform) {
      els.sheetPlatform.textContent = `${module.platformName} · ${module.section}`;
    }
    if (els.sheetTitle) {
      els.sheetTitle.textContent = `${module.name} · 功能详情`;
    }
    if (els.sheetSummary) {
      els.sheetSummary.textContent = module.summary;
    }

    if (els.sheetLog) {
      els.sheetLog.innerHTML = "";
    }

    renderSheetPanel(module);
    els.sheet.hidden = false;
  };

  const hideModuleSheet = () => {
    if (!els.sheet) return;
    els.sheet.hidden = true;
    clearSheetTimers();
  };

  const switchTab = (tab) => {
    state.tab = tab;

    if (els.phoneApp) {
      els.phoneApp.setAttribute("data-tab", tab);
      els.phoneApp.classList.remove("tab-swap");
      requestAnimationFrame(() => {
        els.phoneApp?.classList.add("tab-swap");
      });
    }

    els.views.forEach((view) => {
      view.classList.toggle("is-active", view.getAttribute("data-view") === tab);
    });

    els.tabbar?.querySelectorAll("[data-tab]").forEach((btn) => {
      btn.classList.toggle("is-active", btn.getAttribute("data-tab") === tab);
    });

    if (tab === "orbit") {
      renderOrbit();
    }

    if (tab === "market") {
      renderMarket();
    }

    if (tab === "module") {
      renderModuleWorkbench();
    }

    if (tab === "mine") {
      renderMine();
    }
  };

  const selectModule = (moduleKey, options = {}) => {
    const module = getModule(moduleKey);
    if (!module) return;

    state.moduleKey = moduleKey;
    state.workflowCursor = 0;

    renderHome();
    renderOrbit();
    renderModuleWorkbench();
    renderMine();

    if (options.openTab) {
      switchTab(options.openTab);
    }
  };

  const loadMarket = async () => {
    try {
      const res = await fetch("/api/market?range=12");
      if (!res.ok) throw new Error("market request failed");
      const payload = await res.json();
      state.market = {
        ...defaultMarketPayload,
        ...payload,
        summary: {
          ...defaultMarketPayload.summary,
          ...(payload.summary || {})
        },
        history: Array.isArray(payload.history) && payload.history.length ? payload.history : defaultMarketPayload.history
      };
    } catch (error) {
      console.warn("行情数据加载失败，使用默认降级。", error);
      state.market = { ...defaultMarketPayload };
    }

    renderMarket();
  };

  const loadRegions = async () => {
    try {
      const res = await fetch("/api/regions");
      if (!res.ok) throw new Error("regions request failed");
      const payload = await res.json();
      if (Array.isArray(payload.regions) && payload.regions.length) {
        state.regions = payload.regions.map(normalizeRegionRow);
      } else {
        state.regions = cloneRealRegionRows();
      }
    } catch (error) {
      console.warn("产区数据加载失败，使用默认降级。", error);
      state.regions = cloneRealRegionRows();
    }

    renderRegionPanels();
  };

  const initEvents = () => {
    document.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;

      const platformBtn = target.closest("[data-platform]");
      if (platformBtn) {
        const platform = platformBtn.getAttribute("data-platform");
        if (platform && platform !== state.platform) {
          state.platform = platform;
          const first = sortedModules(platform)[0];
          state.moduleKey = first ? first.key : null;
          state.feedCursor = 0;
          state.workflowCursor = 0;

          clearRunTimers();
          if (els.moduleLiveLog) {
            els.moduleLiveLog.innerHTML = "";
          }

          renderPlatformToggle();
          renderHome();
          renderOrbit();
          renderModuleWorkbench();
          renderMine();
          renderSearchResults(els.quickSearch?.value || "");
        }
        return;
      }

      const tabBtn = target.closest("[data-tab]");
      if (tabBtn) {
        const tab = tabBtn.getAttribute("data-tab");
        if (tab) switchTab(tab);
        return;
      }

      const aiOpenBtn = target.closest("[data-open-ai-module]");
      if (aiOpenBtn) {
        const key = aiOpenBtn.getAttribute("data-open-ai-module");
        if (key) {
          selectModule(key);
          showModuleSheet(key);
        }
        return;
      }

      const aiRunBtn = target.closest("[data-run-ai-module]");
      if (aiRunBtn) {
        const key = aiRunBtn.getAttribute("data-run-ai-module");
        if (key) {
          selectModule(key, { openTab: "module" });
          showModuleSheet(key);
          state.sheetCapIndex = 0;
          const module = getModule(key);
          if (module) {
            renderSheetPanel(module);
            runSheetSimulation();
          }
        }
        return;
      }

      const moduleBtn = target.closest("[data-select-module]");
      if (moduleBtn) {
        const key = moduleBtn.getAttribute("data-select-module");
        if (key) {
          selectModule(key);
          showModuleSheet(key);
        }
        return;
      }

      const searchItem = target.closest("[data-search-item]");
      if (searchItem) {
        const key = searchItem.getAttribute("data-search-item");
        if (key) {
          selectModule(key, { openTab: "module" });
          showModuleSheet(key);
          if (els.quickSearch) els.quickSearch.value = "";
          hideSearchResults();
        }
        return;
      }

      const runBtn = target.closest("[data-run-cap]");
      if (runBtn) {
        const index = Number(runBtn.getAttribute("data-run-cap") || 0);
        runCapability(index);
        return;
      }

      const sheetBtn = target.closest("[data-open-sheet]");
      if (sheetBtn) {
        const key = sheetBtn.getAttribute("data-open-sheet");
        if (key) showModuleSheet(key);
        return;
      }

      const sheetCapBtn = target.closest("[data-sheet-cap-index]");
      if (sheetCapBtn) {
        const index = Number(sheetCapBtn.getAttribute("data-sheet-cap-index") || 0);
        const module = getModule(state.moduleKey);
        if (module && module.capabilities[index]) {
          state.sheetCapIndex = index;
          renderSheetPanel(module);
        }
        return;
      }

      if (target.closest("[data-sheet-run]")) {
        runSheetSimulation();
        return;
      }

      if (target.closest("[data-sheet-next]")) {
        const module = getModule(state.moduleKey);
        if (module && module.capabilities.length) {
          state.sheetCapIndex = (state.sheetCapIndex + 1) % module.capabilities.length;
          renderSheetPanel(module);
        }
        return;
      }

      if (target.closest("[data-close-sheet]")) {
        hideModuleSheet();
        return;
      }

      if (!target.closest(".search-box") && !target.closest("#search-results")) {
        hideSearchResults();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        hideModuleSheet();
        hideSearchResults();
      }

      if (event.key === "Enter" && document.activeElement === els.quickSearch) {
        if (state.searchResults[0]) {
          selectModule(state.searchResults[0].key, { openTab: "module" });
          showModuleSheet(state.searchResults[0].key);
          if (els.quickSearch) els.quickSearch.value = "";
          hideSearchResults();
        }
      }
    });

    if (els.quickSearch) {
      els.quickSearch.addEventListener("input", () => {
        renderSearchResults(els.quickSearch.value);
      });
    }

    window.addEventListener("resize", () => {
      renderMarket();
      if (state.tab === "orbit") {
        renderOrbit();
      }
    });
  };

  const initLoops = () => {
    setStatusClock();
    setInterval(setStatusClock, 1000);
    setBrandDate();
    setInterval(setBrandDate, 60000);

    setInterval(() => {
      const feeds = homeFeeds[state.platform] || [];
      if (!feeds.length) return;
      state.feedCursor = (state.feedCursor + 1) % feeds.length;
      renderHomeFeed();
    }, 3800);

    setInterval(() => {
      const module = getModule(state.moduleKey);
      if (!module || !Array.isArray(module.workflow) || !module.workflow.length) return;
      state.workflowCursor = (state.workflowCursor + 1) % module.workflow.length;
      if (state.tab === "module") {
        renderWorkflow(module);
      }
    }, 1400);
  };

  const init = () => {
    ensureCurrentModule();
    initLaunchScreen();

    renderPlatformToggle();
    renderHome();
    renderOrbit();
    renderModuleWorkbench();
    renderMine();
    switchTab(state.tab);

    appendLog("系统已进入移动端单屏展示模式。");
    appendLog("点击任意功能卡即可切换模块并查看能力详情。");

    initEvents();
    initLoops();

    loadMarket();
    loadRegions();
  };

  init();
})();

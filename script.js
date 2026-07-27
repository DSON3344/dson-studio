// Translation dictionary database
const i18n = {
  zh: {
    "nav.services": "服务与报价",
    "nav.process": "合作流程",
    "nav.portfolio": "作品案例",
    "nav.faq": "常见问题",
    "nav.contact": "联系我",
    "nav.cta": "获取报价",
    "trust1": "报价透明，无隐藏费用",
    "trust2": "尾款结清后 7 天内交付源文件",
    "trust3": "每阶段 2 次免费修改",
    "trust4": "本地 + 全球远程协作",
    "faq.title": "常见问题",
    "faq.lead": "关于报价、流程与交付的常见疑问，点击展开查看详情。",
    "faq.q1": "报价有效期多久？",
    "faq.a1": "所有报价自发出之日起 30 天内有效，超过时效请重新联系我确认最新报价。",
    "faq.q2": "项目如何计费与开工？",
    "faq.a2": "确认服务范围与报价后，支付 50% 订金即可正式开工并签署 MSA，尾款于交付后 7 天内结清。",
    "faq.q3": "是否支持海外 / 远程客户？",
    "faq.a3": "支持。我服务马来西亚本地及全球客户，全程线上沟通与远程协作，不受地域限制。",
    "faq.q4": "修改次数超出免费额度怎么办？",
    "faq.a4": "每个项目阶段包含 2 次免费修改，超出部分按 RM 100–150 / 次收取附加修改费。",
    "faq.q5": "源文件什么时候可以拿到？",
    "faq.a5": "Figma 设计稿、项目源代码等源文件将在全款结清后统一交付。",
    "faq.q6": "如果中途想取消项目？",
    "faq.a6": "取消项目 50% 定金不予退还；若项目已完成 75% 以上，则需支付全额费用。",
    "hero.eyebrow": "创意工作室 — UI/UX · 网页 · 视频",
    "hero.title": "经得起考验<br><span class=\"grad\">的设计。</span>",
    "hero.lead": "DSON Studio 的每个项目都由负责人亲自跟进，从初稿到交付全程如一——UI/UX 设计、网页开发、视频制作，始终保持同样的用心。",
    "hero.cta1": "预约需求沟通",
    "hero.cta2": "查看服务定价",
    "hero.stat1": "核心服务",
    "hero.stat2": "阶段免费修改",
    "hero.stat3": "报价有效期",
    "services.title": "三条核心服务线，一套透明报价",
    "svc1.title": "UI/UX 设计",
    "svc1.desc": "Glassmorphism 视觉系统、交互原型、Figma 设计交付，兼顾美感与商业转化。",
    "svc2.title": "网页开发",
    "svc2.desc": "React / Webflow / HTML-CSS-JS 技术栈，含 3D 交互、动效与 CMS 集成。",
    "svc3.title": "视频后期制作",
    "svc3.desc": "品牌宣传片、社媒短视频剪辑与调色，交付适配多平台的成片规格。",
    "tier.starter": "入门 Starter",
    "tier.business": "商务 Business",
    "tier.premium": "高级 Premium",
    "tier.mostValue": "最受欢迎",
    "tabs.uiux": "UI/UX 设计", "tabs.web": "网页开发", "tabs.video": "视频后期制作",
    "services.lead": "入门、商务、高级三档定价，覆盖页面规模、技术栈与交付物的具体差异，帮助您快速匹配预算与需求。",
    "feat.pages": "页面数", "feat.design": "视觉设计", "feat.stack": "技术栈", "feat.scope": "响应式范围",
    "feat.revisions": "修改次数", "feat.deliver": "交付物", "feat.deploy": "部署方式",
    "feat.duration": "时长", "feat.editing": "剪辑内容", "feat.format": "成片格式",
    "feat.scopeSingle": "桌面 或 移动端", "feat.scopeBoth": "桌面 & 移动端", "feat.scopeMulti": "多设备优化",
    "feat.rev1": "1 次免费修改", "feat.rev2": "2 次免费修改", "feat.rev3": "3 次修改 + 优先处理",
    "feat.upTo5": "最多 5 页", "feat.upTo10": "最多 10 页",
    "addon.label": "附加项：",
    "svc1.tagline": "打造直观体验，赋能数字化成功。",
    "svc1.t1.desc": "适合单页展示，交付简洁现代的轻量视觉升级。", "svc1.t1.pages": "1–2 页", "svc1.t1.design": "简洁 UI 样式", "svc1.t1.deliver": "PNG/JPG 及素材",
    "svc1.t2.desc": "面向核心用户流程，兼容双端适配与自定义 UI 系统。", "svc1.t2.design": "UI 系统与玻璃拟态", "svc1.t2.deliver": "完整 Figma 源文件",
    "svc1.t3.desc": "深度定制体验，含高级 UI 套件与高保真原型。", "svc1.t3.design": "高级 UI 套件与原型", "svc1.t3.deliver": "Figma + 开发交接文件",
    "svc1.addon1": "额外页面 RM 250 / 页", "svc1.addon2": "加入交互原型 +20% 套餐价格", "svc1.addon3": "加购修改轮次 RM 100 / 轮",
    "svc2.tagline": "将愿景设计转化为高性能的数字现实。",
    "svc2.t1.desc": "适合简单落地页或个人作品集，代码简洁、加载迅速。", "svc2.t1.stack": "HTML/CSS/JS 或 Framer", "svc2.t1.deploy": "Vercel / GitHub Pages",
    "svc2.t2.desc": "面向成长型品牌，全响应式开发，含动态内容与动效。", "svc2.t2.stack": "Webflow 或 React 生态", "svc2.t2.deploy": "域名与主机配置",
    "svc2.t3.desc": "终极数字平台，复杂交互、CMS 集成与顶级性能优化。", "svc2.t3.stack": "高级逻辑与 CMS 配置", "svc2.t3.deploy": "完整云端部署",
    "svc2.addon1": "额外页面 RM 350 / 页", "svc2.addon2": "CMS / 数据库搭建 +20% 套餐价格", "svc2.addon3": "加购修改轮次 RM 150 / 轮", "svc2.addon4": "域名与主机费用另计",
    "svc3.tagline": "打造动态视觉，放大你的数字叙事。",
    "svc3.t1.desc": "适合社媒增长，节奏明快、高留存的短视频内容。", "svc3.t1.duration": "最长 60 秒", "svc3.t1.editing": "快节奏剪辑与字幕", "svc3.t1.format": "9:16 竖版（Reels/TikTok）", "svc3.t1.deliver": "1080p MP4 文件",
    "svc3.t2.desc": "面向品牌叙事，专业级 Vlog 或企业宣传片，精致调色。", "svc3.t2.duration": "最长 5 分钟", "svc3.t2.editing": "调色与混音", "svc3.t2.format": "16:9 + 1 条竖版预告", "svc3.t2.deliver": "4K MP4 + 源文件",
    "svc3.t3.desc": "顶级电影质感体验，高端动效与 VFX 加持的营销大片。", "svc3.t3.duration": "最长 10 分钟", "svc3.t3.editing": "高级 VFX 与动画", "svc3.t3.format": "多平台优化格式", "svc3.t3.deliver": "母版文件及全部素材",
    "svc3.addon1": "额外每分钟 RM 150", "svc3.addon2": "素材采购 +20% 套餐价格", "svc3.addon3": "加购修改轮次 RM 100 / 轮", "svc3.addon4": "原始素材须由客户提供",
    "services.note": "所有价格均为马来西亚令吉（RM）· 具体时间线将在项目沟通后确认 · 需支付 50% 订金以启动项目 · 报价有效期 30 天",
    "process.title": "从沟通到交付，四个明确阶段",
    "process.lead": "每一步都对应真实的时间线与交付成果；若客户失联超过 10 个工作日，项目将转为休眠（Dormant）状态。",
    "p1.title": "需求梳理",
    "p1.desc": "整理项目范围、预算与时间线，确认服务档位。",
    "p2.title": "确认定金",
    "p2.desc": "50% 订金到账后正式开工，签署 MSA。",
    "p3.title": "设计与开发",
    "p3.desc": "每阶段最多 2 次免费修改，逐步推进交付。",
    "p4.title": "结清交付",
    "p4.desc": "尾款 7 天内结清后，交付 Figma / 源代码等全部源文件。",
    "folio.title": "案例研究",
    "folio.lead": "正式上线前持续填充中，以下为核心案例占位，待素材到位后替换实拍图与数据。",
    "case1.desc": "为 AI 产品打造的玻璃拟态界面系统与官网，强调数据可信度与未来感。",
    "case2.desc": "赛事品牌视频后期与社媒剪辑，塑造电竞联赛的视觉张力与节奏感。",
    "case.viewBtn": "查看案例详情",
    "modal.tag": "毕业设计项目 · 网页应用",
    "modal.subtitle": "智能设计评估平台",
    "modal.roleLbl": "角色", "modal.roleVal": "独立设计师与全栈开发者",
    "modal.timelineLbl": "项目周期", "modal.timelineVal": "13 周（2026 年 1 月–4 月）",
    "modal.liveLbl": "线上网站",
    "modal.problemTitle": "问题所在",
    "modal.problemP1": "学术环境里的设计反馈机制一直存在问题。学生提交了自己最好的作品，等上好几天才收到评语，结果往往只是一句模糊的“构图感觉不太对”。两位讲师给出两种完全不同的评价——没有统一标准，没有一致性，也没有参照基准。",
    "modal.problemP2": "这直接影响了学业成绩：一项针对 68 名参与者的调查显示，<strong>53% 的人表示不一致的评分标准对他们的学业表现造成了负面影响</strong>，另有 <strong>26.5% 强烈认同</strong>需要一套标准化、客观的评估工具。",
    "modal.conceptTitle": "核心理念",
    "modal.conceptP1": "VisionLogic AI 是一个基于网页的智能设计审查平台——设计师上传作品后，即可获得即时、结构化、由 AI 生成的反馈，并按六项专业指标评分。核心目标：用一致的、数据驱动的评估框架取代主观的人工点评，同时确保任何水平的学生都能直观上手。",
    "modal.conceptQuote": "上传。分析。进步。",
    "modal.processTitle": "设计流程",
    "modal.processP1": "<strong>研究与问题定义</strong> — 文献综述确认了马来西亚目前缺少本地化的标准化设计评估工具；PESTLE 分析也验证了该平台与马来西亚国家 AI 路线图及 MyDIGITAL 第三阶段（2026–2030）议程的契合度。每一项设计与开发决策，都以技术接受模型（TAM：感知有用性 + 易用性）为依据。",
    "modal.processP2": "<strong>从线框图到高保真原型</strong> — 从低保真概念草图和用户流程图，逐步推进到在 Figma 中完成的完整高保真原型。界面采用暗色系为主的视觉风格，以青色（#40CFC4）作为点缀色，并设计了双模式侧边栏（访客模式 / 用户模式）。",
    "modal.processList": "<li>登录首页 — 含动态 CTA 与交互式引导教程的主视觉区块</li><li>分析仪表盘 — 文件上传区、类别与语气选择器、实时 AI 结果面板（雷达图）</li><li>历史记录页 — 可筛选的历史评估记录，支持导出</li><li>账户与设置 — 个人资料管理、语言偏好（中/英/马来语）、法律条款</li>",
    "modal.aiTitle": "AI 评估引擎",
    "modal.aiP1": "核心智能由 Gemini AI（Flash 模型）驱动，通过 Google AI Studio API 调用，并由一套自定义的提示词工程框架来控制 AI 的评估行为：设定“专业设计总监”人格、视觉数据与用户上下文按 90/10 加权、输出结构化 JSON 数据，最终渲染为雷达图与两页报告——支持英文、中文、马来文三种语言输出。",
    "modal.aiP2": "每个设计都会依据所属类别，在六项专业指标上评分——UI/UX 类别（可用性、层级结构、一致性、无障碍设计、间距、流程），平面设计类别（版式、字体排印、色彩和谐度、视觉层级、视觉冲击力、留白），摄影类别（曝光、色调氛围、质感、构图平衡、对比度、细节）。",
    "modal.archTitle": "技术架构",
    "modal.archP1": "整个系统基于 Node.js + Express 构建——之所以在开发中途放弃 React，是为了更可靠地在服务端管理 Gemini API 密钥。MongoDB 负责用户认证、会话管理与评估历史记录存储，并遵循 PDPA 2010 个人数据保护法合规要求；相较 GitHub Pages，选择 Vercel 是因为它支持 Node.js 运行环境。",
    "modal.archList": "<li>Multer — 处理设计图片上传的中间件</li><li>Bcrypt + Express-Session — 密码加密与会话管理</li><li>Nodemailer — 用于 OTP 验证的邮件发送服务</li><li>Puppeteer — 自动生成 PDF 报告</li>",
    "modal.challengesTitle": "挑战与解决方案",
    "modal.challengeP1": "<strong>开发中途从 React 转向</strong> — 客户端渲染无法安全地管理 Gemini API 密钥，因此前端被重新用原生 HTML/CSS/JS 搭配 Express 后端重写。这个决定耗费了不少时间，但方向是对的。",
    "modal.challengeP2": "<strong>Gemini 提示词调校</strong> — 早期的评估结果并不稳定，直到建立了一套结构化的提示词系统，固定人格设定并强制输出 JSON 格式，才让 AI 的表现真正像一位专业设计总监，而不是一个泛用型聊天机器人。",
    "modal.challengeP3": "<strong>托管平台限制</strong> — GitHub Pages 不支持 Node.js 运行，因此选择了 Vercel，它提供了必要的运行环境以及安全的环境变量管理。",
    "modal.challengeP4": "<strong>13 周的紧凑周期</strong> — 项目于 2026 年 4 月 26 日交付，期间同步完成了研究、Figma 设计、全栈开发、用户测试、云端部署与毕业论文提交。",
    "modal.resultsTitle": "成果与验证",
    "modal.stat1Lbl": "参与调查人数",
    "modal.stat2Lbl": "认为间距/网格检测达到 4/5 评分",
    "modal.stat3Lbl": "认可导师不在时的辅助价值",
    "modal.stat4Lbl": "GPA 曾受评分不一致影响",
    "modal.ctaBtn": "访问线上网站",
    "modal.footerNote": "由 Chang Dick Shen 设计与开发 · DSON Studio<br>创意多媒体（荣誉）学士学位 · 拉曼大学学院（TAR UMT）· 2026",
    "ctaStrip.title": "准备好开始一个经得起考验的项目了吗？",
    "ctaStrip.lead": "预约一次免费的需求沟通，我将在 1 个工作日内回复报价与时间线。",
    "ctaStrip.cta": "立即联系 DSON Studio",
    "contact.title": "告诉我您的项目",
    "contact.lead": "填写下方表单，或直接通过邮箱 / 官网联系负责人 Chang Dick Shen。",
    "contact.owner": "负责人",
    "contact.email": "邮箱",
    "contact.whatsapp": "WhatsApp",
    "contact.site": "官网",
    "contact.region": "服务地区",
    "contact.regionVal": "Kuala Lumpur, Malaysia · 全球远程协作",
    "form.name": "姓名",
    "form.namePh": "您的姓名",
    "form.email": "邮箱",
    "form.service": "感兴趣的服务",
    "form.opt1": "UI/UX 设计",
    "form.opt2": "网页开发",
    "form.opt3": "视频后期制作",
    "form.opt4": "多项服务组合",
    "form.msg": "项目描述",
    "form.msgPh": "简单描述您的项目需求、预算范围与期望时间线",
    "form.submit": "发送需求",
    "form.submitted": "已收到，我将在 1 个工作日内回复。",
    "form.error": "发送失败，请直接通过邮箱或 WhatsApp 联系我。",
    "form.privacy": "提交表单即代表您同意 DSON Studio 使用以上信息与您联系，讨论您的项目需求。",
    "footer.tagline": "经得起考验<span class=\"grad\">的设计。</span>",
    "footer.navTitle": "导航",
    "footer.socialTitle": "社交媒体",
    "footer.contactTitle": "联系方式",
    "footer.comingSoon": "即将上线",
    "footer.getQuote": "预约需求沟通 →",
    "footer.rights": "保留所有权利。",
    "footer.locationTag": "吉隆坡，马来西亚",
    "theme.toggleToLight": "切换到浅色主题",
    "theme.toggleToDark": "切换到深色主题"
  },
  en: {
    "nav.services": "Services",
    "nav.process": "Process",
    "nav.portfolio": "Work",
    "nav.faq": "FAQ",
    "nav.contact": "Contact",
    "nav.cta": "Get a Quote",
    "trust1": "Transparent pricing, no hidden fees",
    "trust2": "Source files within 7 days of final payment",
    "trust3": "2 free revisions per stage",
    "trust4": "Local + global remote collaboration",
    "faq.title": "Frequently asked questions",
    "faq.lead": "Common questions about pricing, process and delivery — tap to expand.",
    "faq.q1": "How long is a quote valid?",
    "faq.a1": "All quotes are valid for 30 days from the date issued. Reach out again for an updated quote after that.",
    "faq.q2": "How does billing and project kickoff work?",
    "faq.a2": "Once scope and pricing are confirmed, work begins after a 50% deposit and signed MSA. The balance is due within 7 days of delivery.",
    "faq.q3": "Do you work with overseas / remote clients?",
    "faq.a3": "Yes — I work with clients across Malaysia and globally, fully remote from brief to handover.",
    "faq.q4": "What happens if I need more revisions than included?",
    "faq.a4": "Each stage includes 2 free revisions. Additional rounds are billed at RM 100–150 each.",
    "faq.q5": "When do I receive the source files?",
    "faq.a5": "Figma files and source code are handed over once the final balance is fully settled.",
    "faq.q6": "What if I need to cancel mid-project?",
    "faq.a6": "The 50% deposit is non-refundable on cancellation. If the project is over 75% complete, full payment is due.",
    "hero.eyebrow": "CREATIVE STUDIO — UI/UX · WEB · VIDEO",
    "hero.title": "Design that<br><span class=\"grad\">holds up.</span>",
    "hero.lead": "Every project at DSON Studio is handled directly, from first draft to final delivery — UI/UX, web development, and video, built with the same care throughout.",
    "hero.cta1": "Book a discovery call",
    "hero.cta2": "See pricing",
    "hero.stat1": "CORE SERVICES",
    "hero.stat2": "FREE REVISIONS / STAGE",
    "hero.stat3": "QUOTE VALIDITY",
    "services.title": "Three core services, one transparent price sheet",
    "svc1.title": "UI/UX Design",
    "svc1.desc": "Glassmorphism visual systems, interactive prototypes and Figma handoff, balancing beauty with conversion.",
    "svc2.title": "Web Development",
    "svc2.desc": "React / Webflow / HTML-CSS-JS stack, including 3D interaction, motion and CMS integration.",
    "svc3.title": "Video Post-Production",
    "svc3.desc": "Brand films and social edits with color grading, delivered ready for every platform.",
    "tier.starter": "Starter",
    "tier.business": "Business",
    "tier.premium": "Premium",
    "tier.mostValue": "Most Value",
    "tabs.uiux": "UI/UX Design", "tabs.web": "Web Development", "tabs.video": "Video Post-Production",
    "services.lead": "Starter, Business and Premium tiers, each mapped to page count, tech stack and deliverables — so you can match budget to scope at a glance.",
    "feat.pages": "Pages", "feat.design": "Visual Design", "feat.stack": "Tech Stack", "feat.scope": "Responsive Scope",
    "feat.revisions": "Revisions", "feat.deliver": "Deliverables", "feat.deploy": "Deployment",
    "feat.duration": "Duration", "feat.editing": "Editing", "feat.format": "Format",
    "feat.scopeSingle": "Desktop OR Mobile", "feat.scopeBoth": "Desktop & Mobile", "feat.scopeMulti": "Multi-Device Optimized",
    "feat.rev1": "1 Free Revision", "feat.rev2": "2 Free Revisions", "feat.rev3": "3 Revisions + Priority",
    "feat.upTo5": "Up to 5 pages", "feat.upTo10": "Up to 10 pages",
    "addon.label": "Add-ons:",
    "svc1.tagline": "Crafting intuitive experiences. Empowering digital success.",
    "svc1.t1.desc": "Perfect for single-page showcases. A clean, modern, lightweight visual upgrade.", "svc1.t1.pages": "1–2 pages", "svc1.t1.design": "Clean UI Styling", "svc1.t1.deliver": "PNG/JPG & Assets",
    "svc1.t2.desc": "Built for core user flows. Includes dual-platform responsiveness and custom UI systems.", "svc1.t2.design": "UI System & Glassmorphism", "svc1.t2.deliver": "Full Figma Source File",
    "svc1.t3.desc": "The ultimate digital experience. Deep customization, advanced UI kits, and high-fidelity prototypes.", "svc1.t3.design": "Advanced UI Kit & Prototyping", "svc1.t3.deliver": "Figma + Dev Handoff",
    "svc1.addon1": "Additional Pages RM 250 / page", "svc1.addon2": "Add Interactive Prototyping +20% of package price", "svc1.addon3": "Add Revision Rounds RM 100 / round",
    "svc2.tagline": "Turning visionary designs into high-performance digital realities.",
    "svc2.t1.desc": "Perfect for simple landing pages or personal portfolios. Clean code and fast loading.", "svc2.t1.stack": "HTML/CSS/JS or Framer", "svc2.t1.deploy": "Vercel / GitHub Pages",
    "svc2.t2.desc": "Built for growing brands. Fully responsive visual development with dynamic content and animations.", "svc2.t2.stack": "Webflow or React ecosystem", "svc2.t2.deploy": "Domain & Hosting Setup",
    "svc2.t3.desc": "The ultimate digital platform. Complex interactions, CMS integration and top-tier performance optimization.", "svc2.t3.stack": "Advanced Logic & CMS setup", "svc2.t3.deploy": "Full Cloud Deployment",
    "svc2.addon1": "Additional Pages RM 350 / page", "svc2.addon2": "CMS / Database Setup +20% of package price", "svc2.addon3": "Add Revision Rounds RM 150 / round", "svc2.addon4": "Domain & hosting fees billed separately",
    "svc3.tagline": "Crafting dynamic visuals. Amplifying your digital narrative.",
    "svc3.t1.desc": "Perfect for social media growth. Fast-paced, high-retention short-form content.", "svc3.t1.duration": "Up to 60 seconds", "svc3.t1.editing": "Fast Cuts & Captions", "svc3.t1.format": "9:16 Vertical (Reels/TikTok)", "svc3.t1.deliver": "1080p MP4 File",
    "svc3.t2.desc": "Built for brand storytelling. Professional YouTube vlogs or corporate promos with cinematic polishing.", "svc3.t2.duration": "Up to 5 minutes", "svc3.t2.editing": "Color Grading & Audio Mix", "svc3.t2.format": "16:9 + 1 Vertical Teaser", "svc3.t2.deliver": "4K MP4 + Source File",
    "svc3.t3.desc": "The ultimate cinematic experience. High-end campaign videos featuring advanced motion graphics and VFX.", "svc3.t3.duration": "Up to 10 minutes", "svc3.t3.editing": "Advanced VFX & Animation", "svc3.t3.format": "Multi-Platform Optimized", "svc3.t3.deliver": "Master Files & All Assets",
    "svc3.addon1": "Additional Minute RM 150 / min", "svc3.addon2": "Stock Footage Sourcing +20% of package price", "svc3.addon3": "Add Revision Rounds RM 100 / round", "svc3.addon4": "Raw footage must be provided by client",
    "services.note": "All prices are in Malaysian Ringgit (RM) · Timeline confirmed after project discussion · 50% upfront payment required to commence project · Quotation valid for 30 days",
    "process.title": "From brief to handover, four clear stages",
    "process.lead": "Every step maps to a real timeline and deliverable. Projects go Dormant after 10 working days of client silence.",
    "p1.title": "Brief",
    "p1.desc": "Scope, budget and timeline confirmed, service tier selected.",
    "p2.title": "Deposit",
    "p2.desc": "Work begins once the 50% deposit lands and the MSA is signed.",
    "p3.title": "Design & build",
    "p3.desc": "Up to 2 free revisions per stage as I move through delivery.",
    "p4.title": "Handover",
    "p4.desc": "Figma and source files delivered once the balance is settled within 7 days.",
    "folio.title": "Case studies",
    "folio.lead": "Being filled in ahead of launch — placeholders below, swapped for real shots and metrics soon.",
    "case1.desc": "A glassmorphic interface system and site for an AI product, built for credibility and a sense of the future.",
    "case2.desc": "Brand video post-production and social edits giving an esports league its visual edge and pacing.",
    "case.viewBtn": "View case study",
    "modal.tag": "FINAL YEAR PROJECT · WEB APPLICATION",
    "modal.subtitle": "Intelligent Design Evaluation Platform",
    "modal.roleLbl": "Role", "modal.roleVal": "Solo Designer & Full-Stack Developer",
    "modal.timelineLbl": "Timeline", "modal.timelineVal": "13 Weeks (Jan–Apr 2026)",
    "modal.liveLbl": "Live Site",
    "modal.problemTitle": "The Problem",
    "modal.problemP1": "Design feedback in academic settings has always been broken. A student submits their best work, waits days for a review, and gets back something vague — \u201cthe composition feels off.\u201d Two lecturers, two different verdicts. No rubric, no consistency, no benchmark.",
    "modal.problemP2": "This directly impacts GPA: a survey of 68 participants found <strong>53% reported that inconsistent grading had negatively affected their academic performance</strong>, and <strong>26.5% strongly agreed</strong> a standardized, objective evaluation tool was needed.",
    "modal.conceptTitle": "The Concept",
    "modal.conceptP1": "VisionLogic AI is a web-based intelligent design auditor — designers upload their work and receive instant, structured, AI-powered feedback scored across six professional metrics. The goal: replace subjective human critique with a consistent, data-driven framework, without sacrificing an experience that's intuitive for students at any skill level.",
    "modal.conceptQuote": "Upload. Analyze. Improve.",
    "modal.processTitle": "Design Process",
    "modal.processP1": "<strong>Research &amp; problem definition</strong> — a literature review confirmed no local tool existed for standardized design evaluation in Malaysia; a PESTLE analysis aligned the platform with Malaysia's National AI Roadmap and MyDIGITAL Phase 3 (2026–2030). Every decision was filtered through the Technology Acceptance Model (perceived usefulness + ease of use).",
    "modal.processP2": "<strong>Wireframe to high-fidelity</strong> — from low-fidelity sketches and user-flow diagrams to a complete high-fidelity prototype in Figma, anchored in a dark-first aesthetic with cyan (#40CFC4) accents and a dual-mode sidebar (Guest / User).",
    "modal.processList": "<li>Landing page — hero with animated CTA and interactive guide</li><li>Analyze dashboard — upload zone, category/tone selector, live Radar Chart</li><li>History page — filterable evaluation log with export</li><li>Account &amp; settings — profile, language (EN/CN/MY), legal terms</li>",
    "modal.aiTitle": "The AI Evaluation Engine",
    "modal.aiP1": "Powered by Gemini AI (Flash model) via Google AI Studio, governed by a custom prompt-engineering framework: a Professional Design Director persona, 90/10 visual-to-context weighting, structured JSON output rendered as a Radar Chart plus a 2-page report — in English, Chinese, or Malay.",
    "modal.aiP2": "Each design is scored across six metrics tailored to its category — UI/UX (Usability, Hierarchy, Consistency, Accessibility, Spacing, Flow), Graphic Design (Layout, Typography, Color Harmony, Visual Hierarchy, Impact, Whitespace), or Photography (Exposure, Color Mood, Texture, Balance, Contrast, Detail).",
    "modal.archTitle": "Technical Architecture",
    "modal.archP1": "Built on Node.js + Express — chosen over React mid-development for reliable server-side Gemini API key management. MongoDB handles auth, sessions, and evaluation history under PDPA 2010 compliance; Vercel was selected over GitHub Pages for Node.js runtime support.",
    "modal.archList": "<li>Multer — design image upload handling</li><li>Bcrypt + Express-Session — password hashing &amp; session management</li><li>Nodemailer — OTP authentication emails</li><li>Puppeteer — automated PDF report generation</li>",
    "modal.challengesTitle": "Challenges & Solutions",
    "modal.challengeP1": "<strong>React pivot mid-development</strong> — client-side rendering couldn't securely manage the Gemini API key, so the frontend was rebuilt in vanilla HTML/CSS/JS on an Express backend. Costly in time, correct in direction.",
    "modal.challengeP2": "<strong>Gemini prompt calibration</strong> — early evaluations were inconsistent until a structured prompt system with fixed personas and enforced JSON output made the AI behave like a design director, not a generalist chatbot.",
    "modal.challengeP3": "<strong>Hosting limitations</strong> — GitHub Pages doesn't support Node.js execution, so Vercel was chosen for its runtime and secure environment variables.",
    "modal.challengeP4": "<strong>13-week deadline</strong> — delivered April 26, 2026, covering research, design, full-stack development, testing, deployment, and thesis submission in parallel.",
    "modal.resultsTitle": "Results & Validation",
    "modal.stat1Lbl": "survey participants",
    "modal.stat2Lbl": "rated spacing/grid detection 4/5",
    "modal.stat3Lbl": "valued it when a mentor's unavailable",
    "modal.stat4Lbl": "had GPA affected by inconsistent grading",
    "modal.ctaBtn": "Visit live site",
    "modal.footerNote": "Designed &amp; developed by Chang Dick Shen · DSON Studio<br>Bachelor of Creative Multimedia (Honours), TAR UMT · 2026",
    "ctaStrip.title": "Ready to start a project that holds up?",
    "ctaStrip.lead": "Book a free discovery call — I'll reply with pricing and a timeline within 1 business day.",
    "ctaStrip.cta": "Talk to DSON Studio",
    "contact.title": "Tell me about your project",
    "contact.lead": "Fill out the form, or reach founder Chang Dick Shen directly by email or site.",
    "contact.owner": "Founder",
    "contact.email": "Email",
    "contact.whatsapp": "WhatsApp",
    "contact.site": "Website",
    "contact.region": "Service area",
    "contact.regionVal": "Kuala Lumpur, Malaysia · Remote worldwide",
    "form.name": "Name",
    "form.namePh": "Your name",
    "form.email": "Email",
    "form.service": "Service of interest",
    "form.opt1": "UI/UX Design",
    "form.opt2": "Web Development",
    "form.opt3": "Video Post-Production",
    "form.opt4": "Combined services",
    "form.msg": "Project description",
    "form.msgPh": "Briefly describe your project, budget range and expected timeline",
    "form.submit": "Send request",
    "form.submitted": "Got it — I'll reply within 1 business day.",
    "form.error": "Something went wrong — please reach out directly by email or WhatsApp.",
    "form.privacy": "By submitting this form, you agree that DSON Studio may use the information above to contact you about your project.",
    "footer.tagline": "Design that<span class=\"grad\"> holds up.</span>",
    "footer.navTitle": "Navigation",
    "footer.socialTitle": "Social",
    "footer.contactTitle": "Get in Touch",
    "footer.comingSoon": "Coming soon",
    "footer.getQuote": "Book a discovery call →",
    "footer.rights": "All rights reserved.",
    "footer.locationTag": "Kuala Lumpur, Malaysia",
    "theme.toggleToLight": "Switch to light theme",
    "theme.toggleToDark": "Switch to dark theme"
  }
};

let currentLang = 'en';

// Function to apply translation updates dynamically
function applyLang(lang) {
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';

  // Update text content
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (i18n[lang][key] !== undefined) {
      el.textContent = i18n[lang][key];
    }
  });

  // Update HTML elements (with formatting like <br> or <span>)
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    if (i18n[lang][key] !== undefined) {
      el.innerHTML = i18n[lang][key];
    }
  });

  // Update form placeholders
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.getAttribute('data-i18n-ph');
    if (i18n[lang][key] !== undefined) {
      el.placeholder = i18n[lang][key];
    }
  });

  // Update language switch button active state
  const switcher = document.getElementById('langSwitch');
  if (switcher) {
    switcher.classList.remove('zh', 'en');
    switcher.classList.add(lang);
  }

  updateThemeToggleLabel(lang);
}

function getCurrentTheme() {
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}

function updateThemeToggleLabel(lang) {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  const theme = getCurrentTheme();
  const key = theme === 'light' ? 'theme.toggleToDark' : 'theme.toggleToLight';
  const label = i18n[lang] && i18n[lang][key];
  if (label) btn.setAttribute('aria-label', label);
}

function applyTheme(theme) {
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  try { localStorage.setItem('dson-theme', theme); } catch (e) {}

  const meta = document.getElementById('themeColorMeta');
  if (meta) meta.setAttribute('content', theme === 'light' ? '#F5F1EA' : '#0A0D12');

  updateThemeToggleLabel(currentLang);
}

document.addEventListener('DOMContentLoaded', () => {
  // Auto-update copyright year
  const yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  applyLang(currentLang);

  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    updateThemeToggleLabel(currentLang);
    themeToggle.addEventListener('click', () => {
      applyTheme(getCurrentTheme() === 'light' ? 'dark' : 'light');
    });
  }

  const langSwitch = document.getElementById('langSwitch');
  if (langSwitch) {
    langSwitch.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      const targetLang = btn ? btn.dataset.lang : (currentLang === 'zh' ? 'en' : 'zh');
      if (targetLang === currentLang) return;
      currentLang = targetLang;
      applyLang(currentLang);
    });
  }

  // Service category tabs
  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      tabButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      document.querySelectorAll('.service-panel').forEach(panel => {
        panel.classList.toggle('active', panel.id === targetId);
      });
    });
  });

  // Handle contact form submission
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const form = this;
      const successMsg = form.querySelector('.submitted');
      const errorMsg = form.querySelector('.form-error');
      const submitBtn = form.querySelector('button[type="submit"]');
      const btnLabel = submitBtn ? submitBtn.querySelector('.btn-label') : null;

      if (successMsg) successMsg.style.display = 'none';
      if (errorMsg) errorMsg.style.display = 'none';
      if (submitBtn) submitBtn.disabled = true;
      const originalLabel = btnLabel ? btnLabel.textContent : null;
      if (btnLabel) btnLabel.textContent = currentLang === 'zh' ? '发送中…' : 'Sending…';

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      })
        .then(response => {
          if (response.ok) {
            form.reset();
            if (successMsg) successMsg.style.display = 'block';
          } else {
            if (errorMsg) errorMsg.style.display = 'block';
          }
        })
        .catch(() => {
          if (errorMsg) errorMsg.style.display = 'block';
        })
        .finally(() => {
          if (submitBtn) submitBtn.disabled = false;
          if (btnLabel && originalLabel) btnLabel.textContent = originalLabel;
        });
    });
  }

  // Scroll progress bar
  const progressBar = document.getElementById('scrollProgress');
  const backToTop = document.getElementById('backToTop');
  function onScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + '%';
    if (backToTop) backToTop.classList.toggle('visible', scrollTop > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Active nav link highlighting
  const navLinks = document.querySelectorAll('.navlinks a[href^="#"]');
  const sections = Array.from(navLinks)
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => link.classList.remove('active'));
          const activeLink = document.querySelector(`.navlinks a[href="#${entry.target.id}"]`);
          if (activeLink) activeLink.classList.add('active');
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });
    sections.forEach(sec => navObserver.observe(sec));
  }

  // Scroll reveal animation
  const revealTargets = document.querySelectorAll(
    '.section-head, .glass-card, .process-step, .case-card, .cta-strip, .faq-item, .trust-bar'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealTargets.forEach(el => revealObserver.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('in-view'));
  }

  // Scale embedded website previews so they always render desktop layout
  function scaleBrowserFrames() {
    document.querySelectorAll('.browser-frame-wrap').forEach(wrap => {
      const iframe = wrap.querySelector('.browser-frame');
      if (!iframe) return;
      const wrapWidth = wrap.clientWidth;
      const nativeWidth = 1440;
      const scale = wrapWidth / nativeWidth;
      iframe.style.transform = `scale(${scale})`;
    });
  }
  scaleBrowserFrames();
  window.addEventListener('resize', scaleBrowserFrames);

  // Case study modal
  const caseModalOverlay = document.getElementById('caseModalOverlay');
  const caseModalClose = document.getElementById('caseModalClose');
  const openVisionLogicBtn = document.getElementById('openVisionLogicCase');

  function openCaseModal() {
    caseModalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeCaseModal() {
    caseModalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
  if (openVisionLogicBtn) openVisionLogicBtn.addEventListener('click', openCaseModal);
  if (caseModalClose) caseModalClose.addEventListener('click', closeCaseModal);
  if (caseModalOverlay) {
    caseModalOverlay.addEventListener('click', (e) => {
      if (e.target === caseModalOverlay) closeCaseModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && caseModalOverlay && caseModalOverlay.classList.contains('active')) {
      closeCaseModal();
    }
  });
});
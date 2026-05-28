// Comprehension quizzes for the six theory modules.
//
// These are written to the bar in the platform spec (section 10): they test
// understanding (why / when / what-would-you-do), not memorization. Every quiz
// includes at least one applied procurement scenario, one "when NOT to use"
// question, and one composition question relating concepts. Distractors are
// plausible (common misconceptions), not throwaways. Each question carries a
// Chinese explanation shown after answering.

export type QuestionType = 'single' | 'multiple' | 'shortAnswer';

export type Question = {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  // single -> correct index; multiple -> correct indexes; shortAnswer -> accepted strings
  correctAnswer: number | number[] | string[];
  explanation: string;
};

export type Quiz = {
  moduleId: number;
  questions: Question[];
};

export const QUIZ_PASS_RATIO = 0.7;

export const QUIZZES: Record<number, Quiz> = {
  // ────────────────────────────── 第一章 API ──────────────────────────────
  1: {
    moduleId: 1,
    questions: [
      {
        id: 'm1q1',
        type: 'single',
        question: 'API 是什么？请选出最准确的描述。',
        options: [
          '一种编程语言，专门用来写采购脚本',
          '一个程序与另一个程序"对话"的标准方式',
          '一个专门存放钢材价格的数据库',
          'AI 模型的另一种叫法',
        ],
        correctAnswer: 1,
        explanation:
          'API 是应用程序接口，本质是程序之间按标准方式交换信息：你发一个请求，它返回数据。它不是某种语言，不是数据库，也不等同于 AI 模型本身。',
      },
      {
        id: 'm1q2',
        type: 'single',
        question:
          '在我们的设置里，你在 Claude Code 里打字、回车、看到回答，背后实际发生了什么？',
        options: [
          'Claude Code 在本地用内置的离线模型直接生成答案',
          'Claude Code 把你的问题打包，调用 AI 模型的 API（我们这里是 DeepSeek 端点），再把回应显示给你',
          '你的问题被直接发送到 Anthropic 的 Claude 模型',
          'Claude Code 只是在网页上帮你做了一次搜索',
        ],
        correctAnswer: 1,
        explanation:
          'Claude Code 也是软件，它帮你打包请求、调用模型 API、再把回应显示出来。而且我们的后端连的是 DeepSeek，不是 Anthropic 的 Claude——体验一样，但底层端点不同。',
      },
      {
        id: 'm1q3',
        type: 'single',
        question: '拿到一个 API key 之后，下面哪种做法是错误的、应该避免的？',
        options: [
          '把它保存在只有自己能看到的地方',
          '把它当作通行证，不发给别人',
          '把它直接 commit 到 git 仓库，或发到微信群里',
          '在脚本里用它来调用 API',
        ],
        correctAnswer: 2,
        explanation:
          'API key 相当于一张通行证，泄露后别人就能消耗你的额度甚至权限。所以绝对不要 commit 到 git、不要发到微信群、不要发给任何人。',
      },
      {
        id: 'm1q4',
        type: 'multiple',
        question: '下面哪些说法是对的？（多选）',
        options: [
          'metals-api 这样的钢价服务是通过 API 提供数据的',
          'AI 模型（Claude、DeepSeek）也是通过 API 提供服务的',
          '只有 AI 公司才会提供 API',
          '后面要学的 MCP、技能、子代理，本质上都是在组织一系列 API 调用',
        ],
        correctAnswer: [0, 1, 3],
        explanation:
          'API 无处不在——价格服务、AI 模型都用 API 提供服务；而 MCP、技能、子代理这些更高级的东西，本质都是在组织 API 调用。"只有 AI 公司才提供 API"是错的。',
      },
      {
        id: 'm1q5',
        type: 'multiple',
        question:
          '你每天早上要看当天钢价、把几份美元报价按汇率换算成人民币、再看几个新供应商资料。如果这些数据都有 API，用 API 来做有哪些合理的好处？（多选）',
        options: [
          '写一个脚本几秒钟拿到结果，不用手动打开十几个网页',
          '把"手动重复的工作"变成"程序自动做的工作"',
          '能保证 AI 永远不会算错任何东西',
          '为后面用 MCP、技能等更高级的工具打下基础',
        ],
        correctAnswer: [0, 1, 3],
        explanation:
          'API 的价值是把重复劳动自动化、为更高级工具打基础。但"保证 AI 永远不出错"是过度承诺——这恰恰是第六章评估要解决的问题。',
      },
      {
        id: 'm1q6',
        type: 'single',
        question:
          '我们的 Claude Code 后端连的是 DeepSeek 而不是 Anthropic 的 Claude。下面哪个判断最准确？',
        options: [
          '因为不是 Claude，所以 MCP、技能、子代理都没法用',
          '体验基本一样；这些概念机制上都在 API 之上所以都能用，但 AI 的"判断力"取决于背后的模型',
          'DeepSeek 和 Claude 完全一样，没有任何区别',
          '只有付费用户才能调用 API',
        ],
        correctAnswer: 1,
        explanation:
          '机制（API、MCP、技能等）和模型是两层。机制在 API 之上，所以在 DeepSeek 后端照样能跑；但输出质量取决于模型本身。这也是为什么后面评估那么重要。',
      },
      {
        id: 'm1q7',
        type: 'multiple',
        question:
          '理论说"所有更高级的工具本质上都是在组织 API 调用"。下面哪些属于"组织 API 调用"的不同方式？（多选）',
        options: [
          'MCP——给 AI 标准化地访问外部 API 和工具',
          '技能——按你的方法固定流程、组织调用',
          '子代理与多代理编排——分工和协调多次调用',
          '把电脑关机再重启一次',
        ],
        correctAnswer: [0, 1, 2],
        explanation:
          'MCP、技能、子代理、编排都是"组织 API 调用"的不同方式。理解了 API 这个地基，上面这些就不再神秘了。',
      },
      {
        id: 'm1q8',
        type: 'shortAnswer',
        question:
          '理论用一句话概括 AI 模型 API 的工作方式："____进，____回"。两个空填同一个词。',
        correctAnswer: ['文本', '文本进文本回'],
        explanation:
          '"文本进，文本回"——你发给模型一段文本，它返回一段文本。这就是模型 API 最朴素的本质。',
      },
      {
        id: 'm1q9',
        type: 'shortAnswer',
        question: '在这套体系里，API 扮演什么角色？用一个词概括（提示：和盖房子有关）。',
        correctAnswer: ['地基', '基础', '根基'],
        explanation:
          'API 是整套体系的"地基"——MCP、技能、子代理、编排、评估，全都跑在 API 调用之上。',
      },
      {
        id: 'm1q10',
        type: 'single',
        question:
          '理论说"理解了 API，后面的 MCP、技能、子代理就不神秘了"。为什么会这样？',
        options: [
          '因为它们和 API 毫无关系，各学各的',
          '因为它们本质上都是用不同方式去组织一系列 API 调用',
          '因为学会 API 之后就不需要再学它们了',
          '因为它们都是 API 的旧称',
        ],
        correctAnswer: 1,
        explanation:
          'MCP、技能、子代理、编排都是在"组织 API 调用"——给 AI 接工具、定方法、分工、协调。看懂这个共同的地基，上面的概念就有了统一的根。',
      },
    ],
  },

  // ────────────────────────────── 第二章 MCP ──────────────────────────────
  2: {
    moduleId: 2,
    questions: [
      {
        id: 'm2q1',
        type: 'single',
        question: '理论用一个比喻形容 MCP，最贴切的是哪一个？',
        options: [
          'AI 世界的"USB-C"——一个标准接口连接各种工具',
          '一种更快的 AI 模型',
          '一个专门的钢材数据库',
          '一种新的编程语言',
        ],
        correctAnswer: 0,
        explanation:
          'MCP 是模型上下文协议，像 USB-C：以前每接一个工具都要单独写代码，现在一个标准接口，任何兼容的 AI 都能用。',
      },
      {
        id: 'm2q2',
        type: 'single',
        question: '一个没有任何工具（没有 MCP）的 AI，下面哪件事它做不到？',
        options: [
          '解释一个概念',
          '翻译一段话',
          '查今天 A516 钢板的实时 FOB 报价',
          '写一段询价函的文字',
        ],
        correctAnswer: 2,
        explanation:
          '没有"手"的 AI 只能"说话"——能写、能译、能解释，但不能查实时行情、读你的文件、登录供应商网站。这正是 MCP 要解决的问题。',
      },
      {
        id: 'm2q3',
        type: 'single',
        question: '为什么说 MCP 对我们（DeepSeek 后端）特别重要？',
        options: [
          '因为 MCP 只有 DeepSeek 支持',
          '因为 MCP 是开放标准、不是某家公司专有，所以无论后端是 Claude 还是 DeepSeek 都能用',
          '因为 MCP 能让 DeepSeek 变成 Claude',
          '因为不用 MCP 就不能用 DeepSeek',
        ],
        correctAnswer: 1,
        explanation:
          'MCP 是开放标准，OpenAI、Google、微软、AWS 都支持。所以它和后端模型无关——Claude 也好、DeepSeek 也好，MCP 都能工作。',
      },
      {
        id: 'm2q4',
        type: 'multiple',
        question: '下面哪些是理论里推荐给采购起步用的 MCP 工具？（多选）',
        options: [
          '文件系统工具——读报价 PDF、规格书、图纸',
          '网页搜索工具——查当天市场行情、潜在新供应商',
          '浏览器自动化工具——登录供应商网站、抓没有 API 的价格',
          '一个能自动帮你下单付款的工具',
        ],
        correctAnswer: [0, 1, 2],
        explanation:
          '文件系统、网页搜索、浏览器自动化是推荐的起步工具。"自动下单付款"既不在推荐里，也属于高风险、不可逆的操作，应由人来确认。',
      },
      {
        id: 'm2q5',
        type: 'single',
        question: '关于连接多少个 MCP 工具，下面哪个判断符合理论的建议？',
        options: [
          '越多越好，能连几十个就连几十个',
          '一般 2-3 个最常用的就够；超过 5-7 个反而可能让 AI 表现变差',
          '必须正好连 7 个',
          '工具数量和 AI 表现完全无关',
        ],
        correctAnswer: 1,
        explanation:
          '不是越多越好。工具太多，AI 要选的太多反而拿不准用哪个。通常 2-3 个最常用的就够，超过 5-7 个表现可能下降。',
      },
      {
        id: 'm2q6',
        type: 'multiple',
        question:
          '从公网安装一个别人写的 MCP 服务器（尤其是文件系统、数据库这类），理论建议你怎么做？（多选）',
        options: [
          '先看源头——GitHub 上有没有持续维护、有没有真实的贡献者',
          '遵循最小权限——能只读就别给读写，能限定一个文件夹就别给全盘访问',
          '对危险工具先用只读模式',
          '直接装上、给最大权限，图个方便',
        ],
        correctAnswer: [0, 1, 2],
        explanation:
          '公网 MCP 服务器质量参差不齐（很多有漏洞、不要求认证）。所以：看源头、最小权限、危险工具先只读。"图方便给最大权限"恰恰是最危险的做法。',
      },
      {
        id: 'm2q7',
        type: 'multiple',
        question: '关于"要不要自己造一个 MCP 服务器"，下面哪些说法是对的？（多选）',
        options: [
          '内部专有系统（自己的 ERP、内部询价单系统）可以包装成 MCP 服务器接入',
          '网上已有上万个公开 MCP 服务器，覆盖了大多数常见工具',
          '绝大多数情况下不需要自己从零造',
          '任何工具都必须自己造，不能用现成的',
        ],
        correctAnswer: [0, 1, 2],
        explanation:
          '内部专有系统可以包装成 MCP 服务器接入；但常见需求网上多半已有现成的（上万个公开服务器），通常不必自己造。',
      },
      {
        id: 'm2q8',
        type: 'shortAnswer',
        question:
          '一句话区分：MCP 给 AI 的是"____"，技能（Skills）给 AI 的是"方法"。MCP 给的是什么？（一个字或词）',
        correctAnswer: ['手', '双手', '工具'],
        explanation:
          'MCP 是"手"（工具），技能是"方法"（流程）。技能告诉 AI 怎样按你的方法去使用这些 MCP 工具——两者解决的是不同的问题，所以你两个都需要。',
      },
      {
        id: 'm2q9',
        type: 'shortAnswer',
        question: 'MCP 的中文全称是"模型____协议"（Model Context Protocol）。填空。',
        correctAnswer: ['上下文', '上下文协议', 'context'],
        explanation:
          'MCP = Model Context Protocol，模型上下文协议，一个让 AI 连接外部工具和数据的开放标准。',
      },
      {
        id: 'm2q10',
        type: 'single',
        question:
          '你想让 Claude 读取本机 quotes 文件夹里的几份报价 PDF，并整理成对比信息。最直接、最稳妥的做法是？',
        options: [
          '装一个网页搜索工具',
          '装一个文件系统（Filesystem）MCP 工具，并只授权 quotes 这一个文件夹',
          '装一个数据库工具',
          '把每份 PDF 的内容手动全部粘贴给 AI',
        ],
        correctAnswer: 1,
        explanation:
          '读取本机文件夹里的报价需要文件系统 MCP 工具；按最小权限原则，只授权 quotes 这一个文件夹，而不是整个硬盘。',
      },
    ],
  },

  // ───────────────────────────── 第三章 技能 ─────────────────────────────
  3: {
    moduleId: 3,
    questions: [
      {
        id: 'm3q1',
        type: 'single',
        question: '一个"技能（Skill）"本质上是什么？',
        options: [
          '一个文件夹，里面有说明文件（SKILL.md），可能还有脚本，告诉 AI 面对某类任务该怎么做',
          '一个更聪明的 AI 模型',
          '一个付费才能解锁的高级功能',
          '一种 MCP 工具的别名',
        ],
        correctAnswer: 0,
        explanation:
          '技能就是一个带 SKILL.md（可能还有脚本）的文件夹，相当于一份"标准操作手册"：面对这一类任务，请按这个方法做。',
      },
      {
        id: 'm3q2',
        type: 'single',
        question: '技能最核心解决的问题是什么？',
        options: [
          '让 AI 跑得更快',
          '把"每次重复解释任务"和"输出格式漂移"一次性解决，让每次输出都一致',
          '让 AI 能上网',
          '减少 API 调用的费用',
        ],
        correctAnswer: 1,
        explanation:
          '没有技能时，你每次都要重新解释任务，且格式每次有微小差异。技能把方法写下来一次，从此输出格式一致，任何团队成员调用都一样。',
      },
      {
        id: 'm3q3',
        type: 'single',
        question: '为什么"把精确逻辑放进脚本里"对我们的 DeepSeek 后端特别重要？',
        options: [
          '因为脚本能让 DeepSeek 变成 Claude',
          '因为脚本是代码、运行结果是确定的、跟背后是什么模型无关；而模型的"心算"（如换算、重量计算）在不同模型上准确度不同',
          '因为脚本比模型更聪明',
          '因为不写脚本就不能用技能',
        ],
        correctAnswer: 1,
        explanation:
          '模型的"心算"准确度因模型而异；但脚本是代码，结果确定、与模型无关。所以把必须精确的计算/格式放进脚本，让模型只负责判断、不负责算数。',
      },
      {
        id: 'm3q4',
        type: 'multiple',
        question: '下面哪些是 Anthropic 官方公开、可免费使用的技能？（多选）',
        options: [
          'docx——创建、编辑、读取 Word 文档',
          'xlsx——创建带真实公式的 Excel 表格',
          'pptx——创建 PowerPoint 演示文稿',
          'steelprice——自动抓取当天钢材行情',
        ],
        correctAnswer: [0, 1, 2],
        explanation:
          '官方技能包括 docx、xlsx、pdf、pptx，覆盖约 90% 的办公文档工作，并把格式/公式等"麻烦事"打包成了脚本。"自动抓钢价"不是官方技能——那是 MCP 搜索/浏览器工具的活。',
      },
      {
        id: 'm3q5',
        type: 'multiple',
        question:
          '你想用 xlsx 技能生成一份报价比较表，把不同币种的单价换算成人民币并算总额。下面哪些做法符合理论建议？（多选）',
        options: [
          '让换算和总额用真实的 Excel 公式计算，而不是硬编码数字',
          '把汇率单独放一栏，改汇率时相关数字自动重算',
          '把所有结果让模型"心算"后直接写死成数字',
          '把"必须精确"的计算交给脚本/公式，模型负责整理结构和判断',
        ],
        correctAnswer: [0, 1, 3],
        explanation:
          '用真实公式、汇率单独成栏、精确计算交给脚本/公式——这样改汇率会自动重算，结果也不依赖模型心算。"让模型心算后写死"恰恰违背了原则。',
      },
      {
        id: 'm3q6',
        type: 'multiple',
        question: '没有技能时，会出现哪些问题？（多选）',
        options: [
          '每次跟 AI 解释一个任务都要从头讲一遍',
          '每次产出的格式都有微小差异（格式漂移）',
          'AI 会彻底无法完成任何任务',
          '不同团队成员之间很难得到一致的结果',
        ],
        correctAnswer: [0, 1, 3],
        explanation:
          '没有技能的痛点是"重复解释"和"格式漂移"，团队之间也难一致。但 AI 并非"彻底无法完成"——只是每次结果不稳定、不统一。',
      },
      {
        id: 'm3q7',
        type: 'single',
        question: '下面哪种情况，最不需要专门写一个技能？',
        options: [
          '一个每天都要做、且格式必须统一的报价比较表',
          '一个团队所有人都要用、要求输出一致的询价函',
          '一次性的、以后基本不会再重复的特殊任务',
          '一个需要精确换算、适合用脚本保证结果的任务',
        ],
        correctAnswer: 2,
        explanation:
          '技能的价值在"重复 + 一致"。一次性、不会再重复的特殊任务，专门写技能的收益很低。技能最适合高频、要求格式统一、多人共用的任务。',
      },
      {
        id: 'm3q8',
        type: 'shortAnswer',
        question:
          '一句话区分：MCP 给 AI 的是"工具"，技能给 AI 的是"____"。填一个词。',
        correctAnswer: ['方法', '流程'],
        explanation:
          'MCP 给"工具"，技能给"方法/流程"。一个技能甚至可以告诉 AI"按这个顺序使用这些 MCP 工具"。',
      },
      {
        id: 'm3q9',
        type: 'shortAnswer',
        question: '一个技能文件夹里，那份核心的说明文件叫什么？（写出文件名）',
        correctAnswer: ['SKILL.md', 'skill.md', 'SKILL'],
        explanation:
          '技能的核心是 SKILL.md 说明文件，可能再配上若干脚本。',
      },
      {
        id: 'm3q10',
        type: 'single',
        question: '技能和子代理（下一章）怎么配合？',
        options: [
          '它们互相排斥，不能一起用',
          '一个专门做某件事的子代理可以"装备"一个技能，让它把那件事做得始终一致',
          '子代理会让技能失效',
          '技能只能给主代理用，不能给子代理用',
        ],
        correctAnswer: 1,
        explanation:
          '子代理可以内置技能：比如"询价函生成"子代理装上 docx 技能，每次产出都一致。技能是方法，子代理是工人，工人用方法干活。',
      },
    ],
  },

  // ──────────────────────────── 第四章 子代理 ────────────────────────────
  4: {
    moduleId: 4,
    questions: [
      {
        id: 'm4q1',
        type: 'single',
        question: '子代理（Subagent）最准确的描述是哪一个？',
        options: [
          '一个"专门做某件事"的助手，有自己的指令、工具权限和独立的上下文，按名字调用',
          '一个比主模型更强的新模型',
          '一个云端的付费服务',
          '一种 MCP 工具',
        ],
        correctAnswer: 0,
        explanation:
          '子代理是预先定义好的专门助手：自己的指令、自己的工具权限、自己独立的上下文窗口。你按名字调用它，它专注做那一件事，再把结果交回给你。',
      },
      {
        id: 'm4q2',
        type: 'single',
        question: '为什么把任务交给专门的子代理，结果往往更稳定？',
        options: [
          '因为子代理用的是更贵的模型',
          '因为每个子代理范围窄、工具限定、指令固定、上下文隔离，不会被别的任务干扰',
          '因为子代理不需要 API',
          '因为子代理会自动联网',
        ],
        correctAnswer: 1,
        explanation:
          '一个 AI 什么都做时上下文混杂、行为不稳。子代理把每件事隔离开（窄范围、限定工具、固定指令、独立上下文），所以做得始终一致。',
      },
      {
        id: 'm4q3',
        type: 'multiple',
        question: '子代理本质上是 .claude/agents/ 下的配置文件。关于这一点，下面哪些说法是对的？（多选）',
        options: [
          '写一个好子代理一次，分享文件后整个团队都能调用同一个',
          '它把"某个有经验的人的判断"封装成了团队任何人都能用的工具',
          '它的配置机制是软件层面的、与具体模型无关，所以在 DeepSeek 后端也能跑',
          '配置文件只能作者本人使用，无法分享',
        ],
        correctAnswer: [0, 1, 2],
        explanation:
          '子代理是可分享的配置文件，把"经验丰富的人的判断"变成团队都能用的工具；其配置机制是软件层面的，与模型无关，所以 DeepSeek 后端也能运行。',
      },
      {
        id: 'm4q4',
        type: 'multiple',
        question: '下面哪些是理论举的、合理的专门化子代理例子？（多选）',
        options: [
          '只研究单家供应商、只用搜索工具、返回结构化研究简报的"供应商研究"子代理',
          '只检查报价规格是否符合图纸的"规格核查"子代理',
          '只生成询价函、只用 docx 技能的"询价函生成"子代理',
          '一个"什么都做"的全能子代理，越通用越好',
        ],
        correctAnswer: [0, 1, 2],
        explanation:
          '好的子代理范围窄、工具限定、指令固定。"什么都做的全能子代理"恰恰违背设计初衷——那又回到了"注意力分散、行为不稳"。',
      },
      {
        id: 'm4q5',
        type: 'single',
        question:
          '关于"把不同子代理路由到不同模型（重活给 Opus、轻活给 Haiku）"，在我们的设置里准确的说法是？',
        options: [
          '随时都能用，跟 Anthropic 直连没区别',
          '这类高级路由需要 Anthropic 的模型；我们的设置里每个子代理路由到 proxy 能提供的模型。结构稳定（配置层面），但输出质量取决于背后的模型',
          '我们的设置完全不能用子代理',
          '这个功能能让 DeepSeek 自动升级成 Opus',
        ],
        correctAnswer: 1,
        explanation:
          '子代理的"配置机制"是软件层面的、与模型无关，所以在 DeepSeek 后端能跑。但"按模型路由"这类高级能力需要 Anthropic 模型；我们这里路由到 proxy 提供的模型。结构稳定，质量看模型。',
      },
      {
        id: 'm4q6',
        type: 'multiple',
        question:
          '你要创建一个"供应商研究"子代理，让它对每家供应商都产出结构一致的简报。下面哪些设计是合理的？（多选）',
        options: [
          '在指令里固定规定要输出的几个小节（公司背景、制造能力、资质认证、近期动态、风险信号、价格定位）',
          '限定它只用搜索/读取类工具',
          '要求"找不到的信息写\'公开渠道未找到\'，不要编造"',
          '让它顺便也负责"最终选哪家供应商"的决策',
        ],
        correctAnswer: [0, 1, 2],
        explanation:
          '固定小节、限定工具、明确"不编造"都让它产出一致、可靠。但"最终选哪家"是决策类综合，应由主代理来做——子代理负责研究单家，主代理负责综合决策。',
      },
      {
        id: 'm4q7',
        type: 'single',
        question:
          '在 Lab 4 的流程里，"研究单家供应商"和"基于三份简报做对比总结、给采购建议"分别由谁来做最合理？',
        options: [
          '两件事都由同一个子代理做',
          '子代理负责"研究单家"，主代理负责"做综合 / 决策"',
          '两件事都由主代理做，不需要子代理',
          '都交给一个全能子代理',
        ],
        correctAnswer: 1,
        explanation:
          '子代理负责专门化的"研究单家"；主代理负责把多份简报综合成对比和建议。分工清晰，结果才稳定。',
      },
      {
        id: 'm4q8',
        type: 'single',
        question: '下面哪种情况，最没必要专门做一个子代理？',
        options: [
          '一个高频、需要稳定一致输出的专门任务（如供应商研究）',
          '一个要分享给全团队、人人都要用的标准化任务',
          '一个临时的、只问一次的简单问题',
          '一个需要限定工具权限、隔离上下文的任务',
        ],
        correctAnswer: 2,
        explanation:
          '子代理的价值在"专门化 + 可复用 + 一致"。临时只问一次的简单问题，直接问主代理即可，专门建子代理收益很低。',
      },
      {
        id: 'm4q9',
        type: 'shortAnswer',
        question: '子代理的配置文件一般放在项目里的哪个文件夹下？（写出路径片段即可）',
        correctAnswer: ['.claude/agents', 'claude/agents', 'agents'],
        explanation:
          '子代理是 .claude/agents/ 文件夹下的文本配置文件，可以分享给团队共用。',
      },
      {
        id: 'm4q10',
        type: 'shortAnswer',
        question:
          '用一个词概括子代理在整套体系里的角色（它内部使用技能和 MCP 来干活）。',
        correctAnswer: ['工人', '专家', '助手'],
        explanation:
          '子代理是一个"工人"：它在自己的上下文里用技能（方法）和 MCP（工具）完成专门任务。多个工人一起干活，就是下一章的多代理编排。',
      },
    ],
  },

  // ─────────────────────────── 第五章 多代理编排 ───────────────────────────
  5: {
    moduleId: 5,
    questions: [
      {
        id: 'm5q1',
        type: 'single',
        question: '多代理编排（orchestrator-workers 模式）最准确的描述是哪一个？',
        options: [
          '一个"领导"代理把大任务拆成小块、分给多个"工人"代理（各自独立、通常并行）、最后整合结果',
          '把一个任务反复发给同一个 AI，直到它答对为止',
          '用更大的模型一次性回答所有问题',
          '多个用户同时跟同一个 AI 聊天',
        ],
        correctAnswer: 0,
        explanation:
          '多代理编排就是"编排者-工人"模式：领导拆任务、工人并行处理、领导整合结果。',
      },
      {
        id: 'm5q2',
        type: 'multiple',
        question: '下面哪些任务特点，适合用多代理编排？（多选）',
        options: [
          '可以拆成相互独立的子任务',
          '适合并行处理（如同时研究 10 家供应商、同时审 20 份合同）',
          '量大、让一个 AI 顺序做太慢、上下文太挤',
          '一个必须严格按先后顺序、每步都依赖上一步结果的小任务',
        ],
        correctAnswer: [0, 1, 2],
        explanation:
          '编排适合"可拆分 + 可并行 + 量大"的任务。如果任务很小、又必须严格顺序依赖，编排没有意义，反而增加成本和复杂度。',
      },
      {
        id: 'm5q3',
        type: 'single',
        question:
          '关于 2026 年 5 月 28 日推出的 Dynamic Workflows（动态工作流），理论里的准确描述是？',
        options: [
          '已经对所有用户默认开启、并且免费',
          '目前是"研究预览版"，需要 Enterprise、Team 或 Max 计划；能自动规划、启动几百个并行子代理、自动验证每个输出再报告',
          '它能让 DeepSeek 自动变成 Opus 4.8',
          '它已经取代了 API 和 MCP',
        ],
        correctAnswer: 1,
        explanation:
          'Dynamic Workflows 是研究预览版（需 Enterprise/Team/Max），能自动规划任务、并行启动大量子代理、自动验证输出。这是前沿能力，不是默认开启的成熟功能。',
      },
      {
        id: 'm5q4',
        type: 'multiple',
        question: '理论诚实地列了多代理编排在 2026 年的局限。下面哪些是它当前真实的局限？（多选）',
        options: [
          '是实验性的，默认是关闭的',
          '没有跨会话的记忆，每次开始都是新的',
          '可观察性有限、成本会快速上升',
          '已经完全成熟，可以放心地大规模无人值守部署',
        ],
        correctAnswer: [0, 1, 2],
        explanation:
          '编排目前实验性、默认关闭、无跨会话记忆、可观察性有限、成本快速上升，在 DeepSeek 后端协调质量更粗糙。所以是"未来方向"，不是"明天就无人值守部署"。',
      },
      {
        id: 'm5q5',
        type: 'single',
        question: '下面哪种情况，你不应该用多代理编排？',
        options: [
          '同时深入研究 50 家供应商，且每份研究相互独立',
          '一项普通的日常采购任务，一个配好技能和 MCP 工具的单代理就能轻松搞定',
          '同时审核一大批合同',
          '需要并行分析多个市场的行情',
        ],
        correctAnswer: 1,
        explanation:
          '对绝大多数日常工作，一个有正确技能和 MCP 的单代理就够了。多代理编排的价值只在"真的需要并行处理大批量任务"的场景；小任务上用它只会增加成本和不确定性。',
      },
      {
        id: 'm5q6',
        type: 'single',
        question: '你决定在一个真实流程里开始用多代理编排。理论强调一定要先做什么？',
        options: [
          '直接上线，出了问题再说',
          '设硬限制（最大步数、最大成本），并先在 20-30 个真实案例上测过、确认稳定',
          '把所有工具权限开到最大',
          '关掉评估，省得麻烦',
        ],
        correctAnswer: 1,
        explanation:
          '用编排一定要设硬限制（防无限循环、防 token 烧光），并先在 20-30 个真实案例上测试。它越强、越不成熟，越要有纪律。',
      },
      {
        id: 'm5q7',
        type: 'multiple',
        question:
          '任务："评估国内 8 家钢板供应商，给一份带排名的采购推荐。"用编排来做，下面哪些是合理的流程？（多选）',
        options: [
          '领导代理把任务拆成 8 个"研究单家"的子任务',
          '8 个供应商研究子代理并行运行，各研究一家',
          '领导代理把 8 份简报整合成一份带排名的采购推荐',
          '让一个子代理顺序地把 8 家全研究完、再自己下最终结论，不需要领导整合',
        ],
        correctAnswer: [0, 1, 2],
        explanation:
          '这正是"编排者-工人"：领导拆分 → 8 个工人并行研究 → 领导整合排名。让单个子代理顺序包揽并自行决策，就失去了并行和分工的意义。',
      },
      {
        id: 'm5q8',
        type: 'shortAnswer',
        question:
          '多代理编排的经典模式英文叫 orchestrator-workers，中文是"____-工人"模式。填空。',
        correctAnswer: ['编排者', '领导', 'orchestrator'],
        explanation:
          '编排者-工人（orchestrator-workers）：编排者负责拆分与整合，工人并行处理子任务。',
      },
      {
        id: 'm5q9',
        type: 'shortAnswer',
        question:
          '在这套体系里，多代理编排坐在哪一层？（提示：相对于子代理、技能、API 的位置，它是"____"）',
        correctAnswer: ['最顶层', '顶层', '最上层', '最上面'],
        explanation:
          '编排坐在最顶层：它组合子代理，子代理用技能和 MCP，这些都跑在 API 之上。它最强大，也最不成熟——所以下一章"评估"尤其重要。',
      },
      {
        id: 'm5q10',
        type: 'single',
        question:
          '理论说"这一层最强大，也最不成熟，所以下一章评估尤其重要"。这句话的逻辑是？',
        options: [
          '编排越不成熟，就越不需要检查',
          '正因为编排强大但不成熟、容易悄悄出错，才更需要评估来验证它真的在正确工作',
          '评估只对 API 有用，对编排没用',
          '有了编排就不再需要评估了',
        ],
        correctAnswer: 1,
        explanation:
          '越强大、越不成熟的系统，越可能在你没注意时出错。评估是验证"它是否真的在正确工作"的手段，所以在编排这一层尤其重要。',
      },
    ],
  },

  // ───────────────────────────── 第六章 评估 ─────────────────────────────
  6: {
    moduleId: 6,
    questions: [
      {
        id: 'm6q1',
        type: 'single',
        question: '评估（eval）最准确的描述是哪一个？',
        options: [
          '一个可重复的测试，用一组代表性任务衡量 AI 输出是否真的正确、可靠',
          '一次性地夸一夸 AI 答得好不好',
          '一种让 AI 跑得更快的设置',
          '给 AI 模型评一个星级',
        ],
        correctAnswer: 0,
        explanation:
          '评估是可重复的测试：拿一批已知正确答案的真实任务，让现在的 AI 跑一遍、对比结果，通过几个、失败几个一目了然。',
      },
      {
        id: 'm6q2',
        type: 'single',
        question: '为什么说评估是这套体系里"唯一不可以省略"的部分？',
        options: [
          '因为它最容易做',
          '因为 AI 不会"崩溃"，而是会自信地给你错答案；没有评估你根本发现不了它在悄悄出错',
          '因为它能让 AI 永不犯错',
          '因为它能替代 API',
        ],
        correctAnswer: 1,
        explanation:
          'AI 出错时不会报错崩溃，而是自信地给错答案（漏栏、币种算错、编造供应商、把 12mm 读成 1.2mm）。没有评估你不会发现——"看起来正常"不是可靠的衡量标准。',
      },
      {
        id: 'm6q3',
        type: 'multiple',
        question: '下面哪些是理论点名的 AI"自信地出错"的典型方式？（多选）',
        options: [
          '漏掉报价里的一个关键栏',
          '把欧元误算成美元',
          '凭空"创造"一家不存在的供应商',
          '遇到不会的就主动报错停下，并明确告诉你"我不确定"',
        ],
        correctAnswer: [0, 1, 2],
        explanation:
          '漏栏、币种算错、编造供应商都是 AI"自信出错"的典型（还有把 12mm 读成 1.2mm）。关键在于：它通常不会主动说"我不确定"，而是照样自信地给你一个错答案——所以才需要评估。',
      },
      {
        id: 'm6q4',
        type: 'single',
        question: '为什么评估对我们的 DeepSeek 后端特别重要？',
        options: [
          '因为 DeepSeek 不能用评估',
          '因为 DeepSeek 行为和 Claude 不完全一样，且代理升级或 DeepSeek 出新版时行为可能在你不知情下改变——评估是唯一的早期预警',
          '因为评估能让 DeepSeek 变成 Claude',
          '因为 DeepSeek 永远不会出错',
        ],
        correctAnswer: 1,
        explanation:
          'DeepSeek 的行为与 Claude 有差异，且 proxy 升级 / 模型更新可能悄悄改变行为。评估告诉你"昨天还正常的技能今天还正不正常"，是唯一的早期预警系统。',
      },
      {
        id: 'm6q5',
        type: 'multiple',
        question: '搭一个评估，理论说需要哪三样东西？（多选）',
        options: [
          '15-20 个真实的、过去的采购案例（报价、规格、当时的处理结果）',
          '每个案例对应的"已知正确答案"（实际发出的询价函、当时的比较表、最终选定的供应商）',
          '一个打分方法 / 脚本，让 AI 用现在的技能跑每个案例并和已知答案对比',
          '一台更贵的服务器',
        ],
        correctAnswer: [0, 1, 2],
        explanation:
          '三样东西：真实测试案例、已知正确答案、打分方法（脚本对比给出通过/失败）。和服务器贵不贵无关。',
      },
      {
        id: 'm6q6',
        type: 'single',
        question: '你刚改了一行"询价函生成"技能的格式要求。按理论，改完第一件事该做什么？',
        options: [
          '直接把它用到真实采购单上',
          '先跑评估：20/20 通过就安全；18/20 就看哪两个失败、可能是副作用；12/20 说明改坏了、回滚',
          '把这个技能删掉重写',
          '等出问题了再回头检查',
        ],
        correctAnswer: 1,
        explanation:
          '改完技能第一件事就是跑评估。评估让你敢于改动——没有它，每次改东西都像赌博，不知道是不是悄悄打坏了什么。',
      },
      {
        id: 'm6q7',
        type: 'single',
        question:
          '在 Lab 6 里，你故意删掉 xlsx 技能里"要包含某些列"的要求，再跑评估，预期会怎样？',
        options: [
          '评估察觉不到任何变化',
          '评估会失败（比如从 5/5 掉到 2/5），抓出缺失的字段——在它影响真实采购单之前',
          '技能会自动修复自己',
          '评估会让 AI 变慢，但结果不变',
        ],
        correctAnswer: 1,
        explanation:
          '这正是评估的核心价值：你打破一个技能，评估立刻从全通过掉下来，告诉你"有东西不对"——在它跑到真实业务之前。把改动还原，评估又恢复全通过。',
      },
      {
        id: 'm6q8',
        type: 'multiple',
        question: '关于评估的作用，下面哪些说法是对的？（多选）',
        options: [
          '它是改动技能、模型升级之后能放心的前提——"评估让你敢于改动"',
          '它要持续地跑，而不是只在第一天做一次',
          '"看起来正常"不是一个可靠的衡量标准',
          '只要输出看起来正常，就不必再做评估',
        ],
        correctAnswer: [0, 1, 2],
        explanation:
          '评估是放心改动的前提、要持续跑，且"看起来正常"靠不住。AI 可能已经悄悄出错好几周，只有持续评估才能及时发现行为漂移。',
      },
      {
        id: 'm6q9',
        type: 'shortAnswer',
        question:
          '评估在整套体系里坐在哪个位置？（提示：它坐在所有东西"下面"，是"____层"）',
        correctAnswer: ['信任', '信任层', '最底层', '底层'],
        explanation:
          '评估坐在所有东西"下面"，是"信任层"：它告诉你 API、MCP、技能、子代理、编排是不是真的在工作，还是在悄悄失败。',
      },
      {
        id: 'm6q10',
        type: 'shortAnswer',
        question:
          '评估存在的根本理由可以用一句话概括：AI 出错时不会崩溃，而是会"自信地"给出____答案。填一个字或词。',
        correctAnswer: ['错', '错误', '错的'],
        explanation:
          'AI 不会崩溃，它会自信地给你"错"答案。正因如此，能持续抓出这种沉默错误的评估，才是让上面一切都能放心使用的前提。',
      },
    ],
  },
};

export function getQuiz(moduleId: number): Quiz | null {
  return QUIZZES[moduleId] ?? null;
}

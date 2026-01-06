export default {
  topics: {
    general: '综合',
    love: '爱情',
    career: '事业',
    academics: '学业',
    wealth: '财运',
    health: '健康',
    relationships: '人际'
  },
  trigrams: {
    '111': {
      general: '刚健中正，自强不息。象征着开创、领导力与行动力。',
      love: '刚毅果断，但也容易过于强势。需要学习柔和与包容。',
      career: '大展宏图的时机，适合担任领导角色或独立创业。',
      academics: '思维敏捷，适合攻克难题，但需注意基础扎实。',
      wealth: '正财运强，通过努力工作获得回报，不宜投机。',
      health: '精力充沛，但需防头部、神经系统疾病或过度劳累。',
      relationships: '具有威望，但也容易让人产生距离感，宜平易近人。'
    },
    '000': {
      general: '厚德载物，柔顺包容。象征着承载、配合与执行力。',
      love: '温柔体贴，包容对方。关系稳固，适合长久发展。',
      career: '适合辅助、执行类工作。以静制动，稳步前行。',
      academics: '循序渐进，打好基础。适合文科或需要耐心的学科。',
      wealth: '利于储蓄与长线投资，积少成多。',
      health: '注意脾胃消化系统，保持平和心态。',
      relationships: '人缘极佳，善于倾听与配合，受人欢迎。'
    },
    '100': {
      general: '雷动风行，震惊百里。象征着变动、激发与突破。',
      love: '一见钟情或关系突变。充满激情，但也可能不稳定。',
      career: '有新的机遇或挑战，适合开拓新市场或改革。',
      academics: '思维活跃，灵感迸发。但也容易心浮气躁。',
      wealth: '动中求财，适合短期投资或快速交易。',
      health: '注意肝胆、神经系统，防惊吓或突发状况。',
      relationships: '直率冲动，容易得罪人，也容易结交新朋友。'
    },
    '011': {
      general: '柔顺而入，无孔不入。象征着渗透、沟通与适应。',
      love: '细腻温柔，善于沟通。但也容易优柔寡断。',
      career: '适合贸易、传媒、公关等需要沟通协调的工作。',
      academics: '善于触类旁通，学习能力强。',
      wealth: '利市三倍，适合经商或中介获利。',
      health: '注意呼吸系统、风湿骨痛或大腿神经。',
      relationships: '八面玲珑，善于交际，但需防随波逐流。'
    },
    '010': {
      general: '水流不息，险象环生。象征着困难、险阻与智慧。',
      love: '波折较多，深情但充满考验。需要信任与坚持。',
      career: '面临挑战或陷入瓶颈。需运用智慧，隐忍待发。',
      academics: '遇到瓶颈，需深入钻研，克服困难方能突破。',
      wealth: '财运险中求，风险较大，需谨慎理财。',
      health: '注意肾脏、泌尿系统或耳部疾病。',
      relationships: '人际关系复杂，需防小人或口舌是非。'
    },
    '101': {
      general: '火炎向上，光明普照。象征着依附、热情与文明。',
      love: '热情如火，但也容易忽冷忽热。注重外表与感觉。',
      career: '适合文化、艺术、科技等需要展示才华的行业。',
      academics: '聪明好学，成绩优异。但需防骄傲自满。',
      wealth: '财运亨通，但来得快去得也快，宜守财。',
      health: '注意心脏、眼部或血液循环系统。',
      relationships: '热情开朗，受人瞩目，但需防虚荣心作祟。'
    },
    '001': {
      general: '山岳静止，动静适宜。象征着停止、稳重与保守。',
      love: '稳重踏实，但也显得木讷。关系进展缓慢但稳定。',
      career: '适合守成或内部整顿。不宜盲目扩张，宜稳扎稳打。',
      academics: '虽然反应不快，但胜在踏实肯干，大器晚成。',
      wealth: '利于守财，不动产投资或储蓄。',
      health: '注意背部、关节或脾胃系统。',
      relationships: '诚实守信，但略显固执，不善变通。'
    },
    '110': {
      general: '泽水喜悦，口若悬河。象征着喜悦、沟通与缺损。',
      love: '甜言蜜语，相处愉快。但需防口舌之争或第三者。',
      career: '适合演说、销售、娱乐等靠口才或带给人快乐的行业。',
      academics: '学习轻松愉快，善于表达。',
      wealth: '心情好则财运好，适合合作求财。',
      health: '注意口腔、咽喉或呼吸系统。',
      relationships: '善于交际，人缘好，但需防言多必失。'
    }
  },
  interpretation: {
    structure: {
      title: '【卦象结构分析】',
      upper: '上卦为{upper}，含义：{uMeaning}',
      lower: '下卦为{lower}，含义：{lMeaning}',
      summary: '此卦显示{upper}在{lower}之上，二者相互作用，决定了当下的基本态势。'
    },
    data_insufficient: '数据不足，无法解读。',
    unknown_hexagram: '未知卦象。',
    title_template: '【{name}卦】针对“{topic}”的深度解读',
    guaci_original: '【卦辞原文】',
    guaci_none: '（暂无）',
    core_advice: {
      pure: '此卦为{upperName}为首的纯卦，能量纯粹而强大。在{topic}方面，往往意味着需要坚持原本的特质（{meaning}）到底。',
      heaven_earth: '天地否，阴阳不交。目前可能面临沟通不畅或环境阻滞的情况，建议以退为进，修身养德。',
      earth_heaven: '地天泰，阴阳交泰。目前是大吉大利的时机，上下沟通顺畅，万事如意，宜积极进取。',
      water_fire: '水火既济，阴阳调和。事情已近成功，但也意味着盛极而衰的开始，需防微杜渐，守成不易。',
      fire_water: '火水未济，阴阳失调。事情尚未完成，仍需努力。虽然目前有困难，但也充满了未来的可能性。',
      general_yang: '【卦象结构解析】\n本卦上卦为{upperName}（{upperNature}），下卦为{lowerName}（{lowerNature}）。\n外在表现为{upperNature}，内在基础为{lowerNature}。此卦象暗示：{meaning}。',
    general_yin: '【卦象结构解析】\n本卦上卦为{upperName}（{upperNature}），下卦为{lowerName}（{lowerNature}）。\n外在表现为{upperNature}，内在基础为{lowerNature}。此卦象暗示：{meaning}。'
  },
  core_guidance: '【大师指引】',
  moving_lines: {
    title: '【变爻详解】',
    no_moving: '【变爻分析】',
    no_moving_desc: '本次卦象无变爻，说明事态相对稳定。请重点参考【本卦卦辞】与【卦象结构分析】。',
    yao_label: '★ {label}（变爻）：',
    yao_text: '【爻辞】{text}',
    no_yao_text: '（无爻辞）',
    analysis_template: '【解卦建议】\n{advice}',
    position_1: '【初爻之象：潜龙勿用】\n处于事物发展的最初阶段，如同潜伏在深渊的龙。此时力量微弱，地位未定，时机尚未成熟。大师建议：不宜轻举妄动，应沉下心来积蓄力量，观察局势，等待更好的时机。急于求成往往会招致失败。',
    position_2: '【二爻之象：见龙在田】\n事物开始崭露头角，处于下卦的中位，象征得道多助。此时已具备一定的实力和基础，利于展现才华。大师建议：可以积极寻求贵人相助，稳步推进计划，是一个充满希望的阶段。',
    position_3: '【三爻之象：惕龙无咎】\n处于下卦的顶点，即将进入上卦，是一个充满变数和危机的过渡期。如同君子终日勤勉，夕惕若厉。大师建议：必须时刻保持警惕，谨言慎行，防微杜渐。虽然面临压力，但只要坚持正道，就能化险为夷。',
    position_4: '【四爻之象：或跃在渊】\n刚刚进入上卦，立足未稳，处于进退两难之地。如同龙跃深渊，可上可下。大师建议：此时需要审时度势，根据形势灵活应变。进可攻，退可守，切不可盲目冒进，需寻找最佳切入点。',
    position_5: '【五爻之象：飞龙在天】\n位居尊位，中正当令，是事物发展的全盛时期。如同飞龙在天，利见大人。大师建议：此时运势极佳，宜大展宏图，发挥领导才能。但也要注意团结下属，不可独断专行，以保持长久的昌盛。',
    position_6: '【上爻之象：亢龙有悔】\n处于全卦的终点，物极必反，盛极而衰。如同飞龙飞得太高，会有悔恨。大师建议：此时应知进退，懂得急流勇退的智慧。凡事不可做绝，留有余地，方能保全自身，避免由盛转衰。'
  }
},
trigram_attributes: {
  '111': '刚健',
  '000': '柔顺',
  '010': '险陷',
  '101': '光明',
  '100': '震动',
  '011': '入伏',
  '001': '止息',
  '110': '喜悦'
},
  ui: {
    hexagram: {
      upper: '上卦',
      lower: '下卦',
      lines: '爻象',
      guaci: '卦辞',
      yaoci: '爻辞',
      changed: '变卦',
      source: '本次取辞依据',
      interpret: '解卦',
      back_hexagram: '返回卦象',
      back_home: '返回首页',
      unknown: '未知卦',
      none: '暂无卦辞',
      use_nine: '用九',
      use_six: '用六'
    },
    pick_tips: {
      no_moving: '无变爻：以本卦卦辞为主。',
      one_moving: '一变爻：以该爻爻辞为主。',
      two_moving: '二变爻：两爻皆看，上爻为主。',
      three_moving: '三变爻：以本卦卦辞为主，兼看变卦卦辞。',
      four_moving: '四变爻：以变卦卦辞为主，兼看两静爻。',
      five_moving: '五变爻：以唯一静爻为主。',
      six_moving: '六变爻：以变卦卦辞为主。',
      six_moving_yang: '六变爻（纯老阳）：取用九。',
      six_moving_yin: '六变爻（纯老阴）：取用六。'
    },
    divination: {
      title: '起卦',
      toss: '掷一爻',
      hint_progress: '已得 {count}/6 爻',
      hint_done: '卦成，正在解卦…'
    },
    common: {
      nine: '九',
      six: '六'
    },
    home: {
      title: '每日一卦',
      start_btn: '诚心起卦',
      select_topic_title: '请选择求问方向',
      select_topic_sub: '诚心诚意，一事一测',
      confirm_start: '开始起卦'
    },
    interpretation_page: {
      title: '大师解卦',
      back_hexagram: '返回卦象',
      back_home: '返回首页'
    },
    result: {
      title: '结果',
      back: '返回'
    }
  },
  nature: {
    '111': '天',
    '000': '地',
    '010': '水',
    '101': '火',
    '100': '雷',
    '011': '风',
    '001': '山',
    '110': '泽'
  },
  trigram_names: {
    '111': '乾',
    '000': '坤',
    '010': '坎',
    '101': '离',
    '100': '震',
    '011': '巽',
    '001': '艮',
    '110': '兑'
  },
  yao_names: ['初', '二', '三', '四', '五', '上'],
  line_kinds: {
    yin_old: '老阴',
    yang_young: '少阳',
    yin_young: '少阴',
    yang_old: '老阳'
  },
  settings: {
    title: '设置',
    bgm: '背景音乐',
    language: '语言',
    langCN: '简体中文',
    langTW: '繁体中文'
  },
  app: {
    title: '易经金钱卦'
  }
}

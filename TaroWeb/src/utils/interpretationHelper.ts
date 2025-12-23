import { type LineValue, isMovingLine, linesToSymbol } from './iching'
import { findHexagramBySymbol } from '@/data/hexagrams'

export type Topic = '综合' | '爱情' | '事业' | '学业' | '财运' | '健康' | '人际'

const trigramMap: Record<string, string> = {
  '111': '乾',
  '000': '坤',
  '010': '坎',
  '101': '离',
  '100': '震',
  '011': '巽',
  '001': '艮',
  '110': '兑'
}

const trigramMeanings: Record<string, Record<Topic, string>> = {
  '乾': {
    综合: '刚健中正，自强不息。象征着开创、领导力与行动力。',
    爱情: '刚毅果断，但也容易过于强势。需要学习柔和与包容。',
    事业: '大展宏图的时机，适合担任领导角色或独立创业。',
    学业: '思维敏捷，适合攻克难题，但需注意基础扎实。',
    财运: '正财运强，通过努力工作获得回报，不宜投机。',
    健康: '精力充沛，但需防头部、神经系统疾病或过度劳累。',
    人际: '具有威望，但也容易让人产生距离感，宜平易近人。'
  },
  '坤': {
    综合: '厚德载物，柔顺包容。象征着承载、配合与执行力。',
    爱情: '温柔体贴，包容对方。关系稳固，适合长久发展。',
    事业: '适合辅助、执行类工作。以静制动，稳步前行。',
    学业: '循序渐进，打好基础。适合文科或需要耐心的学科。',
    财运: '利于储蓄与长线投资，积少成多。',
    健康: '注意脾胃消化系统，保持平和心态。',
    人际: '人缘极佳，善于倾听与配合，受人欢迎。'
  },
  '震': {
    综合: '雷动风行，震惊百里。象征着变动、激发与突破。',
    爱情: '一见钟情或关系突变。充满激情，但也可能不稳定。',
    事业: '有新的机遇或挑战，适合开拓新市场或改革。',
    学业: '思维活跃，灵感迸发。但也容易心浮气躁。',
    财运: '动中求财，适合短期投资或快速交易。',
    健康: '注意肝胆、神经系统，防惊吓或突发状况。',
    人际: '直率冲动，容易得罪人，也容易结交新朋友。'
  },
  '巽': {
    综合: '柔顺而入，无孔不入。象征着渗透、沟通与适应。',
    爱情: '细腻温柔，善于沟通。但也容易优柔寡断。',
    事业: '适合贸易、传媒、公关等需要沟通协调的工作。',
    学业: '善于触类旁通，学习能力强。',
    财运: '利市三倍，适合经商或中介获利。',
    健康: '注意呼吸系统、风湿骨痛或大腿神经。',
    人际: '八面玲珑，善于交际，但需防随波逐流。'
  },
  '坎': {
    综合: '水流不息，险象环生。象征着困难、险阻与智慧。',
    爱情: '波折较多，深情但充满考验。需要信任与坚持。',
    事业: '面临挑战或陷入瓶颈。需运用智慧，隐忍待发。',
    学业: '遇到瓶颈，需深入钻研，克服困难方能突破。',
    财运: '财运险中求，风险较大，需谨慎理财。',
    健康: '注意肾脏、泌尿系统或耳部疾病。',
    人际: '人际关系复杂，需防小人或口舌是非。'
  },
  '离': {
    综合: '火炎向上，光明普照。象征着依附、热情与文明。',
    爱情: '热情如火，但也容易忽冷忽热。注重外表与感觉。',
    事业: '适合文化、艺术、科技等需要展示才华的行业。',
    学业: '聪明好学，成绩优异。但需防骄傲自满。',
    财运: '财运亨通，但来得快去得也快，宜守财。',
    健康: '注意心脏、眼部或血液循环系统。',
    人际: '热情开朗，受人瞩目，但需防虚荣心作祟。'
  },
  '艮': {
    综合: '山岳静止，动静适宜。象征着停止、稳重与保守。',
    爱情: '稳重踏实，但也显得木讷。关系进展缓慢但稳定。',
    事业: '适合守成或内部整顿。不宜盲目扩张，宜稳扎稳打。',
    学业: '虽然反应不快，但胜在踏实肯干，大器晚成。',
    财运: '利于守财，不动产投资或储蓄。',
    健康: '注意背部、关节或脾胃系统。',
    人际: '诚实守信，但略显固执，不善变通。'
  },
  '兑': {
    综合: '泽水喜悦，口若悬河。象征着喜悦、沟通与缺损。',
    爱情: '甜言蜜语，相处愉快。但需防口舌之争或第三者。',
    事业: '适合演说、销售、娱乐等靠口才或带给人快乐的行业。',
    学业: '学习轻松愉快，善于表达。',
    财运: '心情好则财运好，适合合作求财。',
    健康: '注意口腔、咽喉或呼吸系统。',
    人际: '善于交际，人缘好，但需防言多必失。'
  }
}

function getStructureMeaning(upper: string, lower: string, topic: Topic): string {
  const uMeaning = trigramMeanings[upper]?.[topic] || ''
  const lMeaning = trigramMeanings[lower]?.[topic] || ''
  
  return `【卦象结构分析】\n上卦为${upper}，含义：${uMeaning}\n下卦为${lower}，含义：${lMeaning}\n此卦显示${upper}在${lower}之上，二者相互作用，决定了当下的基本态势。`
}

export function generateRichInterpretation(
  lines: LineValue[], 
  topic: Topic
): string {
  if (lines.length !== 6) return '数据不足，无法解读。'

  const symbol = linesToSymbol(lines)
  const hexagram = findHexagramBySymbol(symbol)
  if (!hexagram) return '未知卦象。'

  const upperBits = symbol.slice(3, 6)
  const lowerBits = symbol.slice(0, 3)
  const upperName = trigramMap[upperBits] || ''
  const lowerName = trigramMap[lowerBits] || ''

  const movingIndexes: number[] = []
  lines.forEach((l, i) => {
    if (isMovingLine(l)) movingIndexes.push(i)
  })

  const parts: string[] = []

  // 1. 标题
  parts.push(`【${hexagram.name}卦】针对“${topic}”的深度解读`)
  parts.push('')

  // 2. 卦辞原文与白话
  parts.push('【卦辞原文】')
  parts.push(hexagram.guaci || '（暂无）')
  parts.push('')

  // 3. 结构分析（Trigram Analysis）
  parts.push(getStructureMeaning(upperName, lowerName, topic))
  parts.push('')

  // 4. 核心建议（Synthesis）
  // 这里可以根据上下卦的关系做一些简单的逻辑判断
  let coreAdvice = ''
  if (upperName === lowerName) {
    coreAdvice = `此卦为${upperName}为首的纯卦，能量纯粹而强大。在${topic}方面，往往意味着需要坚持原本的特质（${trigramMeanings[upperName][topic]}）到底。`
  } else if (upperName === '乾' && lowerName === '坤') {
    coreAdvice = '天地否，阴阳不交。目前可能面临沟通不畅或环境阻滞的情况，建议以退为进，修身养德。'
  } else if (upperName === '坤' && lowerName === '乾') {
    coreAdvice = '地天泰，阴阳交泰。目前是大吉大利的时机，上下沟通顺畅，万事如意，宜积极进取。'
  } else if (upperName === '坎' && lowerName === '离') {
    coreAdvice = '水火既济，阴阳调和。事情已近成功，但也意味着盛极而衰的开始，需防微杜渐，守成不易。'
  } else if (upperName === '离' && lowerName === '坎') {
    coreAdvice = '火水未济，阴阳失调。事情尚未完成，仍需努力。虽然目前有困难，但也充满了未来的可能性。'
  } else {
    // 通用逻辑
    coreAdvice = `根据卦象，${upperName}在上，${lowerName}在下。`
    if (['乾', '震', '坎', '艮'].includes(upperName)) {
      // 阳性卦在上，往往比较主动
      coreAdvice += `外在环境或表现比较强势/主动，`
    } else {
      coreAdvice += `外在环境或表现比较柔和/顺从，`
    }
    coreAdvice += `而内在基础（下卦${lowerName}）则${trigramMeanings[lowerName].综合}。建议内外兼修，顺势而为。`
  }

  parts.push('【核心指引】')
  parts.push(coreAdvice)
  parts.push('')

  // 5. 变爻分析（Moving Lines）
  if (movingIndexes.length > 0) {
    parts.push('【变爻分析与建议】')
    movingIndexes.forEach(idx => {
      const yaoText = hexagram.yaoci[idx] || '（无爻辞）'
      const rank = ['初', '二', '三', '四', '五', '上'][idx]
      const num = (lines[idx] === 6 || lines[idx] === 8) ? '六' : '九' // 这里要注意，变爻如果是老阴(6)原是阴，如果是老阳(9)原是阳
      // 实际上 meta 显示的是 原来的性质。 
      // 6 is Old Yin (Yin changing to Yang). 9 is Old Yang (Yang changing to Yin).
      // 所以 Label 应该是 初六 或 初九。
      const label = `${rank}${lines[idx] === 6 || lines[idx] === 8 ? '六' : '九'}` 
      
      parts.push(`★ ${label}（变爻）：`)
      parts.push(`爻辞：${yaoText}`)
      
      // 简单的爻位分析
      let positionAdvice = ''
      if (idx === 0) positionAdvice = '处于事物初期，地位卑微，不宜轻举妄动，应潜藏待机。'
      else if (idx === 1) positionAdvice = '处于下卦之中，得位，利于寻求支持或稳步发展。'
      else if (idx === 2) positionAdvice = '处于下卦之上，位置尴尬，需防躁动，谨慎行事。'
      else if (idx === 3) positionAdvice = '进入上卦初期，环境多变，容易恐惧或不安，需柔顺应对。'
      else if (idx === 4) positionAdvice = '处于尊位，虽然尊贵但也责任重大，需中正行事。'
      else if (idx === 5) positionAdvice = '处于亢极之位，物极必反，需防满盈招损，宜知进退。'
      
      parts.push(`解析：${positionAdvice}在${topic}上，这意味着目前的变数关键点在于此阶段，请仔细体悟爻辞的启示。`)
      parts.push('')
    })
  } else {
    parts.push('【变爻分析】')
    parts.push('本次卦象无变爻，说明事态相对稳定。请重点参考【本卦卦辞】与【卦象结构分析】。')
    parts.push('')
  }

  return parts.join('\n')
}

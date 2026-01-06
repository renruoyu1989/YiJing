import { type LineValue, isMovingLine, linesToSymbol } from './iching'
import { findHexagramBySymbol } from '@/data/hexagrams'
import { getLocaleMessages } from '@/utils/i18n'

export type Topic = 'general' | 'love' | 'career' | 'academics' | 'wealth' | 'health' | 'relationships'

// Binary representation of trigrams
const TRIGRAM_BITS = {
  HEAVEN: '111',
  EARTH: '000',
  WATER: '010',
  FIRE: '101',
  THUNDER: '100',
  WIND: '011',
  MOUNTAIN: '001',
  LAKE: '110'
}

export function generateRichInterpretation(
  lines: LineValue[], 
  topic: Topic,
  lang: string = 'zh-CN'
): string {
  const messages = getLocaleMessages(lang)
  
  if (lines.length !== 6) return messages.interpretation.data_insufficient

  const symbol = linesToSymbol(lines)
  const hexagram = findHexagramBySymbol(symbol, lang)
  if (!hexagram) return messages.interpretation.unknown_hexagram

  const upperBits = symbol.slice(3, 6)
  const lowerBits = symbol.slice(0, 3)
  
  // Use localized trigram names for display
  const upperName = messages.trigram_names[upperBits as keyof typeof messages.trigram_names] || ''
  const lowerName = messages.trigram_names[lowerBits as keyof typeof messages.trigram_names] || ''

  const movingIndexes: number[] = []
  lines.forEach((l, i) => {
    if (isMovingLine(l)) movingIndexes.push(i)
  })

  const parts: string[] = []

  // 1. 标题
  const topicName = messages.topics[topic] || topic
  parts.push(messages.interpretation.title_template
    .replace('{name}', hexagram.name)
    .replace('{topic}', topicName)
  )
  parts.push('')

  // 2. 卦辞原文与白话
  parts.push(messages.interpretation.guaci_original)
  parts.push(hexagram.guaci || messages.interpretation.guaci_none)
  parts.push('')

  // 3. 结构分析（Trigram Analysis）
  const uMeaning = messages.trigrams[upperBits as keyof typeof messages.trigrams]?.[topic] || ''
  const lMeaning = messages.trigrams[lowerBits as keyof typeof messages.trigrams]?.[topic] || ''

  parts.push(messages.interpretation.structure.title)
  parts.push(messages.interpretation.structure.upper
    .replace('{upper}', upperName)
    .replace('{uMeaning}', uMeaning)
  )
  parts.push(messages.interpretation.structure.lower
    .replace('{lower}', lowerName)
    .replace('{lMeaning}', lMeaning)
  )
  parts.push(messages.interpretation.structure.summary
    .replace('{upper}', upperName)
    .replace('{lower}', lowerName)
  )
  parts.push('')

  // 4. 核心建议（Synthesis）
  let coreAdvice = ''
  const coreMsg = messages.interpretation.core_advice

  if (upperBits === lowerBits) {
    const meaning = messages.trigrams[upperBits as keyof typeof messages.trigrams]?.[topic] || ''
    coreAdvice = coreMsg.pure
      .replace('{upperName}', upperName)
      .replace('{topic}', topicName)
      .replace('{meaning}', meaning)
  } else if (upperBits === TRIGRAM_BITS.HEAVEN && lowerBits === TRIGRAM_BITS.EARTH) {
    coreAdvice = coreMsg.heaven_earth
  } else if (upperBits === TRIGRAM_BITS.EARTH && lowerBits === TRIGRAM_BITS.HEAVEN) {
    coreAdvice = coreMsg.earth_heaven
  } else if (upperBits === TRIGRAM_BITS.WATER && lowerBits === TRIGRAM_BITS.FIRE) {
    coreAdvice = coreMsg.water_fire
  } else if (upperBits === TRIGRAM_BITS.FIRE && lowerBits === TRIGRAM_BITS.WATER) {
    coreAdvice = coreMsg.fire_water
  } else {
    // 通用逻辑
    const lowerMeaning = messages.trigrams[lowerBits as keyof typeof messages.trigrams]?.general || ''
    
    // Yang trigrams are often considered stronger/more active in top position in some contexts,
    // but here we just need a rule to pick between general_yang/general_yin templates.
    // Let's assume Heaven, Thunder, Water, Mountain are Yang-ish in this context?
    // Actually, usually Heaven, Water, Thunder, Mountain are Yang trigrams? No.
    // Heaven (Father), Thunder (Eldest Son), Water (Middle Son), Mountain (Youngest Son). Yes.
    // Earth (Mother), Wind (Eldest Daughter), Fire (Middle Daughter), Lake (Youngest Daughter).
    
    const yangTrigrams = [
      TRIGRAM_BITS.HEAVEN, 
      TRIGRAM_BITS.THUNDER, 
      TRIGRAM_BITS.WATER, 
      TRIGRAM_BITS.MOUNTAIN
    ]
    
    const isYangTop = yangTrigrams.includes(upperBits)
    const template = isYangTop ? coreMsg.general_yang : coreMsg.general_yin
    
    // Get trigram nature attributes (safely)
    const uNature = messages.trigram_attributes?.[upperBits] || ''
    const lNature = messages.trigram_attributes?.[lowerBits] || ''
    
    coreAdvice = template
      .replace(/{upperName}/g, upperName)
      .replace(/{lowerName}/g, lowerName)
      .replace(/{upperNature}/g, uNature)
      .replace(/{lowerNature}/g, lNature)
      .replace(/{meaning}/g, lowerMeaning)
  }

  parts.push(messages.interpretation.core_guidance)
  parts.push(coreAdvice)
  parts.push('')

  // 5. 变爻分析（Moving Lines）
  if (movingIndexes.length > 0) {
    parts.push(messages.interpretation.moving_lines.title)
    movingIndexes.forEach(idx => {
      const yaoText = hexagram.yaoci[idx] || messages.interpretation.moving_lines.no_yao_text
      const rank = messages.yao_names[idx]
      const isYin = lines[idx] === 6 || lines[idx] === 8
      const num = isYin ? messages.ui.common.six : messages.ui.common.nine
      
      const label = messages.interpretation.moving_lines.yao_label
        .replace('{label}', `${rank}${num}`)
      
      parts.push(label)
      parts.push(messages.interpretation.moving_lines.yao_text.replace('{text}', yaoText))
      
      const posKey = `position_${idx + 1}` as keyof typeof messages.interpretation.moving_lines
      const positionAdvice = messages.interpretation.moving_lines[posKey] as string

      parts.push(messages.interpretation.moving_lines.analysis_template
        .replace('{advice}', positionAdvice)
        .replace('{topic}', topicName)
      )
      parts.push('')
    })
  } else {
    parts.push(messages.interpretation.moving_lines.no_moving)
    parts.push(messages.interpretation.moving_lines.no_moving_desc)
    parts.push('')
  }

  return parts.join('\n')
}

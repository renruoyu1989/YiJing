export default {
  topics: {
    general: '綜合',
    love: '愛情',
    career: '事業',
    academics: '學業',
    wealth: '財運',
    health: '健康',
    relationships: '人際'
  },
  trigrams: {
    '111': {
      general: '剛健中正，自強不息。象徵著開創、領導力與行動力。',
      love: '剛毅果斷，但也容易過於強勢。需要學習柔和與包容。',
      career: '大展宏圖的時機，適合擔任領導角色或獨立創業。',
      academics: '思維敏捷，適合攻克難題，但需注意基礎紮實。',
      wealth: '正財運強，通過努力工作獲得回報，不宜投機。',
      health: '精力充沛，但需防頭部、神經系統疾病或過度勞累。',
      relationships: '具有威望，但也容易讓人產生距離感，宜平易近人。'
    },
    '000': {
      general: '厚德載物，柔順包容。象徵著承載、配合與執行力。',
      love: '溫柔體貼，包容對方。關係穩固，適合長久發展。',
      career: '適合輔助、執行類工作。以靜制動，穩步前行。',
      academics: '循序漸進，打好基礎。適合文科或需要耐心的學科。',
      wealth: '利於儲蓄與長線投資，積少成多。',
      health: '注意脾胃消化系統，保持平和心態。',
      relationships: '人緣極佳，善於傾聽與配合，受人歡迎。'
    },
    '100': {
      general: '雷動風行，震驚百里。象徵著變動、激發與突破。',
      love: '一見鍾情或關係突變。充滿激情，但也可能不穩定。',
      career: '有新的機遇或挑戰，適合開拓新市場或改革。',
      academics: '思維活躍，靈感迸發。但也容易心浮氣躁。',
      wealth: '動中求財，適合短期投資或快速交易。',
      health: '注意肝膽、神經系統，防驚嚇或突發狀況。',
      relationships: '直率衝動，容易得罪人，也容易結交新朋友。'
    },
    '011': {
      general: '柔順而入，無孔不入。象徵著滲透、溝通與適應。',
      love: '細膩溫柔，善於溝通。但也容易優柔寡斷。',
      career: '適合貿易、傳媒、公關等需要溝通協調的工作。',
      academics: '善於觸類旁通，學習能力強。',
      wealth: '利市三倍，適合經商或中介獲利。',
      health: '注意呼吸系統、風濕骨痛或大腿神經。',
      relationships: '八面玲瓏，善於交際，但需防隨波逐流。'
    },
    '010': {
      general: '水流不息，險象環生。象徵著困難、險阻與智慧。',
      love: '波折較多，深情但充滿考驗。需要信任與堅持。',
      career: '面臨挑戰或陷入瓶頸。需運用智慧，隱忍待發。',
      academics: '遇到瓶頸，需深入鑽研，克服困難方能突破。',
      wealth: '財運險中求，風險較大，需謹慎理財。',
      health: '注意腎臟、泌尿系統或耳部疾病。',
      relationships: '人際關係複雜，需防小人或口舌是非。'
    },
    '101': {
      general: '火炎向上，光明普照。象徵著依附、熱情與文明。',
      love: '熱情如火，但也容易忽冷忽熱。注重外表與感覺。',
      career: '適合文化、藝術、科技等需要展示才華的行業。',
      academics: '聰明好學，成績優異。但需防驕傲自滿。',
      wealth: '財運亨通，但來得快去得也快，宜守財。',
      health: '注意心臟、眼部或血液循環系統。',
      relationships: '熱情開朗，受人矚目，但需防虛榮心作祟。'
    },
    '001': {
      general: '山岳靜止，動靜適宜。象徵著停止、穩重與保守。',
      love: '穩重踏實，但也顯得木訥。關係進展緩慢但穩定。',
      career: '適合守成或內部整頓。不宜盲目擴張，宜穩紮穩打。',
      academics: '雖然反應不快，但勝在踏實肯幹，大器晚成。',
      wealth: '利於守財，不動產投資或儲蓄。',
      health: '注意背部、關節或脾胃系統。',
      relationships: '誠實守信，但略顯固執，不善變通。'
    },
    '110': {
      general: '澤水喜悅，口若懸河。象徵著喜悅、溝通與缺損。',
      love: '甜言蜜語，相處愉快。但需防口舌之爭或第三者。',
      career: '適合演說、銷售、娛樂等靠口才或帶給人快樂的行業。',
      academics: '學習輕鬆愉快，善於表達。',
      wealth: '心情好則財運好，適合合作求財。',
      health: '注意口腔、咽喉或呼吸系統。',
      relationships: '善於交際，人緣好，但需防言多必失。'
    }
  },
  interpretation: {
    structure: {
      title: '【卦象結構分析】',
      upper: '上卦為{upper}，含義：{uMeaning}',
      lower: '下卦為{lower}，含義：{lMeaning}',
      summary: '此卦顯示{upper}在{lower}之上，二者相互作用，決定了當下的基本態勢。'
    },
    data_insufficient: '數據不足，無法解讀。',
    unknown_hexagram: '未知卦象。',
    title_template: '【{name}卦】針對「{topic}」的深度解讀',
    guaci_original: '【卦辭原文】',
    guaci_none: '（暫無）',
    core_advice: {
      pure: '此卦為{upperName}為首的純卦，能量純粹而強大。在{topic}方面，往往意味著需要堅持原本的特質（{meaning}）到底。',
      heaven_earth: '天地否，陰陽不交。目前可能面臨溝通不暢或環境阻滯的情況，建議以退為進，修身養德。',
      earth_heaven: '地天泰，陰陽交泰。目前是大吉大利的時機，上下溝通順暢，萬事如意，宜積極進取。',
      water_fire: '水火既濟，陰陽調和。事情已近成功，但也意味著盛極而衰的開始，需防微杜漸，守成不易。',
      fire_water: '火水未濟，陰陽失調。事情尚未完成，仍需努力。雖然目前有困難，但也充滿了未來的可能性。',
      general_yang: '【卦象結構解析】\n本卦上卦為{upperName}（{upperNature}），下卦為{lowerName}（{lowerNature}）。\n外在表現為{upperNature}，內在基礎為{lowerNature}。此卦象暗示：{meaning}。',
    general_yin: '【卦象結構解析】\n本卦上卦為{upperName}（{upperNature}），下卦為{lowerName}（{lowerNature}）。\n外在表現為{upperNature}，內在基礎為{lowerNature}。此卦象暗示：{meaning}。'
  },
  core_guidance: '【大師指引】',
  moving_lines: {
    title: '【變爻詳解】',
    no_moving: '【變爻分析】',
    no_moving_desc: '本次卦象無變爻，說明事態相對穩定。請重點參考【本卦卦辭】與【卦象結構分析】。',
    yao_label: '★ {label}（變爻）：',
    yao_text: '【爻辭】{text}',
    no_yao_text: '（無爻辭）',
    analysis_template: '【解卦建議】\n{advice}',
    position_1: '【初爻之象：潛龍勿用】\n處於事物發展的最初階段，如同潛伏在深淵的龍。此時力量微弱，地位未定，時機尚未成熟。大師建議：不宜輕舉妄動，應沉下心來積蓄力量，觀察局勢，等待更好的時機。急於求成往往會招致失敗。',
    position_2: '【二爻之象：見龍在田】\n事物開始嶄露頭角，處於下卦的中位，象徵得道多助。此時已具備一定的實力和基礎，利於展現才華。大師建議：可以積極尋求貴人相助，穩步推進計劃，是一個充滿希望的階段。',
    position_3: '【三爻之象：惕龍無咎】\n處於下卦的頂點，即將進入上卦，是一個充滿變數和危機的過渡期。如同君子終日勤勉，夕惕若厲。大師建議：必須時刻保持警惕，謹言慎行，防微杜漸。雖然面臨壓力，但只要堅持正道，就能化險為夷。',
    position_4: '【四爻之象：或躍在淵】\n剛剛進入上卦，立足未穩，處於進退兩難之地。如同龍躍深淵，可上可下。大師建議：此時需要審時度勢，根據形勢靈活應變。進可攻，退可守，切不可盲目冒進，需尋找最佳切入點。',
    position_5: '【五爻之象：飛龍在天】\n位居尊位，中正當令，是事物發展的全盛時期。如同飛龍在天，利見大人。大師建議：此時運勢極佳，宜大展宏圖，發揮領導才能。但也要注意團結下屬，不可獨斷專行，以保持長久的昌盛。',
    position_6: '【上爻之象：亢龍有悔】\n處於全卦的終點，物極必反，盛極而衰。如同飛龍飛得太高，會有悔恨。大師建議：此時應知進退，懂得急流勇退的智慧。凡事不可做絕，留有餘地，方能保全自身，避免由盛轉衰。'
  }
},
trigram_attributes: {
  '111': '剛健',
  '000': '柔順',
  '010': '險陷',
  '101': '光明',
  '100': '震動',
  '011': '入伏',
  '001': '止息',
  '110': '喜悅'
},
  ui: {
    hexagram: {
      upper: '上卦',
      lower: '下卦',
      lines: '爻象',
      guaci: '卦辭',
      yaoci: '爻辭',
      changed: '變卦',
      source: '本次取辭依據',
      interpret: '解卦',
      back_hexagram: '返回卦象',
      back_home: '返回首頁',
      unknown: '未知卦',
      none: '暫無卦辭',
      use_nine: '用九',
      use_six: '用六'
    },
    pick_tips: {
      no_moving: '無變爻：以本卦卦辭為主。',
      one_moving: '一變爻：以該爻爻辭為主。',
      two_moving: '二變爻：兩爻皆看，上爻為主。',
      three_moving: '三變爻：以本卦卦辭為主，兼看變卦卦辭。',
      four_moving: '四變爻：以變卦卦辭為主，兼看兩靜爻。',
      five_moving: '五變爻：以唯一靜爻為主。',
      six_moving: '六變爻：以變卦卦辭為主。',
      six_moving_yang: '六變爻（純老陽）：取用九。',
      six_moving_yin: '六變爻（純老陰）：取用六。'
    },
    divination: {
      title: '起卦',
      toss: '擲一爻 (搖一搖)',
      hint_progress: '已得 {count}/6 爻',
      hint_done: '卦成，正在解卦…'
    },
    common: {
      nine: '九',
      six: '六'
    },
    home: {
      title: '易心',
      start_btn: '誠心起卦',
      select_topic_title: '請選擇求問方向',
      select_topic_sub: '誠心誠意，一事一測',
      confirm_start: '開始起卦'
    },
    interpretation_page: {
      title: '大師解卦',
      back_hexagram: '返回卦象',
      back_home: '返回首頁'
    },
    result: {
      title: '結果',
      back: '返回'
    }
  },
  nature: {
    '111': '天',
    '000': '地',
    '010': '水',
    '101': '火',
    '100': '雷',
    '011': '風',
    '001': '山',
    '110': '澤'
  },
  trigram_names: {
    '111': '乾',
    '000': '坤',
    '010': '坎',
    '101': '離',
    '100': '震',
    '011': '巽',
    '001': '艮',
    '110': '兌'
  },
  yao_names: ['初', '二', '三', '四', '五', '上'],
  line_kinds: {
    yin_old: '老陰',
    yang_young: '少陽',
    yin_young: '少陰',
    yang_old: '老陽'
  },
  settings: {
    title: '設置',
    bgm: '背景音樂',
    language: '語言',
    langCN: '簡體中文',
    langTW: '繁體中文'
  },
  app: {
    title: '易經金錢卦'
  }
}

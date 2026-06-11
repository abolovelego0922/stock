import { useState, useEffect } from 'react'
// 自訂 Hook
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key)

      if (saved !== null) {
        return JSON.parse(saved)
      }

      return initialValue
    } catch (error) {
      console.error(`讀取 ${key} 失敗`, error)
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`儲存 ${key} 失敗`, error)
    }
  }, [key, value])

  return [value, setValue]
}
// 1. 股票字典（進一步擴充台、日、美熱門科技股與資訊軟體股）
const STOCK_DICTIONARY = {
  '台股': {
    // 半導體、封測、IC設計與設備大廠
    '2330': '台積電', '2454': '聯發科', '2303': '聯電', '3711': '日月光投控', 
    '5483': '中美晶', '6488': '環球晶', '3653': '健策', '6239': '力成',
    '2344': '華邦電', '2408': '南亞科', '3034': '聯詠', '2379': '瑞昱', 
    '3443': '創意', '3661': '世芯-KY', '3035': '智原', '5347': '世界先進', '6770': '力積電',
    '6187': '萬潤', '3131': '弘塑', '3583': '辛耘', '2449': '京元電子', '2337': '旺宏',
    '5274': '信驊', '4966': '譜瑞-KY', '8046': '南電', '3037': '欣興', '2368': '金像電',
    '3532': '台勝科', '6415': '矽力*-KY', '3529': '力旺', '5269': '祥碩', '6643': 'M31', '8081': '致新',
    // 資訊服務、軟體、網通、AI硬體與電子代工、光電科技
    '6214': '精誠資訊', '3029': '零壹', '4953': '緯創軟體', '2317': '鴻海', '2382': '廣達', 
    '3231': '緯創', '6669': '緯穎', '2357': '華碩', '2353': '宏碁', '2356': '英業達', 
    '2324': '仁寶', '2345': '智邦', '2301': '光寶科', '2395': '研華', '2474': '可成', 
    '3017': '奇鋐', '3324': '雙鴻', '2498': '宏達電', '6189': '豐藝電子', '2377': '微星',
    '3008': '大立光', '6414': '樺漢', '2455': '全新', '4968': '立積',
    // 面板、航運、金融與熱門ETF
    '2409': '友達', '3481': '群創', '2308': '台達電', '2881': '富邦金', '2882': '國泰金', 
    '2891': '中信金', '2884': '玉山金', '5880': '合庫金', '2883': '凱基金', '2886': '兆豐金',
    '0050': '元大台灣50', '0056': '元大高股息', '00878': '國泰永續高股息', '00919': '群益台灣精選高息',
    '2603': '長榮', '2609': '陽明', '2615': '萬海', '2618': '長榮航', '2610': '華航', '2002': '中鋼'
  },
  '日股': {
    // 軟體 AI、網路資訊科技與系統整合大廠
    '3993': 'PKSHA', '5574': 'ABEJA', '338A': 'ZenmuTech', '4704': '趨勢科技(TrendMicro)',
    '9613': 'NTT Data', '8056': 'BIPROGY', '9719': 'SCSK', '6701': '日本電氣(NEC)', 
    '6702': '富士通', '9684': 'SQUARE ENIX', '9984': '軟銀集團', '4689': 'LINE Yahoo',
    '4385': 'Mercari', '3659': 'Nexon', '9433': 'KDDI',
    // 半導體設備、精密封裝材料、自動化科技
    '8035': '東京威力科創', '6920': 'Lasertec', '6146': 'DISCO', '6857': '愛德萬測試', 
    '7735': 'SCREEN', '6526': 'Socionext', '4063': '信越化學', '6981': '村田製作所',
    '3436': 'SUMCO', '6723': '瑞薩電子', '6963': '羅姆(ROHM)', '6762': 'TDK',
    '6707': '三肯電氣(Sanken)', '6871': '日本電子材料', '6861': 'Keyence', '6754': 'Anritsu',
    // 其他傳統與科技巨頭
    '6758': '索尼(SONY)', '6501': '日立', '6503': '三菱電機', 
    '6752': '松下電器', '6954': '發那科', '7203': '豐田汽車', '8306': '三菱日聯', 
    '7974': '任天堂', '9983': '迅銷(Uniqlo)', '7201': '日產汽車', '9101': '日本郵船', 
    '8411': '瑞穗金融', '4502': '武田藥品', '9432': '日本電信電話', '8058': '三菱商事', 
    '8001': '伊藤忠', '9107': '川崎汽船', '9104': '商船三井'
  },
  '美股': {
    // 半導體與核心硬體鏈
    'NVDA': '輝達', 'AMD': '超微', 'AVGO': '博通', 'MU': '美光科技', 
    'INTC': '英特爾', 'QCOM': '高通', 'TXN': '德州儀器', 'AMAT': '應用材料', 
    'LRCX': '科林研發', 'ASML': '艾司摩爾', 'TSM': '台積電ADR', 'ARM': '安謀',
    'MRVL': '邁威爾科技', 'ADI': '亞德諾半導體', 'NXPI': '恩智浦', 'ON': '安森美', 'KLAC': '科磊',
    // 雲端、大型軟體工具、網際網路資安與AI巨頭
    'AAPL': '蘋果公司', 'MSFT': '微軟', 'GOOGL': 'Alphabet (Google)', 'META': 'Meta', 
    'AMZN': '亞馬遜', 'NFLX': '網飛', 'PLTR': 'Palantir', 'PANW': '帕羅奧圖網路', 
    'SMCI': '美超微', 'COIN': 'Coinbase', 'ORCL': '甲骨文', 'SNPS': '新思科技', 
    'CDNS': '益華电脑', 'CRWD': 'CrowdStrike', 'NET': 'Cloudflare', 'DDOG': 'Datadog',
    'NOW': 'ServiceNow', 'ADBE': 'Adobe', 'CRM': '賽富時(Salesforce)', 'CSCO': '思科(Cisco)',
    'IBM': '國際商業機器(IBM)', 'SHOP': 'Shopify',
    // 大型權值股
    'TSLA': '特斯拉', 'BRK.B': '波克夏B', 'JPM': '摩根大通', 'V': 'Visa', 
    'COST': '好市多', 'DIS': '迪士尼', 'LLY': '禮來', 'UNH': '聯合健康', 
    'JNJ': '強生', 'XOM': '埃克森美孚', 'HD': '家得寶', 'PG': '寶僑'
  }
}

const CURRENCY_MAP = {
  '台股': 'NT$',
  '日股': '¥',
  '美股': '$'
}

const ACCOUNT_TYPE_STYLES = {
  '特定區分': { bg: '#1E40AF', text: '#fff' },      
  '一般區分': { bg: '#B91C1C', text: '#fff' },      
  'NISA':     { bg: '#D97706', text: '#fff' },      
  '-':        { bg: '#4B5563', text: '#fff' }      
}

const UNIFIED_STYLES = {
  tabContainer: {
    width: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  cardSection: {
    backgroundColor: '#1f2937', 
    padding: '16px', 
    borderRadius: '8px',
    width: '100%',
    boxSizing: 'border-box'
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState('current')
  const [marketFilter, setMarketFilter] = useState('全部')
  const [realizedMarketFilter, setRealizedMarketFilter] = useState('全部') 
  const [chartMarket, setChartMarket] = useState('台股')

  // 歷史績效篩選狀態：新增市場篩選
  const [perfRoundFilter, setPerfRoundFilter] = useState('')
  const [perfMarketFilter, setPerfMarketFilter] = useState('全部')

  // 多帳號系統狀態
  const [accountList, setAccountList] = useLocalStorage(
  'accountList',['主要帳戶', '核心投機'])
  const [currentAccount, setCurrentAccount] = useLocalStorage(
  'currentAccount','主要帳戶')
  const [inputNewAccount, setInputNewAccount] = useState('')

  // 防呆歷史紀錄棧
  const [historyStack, setHistoryStack] = useLocalStorage(
  'historyStack',[])

  // 歷史績效數據庫
 const [performanceList, setPerformanceList] = useLocalStorage(
  'performanceList',
  [
    { id: 99, accountIdent: '主要帳戶', market: '台股', code: '2330', name: '台積電', cost: 800, shares: 1000, sellPrice: 900, grossProfit: 100000, profit: 75000, accountType: '-', tax: 4425, selfReportedTax: 0, profitSharing: 20569, date: '2026/05/20', sharingRound: '1' },
    { id: 98, accountIdent: '主要帳戶', market: '美股', code: 'NVDA', name: '輝達', cost: 100, shares: 100, sellPrice: 120, grossProfit: 2000, profit: 1500, accountType: '-', tax: 0, selfReportedTax: 0, profitSharing: 500, date: '2026/05/25', sharingRound: '1' },
    { id: 97, accountIdent: '主要帳戶', market: '台股', code: '2454', name: '聯發科', cost: 1000, shares: 1000, sellPrice: 1200, grossProfit: 200000, profit: 150000, accountType: '-', tax: 6710, selfReportedTax: 0, profitSharing: 48323, date: '2026/06/02', sharingRound: '2' }
  ]
)
  
  // 獲利賣出頁面的選取項目暫存
  const [selectedRealizedIds, setSelectedRealizedIds] = useState([])

  // 未賣出持股
  const [portfolio, setPortfolio] = useLocalStorage(
  'portfolio',
  [
    { id: 1, accountIdent: '主要帳戶', market: '台股', code: '2330', name: '台積電', cost: 950, shares: 1000, currentPrice: 1010, accountType: '-' },
    { id: 2, accountIdent: '主要帳戶', market: '日股', code: '7203', name: '豐田汽車', cost: 2600, shares: 100, currentPrice: 2650, accountType: '特定區分' },
    { id: 3, accountIdent: '主要帳戶', market: '日股', code: '7974', name: '任天堂', cost: 7500, shares: 100, currentPrice: 7800, accountType: '一般區分' },
    { id: 4, accountIdent: '主要帳戶', market: '美股', code: 'NVDA', name: '輝達', cost: 120, shares: 50, currentPrice: 125, accountType: '-' }
  ]
)

  // 已賣出紀錄
  const [realizedList, setRealizedList] = useLocalStorage(
  'realizedList',
  [
    { id: 101, accountIdent: '主要帳戶', market: '美股', code: 'AAPL', name: '蘋果公司', cost: 180, shares: 20, sellPrice: 220, grossProfit: 800, profit: 600, accountType: '-', tax: 0, selfReportedTax: 0, profitSharing: 200, date: '2026/06/01' },
    { id: 102, accountIdent: '主要帳戶', market: '台股', code: '2454', name: '聯發科', cost: 1200, shares: 500, sellPrice: 1100, grossProfit: -50000, profit: -51505, accountType: '-', tax: 1505, selfReportedTax: 0, profitSharing: 0, date: '2026/06/05' }
  ])

  // 手動登錄歷史績效表單狀態
  const [mMarket, setMMarket] = useState('台股')
  const [mCode, setMCode] = useState('')
  const [mName, setMName] = useState('')
  const [mCost, setMCost] = useState('')
  const [mSellPrice, setMSellPrice] = useState('')
  const [mShares, setMShares] = useState('')
  const [mGross, setMGross] = useState('')
  const [mSharing, setMSharing] = useState('')
  const [mNet, setMNet] = useState('')
  const [mRound, setMRound] = useState('1')
  const [mDate, setMDate] = useState(new Date().toISOString().split('T')[0])

  const [market, setMarket] = useState('台股')
  const [code, setCode] = useState('')
  const [name, setName] = useState('') 
  const [cost, setCost] = useState('')
  const [shares, setShares] = useState('')
  const [accountType, setAccountType] = useState('特定區分') 

  // 自動帶入與連動邏輯
  useEffect(() => {
    const upperCode = code.toUpperCase().trim()
    if (STOCK_DICTIONARY[market]?.[upperCode]) {
      if (name.trim() !== STOCK_DICTIONARY[market][upperCode]) {
        setName(STOCK_DICTIONARY[market][upperCode])
      }
    }
  }, [code, market])

  useEffect(() => {
    const trimmedName = name.trim()
    if (!trimmedName) return
    const dict = STOCK_DICTIONARY[market]
    if (dict) {
      const foundCode = Object.keys(dict).find(key => dict[key] === trimmedName)
      if (foundCode && code.toUpperCase().trim() !== foundCode) {
        setCode(foundCode)
      }
    }
  }, [name, market])

  useEffect(() => {
    const upperCode = mCode.toUpperCase().trim()
    if (STOCK_DICTIONARY[mMarket]?.[upperCode]) {
      if (mName.trim() !== STOCK_DICTIONARY[mMarket][upperCode]) {
        setMName(STOCK_DICTIONARY[mMarket][upperCode])
      }
    }
  }, [mCode, mMarket])

  useEffect(() => {
    const trimmedName = mName.trim()
    if (!trimmedName) return
    const dict = STOCK_DICTIONARY[mMarket]
    if (dict) {
      const foundCode = Object.keys(dict).find(key => dict[key] === trimmedName)
      if (foundCode && mCode.toUpperCase().trim() !== foundCode) {
        setMCode(foundCode)
      }
    }
  }, [mName, mMarket])

  // 防呆儲存機制
  const pushSnapshot = () => {
    setHistoryStack(prev => [
      ...prev, 
      {
        portfolio: JSON.parse(JSON.stringify(portfolio)),
        realizedList: JSON.parse(JSON.stringify(realizedList)),
        performanceList: JSON.parse(JSON.stringify(performanceList)),
        accountList: [...accountList],
        currentAccount
      }
    ])
  }

  const handleUndo = () => {
    if (historyStack.length === 0) {
      alert('目前沒有可以返回的上一步紀錄喔！')
      return
    }
    const nextStack = [...historyStack]
    const prevState = nextStack.pop()
    
    setPortfolio(prevState.portfolio)
    setRealizedList(prevState.realizedList)
    setPerformanceList(prevState.performanceList)
    if (prevState.accountList) setAccountList(prevState.accountList)
    if (prevState.currentAccount) setCurrentAccount(prevState.currentAccount)
    setHistoryStack(nextStack)
  }

  const handleCreateAccount = () => {
    const nameTrimmed = inputNewAccount.trim()
    if (!nameTrimmed) return
    if (accountList.includes(nameTrimmed)) {
      alert('這個帳號名稱已經存在囉！')
      return
    }
    setAccountList([...accountList, nameTrimmed])
    setCurrentAccount(nameTrimmed)
    setInputNewAccount('')
  }

  const handleDeleteAccount = () => {
    if (accountList.length <= 1) {
      alert('這是您唯一的基礎帳戶，系統規定至少必須保留一個帳戶喔！')
      return
    }
    if (window.confirm(`⚠️【重要安全警告】\n您確定要刪除整個帳戶「${currentAccount}」嗎？\n這將會同步清除該帳戶旗下的所有在手持股、賣出明細以及歷史績效數據！`)) {
      if (window.confirm(`🛑【最終防呆確認】\n請再次確認！刪除「${currentAccount}」後數據將全部消失（但可按「上一步」救回）。真的要執行刪除嗎？`)) {
        pushSnapshot()
        const remainingAccounts = accountList.filter(acc => acc !== currentAccount)
        
        setPortfolio(portfolio.filter(s => s.accountIdent !== currentAccount))
        setRealizedList(realizedList.filter(item => item.accountIdent !== currentAccount))
        setPerformanceList(performanceList.filter(item => item.accountIdent !== currentAccount))
        
        setAccountList(remainingAccounts)
        setCurrentAccount(remainingAccounts[0])
        alert(`帳戶「${currentAccount}」已成功刪除。`)
      }
    }
  }

  const currentAssetTotals = portfolio
    .filter(stock => stock.accountIdent === currentAccount)
    .reduce((acc, stock) => {
      acc[stock.market] += (stock.currentPrice * stock.shares)
      return acc
    }, { '台股': 0, '日股': 0, '美股': 0 })

  const realizedTotals = realizedList
    .filter(item => item.accountIdent === currentAccount)
    .reduce((acc, item) => {
      acc.profit[item.market] += item.profit
      acc.sharing[item.market] += (item.profitSharing || 0)
      if (item.market === '日股') {
        acc.selfTax += (item.selfReportedTax || 0)
      }
      return acc
    }, { profit: { '台股': 0, '日股': 0, '美股': 0 }, sharing: { '台股': 0, '日股': 0, '美股': 0 }, selfTax: 0 })

  const handleAddStock = () => {
    if (!code || !cost || !shares) { alert('請填寫所有欄位喔！'); return; }
    pushSnapshot()

    const finalName = name.trim() || code.toUpperCase().trim()
    const targetCode = code.toUpperCase().trim()
    const inputCost = Number(cost)
    const inputShares = Number(shares)
    const targetAccountType = market === '日股' ? accountType : '-'

    const existingIndex = portfolio.findIndex(stock => 
      stock.accountIdent === currentAccount && stock.market === market && stock.code === targetCode && stock.accountType === targetAccountType
    )

    if (existingIndex > -1) {
      const existing = portfolio[existingIndex]
      const nextShares = existing.shares + inputShares
      const nextTotalCost = (existing.cost * existing.shares) + (inputCost * inputShares)
      const avgCost = Math.round((nextTotalCost / nextShares) * 100) / 100

      const updatedPortfolio = [...portfolio]
      updatedPortfolio[existingIndex] = {
        ...existing, shares: nextShares, cost: avgCost, currentPrice: inputCost 
      }
      setPortfolio(updatedPortfolio)
    } else {
      setPortfolio([...portfolio, {
        id: Date.now(), accountIdent: currentAccount, market, code: targetCode, name: finalName,
        cost: inputCost, shares: inputShares, currentPrice: inputCost, accountType: targetAccountType
      }])
    }
    setCode(''); setName(''); setCost(''); setShares('')
  }

  const handleDeleteStock = (id, name) => {
    if (window.confirm(`確定要直接刪除 ${name} 嗎？(不計損益)`)) {
      pushSnapshot()
      setPortfolio(portfolio.filter(s => s.id !== id))
    }
  }

  const handleDeleteRealizedStock = (id, name) => {
    if (window.confirm(`確定要刪除 ${name} 的這筆賣出對帳單嗎？`)) {
      pushSnapshot()
      setRealizedList(realizedList.filter(item => item.id !== id))
      setSelectedRealizedIds(selectedRealizedIds.filter(idx => idx !== id))
    }
  }

  const handleSellStock = (stock) => {
  const symbol = CURRENCY_MAP[stock.market]
  const sellPriceInput = window.prompt(`請輸入 ${stock.name} 的【賣出單價 (${symbol})】:`)
  if (!sellPriceInput) return 

  const sellSharesInput = window.prompt(`請輸入賣出股數 (目前持有 ${stock.shares.toLocaleString()} 股)：`)
  if (!sellSharesInput) return 
  
  // 1. 確實將輸入轉換為數字類型
  const sellPrice = Number(sellPriceInput)
  const sellShares = Number(sellSharesInput)

  // 💡 新增防呆：檢查輸入是否為有效數字
  if (isNaN(sellPrice) || isNaN(sellShares) || sellPrice <= 0 || sellShares <= 0) {
    alert('請輸入正確的數字喔！')
    return
  }

  // 💡 新增防呆：檢查賣出股數是否大於持有股數
  if (sellShares > stock.shares) {
    alert(`庫存不足！您目前只有 ${stock.shares.toLocaleString()} 股，無法賣出 ${sellShares.toLocaleString()} 股。`)
    return
  }

  const todayStr = new Date().toISOString().split('T')[0].replace(/-/g, '/')
  const sellDateInput = window.prompt(`請輸入賣出日期：`, todayStr)
  const finalRealizedDate = sellDateInput ? sellDateInput.trim() : todayStr

  pushSnapshot()

  // 2. 現在 sellPrice 已經正確宣告，這裡就不會再噴錯了
  const grossProfit = (sellPrice - stock.cost) * sellShares
  let tax = 0; let selfReportedTax = 0; let profitSharing = 0   

  if (stock.market === '台股') {
    const buyAmount = stock.cost * sellShares
    const sellAmount = sellPrice * sellShares
    
    const buyFee = Math.max(20, Math.round(buyAmount * 0.001425))   
    const sellFee = Math.max(20, Math.round(sellAmount * 0.001425)) 
    const twTax = Math.round(sellAmount * 0.003)                    
    
    tax = buyFee + sellFee + twTax 
    
    const afterTaxProfit = grossProfit - tax 
    if (afterTaxProfit > 0) {
      profitSharing = Math.round(afterTaxProfit * 0.25)
    }
  } else if (grossProfit > 0) {
    if (stock.market === '日股') {
      if (stock.accountType === '特定區分') tax = Math.round(grossProfit * 0.20315) 
      else if (stock.accountType === '一般區分') selfReportedTax = Math.round(grossProfit * 0.20315) 
    }
    const afterTaxProfit = grossProfit - tax - selfReportedTax
    const sharingRate = stock.market === '美股' ? 0.25 : 0.20
    profitSharing = Math.round(afterTaxProfit * sharingRate)
  } else {
    if (stock.market === '日股' && stock.accountType === '一般區分') {
      selfReportedTax = Math.round(grossProfit * 0.20315)
    }
  }

  const finalProfit = grossProfit - tax - selfReportedTax - profitSharing

  // 3. 寫入已賣出紀錄
  setRealizedList([{
    id: Date.now(), accountIdent: currentAccount, market: stock.market, code: stock.code, name: stock.name,
    cost: stock.cost, shares: sellShares, sellPrice, grossProfit, profit: finalProfit,
    accountType: stock.accountType, tax, selfReportedTax, profitSharing, date: finalRealizedDate
  }, ...realizedList])

  // 4. 更新持股庫存（全賣就刪除，部分賣就扣除股數）
  if (sellShares === stock.shares) {
    setPortfolio(portfolio.filter(s => s.id !== stock.id))
  } else {
    setPortfolio(portfolio.map(s => s.id === stock.id ? { ...s, shares: s.shares - sellShares } : s))
  }
}

  const handleToggleSelectRealized = (id) => {
    if (selectedRealizedIds.includes(id)) {
      setSelectedRealizedIds(selectedRealizedIds.filter(item => item !== id))
    } else {
      setSelectedRealizedIds([...selectedRealizedIds, id])
    }
  }

  const handleSaveToPerformance = () => {
    if (selectedRealizedIds.length === 0) return

    const targets = realizedList.filter(item => selectedRealizedIds.includes(item.id))
    const roundInput = window.prompt(`請輸入這批選取項目 (${targets.length} 筆) 的【分潤批次】\n(例如輸入: 1 或 2)`, "1")
    if (roundInput === null) return 

    pushSnapshot()

    const finalRound = roundInput.trim() || '1'
    const itemsWithSharingRound = targets.map(item => ({
      ...item,
      sharingRound: finalRound
    }))

    setPerformanceList(prev => [...itemsWithSharingRound, ...prev])
    setRealizedList(prev => prev.filter(item => !selectedRealizedIds.includes(item.id)))
    setSelectedRealizedIds([])
    alert(`成功封存！已將 ${itemsWithSharingRound.length} 筆紀錄一次性轉移至第 ${finalRound} 次分潤。`)
  }

  const handleDeletePerformanceStock = (id, name) => {
    if (window.confirm(`確定要徹底刪除歷史績效中 ${name} 的存檔嗎？`)) {
      pushSnapshot()
      setPerformanceList(performanceList.filter(item => item.id !== id))
    }
  }

  const handleManualPerformanceAdd = () => {
    if (!mCode || !mGross || !mNet) {
      alert('請填寫基本股票代號、毛利與實拿淨利喔！')
      return
    }
    pushSnapshot()

    const finalName = mName.trim() || mCode.toUpperCase().trim()
    const finalDate = mDate ? mDate.replace(/-/g, '/') : new Date().toLocaleDateString()

    const newItem = {
      id: Date.now(),
      accountIdent: currentAccount,
      market: mMarket,
      code: mCode.toUpperCase().trim(),
      name: finalName,
      cost: Number(mCost) || 0,
      shares: Number(mShares) || 0,
      sellPrice: Number(mSellPrice) || 0,
      grossProfit: Number(mGross),
      profit: Number(mNet),
      accountType: '-',
      tax: 0,
      selfReportedTax: 0,
      profitSharing: Number(mSharing) || 0,
      date: finalDate,
      sharingRound: mRound.trim() || '1'
    }

    setPerformanceList([newItem, ...performanceList])
    alert(`歷史績效登錄成功！(${finalName})`)
    setMCode(''); setMName(''); setMCost(''); setMSellPrice(''); setMShares(''); setMGross(''); setMSharing(''); setMNet('')
  }

  const accountPortfolio = portfolio.filter(s => s.accountIdent === currentAccount)
  const filteredPortfolio = marketFilter === '全部' ? accountPortfolio : accountPortfolio.filter(s => s.market === marketFilter)
  
  const accountRealized = realizedList.filter(s => s.accountIdent === currentAccount)
  const filteredRealized = realizedMarketFilter === '全部' ? accountRealized : accountRealized.filter(s => s.market === realizedMarketFilter)

  // 績效頁面數據過濾：整合「市場分類按鈕」與「批次過濾」
  const accountPerformance = performanceList.filter(s => s.accountIdent === currentAccount)
  const filteredPerformance = accountPerformance.filter(perf => {
    const matchesMarket = perfMarketFilter === '全部' || perf.market === perfMarketFilter
    const searchKeyword = perfRoundFilter.trim()
    const matchesRound = !searchKeyword || perf.sharingRound.includes(searchKeyword)
    return matchesMarket && matchesRound
  })

  const groupTotals = filteredPerformance.reduce((acc, item) => {
    const gross = item.grossProfit !== undefined ? item.grossProfit : item.profit
    if (!acc[item.market]) {
      acc[item.market] = { gross: 0, sharing: 0, net: 0 }
    }
    acc[item.market].gross += gross
    acc[item.market].sharing += (item.profitSharing || 0)
    acc[item.market].net += item.profit
    return acc
  }, {})

  const currentRealizedStatsByMarket = filteredRealized.reduce((acc, item) => {
    const m = item.market
    if (!acc[m]) {
      acc[m] = { gross: 0, tax: 0, selfTax: 0, sharing: 0, net: 0 }
    }
    acc[m].gross += item.grossProfit
    if (m === '日股') {
      acc[m].tax += (item.tax || 0)
      acc[m].selfTax += (item.selfReportedTax || 0)
    } else {
      acc[m].tax += (item.tax || 0) + (item.selfReportedTax || 0)
    }
    acc[m].sharing += (item.profitSharing || 0)
    acc[m].net += item.profit
    return acc
  }, {})

  // 趨勢圖數據處理：維持圖表繪製累積金額，但額外計算「當週個別淨利」
  const weeklyProfitData = [
    { label: '05/13週', start: new Date('2026-05-07'), end: new Date('2026-05-13') },
    { label: '05/20週', start: new Date('2026-05-14'), end: new Date('2026-05-20') },
    { label: '05/27週', start: new Date('2026-05-21'), end: new Date('2026-05-27') },
    { label: '06/03週', start: new Date('2026-05-28'), end: new Date('2026-06-03') },
    { label: '本週(06/10)', start: new Date('2026-06-04'), end: new Date('2026-06-10') }
  ].map(w => {
    const cumulativeProfitSum = accountPerformance
      .filter(item => {
        if (item.market !== chartMarket) return false
        const d = new Date(item.date.replace(/\//g, '-'))
        return d <= w.end  
      })
      .reduce((sum, item) => sum + item.profit, 0)

    // 獨立算出該指定週區間內的實拿淨利總和
    const thisWeekProfit = accountPerformance
      .filter(item => {
        if (item.market !== chartMarket) return false
        const d = new Date(item.date.replace(/\//g, '-'))
        return d >= w.start && d <= w.end
      })
      .reduce((sum, item) => sum + item.profit, 0)

    return { week: w.label, profit: cumulativeProfitSum, thisWeekProfit }
  })

  const chartWidth = 500, chartHeight = 220, padding = 45
  const profitValues = weeklyProfitData.map(d => d.profit)
  const maxProfit = Math.max(...profitValues, 5000) * 1.15
  const minProfit = Math.min(...profitValues, -5000) * 1.15
  const profitRange = maxProfit - minProfit || 1

  const chartPoints = weeklyProfitData.map((item, index) => {
    const x = padding + (index / (weeklyProfitData.length - 1)) * (chartWidth - padding * 2)
    const y = chartHeight - padding - ((item.profit - minProfit) / profitRange) * (chartHeight - padding * 2)
    return `${x},${y}`
  }).join(' ')

  const zeroLineY = chartHeight - padding - ((0 - minProfit) / profitRange) * (chartHeight - padding * 2)

  return (
    <div style={{ padding: '15px', fontFamily: 'sans-serif', backgroundColor: '#111827', color: '#fff', minHeight: '100vh', width: '100%', boxSizing: 'border-box' }}>
      
      {/* 帳號控制列 */}
      <div style={{ display: 'flex', gap: '8px', backgroundColor: '#1f2937', padding: '10px', borderRadius: '8px', marginBottom: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#3B82F6' }}>👤 帳號:</span>
          <select value={currentAccount} onChange={(e) => setCurrentAccount(e.target.value)} style={{ padding: '5px', borderRadius: '4px', backgroundColor: '#111827', color: '#fff', border: '1px solid #374151', fontSize: '12px', fontWeight: 'bold' }}>
            {accountList.map(acc => <option key={acc} value={acc}>{acc}</option>)}
          </select>
          <button onClick={handleDeleteAccount} style={{ padding: '4px 8px', backgroundColor: '#EF4444', border: 'none', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', color: '#fff', marginLeft: '4px' }}>🗑️ 刪除</button>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          <input type="text" placeholder="新增帳號名" value={inputNewAccount} onChange={(e) => setInputNewAccount(e.target.value)} style={{ padding: '5px 8px', borderRadius: '4px', border: 'none', fontSize: '12px', width: '85px', color: '#000' }} />
          <button onClick={handleCreateAccount} style={{ padding: '5px 10px', backgroundColor: '#3B82F6', border: 'none', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', color: '#fff' }}>開戶</button>
        </div>
        <button onClick={handleUndo} disabled={historyStack.length === 0} style={{ padding: '5px 10px', backgroundColor: historyStack.length > 0 ? '#DC2626' : '#4B5563', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', cursor: historyStack.length > 0 ? 'pointer' : 'not-allowed', opacity: historyStack.length > 0 ? 1 : 0.5 }}>
          🔙 上一步
        </button>
      </div>

      {/* 頂部大標題 */}
      <header style={{ borderBottom: '1px solid #374151', paddingBottom: '12px', marginBottom: '15px', width: '100%', boxSizing: 'border-box' }}>
        <h1 style={{ fontSize: '18px', margin: '0 0 12px 0', textAlign: 'center', fontWeight: 'bold', color: '#ffffff' }}>千万兩股市Lab 🌐 ({currentAccount})</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {['台股', '日股', '美股'].map((m) => {
            const colorMap = { '台股': '#3B82F6', '日股': '#FBBF24', '美股': '#A78BFA' }
            return (
              <div key={m} style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#1f2937', padding: '8px 12px', borderRadius: '6px', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: colorMap[m] }}>{m}帳戶</span>
                <div style={{ fontSize: '13px', textAlign: 'right' }}>
                  市值: <strong style={{ color: '#10B981' }}>{CURRENCY_MAP[m]} {currentAssetTotals[m].toLocaleString()}</strong> | 
                  未封存純利: <strong style={{ color: realizedTotals.profit[m] >= 0 ? '#10B981' : '#EF4444' }}>{realizedTotals.profit[m] >= 0 ? '+' : ''}{CURRENCY_MAP[m]} {realizedTotals.profit[m].toLocaleString()}</strong>
                </div>
              </div>
            )
          })}
        </div>
      </header>

      {/* 主導覽列 - 4. 出場文字修改為賣出 */}
      <nav style={{ display: 'flex', gap: '6px', marginBottom: '15px', width: '100%', boxSizing: 'border-box' }}>
        <button onClick={() => setActiveTab('current')} style={{ flex: 1, padding: '10px 2px', borderRadius: '6px', border: 'none', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', backgroundColor: activeTab === 'current' ? '#3B82F6' : '#374151', color: '#fff' }}>📊持股</button>
        <button onClick={() => setActiveTab('realized')} style={{ flex: 1, padding: '10px 2px', borderRadius: '6px', border: 'none', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', backgroundColor: activeTab === 'realized' ? '#10B981' : '#374151', color: '#fff' }}>🎯賣出</button>
        <button onClick={() => setActiveTab('performance')} style={{ flex: 1, padding: '10px 2px', borderRadius: '6px', border: 'none', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', backgroundColor: activeTab === 'performance' ? '#EC4899' : '#374151', color: '#fff' }}>🏆績效</button>
        <button onClick={() => setActiveTab('charts')} style={{ flex: 1, padding: '10px 2px', borderRadius: '6px', border: 'none', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', backgroundColor: activeTab === 'charts' ? '#FBBF24' : '#374151', color: '#fff' }}>📈趨勢</button>
      </nav>

      {/* ================= PAGE 1: 在手持股 ================= */}
      {activeTab === 'current' && (
        <div style={UNIFIED_STYLES.tabContainer}>
          <section style={UNIFIED_STYLES.cardSection}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>＋ 新增買入紀錄 ({currentAccount})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                <select value={market} onChange={(e) => setMarket(e.target.value)} style={{ padding: '8px', borderRadius: '4px', color: '#000', fontWeight: 'bold', backgroundColor: '#fff' }}>
                  <option>台股</option><option>日股</option><option>美股</option>
                </select>
                <input type="text" placeholder="代號" value={code} onChange={(e) => setCode(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: 'none', flex: 1, minWidth: 0, color: '#000' }} />
                {/* 1. 綁定動態搜尋建議名單 */}
                <input type="text" placeholder="公司名稱" value={name} onChange={(e) => setName(e.target.value)} list="current-stock-suggestions" style={{ padding: '8px', borderRadius: '4px', border: 'none', flex: 1.5, minWidth: 0, color: '#000' }} />
                <datalist id="current-stock-suggestions">
                  {Object.values(STOCK_DICTIONARY[market] || {}).map(n => <option key={n} value={n} />)}
                </datalist>
              </div>
              <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                <input type="number" placeholder={`單價 (${CURRENCY_MAP[market]})`} value={cost} onChange={(e) => setCost(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: 'none', flex: 1, minWidth: 0, color: '#000' }} />
                <input type="number" placeholder="股數" value={shares} onChange={(e) => setShares(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: 'none', flex: 1, minWidth: 0, color: '#000' }} />
                {market === '日股' && (
                  <select value={accountType} onChange={(e) => setAccountType(e.target.value)} style={{ padding: '8px', borderRadius: '4px', backgroundColor: ACCOUNT_TYPE_STYLES[accountType]?.bg || '#374151', color: '#fff', fontWeight: 'bold', border: 'none', flex: 1.2, minWidth: 0 }}>
                    <option value="特定區分">特定區分</option><option value="一般區分">一般區分</option><option value="NISA">NISA</option>
                  </select>
                )}
                <button onClick={handleAddStock} style={{ padding: '8px 16px', backgroundColor: '#3B82F6', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', flexShrink: 0 }}>新增</button>
              </div>
            </div>
          </section>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {['全部', '台股', '日股', '美股'].map((m) => (
              <button key={m} onClick={() => setMarketFilter(m)} style={{ padding: '6px 14px', borderRadius: '20px', border: 'none', fontSize: '13px', cursor: 'pointer', fontWeight: 'bold', backgroundColor: marketFilter === m ? '#3B82F6' : '#374151', color: '#fff' }}>{m}</button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredPortfolio.map((stock) => {
              const profit = (stock.currentPrice * stock.shares) - (stock.cost * stock.shares)
              const totalCostAmount = stock.cost * stock.shares

              return (
                <div key={stock.id} style={{ backgroundColor: '#1f2937', padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: `4px solid ${profit >= 0 ? '#10B981' : '#EF4444'}` }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <strong style={{ fontSize: '16px' }}>{stock.name}</strong> 
                      <span style={{ color: '#9ca3af', fontSize: '12px' }}>({stock.code})</span>
                      {stock.market === '日股' && (
                        <span style={{ backgroundColor: ACCOUNT_TYPE_STYLES[stock.accountType]?.bg || '#4B5563', color: ACCOUNT_TYPE_STYLES[stock.accountType]?.text || '#fff', fontSize: '11px', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                          {stock.accountType}
                        </span>
                      )}
                    </div>
                    <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#9ca3af' }}>持有: {stock.shares.toLocaleString()} 股 | 均價: {stock.cost}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#ffffff', fontSize: '13px', fontWeight: 'bold' }}>
                        {CURRENCY_MAP[stock.market]} {Math.round(totalCostAmount).toLocaleString()}
                      </div>
                    </div>
                    {/* 4. 出場修改為賣出 */}
                    <button onClick={() => handleSellStock(stock)} style={{ backgroundColor: '#10B981', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '11px', cursor: 'pointer', fontWeight: 'bold' }}>💰 賣出</button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ================= PAGE 2: 獲利賣出紀錄 ================= */}
      {activeTab === 'realized' && (
        // 3. 修正拼字錯誤，變數改回 UNIFIED_STYLES.tabContainer 避免沒畫面
        <div style={UNIFIED_STYLES.tabContainer}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {['全部', '台股', '日股', '美股'].map((m) => (
                <button key={m} onClick={() => setRealizedMarketFilter(m)} style={{ padding: '6px 14px', borderRadius: '20px', border: 'none', fontSize: '13px', cursor: 'pointer', fontWeight: 'bold', backgroundColor: realizedMarketFilter === m ? '#10B981' : '#374151', color: '#fff' }}>{m}</button>
              ))}
            </div>
            {selectedRealizedIds.length > 0 && (
              <button onClick={handleSaveToPerformance} style={{ backgroundColor: '#EC4899', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                {/* 4. 出場修改為賣出 */}
                💾 保存選取 ({selectedRealizedIds.length}) 至歷史績效
              </button>
            )}
          </div>

          <section style={{ ...UNIFIED_STYLES.cardSection, backgroundColor: '#111827', border: '1px solid #10B981', padding: '12px' }}>
            <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '8px', fontWeight: 'bold' }}>
              {/* 4. 出場修改為賣出 */}
              📊 當前市場賣出統計（{currentAccount} 未封存明細）
            </div>
            {Object.keys(currentRealizedStatsByMarket).length === 0 ? (
              // 4. 出場修改為賣出
              <div style={{ fontSize: '13px', color: '#6b7280', textAlign: 'center', padding: '6px' }}>無賣出交易數據</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {Object.keys(currentRealizedStatsByMarket).map(m => {
                  const data = currentRealizedStatsByMarket[m]
                  const sym = CURRENCY_MAP[m]
                  return (
                    <div key={m} style={{ backgroundColor: '#1f2937', padding: '10px', borderRadius: '6px', borderLeft: '3px solid #10B981' }}>
                      <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#10B981', marginBottom: '6px' }}>
                        💰 {m} 結算區 ({sym})
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '12px' }}>
                        <div>總毛利: <strong style={{ color: data.gross >= 0 ? '#10B981' : '#EF4444' }}>{sym} {data.gross.toLocaleString()}</strong></div>
                        <div>
                          {m === '日股' ? `特定扣稅: ${sym}${data.tax.toLocaleString()}` : `估計扣稅/費: ${sym}${data.tax.toLocaleString()}`}
                        </div>
                        {m === '日股' && (
                          <div style={{ color: '#F87171' }}>一般區分(自行報稅): <span>{sym} {data.selfTax.toLocaleString()}</span></div>
                        )}
                        <div>操盤分潤: <strong style={{ color: '#FBBF24' }}>{sym} {data.sharing.toLocaleString()}</strong></div>
                        <div>實拿純利: <strong style={{ color: '#10B981' }}>{sym} {data.net.toLocaleString()}</strong></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredRealized.map((item) => {
              const isLoss = item.grossProfit < 0
              const statusColor = isLoss ? '#EF4444' : '#10B981'
              
              return (
                <div key={item.id} style={{ backgroundColor: '#1f2937', padding: '12px', borderRadius: '8px', display: 'flex', gap: '12px', borderLeft: `4px solid ${statusColor}` }}>
                  <input type="checkbox" checked={selectedRealizedIds.includes(item.id)} onChange={() => handleToggleSelectRealized(item.id)} style={{ width: '18px', height: '18px', cursor: 'pointer', marginTop: '4px' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                          <strong style={{ fontSize: '15px' }}>{item.name} ({item.code})</strong>
                          {item.market === '日股' && (
                            <span style={{ backgroundColor: ACCOUNT_TYPE_STYLES[item.accountType]?.bg || '#4B5563', color: '#fff', fontSize: '10px', padding: '1px 4px', borderRadius: '3px' }}>
                              {item.accountType}
                            </span>
                          )}
                          {/* 4. 出場修改為賣出 */}
                          <span style={{ fontSize: '11px', color: '#9ca3af', backgroundColor: '#111827', padding: '1px 5px', borderRadius: '3px' }}>📅 賣出: {item.date}</span>
                        </div>
                        {/* 4. 出場修改為賣出 */}
                        <span style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#9ca3af' }}>成本: {item.cost} → 賣出: {item.sellPrice} | 數量: {item.shares} 股</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '16px', fontWeight: 'bold', color: statusColor }}>
                          {isLoss ? '' : '+'}{CURRENCY_MAP[item.market]} {item.grossProfit.toLocaleString()}
                        </div>
                        <span style={{ fontSize: '10px', color: '#6b7280' }}>（交易毛利）</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'x', columnGap: '12px', rowGap: '2px', fontSize: '11px', color: '#9ca3af', marginTop: '6px', borderTop: '1px dashed #374151', paddingTop: '4px' }}>
                      <span style={{ color: '#fff', fontWeight: 'bold' }}>💰 實拿金額: <span style={{ color: item.profit >= 0 ? '#10B981' : '#EF4444' }}>{CURRENCY_MAP[item.market]} {item.profit.toLocaleString()}</span></span>
                      <span>原始毛利: {item.grossProfit.toLocaleString()}</span>
                      {item.tax > 0 && <span>{item.market === '台股' ? '費稅(手續費+證交稅): ' : '特定扣稅: '}{item.tax.toLocaleString()}</span>}
                      {item.selfReportedTax > 0 && <span>一般區分申報稅: {item.selfReportedTax.toLocaleString()}</span>}
                      {item.profitSharing > 0 && <span>操盤分潤: {item.profitSharing.toLocaleString()}</span>}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ================= PAGE 3: 🏆 歷史績效分頁 ================= */}
      {activeTab === 'performance' && (
        <div style={UNIFIED_STYLES.tabContainer}>
          
          {/* 手動獨立登錄績效表單區 */}
          <section style={{ ...UNIFIED_STYLES.cardSection, border: '1px dashed #EC4899' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#EC4899', fontWeight: 'bold' }}>✍️ 手動登錄歷史績效</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', boxSizing: 'border-box' }}>
              
              <div style={{ display: 'flex', gap: '6px', width: '100%' }}>
                <select value={mMarket} onChange={(e) => setMMarket(e.target.value)} style={{ padding: '6px', borderRadius: '4px', color: '#000', fontWeight: 'bold', fontSize: '12px', flexShrink: 0 }}>
                  <option>台股</option><option>日股</option><option>美股</option>
                </select>
                <input type="text" placeholder="代號" value={mCode} onChange={(e) => setMCode(e.target.value)} style={{ padding: '6px', borderRadius: '4px', border: 'none', flex: 1, minWidth: 0, boxSizing: 'border-box', fontSize: '12px', color: '#000' }} />
                {/* 1. 綁定手動績效登錄區之搜尋建議 */}
                <input type="text" placeholder="公司名稱" value={mName} onChange={(e) => setMName(e.target.value)} list="manual-stock-suggestions" style={{ padding: '6px', borderRadius: '4px', border: 'none', flex: 1.5, minWidth: 0, boxSizing: 'border-box', fontSize: '12px', color: '#000' }} />
                <datalist id="manual-stock-suggestions">
                  {Object.values(STOCK_DICTIONARY[mMarket] || {}).map(n => <option key={n} value={n} />)}
                </datalist>
              </div>

              <div style={{ display: 'flex', gap: '6px', width: '100%' }}>
                <input type="number" placeholder="均計成本(選填)" value={mCost} onChange={(e) => setMCost(e.target.value)} style={{ padding: '6px', borderRadius: '4px', border: 'none', flex: 1, minWidth: 0, boxSizing: 'border-box', fontSize: '11px', color: '#000' }} />
                {/* 4. 出場修改為賣出 */}
                <input type="number" placeholder="賣出單價(選填)" value={mSellPrice} onChange={(e) => setMSellPrice(e.target.value)} style={{ padding: '6px', borderRadius: '4px', border: 'none', flex: 1, minWidth: 0, boxSizing: 'border-box', fontSize: '11px', color: '#000' }} />
                <input type="number" placeholder="交易股數(選填)" value={mShares} onChange={(e) => setMShares(e.target.value)} style={{ padding: '6px', borderRadius: '4px', border: 'none', flex: 1, minWidth: 0, boxSizing: 'border-box', fontSize: '11px', color: '#000' }} />
              </div>

              <div style={{ display: 'flex', gap: '6px', width: '100%' }}>
                <input type="number" placeholder="交易毛利" value={mGross} onChange={(e) => setMGross(e.target.value)} style={{ padding: '6px', borderRadius: '4px', border: 'none', flex: 1, minWidth: 0, boxSizing: 'border-box', fontSize: '12px', color: '#000', fontWeight: 'bold' }} />
                <input type="number" placeholder="扣除分潤" value={mSharing} onChange={(e) => setMSharing(e.target.value)} style={{ padding: '6px', borderRadius: '4px', border: 'none', flex: 1, minWidth: 0, boxSizing: 'border-box', fontSize: '12px', color: '#000' }} />
                <input type="number" placeholder="實拿淨利" value={mNet} onChange={(e) => setMNet(e.target.value)} style={{ padding: '6px', borderRadius: '4px', border: 'none', flex: 1, minWidth: 0, boxSizing: 'border-box', fontSize: '12px', color: '#000', fontWeight: 'bold' }} />
              </div>

              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', width: '100%', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '11px', color: '#9ca3af' }}>分潤批次:</span>
                <input type="text" value={mRound} onChange={(e) => setMRound(e.target.value)} style={{ padding: '6px', borderRadius: '4px', border: 'none', width: '40px', minWidth: 0, boxSizing: 'border-box', fontSize: '12px', textAlign: 'center', color: '#000' }} />
                {/* 4. 出場修改為賣出 */}
                <span style={{ fontSize: '11px', color: '#9ca3af', marginLeft: '6px' }}>賣出日期:</span>
                <input type="date" value={mDate} onChange={(e) => setMDate(e.target.value)} style={{ padding: '5px', borderRadius: '4px', border: 'none', flex: 1, minWidth: 0, boxSizing: 'border-box', fontSize: '11px', color: '#000' }} />
                <button onClick={handleManualPerformanceAdd} style={{ padding: '6px 12px', backgroundColor: '#EC4899', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', flexShrink: 0 }}>登錄存檔</button>
              </div>

            </div>
          </section>

          {/* 績效分頁：新增台股、日股、美股篩選按鈕列 */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {['全部', '台股', '日股', '美股'].map((m) => (
              <button key={m} onClick={() => setPerfMarketFilter(m)} style={{ padding: '6px 14px', borderRadius: '20px', border: 'none', fontSize: '13px', cursor: 'pointer', fontWeight: 'bold', backgroundColor: perfMarketFilter === m ? '#EC4899' : '#374151', color: '#fff' }}>{m}</button>
            ))}
          </div>

          {/* 篩選批次 */}
          <section style={{ ...UNIFIED_STYLES.cardSection, border: '1px solid #EC4899', padding: '10px 14px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <h3 style={{ margin: '0', fontSize: '13px', color: '#EC4899', fontWeight: 'bold' }}>🔍 批次過濾:</h3>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <input 
                  type="text" 
                  placeholder="批次號" 
                  value={perfRoundFilter} 
                  onChange={(e) => setPerfRoundFilter(e.target.value)} 
                  style={{ width: '70px', padding: '6px 8px', borderRadius: '4px', border: 'none', color: '#000', fontWeight: 'bold', fontSize: '12px', textAlign: 'center' }}
                />
                {perfRoundFilter && (
                  <button onClick={() => setPerfRoundFilter('')} style={{ padding: '4px 8px', backgroundColor: '#374151', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>清除</button>
                )}
              </div>
            </div>
          </section>

          <section style={{ ...UNIFIED_STYLES.cardSection, backgroundColor: '#111827', border: '1px solid #374151' }}>
            <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '8px', fontWeight: 'bold' }}>
              📜 存檔紀錄摘要 ({currentAccount} · {perfMarketFilter} · {perfRoundFilter ? `第 ${perfRoundFilter} 次分潤` : '全部歷史備忘'})
            </div>
            {Object.keys(groupTotals).length === 0 ? (
              <div style={{ fontSize: '13px', color: '#6b7280' }}>無存檔數據</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {Object.keys(groupTotals).map(m => (
                  <div key={m} style={{ backgroundColor: '#1f2937', padding: '8px 12px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: '#FBBF24', fontWeight: 'bold' }}>{m} 紀錄</span>
                    <span>
                      毛利: {CURRENCY_MAP[m]}{groupTotals[m].gross.toLocaleString()} | 
                      分潤: {CURRENCY_MAP[m]}{groupTotals[m].sharing.toLocaleString()} | 
                      實拿: {CURRENCY_MAP[m]}{groupTotals[m].net.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredPerformance.length === 0 ? (
              <p style={{ color: '#6b7280', textAlign: 'center', padding: '20px', fontSize: '13px' }}>無歷史封存資料</p>
            ) : (
              filteredPerformance.map((perf) => {
                const gross = perf.grossProfit !== undefined ? perf.grossProfit : perf.profit
                return (
                  <div key={perf.id} style={{ backgroundColor: '#1f2937', padding: '12px', borderRadius: '8px', borderLeft: `4px solid ${gross >= 0 ? '#EC4899' : '#EF4444'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '10px', backgroundColor: '#EC4899', color: '#fff', padding: '1px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                            第 {perf.sharingRound} 次分潤
                          </span>
                          <span style={{ fontSize: '11px', color: '#9ca3af' }}>📅 {perf.date} 歸檔</span>
                        </div>
                        <strong style={{ fontSize: '15px' }}>{perf.name}</strong>
                        <span style={{ fontSize: '12px', color: '#9ca3af', marginLeft: '4px' }}>({perf.code} · {perf.market})</span>
                        {perf.shares > 0 && (
                          /* 4. 出場修改為賣出 */
                          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#9ca3af' }}>
                            數量: {perf.shares.toLocaleString()} 股 | 均價: {perf.cost} → 賣出: {perf.sellPrice}
                          </p>
                        )}
                      </div>
                      <button onClick={() => handleDeletePerformanceStock(perf.id, perf.name)} style={{ backgroundColor: 'transparent', color: '#6b7280', border: '1px solid #374151', borderRadius: '4px', padding: '2px 6px', fontSize: '11px', cursor: 'pointer' }}>移除</button>
                    </div>
                    <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px dashed #374151', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <div>毛利: <span style={{ color: gross >= 0 ? '#10B981' : '#EF4444' }}>{CURRENCY_MAP[perf.market]} {gross.toLocaleString()}</span></div>
                      <div>操盤分潤: <span style={{ color: '#FBBF24' }}>{CURRENCY_MAP[perf.market]} {perf.profitSharing.toLocaleString()}</span></div>
                      <div>淨利: <span style={{ color: '#10B981' }}>{CURRENCY_MAP[perf.market]} {perf.profit.toLocaleString()}</span></div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}

      {/* ================= PAGE 4: 📈 累積實拿淨利每週趨勢圖 ================= */}
      {activeTab === 'charts' && (
        <div style={UNIFIED_STYLES.tabContainer}>
          <section style={UNIFIED_STYLES.cardSection}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: '0', fontSize: '14px', color: '#fff' }}>📈 歷史每週「累積」實拿淨利走勢 ({chartMarket})</h3>
              <select value={chartMarket} onChange={(e) => setChartMarket(e.target.value)} style={{ padding: '4px', borderRadius: '4px', backgroundColor: '#111827', color: '#fff', border: '1px solid #374151' }}>
                <option>台股</option><option>日股</option><option>美股</option>
              </select>
            </div>
            
            <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ backgroundColor: '#111827', display: 'block' }}>
              {minProfit < 0 && maxProfit > 0 && (
                <line 
                  x1={padding} 
                  y1={zeroLineY} 
                  x2={chartWidth - padding} 
                  y2={zeroLineY} 
                  stroke="#4B5563" 
                  strokeDasharray="4"
                />
              )}
              <polyline fill="none" stroke="#10B981" strokeWidth="3" points={chartPoints} />
              {weeklyProfitData.map((item, index) => {
                const x = padding + (index / (weeklyProfitData.length - 1)) * (chartWidth - padding * 2)
                const y = chartHeight - padding - ((item.profit - minProfit) / profitRange) * (chartHeight - padding * 2)
                return (
                  <g key={index}>
                    <circle cx={x} cy={y} r="5" fill="#fff" />
                    {/* 修改此處標籤：數值呈現「當週實拿淨利」，走勢線仍反映「累積淨利」 */}
                    <text x={x} y={y - 10} fill="#10B981" fontSize="10" textAnchor="middle" fontWeight="bold">
                      {item.thisWeekProfit > 0 ? '+' : ''}{item.thisWeekProfit.toLocaleString()}
                    </text>
                    <text x={x} y={chartHeight - 12} fill="#fff" fontSize="10" textAnchor="middle">
                      {item.week}
                    </text>
                  </g>
                )
              })}
            </svg>
            <div style={{ marginTop: '12px', fontSize: '11px', color: '#9ca3af', textAlign: 'center', lineHeight: '1.4' }}>
              💡 此趨勢統計全歷史截至各指定週底的累積總實拿利潤。<br />
              前推各週若無新平倉或更動，累積數值將維持前一週水位前行。
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
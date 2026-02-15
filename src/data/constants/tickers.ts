export interface TickerDef {
  symbol: string;
  name: string;
  sector: string;
  subSector: string;
  industry: string;
  marketCap: number; // billions
}

export const TICKER_UNIVERSE: TickerDef[] = [
  // ===============================================
  // TECHNOLOGY
  // ===============================================

  // Software > Application Software (5)
  { symbol: 'CRM', name: 'Salesforce Inc', sector: 'Technology', subSector: 'Software', industry: 'Application Software', marketCap: 280 },
  { symbol: 'ADBE', name: 'Adobe Inc', sector: 'Technology', subSector: 'Software', industry: 'Application Software', marketCap: 230 },
  { symbol: 'INTU', name: 'Intuit Inc', sector: 'Technology', subSector: 'Software', industry: 'Application Software', marketCap: 180 },
  { symbol: 'WDAY', name: 'Workday Inc', sector: 'Technology', subSector: 'Software', industry: 'Application Software', marketCap: 65 },
  { symbol: 'ANSS', name: 'ANSYS Inc', sector: 'Technology', subSector: 'Software', industry: 'Application Software', marketCap: 30 },

  // Software > Systems Software (5)
  { symbol: 'MSFT', name: 'Microsoft Corp', sector: 'Technology', subSector: 'Software', industry: 'Systems Software', marketCap: 3100 },
  { symbol: 'ORCL', name: 'Oracle Corp', sector: 'Technology', subSector: 'Software', industry: 'Systems Software', marketCap: 320 },
  { symbol: 'PLTR', name: 'Palantir Technologies', sector: 'Technology', subSector: 'Software', industry: 'Systems Software', marketCap: 55 },
  { symbol: 'FTNT', name: 'Fortinet Inc', sector: 'Technology', subSector: 'Software', industry: 'Systems Software', marketCap: 58 },
  { symbol: 'GEN', name: 'Gen Digital Inc', sector: 'Technology', subSector: 'Software', industry: 'Systems Software', marketCap: 18 },

  // Software > Enterprise SaaS (5)
  { symbol: 'NOW', name: 'ServiceNow Inc', sector: 'Technology', subSector: 'Software', industry: 'Enterprise SaaS', marketCap: 185 },
  { symbol: 'TEAM', name: 'Atlassian Corp', sector: 'Technology', subSector: 'Software', industry: 'Enterprise SaaS', marketCap: 50 },
  { symbol: 'HUBS', name: 'HubSpot Inc', sector: 'Technology', subSector: 'Software', industry: 'Enterprise SaaS', marketCap: 28 },
  { symbol: 'ZS', name: 'Zscaler Inc', sector: 'Technology', subSector: 'Software', industry: 'Enterprise SaaS', marketCap: 30 },
  { symbol: 'DDOG', name: 'Datadog Inc', sector: 'Technology', subSector: 'Software', industry: 'Enterprise SaaS', marketCap: 42 },

  // Software > Cybersecurity Software (5)
  { symbol: 'PANW', name: 'Palo Alto Networks', sector: 'Technology', subSector: 'Software', industry: 'Cybersecurity Software', marketCap: 115 },
  { symbol: 'CRWD', name: 'CrowdStrike Holdings', sector: 'Technology', subSector: 'Software', industry: 'Cybersecurity Software', marketCap: 72 },
  { symbol: 'S', name: 'SentinelOne Inc', sector: 'Technology', subSector: 'Software', industry: 'Cybersecurity Software', marketCap: 8 },
  { symbol: 'CYBR', name: 'CyberArk Software', sector: 'Technology', subSector: 'Software', industry: 'Cybersecurity Software', marketCap: 12 },
  { symbol: 'TENB', name: 'Tenable Holdings', sector: 'Technology', subSector: 'Software', industry: 'Cybersecurity Software', marketCap: 5 },

  // Software > Developer Tools (5)
  { symbol: 'GTLB', name: 'GitLab Inc', sector: 'Technology', subSector: 'Software', industry: 'Developer Tools', marketCap: 8 },
  { symbol: 'ESTC', name: 'Elastic NV', sector: 'Technology', subSector: 'Software', industry: 'Developer Tools', marketCap: 10 },
  { symbol: 'MDB', name: 'MongoDB Inc', sector: 'Technology', subSector: 'Software', industry: 'Developer Tools', marketCap: 28 },
  { symbol: 'CFLT', name: 'Confluent Inc', sector: 'Technology', subSector: 'Software', industry: 'Developer Tools', marketCap: 9 },
  { symbol: 'FROG', name: 'JFrog Ltd', sector: 'Technology', subSector: 'Software', industry: 'Developer Tools', marketCap: 4 },

  // Semiconductors > GPU & AI Processors (5)
  { symbol: 'NVDA', name: 'NVIDIA Corp', sector: 'Technology', subSector: 'Semiconductors', industry: 'GPU & AI Processors', marketCap: 2800 },
  { symbol: 'AMD', name: 'AMD Inc', sector: 'Technology', subSector: 'Semiconductors', industry: 'GPU & AI Processors', marketCap: 250 },
  { symbol: 'MRVL', name: 'Marvell Technology', sector: 'Technology', subSector: 'Semiconductors', industry: 'GPU & AI Processors', marketCap: 65 },
  { symbol: 'SMCI', name: 'Super Micro Computer', sector: 'Technology', subSector: 'Semiconductors', industry: 'GPU & AI Processors', marketCap: 20 },
  { symbol: 'SOUN', name: 'SoundHound AI', sector: 'Technology', subSector: 'Semiconductors', industry: 'GPU & AI Processors', marketCap: 3 },

  // Semiconductors > Broadline Semiconductors (5)
  { symbol: 'AVGO', name: 'Broadcom Inc', sector: 'Technology', subSector: 'Semiconductors', industry: 'Broadline Semiconductors', marketCap: 800 },
  { symbol: 'QCOM', name: 'Qualcomm Inc', sector: 'Technology', subSector: 'Semiconductors', industry: 'Broadline Semiconductors', marketCap: 190 },
  { symbol: 'TXN', name: 'Texas Instruments', sector: 'Technology', subSector: 'Semiconductors', industry: 'Broadline Semiconductors', marketCap: 175 },
  { symbol: 'NXPI', name: 'NXP Semiconductors', sector: 'Technology', subSector: 'Semiconductors', industry: 'Broadline Semiconductors', marketCap: 55 },
  { symbol: 'MCHP', name: 'Microchip Technology', sector: 'Technology', subSector: 'Semiconductors', industry: 'Broadline Semiconductors', marketCap: 38 },

  // Semiconductors > Memory Chips (5)
  { symbol: 'MU', name: 'Micron Technology', sector: 'Technology', subSector: 'Semiconductors', industry: 'Memory Chips', marketCap: 110 },
  { symbol: 'WDC', name: 'Western Digital', sector: 'Technology', subSector: 'Semiconductors', industry: 'Memory Chips', marketCap: 18 },
  { symbol: 'STX', name: 'Seagate Technology', sector: 'Technology', subSector: 'Semiconductors', industry: 'Memory Chips', marketCap: 20 },
  { symbol: 'RMBS', name: 'Rambus Inc', sector: 'Technology', subSector: 'Semiconductors', industry: 'Memory Chips', marketCap: 8 },
  { symbol: 'CRUS', name: 'Cirrus Logic', sector: 'Technology', subSector: 'Semiconductors', industry: 'Memory Chips', marketCap: 5 },

  // Semiconductors > Semiconductor Equipment (5)
  { symbol: 'AMAT', name: 'Applied Materials', sector: 'Technology', subSector: 'Semiconductors', industry: 'Semiconductor Equipment', marketCap: 155 },
  { symbol: 'LRCX', name: 'Lam Research', sector: 'Technology', subSector: 'Semiconductors', industry: 'Semiconductor Equipment', marketCap: 120 },
  { symbol: 'KLAC', name: 'KLA Corp', sector: 'Technology', subSector: 'Semiconductors', industry: 'Semiconductor Equipment', marketCap: 90 },
  { symbol: 'ASML', name: 'ASML Holding', sector: 'Technology', subSector: 'Semiconductors', industry: 'Semiconductor Equipment', marketCap: 350 },
  { symbol: 'ENTG', name: 'Entegris Inc', sector: 'Technology', subSector: 'Semiconductors', industry: 'Semiconductor Equipment', marketCap: 18 },

  // Semiconductors > Analog & Mixed Signal (5)
  { symbol: 'ADI', name: 'Analog Devices', sector: 'Technology', subSector: 'Semiconductors', industry: 'Analog & Mixed Signal', marketCap: 105 },
  { symbol: 'INTC', name: 'Intel Corp', sector: 'Technology', subSector: 'Semiconductors', industry: 'Analog & Mixed Signal', marketCap: 120 },
  { symbol: 'ON', name: 'ON Semiconductor', sector: 'Technology', subSector: 'Semiconductors', industry: 'Analog & Mixed Signal', marketCap: 32 },
  { symbol: 'MPWR', name: 'Monolithic Power', sector: 'Technology', subSector: 'Semiconductors', industry: 'Analog & Mixed Signal', marketCap: 28 },
  { symbol: 'SWKS', name: 'Skyworks Solutions', sector: 'Technology', subSector: 'Semiconductors', industry: 'Analog & Mixed Signal', marketCap: 15 },

  // Hardware > Consumer Electronics (5)
  { symbol: 'AAPL', name: 'Apple Inc', sector: 'Technology', subSector: 'Hardware', industry: 'Consumer Electronics', marketCap: 2900 },
  { symbol: 'SONO', name: 'Sonos Inc', sector: 'Technology', subSector: 'Hardware', industry: 'Consumer Electronics', marketCap: 2 },
  { symbol: 'GPRO', name: 'GoPro Inc', sector: 'Technology', subSector: 'Hardware', industry: 'Consumer Electronics', marketCap: 0.5 },
  { symbol: 'KOSS', name: 'Koss Corp', sector: 'Technology', subSector: 'Hardware', industry: 'Consumer Electronics', marketCap: 0.1 },
  { symbol: 'UEIC', name: 'Universal Electronics', sector: 'Technology', subSector: 'Hardware', industry: 'Consumer Electronics', marketCap: 0.3 },

  // Hardware > Computer Hardware (5)
  { symbol: 'DELL', name: 'Dell Technologies', sector: 'Technology', subSector: 'Hardware', industry: 'Computer Hardware', marketCap: 95 },
  { symbol: 'HPQ', name: 'HP Inc', sector: 'Technology', subSector: 'Hardware', industry: 'Computer Hardware', marketCap: 32 },
  { symbol: 'HPE', name: 'HP Enterprise', sector: 'Technology', subSector: 'Hardware', industry: 'Computer Hardware', marketCap: 22 },
  { symbol: 'LNVGY', name: 'Lenovo Group', sector: 'Technology', subSector: 'Hardware', industry: 'Computer Hardware', marketCap: 12 },
  { symbol: 'NTAP', name: 'NetApp Inc', sector: 'Technology', subSector: 'Hardware', industry: 'Computer Hardware', marketCap: 22 },

  // Hardware > Networking Equipment (5)
  { symbol: 'CSCO', name: 'Cisco Systems', sector: 'Technology', subSector: 'Hardware', industry: 'Networking Equipment', marketCap: 220 },
  { symbol: 'ANET', name: 'Arista Networks', sector: 'Technology', subSector: 'Hardware', industry: 'Networking Equipment', marketCap: 95 },
  { symbol: 'JNPR', name: 'Juniper Networks', sector: 'Technology', subSector: 'Hardware', industry: 'Networking Equipment', marketCap: 14 },
  { symbol: 'UI', name: 'Ubiquiti Inc', sector: 'Technology', subSector: 'Hardware', industry: 'Networking Equipment', marketCap: 12 },
  { symbol: 'CIEN', name: 'Ciena Corp', sector: 'Technology', subSector: 'Hardware', industry: 'Networking Equipment', marketCap: 8 },

  // Hardware > Storage Devices (5)
  { symbol: 'PSTG', name: 'Pure Storage', sector: 'Technology', subSector: 'Hardware', industry: 'Storage Devices', marketCap: 16 },
  { symbol: 'NEWR', name: 'New Relic Inc', sector: 'Technology', subSector: 'Hardware', industry: 'Storage Devices', marketCap: 6 },
  { symbol: 'NTNX', name: 'Nutanix Inc', sector: 'Technology', subSector: 'Hardware', industry: 'Storage Devices', marketCap: 14 },
  { symbol: 'VRNS', name: 'Varonis Systems', sector: 'Technology', subSector: 'Hardware', industry: 'Storage Devices', marketCap: 5 },
  { symbol: 'BOXS', name: 'Box Inc', sector: 'Technology', subSector: 'Hardware', industry: 'Storage Devices', marketCap: 4 },

  // Hardware > Peripheral Devices (5)
  { symbol: 'LOGI', name: 'Logitech Intl', sector: 'Technology', subSector: 'Hardware', industry: 'Peripheral Devices', marketCap: 14 },
  { symbol: 'CRSR', name: 'Corsair Gaming', sector: 'Technology', subSector: 'Hardware', industry: 'Peripheral Devices', marketCap: 2 },
  { symbol: 'HEAR', name: 'Turtle Beach Corp', sector: 'Technology', subSector: 'Hardware', industry: 'Peripheral Devices', marketCap: 0.3 },
  { symbol: 'SSYS', name: 'Stratasys Ltd', sector: 'Technology', subSector: 'Hardware', industry: 'Peripheral Devices', marketCap: 0.8 },
  { symbol: 'DDD', name: '3D Systems Corp', sector: 'Technology', subSector: 'Hardware', industry: 'Peripheral Devices', marketCap: 0.5 },

  // Internet > Interactive Media (5)
  { symbol: 'GOOGL', name: 'Alphabet Inc', sector: 'Technology', subSector: 'Internet', industry: 'Interactive Media', marketCap: 2100 },
  { symbol: 'SNAP', name: 'Snap Inc', sector: 'Technology', subSector: 'Internet', industry: 'Interactive Media', marketCap: 22 },
  { symbol: 'RDDT', name: 'Reddit Inc', sector: 'Technology', subSector: 'Internet', industry: 'Interactive Media', marketCap: 18 },
  { symbol: 'MTCH', name: 'Match Group', sector: 'Technology', subSector: 'Internet', industry: 'Interactive Media', marketCap: 8 },
  { symbol: 'BMBL', name: 'Bumble Inc', sector: 'Technology', subSector: 'Internet', industry: 'Interactive Media', marketCap: 2 },

  // Internet > Internet Services (5)
  { symbol: 'META', name: 'Meta Platforms', sector: 'Technology', subSector: 'Internet', industry: 'Internet Services', marketCap: 1500 },
  { symbol: 'PINS', name: 'Pinterest Inc', sector: 'Technology', subSector: 'Internet', industry: 'Internet Services', marketCap: 20 },
  { symbol: 'YELP', name: 'Yelp Inc', sector: 'Technology', subSector: 'Internet', industry: 'Internet Services', marketCap: 2.5 },
  { symbol: 'ANGI', name: 'Angi Inc', sector: 'Technology', subSector: 'Internet', industry: 'Internet Services', marketCap: 1.5 },
  { symbol: 'CARG', name: 'CarGurus Inc', sector: 'Technology', subSector: 'Internet', industry: 'Internet Services', marketCap: 3 },

  // Internet > Search & Advertising (5)
  { symbol: 'TTD', name: 'Trade Desk Inc', sector: 'Technology', subSector: 'Internet', industry: 'Search & Advertising', marketCap: 48 },
  { symbol: 'APP', name: 'AppLovin Corp', sector: 'Technology', subSector: 'Internet', industry: 'Search & Advertising', marketCap: 85 },
  { symbol: 'DV', name: 'DoubleVerify Holdings', sector: 'Technology', subSector: 'Internet', industry: 'Search & Advertising', marketCap: 3 },
  { symbol: 'IAS', name: 'Integral Ad Science', sector: 'Technology', subSector: 'Internet', industry: 'Search & Advertising', marketCap: 2 },
  { symbol: 'MGNI', name: 'Magnite Inc', sector: 'Technology', subSector: 'Internet', industry: 'Search & Advertising', marketCap: 4 },

  // Internet > Social Platforms (5)
  { symbol: 'TWTR', name: 'X Holdings Corp', sector: 'Technology', subSector: 'Internet', industry: 'Social Platforms', marketCap: 40 },
  { symbol: 'LI', name: 'Li Auto Inc', sector: 'Technology', subSector: 'Internet', industry: 'Social Platforms', marketCap: 25 },
  { symbol: 'ZM', name: 'Zoom Video Comm', sector: 'Technology', subSector: 'Internet', industry: 'Social Platforms', marketCap: 20 },
  { symbol: 'GRAB', name: 'Grab Holdings', sector: 'Technology', subSector: 'Internet', industry: 'Social Platforms', marketCap: 14 },
  { symbol: 'WB', name: 'Weibo Corp', sector: 'Technology', subSector: 'Internet', industry: 'Social Platforms', marketCap: 3 },

  // Internet > E-Commerce Tech (5)
  { symbol: 'SHOP', name: 'Shopify Inc', sector: 'Technology', subSector: 'Internet', industry: 'E-Commerce Tech', marketCap: 95 },
  { symbol: 'BIGC', name: 'BigCommerce', sector: 'Technology', subSector: 'Internet', industry: 'E-Commerce Tech', marketCap: 0.6 },
  { symbol: 'WIX', name: 'Wix.com Ltd', sector: 'Technology', subSector: 'Internet', industry: 'E-Commerce Tech', marketCap: 10 },
  { symbol: 'VTEX', name: 'VTEX NV', sector: 'Technology', subSector: 'Internet', industry: 'E-Commerce Tech', marketCap: 2 },
  { symbol: 'GLBE', name: 'Global-E Online', sector: 'Technology', subSector: 'Internet', industry: 'E-Commerce Tech', marketCap: 6 },

  // Cloud & AI > Cloud Infrastructure (5)
  { symbol: 'SNOW', name: 'Snowflake Inc', sector: 'Technology', subSector: 'Cloud & AI', industry: 'Cloud Infrastructure', marketCap: 65 },
  { symbol: 'NET', name: 'Cloudflare Inc', sector: 'Technology', subSector: 'Cloud & AI', industry: 'Cloud Infrastructure', marketCap: 30 },
  { symbol: 'FSLY', name: 'Fastly Inc', sector: 'Technology', subSector: 'Cloud & AI', industry: 'Cloud Infrastructure', marketCap: 2 },
  { symbol: 'DNET', name: 'DigitalOcean', sector: 'Technology', subSector: 'Cloud & AI', industry: 'Cloud Infrastructure', marketCap: 3 },
  { symbol: 'CCSI', name: 'Consensus Cloud', sector: 'Technology', subSector: 'Cloud & AI', industry: 'Cloud Infrastructure', marketCap: 0.5 },

  // Cloud & AI > AI Platforms (5)
  { symbol: 'AI', name: 'C3.ai Inc', sector: 'Technology', subSector: 'Cloud & AI', industry: 'AI Platforms', marketCap: 4 },
  { symbol: 'PATH', name: 'UiPath Inc', sector: 'Technology', subSector: 'Cloud & AI', industry: 'AI Platforms', marketCap: 12 },
  { symbol: 'BBAI', name: 'BigBear.ai', sector: 'Technology', subSector: 'Cloud & AI', industry: 'AI Platforms', marketCap: 1 },
  { symbol: 'UPST', name: 'Upstart Holdings', sector: 'Technology', subSector: 'Cloud & AI', industry: 'AI Platforms', marketCap: 3 },
  { symbol: 'PRCT', name: 'Procept BioRobotics', sector: 'Technology', subSector: 'Cloud & AI', industry: 'AI Platforms', marketCap: 4 },

  // Cloud & AI > Data Analytics (5)
  { symbol: 'SPLK', name: 'Splunk Inc', sector: 'Technology', subSector: 'Cloud & AI', industry: 'Data Analytics', marketCap: 25 },
  { symbol: 'AYX', name: 'Alteryx Inc', sector: 'Technology', subSector: 'Cloud & AI', industry: 'Data Analytics', marketCap: 5 },
  { symbol: 'SUMO', name: 'Sumo Logic', sector: 'Technology', subSector: 'Cloud & AI', industry: 'Data Analytics', marketCap: 1.5 },
  { symbol: 'ALTR', name: 'Altair Engineering', sector: 'Technology', subSector: 'Cloud & AI', industry: 'Data Analytics', marketCap: 6 },
  { symbol: 'TYL', name: 'Tyler Technologies', sector: 'Technology', subSector: 'Cloud & AI', industry: 'Data Analytics', marketCap: 22 },

  // Cloud & AI > Machine Learning Ops (5)
  { symbol: 'ASAN', name: 'Asana Inc', sector: 'Technology', subSector: 'Cloud & AI', industry: 'Machine Learning Ops', marketCap: 4 },
  { symbol: 'BRZE', name: 'Braze Inc', sector: 'Technology', subSector: 'Cloud & AI', industry: 'Machine Learning Ops', marketCap: 4.5 },
  { symbol: 'FRSH', name: 'Freshworks Inc', sector: 'Technology', subSector: 'Cloud & AI', industry: 'Machine Learning Ops', marketCap: 5 },
  { symbol: 'MNDY', name: 'Monday.com Ltd', sector: 'Technology', subSector: 'Cloud & AI', industry: 'Machine Learning Ops', marketCap: 12 },
  { symbol: 'DOCN', name: 'DigitalOcean', sector: 'Technology', subSector: 'Cloud & AI', industry: 'Machine Learning Ops', marketCap: 3 },

  // Cloud & AI > Edge Computing (5)
  { symbol: 'AKAM', name: 'Akamai Technologies', sector: 'Technology', subSector: 'Cloud & AI', industry: 'Edge Computing', marketCap: 16 },
  { symbol: 'LLAP', name: 'Terran Orbital', sector: 'Technology', subSector: 'Cloud & AI', industry: 'Edge Computing', marketCap: 0.3 },
  { symbol: 'IMMR', name: 'Immersion Corp', sector: 'Technology', subSector: 'Cloud & AI', industry: 'Edge Computing', marketCap: 0.4 },
  { symbol: 'EGHT', name: '8x8 Inc', sector: 'Technology', subSector: 'Cloud & AI', industry: 'Edge Computing', marketCap: 0.5 },
  { symbol: 'CMBM', name: 'Cambium Networks', sector: 'Technology', subSector: 'Cloud & AI', industry: 'Edge Computing', marketCap: 0.3 },

  // ===============================================
  // HEALTHCARE
  // ===============================================

  // Pharma > Major Pharmaceuticals (5)
  { symbol: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare', subSector: 'Pharma', industry: 'Major Pharmaceuticals', marketCap: 380 },
  { symbol: 'PFE', name: 'Pfizer Inc', sector: 'Healthcare', subSector: 'Pharma', industry: 'Major Pharmaceuticals', marketCap: 160 },
  { symbol: 'MRK', name: 'Merck & Co', sector: 'Healthcare', subSector: 'Pharma', industry: 'Major Pharmaceuticals', marketCap: 290 },
  { symbol: 'BMY', name: 'Bristol-Myers Squibb', sector: 'Healthcare', subSector: 'Pharma', industry: 'Major Pharmaceuticals', marketCap: 105 },
  { symbol: 'NVO', name: 'Novo Nordisk', sector: 'Healthcare', subSector: 'Pharma', industry: 'Major Pharmaceuticals', marketCap: 450 },

  // Pharma > Specialty Pharmaceuticals (5)
  { symbol: 'LLY', name: 'Eli Lilly', sector: 'Healthcare', subSector: 'Pharma', industry: 'Specialty Pharmaceuticals', marketCap: 750 },
  { symbol: 'ABBV', name: 'AbbVie Inc', sector: 'Healthcare', subSector: 'Pharma', industry: 'Specialty Pharmaceuticals', marketCap: 310 },
  { symbol: 'AZN', name: 'AstraZeneca PLC', sector: 'Healthcare', subSector: 'Pharma', industry: 'Specialty Pharmaceuticals', marketCap: 220 },
  { symbol: 'SNY', name: 'Sanofi SA', sector: 'Healthcare', subSector: 'Pharma', industry: 'Specialty Pharmaceuticals', marketCap: 130 },
  { symbol: 'GSK', name: 'GSK PLC', sector: 'Healthcare', subSector: 'Pharma', industry: 'Specialty Pharmaceuticals', marketCap: 80 },

  // Pharma > Generic Drugs (5)
  { symbol: 'TEVA', name: 'Teva Pharmaceutical', sector: 'Healthcare', subSector: 'Pharma', industry: 'Generic Drugs', marketCap: 18 },
  { symbol: 'MYL', name: 'Viatris Inc', sector: 'Healthcare', subSector: 'Pharma', industry: 'Generic Drugs', marketCap: 12 },
  { symbol: 'ENDP', name: 'Endo International', sector: 'Healthcare', subSector: 'Pharma', industry: 'Generic Drugs', marketCap: 3 },
  { symbol: 'AMRX', name: 'Amneal Pharma', sector: 'Healthcare', subSector: 'Pharma', industry: 'Generic Drugs', marketCap: 2.5 },
  { symbol: 'LPIN', name: 'Lupin Ltd', sector: 'Healthcare', subSector: 'Pharma', industry: 'Generic Drugs', marketCap: 5 },

  // Pharma > Vaccine Development (5)
  { symbol: 'MRNA', name: 'Moderna Inc', sector: 'Healthcare', subSector: 'Pharma', industry: 'Vaccine Development', marketCap: 40 },
  { symbol: 'BNTX', name: 'BioNTech SE', sector: 'Healthcare', subSector: 'Pharma', industry: 'Vaccine Development', marketCap: 25 },
  { symbol: 'NVAX', name: 'Novavax Inc', sector: 'Healthcare', subSector: 'Pharma', industry: 'Vaccine Development', marketCap: 2 },
  { symbol: 'DYAI', name: 'Dynavax Technologies', sector: 'Healthcare', subSector: 'Pharma', industry: 'Vaccine Development', marketCap: 2 },
  { symbol: 'VIR', name: 'Vir Biotechnology', sector: 'Healthcare', subSector: 'Pharma', industry: 'Vaccine Development', marketCap: 1.5 },

  // Pharma > Oncology Therapeutics (5)
  { symbol: 'SGEN', name: 'Seagen Inc', sector: 'Healthcare', subSector: 'Pharma', industry: 'Oncology Therapeutics', marketCap: 30 },
  { symbol: 'EXEL', name: 'Exelixis Inc', sector: 'Healthcare', subSector: 'Pharma', industry: 'Oncology Therapeutics', marketCap: 8 },
  { symbol: 'IONS', name: 'Ionis Pharma', sector: 'Healthcare', subSector: 'Pharma', industry: 'Oncology Therapeutics', marketCap: 8 },
  { symbol: 'BPMC', name: 'Blueprint Medicines', sector: 'Healthcare', subSector: 'Pharma', industry: 'Oncology Therapeutics', marketCap: 6 },
  { symbol: 'KRTX', name: 'Karuna Therapeutics', sector: 'Healthcare', subSector: 'Pharma', industry: 'Oncology Therapeutics', marketCap: 5 },

  // Insurance > Managed Healthcare (5)
  { symbol: 'UNH', name: 'UnitedHealth Group', sector: 'Healthcare', subSector: 'Insurance', industry: 'Managed Healthcare', marketCap: 480 },
  { symbol: 'ELV', name: 'Elevance Health', sector: 'Healthcare', subSector: 'Insurance', industry: 'Managed Healthcare', marketCap: 110 },
  { symbol: 'CI', name: 'Cigna Group', sector: 'Healthcare', subSector: 'Insurance', industry: 'Managed Healthcare', marketCap: 95 },
  { symbol: 'HUM', name: 'Humana Inc', sector: 'Healthcare', subSector: 'Insurance', industry: 'Managed Healthcare', marketCap: 35 },
  { symbol: 'CNC', name: 'Centene Corp', sector: 'Healthcare', subSector: 'Insurance', industry: 'Managed Healthcare', marketCap: 38 },

  // Insurance > Health Plan Providers (5)
  { symbol: 'MOH', name: 'Molina Healthcare', sector: 'Healthcare', subSector: 'Insurance', industry: 'Health Plan Providers', marketCap: 22 },
  { symbol: 'AGL', name: 'Agilon Health', sector: 'Healthcare', subSector: 'Insurance', industry: 'Health Plan Providers', marketCap: 3 },
  { symbol: 'OSCR', name: 'Oscar Health', sector: 'Healthcare', subSector: 'Insurance', industry: 'Health Plan Providers', marketCap: 4 },
  { symbol: 'ALHC', name: 'Alignment Healthcare', sector: 'Healthcare', subSector: 'Insurance', industry: 'Health Plan Providers', marketCap: 2 },
  { symbol: 'CLOV', name: 'Clover Health', sector: 'Healthcare', subSector: 'Insurance', industry: 'Health Plan Providers', marketCap: 0.8 },

  // Insurance > Dental & Vision Plans (5)
  { symbol: 'ALGN', name: 'Align Technology', sector: 'Healthcare', subSector: 'Insurance', industry: 'Dental & Vision Plans', marketCap: 30 },
  { symbol: 'XRAY', name: 'Dentsply Sirona', sector: 'Healthcare', subSector: 'Insurance', industry: 'Dental & Vision Plans', marketCap: 5 },
  { symbol: 'HSIC', name: 'Henry Schein', sector: 'Healthcare', subSector: 'Insurance', industry: 'Dental & Vision Plans', marketCap: 9 },
  { symbol: 'PDCO', name: 'Patterson Companies', sector: 'Healthcare', subSector: 'Insurance', industry: 'Dental & Vision Plans', marketCap: 3 },
  { symbol: 'SDC', name: 'SmileDirectClub', sector: 'Healthcare', subSector: 'Insurance', industry: 'Dental & Vision Plans', marketCap: 0.2 },

  // Insurance > Medicare Advantage (5)
  { symbol: 'DAVA', name: 'Davita Inc', sector: 'Healthcare', subSector: 'Insurance', industry: 'Medicare Advantage', marketCap: 10 },
  { symbol: 'DVA', name: 'DaVita Inc', sector: 'Healthcare', subSector: 'Insurance', industry: 'Medicare Advantage', marketCap: 10 },
  { symbol: 'ADUS', name: 'Addus HomeCare', sector: 'Healthcare', subSector: 'Insurance', industry: 'Medicare Advantage', marketCap: 2 },
  { symbol: 'AMED', name: 'Amedisys Inc', sector: 'Healthcare', subSector: 'Insurance', industry: 'Medicare Advantage', marketCap: 4 },
  { symbol: 'ENSG', name: 'Ensign Group', sector: 'Healthcare', subSector: 'Insurance', industry: 'Medicare Advantage', marketCap: 6 },

  // Insurance > Pharmacy Benefit Mgmt (5)
  { symbol: 'CAH', name: 'Cardinal Health', sector: 'Healthcare', subSector: 'Insurance', industry: 'Pharmacy Benefit Mgmt', marketCap: 28 },
  { symbol: 'MCK', name: 'McKesson Corp', sector: 'Healthcare', subSector: 'Insurance', industry: 'Pharmacy Benefit Mgmt', marketCap: 70 },
  { symbol: 'ABC', name: 'AmerisourceBergen', sector: 'Healthcare', subSector: 'Insurance', industry: 'Pharmacy Benefit Mgmt', marketCap: 45 },
  { symbol: 'CORT', name: 'Corcept Therapeutics', sector: 'Healthcare', subSector: 'Insurance', industry: 'Pharmacy Benefit Mgmt', marketCap: 4 },
  { symbol: 'OMI', name: 'Owens & Minor', sector: 'Healthcare', subSector: 'Insurance', industry: 'Pharmacy Benefit Mgmt', marketCap: 2 },

  // Biotech > Biotechnology (5)
  { symbol: 'AMGN', name: 'Amgen Inc', sector: 'Healthcare', subSector: 'Biotech', industry: 'Biotechnology', marketCap: 160 },
  { symbol: 'GILD', name: 'Gilead Sciences', sector: 'Healthcare', subSector: 'Biotech', industry: 'Biotechnology', marketCap: 105 },
  { symbol: 'VRTX', name: 'Vertex Pharma', sector: 'Healthcare', subSector: 'Biotech', industry: 'Biotechnology', marketCap: 115 },
  { symbol: 'BIIB', name: 'Biogen Inc', sector: 'Healthcare', subSector: 'Biotech', industry: 'Biotechnology', marketCap: 30 },
  { symbol: 'ILMN', name: 'Illumina Inc', sector: 'Healthcare', subSector: 'Biotech', industry: 'Biotechnology', marketCap: 22 },

  // Biotech > Genomics (5)
  { symbol: 'REGN', name: 'Regeneron Pharma', sector: 'Healthcare', subSector: 'Biotech', industry: 'Genomics', marketCap: 105 },
  { symbol: 'CRSP', name: 'CRISPR Therapeutics', sector: 'Healthcare', subSector: 'Biotech', industry: 'Genomics', marketCap: 4 },
  { symbol: 'EDIT', name: 'Editas Medicine', sector: 'Healthcare', subSector: 'Biotech', industry: 'Genomics', marketCap: 0.5 },
  { symbol: 'BEAM', name: 'Beam Therapeutics', sector: 'Healthcare', subSector: 'Biotech', industry: 'Genomics', marketCap: 2 },
  { symbol: 'NTLA', name: 'Intellia Therapeutics', sector: 'Healthcare', subSector: 'Biotech', industry: 'Genomics', marketCap: 3 },

  // Biotech > Cell & Gene Therapy (5)
  { symbol: 'BLUE', name: 'Bluebird Bio', sector: 'Healthcare', subSector: 'Biotech', industry: 'Cell & Gene Therapy', marketCap: 0.3 },
  { symbol: 'FATE', name: 'Fate Therapeutics', sector: 'Healthcare', subSector: 'Biotech', industry: 'Cell & Gene Therapy', marketCap: 0.5 },
  { symbol: 'RCKT', name: 'Rocket Pharma', sector: 'Healthcare', subSector: 'Biotech', industry: 'Cell & Gene Therapy', marketCap: 2 },
  { symbol: 'ALLO', name: 'Allogene Therapeutics', sector: 'Healthcare', subSector: 'Biotech', industry: 'Cell & Gene Therapy', marketCap: 0.8 },
  { symbol: 'PGEN', name: 'Precigen Inc', sector: 'Healthcare', subSector: 'Biotech', industry: 'Cell & Gene Therapy', marketCap: 0.4 },

  // Biotech > Antibody Therapeutics (5)
  { symbol: 'ABBV2', name: 'AbbVie Biologics', sector: 'Healthcare', subSector: 'Biotech', industry: 'Antibody Therapeutics', marketCap: 50 },
  { symbol: 'RGNX', name: 'Regenxbio Inc', sector: 'Healthcare', subSector: 'Biotech', industry: 'Antibody Therapeutics', marketCap: 1 },
  { symbol: 'TGTX', name: 'TG Therapeutics', sector: 'Healthcare', subSector: 'Biotech', industry: 'Antibody Therapeutics', marketCap: 4 },
  { symbol: 'ACAD', name: 'Acadia Pharma', sector: 'Healthcare', subSector: 'Biotech', industry: 'Antibody Therapeutics', marketCap: 5 },
  { symbol: 'PCVX', name: 'Vaxcyte Inc', sector: 'Healthcare', subSector: 'Biotech', industry: 'Antibody Therapeutics', marketCap: 6 },

  // Biotech > RNA Therapeutics (5)
  { symbol: 'ARWR', name: 'Arrowhead Pharma', sector: 'Healthcare', subSector: 'Biotech', industry: 'RNA Therapeutics', marketCap: 5 },
  { symbol: 'ALNA', name: 'Alnylam Pharma', sector: 'Healthcare', subSector: 'Biotech', industry: 'RNA Therapeutics', marketCap: 30 },
  { symbol: 'INCY', name: 'Incyte Corp', sector: 'Healthcare', subSector: 'Biotech', industry: 'RNA Therapeutics', marketCap: 15 },
  { symbol: 'SGMO', name: 'Sangamo Therapeutics', sector: 'Healthcare', subSector: 'Biotech', industry: 'RNA Therapeutics', marketCap: 0.3 },
  { symbol: 'ABUS', name: 'Arbutus Biopharma', sector: 'Healthcare', subSector: 'Biotech', industry: 'RNA Therapeutics', marketCap: 0.4 },

  // Medical Devices > Medical Equipment (5)
  { symbol: 'ABT', name: 'Abbott Labs', sector: 'Healthcare', subSector: 'Medical Devices', industry: 'Medical Equipment', marketCap: 200 },
  { symbol: 'MDT', name: 'Medtronic PLC', sector: 'Healthcare', subSector: 'Medical Devices', industry: 'Medical Equipment', marketCap: 110 },
  { symbol: 'SYK', name: 'Stryker Corp', sector: 'Healthcare', subSector: 'Medical Devices', industry: 'Medical Equipment', marketCap: 135 },
  { symbol: 'BSX', name: 'Boston Scientific', sector: 'Healthcare', subSector: 'Medical Devices', industry: 'Medical Equipment', marketCap: 115 },
  { symbol: 'ZBH', name: 'Zimmer Biomet', sector: 'Healthcare', subSector: 'Medical Devices', industry: 'Medical Equipment', marketCap: 28 },

  // Medical Devices > Diagnostics (5)
  { symbol: 'DXCM', name: 'DexCom Inc', sector: 'Healthcare', subSector: 'Medical Devices', industry: 'Diagnostics', marketCap: 30 },
  { symbol: 'A', name: 'Agilent Technologies', sector: 'Healthcare', subSector: 'Medical Devices', industry: 'Diagnostics', marketCap: 40 },
  { symbol: 'TMO', name: 'Thermo Fisher', sector: 'Healthcare', subSector: 'Medical Devices', industry: 'Diagnostics', marketCap: 210 },
  { symbol: 'DHR', name: 'Danaher Corp', sector: 'Healthcare', subSector: 'Medical Devices', industry: 'Diagnostics', marketCap: 180 },
  { symbol: 'BIO', name: 'Bio-Rad Labs', sector: 'Healthcare', subSector: 'Medical Devices', industry: 'Diagnostics', marketCap: 8 },

  // Medical Devices > Surgical Robotics (5)
  { symbol: 'ISRG', name: 'Intuitive Surgical', sector: 'Healthcare', subSector: 'Medical Devices', industry: 'Surgical Robotics', marketCap: 165 },
  { symbol: 'MASI', name: 'Masimo Corp', sector: 'Healthcare', subSector: 'Medical Devices', industry: 'Surgical Robotics', marketCap: 8 },
  { symbol: 'NUVB', name: 'Nuvation Bio', sector: 'Healthcare', subSector: 'Medical Devices', industry: 'Surgical Robotics', marketCap: 0.5 },
  { symbol: 'RBOT', name: 'Vicarious Surgical', sector: 'Healthcare', subSector: 'Medical Devices', industry: 'Surgical Robotics', marketCap: 0.2 },
  { symbol: 'STAA', name: 'STAAR Surgical', sector: 'Healthcare', subSector: 'Medical Devices', industry: 'Surgical Robotics', marketCap: 2 },

  // Medical Devices > Implantable Devices (5)
  { symbol: 'EW', name: 'Edwards Lifesciences', sector: 'Healthcare', subSector: 'Medical Devices', industry: 'Implantable Devices', marketCap: 48 },
  { symbol: 'PODD', name: 'Insulet Corp', sector: 'Healthcare', subSector: 'Medical Devices', industry: 'Implantable Devices', marketCap: 18 },
  { symbol: 'HOLX', name: 'Hologic Inc', sector: 'Healthcare', subSector: 'Medical Devices', industry: 'Implantable Devices', marketCap: 18 },
  { symbol: 'GMED', name: 'Globus Medical', sector: 'Healthcare', subSector: 'Medical Devices', industry: 'Implantable Devices', marketCap: 8 },
  { symbol: 'LIVN', name: 'LivaNova PLC', sector: 'Healthcare', subSector: 'Medical Devices', industry: 'Implantable Devices', marketCap: 2.5 },

  // Medical Devices > Wearable Health Tech (5)
  { symbol: 'IRTC', name: 'iRhythm Technologies', sector: 'Healthcare', subSector: 'Medical Devices', industry: 'Wearable Health Tech', marketCap: 3 },
  { symbol: 'GDRX', name: 'GoodRx Holdings', sector: 'Healthcare', subSector: 'Medical Devices', industry: 'Wearable Health Tech', marketCap: 3 },
  { symbol: 'PHR', name: 'Phreesia Inc', sector: 'Healthcare', subSector: 'Medical Devices', industry: 'Wearable Health Tech', marketCap: 1.5 },
  { symbol: 'ONEM', name: 'Agilon Health Inc', sector: 'Healthcare', subSector: 'Medical Devices', industry: 'Wearable Health Tech', marketCap: 2 },
  { symbol: 'TALK', name: 'Talkspace Inc', sector: 'Healthcare', subSector: 'Medical Devices', industry: 'Wearable Health Tech', marketCap: 0.3 },

  // Health IT > Health Tech Platforms (5)
  { symbol: 'VEEV', name: 'Veeva Systems', sector: 'Healthcare', subSector: 'Health IT', industry: 'Health Tech Platforms', marketCap: 35 },
  { symbol: 'HIMS', name: 'Hims & Hers Health', sector: 'Healthcare', subSector: 'Health IT', industry: 'Health Tech Platforms', marketCap: 7 },
  { symbol: 'CERT', name: 'Certara Inc', sector: 'Healthcare', subSector: 'Health IT', industry: 'Health Tech Platforms', marketCap: 3 },
  { symbol: 'NTRA', name: 'Natera Inc', sector: 'Healthcare', subSector: 'Health IT', industry: 'Health Tech Platforms', marketCap: 12 },
  { symbol: 'GH', name: 'Guardant Health', sector: 'Healthcare', subSector: 'Health IT', industry: 'Health Tech Platforms', marketCap: 4 },

  // Health IT > Telemedicine (5)
  { symbol: 'TDOC', name: 'Teladoc Health', sector: 'Healthcare', subSector: 'Health IT', industry: 'Telemedicine', marketCap: 3 },
  { symbol: 'DOCS', name: 'Doximity Inc', sector: 'Healthcare', subSector: 'Health IT', industry: 'Telemedicine', marketCap: 10 },
  { symbol: 'AMWL', name: 'Amwell Health', sector: 'Healthcare', subSector: 'Health IT', industry: 'Telemedicine', marketCap: 0.5 },
  { symbol: 'HCAT', name: 'Health Catalyst', sector: 'Healthcare', subSector: 'Health IT', industry: 'Telemedicine', marketCap: 0.8 },
  { symbol: 'ACCD', name: 'Accolade Inc', sector: 'Healthcare', subSector: 'Health IT', industry: 'Telemedicine', marketCap: 0.6 },

  // Health IT > Clinical Data Systems (5)
  { symbol: 'CERN', name: 'Cerner Corp', sector: 'Healthcare', subSector: 'Health IT', industry: 'Clinical Data Systems', marketCap: 25 },
  { symbol: 'MDRX', name: 'Allscripts Healthcare', sector: 'Healthcare', subSector: 'Health IT', industry: 'Clinical Data Systems', marketCap: 2 },
  { symbol: 'CPSI', name: 'TruBridge Inc', sector: 'Healthcare', subSector: 'Health IT', industry: 'Clinical Data Systems', marketCap: 0.5 },
  { symbol: 'NXGN', name: 'NextGen Healthcare', sector: 'Healthcare', subSector: 'Health IT', industry: 'Clinical Data Systems', marketCap: 1.5 },
  { symbol: 'HSTM', name: 'HealthStream Inc', sector: 'Healthcare', subSector: 'Health IT', industry: 'Clinical Data Systems', marketCap: 1 },

  // Health IT > Health AI Analytics (5)
  { symbol: 'RXRX', name: 'Recursion Pharma', sector: 'Healthcare', subSector: 'Health IT', industry: 'Health AI Analytics', marketCap: 3 },
  { symbol: 'SDGR', name: 'Schrodinger Inc', sector: 'Healthcare', subSector: 'Health IT', industry: 'Health AI Analytics', marketCap: 2.5 },
  { symbol: 'EVLV', name: 'Evolent Health', sector: 'Healthcare', subSector: 'Health IT', industry: 'Health AI Analytics', marketCap: 3.5 },
  { symbol: 'PACS', name: 'PACS Group', sector: 'Healthcare', subSector: 'Health IT', industry: 'Health AI Analytics', marketCap: 2 },
  { symbol: 'SGHT', name: 'Sight Sciences', sector: 'Healthcare', subSector: 'Health IT', industry: 'Health AI Analytics', marketCap: 0.3 },

  // Health IT > Digital Therapeutics (5)
  { symbol: 'LVGO', name: 'Livongo Health', sector: 'Healthcare', subSector: 'Health IT', industry: 'Digital Therapeutics', marketCap: 5 },
  { symbol: 'PGNY', name: 'Progyny Inc', sector: 'Healthcare', subSector: 'Health IT', industry: 'Digital Therapeutics', marketCap: 4 },
  { symbol: 'LFST', name: 'LifeStance Health', sector: 'Healthcare', subSector: 'Health IT', industry: 'Digital Therapeutics', marketCap: 3 },
  { symbol: 'GOCO', name: 'GoHealth Inc', sector: 'Healthcare', subSector: 'Health IT', industry: 'Digital Therapeutics', marketCap: 0.3 },
  { symbol: 'RELY', name: 'Remitly Global', sector: 'Healthcare', subSector: 'Health IT', industry: 'Digital Therapeutics', marketCap: 2 },

  // ===============================================
  // FINANCIALS
  // ===============================================

  // Banks > Diversified Banks (5)
  { symbol: 'JPM', name: 'JPMorgan Chase', sector: 'Financials', subSector: 'Banks', industry: 'Diversified Banks', marketCap: 600 },
  { symbol: 'BAC', name: 'Bank of America', sector: 'Financials', subSector: 'Banks', industry: 'Diversified Banks', marketCap: 310 },
  { symbol: 'WFC', name: 'Wells Fargo', sector: 'Financials', subSector: 'Banks', industry: 'Diversified Banks', marketCap: 210 },
  { symbol: 'C', name: 'Citigroup Inc', sector: 'Financials', subSector: 'Banks', industry: 'Diversified Banks', marketCap: 120 },
  { symbol: 'GS', name: 'Goldman Sachs', sector: 'Financials', subSector: 'Banks', industry: 'Diversified Banks', marketCap: 160 },

  // Banks > Regional Banks (5)
  { symbol: 'USB', name: 'US Bancorp', sector: 'Financials', subSector: 'Banks', industry: 'Regional Banks', marketCap: 70 },
  { symbol: 'PNC', name: 'PNC Financial', sector: 'Financials', subSector: 'Banks', industry: 'Regional Banks', marketCap: 75 },
  { symbol: 'TFC', name: 'Truist Financial', sector: 'Financials', subSector: 'Banks', industry: 'Regional Banks', marketCap: 55 },
  { symbol: 'FITB', name: 'Fifth Third Bancorp', sector: 'Financials', subSector: 'Banks', industry: 'Regional Banks', marketCap: 28 },
  { symbol: 'KEY', name: 'KeyCorp', sector: 'Financials', subSector: 'Banks', industry: 'Regional Banks', marketCap: 15 },

  // Banks > Digital Banking (5)
  { symbol: 'SQ', name: 'Block Inc', sector: 'Financials', subSector: 'Banks', industry: 'Digital Banking', marketCap: 45 },
  { symbol: 'SOFI', name: 'SoFi Technologies', sector: 'Financials', subSector: 'Banks', industry: 'Digital Banking', marketCap: 10 },
  { symbol: 'LC', name: 'LendingClub', sector: 'Financials', subSector: 'Banks', industry: 'Digital Banking', marketCap: 2 },
  { symbol: 'NU', name: 'Nu Holdings', sector: 'Financials', subSector: 'Banks', industry: 'Digital Banking', marketCap: 45 },
  { symbol: 'AFRM', name: 'Affirm Holdings', sector: 'Financials', subSector: 'Banks', industry: 'Digital Banking', marketCap: 12 },

  // Banks > Commercial Lending (5)
  { symbol: 'HBAN', name: 'Huntington Bancshares', sector: 'Financials', subSector: 'Banks', industry: 'Commercial Lending', marketCap: 22 },
  { symbol: 'RF', name: 'Regions Financial', sector: 'Financials', subSector: 'Banks', industry: 'Commercial Lending', marketCap: 20 },
  { symbol: 'CFG', name: 'Citizens Financial', sector: 'Financials', subSector: 'Banks', industry: 'Commercial Lending', marketCap: 18 },
  { symbol: 'MTB', name: 'M&T Bank Corp', sector: 'Financials', subSector: 'Banks', industry: 'Commercial Lending', marketCap: 28 },
  { symbol: 'ZION', name: 'Zions Bancorp', sector: 'Financials', subSector: 'Banks', industry: 'Commercial Lending', marketCap: 8 },

  // Banks > Mortgage Banking (5)
  { symbol: 'RKT', name: 'Rocket Companies', sector: 'Financials', subSector: 'Banks', industry: 'Mortgage Banking', marketCap: 3 },
  { symbol: 'UWMC', name: 'UWM Holdings', sector: 'Financials', subSector: 'Banks', industry: 'Mortgage Banking', marketCap: 8 },
  { symbol: 'PFSI', name: 'PennyMac Financial', sector: 'Financials', subSector: 'Banks', industry: 'Mortgage Banking', marketCap: 5 },
  { symbol: 'COOP', name: 'Mr. Cooper Group', sector: 'Financials', subSector: 'Banks', industry: 'Mortgage Banking', marketCap: 6 },
  { symbol: 'HMPT', name: 'Home Point Capital', sector: 'Financials', subSector: 'Banks', industry: 'Mortgage Banking', marketCap: 0.5 },

  // Payments > Payment Processing (5)
  { symbol: 'V', name: 'Visa Inc', sector: 'Financials', subSector: 'Payments', industry: 'Payment Processing', marketCap: 550 },
  { symbol: 'MA', name: 'Mastercard Inc', sector: 'Financials', subSector: 'Payments', industry: 'Payment Processing', marketCap: 420 },
  { symbol: 'FIS', name: 'Fidelity Natl Info', sector: 'Financials', subSector: 'Payments', industry: 'Payment Processing', marketCap: 42 },
  { symbol: 'FISV', name: 'Fiserv Inc', sector: 'Financials', subSector: 'Payments', industry: 'Payment Processing', marketCap: 85 },
  { symbol: 'GPN', name: 'Global Payments', sector: 'Financials', subSector: 'Payments', industry: 'Payment Processing', marketCap: 28 },

  // Payments > Financial Technology (5)
  { symbol: 'PYPL', name: 'PayPal Holdings', sector: 'Financials', subSector: 'Payments', industry: 'Financial Technology', marketCap: 75 },
  { symbol: 'ADYEY', name: 'Adyen NV', sector: 'Financials', subSector: 'Payments', industry: 'Financial Technology', marketCap: 50 },
  { symbol: 'TOST', name: 'Toast Inc', sector: 'Financials', subSector: 'Payments', industry: 'Financial Technology', marketCap: 14 },
  { symbol: 'BILL', name: 'Bill Holdings', sector: 'Financials', subSector: 'Payments', industry: 'Financial Technology', marketCap: 10 },
  { symbol: 'FOUR', name: 'Shift4 Payments', sector: 'Financials', subSector: 'Payments', industry: 'Financial Technology', marketCap: 8 },

  // Payments > Digital Wallets (5)
  { symbol: 'COIN', name: 'Coinbase Global', sector: 'Financials', subSector: 'Payments', industry: 'Digital Wallets', marketCap: 42 },
  { symbol: 'HOOD', name: 'Robinhood Markets', sector: 'Financials', subSector: 'Payments', industry: 'Digital Wallets', marketCap: 10 },
  { symbol: 'MARA', name: 'Marathon Digital', sector: 'Financials', subSector: 'Payments', industry: 'Digital Wallets', marketCap: 4 },
  { symbol: 'CLSK', name: 'CleanSpark Inc', sector: 'Financials', subSector: 'Payments', industry: 'Digital Wallets', marketCap: 3 },
  { symbol: 'RIOT', name: 'Riot Platforms', sector: 'Financials', subSector: 'Payments', industry: 'Digital Wallets', marketCap: 3 },

  // Payments > Cross-Border Payments (5)
  { symbol: 'WU', name: 'Western Union', sector: 'Financials', subSector: 'Payments', industry: 'Cross-Border Payments', marketCap: 4 },
  { symbol: 'REMX', name: 'Remitly Global', sector: 'Financials', subSector: 'Payments', industry: 'Cross-Border Payments', marketCap: 2 },
  { symbol: 'FLYW', name: 'Flywire Corp', sector: 'Financials', subSector: 'Payments', industry: 'Cross-Border Payments', marketCap: 3 },
  { symbol: 'XPEL', name: 'XPEL Inc', sector: 'Financials', subSector: 'Payments', industry: 'Cross-Border Payments', marketCap: 2 },
  { symbol: 'EVRI', name: 'Everi Holdings', sector: 'Financials', subSector: 'Payments', industry: 'Cross-Border Payments', marketCap: 1.5 },

  // Payments > Buy Now Pay Later (5)
  { symbol: 'SEZZL', name: 'Sezzle Inc', sector: 'Financials', subSector: 'Payments', industry: 'Buy Now Pay Later', marketCap: 1 },
  { symbol: 'ZIPL', name: 'Zip Co Ltd', sector: 'Financials', subSector: 'Payments', industry: 'Buy Now Pay Later', marketCap: 0.5 },
  { symbol: 'KNSL', name: 'Kinsale Capital', sector: 'Financials', subSector: 'Payments', industry: 'Buy Now Pay Later', marketCap: 10 },
  { symbol: 'LPRO', name: 'Open Lending', sector: 'Financials', subSector: 'Payments', industry: 'Buy Now Pay Later', marketCap: 0.8 },
  { symbol: 'GDOT', name: 'Green Dot Corp', sector: 'Financials', subSector: 'Payments', industry: 'Buy Now Pay Later', marketCap: 1 },

  // Investment Banking > Capital Markets (5)
  { symbol: 'MS', name: 'Morgan Stanley', sector: 'Financials', subSector: 'Investment Banking', industry: 'Capital Markets', marketCap: 155 },
  { symbol: 'SCHW', name: 'Charles Schwab', sector: 'Financials', subSector: 'Investment Banking', industry: 'Capital Markets', marketCap: 130 },
  { symbol: 'ICE', name: 'Intercontinental Exch', sector: 'Financials', subSector: 'Investment Banking', industry: 'Capital Markets', marketCap: 80 },
  { symbol: 'CME', name: 'CME Group', sector: 'Financials', subSector: 'Investment Banking', industry: 'Capital Markets', marketCap: 75 },
  { symbol: 'NDAQ', name: 'Nasdaq Inc', sector: 'Financials', subSector: 'Investment Banking', industry: 'Capital Markets', marketCap: 38 },

  // Investment Banking > Advisory Services (5)
  { symbol: 'BLK', name: 'BlackRock Inc', sector: 'Financials', subSector: 'Investment Banking', industry: 'Advisory Services', marketCap: 140 },
  { symbol: 'LPL', name: 'LPL Financial', sector: 'Financials', subSector: 'Investment Banking', industry: 'Advisory Services', marketCap: 20 },
  { symbol: 'EVR', name: 'Evercore Inc', sector: 'Financials', subSector: 'Investment Banking', industry: 'Advisory Services', marketCap: 10 },
  { symbol: 'LAZ', name: 'Lazard Ltd', sector: 'Financials', subSector: 'Investment Banking', industry: 'Advisory Services', marketCap: 4.5 },
  { symbol: 'HLI', name: 'Houlihan Lokey', sector: 'Financials', subSector: 'Investment Banking', industry: 'Advisory Services', marketCap: 10 },

  // Investment Banking > Brokerage Services (5)
  { symbol: 'IBKR', name: 'Interactive Brokers', sector: 'Financials', subSector: 'Investment Banking', industry: 'Brokerage Services', marketCap: 45 },
  { symbol: 'LPLA', name: 'LPL Financial', sector: 'Financials', subSector: 'Investment Banking', industry: 'Brokerage Services', marketCap: 18 },
  { symbol: 'VIRT', name: 'Virtu Financial', sector: 'Financials', subSector: 'Investment Banking', industry: 'Brokerage Services', marketCap: 4 },
  { symbol: 'SNEX', name: 'StoneX Group', sector: 'Financials', subSector: 'Investment Banking', industry: 'Brokerage Services', marketCap: 3.5 },
  { symbol: 'BGCP', name: 'BGC Partners', sector: 'Financials', subSector: 'Investment Banking', industry: 'Brokerage Services', marketCap: 4 },

  // Investment Banking > Trading Platforms (5)
  { symbol: 'MKTX', name: 'MarketAxess', sector: 'Financials', subSector: 'Investment Banking', industry: 'Trading Platforms', marketCap: 10 },
  { symbol: 'TW', name: 'Tradeweb Markets', sector: 'Financials', subSector: 'Investment Banking', industry: 'Trading Platforms', marketCap: 22 },
  { symbol: 'CBOE', name: 'Cboe Global Markets', sector: 'Financials', subSector: 'Investment Banking', industry: 'Trading Platforms', marketCap: 18 },
  { symbol: 'BNCH', name: 'Benchmark Electronics', sector: 'Financials', subSector: 'Investment Banking', industry: 'Trading Platforms', marketCap: 1.5 },
  { symbol: 'PIPR', name: 'Piper Sandler', sector: 'Financials', subSector: 'Investment Banking', industry: 'Trading Platforms', marketCap: 5 },

  // Investment Banking > Securities Exchanges (5)
  { symbol: 'SPGI', name: 'S&P Global', sector: 'Financials', subSector: 'Investment Banking', industry: 'Securities Exchanges', marketCap: 140 },
  { symbol: 'MCO', name: 'Moodys Corp', sector: 'Financials', subSector: 'Investment Banking', industry: 'Securities Exchanges', marketCap: 75 },
  { symbol: 'MSCI', name: 'MSCI Inc', sector: 'Financials', subSector: 'Investment Banking', industry: 'Securities Exchanges', marketCap: 42 },
  { symbol: 'FDS', name: 'FactSet Research', sector: 'Financials', subSector: 'Investment Banking', industry: 'Securities Exchanges', marketCap: 18 },
  { symbol: 'VRSK', name: 'Verisk Analytics', sector: 'Financials', subSector: 'Investment Banking', industry: 'Securities Exchanges', marketCap: 36 },

  // Insurance > Life Insurance (5)
  { symbol: 'MET', name: 'MetLife Inc', sector: 'Financials', subSector: 'Insurance', industry: 'Life Insurance', marketCap: 55 },
  { symbol: 'AFL', name: 'Aflac Inc', sector: 'Financials', subSector: 'Insurance', industry: 'Life Insurance', marketCap: 52 },
  { symbol: 'PRU', name: 'Prudential Financial', sector: 'Financials', subSector: 'Insurance', industry: 'Life Insurance', marketCap: 42 },
  { symbol: 'LNC', name: 'Lincoln National', sector: 'Financials', subSector: 'Insurance', industry: 'Life Insurance', marketCap: 5 },
  { symbol: 'UNUM', name: 'Unum Group', sector: 'Financials', subSector: 'Insurance', industry: 'Life Insurance', marketCap: 10 },

  // Insurance > Property Insurance (5)
  { symbol: 'BRK.B', name: 'Berkshire Hathaway', sector: 'Financials', subSector: 'Insurance', industry: 'Property Insurance', marketCap: 900 },
  { symbol: 'PGR', name: 'Progressive Corp', sector: 'Financials', subSector: 'Insurance', industry: 'Property Insurance', marketCap: 130 },
  { symbol: 'ALL', name: 'Allstate Corp', sector: 'Financials', subSector: 'Insurance', industry: 'Property Insurance', marketCap: 42 },
  { symbol: 'TRV', name: 'Travelers Companies', sector: 'Financials', subSector: 'Insurance', industry: 'Property Insurance', marketCap: 52 },
  { symbol: 'CB', name: 'Chubb Ltd', sector: 'Financials', subSector: 'Insurance', industry: 'Property Insurance', marketCap: 105 },

  // Insurance > Reinsurance (5)
  { symbol: 'RNR', name: 'RenaissanceRe', sector: 'Financials', subSector: 'Insurance', industry: 'Reinsurance', marketCap: 12 },
  { symbol: 'RGA', name: 'Reinsurance Group', sector: 'Financials', subSector: 'Insurance', industry: 'Reinsurance', marketCap: 12 },
  { symbol: 'AIG', name: 'American Intl Group', sector: 'Financials', subSector: 'Insurance', industry: 'Reinsurance', marketCap: 48 },
  { symbol: 'EG', name: 'Everest Group', sector: 'Financials', subSector: 'Insurance', industry: 'Reinsurance', marketCap: 15 },
  { symbol: 'ACGL', name: 'Arch Capital Group', sector: 'Financials', subSector: 'Insurance', industry: 'Reinsurance', marketCap: 32 },

  // Insurance > InsurTech (5)
  { symbol: 'LMND', name: 'Lemonade Inc', sector: 'Financials', subSector: 'Insurance', industry: 'InsurTech', marketCap: 1.5 },
  { symbol: 'ROOT', name: 'Root Inc', sector: 'Financials', subSector: 'Insurance', industry: 'InsurTech', marketCap: 0.8 },
  { symbol: 'HIG', name: 'Hartford Financial', sector: 'Financials', subSector: 'Insurance', industry: 'InsurTech', marketCap: 28 },
  { symbol: 'GOOSE', name: 'Goosehead Insurance', sector: 'Financials', subSector: 'Insurance', industry: 'InsurTech', marketCap: 2 },
  { symbol: 'KNSL2', name: 'Kinsale Capital Grp', sector: 'Financials', subSector: 'Insurance', industry: 'InsurTech', marketCap: 10 },

  // Insurance > Specialty Insurance (5)
  { symbol: 'CINF', name: 'Cincinnati Financial', sector: 'Financials', subSector: 'Insurance', industry: 'Specialty Insurance', marketCap: 20 },
  { symbol: 'WRB', name: 'W.R. Berkley', sector: 'Financials', subSector: 'Insurance', industry: 'Specialty Insurance', marketCap: 22 },
  { symbol: 'MKL', name: 'Markel Group', sector: 'Financials', subSector: 'Insurance', industry: 'Specialty Insurance', marketCap: 18 },
  { symbol: 'RE', name: 'Everest Re Group', sector: 'Financials', subSector: 'Insurance', industry: 'Specialty Insurance', marketCap: 14 },
  { symbol: 'AJG', name: 'Arthur J. Gallagher', sector: 'Financials', subSector: 'Insurance', industry: 'Specialty Insurance', marketCap: 55 },

  // Asset Management > Wealth Management (5)
  { symbol: 'TROW', name: 'T. Rowe Price Group', sector: 'Financials', subSector: 'Asset Management', industry: 'Wealth Management', marketCap: 28 },
  { symbol: 'BEN', name: 'Franklin Resources', sector: 'Financials', subSector: 'Asset Management', industry: 'Wealth Management', marketCap: 14 },
  { symbol: 'AMG', name: 'Affiliated Managers', sector: 'Financials', subSector: 'Asset Management', industry: 'Wealth Management', marketCap: 6 },
  { symbol: 'IVZ', name: 'Invesco Ltd', sector: 'Financials', subSector: 'Asset Management', industry: 'Wealth Management', marketCap: 8 },
  { symbol: 'WDR', name: 'Waddell & Reed', sector: 'Financials', subSector: 'Asset Management', industry: 'Wealth Management', marketCap: 1.5 },

  // Asset Management > Fund Management (5)
  { symbol: 'BX', name: 'Blackstone Inc', sector: 'Financials', subSector: 'Asset Management', industry: 'Fund Management', marketCap: 170 },
  { symbol: 'KKR', name: 'KKR & Co Inc', sector: 'Financials', subSector: 'Asset Management', industry: 'Fund Management', marketCap: 100 },
  { symbol: 'APO', name: 'Apollo Global Mgmt', sector: 'Financials', subSector: 'Asset Management', industry: 'Fund Management', marketCap: 75 },
  { symbol: 'ARES', name: 'Ares Management', sector: 'Financials', subSector: 'Asset Management', industry: 'Fund Management', marketCap: 35 },
  { symbol: 'OWL', name: 'Blue Owl Capital', sector: 'Financials', subSector: 'Asset Management', industry: 'Fund Management', marketCap: 22 },

  // Asset Management > Private Equity (5)
  { symbol: 'CG', name: 'Carlyle Group', sector: 'Financials', subSector: 'Asset Management', industry: 'Private Equity', marketCap: 16 },
  { symbol: 'BAM', name: 'Brookfield Asset Mgmt', sector: 'Financials', subSector: 'Asset Management', industry: 'Private Equity', marketCap: 75 },
  { symbol: 'TPG', name: 'TPG Inc', sector: 'Financials', subSector: 'Asset Management', industry: 'Private Equity', marketCap: 12 },
  { symbol: 'EQTAB', name: 'EQT AB', sector: 'Financials', subSector: 'Asset Management', industry: 'Private Equity', marketCap: 8 },
  { symbol: 'HLNE', name: 'Hamilton Lane', sector: 'Financials', subSector: 'Asset Management', industry: 'Private Equity', marketCap: 8 },

  // Asset Management > Hedge Funds (5)
  { symbol: 'MNTL', name: 'Metals Acquisition', sector: 'Financials', subSector: 'Asset Management', industry: 'Hedge Funds', marketCap: 1 },
  { symbol: 'TWO', name: 'Two Harbors Invest', sector: 'Financials', subSector: 'Asset Management', industry: 'Hedge Funds', marketCap: 3 },
  { symbol: 'NLY', name: 'Annaly Capital', sector: 'Financials', subSector: 'Asset Management', industry: 'Hedge Funds', marketCap: 10 },
  { symbol: 'AGNC', name: 'AGNC Investment', sector: 'Financials', subSector: 'Asset Management', industry: 'Hedge Funds', marketCap: 7 },
  { symbol: 'STWD', name: 'Starwood Property', sector: 'Financials', subSector: 'Asset Management', industry: 'Hedge Funds', marketCap: 7 },

  // Asset Management > Robo-Advisory (5)
  { symbol: 'LPLA2', name: 'LPL Robo Platform', sector: 'Financials', subSector: 'Asset Management', industry: 'Robo-Advisory', marketCap: 2 },
  { symbol: 'SCHW2', name: 'Schwab Intelligent', sector: 'Financials', subSector: 'Asset Management', industry: 'Robo-Advisory', marketCap: 5 },
  { symbol: 'ALLY', name: 'Ally Financial', sector: 'Financials', subSector: 'Asset Management', industry: 'Robo-Advisory', marketCap: 10 },
  { symbol: 'ETFC', name: 'E*TRADE Core', sector: 'Financials', subSector: 'Asset Management', industry: 'Robo-Advisory', marketCap: 3 },
  { symbol: 'WFCF', name: 'WealthFront Corp', sector: 'Financials', subSector: 'Asset Management', industry: 'Robo-Advisory', marketCap: 1 },

  // ===============================================
  // CONSUMER
  // ===============================================

  // E-Commerce > Internet Retail (5)
  { symbol: 'AMZN', name: 'Amazon.com', sector: 'Consumer', subSector: 'E-Commerce', industry: 'Internet Retail', marketCap: 2000 },
  { symbol: 'MELI', name: 'MercadoLibre', sector: 'Consumer', subSector: 'E-Commerce', industry: 'Internet Retail', marketCap: 85 },
  { symbol: 'JD', name: 'JD.com Inc', sector: 'Consumer', subSector: 'E-Commerce', industry: 'Internet Retail', marketCap: 45 },
  { symbol: 'PDD', name: 'PDD Holdings', sector: 'Consumer', subSector: 'E-Commerce', industry: 'Internet Retail', marketCap: 130 },
  { symbol: 'BABA', name: 'Alibaba Group', sector: 'Consumer', subSector: 'E-Commerce', industry: 'Internet Retail', marketCap: 200 },

  // E-Commerce > Marketplace Platforms (5)
  { symbol: 'EBAY', name: 'eBay Inc', sector: 'Consumer', subSector: 'E-Commerce', industry: 'Marketplace Platforms', marketCap: 28 },
  { symbol: 'ETSY', name: 'Etsy Inc', sector: 'Consumer', subSector: 'E-Commerce', industry: 'Marketplace Platforms', marketCap: 8 },
  { symbol: 'CPNG', name: 'Coupang Inc', sector: 'Consumer', subSector: 'E-Commerce', industry: 'Marketplace Platforms', marketCap: 35 },
  { symbol: 'FTCH', name: 'Farfetch Ltd', sector: 'Consumer', subSector: 'E-Commerce', industry: 'Marketplace Platforms', marketCap: 2 },
  { symbol: 'REAL', name: 'TheRealReal Inc', sector: 'Consumer', subSector: 'E-Commerce', industry: 'Marketplace Platforms', marketCap: 0.5 },

  // E-Commerce > Direct-to-Consumer (5)
  { symbol: 'CHWY', name: 'Chewy Inc', sector: 'Consumer', subSector: 'E-Commerce', industry: 'Direct-to-Consumer', marketCap: 12 },
  { symbol: 'PRPL', name: 'Purple Innovation', sector: 'Consumer', subSector: 'E-Commerce', industry: 'Direct-to-Consumer', marketCap: 0.3 },
  { symbol: 'LOVE', name: 'Lovesac Company', sector: 'Consumer', subSector: 'E-Commerce', industry: 'Direct-to-Consumer', marketCap: 0.5 },
  { symbol: 'BIRD', name: 'Allbirds Inc', sector: 'Consumer', subSector: 'E-Commerce', industry: 'Direct-to-Consumer', marketCap: 0.1 },
  { symbol: 'BARK', name: 'BARK Inc', sector: 'Consumer', subSector: 'E-Commerce', industry: 'Direct-to-Consumer', marketCap: 0.3 },

  // E-Commerce > Subscription Commerce (5)
  { symbol: 'NFLX', name: 'Netflix Inc', sector: 'Consumer', subSector: 'E-Commerce', industry: 'Subscription Commerce', marketCap: 350 },
  { symbol: 'SPOT', name: 'Spotify Technology', sector: 'Consumer', subSector: 'E-Commerce', industry: 'Subscription Commerce', marketCap: 75 },
  { symbol: 'PARA', name: 'Paramount Global', sector: 'Consumer', subSector: 'E-Commerce', industry: 'Subscription Commerce', marketCap: 8 },
  { symbol: 'SIRI', name: 'Sirius XM', sector: 'Consumer', subSector: 'E-Commerce', industry: 'Subscription Commerce', marketCap: 18 },
  { symbol: 'PTON', name: 'Peloton Interactive', sector: 'Consumer', subSector: 'E-Commerce', industry: 'Subscription Commerce', marketCap: 2 },

  // E-Commerce > Social Commerce (5)
  { symbol: 'WISH', name: 'ContextLogic Inc', sector: 'Consumer', subSector: 'E-Commerce', industry: 'Social Commerce', marketCap: 0.2 },
  { symbol: 'POSH', name: 'Poshmark Inc', sector: 'Consumer', subSector: 'E-Commerce', industry: 'Social Commerce', marketCap: 1.5 },
  { symbol: 'BZUN', name: 'Baozun Inc', sector: 'Consumer', subSector: 'E-Commerce', industry: 'Social Commerce', marketCap: 0.3 },
  { symbol: 'TKAY', name: 'Takealot Group', sector: 'Consumer', subSector: 'E-Commerce', industry: 'Social Commerce', marketCap: 0.5 },
  { symbol: 'GLNG2', name: 'Grindr Inc', sector: 'Consumer', subSector: 'E-Commerce', industry: 'Social Commerce', marketCap: 1.5 },

  // Retail > General Merchandise (5)
  { symbol: 'WMT', name: 'Walmart Inc', sector: 'Consumer', subSector: 'Retail', industry: 'General Merchandise', marketCap: 520 },
  { symbol: 'COST', name: 'Costco Wholesale', sector: 'Consumer', subSector: 'Retail', industry: 'General Merchandise', marketCap: 350 },
  { symbol: 'TGT', name: 'Target Corp', sector: 'Consumer', subSector: 'Retail', industry: 'General Merchandise', marketCap: 65 },
  { symbol: 'KR', name: 'Kroger Co', sector: 'Consumer', subSector: 'Retail', industry: 'General Merchandise', marketCap: 40 },
  { symbol: 'SYY', name: 'Sysco Corp', sector: 'Consumer', subSector: 'Retail', industry: 'General Merchandise', marketCap: 38 },

  // Retail > Home Improvement (5)
  { symbol: 'HD', name: 'Home Depot', sector: 'Consumer', subSector: 'Retail', industry: 'Home Improvement', marketCap: 360 },
  { symbol: 'LOW', name: 'Lowes Companies', sector: 'Consumer', subSector: 'Retail', industry: 'Home Improvement', marketCap: 140 },
  { symbol: 'WSM', name: 'Williams-Sonoma', sector: 'Consumer', subSector: 'Retail', industry: 'Home Improvement', marketCap: 18 },
  { symbol: 'RH', name: 'RH (Restoration)', sector: 'Consumer', subSector: 'Retail', industry: 'Home Improvement', marketCap: 6 },
  { symbol: 'FND', name: 'Floor & Decor', sector: 'Consumer', subSector: 'Retail', industry: 'Home Improvement', marketCap: 10 },

  // Retail > Specialty Retail (5)
  { symbol: 'ORLY', name: 'OReilly Automotive', sector: 'Consumer', subSector: 'Retail', industry: 'Specialty Retail', marketCap: 60 },
  { symbol: 'AZO', name: 'AutoZone Inc', sector: 'Consumer', subSector: 'Retail', industry: 'Specialty Retail', marketCap: 52 },
  { symbol: 'BBY', name: 'Best Buy Co', sector: 'Consumer', subSector: 'Retail', industry: 'Specialty Retail', marketCap: 18 },
  { symbol: 'ULTA', name: 'Ulta Beauty', sector: 'Consumer', subSector: 'Retail', industry: 'Specialty Retail', marketCap: 22 },
  { symbol: 'FIVE', name: 'Five Below Inc', sector: 'Consumer', subSector: 'Retail', industry: 'Specialty Retail', marketCap: 8 },

  // Retail > Warehouse Clubs (5)
  { symbol: 'BJ', name: 'BJs Wholesale', sector: 'Consumer', subSector: 'Retail', industry: 'Warehouse Clubs', marketCap: 12 },
  { symbol: 'PSMT', name: 'PriceSmart Inc', sector: 'Consumer', subSector: 'Retail', industry: 'Warehouse Clubs', marketCap: 2.5 },
  { symbol: 'ARCO', name: 'Arcos Dorados', sector: 'Consumer', subSector: 'Retail', industry: 'Warehouse Clubs', marketCap: 4 },
  { symbol: 'CASY', name: 'Caseys General', sector: 'Consumer', subSector: 'Retail', industry: 'Warehouse Clubs', marketCap: 14 },
  { symbol: 'IMKTA', name: 'Ingles Markets', sector: 'Consumer', subSector: 'Retail', industry: 'Warehouse Clubs', marketCap: 1 },

  // Retail > Dollar Stores (5)
  { symbol: 'DG', name: 'Dollar General', sector: 'Consumer', subSector: 'Retail', industry: 'Dollar Stores', marketCap: 28 },
  { symbol: 'DLTR', name: 'Dollar Tree', sector: 'Consumer', subSector: 'Retail', industry: 'Dollar Stores', marketCap: 25 },
  { symbol: 'OLLI', name: 'Ollies Bargain', sector: 'Consumer', subSector: 'Retail', industry: 'Dollar Stores', marketCap: 5 },
  { symbol: 'BIG', name: 'Big Lots Inc', sector: 'Consumer', subSector: 'Retail', industry: 'Dollar Stores', marketCap: 0.2 },
  { symbol: 'ROSS', name: 'Ross Stores', sector: 'Consumer', subSector: 'Retail', industry: 'Dollar Stores', marketCap: 42 },

  // Auto > Electric Vehicles (5)
  { symbol: 'TSLA', name: 'Tesla Inc', sector: 'Consumer', subSector: 'Auto', industry: 'Electric Vehicles', marketCap: 800 },
  { symbol: 'RIVN', name: 'Rivian Automotive', sector: 'Consumer', subSector: 'Auto', industry: 'Electric Vehicles', marketCap: 14 },
  { symbol: 'LCID', name: 'Lucid Group', sector: 'Consumer', subSector: 'Auto', industry: 'Electric Vehicles', marketCap: 7 },
  { symbol: 'NIO', name: 'NIO Inc', sector: 'Consumer', subSector: 'Auto', industry: 'Electric Vehicles', marketCap: 10 },
  { symbol: 'XPEV', name: 'XPeng Inc', sector: 'Consumer', subSector: 'Auto', industry: 'Electric Vehicles', marketCap: 8 },

  // Auto > Auto Manufacturers (5)
  { symbol: 'GM', name: 'General Motors', sector: 'Consumer', subSector: 'Auto', industry: 'Auto Manufacturers', marketCap: 50 },
  { symbol: 'F', name: 'Ford Motor Co', sector: 'Consumer', subSector: 'Auto', industry: 'Auto Manufacturers', marketCap: 45 },
  { symbol: 'TM', name: 'Toyota Motor', sector: 'Consumer', subSector: 'Auto', industry: 'Auto Manufacturers', marketCap: 250 },
  { symbol: 'HMC', name: 'Honda Motor Co', sector: 'Consumer', subSector: 'Auto', industry: 'Auto Manufacturers', marketCap: 50 },
  { symbol: 'STLA', name: 'Stellantis NV', sector: 'Consumer', subSector: 'Auto', industry: 'Auto Manufacturers', marketCap: 40 },

  // Auto > Auto Parts & Services (5)
  { symbol: 'APH', name: 'Amphenol Corp', sector: 'Consumer', subSector: 'Auto', industry: 'Auto Parts & Services', marketCap: 75 },
  { symbol: 'BWA', name: 'BorgWarner Inc', sector: 'Consumer', subSector: 'Auto', industry: 'Auto Parts & Services', marketCap: 8 },
  { symbol: 'LEA', name: 'Lear Corp', sector: 'Consumer', subSector: 'Auto', industry: 'Auto Parts & Services', marketCap: 8 },
  { symbol: 'APTV', name: 'Aptiv PLC', sector: 'Consumer', subSector: 'Auto', industry: 'Auto Parts & Services', marketCap: 18 },
  { symbol: 'ALV', name: 'Autoliv Inc', sector: 'Consumer', subSector: 'Auto', industry: 'Auto Parts & Services', marketCap: 8 },

  // Auto > Autonomous Driving (5)
  { symbol: 'MBLY', name: 'Mobileye Global', sector: 'Consumer', subSector: 'Auto', industry: 'Autonomous Driving', marketCap: 15 },
  { symbol: 'LAZR', name: 'Luminar Technologies', sector: 'Consumer', subSector: 'Auto', industry: 'Autonomous Driving', marketCap: 1 },
  { symbol: 'INVZ', name: 'Innoviz Technologies', sector: 'Consumer', subSector: 'Auto', industry: 'Autonomous Driving', marketCap: 0.5 },
  { symbol: 'OUST', name: 'Ouster Inc', sector: 'Consumer', subSector: 'Auto', industry: 'Autonomous Driving', marketCap: 0.3 },
  { symbol: 'AEVA', name: 'Aeva Technologies', sector: 'Consumer', subSector: 'Auto', industry: 'Autonomous Driving', marketCap: 0.4 },

  // Auto > EV Charging (5)
  { symbol: 'CHPT', name: 'ChargePoint Holdings', sector: 'Consumer', subSector: 'Auto', industry: 'EV Charging', marketCap: 1 },
  { symbol: 'BLNK', name: 'Blink Charging', sector: 'Consumer', subSector: 'Auto', industry: 'EV Charging', marketCap: 0.5 },
  { symbol: 'EVGO', name: 'EVgo Inc', sector: 'Consumer', subSector: 'Auto', industry: 'EV Charging', marketCap: 1 },
  { symbol: 'VLTA', name: 'Volta Inc', sector: 'Consumer', subSector: 'Auto', industry: 'EV Charging', marketCap: 0.2 },
  { symbol: 'DCFC', name: 'Tritium DCFC', sector: 'Consumer', subSector: 'Auto', industry: 'EV Charging', marketCap: 0.1 },

  // Apparel > Footwear & Accessories (5)
  { symbol: 'NKE', name: 'Nike Inc', sector: 'Consumer', subSector: 'Apparel', industry: 'Footwear & Accessories', marketCap: 130 },
  { symbol: 'TJX', name: 'TJX Companies', sector: 'Consumer', subSector: 'Apparel', industry: 'Footwear & Accessories', marketCap: 120 },
  { symbol: 'DECK', name: 'Deckers Outdoor', sector: 'Consumer', subSector: 'Apparel', industry: 'Footwear & Accessories', marketCap: 22 },
  { symbol: 'SKX', name: 'Skechers USA', sector: 'Consumer', subSector: 'Apparel', industry: 'Footwear & Accessories', marketCap: 10 },
  { symbol: 'CROX', name: 'Crocs Inc', sector: 'Consumer', subSector: 'Apparel', industry: 'Footwear & Accessories', marketCap: 8 },

  // Apparel > Luxury Goods (5)
  { symbol: 'LVMUY', name: 'LVMH Moet Hennessy', sector: 'Consumer', subSector: 'Apparel', industry: 'Luxury Goods', marketCap: 380 },
  { symbol: 'RMS', name: 'Hermes Intl', sector: 'Consumer', subSector: 'Apparel', industry: 'Luxury Goods', marketCap: 220 },
  { symbol: 'CPRI', name: 'Capri Holdings', sector: 'Consumer', subSector: 'Apparel', industry: 'Luxury Goods', marketCap: 5 },
  { symbol: 'TPR', name: 'Tapestry Inc', sector: 'Consumer', subSector: 'Apparel', industry: 'Luxury Goods', marketCap: 12 },
  { symbol: 'BRBY', name: 'Burberry Group', sector: 'Consumer', subSector: 'Apparel', industry: 'Luxury Goods', marketCap: 8 },

  // Apparel > Athletic Wear (5)
  { symbol: 'LULU', name: 'Lululemon Athletica', sector: 'Consumer', subSector: 'Apparel', industry: 'Athletic Wear', marketCap: 40 },
  { symbol: 'UAA', name: 'Under Armour', sector: 'Consumer', subSector: 'Apparel', industry: 'Athletic Wear', marketCap: 3 },
  { symbol: 'ADS', name: 'Adidas AG', sector: 'Consumer', subSector: 'Apparel', industry: 'Athletic Wear', marketCap: 38 },
  { symbol: 'ONON', name: 'On Holding AG', sector: 'Consumer', subSector: 'Apparel', industry: 'Athletic Wear', marketCap: 15 },
  { symbol: 'GIL', name: 'Gildan Activewear', sector: 'Consumer', subSector: 'Apparel', industry: 'Athletic Wear', marketCap: 7 },

  // Apparel > Fast Fashion (5)
  { symbol: 'INDT', name: 'Inditex SA', sector: 'Consumer', subSector: 'Apparel', industry: 'Fast Fashion', marketCap: 120 },
  { symbol: 'HM', name: 'H&M Hennes', sector: 'Consumer', subSector: 'Apparel', industry: 'Fast Fashion', marketCap: 25 },
  { symbol: 'GPS', name: 'Gap Inc', sector: 'Consumer', subSector: 'Apparel', industry: 'Fast Fashion', marketCap: 8 },
  { symbol: 'ANF', name: 'Abercrombie & Fitch', sector: 'Consumer', subSector: 'Apparel', industry: 'Fast Fashion', marketCap: 5 },
  { symbol: 'AEO', name: 'American Eagle', sector: 'Consumer', subSector: 'Apparel', industry: 'Fast Fashion', marketCap: 3.5 },

  // Apparel > Outdoor & Recreation (5)
  { symbol: 'COLM', name: 'Columbia Sportswear', sector: 'Consumer', subSector: 'Apparel', industry: 'Outdoor & Recreation', marketCap: 5 },
  { symbol: 'VFC', name: 'VF Corp', sector: 'Consumer', subSector: 'Apparel', industry: 'Outdoor & Recreation', marketCap: 7 },
  { symbol: 'PVH', name: 'PVH Corp', sector: 'Consumer', subSector: 'Apparel', industry: 'Outdoor & Recreation', marketCap: 5 },
  { symbol: 'RL', name: 'Ralph Lauren', sector: 'Consumer', subSector: 'Apparel', industry: 'Outdoor & Recreation', marketCap: 12 },
  { symbol: 'GRMN', name: 'Garmin Ltd', sector: 'Consumer', subSector: 'Apparel', industry: 'Outdoor & Recreation', marketCap: 28 },

  // Food & Beverage > Beverages (5)
  { symbol: 'KO', name: 'Coca-Cola Co', sector: 'Consumer', subSector: 'Food & Beverage', industry: 'Beverages', marketCap: 265 },
  { symbol: 'PEP', name: 'PepsiCo Inc', sector: 'Consumer', subSector: 'Food & Beverage', industry: 'Beverages', marketCap: 230 },
  { symbol: 'STZ', name: 'Constellation Brands', sector: 'Consumer', subSector: 'Food & Beverage', industry: 'Beverages', marketCap: 45 },
  { symbol: 'MNST', name: 'Monster Beverage', sector: 'Consumer', subSector: 'Food & Beverage', industry: 'Beverages', marketCap: 55 },
  { symbol: 'SAM', name: 'Boston Beer', sector: 'Consumer', subSector: 'Food & Beverage', industry: 'Beverages', marketCap: 3 },

  // Food & Beverage > Packaged Foods (5)
  { symbol: 'MDLZ', name: 'Mondelez Intl', sector: 'Consumer', subSector: 'Food & Beverage', industry: 'Packaged Foods', marketCap: 90 },
  { symbol: 'GIS', name: 'General Mills', sector: 'Consumer', subSector: 'Food & Beverage', industry: 'Packaged Foods', marketCap: 38 },
  { symbol: 'HSY', name: 'Hershey Company', sector: 'Consumer', subSector: 'Food & Beverage', industry: 'Packaged Foods', marketCap: 32 },
  { symbol: 'K', name: 'Kellanova', sector: 'Consumer', subSector: 'Food & Beverage', industry: 'Packaged Foods', marketCap: 22 },
  { symbol: 'CPB', name: 'Campbell Soup', sector: 'Consumer', subSector: 'Food & Beverage', industry: 'Packaged Foods', marketCap: 14 },

  // Food & Beverage > Restaurants & QSR (5)
  { symbol: 'MCD', name: 'McDonalds Corp', sector: 'Consumer', subSector: 'Food & Beverage', industry: 'Restaurants & QSR', marketCap: 210 },
  { symbol: 'SBUX', name: 'Starbucks Corp', sector: 'Consumer', subSector: 'Food & Beverage', industry: 'Restaurants & QSR', marketCap: 110 },
  { symbol: 'CMG', name: 'Chipotle Mexican', sector: 'Consumer', subSector: 'Food & Beverage', industry: 'Restaurants & QSR', marketCap: 75 },
  { symbol: 'YUM', name: 'Yum Brands', sector: 'Consumer', subSector: 'Food & Beverage', industry: 'Restaurants & QSR', marketCap: 38 },
  { symbol: 'DPZ', name: 'Dominos Pizza', sector: 'Consumer', subSector: 'Food & Beverage', industry: 'Restaurants & QSR', marketCap: 15 },

  // Food & Beverage > Organic & Natural (5)
  { symbol: 'HAIN', name: 'Hain Celestial', sector: 'Consumer', subSector: 'Food & Beverage', industry: 'Organic & Natural', marketCap: 0.8 },
  { symbol: 'SFM', name: 'Sprouts Farmers', sector: 'Consumer', subSector: 'Food & Beverage', industry: 'Organic & Natural', marketCap: 8 },
  { symbol: 'UNFI', name: 'United Natural Foods', sector: 'Consumer', subSector: 'Food & Beverage', industry: 'Organic & Natural', marketCap: 1 },
  { symbol: 'VITL', name: 'Vital Farms', sector: 'Consumer', subSector: 'Food & Beverage', industry: 'Organic & Natural', marketCap: 1.5 },
  { symbol: 'BYND', name: 'Beyond Meat', sector: 'Consumer', subSector: 'Food & Beverage', industry: 'Organic & Natural', marketCap: 0.5 },

  // Food & Beverage > Snacks & Confections (5)
  { symbol: 'HRL', name: 'Hormel Foods', sector: 'Consumer', subSector: 'Food & Beverage', industry: 'Snacks & Confections', marketCap: 18 },
  { symbol: 'SJM', name: 'JM Smucker', sector: 'Consumer', subSector: 'Food & Beverage', industry: 'Snacks & Confections', marketCap: 15 },
  { symbol: 'MKC', name: 'McCormick & Co', sector: 'Consumer', subSector: 'Food & Beverage', industry: 'Snacks & Confections', marketCap: 22 },
  { symbol: 'CAG', name: 'Conagra Brands', sector: 'Consumer', subSector: 'Food & Beverage', industry: 'Snacks & Confections', marketCap: 14 },
  { symbol: 'TWNK', name: 'Hostess Brands', sector: 'Consumer', subSector: 'Food & Beverage', industry: 'Snacks & Confections', marketCap: 5 },

  // ===============================================
  // ENERGY
  // ===============================================

  // Oil & Gas > Integrated Oil & Gas (5)
  { symbol: 'XOM', name: 'Exxon Mobil', sector: 'Energy', subSector: 'Oil & Gas', industry: 'Integrated Oil & Gas', marketCap: 460 },
  { symbol: 'CVX', name: 'Chevron Corp', sector: 'Energy', subSector: 'Oil & Gas', industry: 'Integrated Oil & Gas', marketCap: 290 },
  { symbol: 'SHEL', name: 'Shell PLC', sector: 'Energy', subSector: 'Oil & Gas', industry: 'Integrated Oil & Gas', marketCap: 210 },
  { symbol: 'TTE', name: 'TotalEnergies', sector: 'Energy', subSector: 'Oil & Gas', industry: 'Integrated Oil & Gas', marketCap: 150 },
  { symbol: 'BP', name: 'BP PLC', sector: 'Energy', subSector: 'Oil & Gas', industry: 'Integrated Oil & Gas', marketCap: 95 },

  // Oil & Gas > Exploration & Production (5)
  { symbol: 'COP', name: 'ConocoPhillips', sector: 'Energy', subSector: 'Oil & Gas', industry: 'Exploration & Production', marketCap: 130 },
  { symbol: 'EOG', name: 'EOG Resources', sector: 'Energy', subSector: 'Oil & Gas', industry: 'Exploration & Production', marketCap: 72 },
  { symbol: 'PXD', name: 'Pioneer Natural Res', sector: 'Energy', subSector: 'Oil & Gas', industry: 'Exploration & Production', marketCap: 55 },
  { symbol: 'DVN', name: 'Devon Energy', sector: 'Energy', subSector: 'Oil & Gas', industry: 'Exploration & Production', marketCap: 30 },
  { symbol: 'FANG', name: 'Diamondback Energy', sector: 'Energy', subSector: 'Oil & Gas', industry: 'Exploration & Production', marketCap: 35 },

  // Oil & Gas > Refining & Marketing (5)
  { symbol: 'MPC', name: 'Marathon Petroleum', sector: 'Energy', subSector: 'Oil & Gas', industry: 'Refining & Marketing', marketCap: 60 },
  { symbol: 'VLO', name: 'Valero Energy', sector: 'Energy', subSector: 'Oil & Gas', industry: 'Refining & Marketing', marketCap: 45 },
  { symbol: 'PSX', name: 'Phillips 66', sector: 'Energy', subSector: 'Oil & Gas', industry: 'Refining & Marketing', marketCap: 55 },
  { symbol: 'DK', name: 'Delek US Holdings', sector: 'Energy', subSector: 'Oil & Gas', industry: 'Refining & Marketing', marketCap: 2 },
  { symbol: 'PBF', name: 'PBF Energy', sector: 'Energy', subSector: 'Oil & Gas', industry: 'Refining & Marketing', marketCap: 5 },

  // Oil & Gas > Oil Sands (5)
  { symbol: 'SU', name: 'Suncor Energy', sector: 'Energy', subSector: 'Oil & Gas', industry: 'Oil Sands', marketCap: 42 },
  { symbol: 'CNQ', name: 'Canadian Natural Res', sector: 'Energy', subSector: 'Oil & Gas', industry: 'Oil Sands', marketCap: 65 },
  { symbol: 'CVE', name: 'Cenovus Energy', sector: 'Energy', subSector: 'Oil & Gas', industry: 'Oil Sands', marketCap: 28 },
  { symbol: 'IMO', name: 'Imperial Oil', sector: 'Energy', subSector: 'Oil & Gas', industry: 'Oil Sands', marketCap: 28 },
  { symbol: 'MEG', name: 'MEG Energy', sector: 'Energy', subSector: 'Oil & Gas', industry: 'Oil Sands', marketCap: 5 },

  // Oil & Gas > Natural Gas Producers (5)
  { symbol: 'EQT', name: 'EQT Corp', sector: 'Energy', subSector: 'Oil & Gas', industry: 'Natural Gas Producers', marketCap: 18 },
  { symbol: 'AR', name: 'Antero Resources', sector: 'Energy', subSector: 'Oil & Gas', industry: 'Natural Gas Producers', marketCap: 8 },
  { symbol: 'RRC', name: 'Range Resources', sector: 'Energy', subSector: 'Oil & Gas', industry: 'Natural Gas Producers', marketCap: 8 },
  { symbol: 'SWN', name: 'Southwestern Energy', sector: 'Energy', subSector: 'Oil & Gas', industry: 'Natural Gas Producers', marketCap: 6 },
  { symbol: 'CHK', name: 'Chesapeake Energy', sector: 'Energy', subSector: 'Oil & Gas', industry: 'Natural Gas Producers', marketCap: 10 },

  // Renewables > Solar Energy (5)
  { symbol: 'ENPH', name: 'Enphase Energy', sector: 'Energy', subSector: 'Renewables', industry: 'Solar Energy', marketCap: 18 },
  { symbol: 'FSLR', name: 'First Solar Inc', sector: 'Energy', subSector: 'Renewables', industry: 'Solar Energy', marketCap: 22 },
  { symbol: 'SEDG', name: 'SolarEdge Tech', sector: 'Energy', subSector: 'Renewables', industry: 'Solar Energy', marketCap: 3 },
  { symbol: 'RUN', name: 'Sunrun Inc', sector: 'Energy', subSector: 'Renewables', industry: 'Solar Energy', marketCap: 4 },
  { symbol: 'NOVA', name: 'Sunnova Energy', sector: 'Energy', subSector: 'Renewables', industry: 'Solar Energy', marketCap: 1 },

  // Renewables > Wind Energy (5)
  { symbol: 'VWDRY', name: 'Vestas Wind Systems', sector: 'Energy', subSector: 'Renewables', industry: 'Wind Energy', marketCap: 18 },
  { symbol: 'ORA', name: 'Ormat Technologies', sector: 'Energy', subSector: 'Renewables', industry: 'Wind Energy', marketCap: 5 },
  { symbol: 'CWEN', name: 'Clearway Energy', sector: 'Energy', subSector: 'Renewables', industry: 'Wind Energy', marketCap: 6 },
  { symbol: 'AY', name: 'Atlantica Sustain', sector: 'Energy', subSector: 'Renewables', industry: 'Wind Energy', marketCap: 3 },
  { symbol: 'WNDY', name: 'Global Wind Energy', sector: 'Energy', subSector: 'Renewables', industry: 'Wind Energy', marketCap: 1 },

  // Renewables > Hydrogen & Fuel Cells (5)
  { symbol: 'PLUG', name: 'Plug Power Inc', sector: 'Energy', subSector: 'Renewables', industry: 'Hydrogen & Fuel Cells', marketCap: 2 },
  { symbol: 'BE', name: 'Bloom Energy Corp', sector: 'Energy', subSector: 'Renewables', industry: 'Hydrogen & Fuel Cells', marketCap: 3 },
  { symbol: 'BLDP', name: 'Ballard Power', sector: 'Energy', subSector: 'Renewables', industry: 'Hydrogen & Fuel Cells', marketCap: 0.8 },
  { symbol: 'FCEL', name: 'FuelCell Energy', sector: 'Energy', subSector: 'Renewables', industry: 'Hydrogen & Fuel Cells', marketCap: 0.5 },
  { symbol: 'HYDR', name: 'Hydrogen One', sector: 'Energy', subSector: 'Renewables', industry: 'Hydrogen & Fuel Cells', marketCap: 0.3 },

  // Renewables > Energy Storage (5)
  { symbol: 'STEM', name: 'Stem Inc', sector: 'Energy', subSector: 'Renewables', industry: 'Energy Storage', marketCap: 0.3 },
  { symbol: 'EOSE', name: 'Eos Energy', sector: 'Energy', subSector: 'Renewables', industry: 'Energy Storage', marketCap: 0.5 },
  { symbol: 'FLUX', name: 'Flux Power', sector: 'Energy', subSector: 'Renewables', industry: 'Energy Storage', marketCap: 0.1 },
  { symbol: 'AMPS', name: 'Altus Power', sector: 'Energy', subSector: 'Renewables', industry: 'Energy Storage', marketCap: 1 },
  { symbol: 'ARRY', name: 'Array Technologies', sector: 'Energy', subSector: 'Renewables', industry: 'Energy Storage', marketCap: 2 },

  // Renewables > Geothermal Energy (5)
  { symbol: 'ORA2', name: 'Ormat Tech Geo', sector: 'Energy', subSector: 'Renewables', industry: 'Geothermal Energy', marketCap: 4 },
  { symbol: 'LTHM', name: 'Livent Corp', sector: 'Energy', subSector: 'Renewables', industry: 'Geothermal Energy', marketCap: 3 },
  { symbol: 'ALB', name: 'Albemarle Corp', sector: 'Energy', subSector: 'Renewables', industry: 'Geothermal Energy', marketCap: 12 },
  { symbol: 'SQM', name: 'Sociedad Quimica', sector: 'Energy', subSector: 'Renewables', industry: 'Geothermal Energy', marketCap: 10 },
  { symbol: 'LAC', name: 'Lithium Americas', sector: 'Energy', subSector: 'Renewables', industry: 'Geothermal Energy', marketCap: 1.5 },

  // Services > Oil & Gas Equipment (5)
  { symbol: 'SLB', name: 'Schlumberger Ltd', sector: 'Energy', subSector: 'Services', industry: 'Oil & Gas Equipment', marketCap: 65 },
  { symbol: 'BKR', name: 'Baker Hughes Co', sector: 'Energy', subSector: 'Services', industry: 'Oil & Gas Equipment', marketCap: 38 },
  { symbol: 'FTI', name: 'TechnipFMC PLC', sector: 'Energy', subSector: 'Services', industry: 'Oil & Gas Equipment', marketCap: 12 },
  { symbol: 'NOV', name: 'NOV Inc', sector: 'Energy', subSector: 'Services', industry: 'Oil & Gas Equipment', marketCap: 8 },
  { symbol: 'CHX', name: 'ChampionX Corp', sector: 'Energy', subSector: 'Services', industry: 'Oil & Gas Equipment', marketCap: 6 },

  // Services > Drilling Services (5)
  { symbol: 'HAL', name: 'Halliburton Co', sector: 'Energy', subSector: 'Services', industry: 'Drilling Services', marketCap: 28 },
  { symbol: 'HP', name: 'Helmerich & Payne', sector: 'Energy', subSector: 'Services', industry: 'Drilling Services', marketCap: 3.5 },
  { symbol: 'PTEN', name: 'Patterson-UTI', sector: 'Energy', subSector: 'Services', industry: 'Drilling Services', marketCap: 3 },
  { symbol: 'NBR', name: 'Nabors Industries', sector: 'Energy', subSector: 'Services', industry: 'Drilling Services', marketCap: 1.5 },
  { symbol: 'RIG', name: 'Transocean Ltd', sector: 'Energy', subSector: 'Services', industry: 'Drilling Services', marketCap: 3 },

  // Services > Well Services (5)
  { symbol: 'LBRT', name: 'Liberty Energy', sector: 'Energy', subSector: 'Services', industry: 'Well Services', marketCap: 3 },
  { symbol: 'NEX', name: 'NexTier Oilfield', sector: 'Energy', subSector: 'Services', industry: 'Well Services', marketCap: 2 },
  { symbol: 'PUMP', name: 'ProPetro Holding', sector: 'Energy', subSector: 'Services', industry: 'Well Services', marketCap: 1.5 },
  { symbol: 'OII', name: 'Oceaneering Intl', sector: 'Energy', subSector: 'Services', industry: 'Well Services', marketCap: 3 },
  { symbol: 'WTTR', name: 'Select Water', sector: 'Energy', subSector: 'Services', industry: 'Well Services', marketCap: 1 },

  // Services > Seismic & Survey (5)
  { symbol: 'TGS', name: 'TGS-NOPEC Geo', sector: 'Energy', subSector: 'Services', industry: 'Seismic & Survey', marketCap: 2.5 },
  { symbol: 'DMLP', name: 'Dorman Products', sector: 'Energy', subSector: 'Services', industry: 'Seismic & Survey', marketCap: 5 },
  { symbol: 'CLB', name: 'Core Labs', sector: 'Energy', subSector: 'Services', industry: 'Seismic & Survey', marketCap: 1.5 },
  { symbol: 'SPN', name: 'Superior Energy', sector: 'Energy', subSector: 'Services', industry: 'Seismic & Survey', marketCap: 0.5 },
  { symbol: 'IO', name: 'ION Geophysical', sector: 'Energy', subSector: 'Services', industry: 'Seismic & Survey', marketCap: 0.2 },

  // Services > Offshore Engineering (5)
  { symbol: 'VAL', name: 'Valaris Ltd', sector: 'Energy', subSector: 'Services', industry: 'Offshore Engineering', marketCap: 4 },
  { symbol: 'DO', name: 'Diamond Offshore', sector: 'Energy', subSector: 'Services', industry: 'Offshore Engineering', marketCap: 2 },
  { symbol: 'NE', name: 'Noble Corp', sector: 'Energy', subSector: 'Services', industry: 'Offshore Engineering', marketCap: 5 },
  { symbol: 'BORR', name: 'Borr Drilling', sector: 'Energy', subSector: 'Services', industry: 'Offshore Engineering', marketCap: 2 },
  { symbol: 'SDRL', name: 'Seadrill Ltd', sector: 'Energy', subSector: 'Services', industry: 'Offshore Engineering', marketCap: 3 },

  // Pipelines > Oil & Gas Midstream (5)
  { symbol: 'ET', name: 'Energy Transfer LP', sector: 'Energy', subSector: 'Pipelines', industry: 'Oil & Gas Midstream', marketCap: 48 },
  { symbol: 'EPD', name: 'Enterprise Products', sector: 'Energy', subSector: 'Pipelines', industry: 'Oil & Gas Midstream', marketCap: 62 },
  { symbol: 'MPLX', name: 'MPLX LP', sector: 'Energy', subSector: 'Pipelines', industry: 'Oil & Gas Midstream', marketCap: 42 },
  { symbol: 'WMB', name: 'Williams Companies', sector: 'Energy', subSector: 'Pipelines', industry: 'Oil & Gas Midstream', marketCap: 55 },
  { symbol: 'KMI', name: 'Kinder Morgan', sector: 'Energy', subSector: 'Pipelines', industry: 'Oil & Gas Midstream', marketCap: 42 },

  // Pipelines > LNG Transport (5)
  { symbol: 'GLNG', name: 'Golar LNG Ltd', sector: 'Energy', subSector: 'Pipelines', industry: 'LNG Transport', marketCap: 4 },
  { symbol: 'FLNG', name: 'FLEX LNG Ltd', sector: 'Energy', subSector: 'Pipelines', industry: 'LNG Transport', marketCap: 2.5 },
  { symbol: 'LNG', name: 'Cheniere Energy', sector: 'Energy', subSector: 'Pipelines', industry: 'LNG Transport', marketCap: 45 },
  { symbol: 'TELL', name: 'Tellurian Inc', sector: 'Energy', subSector: 'Pipelines', industry: 'LNG Transport', marketCap: 0.5 },
  { symbol: 'NFE', name: 'New Fortress Energy', sector: 'Energy', subSector: 'Pipelines', industry: 'LNG Transport', marketCap: 3 },

  // Pipelines > Gas Gathering (5)
  { symbol: 'AM', name: 'Antero Midstream', sector: 'Energy', subSector: 'Pipelines', industry: 'Gas Gathering', marketCap: 7 },
  { symbol: 'CTRA', name: 'Coterra Energy', sector: 'Energy', subSector: 'Pipelines', industry: 'Gas Gathering', marketCap: 20 },
  { symbol: 'TRGP', name: 'Targa Resources', sector: 'Energy', subSector: 'Pipelines', industry: 'Gas Gathering', marketCap: 28 },
  { symbol: 'WES', name: 'Western Midstream', sector: 'Energy', subSector: 'Pipelines', industry: 'Gas Gathering', marketCap: 12 },
  { symbol: 'HESM', name: 'Hess Midstream', sector: 'Energy', subSector: 'Pipelines', industry: 'Gas Gathering', marketCap: 8 },

  // Pipelines > Pipeline Construction (5)
  { symbol: 'ENB', name: 'Enbridge Inc', sector: 'Energy', subSector: 'Pipelines', industry: 'Pipeline Construction', marketCap: 75 },
  { symbol: 'TRP', name: 'TC Energy Corp', sector: 'Energy', subSector: 'Pipelines', industry: 'Pipeline Construction', marketCap: 40 },
  { symbol: 'PAA', name: 'Plains All American', sector: 'Energy', subSector: 'Pipelines', industry: 'Pipeline Construction', marketCap: 12 },
  { symbol: 'PSXP', name: 'Phillips 66 Partners', sector: 'Energy', subSector: 'Pipelines', industry: 'Pipeline Construction', marketCap: 5 },
  { symbol: 'DCP', name: 'DCP Midstream', sector: 'Energy', subSector: 'Pipelines', industry: 'Pipeline Construction', marketCap: 7 },

  // Pipelines > Terminal Operations (5)
  { symbol: 'NS', name: 'NuStar Energy', sector: 'Energy', subSector: 'Pipelines', industry: 'Terminal Operations', marketCap: 6 },
  { symbol: 'GEL', name: 'Genesis Energy', sector: 'Energy', subSector: 'Pipelines', industry: 'Terminal Operations', marketCap: 2 },
  { symbol: 'KNOP', name: 'KNOT Offshore', sector: 'Energy', subSector: 'Pipelines', industry: 'Terminal Operations', marketCap: 1 },
  { symbol: 'BKEP', name: 'Blueknight Energy', sector: 'Energy', subSector: 'Pipelines', industry: 'Terminal Operations', marketCap: 0.3 },
  { symbol: 'SMLP', name: 'Summit Midstream', sector: 'Energy', subSector: 'Pipelines', industry: 'Terminal Operations', marketCap: 0.5 },

  // Nuclear > Nuclear Power (5)
  { symbol: 'CEG', name: 'Constellation Energy', sector: 'Energy', subSector: 'Nuclear', industry: 'Nuclear Power', marketCap: 65 },
  { symbol: 'VST', name: 'Vistra Corp', sector: 'Energy', subSector: 'Nuclear', industry: 'Nuclear Power', marketCap: 38 },
  { symbol: 'NNE', name: 'Nano Nuclear Energy', sector: 'Energy', subSector: 'Nuclear', industry: 'Nuclear Power', marketCap: 1.5 },
  { symbol: 'OKLO', name: 'Oklo Inc', sector: 'Energy', subSector: 'Nuclear', industry: 'Nuclear Power', marketCap: 2 },
  { symbol: 'TLNE', name: 'TerraPower LLC', sector: 'Energy', subSector: 'Nuclear', industry: 'Nuclear Power', marketCap: 3 },

  // Nuclear > Uranium Mining (5)
  { symbol: 'CCJ', name: 'Cameco Corp', sector: 'Energy', subSector: 'Nuclear', industry: 'Uranium Mining', marketCap: 24 },
  { symbol: 'UEC', name: 'Uranium Energy Corp', sector: 'Energy', subSector: 'Nuclear', industry: 'Uranium Mining', marketCap: 3 },
  { symbol: 'DNN', name: 'Denison Mines', sector: 'Energy', subSector: 'Nuclear', industry: 'Uranium Mining', marketCap: 1.5 },
  { symbol: 'UUUU', name: 'Energy Fuels', sector: 'Energy', subSector: 'Nuclear', industry: 'Uranium Mining', marketCap: 1.5 },
  { symbol: 'NXE', name: 'NexGen Energy', sector: 'Energy', subSector: 'Nuclear', industry: 'Uranium Mining', marketCap: 3 },

  // Nuclear > Nuclear Services (5)
  { symbol: 'BWX', name: 'BWX Technologies', sector: 'Energy', subSector: 'Nuclear', industry: 'Nuclear Services', marketCap: 8 },
  { symbol: 'LEU', name: 'Centrus Energy', sector: 'Energy', subSector: 'Nuclear', industry: 'Nuclear Services', marketCap: 2 },
  { symbol: 'GEV', name: 'GE Vernova', sector: 'Energy', subSector: 'Nuclear', industry: 'Nuclear Services', marketCap: 45 },
  { symbol: 'FLR', name: 'Fluor Corp', sector: 'Energy', subSector: 'Nuclear', industry: 'Nuclear Services', marketCap: 8 },
  { symbol: 'BWXT', name: 'BWXT Medical', sector: 'Energy', subSector: 'Nuclear', industry: 'Nuclear Services', marketCap: 3 },

  // Nuclear > Small Modular Reactors (5)
  { symbol: 'SMR', name: 'NuScale Power', sector: 'Energy', subSector: 'Nuclear', industry: 'Small Modular Reactors', marketCap: 2 },
  { symbol: 'NCLR', name: 'Nuclear Corp', sector: 'Energy', subSector: 'Nuclear', industry: 'Small Modular Reactors', marketCap: 0.5 },
  { symbol: 'LTBR', name: 'Lightbridge Corp', sector: 'Energy', subSector: 'Nuclear', industry: 'Small Modular Reactors', marketCap: 0.2 },
  { symbol: 'HTOO', name: 'Fusion Fuel Green', sector: 'Energy', subSector: 'Nuclear', industry: 'Small Modular Reactors', marketCap: 0.1 },
  { symbol: 'DYN', name: 'Dyne Therapeutics', sector: 'Energy', subSector: 'Nuclear', industry: 'Small Modular Reactors', marketCap: 0.5 },

  // Nuclear > Nuclear Fuel Processing (5)
  { symbol: 'UROY', name: 'Uranium Royalty', sector: 'Energy', subSector: 'Nuclear', industry: 'Nuclear Fuel Processing', marketCap: 0.8 },
  { symbol: 'URG', name: 'Ur-Energy Inc', sector: 'Energy', subSector: 'Nuclear', industry: 'Nuclear Fuel Processing', marketCap: 0.5 },
  { symbol: 'GLATF', name: 'Global Atomic', sector: 'Energy', subSector: 'Nuclear', industry: 'Nuclear Fuel Processing', marketCap: 0.3 },
  { symbol: 'EU', name: 'enCore Energy', sector: 'Energy', subSector: 'Nuclear', industry: 'Nuclear Fuel Processing', marketCap: 0.5 },
  { symbol: 'AEC', name: 'Associated Energy', sector: 'Energy', subSector: 'Nuclear', industry: 'Nuclear Fuel Processing', marketCap: 0.2 },

];

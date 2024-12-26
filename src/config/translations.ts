export const translations = {
  zh: {
    nav: {
      intro: '介绍',
      monitor: '监控大厅',
      query: '交互查询',
      reports: '分析报告',
      about: '关于我们',
    },
    hero: {
      title: 'ETC大数据管理平台',
      subtitle: '由充满激情的技术团队打造的智能化高速公路收费解决方案',
    },
    features: {
      title: '创新的技术体验',
      subtitle: '专注于打造高效、可靠的ETC数据管理解决方案',
    },
    cta: {
      title: '加入我们的开源社区',
      button: '开始贡献',
    },
    monitor: {
      title: 'ETC监控大厅',
      vehicleTypes: {
        title: '车型分布',
        type1: '一型车',
        type2: '二型车',
        type3: '三型车',
        type4: '四型车',
        type5: '五型车',
        type6: '六型车',
      },
      trafficFlow: {
        title: '车流量统计',
        hourly: '小时',
        daily: '天',
        weekly: '周',
        monthly: '月',
        yearly: '年',
      },
      table: {
        title: '车辆出入关口情况',
        columns: {
          index: '序号',
          plate: '车牌号',
          type: '车型',
          entryTime: '入站时间',
          exitTime: '出站时间',
          entryStation: '入口收费站',
          exitStation: '出口收费站',
          notes: '备注',
        },
      },
      alerts: {
        title: '预警信息',
        level: {
          high: '高',
          medium: '中',
          low: '低',
        },
      },
    },
    query: {
      title: '交通数据查询',
      description: '查询ETC交通数据记录，支持多条件组合查询',
      noData: '暂无数据',
      fields: {
        XH: '序号',
        CP: '车牌号',
        CX: '车型',
        RKSJ: '入站时间',
        CKSJ: '出站时间',
        SFZRKMC: '入口收费站',
        SFZCKMC: '出口收费站',
        BZ: '备注'
      },
      placeholders: {
        CP: '请输入车牌号',
        CX: '请选择车型',
        SFZRKMC: '请输入入口收费站',
        SFZCKMC: '请输入出口收费站',
        BZ: '请输入备注信息'
      },
      buttons: {
        search: '查询',
        reset: '重置'
      }
    }
  },
  en: {
    nav: {
      intro: 'Introduction',
      monitor: 'Monitor',
      query: 'Query',
      reports: 'Reports',
      about: 'About',
    },
    hero: {
      title: 'ETC Big Data Platform',
      subtitle: 'Smart highway toll solution built by a passionate tech team',
    },
    features: {
      title: 'Innovative Tech Experience',
      subtitle: 'Focus on building efficient and reliable ETC data management solutions',
    },
    cta: {
      title: 'Join Our Open Source Community',
      button: 'Start Contributing',
    },
    monitor: {
      title: 'ETC Monitoring Center',
      vehicleTypes: {
        title: 'Vehicle Distribution',
        type1: 'Type 1',
        type2: 'Type 2',
        type3: 'Type 3',
        type4: 'Type 4',
        type5: 'Type 5',
        type6: 'Type 6',
      },
      trafficFlow: {
        title: 'Traffic Flow Statistics',
        hourly: 'Hourly',
        daily: 'Daily',
        weekly: 'Weekly',
        monthly: 'Monthly',
        yearly: 'Yearly',
      },
      table: {
        title: 'Vehicle Entry/Exit Information',
        columns: {
          index: 'No.',
          plate: 'Plate',
          type: 'Type',
          entryTime: 'Entry Time',
          exitTime: 'Exit Time',
          entryStation: 'Entry Station',
          exitStation: 'Exit Station',
          notes: 'Notes',
        },
      },
      alerts: {
        title: 'Alert Information',
        level: {
          high: 'High',
          medium: 'Medium',
          low: 'Low',
        },
      },
    },
    query: {
      title: 'Traffic Data Query',
      description: 'Query ETC traffic records with multiple conditions',
      noData: 'No data available',
      fields: {
        XH: 'No.',
        CP: 'License Plate',
        CX: 'Vehicle Type',
        RKSJ: 'Entry Time',
        CKSJ: 'Exit Time',
        SFZRKMC: 'Entry Station',
        SFZCKMC: 'Exit Station',
        BZ: 'Remarks'
      },
      placeholders: {
        CP: 'Enter license plate',
        CX: 'Select vehicle type',
        SFZRKMC: 'Enter entry station',
        SFZCKMC: 'Enter exit station',
        BZ: 'Enter remarks'
      },
      buttons: {
        search: 'Search',
        reset: 'Reset'
      }
    }
  },
} 
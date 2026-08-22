export const LESSONS = [
  {
    id: 'number-line',
    labelZh: '数轴',
    labelEn: 'Number Line',
    explore: {
      heading: '在数轴上定位有理数',
      description: 'Locate rational numbers on a number line.',
      zoneLabel: '数轴与刻度可视化区域 / Number-line visual area',
      teacherNote: '引导学生观察原点、方向和单位长度。',
    },
    quickCheck: {
      heading: '快速检测：数轴',
      description: 'Quick Check: identify a rational number from its position.',
      zoneLabel: '随机课堂题目将显示在这里 / Random classroom question area',
      teacherNote: '请学生先独立判断，再邀请一位同学说明理由。',
    },
  },
  {
    id: 'opposite',
    labelZh: '相反数',
    labelEn: 'Opposite',
    explore: {
      heading: '发现相反数的对称关系',
      description: 'Explore opposite numbers as reflections across zero.',
      zoneLabel: '对称与表达式可视化区域 / Reflection visual area',
      teacherNote: '用数轴上的对称点连接相反数和零。',
    },
    quickCheck: {
      heading: '快速检测：相反数',
      description: 'Quick Check: determine the opposite of a rational number.',
      zoneLabel: '随机课堂题目将显示在这里 / Random classroom question area',
      teacherNote: '提醒学生区分相反数与绝对值。',
    },
  },
  {
    id: 'absolute-value',
    labelZh: '绝对值',
    labelEn: 'Absolute Value',
    explore: {
      heading: '理解绝对值表示距离',
      description: 'Understand absolute value as distance from zero.',
      zoneLabel: '距离与公式可视化区域 / Distance visual area',
      teacherNote: '强调距离没有方向，因此结果不为负。',
    },
    quickCheck: {
      heading: '快速检测：绝对值',
      description: 'Quick Check: find the distance from zero.',
      zoneLabel: '随机课堂题目将显示在这里 / Random classroom question area',
      teacherNote: '请学生用“到原点的距离”解释答案。',
    },
  },
  {
    id: 'compare',
    labelZh: '大小比较',
    labelEn: 'Comparing Rational Numbers',
    explore: {
      heading: '比较有理数的大小',
      description: 'Compare rational numbers using position and sign.',
      zoneLabel: '比较策略可视化区域 / Comparison visual area',
      teacherNote: '先比较符号，再借助数轴确认大小关系。',
    },
    quickCheck: {
      heading: '快速检测：大小比较',
      description: 'Quick Check: choose the larger rational number.',
      zoneLabel: '随机课堂题目将显示在这里 / Random classroom question area',
      teacherNote: '鼓励学生说出使用的比较策略。',
    },
  },
];

export const getLesson = (id) => LESSONS.find((lesson) => lesson.id === id);

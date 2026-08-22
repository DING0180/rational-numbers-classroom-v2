export const LESSONS = [
  {
    id: 'number-line',
    labelZh: '数轴',
    labelEn: 'Number Line',
    explore: {
      heading: '在数轴上定位有理数',
      description: '探索重点：在数轴上定位有理数。 / Explore focus: locate rational numbers on a number line.',
      zoneLabel: '数轴、刻度与公式预留区 / Number-line visual and formula zone',
      teacherNote: '引导学生观察原点、方向和单位长度。',
    },
    quickCheck: {
      heading: '快速检测：数轴',
      description: '快速检测：根据位置判断有理数。 / Quick Check: identify a rational number from its position.',
      zoneLabel: '题目与答案预留区 / Prompt and reserved answer area',
      teacherNote: '请学生先独立判断，再邀请一位同学说明理由。',
    },
  },
  {
    id: 'opposite',
    labelZh: '相反数',
    labelEn: 'Opposite',
    explore: {
      heading: '发现相反数的对称关系',
      description: '探索重点：观察相反数关于原点的对称。 / Explore focus: see opposite numbers as reflections across zero.',
      zoneLabel: '对称图示与公式预留区 / Reflection visual and formula zone',
      teacherNote: '用数轴上的对称点连接相反数和零。',
    },
    quickCheck: {
      heading: '快速检测：相反数',
      description: '快速检测：写出一个有理数的相反数。 / Quick Check: determine the opposite of a rational number.',
      zoneLabel: '题目与答案预留区 / Prompt and reserved answer area',
      teacherNote: '提醒学生区分相反数与绝对值。',
    },
  },
  {
    id: 'absolute-value',
    labelZh: '绝对值',
    labelEn: 'Absolute Value',
    explore: {
      heading: '理解绝对值表示距离',
      description: '探索重点：理解绝对值表示到原点的距离。 / Explore focus: understand absolute value as distance from zero.',
      zoneLabel: '距离图示与公式预留区 / Distance visual and formula zone',
      teacherNote: '强调距离没有方向，因此结果不为负。',
    },
    quickCheck: {
      heading: '快速检测：绝对值',
      description: '快速检测：求一个数到原点的距离。 / Quick Check: find the distance from zero.',
      zoneLabel: '题目与答案预留区 / Prompt and reserved answer area',
      teacherNote: '请学生用“到原点的距离”解释答案。',
    },
  },
  {
    id: 'compare',
    labelZh: '大小比较',
    labelEn: 'Comparing Rational Numbers',
    explore: {
      heading: '比较有理数的大小',
      description: '探索重点：用位置和符号比较有理数。 / Explore focus: compare rational numbers using position and sign.',
      zoneLabel: '比较策略与公式预留区 / Comparison visual and formula zone',
      teacherNote: '先比较符号，再借助数轴确认大小关系。',
    },
    quickCheck: {
      heading: '快速检测：大小比较',
      description: '快速检测：选择较大的有理数。 / Quick Check: choose the larger rational number.',
      zoneLabel: '题目与答案预留区 / Prompt and reserved answer area',
      teacherNote: '鼓励学生说出使用的比较策略。',
    },
  },
];

export const getLesson = (id) => LESSONS.find((lesson) => lesson.id === id);

export const LESSONS = [
  { id: 'number-line', labelZh: '数轴', labelEn: 'Number Line' },
  { id: 'opposite', labelZh: '相反数', labelEn: 'Opposite' },
  { id: 'absolute-value', labelZh: '绝对值', labelEn: 'Absolute Value' },
  { id: 'compare', labelZh: '大小比较', labelEn: 'Comparing Rational Numbers' },
];

export const getLesson = (id) => LESSONS.find((lesson) => lesson.id === id);

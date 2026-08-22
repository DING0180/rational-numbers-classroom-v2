export const LESSONS = [
  { id: 'number-line', labelZh: '数轴', labelEn: 'Number Line', explore: {}, quickCheck: {} },
  { id: 'opposite', labelZh: '相反数', labelEn: 'Opposite', explore: {}, quickCheck: {} },
  { id: 'absolute-value', labelZh: '绝对值', labelEn: 'Absolute Value', explore: {}, quickCheck: {} },
  { id: 'compare', labelZh: '大小比较', labelEn: 'Comparing Rational Numbers', explore: {}, quickCheck: {} },
];

export const getLesson = (id) => LESSONS.find((lesson) => lesson.id === id);

import { LESSONS, getLesson } from './lessons.js';

const MODES = [
  { id: 'explore', labelZh: '探索', labelEn: 'Explore', lessonField: 'explore' },
  { id: 'quick-check', labelZh: '快速检测', labelEn: 'Quick Check', lessonField: 'quickCheck' },
];

export const createInitialState = () => ({ lessonId: 'number-line', mode: 'explore' });

export function reduceState(state, action) {
  if (action.type === 'select-lesson' && getLesson(action.lessonId)) {
    return { ...state, lessonId: action.lessonId };
  }

  if (action.type === 'select-mode' && MODES.some(({ id }) => id === action.mode)) {
    return { ...state, mode: action.mode };
  }

  return state;
}

export function renderApp(state) {
  const lesson = getLesson(state.lessonId) ?? getLesson(createInitialState().lessonId);
  const mode = MODES.find(({ id }) => id === state.mode) ?? MODES[0];
  const stage = lesson[mode.lessonField];

  return `
    <div class="classroom-app">
      <aside class="sidebar" aria-label="课程导航 / Lesson navigation">
        <header class="sidebar-header">
          <p>七年级数学 / Grade 7 Math</p>
          <h2>有理数课堂</h2>
        </header>
        <nav aria-label="课程列表 / Lesson list">
          ${LESSONS.map((item) => `
            <button type="button" data-lesson="${item.id}"${item.id === lesson.id ? ' aria-current="page"' : ''}>
              <span lang="zh-CN">${item.labelZh}</span>
              <span lang="en">${item.labelEn}</span>
            </button>
          `).join('')}
        </nav>
      </aside>

      <section class="workspace" aria-labelledby="lesson-title">
        <header class="workspace-header">
          <p>有理数 / Rational Numbers</p>
          <h1 id="lesson-title"><span lang="zh-CN">${lesson.labelZh}</span> <span lang="en">${lesson.labelEn}</span></h1>
        </header>

        <div class="mode-switcher" role="group" aria-label="课堂模式 / Classroom mode">
          ${MODES.map((item) => `
            <button type="button" data-mode="${item.id}" aria-pressed="${item.id === mode.id}">
              <span lang="zh-CN">${item.labelZh}</span> <span lang="en">${item.labelEn}</span>
            </button>
          `).join('')}
        </div>

        <section class="classroom-stage" data-stage aria-live="polite" aria-labelledby="stage-title">
          <p class="stage-mode"><span lang="zh-CN">${mode.labelZh}</span> / <span lang="en">${mode.labelEn}</span></p>
          <h2 id="stage-title">${stage.heading}</h2>
          <p>${stage.description}</p>
          <div class="stage-reserved-area" aria-label="${stage.zoneLabel}">
            <p>${stage.zoneLabel}</p>
          </div>
        </section>

        <section class="teacher-controls" aria-labelledby="teacher-controls-title">
          <h2 id="teacher-controls-title">教师提示 / Teacher Controls</h2>
          <p>${stage.teacherNote}</p>
        </section>
      </section>
    </div>
  `;
}

if (typeof document !== 'undefined') {
  const app = document.querySelector('#app');

  if (app) {
    let state = createInitialState();
    app.innerHTML = renderApp(state);

    app.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-lesson], button[data-mode]');
      if (!button || !app.contains(button)) return;

      const action = button.dataset.lesson
        ? { type: 'select-lesson', lessonId: button.dataset.lesson }
        : { type: 'select-mode', mode: button.dataset.mode };
      const nextState = reduceState(state, action);

      if (nextState !== state) {
        state = nextState;
        app.innerHTML = renderApp(state);
      }
    });
  }
}

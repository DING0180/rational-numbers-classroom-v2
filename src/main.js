import { LESSONS, getLesson } from './lessons.js';
import { renderNumberLineSvg } from './number-line-svg.js';
import { createQuestion } from './questions.js';
import './styles.css';

const defaultOptions = () => ({ direction: 'number-to-point', difficulty: 'easy' });

function nextQuestion(state, random, changes = {}) {
  const options = { ...state.options, ...changes };
  const recentFingerprints = [...state.recentFingerprints, state.question?.fingerprint].filter(Boolean).slice(-6);
  const question = createQuestion(state.lessonId, options, recentFingerprints, random);
  return { ...state, options, question, revealed: false, recentFingerprints: [...recentFingerprints, question.fingerprint].slice(-6) };
}

export function createInitialState(random = Math.random) {
  return nextQuestion({ lessonId: 'number-line', options: defaultOptions(), question: null, revealed: false, recentFingerprints: [] }, random);
}

export function reduceState(state, action, random = Math.random) {
  if (action.type === 'select-lesson' && getLesson(action.lessonId) && action.lessonId !== state.lessonId) return nextQuestion({ ...state, lessonId: action.lessonId, options: defaultOptions() }, random);
  if (action.type === 'set-number-line-direction' && state.lessonId === 'number-line') return nextQuestion(state, random, { direction: action.direction });
  if (action.type === 'set-number-line-difficulty' && state.lessonId === 'number-line') return nextQuestion(state, random, { difficulty: action.difficulty });
  if (action.type === 'new-question' || action.type === 'next') return nextQuestion(state, random);
  if (action.type === 'reveal') return { ...state, revealed: true };
  return state;
}

function lessonButtons(lesson) {
  return LESSONS.map((item) => `<button type="button" data-lesson="${item.id}"${item.id === lesson.id ? ' aria-current="page"' : ''}><span lang="zh-CN">${item.labelZh}</span><span lang="en">${item.labelEn}</span></button>`).join('');
}

function numberLineControls(state) {
  if (state.lessonId !== 'number-line') return '';
  return `<div class="config-controls" aria-label="Number Line question settings"><button type="button" data-direction="number-to-point" aria-pressed="${state.options.direction === 'number-to-point'}">Number → Point</button><button type="button" data-direction="point-to-number" aria-pressed="${state.options.direction === 'point-to-number'}">Point → Number</button><button type="button" data-difficulty="easy" aria-pressed="${state.options.difficulty === 'easy'}">Easy</button><button type="button" data-difficulty="challenge" aria-pressed="${state.options.difficulty === 'challenge'}">Challenge</button></div>`;
}

export function renderApp(state) {
  const lesson = getLesson(state.lessonId) ?? LESSONS[0];
  const { question } = state;
  const visual = state.lessonId === 'number-line' ? `<div class="number-line-visual" data-number-line>${renderNumberLineSvg(question)}</div>` : '';
  const answer = state.revealed ? `<p class="answer-label">Answer</p><p class="answer-value">${question.answer}</p><p class="answer-explanation">${question.explanation}</p>` : '<p class="answer-prompt">Think first. Answer after the reveal.</p>';

  return `<div class="classroom-app"><aside class="sidebar" aria-label="课程导航 / Lesson navigation"><header class="sidebar-header"><p>Grade 7 Math</p><h2>有理数课堂</h2></header><nav aria-label="课程列表 / Lesson list">${lessonButtons(lesson)}</nav></aside><main class="workspace" aria-labelledby="lesson-title"><header class="workspace-header"><p>Rational Numbers · Quick Check</p><h1 id="lesson-title"><span lang="zh-CN">${lesson.labelZh}</span> <span lang="en">${lesson.labelEn}</span></h1></header><section class="classroom-stage" data-stage aria-live="polite"><p class="quick-check-label">Quick Check</p><div class="question-panel"><p class="question-prompt">${question.prompt}</p>${visual}</div><section class="answer-panel${state.revealed ? ' answer-panel--visible' : ''}" data-answer-panel aria-live="polite">${answer}</section></section><section class="teacher-controls" aria-label="Teacher controls">${numberLineControls(state)}<div class="action-controls"><button type="button" data-action="new-question">New Question</button><button type="button" data-action="reveal"${state.revealed ? ' disabled' : ''}>Reveal Answer</button><button type="button" data-action="next">Next</button></div></section></main></div>`;
}

if (typeof document !== 'undefined') {
  const app = document.querySelector('#app');
  if (app) {
    let state = createInitialState();
    app.innerHTML = renderApp(state);
    app.addEventListener('click', (event) => {
      const button = event.target.closest('button');
      if (!button || !app.contains(button) || button.disabled) return;
      const action = button.dataset.lesson ? { type: 'select-lesson', lessonId: button.dataset.lesson }
        : button.dataset.direction ? { type: 'set-number-line-direction', direction: button.dataset.direction }
          : button.dataset.difficulty ? { type: 'set-number-line-difficulty', difficulty: button.dataset.difficulty }
            : button.dataset.action ? { type: button.dataset.action } : null;
      if (!action) return;
      state = reduceState(state, action);
      app.innerHTML = renderApp(state);
    });
  }
}

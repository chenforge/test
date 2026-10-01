(function () {
  'use strict';

  const instances = new WeakMap();
  const modeInfo = {
    variables: { title: '让一个变量变起来', intro: '改一下起始分数和加分，跟着每一行看看：名字没有变，里面的值变了。', note: '这里使用 C++17 的 int；输入范围较小，不会发生整数溢出。' },
    loops: { title: '把重复的事交给循环', intro: '从 1 加到 n。每轮看清三件事：检查条件、执行循环体、更新 i。', note: '这里使用 C++17；n 限制在 1–20，所有整数运算都在 int 范围内。' },
    pointers: { title: '沿着地址找到变量', intro: '指针存的是地址。沿着它找到 age，给 *p 赋值，也就改到了 age。', note: '方框里的地址是示意编号，不是真实内存地址。p 一直指向有效的局部变量，示例遵循 C++17。' },
    recursion: { title: '看看函数怎样一层层回来', intro: 'n! = n × (n−1)!。每一次调用都有自己的 n，等下一层返回后才能继续计算。', note: '使用 C++17 的 long long；n 限制在 1–8，结果不会溢出。栈图仅说明调用关系，不表示实际内存布局。' },
    binary: { title: '每次排除一半', intro: '数据已经按升序排好。把目标与中间项比较，就能决定下一次看左半边还是右半边。', note: '数组下标从 0 开始。这个 C++17 示例只适用于已按升序排序的数据；目标不存在时会明确结束。' },
    sort: { title: '看见相邻两项的交换', intro: '每次比较相邻两项，把大的放在右边。一趟结束，当前最大的数就到了自己的位置。', note: '这是 C++17 冒泡排序的教学示例。允许重复值和负数；真实项目通常优先使用 std::sort。' },
    objects: { title: '把数据和操作放在一起', intro: 'Student 保存成绩，也提供加分和读取成绩的方法。跟着对象看成员如何发生变化。', note: '这是 C++17 的简化类示例。private 限制从类外直接访问成员；它不是加密或安全隔离。' }
  };

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function int(value, min, max) {
    const n = Number(value);
    return Math.max(min, Math.min(max, Number.isFinite(n) ? Math.round(n) : min));
  }

  function snapshot(line, explanation, values, extra) {
    return Object.assign({ line: line, explanation: explanation, values: values, output: '' }, extra || {});
  }

  function values(items) {
    return items.map(function (item) { return { name: item[0], value: item[1], note: item[2] || '' }; });
  }

  function makeModel(mode, settings) {
    let lines, steps = [];
    const empty = '尚未执行';
    if (mode === 'variables') {
      const score = settings.score, bonus = settings.bonus;
      lines = ['#include <iostream>', 'using namespace std;', '', 'int main() {', '    int score = ' + score + ';', '    int bonus = ' + bonus + ';', '    score = score + bonus;', "    cout << score << '\\n';", '    return 0;', '}'];
      steps = [
        snapshot(4, '声明 score，并把 ' + score + ' 存进去。int 表示这里保存的是整数。', values([['score', score], ['bonus', empty]])),
        snapshot(5, '声明 bonus，初始值是 ' + bonus + '。两个变量各自保存一个值。', values([['score', score], ['bonus', bonus]])),
        snapshot(6, '先算右边：' + score + ' + ' + bonus + ' = ' + (score + bonus) + '。再把结果写回左边的 score；这不是数学里的等式。', values([['score', score + bonus, '被重新赋值'], ['bonus', bonus, '没有改变']])),
        snapshot(7, 'cout 把 score 当前的值输出。屏幕上看到的是 ' + (score + bonus) + '，变量里的值不因此改变。', values([['score', score + bonus], ['bonus', bonus]]), { output: String(score + bonus) + '\n' }),
        snapshot(8, 'return 0 表示 main 正常结束。再改一组数，观察同样的代码怎样得到不同结果。', values([['score', score + bonus], ['bonus', bonus]]), { output: String(score + bonus) + '\n' })
      ];
    } else if (mode === 'loops') {
      const n = settings.n;
      lines = ['#include <iostream>', 'using namespace std;', '', 'int main() {', '    int n = ' + n + ';', '    int sum = 0;', '    for (int i = 1; i <= n; ++i) {', '        sum += i;', '    }', "    cout << sum << '\\n';", '}'];
      let sum = 0;
      steps.push(snapshot(4, '先记住上限 n = ' + n + '。', values([['n', n], ['sum', empty], ['i', empty]])));
      steps.push(snapshot(5, '累加器 sum 从 0 开始，避免用一个没有初始化的值参与计算。', values([['n', n], ['sum', 0], ['i', empty]])));
      for (let i = 1; i <= n; i++) {
        steps.push(snapshot(6, '检查条件：' + i + ' <= ' + n + ' 为真，进入第 ' + i + ' 轮。', values([['n', n], ['sum', sum], ['i', i]]), { sequence: { done: i - 1, total: n } }));
        const previous = sum;
        sum += i;
        steps.push(snapshot(7, 'sum += i 等价于 sum = sum + i。这一轮：' + previous + ' + ' + i + ' = ' + sum + '。', values([['n', n], ['sum', sum, '本轮更新'], ['i', i]]), { sequence: { done: i, total: n } }));
        steps.push(snapshot(6, '循环体结束，执行 ++i，把 i 从 ' + i + ' 改成 ' + (i + 1) + '。接下来重新检查条件。', values([['n', n], ['sum', sum], ['i', i + 1]]), { sequence: { done: i, total: n } }));
      }
      steps.push(snapshot(6, '检查条件：' + (n + 1) + ' <= ' + n + ' 为假，离开循环。i 的作用域也在这个 for 语句结束。', values([['n', n], ['sum', sum], ['i', '作用域已结束']]), { sequence: { done: n, total: n } }));
      steps.push(snapshot(9, '输出最终的和 ' + sum + '。你也可以用 n(n+1)/2 核对它，但这段程序确实一轮一轮完成了相加。', values([['n', n], ['sum', sum]]), { output: String(sum) + '\n', sequence: { done: n, total: n } }));
    } else if (mode === 'pointers') {
      const age = settings.age, update = settings.update;
      lines = ['#include <iostream>', 'using namespace std;', '', 'int main() {', '    int age = ' + age + ';', '    int* p = &age;', '    *p = ' + update + ';', "    cout << age << '\\n';", '}'];
      steps = [
        snapshot(4, 'age 是一个整数变量。给它一个示意地址 A，方便追踪；实际地址由程序运行时决定。', values([['age', age], ['p', empty]]), { pointer: { age: age, linked: false } }),
        snapshot(5, '&age 取得 age 的地址。p 保存这个地址 A，而不是 age 的值 ' + age + '。', values([['age', age], ['p', '地址 A', '指向 age']]), { pointer: { age: age, linked: true } }),
        snapshot(6, '*p 表示“p 指向的那个整数”。给 *p 赋值 ' + update + '，直接改变的是 age。p 里保存的地址仍然是 A。', values([['age', update, '通过 *p 修改'], ['p', '地址 A', '地址未改变']]), { pointer: { age: update, linked: true } }),
        snapshot(7, '输出 age，得到 ' + update + '。这里不需要给 age 再赋一次值，因为 *p 和 age 访问的是同一个整数。', values([['age', update], ['p', '地址 A']]), { pointer: { age: update, linked: true }, output: String(update) + '\n' })
      ];
    } else if (mode === 'recursion') {
      const n = settings.n;
      lines = ['#include <iostream>', 'using namespace std;', 'long long factorial(int n) {', '    if (n <= 1) return 1;', '    long long smaller = factorial(n - 1);', '    return n * smaller;', '}', 'int main() {', '    int n = ' + n + ';', "    cout << factorial(n) << '\\n';", '}'];
      const stack = [];
      function frameCopy() { return stack.map(function (f) { return { n: f.n, status: f.status }; }); }
      function trace(line, explanation, result) {
        steps.push(snapshot(line, explanation, values([['main 的 n', n], ['调用层数', stack.length], ['返回值', result === undefined ? '等待计算' : result]]), { stack: frameCopy() }));
      }
      trace(8, 'main 的 n = ' + n + '。每次调用 factorial 时，函数都会获得自己的一份参数 n。');
      trace(9, '开始计算 factorial(' + n + ')。cout 会等整个函数返回后，再输出最终结果。');
      function visit(k) {
        stack.push({ n: k, status: '检查终止条件' });
        trace(3, '进入 factorial(' + k + ')：检查 ' + k + ' <= 1，结果为' + (k <= 1 ? '真。到达递归的终点。' : '假。还需要计算下一层。'));
        if (k <= 1) {
          stack[stack.length - 1].status = '返回 1';
          trace(3, 'factorial(1) 直接返回 1。这是终止条件，防止函数一直调用下去。', 1);
          stack.pop();
          return 1;
        }
        stack[stack.length - 1].status = '等待 factorial(' + (k - 1) + ')';
        trace(4, '这一层 n = ' + k + '。先调用 factorial(' + (k - 1) + ')，当前这一层暂停在赋值处。');
        const smaller = visit(k - 1);
        stack[stack.length - 1].status = 'smaller = ' + smaller;
        trace(4, '回到 factorial(' + k + ')。下一层已返回 ' + smaller + '，把它存进这一层的 smaller。', smaller);
        const result = k * smaller;
        stack[stack.length - 1].status = '返回 ' + result;
        trace(5, '这一层计算 ' + k + ' × ' + smaller + ' = ' + result + '，把结果交还给调用它的那一层。', result);
        stack.pop();
        return result;
      }
      const result = visit(n);
      steps.push(snapshot(9, '所有递归调用都已返回，main 收到 ' + result + '，于是 cout 输出它。调用栈已经清空。', values([['main 的 n', n], ['调用层数', 0], ['返回值', result]]), { stack: [], output: String(result) + '\n' }));
    } else if (mode === 'binary') {
      const array = [2, 5, 8, 12, 16, 23, 38, 56, 72], target = settings.target;
      lines = ['#include <iostream>', 'using namespace std;', 'int main() {', '    int a[] = {2, 5, 8, 12, 16, 23, 38, 56, 72};', '    int target = ' + target + ';', '    int left = 0, right = 8;', '    while (left <= right) {', '        int mid = left + (right - left) / 2;', '        if (a[mid] == target) {', "            cout << mid << '\\n';", '            return 0;', '        }', '        if (a[mid] < target) left = mid + 1;', '        else right = mid - 1;', '    }', "    cout << \"没有找到\" << '\\n';", '}'];
      let left = 0, right = 8, mid;
      function state(line, explanation, output, found) {
        steps.push(snapshot(line, explanation, values([['target', target], ['left', left], ['right', right], ['mid', mid === undefined ? '尚未计算' : mid]]), { output: output || '', array: array.slice(), focus: mid === undefined ? [] : [mid], found: found === undefined ? [] : [found], interval: [left, right] }));
      }
      state(5, '候选范围是下标 0 到 8。注意：数组里一共有 9 个数，最后一个下标是 8。');
      let found = false;
      while (left <= right) {
        state(6, 'left <= right 为真，候选范围里还有元素，可以继续查找。');
        mid = left + Math.floor((right - left) / 2);
        state(7, '计算中间下标 mid = ' + left + ' + (' + right + ' − ' + left + ') / 2 = ' + mid + '。整数除法舍去小数部分。');
        state(8, '比较中间值 ' + array[mid] + ' 与目标 ' + target + '：' + (array[mid] === target ? '相等，找到了。' : '不相等。'));
        if (array[mid] === target) {
          state(9, '输出找到的下标 ' + mid + '。这个位置的值是 ' + array[mid] + '。', String(mid) + '\n', mid);
          state(10, 'return 0 结束程序，避免继续搜索或输出“没有找到”。', String(mid) + '\n', mid);
          found = true;
          break;
        }
        if (array[mid] < target) {
          const old = mid;
          left = mid + 1;
          state(12, array[old] + ' 小于 ' + target + '。有序数组里，它左侧的值也都太小，因此 left 更新为 ' + left + '。');
        } else {
          const old = mid;
          right = mid - 1;
          state(13, array[old] + ' 大于 ' + target + '。它右侧的值也都太大，因此 right 更新为 ' + right + '。');
        }
      }
      if (!found) {
        state(6, 'left = ' + left + ' 已经超过 right = ' + right + '，范围为空，循环停止。');
        state(15, '所有候选位置都已排除，这个数组中没有 ' + target + '。', '没有找到\n');
      }
    } else if (mode === 'sort') {
      const array = settings.array.slice(), n = array.length;
      lines = ['#include <iostream>', '#include <utility>', 'using namespace std;', 'int main() {', '    int a[] = {' + array.join(', ') + '};', '    const int n = ' + n + ';', '    for (int i = 0; i < n - 1; ++i) {', '        bool swapped = false;', '        for (int j = 0; j < n - 1 - i; ++j) {', '            if (a[j] > a[j + 1]) {', '                swap(a[j], a[j + 1]);', '                swapped = true;', '            }', '        }', '        if (!swapped) break;', '    }', "    for (int value : a) cout << value << ' ';", "    cout << '\\n';", '}'];
      function state(line, explanation, i, j, sortedFrom, output) {
        steps.push(snapshot(line, explanation, values([['趟数', i === undefined ? '尚未开始' : i + 1], ['j', j === undefined ? '—' : j], ['n', n]]), { array: array.slice(), focus: j === undefined ? [] : [j, j + 1], sortedFrom: sortedFrom, output: output || '' }));
      }
      state(4, '初始数组就是你输入的顺序。相同的数也允许存在。', undefined, undefined, n);
      for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        state(7, '第 ' + (i + 1) + ' 趟开始，把 swapped 设为 false，用它记录这一趟是否发生交换。', i, undefined, n - i);
        for (let j = 0; j < n - 1 - i; j++) {
          state(9, '比较 a[' + j + '] = ' + array[j] + ' 和 a[' + (j + 1) + '] = ' + array[j + 1] + '。' + (array[j] > array[j + 1] ? '左边较大，需要交换。' : '顺序已经合适，保持原位。'), i, j, n - i);
          if (array[j] > array[j + 1]) {
            const first = array[j];
            array[j] = array[j + 1];
            array[j + 1] = first;
            state(10, '交换后，这两个位置变成 ' + array[j] + '、' + array[j + 1] + '。较大的值向右移动一步。', i, j, n - i);
            swapped = true;
            state(11, '把 swapped 设为 true，记录这一趟已经发生过交换。', i, j, n - i);
          }
        }
        state(14, swapped ? '这一趟发生过交换，继续下一趟。右端的 ' + array[n - i - 1] + ' 已经到达最终位置。' : '整趟没有发生交换，说明数组已经有序，提前结束。', i, undefined, swapped ? n - i - 1 : 0);
        if (!swapped) break;
      }
      state(16, '按数组中的顺序输出，结果为升序。冒泡排序的最坏时间复杂度是 O(n²)。', undefined, undefined, 0, array.join(' ') + ' \n');
    } else {
      const score = settings.score, bonus = settings.bonus;
      lines = ['#include <iostream>', 'using namespace std;', 'class Student {', 'private:', '    int score_;', 'public:', '    explicit Student(int score) : score_(score) {}', '    void addBonus(int bonus) { score_ += bonus; }', '    int score() const { return score_; }', '};', 'int main() {', '    Student student(' + score + ');', '    student.addBonus(' + bonus + ');', "    cout << student.score() << '\\n';", '}'];
      steps = [
        snapshot(11, '创建 Student 对象 student，调用构造函数，传入初始成绩 ' + score + '。', values([['student.score_', '正在初始化'], ['bonus', empty]]), { object: { score: '等待初始化' } }),
        snapshot(6, '构造函数的初始化列表 score_(score) 把参数存进成员 score_。这个成绩属于 student 对象。', values([['student.score_', score, 'private 成员']]), { object: { score: score } }),
        snapshot(12, '通过公开的方法 addBonus，把 ' + bonus + ' 交给对象处理。类外代码不用直接接触 score_。', values([['student.score_', score], ['bonus', bonus, '方法的参数']]), { object: { score: score } }),
        snapshot(7, 'addBonus 在类内部访问 score_：' + score + ' + ' + bonus + ' = ' + (score + bonus) + '。成员值随之更新。', values([['student.score_', score + bonus], ['bonus', bonus]]), { object: { score: score + bonus } }),
        snapshot(8, 'score() 返回成员值 ' + (score + bonus) + '。方法后面的 const 承诺不通过这个方法修改对象的普通成员。', values([['student.score_', score + bonus], ['返回值', score + bonus]]), { object: { score: score + bonus } }),
        snapshot(13, 'cout 输出 score() 的返回值，得到 ' + (score + bonus) + '。对象把相关的数据和方法组织在了一起。', values([['student.score_', score + bonus], ['返回值', score + bonus]]), { object: { score: score + bonus }, output: String(score + bonus) + '\n' })
      ];
    }
    return { lines: lines, steps: steps };
  }

  function render(container, requestedMode) {
    if (!container || typeof container.appendChild !== 'function') return;
    destroy(container);
    let mode = modeInfo[requestedMode] ? requestedMode : 'variables';
    const settings = { score: 72, bonus: 8, age: 15, update: 18, n: mode === 'recursion' ? 5 : 6, target: 23, array: [8, 3, 6, 2, 5] };
    let model, index = -1, timer = null, destroyed = false, speed = 1000;
    const root = el('section', 'lab-root');
    root.setAttribute('aria-label', 'C++ 代码逐步演示');
    container.replaceChildren(root);

    const heading = el('div', 'lab-heading');
    const headingText = el('div', 'lab-heading-text');
    const eyebrow = el('p', 'lab-eyebrow', '示例逐步演示 · 非通用编译器');
    const title = el('h3', 'lab-title');
    const intro = el('p', 'lab-intro');
    headingText.append(eyebrow, title, intro);
    const selectWrap = el('label', 'lab-mode-label', '演示主题');
    const modeSelect = el('select', 'lab-mode-select');
    modeSelect.setAttribute('aria-label', '选择代码演示主题');
    Object.keys(modeInfo).forEach(function (key) {
      const option = el('option', '', { variables: '变量与赋值', loops: '循环累加', pointers: '指针与内存', recursion: '递归与调用栈', binary: '二分查找', sort: '冒泡排序', objects: '类与对象' }[key]);
      option.value = key;
      modeSelect.appendChild(option);
    });
    modeSelect.value = mode;
    selectWrap.appendChild(modeSelect);
    heading.append(headingText, selectWrap);
    const inputs = el('div', 'lab-inputs');
    const layout = el('div', 'lab-layout');
    const codePanel = el('div', 'lab-code-panel');
    const codeHeading = el('div', 'lab-panel-heading');
    codeHeading.appendChild(el('span', '', 'C++17 · main.cpp'));
    const copyButton = el('button', 'lab-copy', '复制代码');
    copyButton.type = 'button';
    codeHeading.appendChild(copyButton);
    const codeBlock = el('pre', 'lab-code');
    codeBlock.tabIndex = 0;
    codeBlock.setAttribute('aria-label', '演示的 C++ 源代码，当前执行行会突出显示');
    codePanel.append(codeHeading, codeBlock);
    const statePanel = el('div', 'lab-state-panel');
    statePanel.appendChild(el('div', 'lab-panel-heading', '运行现场'));
    const memory = el('div', 'lab-memory');
    const diagram = el('div', 'lab-diagram');
    const outputLabel = el('div', 'lab-output-label', '程序输出');
    const output = el('pre', 'lab-output', '等待 cout 输出…');
    output.setAttribute('aria-label', '程序输出');
    output.setAttribute('aria-live', 'polite');
    statePanel.append(memory, diagram, outputLabel, output);
    layout.append(codePanel, statePanel);

    const explanation = el('p', 'lab-explanation');
    explanation.setAttribute('aria-live', 'polite');
    explanation.setAttribute('aria-atomic', 'true');
    const transport = el('div', 'lab-transport');
    const controls = el('div', 'lab-buttons');
    const play = el('button', 'lab-play', '播放演示');
    const step = el('button', 'lab-step', '下一步');
    const reset = el('button', 'lab-reset', '重置');
    [play, step, reset].forEach(function (button) { button.type = 'button'; });
    controls.append(play, step, reset);
    const progressWrap = el('div', 'lab-progress-wrap');
    const progress = el('progress', 'lab-progress');
    progress.setAttribute('aria-label', '演示执行进度');
    const count = el('span', 'lab-step-count');
    progressWrap.append(progress, count);
    const speedLabel = el('label', 'lab-speed-label', '速度');
    const speedSelect = el('select', 'lab-speed');
    speedSelect.setAttribute('aria-label', '演示播放速度');
    [[1500, '慢一点'], [1000, '正常'], [500, '快一点']].forEach(function (entry) {
      const option = el('option', '', entry[1]);
      option.value = entry[0];
      speedSelect.appendChild(option);
    });
    speedSelect.value = '1000';
    speedLabel.appendChild(speedSelect);
    transport.append(controls, progressWrap, speedLabel);
    const note = el('p', 'lab-note');
    root.append(heading, inputs, layout, explanation, transport, note);

    function stop() {
      if (timer !== null) window.clearInterval(timer);
      timer = null;
      play.textContent = model && index === model.steps.length - 1 ? '重新播放' : '播放演示';
      play.setAttribute('aria-pressed', 'false');
    }

    function redrawCode() {
      codeBlock.replaceChildren();
      const code = el('code', 'lab-code-content');
      model.lines.forEach(function (line, i) {
        const row = el('span', 'lab-code-line');
        row.dataset.line = String(i);
        const number = el('span', 'lab-line-number', String(i + 1));
        number.setAttribute('aria-hidden', 'true');
        const text = el('span', 'lab-line-text', line || ' ');
        row.append(number, text);
        code.appendChild(row);
      });
      codeBlock.appendChild(code);
    }

    function drawState() {
      const current = index >= 0 ? model.steps[index] : null;
      codeBlock.querySelectorAll('.lab-code-line').forEach(function (row, i) {
        row.classList.toggle('is-active', !!current && i === current.line);
        if (current && i === current.line) row.setAttribute('aria-current', 'step');
        else row.removeAttribute('aria-current');
      });
      memory.replaceChildren();
      const items = current ? current.values : [{ name: '准备就绪', value: '从第一行开始', note: '点击“下一步”或“播放演示”' }];
      items.forEach(function (item) {
        const box = el('div', 'lab-value');
        box.append(el('span', 'lab-value-name', item.name), el('strong', 'lab-value-number', String(item.value)));
        if (item.note) box.appendChild(el('span', 'lab-value-note', item.note));
        memory.appendChild(box);
      });
      diagram.replaceChildren();
      if (current && current.array) {
        const array = el('div', 'lab-array');
        array.setAttribute('aria-label', '数组当前状态');
        current.array.forEach(function (value, i) {
          const cell = el('div', 'lab-array-cell');
          if (current.focus && current.focus.includes(i)) cell.classList.add('is-focus');
          if (current.found && current.found.includes(i)) cell.classList.add('is-found');
          if (current.interval && (i < current.interval[0] || i > current.interval[1])) cell.classList.add('is-muted');
          if (current.sortedFrom !== undefined && i >= current.sortedFrom) cell.classList.add('is-sorted');
          cell.append(el('small', 'lab-array-index', '[' + i + ']'), el('strong', 'lab-array-value', String(value)));
          array.appendChild(cell);
        });
        diagram.appendChild(array);
        diagram.appendChild(el('p', 'lab-diagram-note', mode === 'binary' ? '浅色：已经排除 · 深色：正在比较 · 绿色：找到目标' : '深色：正在比较 · 绿色：已经排到最终位置'));
      }
      if (current && current.pointer) {
        const pointer = el('div', 'lab-pointer');
        pointer.append(el('div', 'lab-pointer-source', current.pointer.linked ? 'p\n存放地址 A' : 'p\n尚未声明'), el('span', 'lab-pointer-arrow', current.pointer.linked ? '→' : '·'), el('div', 'lab-pointer-target', 'age = ' + current.pointer.age + '\n示意地址 A'));
        pointer.setAttribute('aria-label', current.pointer.linked ? '指针 p 保存地址 A，指向 age' : 'age 已初始化，p 尚未声明');
        diagram.appendChild(pointer);
      }
      if (current && current.stack) {
        diagram.appendChild(el('div', 'lab-diagram-label', '函数调用栈 · 新调用在上方'));
        const stack = el('div', 'lab-stack');
        if (!current.stack.length) stack.appendChild(el('p', 'lab-stack-empty', '没有正在执行的 factorial 调用'));
        current.stack.slice().reverse().forEach(function (frame, i) {
          const box = el('div', 'lab-stack-frame' + (i === 0 ? ' is-active' : ''));
          box.append(el('strong', '', 'factorial(' + frame.n + ')'), el('span', '', frame.status));
          stack.appendChild(box);
        });
        diagram.appendChild(stack);
      }
      if (current && current.object) {
        const object = el('div', 'lab-object');
        object.append(el('strong', 'lab-object-title', 'student : Student'), el('span', 'lab-object-member', 'private · score_ = ' + current.object.score), el('span', 'lab-object-methods', 'public · addBonus() / score()'));
        diagram.appendChild(object);
      }
      if (current && current.sequence) {
        const sequence = el('div', 'lab-sequence');
        for (let i = 1; i <= current.sequence.total; i++) sequence.appendChild(el('span', 'lab-sequence-item' + (i <= current.sequence.done ? ' is-done' : ''), String(i)));
        sequence.setAttribute('aria-label', '已经累加到 ' + current.sequence.done);
        diagram.appendChild(sequence);
      }
      output.textContent = current && current.output ? current.output : '等待 cout 输出…';
      output.classList.toggle('has-output', !!current && !!current.output);
      explanation.textContent = current ? current.explanation : '先改一下上面的输入，再点“下一步”。高亮行表示这一步正在执行的语句。';
      progress.max = model.steps.length;
      progress.value = index + 1;
      count.textContent = (index + 1) + ' / ' + model.steps.length + ' 步';
      step.disabled = index >= model.steps.length - 1;
      if (timer === null) play.textContent = index >= model.steps.length - 1 ? '重新播放' : '播放演示';
    }

    function restart() {
      stop();
      index = -1;
      model = makeModel(mode, settings);
      redrawCode();
      drawState();
      copyButton.textContent = '复制代码';
    }

    function addNumber(label, key, min, max) {
      const wrap = el('div', 'lab-input-group');
      const caption = el('label', 'lab-input-label', label);
      const number = el('input', 'lab-number');
      number.type = 'number';
      number.min = String(min);
      number.max = String(max);
      number.step = '1';
      number.value = String(settings[key]);
      number.setAttribute('aria-label', label + '，范围 ' + min + ' 到 ' + max);
      const range = el('input', 'lab-range');
      range.type = 'range';
      range.min = String(min);
      range.max = String(max);
      range.step = '1';
      range.value = String(settings[key]);
      range.setAttribute('aria-label', '拖动调整' + label);
      caption.appendChild(number);
      wrap.append(caption, range);
      function update(source) {
        settings[key] = int(source.value, min, max);
        number.value = String(settings[key]);
        range.value = String(settings[key]);
        restart();
      }
      range.addEventListener('input', function () { update(range); });
      number.addEventListener('change', function () { update(number); });
      inputs.appendChild(wrap);
    }

    function rebuildInputs() {
      inputs.replaceChildren();
      title.textContent = modeInfo[mode].title;
      intro.textContent = modeInfo[mode].intro;
      note.textContent = modeInfo[mode].note;
      if (mode === 'variables' || mode === 'objects') {
        addNumber('初始成绩', 'score', 0, 100);
        addNumber('加分', 'bonus', 0, 20);
      } else if (mode === 'loops') addNumber('加到 n', 'n', 1, 20);
      else if (mode === 'recursion') addNumber('计算 n!', 'n', 1, 8);
      else if (mode === 'pointers') {
        addNumber('age 的初始值', 'age', 0, 100);
        addNumber('通过 *p 写入的值', 'update', 0, 100);
      } else if (mode === 'binary') addNumber('寻找的目标', 'target', 0, 80);
      else {
        const label = el('label', 'lab-array-label', '待排序的整数（2–8 项，用逗号分隔）');
        const input = el('input', 'lab-array-input');
        input.type = 'text';
        input.value = settings.array.join(', ');
        input.setAttribute('aria-label', '待排序的整数，用逗号分隔，2 到 8 项，每项 -99 到 99');
        label.appendChild(input);
        const apply = el('button', 'lab-apply', '更新数组');
        apply.type = 'button';
        const feedback = el('span', 'lab-input-feedback');
        feedback.setAttribute('role', 'status');
        function applyArray() {
          const parts = input.value.trim().split(/[,，\s]+/);
          if (parts.length < 2 || parts.length > 8 || parts.some(function (part) { return !/^-?\d+$/.test(part) || Number(part) < -99 || Number(part) > 99; })) {
            feedback.textContent = '请输入 2–8 个整数，每个在 −99 到 99 之间。';
            input.setAttribute('aria-invalid', 'true');
            return;
          }
          settings.array = parts.map(Number);
          input.value = settings.array.join(', ');
          input.removeAttribute('aria-invalid');
          feedback.textContent = '数组已更新，从第一步重新开始。';
          restart();
        }
        apply.addEventListener('click', applyArray);
        input.addEventListener('keydown', function (event) { if (event.key === 'Enter') applyArray(); });
        inputs.append(label, apply, feedback);
      }
    }

    function next() {
      if (destroyed || index >= model.steps.length - 1) return;
      index++;
      drawState();
      if (index >= model.steps.length - 1) stop();
    }

    play.setAttribute('aria-pressed', 'false');
    play.addEventListener('click', function () {
      if (timer !== null) { stop(); return; }
      if (index >= model.steps.length - 1) { index = -1; drawState(); }
      next();
      if (index < model.steps.length - 1) {
        timer = window.setInterval(next, speed);
        play.textContent = '暂停';
        play.setAttribute('aria-pressed', 'true');
      }
    });
    step.addEventListener('click', function () { stop(); next(); });
    reset.addEventListener('click', restart);
    speedSelect.addEventListener('change', function () {
      speed = Number(speedSelect.value);
      if (timer !== null) {
        window.clearInterval(timer);
        timer = window.setInterval(next, speed);
      }
    });
    modeSelect.addEventListener('change', function () {
      stop();
      mode = modeSelect.value;
      if (mode === 'recursion') settings.n = int(settings.n, 1, 8);
      rebuildInputs();
      restart();
    });
    copyButton.addEventListener('click', async function () {
      const text = model.lines.join('\n') + '\n';
      let copied = false;
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text);
          copied = true;
        }
      } catch (_) { /* File URLs may deny Clipboard API; use the selection fallback. */ }
      if (!copied) {
        const textarea = el('textarea', 'lab-copy-buffer');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        textarea.setAttribute('aria-label', '供复制的源代码');
        root.appendChild(textarea);
        textarea.focus();
        textarea.select();
        try { copied = document.execCommand('copy'); } catch (_) { copied = false; }
        textarea.remove();
        copyButton.focus();
      }
      if (!destroyed) copyButton.textContent = copied ? '已复制 ✓' : '复制受限，请选中代码复制';
    });
    instances.set(container, { dispose: function () { destroyed = true; stop(); } });
    rebuildInputs();
    restart();
    return { destroy: function () { destroy(container); } };
  }

  function destroy(container) {
    const instance = instances.get(container);
    if (instance) { instance.dispose(); instances.delete(container); }
  }

  window.CPPLab = { render: render, destroy: destroy };
})();

/* C++17 基础课程：示例均可单独保存为 main.cpp。 */
window.CPP_FOUNDATION = [
  { id: 'ch01', number: 1, title: '程序与工具', description: '从一张白纸开始，弄懂程序怎样从文字变成正在运行的机器指令。', lessons: [
    {
      id: 'l01', title: '第一段程序：让计算机说句话', minutes: 12,
      lead: '程序是你写给计算机的一套明确步骤。第一节不急着背术语，我们先让一段六行代码真正工作，再逐行拆开。',
      objectives: ['分清源代码、程序与运行结果', '认识 main、语句和标准输出', '修改第一段程序并预测结果'],
      sections: [
        { title: '计算机需要明确的指令', paragraphs: ['对人说“帮我算个平均分”，对方会猜你的意思；计算机不会。你要告诉它分数从哪里来、怎样相加、除以几、结果送到哪里。编程的第一步，是把一个模糊愿望拆成能够执行的步骤。', 'C++ 是表达这些步骤的一种语言。写在文件里的文字叫<strong>源代码</strong>，文件通常以 .cpp 结尾。源代码需要经过编译才能成为可执行程序；屏幕出现的文字是程序的输出，并不是源代码本身。'] },
        { title: '入口、工具与语句', paragraphs: ['程序通常从 <code>int main()</code> 开始执行。花括号围出的部分是函数体，里面的语句按先后顺序执行。<code>return 0;</code> 表示这次运行正常结束；这里的 0 是交给操作系统的状态，不会自动打印到屏幕。', '<code>#include &lt;iostream&gt;</code> 引入输入输出工具的声明。<code>std::cout</code> 是标准输出流，<code>&lt;&lt;</code> 把右边的内容送进去。双引号围起来的文字叫字符串字面量；语句末尾的分号是语法的一部分，不能用中文分号替代。'] },
        { title: '先预测，再运行', paragraphs: ['<code>std::</code> 说明 cout 属于标准库的命名空间。可以把命名空间理解成名字的所属目录：不同目录允许有相同名字，但程序仍知道你指的是哪一个。我们一直写完整名字，方便追踪工具的来源。', '<code>\n</code> 代表换行，不是反斜杠和字母 n 两个普通输出字符。阅读程序时，先用纸写出你认为会出现的结果，再运行比较。能够预测小程序，比能够照着键盘抄长程序更能说明你学会了。'] }
      ],
      example: { code: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, C++!\\n";\n    std::cout << "3 + 4 = " << 3 + 4 << "\\n";\n    return 0;\n}\n', output: 'Hello, C++!\n3 + 4 = 7', explanation: ['第一条输出语句打印引号里的文字，然后换行。', '第二条语句先输出说明文字，再计算 3 + 4，最后换行。引号外的表达式会被计算。', '两个输出语句互相独立。main 的返回值不会成为第三行输出。'] },
      pitfall: '把 "3 + 4" 写在双引号里会原样打印 3 + 4；只有引号外的 3 + 4 才会做加法。中文引号、中文分号也不是 C++ 对应的符号。',
      quiz: {"question":"std::cout << \"2 * 5 = \" << 2 * 5; 会输出什么？","options":["10","2 * 5 = 10","2 * 5 = 2 * 5","编译失败"],"answer":1,"explanation":"字符串先原样输出；后面的乘法表达式求值为 10，再接在它后面。"},
      exercise: { title: '写一张程序名片', prompt: '输出两行：第一行是 C++ learner，第二行是 6 * 7 = 42。第二行的 42 必须由程序计算得到。', hint: '把说明文字放在引号里，把乘法放在引号外。每行末尾使用 \\n。', solution: '#include <iostream>\n\nint main() {\n    std::cout << "C++ learner\\n";\n    std::cout << "6 * 7 = " << 6 * 7 << "\\n";\n    return 0;\n}\n', explanation: '两条语句按顺序执行。将文字和计算结果连续送入 cout，就能在同一行混合显示它们。' }
    },
    {
      id: 'l02', title: '安装、编译与运行：让 .cpp 动起来', minutes: 15,
      lead: '编辑器负责写字，编译器负责翻译，终端负责发出命令。把这三件事分开，环境安装就不再像一团线。',
      objectives: ['理解预处理、编译、链接和运行', '选一条适合自己系统的安装路线', '用 C++17 编译选项运行完整程序'],
      sections: [
        { title: '从文字到可执行文件', paragraphs: ['编译流程可以先分成三步：预处理处理 include 等指令；编译把各个源文件翻译成目标文件；链接把目标文件和需要的库组合起来。一个小文件也会经历这些步骤，只是编译器常替你一次完成。', '声明告诉编译器“有这个名字，它是什么类型”；定义真正提供函数体或建立对象。标准头文件提供大量声明，标准库提供相应实现。只写函数声明而没有任何定义，可能通过编译却在链接时出现找不到函数的错误。'] },
        { title: '选择系统对应的工具', paragraphs: ['Windows 可以安装 Visual Studio Community，在安装器里勾选“使用 C++ 的桌面开发”。打开 Visual Studio 的开发人员命令提示符，在文件所在目录执行 <code>cl /std:c++17 /EHsc main.cpp</code>，再执行 main.exe。普通命令提示符可能没有 cl 的环境变量。', 'macOS 可以在终端执行 <code>xcode-select --install</code> 安装命令行工具，然后用 <code>clang++ -std=c++17 -Wall -Wextra main.cpp -o main</code> 编译。Ubuntu/Debian Linux 可用 <code>sudo apt install g++</code> 安装，再执行 <code>g++ -std=c++17 -Wall -Wextra main.cpp -o main</code>；二者运行时都输入 <code>./main</code>。'] },
        { title: '编辑器不是编译器', paragraphs: ['VS Code 是编辑器，装一个 C++ 扩展不等于已经装好了编译器。先在终端确认 g++、clang++ 或 cl 能运行，再配置编辑器按钮。把文件保存成 main.cpp，并确认终端当前目录就是这个文件所在的位置。', '<code>-std=c++17</code> 选择语言标准，<code>-Wall -Wextra</code> 开启常见警告，<code>-o main</code> 指定输出文件名。每次改源代码之后都要重新编译；否则你运行的仍可能是上一次的程序。把编译命令和运行命令分开执行，排错会清楚很多。'] }
      ],
      example: { code: '#include <iostream>\n\nint main() {\n    std::cout << "Build succeeded.\\n";\n    return 0;\n}\n', output: 'Build succeeded.', explanation: ['把代码保存为 main.cpp，使用本节与你系统对应的编译命令。', '编译成功后才会得到可执行文件。再运行文件，才会看到这句话。', '将 succeeded 改成 finished，保存并重新编译，观察输出是否同步改变。'] },
      pitfall: '编译成功不代表程序已经运行；终端找不到编译器也不代表代码写错。先辨认错误发生在工具安装、编译、链接还是运行阶段。',
      quiz: {"question":"修改 main.cpp 后运行结果一直不变，最先该检查什么？","options":["是否保存并重新编译了正确的文件","是否把 main 改成 Main","是否删除全部分号","是否把 C++17 改成 HTML"],"answer":0,"explanation":"可执行文件不会随着源代码自动改变，除非工具确实触发了重新编译。"},
      exercise: { title: '建立可重复的运行流程', prompt: '新建 main.cpp，打印第一行 Version 1、第二行 8。运行后把 Version 1 改成 Version 2，重新编译并确认第一行更新。', hint: '先保存源代码，再编译，最后运行生成的可执行文件。用 3 + 5 产生第二行。', solution: '#include <iostream>\n\nint main() {\n    std::cout << "Version 2\\n";\n    std::cout << 3 + 5 << "\\n";\n    return 0;\n}\n', explanation: '这个练习检验的是完整工具链。看到 Version 2 和 8，说明你修改、保存、编译、运行的是同一个文件。' }
    },
    {
      id: 'l03', title: '输入与输出：让程序接住你的数字', minutes: 12,
      lead: '同一段程序可以处理不同数据。我们从两块巧克力的价格开始，让输入、计算、输出形成一条看得见的流水线。',
      objectives: ['用 cin 接收整数与小数', '区分输入提示和实际数据', '处理最基本的输入失败'],
      sections: [
        { title: '变量先准备，输入再填入', paragraphs: ['变量是有名字、有类型的一块存储位置。<code>int count = 0;</code> 建立一个用于保存整数的变量，并给它初始值。<code>std::cin &gt;&gt; count;</code> 尝试从标准输入读取整数，成功后把读到的值放进 count。', '可以连续写 <code>std::cin &gt;&gt; a &gt;&gt; b;</code>。在默认格式下，空格、换行和制表符都可以分隔数字，因此输入“3 7”和分两行输入 3、7 通常效果相同。输出提示语只是在帮助使用者，不会替代真正的输入。'] },
        { title: '让计算过程保持清楚', paragraphs: ['把计算写成 <code>int total = price * count;</code>，相当于记录一个中间结果。名字 price、count、total 比 a、b、c 更能表达意义。给变量命名时用字母、数字、下划线，并且不要以数字开头；名字区分大小写。', '程序执行输入语句时可能等待你敲字并按回车。看到光标停住不一定是卡死。先检查程序是否正在读取数据，以及需要几个数据。初学时先用规定格式的简单输入，之后再学习整行文本和更严格的输入校验。'] },
        { title: '输入也可能失败', paragraphs: ['如果程序要整数，你却输入 hello，提取操作会失败。可以写 <code>if (!(std::cin &gt;&gt; price &gt;&gt; count))</code> 检测；暂时把它读作“如果没有成功读入两个整数”。失败时给出提示并结束，避免继续计算无意义的数据。', '成功读入还不等于数据合理：件数可能为负数，金额也可能超出范围。语法格式的检查与业务范围的检查是两件事。本节先检查格式，后面学 if 时再写范围判断。真实金额通常更适合用整数分来表示，避免小数误差。'] }
      ],
      example: { code: '#include <iostream>\n\nint main() {\n    int price = 0;\n    int count = 0;\n    if (!(std::cin >> price >> count)) {\n        std::cout << "Input error\\n";\n        return 1;\n    }\n    int total = price * count;\n    std::cout << "Total: " << total << "\\n";\n    return 0;\n}\n', output: '输入：6 4\n输出：Total: 24', explanation: ['先建立两个整数变量，再读取单价与数量。示例约定使用很小的非负整数。', '读取失败时返回 1；成功时计算总价并输出。return 会立即结束 main。', '代码没有打印输入数字，输入行只是这里为了说明运行条件而添加的记录。'] },
      pitfall: 'cout 使用 <<，cin 使用 >>。它们的方向恰好相反；也不要把变量名放进引号，否则你打印的是名字的文字。',
      quiz: {"question":"程序执行 cin >> a >> b，输入 4 然后换行再输入 9。a、b 分别是什么？","options":["9 和 4","都为 4","换行导致第二个输入必定失败","4 和 9"],"answer":3,"explanation":"默认格式化读取会跳过空白，换行可以作为两个整数之间的分隔。"},
      exercise: { title: '长方形测量器', prompt: '读入两个 1 到 100 的整数，分别是长和宽，输出周长与面积，各占一行。可以假定数值范围满足题意，但应检查是否读入成功。', hint: '周长是 2 * (length + width)，面积是 length * width。', solution: '#include <iostream>\n\nint main() {\n    int length = 0;\n    int width = 0;\n    if (!(std::cin >> length >> width)) {\n        return 1;\n    }\n    std::cout << 2 * (length + width) << "\\n";\n    std::cout << length * width << "\\n";\n    return 0;\n}\n', explanation: '输入 5 3 时输出 16 和 15。括号让加法先完成；变量名把公式与几何意义对应起来。' }
    },
    {
      id: 'l04', title: '读懂错误：编译错、运行错与答案错', minutes: 14,
      lead: '报错是程序提供的线索。会排错的人不是从不犯错，而是能把一个大问题缩小到某一行、某一步。',
      objectives: ['分辨三种常见错误', '阅读首条错误信息与定位行号', '用具体输入验证公式'],
      sections: [
        { title: '先问错误发生在哪一步', paragraphs: ['编译错误发生在程序开始运行之前，例如漏分号、拼错 cout、括号不成对。编译器会拒绝生成新的可执行程序。链接错误发生在组合程序时，例如声明了一个函数却没有提供定义；它也发生在运行之前。', '运行错误发生在程序已经启动之后，例如访问无效内存。逻辑错误更隐蔽：程序顺利结束，但算出的答案不对。编译器检查语言规则，并不能知道你想求周长还是面积，所以逻辑错误必须靠推理和测试发现。'] },
        { title: '从第一条错误向外找', paragraphs: ['一处漏掉右括号，可能让后面的很多行都被误读。先修正第一条有实际意义的诊断，再重新编译，不必同时追着几十条报错跑。报错位置是编译器发现问题的位置，真正的原因也可能在它上一行。', '“expected ;”常提示缺分号；“not declared”常提示名字没有声明、拼错或不在当前作用域。不要看到英文就立即改代码：把文件名、行号、涉及的名字和关键短语分别读出来，通常已足够缩小范围。'] },
        { title: '用小例子检查逻辑', paragraphs: ['检查公式时先选能心算的输入，比如长 5、宽 3，周长应为 16。再选边界和特殊值，比如正方形、允许的最小尺寸。只测一个普通输入，可能恰巧绕过错误；测试应有目的，而不是随机输入几个数。', '临时输出中间变量可以帮助检查数据在哪一步偏离预期。一次只改一个原因，改完重复原来的失败输入。错误修好后删掉无关的调试输出，否则自动评测会把额外文字当成错误答案。警告也值得读，即使它暂时没有阻止编译。'] }
      ],
      example: { code: '#include <iostream>\n\nint main() {\n    int length = 5;\n    int width = 3;\n    int perimeter = 2 * (length + width);\n    std::cout << perimeter << "\\n";\n    return 0;\n}\n', output: '16', explanation: ['如果错写成 2 * length + width，会输出 13。它语法正确，但公式不对。', '用手算的 16 对照运行结果，能发现逻辑错误；编译器无法替你判断几何公式。', '括号把长与宽的和作为整体乘以 2，明确表达公式。'] },
      pitfall: '发生编译错误后，旧的可执行文件可能仍然存在。此时运行旧文件会让你误以为修改已经生效；先确认本次编译确实成功。',
      quiz: {"question":"面积公式误写成 length + width，程序成功运行却给出错答案，属于什么？","options":["一定是编译错误","一定是链接错误","逻辑错误","编辑器故障"],"answer":2,"explanation":"表达式符合 C++ 语法，但没有实现题目要求的乘法，因此属于逻辑错误。"},
      exercise: { title: '修复平均分', prompt: '某同学写了 int average = a + b / 2; 来求两个偶数成绩的平均值。修正公式，对 a = 80、b = 90 输出正确答案。', hint: '加法要先于除法，使用括号。这里两个成绩的和是偶数，因此整数结果没有小数部分。', solution: '#include <iostream>\n\nint main() {\n    int a = 80;\n    int b = 90;\n    int average = (a + b) / 2;\n    std::cout << average << "\\n";\n    return 0;\n}\n', explanation: '原式先算 90 / 2，再加 80，得到 125；修正后先得到 170，再除以 2，输出 85。' }
    }
  ] },
  { id: 'ch02', number: 2, title: '变量与表达式', description: '把名字、数值和计算连接起来，理解类型为什么决定程序的行为。', lessons: [
    {
      id: 'l05', title: '类型与范围：选一只合适的盒子', minutes: 15,
      lead: '变量可以像有标签的盒子，但盒子类比有边界：类型还规定了可以做什么运算、数值如何表示，以及能装多大。',
      objectives: ['区分 int、double、char 和 bool', '查询整数范围而不是猜测', '认识 enum class 的语义与有符号溢出'],
      sections: [
        { title: '类型告诉程序如何解释数据', paragraphs: ['<code>int</code> 用于整数，<code>double</code> 用于近似表示实数，<code>char</code> 保存一个字符编码单元，<code>bool</code> 表示 true 或 false。整数 3、浮点数 3.0 和字符 \'3\' 的含义不同，即使人看上去都像一个三。', '计算机内存保存位模式，类型决定程序怎样解释它。char 并不保证能独立装下一个汉字；常见 UTF-8 编码的汉字需要多个字节。当前课程用 std::string 保存文本，char 的例子先限定为英文字母与常见 ASCII 字符。'] },
        { title: '范围不是无限的', paragraphs: ['标准没有规定所有机器上的 int 都恰好是 32 位，它至少提供规定的最小范围。常见桌面环境里 int 往往为 32 位，但程序应使用 <code>std::numeric_limits&lt;int&gt;::max()</code> 等工具检查。需要更大整数时可考虑 long long，并仍然检查边界。', '有符号整数算术超出可表示范围属于<strong>未定义行为</strong>，不能依靠它“自动绕一圈”。无符号整数则按其范围大小取模，例如最大值再加一得到零；这种规则是确定的，但不代表适合所有计算。负数与无符号数混合比较尤其容易出错。'] },
        { title: '把有意义的状态写成类型', paragraphs: ['一个开关用 bool 很自然；交通灯有三种状态，则可以用 <code>enum class Light { red, yellow, green };</code>。这样 Light::red 比数字 0 更易读，而且枚举类不会随意隐式变成整数，能挡住一些把不同含义混在一起的错误。', '类型应根据数据的意义选择。人数通常是整数，平均分可能需要小数，是否及格是布尔值。不要因为某个变量“目前装得下”就忽视以后计算的中间结果，特别是乘法：两边分别装得下，乘积仍可能越界。'] }
      ],
      example: { code: '#include <iostream>\n#include <limits>\n\nenum class Light { red, yellow, green };\n\nint main() {\n    int students = 35;\n    double average = 87.5;\n    char group = \'A\';\n    bool passed = average >= 60.0;\n    Light signal = Light::green;\n    std::cout << students << " " << average << " " << group << "\\n";\n    std::cout << std::boolalpha << passed << " " << (signal == Light::green) << "\\n";\n    std::cout << "int max: " << std::numeric_limits<int>::max() << "\\n";\n    return 0;\n}\n', output: '35 87.5 A\ntrue true\nint max: 由当前实现决定，常见值为 2147483647', explanation: ['四个变量分别表达数量、平均值、组别与判断结果。', 'boolalpha 让布尔值以 true/false 显示；枚举通过比较转换成一个布尔结果。', '最后一行查询本机 int 的最大值，避免把常见机器的情况误认为语言保证。'] },
      pitfall: '在乘积已经用 int 计算并溢出之后，才把结果赋给 long long，无法补救。需要让至少一个操作数在运算前成为更宽的类型。',
      quiz: {"question":"哪一种说法符合 C++ 的规则？","options":["int 在所有机器上都无限大","int 的具体范围由实现决定，应查询范围","有符号溢出总会变成最小值","一个 char 一定能保存任意汉字"],"answer":1,"explanation":"类型有最小能力要求，但具体宽度可不同；有符号溢出没有可依赖的结果。"},
      exercise: { title: '把数据意义写出来', prompt: '建立表示图书数量 120、单价 39.5、书架编号 B、是否借出 false 的四个变量，逐行输出。布尔值要求显示为 false。', hint: '分别使用 int、double、char、bool，并在输出布尔值前使用 std::boolalpha。', solution: '#include <iostream>\n\nint main() {\n    int books = 120;\n    double price = 39.5;\n    char shelf = \'B\';\n    bool borrowed = false;\n    std::cout << books << "\\n" << price << "\\n" << shelf << "\\n";\n    std::cout << std::boolalpha << borrowed << "\\n";\n    return 0;\n}\n', explanation: '每种类型都对应一种信息。单引号用于单字符，双引号用于字符串；bool 不需要引号。' }, demo: 'variables'
    },
    {
      id: 'l06', title: '初始化、赋值与 const', minutes: 12,
      lead: '“创建时装入什么”和“后来改成什么”是两个不同动作。分清它们，许多莫名其妙的数值就不会出现。',
      objectives: ['分清声明、定义、初始化与赋值', '避免使用未初始化的局部变量', '用 const 表达不会改变的值'],
      sections: [
        { title: '创建与修改发生在不同时间', paragraphs: ['<code>int score = 80;</code> 声明了名字和类型，同时定义了一个对象，并在创建时初始化为 80。后面的 <code>score = 90;</code> 没有新建变量，而是给已有对象赋值。等号在这里表示动作，不是数学上的恒等关系。', '<code>score = score + 5;</code> 先读取旧值、计算右边，再把新值存回左边。因此旧值为 80 时，新值为 85。一个名字在同一局部作用域不能重复定义；要修改已有变量，就使用赋值而不是再次写 int。'] },
        { title: '不给初始值会怎样', paragraphs: ['函数内部的普通整数如果写成 <code>int count;</code>，没有自动变成零。读取它的值可能导致未定义行为，不能把某次看到的“随机数”当成固定规律。习惯写 <code>int count = 0;</code> 或 <code>int count{};</code>，让状态从一开始就明确。', '花括号初始化还有防止窄化的作用：<code>int n{3.5};</code> 会被拒绝，因为小数信息会丢失。<code>auto</code> 可以由初始化表达式推导类型，但不能省略初始值；auto x = 3 得到 int，auto y = 3.0 得到 double。'] },
        { title: '不变的值也值得起名字', paragraphs: ['<code>const double pi = 3.141592653589793;</code> 创建一个此后不能通过该名字修改的值。const 必须在定义时初始化。给常量命名既减少重复，也说明数字的意义；“每天的秒数”比代码中四处出现的 86400 更容易读懂。', 'const 不是“更高级的变量”，而是在接口和代码中表达承诺。当前对象不应该被改动，就限制它。<code>constexpr</code> 进一步表示某些值或函数可用于编译期计算，后面的泛型课程会深入讨论；这里先用 const 建立最基本的约束。'] }
      ],
      example: { code: '#include <iostream>\n\nint main() {\n    int score{80};\n    score = score + 5;\n    const int bonus = 3;\n    score += bonus;\n    auto passed = score >= 60;\n    std::cout << score << " " << std::boolalpha << passed << "\\n";\n    return 0;\n}\n', output: '88 true', explanation: ['score 创建时为 80，第一次赋值后为 85。', 'score += bonus 是 score = score + bonus 的简写，结果为 88。', '比较表达式的类型是 bool，因此 auto 推导出的 passed 也是 bool。'] },
      pitfall: '不要写 int a; int b = a + 1;。b 的初始化并不会顺便初始化 a；读取 a 时已经出现问题。',
      quiz: {"question":"int x = 4; x = x + 2; 执行后 x 是多少？","options":["6","4","2","因为 x = x + 2 不符合数学而无法编译"],"answer":0,"explanation":"赋值先计算右侧的旧值 4 + 2，再把结果 6 保存回 x。"},
      exercise: { title: '累计零花钱', prompt: '小明起初有 20 元，周一增加 8 元，周二花去 5 元。用一个变量和两次赋值记录变化；另用 const 保存目标金额 30，输出余额和距离目标还差多少。', hint: '余额按时间顺序更新；差额使用 target - money。', solution: '#include <iostream>\n\nint main() {\n    int money = 20;\n    const int target = 30;\n    money += 8;\n    money -= 5;\n    std::cout << money << "\\n";\n    std::cout << target - money << "\\n";\n    return 0;\n}\n', explanation: '余额依次是 20、28、23，最后距离 30 元还差 7 元。常量 target 只被读取，没有被修改。' }, demo: 'variables'
    },
    {
      id: 'l07', title: '运算符：整数除法、逻辑与位', minutes: 16,
      lead: 'C++ 里的运算符看着熟悉，却有几条和纸笔计算不同的规则。整数除法尤其值得单独做几个实验。',
      objectives: ['预测整数除法和余数的结果', '正确使用比较与短路逻辑', '区分逻辑运算和按位运算'],
      sections: [
        { title: '除法由操作数类型决定', paragraphs: ['两个整数相除仍得到整数，小数部分向零截断：7 / 3 为 2，-7 / 3 为 -2。<code>%</code> 取整数除法的余数，因此 7 % 3 为 1，-7 % 3 为 -1。余数与被除数同号或为零，不能直接套用所有数学教材里的非负模定义。', '先乘除再加减，同级通常按结合规则分组。括号是表达意图的好工具。除数不能为零；对有符号整数，最小值除以 -1 也可能超出范围。不要为了展示“错误会怎样”而实际执行这些无效运算。'] },
        { title: '比较与短路判断', paragraphs: ['<code>==</code> 检查相等，<code>!=</code> 检查不等；<code>=</code> 是赋值。<code>&amp;&amp;</code> 表示并且，<code>||</code> 表示或者，<code>!</code> 表示取反。它们得到布尔结果，适合描述“年龄至少 12 且不超过 18”一类条件。', '逻辑运算会短路：a && b 在 a 为假时不计算 b，a || b 在 a 为真时不计算 b。所以 <code>divisor != 0 &amp;&amp; value / divisor &gt; 2</code> 可以先挡住除数为零。不要写数学式 <code>12 &lt;= age &lt;= 18</code>；应分成两次比较再用 && 连接。'] },
        { title: '按位运算处理二进制位', paragraphs: ['单个 <code>&amp;</code>、<code>|</code>、<code>^</code> 分别是按位与、或、异或。它们逐位计算整数的二进制表示，不具备逻辑短路语义。例如 6 的二进制是 110，3 是 011，6 & 3 为 010，也就是 2。位运算常见于标志、硬件与压缩数据。', '<code>&lt;&lt;</code> 和 <code>&gt;&gt;</code> 也可以是整数移位，而输出流里的 << 有不同含义。初学移位时使用无符号整数，并保证移动数量非负且小于类型位宽；不满足这些条件可能产生未定义行为。本课用很小的 unsigned 值观察安全示例。'] }
      ],
      example: { code: '#include <iostream>\n\nint main() {\n    std::cout << 7 / 3 << " " << 7 % 3 << "\\n";\n    int divisor = 0;\n    bool safe = divisor != 0 && 8 / divisor > 2;\n    std::cout << std::boolalpha << safe << "\\n";\n    unsigned int a = 6u;\n    unsigned int b = 3u;\n    std::cout << (a & b) << " " << (a | b) << " " << (a ^ b) << "\\n";\n    std::cout << (1u << 3) << "\\n";\n    return 0;\n}\n', output: '2 1\nfalse\n2 7 5\n8', explanation: ['7 分成每组 3，能得到 2 个完整组，还剩 1。', 'divisor != 0 为假，因此右边的除法不会执行，程序没有除零。', '位运算结果分别来自逐位与、或、异或；1u 向左移 3 位得到 8。'] },
      pitfall: '把 && 误写为 &，可能让本来应该跳过的危险表达式仍然被计算。条件范围写成两次比较，比照搬数学连等式可靠。',
      quiz: {"question":"表达式 10 / 4 + 10 % 4 的整数结果是多少？","options":["4.5","2","0","4"],"answer":3,"explanation":"10 / 4 为 2，10 % 4 为 2，相加得到 4。"},
      exercise: { title: '分钟拆成小时', prompt: '读入 0 到 10000 的总分钟数，输出完整小时数与剩余分钟数。例如输入 135，输出 2 15。', hint: '每小时 60 分钟。商用于完整小时，余数用于剩余分钟。', solution: '#include <iostream>\n\nint main() {\n    int minutes = 0;\n    if (!(std::cin >> minutes) || minutes < 0 || minutes > 10000) {\n        return 1;\n    }\n    std::cout << minutes / 60 << " " << minutes % 60 << "\\n";\n    return 0;\n}\n', explanation: '商和余数是一对互补的信息：135 = 2 * 60 + 15。范围检查避免了无意义输入。' }
    },
    {
      id: 'l08', title: '类型转换与浮点数：为什么 1 / 2 不是 0.5', minutes: 15,
      lead: '类型转换发生的时间很重要。先做了整数除法，再把结果放进 double，已经丢掉的小数不会回来。',
      objectives: ['辨认运算前后转换的区别', '使用 static_cast 表达明确转换', '理解浮点近似与合理比较'],
      sections: [
        { title: '赋值不能倒流改变运算', paragraphs: ['<code>double half = 1 / 2;</code> 的右侧是两个 int，先得到整数 0，再转换为 double 的 0.0。若要得到 0.5，应写 1.0 / 2，或在运算前把一个操作数转换成 double。左侧变量的类型不会反过来改变右侧子表达式的计算。', '<code>static_cast&lt;double&gt;(sum)</code> 明确表示“把 sum 的值转换为 double”。显式转换不是万能修补剂，先要知道转换为什么合理。小数转整数会向零截断，超出目标整数范围的转换不能随意依赖，因此转换前应检查范围。'] },
        { title: '有限位数表达无限实数', paragraphs: ['double 保存有限精度的二进制浮点数。0.5 可以精确表示，但 0.1 在二进制里通常是无限循环小数，必须舍入。于是 0.1 + 0.2 的结果可能与字面量 0.3 的存储值略有差异；这并不是加法突然坏掉。', '显示为 0.30 也不代表内部精确等于数学上的 0.3。<code>std::fixed</code> 与 <code>std::setprecision(2)</code> 改变输出格式，不改变变量的存储值。对于金钱，很多场景可用整数分计算；对于测量、物理和数值算法，应接受并管理近似。'] },
        { title: '误差标准来自问题', paragraphs: ['比较浮点结果时，常用绝对误差或相对误差，而不是机械地用 ==。例如本节的小数规模很小，可以检查 <code>std::abs(x - y) &lt; 1e-9</code>。阈值不是通用魔法数字：很大或很小的量、累积误差和题目要求都可能需要不同标准。', '不要先记“浮点数永远不能用 ==”。精确离散状态就不该用浮点数，某些可精确表示的值也能进行相等比较。关键是明确你比较的是存储值，还是允许误差的数学近似，并让代码表达对应的要求。'] }
      ],
      example: { code: '#include <cmath>\n#include <iomanip>\n#include <iostream>\n\nint main() {\n    int total = 169;\n    int count = 2;\n    double wrong = total / count;\n    double average = static_cast<double>(total) / count;\n    std::cout << std::fixed << std::setprecision(2);\n    std::cout << wrong << " " << average << "\\n";\n    double value = 0.1 + 0.2;\n    std::cout << std::boolalpha << (std::abs(value - 0.3) < 1e-9) << "\\n";\n    return 0;\n}\n', output: '84.00 84.50\ntrue', explanation: ['wrong 接收的是整数除法的结果 84，后来的转换只把它变成 84.0。', 'average 的除法中已有 double 操作数，因此采用浮点运算。', '最后用本例合适的绝对误差标准比较近似结果，fixed 只负责显示两位小数。'] },
      pitfall: 'static_cast<double>(a / b) 仍然先进行整数除法。应写 static_cast<double>(a) / b，并在此前确认 b 不为零。',
      quiz: {"question":"当 a = 5、b = 2 且都是 int 时，哪种写法得到 2.5？","options":["static_cast<double>(a / b)","double x = a / b 中的右侧","static_cast<double>(a) / b","a % b"],"answer":2,"explanation":"必须在除法发生之前使一个操作数成为浮点类型。"},
      exercise: { title: '平均成绩保留两位', prompt: '读入三个 0 到 100 的整数成绩，计算平均值，按小数点后两位输出。输入 80 81 83 应输出 81.33。', hint: '将总分转换为 double 后再除以 3，或直接除以 3.0。', solution: '#include <iomanip>\n#include <iostream>\n\nint main() {\n    int a = 0, b = 0, c = 0;\n    if (!(std::cin >> a >> b >> c)) {\n        return 1;\n    }\n    if (a < 0 || a > 100 || b < 0 || b > 100 || c < 0 || c > 100) {\n        return 1;\n    }\n    double average = (a + b + c) / 3.0;\n    std::cout << std::fixed << std::setprecision(2) << average << "\\n";\n    return 0;\n}\n', explanation: '3.0 使除法使用浮点运算。格式控制将显示结果舍入到两位小数；内部数值仍保持 double 的精度。' }
    }
  ] },
  { id: 'ch03', number: 3, title: '控制流程', description: '让程序能够选择、重复，并一步步验证自己的执行路线。', lessons: [
    {
      id: 'l09', title: 'if 与分支：把判断写完整', minutes: 13,
      lead: '程序不一定从第一行一直直走。遇到条件时，它会选择一条路线；你的任务是把每条路线的含义说清楚。',
      objectives: ['用 if、else if、else 表达互斥情况', '分析条件顺序和边界', '认识 switch 与枚举状态'],
      sections: [
        { title: '条件决定执行哪一块', paragraphs: ['<code>if (score >= 60)</code> 检查条件。条件为真时执行其花括号内的语句，为假时跳过。后接 else 可以描述另一种情况。我们即使只有一条语句也保留花括号，之后增加代码时不容易把语句放错位置。', 'if 与 else 是一次二选一。几个独立的 if 则分别判断，可能执行多块代码。例如先判断是否及格，再判断是否优秀，90 分可能同时满足两者；如果题目只需要一个等级，就应使用 if / else if / else 链。'] },
        { title: '顺序就是规则的一部分', paragraphs: ['等级判断应先写更严格的范围：先判断 score >= 90，再判断 score >= 60，最后处理其余值。进入第一个满足条件的分支后，后面的分支不再检查。若先写 >= 60，90 分也会提前进入“及格”，永远到不了“优秀”。', '边界必须明确。60 分到底属于哪个等级，59 和 60 应有不同路线。先检查分数是否在 0 到 100 之间，再进行分类，能将无效输入和正常分类分开。对每个分界点，至少手动检查它、它前一个数和它后一个数。'] },
        { title: '多个固定状态可以用 switch', paragraphs: ['当条件是某个整数或枚举值等于若干固定值时，可以用 switch 和 case。case 后常用 break 结束该分支；没有 break 时会继续进入后面的语句，这叫贯穿。C++17 的 [[fallthrough]] 可标明有意贯穿，但初学时先把每个分支明确结束。', 'switch 不适合直接写“分数大于 60”这种区间条件。选择结构应服务于可读性：连续范围用 if，固定菜单项或 enum class 状态用 switch。default 处理未列出的值；它不是强制的，但能帮助你考虑意料之外的输入。'] }
      ],
      example: { code: '#include <iostream>\n\nint main() {\n    int score = 0;\n    if (!(std::cin >> score)) {\n        return 1;\n    }\n    if (score < 0 || score > 100) {\n        std::cout << "Invalid score\\n";\n    } else if (score >= 90) {\n        std::cout << "Excellent\\n";\n    } else if (score >= 60) {\n        std::cout << "Passed\\n";\n    } else {\n        std::cout << "Keep practicing\\n";\n    }\n    return 0;\n}\n', output: '输入：90\n输出：Excellent', explanation: ['先排除范围错误，后面的分支才能放心处理合法成绩。', '90 首先满足 >= 90，执行 Excellent 后直接离开整条分支链。', '输入 60 进入 Passed，输入 59 进入最后的 else。'] },
      pitfall: 'if (x = 5) 是赋值，通常也能编译，但与 if (x == 5) 的相等判断完全不同。开启编译警告并认真阅读它。',
      quiz: {"question":"若先判断 score >= 60，再用 else if 判断 score >= 90，输入 95 会怎样？","options":["直接进入 >= 90 的分支","进入第一个 >= 60 的分支","两个分支都执行","必定编译失败"],"answer":1,"explanation":"分支链在首次满足条件时就选定路线，不会自动挑选“最严格”的条件。"},
      exercise: { title: '判断三角形', prompt: '读入三条 1 到 100 的整数边长。若任意两边之和大于第三边，输出 YES，否则输出 NO；范围不合法也输出 NO。', hint: '三个不等式必须同时成立，使用 &&。先用范围检查挡住不合理数据。', solution: '#include <iostream>\n\nint main() {\n    int a = 0, b = 0, c = 0;\n    if (!(std::cin >> a >> b >> c)) {\n        return 1;\n    }\n    bool inRange = a >= 1 && a <= 100 && b >= 1 && b <= 100 && c >= 1 && c <= 100;\n    if (inRange && a + b > c && a + c > b && b + c > a) {\n        std::cout << "YES\\n";\n    } else {\n        std::cout << "NO\\n";\n    }\n    return 0;\n}\n', explanation: '输入 3 4 5 满足三条严格不等式。输入 1 2 3 的两边之和等于第三边，只能排成线，所以输出 NO。' }
    },
    {
      id: 'l10', title: '循环：把重复写成规则', minutes: 14,
      lead: '如果要把一百个数相加，复制一百行代码很难维护。循环把“做什么”和“做几次”分开描述。',
      objectives: ['理解 for 的初始化、条件和更新', '选择 for 或 while', '用不变量解释累加过程'],
      sections: [
        { title: 'for 的三部分依次发生', paragraphs: ['<code>for (int i = 1; i <= n; ++i)</code> 先初始化 i，一开始只执行一次；每轮前检查条件；条件为真则执行循环体；循环体结束后更新 i，再回去检查。更新不是提前发生，所以第一轮看到的 i 仍然是 1。', '循环体可以累加、比较、输出或读取数据。<code>sum += i;</code> 把当前 i 加入总和。把每轮 i 和 sum 写成表格，你就能看到一个复杂结果是怎样由许多简单步骤组成的。sum 在循环外初始化，才能保存各轮共同积累的信息。'] },
        { title: 'while 更适合次数未知的重复', paragraphs: ['<code>while (condition)</code> 在每轮开始前检查条件。如果开始就不满足，循环体一次也不执行。它适合“不断读取，直到结束”或“重复直到误差足够小”这样的任务；如果有清楚的计数器，for 通常更集中、更容易检查。', 'do / while 先执行一次，再检查条件，因此循环体至少执行一轮。选哪种结构不是难度排名，而是让代码顺序吻合问题。所有循环都要考虑状态怎样接近结束，否则条件可能永远为真，形成无限循环。'] },
        { title: '给循环一句每轮都成立的话', paragraphs: ['求 1 到 n 的和时，可以这样描述：在某轮开始前，sum 已经包含 1 到 i - 1 的总和。执行 sum += i 后，它就包含 1 到 i；下一轮 i 增加，这句话再次成立。这种稳定描述叫循环不变量，用来解释正确性。', '边界同样重要。i <= n 会包含 n，i < n 不会。若 n = 0，循环一次也不执行，总和保持 0，恰好表示空集合的和。用空情况和只循环一轮的情况检查程序，往往比只测 n = 100 更能找出边界错误。'] }
      ],
      example: { code: '#include <iostream>\n\nint main() {\n    int n = 5;\n    int sum = 0;\n    for (int i = 1; i <= n; ++i) {\n        sum += i;\n        std::cout << "i=" << i << ", sum=" << sum << "\\n";\n    }\n    std::cout << "Total: " << sum << "\\n";\n    return 0;\n}\n', output: 'i=1, sum=1\ni=2, sum=3\ni=3, sum=6\ni=4, sum=10\ni=5, sum=15\nTotal: 15', explanation: ['sum 只在循环开始前设为零，每轮延续上一轮的结果。', 'i 从 1 到 5，每轮增加 1。条件变成 6 <= 5 时为假，循环结束。', '如果把 sum = 0 放在循环体开头，每轮都会丢掉之前的积累。'] },
      pitfall: 'for (...) 后面误加一个分号，会让循环体变成空语句。下面的花括号块只执行一次，通常与原意不同。',
      quiz: {"question":"for (int i = 0; i < 4; ++i) 的循环体执行几次？","options":["4 次","3 次","5 次","无限次"],"answer":0,"explanation":"i 依次为 0、1、2、3 时执行；变成 4 后条件不成立。"},
      exercise: { title: '累加奇数', prompt: '读入 0 到 1000 的整数 n，计算 1 到 n 之间所有奇数的和。输入 7 应输出 16。', hint: '让计数器从 1 开始，每轮增加 2，就不需要额外判断奇偶。累加器用 long long，为总和保留足够范围。', solution: '#include <iostream>\n\nint main() {\n    int n = 0;\n    if (!(std::cin >> n) || n < 0 || n > 1000) {\n        return 1;\n    }\n    long long sum = 0;\n    for (int i = 1; i <= n; i += 2) {\n        sum += i;\n    }\n    std::cout << sum << "\\n";\n    return 0;\n}\n', explanation: '实际访问的数是 1、3、5、7，因此和为 16。n = 0 时不执行循环，输出 0。单个输入很小，但总和可能达到 250000，因此使用 long long，而不依赖本机 int 的宽度。' }, demo: 'loops'
    },
    {
      id: 'l11', title: '嵌套循环、break 与 continue', minutes: 14,
      lead: '一层循环像走过一排座位；两层循环像先选一排，再走完这一排。外层和内层各自维护自己的进度。',
      objectives: ['预测嵌套循环的执行次数', '区别 break 与 continue', '避免误以为 break 能跳出所有层'],
      sections: [
        { title: '内层为每一个外层值重新开始', paragraphs: ['外层变量 row 表示行，内层变量 col 表示列。每次外层进入循环体，都会重新执行内层的初始化。因此打印三行四列时，内层从 0 到 3 的过程会发生三次，总共打印 12 个元素。', '换行语句应该放在内层结束之后、外层结束之前：这样一整行打印完才换行。若把换行放进内层，每个元素就单独一行；放在所有循环外，所有元素又会挤在一行。位置直接决定输出结构。'] },
        { title: '提前结束与跳过当前轮', paragraphs: ['<code>break;</code> 立即结束它所在的最近一层循环。<code>continue;</code> 跳过本轮剩下的循环体；for 仍会执行更新表达式再判断下一轮，while 则直接回到条件检查。两者都不表示结束整个程序。', '如果在 while 中把计数器更新放在 continue 后面，该轮会跳过更新，可能永远停在同一个值。使用 continue 前要确认进度仍然前进。简单场景也可以通过 if 包住需要执行的部分，使路线更直观。'] },
        { title: '多层退出要明确表达', paragraphs: ['在网格中寻找某个目标时，内层 break 只结束当前行的搜索，外层还会继续下一行。可用 found 标志让外层条件停止，也可以把搜索放进函数并在找到时 return；后者会直接结束整个函数。', '嵌套循环不一定都很慢。三行四列只做 12 次工作；但 n 行、n 列会做约 n 的平方次。输入规模扩大十倍时，工作量可能扩大一百倍。先数清楚重复次数，再判断程序能否承受题目的数据规模。'] }
      ],
      example: { code: '#include <iostream>\n\nint main() {\n    for (int row = 1; row <= 3; ++row) {\n        for (int col = 1; col <= 4; ++col) {\n            std::cout << row * 10 + col << " ";\n        }\n        std::cout << "\\n";\n    }\n    for (int value = 1; value <= 6; ++value) {\n        if (value == 2) {\n            continue;\n        }\n        if (value == 5) {\n            break;\n        }\n        std::cout << value << " ";\n    }\n    std::cout << "\\n";\n    return 0;\n}\n', output: '11 12 13 14\n21 22 23 24\n31 32 33 34\n1 3 4', explanation: ['内层循环打印四个值，外层让它重复三行。', '第二个循环在 value 为 2 时跳过输出，在为 5 时提前结束。', '6 根本没有机会进入循环体，5 也不会被输出。每行尾部的空格不影响这里展示的数值。'] },
      pitfall: '嵌套循环内的 break 只跳出最近一层循环。需要退出函数时用 return，需要停止外层时明确传递状态。',
      quiz: {"question":"外层运行 3 次，每次内层运行 5 次，没有提前退出，内层循环体共运行几次？","options":["8 次","5 次","3 次","15 次"],"answer":3,"explanation":"每一轮外层都完整执行 5 次内层，共 3 × 5 = 15 次。"},
      exercise: { title: '打印直角三角形', prompt: '读入 1 到 10 的整数 n，打印 n 行星号，第 row 行打印 row 个星号。n = 3 时依次打印 *、**、***。', hint: '外层控制行号 1 到 n，内层从 1 到当前行号。内层结束后换行。', solution: '#include <iostream>\n\nint main() {\n    int n = 0;\n    if (!(std::cin >> n) || n < 1 || n > 10) {\n        return 1;\n    }\n    for (int row = 1; row <= n; ++row) {\n        for (int col = 1; col <= row; ++col) {\n            std::cout << "*";\n        }\n        std::cout << "\\n";\n    }\n    return 0;\n}\n', explanation: '内层上限随 row 改变，所以每行长度增加一。总星号数是 1 + 2 + … + n，而不是 n × n。' }, demo: 'loops'
    },
    {
      id: 'l12', title: '跟踪与调试：看见程序的每一步', minutes: 15,
      lead: '不要靠“应该没问题”判断代码。把变量随时间变化的过程摆出来，错误常常就在某一轮清楚地暴露。',
      objectives: ['制作循环跟踪表', '理解断点、单步和变量观察', '用边界输入验证循环正确性'],
      sections: [
        { title: '手动跟踪是最小的调试器', paragraphs: ['对短程序，在纸上列出 i、当前输入、sum 等变量。每执行一条赋值就更新相应格子；遇到条件就写出真假。不要一眼跳到最终答案，按计算机实际顺序走。这样能发现你对循环更新时机或分支路线的误解。', '跟踪表还应记录循环体执行之前与之后的差别。如果你想求最大值，每轮结束后 maxValue 应当等于“已经读过的那些数中的最大值”。这句话提供了每轮检查的标准，比盯着最后一个错误结果更有用。'] },
        { title: '调试器让运行停在现场', paragraphs: ['断点让程序执行到指定位置时暂停；单步让它继续执行一小步；变量观察展示暂停时的值。函数调用前的“步入”会进入函数，“步过”会执行调用但不进入其内部。调试器不是替你思考的工具，它只是把现场保留下来。', '一般需要在调试构建中保留调试信息：GCC/Clang 可用 -g -O0，Visual Studio 可选择 Debug 配置。设置断点前先确认你调试的是刚刚编译的程序。优化构建可能改变代码执行与显示之间的对应关系，初学时先使用调试配置。'] },
        { title: '设计会暴露错误的数据', paragraphs: ['求最大值时，只测试全是正数的数据，会隐藏“初始最大值设成 0”的错误。加入全是负数、只有一个数、最大值在第一项和最后一项的输入，就能检查初始化和更新。测试的价值来自它覆盖了哪条规则。', '发现失败后，把数据缩小到仍然能失败的最小情况，例如只保留 -8 和 -3。你就可以快速追踪每一行。修复后既重跑失败输入，也检查原本成功的输入，避免改动把另一条路线破坏。每次只改变一个明确原因，才知道修复为什么奏效。'] }
      ],
      example: { code: '#include <iostream>\n\nint main() {\n    int values[] = {-8, -3, -12};\n    int maxValue = values[0];\n    for (int i = 1; i < 3; ++i) {\n        if (values[i] > maxValue) {\n            maxValue = values[i];\n        }\n        std::cout << "i=" << i << ", max=" << maxValue << "\\n";\n    }\n    std::cout << "Answer: " << maxValue << "\\n";\n    return 0;\n}\n', output: 'i=1, max=-3\ni=2, max=-3\nAnswer: -3', explanation: ['这里用数组保存三个数；数组会在下一章详细讲，values[i] 暂时读作第 i 号元素，编号从零开始。', '用第一项初始化最大值，而不是随意设为 0，所以负数数据也能处理。', '调试输出告诉我们第一轮更新成 -3，第二轮保持不变，最后可以删掉这些跟踪行。'] },
      pitfall: '调试输出不会自动从最终程序消失。题目要求只输出答案时，保留 i=... 之类的文字会导致评测失败。',
      quiz: {"question":"求一组数的最大值，为什么把 maxValue 初始化为 0 可能出错？","options":["因为变量不能初始化为 0","因为 if 不支持负数","当全部数为负数时，0 不是输入中的最大值","因为循环最多运行一次"],"answer":2,"explanation":"正确初始候选应来自已有数据，或在明确限制下使用合适的边界，而不是未经论证地选 0。"},
      exercise: { title: '修复最小值搜索', prompt: '找出固定数据 7、12、4、9 的最小值。用第一项初始化候选，从第二项开始比较，输出 4。', hint: '最小值的更新条件应是 current < minimum。先手动列出每轮 minimum。', solution: '#include <iostream>\n\nint main() {\n    int values[] = {7, 12, 4, 9};\n    int minimum = values[0];\n    for (int i = 1; i < 4; ++i) {\n        if (values[i] < minimum) {\n            minimum = values[i];\n        }\n    }\n    std::cout << minimum << "\\n";\n    return 0;\n}\n', explanation: '候选最小值依次为 7、7、4、4。循环结束时，它已经包含所有元素的比较结果。' }
    }
  ] },
  { id: 'ch04', number: 4, title: '函数与递归', description: '把程序拆成可以解释、复用和验证的小任务，再理解调用如何层层展开。', lessons: [
    {
      id: 'l13', title: '函数：给一段任务起个名字', minutes: 14,
      lead: '函数把“怎样做”收进一个有名字的任务。调用者只要提供约定的数据，就能得到结果；这和把一道大题拆成几道小题很相似。',
      objectives: ['编写参数与返回值清楚的函数', '区分声明、定义和调用', '理解局部作用域与名字隐藏'],
      sections: [
        { title: '输入、处理、返回', paragraphs: ['<code>int square(int value)</code> 表示函数名为 square，接收一个 int 参数，返回 int。花括号内写实现，return 把结果交给调用者并立即结束本次调用。调用 square(5) 是一个表达式，其值就是函数返回的 25。', '参数是本次调用内部的局部变量。每次调用都按给定数据执行同一套规则，调用者可以把结果输出、保存或放进更大的表达式。没有返回结果的任务可以使用 void，但也需要清楚说明它会做什么，例如打印一行说明。'] },
        { title: '声明是约定，定义是实现', paragraphs: ['<code>int square(int value);</code> 是函数声明，末尾没有函数体。定义则包含具体的花括号代码。调用点之前必须有编译器能看到的合适声明；因此可以把声明放在 main 之前，把定义放在 main 之后。', '同一个函数可以有一致的声明，但程序必须遵守定义规则，不能到处复制普通函数定义。在多文件项目中，声明通常放头文件，定义放 .cpp 文件。函数签名中的参数类型与返回类型一起表达接口；仅仅名字相同不意味着接口匹配。'] },
        { title: '名字能在哪里使用', paragraphs: ['函数内部定义的变量只在相应作用域内可用，不能从 main 直接使用 square 里的 value。花括号也可以建立更小的作用域。内层定义同名变量会隐藏外层名字，虽然可能合法，却会增加阅读负担，初学时尽量避免。', '命名空间还可以组织属于某个模块的函数，例如 namespace geometry 中的 area 通过 geometry::area 调用。这与局部作用域不是同一回事：前者组织名字，后者限制局部名字能被使用的位置。一个小函数最好只负责一个能用一句话说明的任务。'] }
      ],
      example: { code: '#include <iostream>\n\nint square(int value);\n\nint main() {\n    int side = 5;\n    int area = square(side);\n    std::cout << area << "\\n";\n    return 0;\n}\n\nint square(int value) {\n    return value * value;\n}\n', output: '25', explanation: ['main 前的声明让编译器提前知道 square 的参数和返回类型。', '调用时 side 的值 5 传给 value，函数计算乘积并返回。', 'area 接收到返回值。这里约定参数很小，乘法不会超出 int 范围。'] },
      pitfall: '声明末尾的分号不能代替函数定义。仅写声明而调用函数，若没有提供定义，通常会在链接阶段失败。',
      quiz: {"question":"int twice(int x); 这一行单独完成了什么？","options":["执行一次 twice","声明一个接收 int、返回 int 的函数","已经提供了函数体","输出 x 的两倍"],"answer":1,"explanation":"没有花括号函数体，它只说明接口，尚未提供实现，也没有发生调用。"},
      exercise: { title: '封装绝对值', prompt: '编写 int absolute(int value)，把 -100 到 100 之间的整数变成非负绝对值。在 main 中读入该范围的数并输出函数结果。', hint: '负数返回 -value，其余数返回 value。限制输入范围是为了避开最小整数无法取正的边界。', solution: '#include <iostream>\n\nint absolute(int value) {\n    if (value < 0) {\n        return -value;\n    }\n    return value;\n}\n\nint main() {\n    int value = 0;\n    if (!(std::cin >> value) || value < -100 || value > 100) {\n        return 1;\n    }\n    std::cout << absolute(value) << "\\n";\n    return 0;\n}\n', explanation: '函数只负责把合法输入转成绝对值，main 负责读入和范围检查。输入 -7 输出 7，输入 0 输出 0。' }
    },
    {
      id: 'l14', title: '值传递与引用传递', minutes: 15,
      lead: '把数字抄给别人，与把同一本笔记交给别人修改，效果不同。函数参数的传递方式决定了修改会落在哪个对象上。',
      objectives: ['预测值参数对原变量的影响', '用引用参数明确修改调用者对象', '用 const 引用表达只读访问'],
      sections: [
        { title: '值参数拥有自己的值', paragraphs: ['函数写成 <code>void addOne(int value)</code> 时，int 参数按值传递。调用 addOne(number) 会用 number 的值初始化参数；修改 value 不会改动 number。可以把它理解为抄了一份数字，但不能把所有复杂类型的复制成本都当作和整数一样小。', '如果要得到修改后的结果，常见办法是直接返回新值：number = next(number)。这样数据流清楚，调用者也能决定是否保存返回结果。不是每个任务都需要把原变量交给函数改，能用返回值表达的计算通常更容易推理。'] },
        { title: '引用参数指向同一个对象', paragraphs: ['<code>void addOne(int& value)</code> 中的 & 声明一个引用参数。调用时 value 成为调用者对象的别名，因此 ++value 改的就是那个对象。引用不是另一个独立的整数，也不需要像指针一样在每次使用时解引用。', '交换两个数就是引用参数的典型例子。要先暂存第一份旧值，否则 a = b; b = a; 会把原来的 a 丢掉。标准库已经提供 std::swap，自己实现一次是为了理解参数和赋值顺序，实际项目里应优先使用现成工具。'] },
        { title: '只读引用把限制写进接口', paragraphs: ['<code>const T&</code> 表示通过此引用只读访问对象，常用于避免复制较大的字符串或容器。const 约束的是这条访问路径，不等于对象在任何地方都不会改变。对于很小的 int，直接按值传递通常已经合适，不必机械地给所有参数加引用。', '接口需要清楚表达修改。看到 int& 参数，调用者就应预料原值可能变化；看到 const 引用，则知道函数不会通过它进行普通修改。后面学习对象生命周期时，还会认识引用不能长期指向已经消失的对象。'] }
      ],
      example: { code: '#include <iostream>\n\nvoid changeCopy(int value) {\n    value = 99;\n    std::cout << "copy: " << value << "\\n";\n}\n\nvoid changeOriginal(int& value) {\n    value = 99;\n}\n\nint main() {\n    int number = 10;\n    changeCopy(number);\n    std::cout << "after copy: " << number << "\\n";\n    changeOriginal(number);\n    std::cout << "after reference: " << number << "\\n";\n    return 0;\n}\n', output: 'copy: 99\nafter copy: 10\nafter reference: 99', explanation: ['changeCopy 改的是独立参数，所以 main 中的 number 仍为 10。', 'changeOriginal 的引用参数与 number 是同一个对象的两种名字。', '控制原变量是否变化的是参数类型，不是函数名里有没有 change。'] },
      pitfall: '不要为了让任何函数都“能改数据”而全部使用引用参数。意外修改原值会让数据流难以追踪；计算结果优先考虑返回值。',
      quiz: {"question":"void f(int x) { x = 8; } 调用前 a = 3，执行 f(a) 后 a 是多少？","options":["3","8","0","无法确定，因为任何函数都会修改外部变量"],"answer":0,"explanation":"int x 是值参数，其修改不影响用于初始化它的 a。"},
      exercise: { title: '交换两个数', prompt: '实现 void exchange(int& a, int& b)，读入两个整数，交换后输出。输入 3 9 时输出 9 3。', hint: '用 temporary 保存 a 的旧值，再给 a 赋 b，最后给 b 赋 temporary。', solution: '#include <iostream>\n\nvoid exchange(int& a, int& b) {\n    int temporary = a;\n    a = b;\n    b = temporary;\n}\n\nint main() {\n    int a = 0, b = 0;\n    if (!(std::cin >> a >> b)) {\n        return 1;\n    }\n    exchange(a, b);\n    std::cout << a << " " << b << "\\n";\n    return 0;\n}\n', explanation: '临时变量保留被覆盖前的值，引用让函数里两次赋值作用于 main 的变量。即使 a、b 初值相等也能正确完成。' }
    },
    {
      id: 'l15', title: '递归与调用栈：先把问题缩小', minutes: 17,
      lead: '递归不是神秘的自我重复。它是一份约定：我先解决一个更小的问题，等结果回来，再完成这一层的工作。',
      objectives: ['找出递归的基本情况与规模缩小规则', '跟踪每次调用独立的参数', '区分递归深度与总工作量'],
      sections: [
        { title: '两条规则缺一不可', paragraphs: ['阶乘满足 n! = n × (n - 1)!，同时 0! = 1。前一句把任务交给更小的问题，后一句提供无需继续调用的基本情况。程序必须能到达基本情况，否则会不断调用并最终耗尽资源，不能指望计算机会“自动想明白”。', '递归函数的入口也要限定输入。这里只接受 0 到 12 的 n，并使用 long long 保存结果。负数不会按照 n - 1 的路线走到 0，因此先挡住它；大阶乘增长极快，选更大的类型也不可能让有限整数表示所有阶乘。'] },
        { title: '每层调用都有自己的现场', paragraphs: ['factorial(3) 会等待 factorial(2)，后者等待 factorial(1)，再等待 factorial(0)。每次调用的 n 是独立参数，返回时才逐层完成乘法。可以画四张小卡片，每张记录本层参数和还没有完成的运算。', '调用栈记录这些等待返回的调用现场。常见实现会为每次调用保存参数、局部状态与返回位置；但具体存储布局并非语言要求。在理解算法时，重点是每层状态相互独立、返回顺序与进入顺序相反。'] },
        { title: '递归不是总比循环更快', paragraphs: ['阶乘的递归与循环都要做约 n 次乘法；递归还需要约 n 层调用空间，循环通常只需几个变量。对于很深的线性递归，循环往往更合适。树形结构、分治和回溯则常能由递归自然表达，后面课程会继续展开。', '计算 Fibonacci 时，朴素递归会反复求同一个子问题，工作量迅速增长。递归深度只有 n，并不意味着总工作量只有 n。判断效率要数整个调用树，而不只看最深的一条路径；必要时缓存结果，或改为递推。'] }
      ],
      example: { code: '#include <iostream>\n\nlong long factorial(int n) {\n    if (n == 0) {\n        return 1;\n    }\n    return n * factorial(n - 1);\n}\n\nint main() {\n    int n = 3;\n    std::cout << factorial(n) << "\\n";\n    return 0;\n}\n', output: '6', explanation: ['进入时依次调用 3、2、1、0；n 为 0 时直接返回 1。', '回来的顺序是 1 × 1、2 × 1、3 × 2，最终得到 6。', '返回类型为 long long，递归返回值也参与乘法；本节只使用已明确安全的 n 范围。'] },
      pitfall: '基本情况写出来还不够，参数变化必须能到达它。若每次递归写 n + 1，而基本情况仍是 n == 0，正数输入会越走越远。',
      quiz: {"question":"调用 factorial(3) 时，最先真正完成并返回的是哪次调用？","options":["factorial(3)","factorial(2)","factorial(1)","factorial(0)"],"answer":3,"explanation":"外层都在等待内层，直到基本情况不再递归，返回才开始逐层展开。"},
      exercise: { title: '递归求前 n 项和', prompt: '实现 long long sumTo(int n)，返回 1 + 2 + … + n。接受 0 到 100 的输入，sumTo(0) 返回 0。', hint: '基本情况为 n == 0，其余情况返回 n + sumTo(n - 1)。', solution: '#include <iostream>\n\nlong long sumTo(int n) {\n    if (n == 0) {\n        return 0;\n    }\n    return n + sumTo(n - 1);\n}\n\nint main() {\n    int n = 0;\n    if (!(std::cin >> n) || n < 0 || n > 100) {\n        return 1;\n    }\n    std::cout << sumTo(n) << "\\n";\n    return 0;\n}\n', explanation: '每次把 n 减一，保证会到达 0。n = 4 时返回过程是 0 → 1 → 3 → 6 → 10；这里刻意限制递归深度。' }, demo: 'recursion'
    },
    {
      id: 'l16', title: '二分查找：每次排除一半', minutes: 18,
      lead: '在字典里查词不会从第一页逐页读。二分查找也利用顺序信息，每次检查中间位置，把不可能包含目标的部分排除。',
      objectives: ['说明二分查找需要有序数据', '维护左闭右开区间与中点', '比较 O(n) 与 O(log n) 的增长'],
      sections: [
        { title: '顺序让排除有依据', paragraphs: ['数据必须按与比较规则一致的顺序排列。如果中间元素小于 target，那么它左边的元素也不大于它，因而可以全部排除。无序数据没有这个保证，随便二分可能丢掉正确答案。本节先用已排好序的数组，下一章专门学习数组。', '目标不一定存在。我们采用“找第一个不小于 target 的位置”的版本：结束后还要检查该位置是否在范围内、值是否等于 target。这样同一个过程也能给出插入位置，重复值则会定位到最左侧符合条件的位置。'] },
        { title: '只维护一种区间约定', paragraphs: ['候选区间写作 [left, right)，包括 left，不包括 right。最初 left = 0，right = n；为空的条件是 left == right。中点写 <code>left + (right - left) / 2</code>，避免直接相加在巨大索引时发生溢出。', '若中点值小于 target，设 left = middle + 1，排除中点及左侧；否则设 right = middle，保留中点作为潜在答案。每轮都让候选区间缩短。不要把这套右开规则与 right = middle - 1 的闭区间版本混用，否则容易遗漏位置。'] },
        { title: '复杂度说的是增长方式', paragraphs: ['逐个查找最多比较 n 次，工作量随 n 线性增长，记作 O(n)。二分每次减半，最多需要约 log2(n) 次缩小，记作 O(log n)。一百万个元素只需要约二十次，而不是一百万次；这来自算法结构，不是编译器突然更快了。', '大 O 描述规模增长时的上界趋势，通常忽略固定常数，不是精确秒数。先排序也有成本：若只查一次，排序加二分不一定比直接扫描划算。多次查询且数据保持有序时，二分的优势会明显；真实选择需要看整个任务。'] }
      ],
      example: { code: '#include <iostream>\n\nint main() {\n    int values[] = {2, 4, 4, 7, 11, 15};\n    const int n = 6;\n    int target = 4;\n    int left = 0;\n    int right = n;\n    while (left < right) {\n        int middle = left + (right - left) / 2;\n        if (values[middle] < target) {\n            left = middle + 1;\n        } else {\n            right = middle;\n        }\n    }\n    if (left < n && values[left] == target) {\n        std::cout << "index: " << left << "\\n";\n    } else {\n        std::cout << "Not found\\n";\n    }\n    return 0;\n}\n', output: 'index: 1', explanation: ['索引从 0 开始，因此第一个 4 位于索引 1。', '出现相等时继续向左缩小，所以不会随意停在后一个 4。', '最后先检查 left < n，再读 values[left]；短路判断防止越界。'] },
      pitfall: '二分查找不是“只要代码有 middle 就行”。必须明确候选区间、更新后还保留哪些位置，以及区间为什么每轮变短。',
      quiz: {"question":"这一版中 values[middle] < target 时，应怎样更新？","options":["right = middle - 1","left = middle","left = middle + 1","right = middle + 1"],"answer":2,"explanation":"中点及其左边已经确定小于目标，不可能成为第一个不小于目标的位置，所以全部排除。"},
      exercise: { title: '查找缺席的数字', prompt: '在有序数据 1、3、5、8、12 中查找读入的 target。存在时输出从零开始的最左索引，不存在输出 -1。', hint: '先用 [0, 5) 求第一个不小于目标的位置，再检查它是否等于目标。', solution: '#include <iostream>\n\nint main() {\n    int values[] = {1, 3, 5, 8, 12};\n    int target = 0;\n    if (!(std::cin >> target)) {\n        return 1;\n    }\n    int left = 0, right = 5;\n    while (left < right) {\n        int middle = left + (right - left) / 2;\n        if (values[middle] < target) {\n            left = middle + 1;\n        } else {\n            right = middle;\n        }\n    }\n    if (left < 5 && values[left] == target) {\n        std::cout << left << "\\n";\n    } else {\n        std::cout << -1 << "\\n";\n    }\n    return 0;\n}\n', explanation: '输入 8 输出 3；输入 6 会得到候选位置 3，但该值是 8，因而输出 -1；输入 20 时 left = 5，不读取越界元素。' }, demo: 'binary'
    }
  ] },
  { id: 'ch05', number: 5, title: '数组、字符串与 vector', description: '从一个值走向一组数据，掌握索引、遍历、文本处理和二维结构。', lessons: [
    {
      id: 'l17', title: '数组与索引：一排有编号的元素', minutes: 14,
      lead: '班级有三十名同学，不必建立三十个不同名字的变量。数组把同类型的数据排成一组，再用索引选择其中一个。',
      objectives: ['使用从零开始的索引', '建立遍历与长度之间的关系', '使用 std::array 和安全访问'],
      sections: [
        { title: '长度是数量，索引是位置', paragraphs: ['<code>int scores[4] = {80, 91, 75, 88};</code> 建立四个整数元素。它们的有效索引是 0、1、2、3，而不是 1 到 4。scores[0] 是第一项，scores[3] 是最后一项。长度 n 的最后索引是 n - 1，但空容器没有最后一项。', '数组的元素连续存储，索引告诉程序偏移到哪里。可以把它想成一排座位，但语言不会像管理员一样自动阻止你走出座位区。原生数组的下标访问不做越界检查，访问 scores[4] 已经越过范围，属于未定义行为。'] },
        { title: '遍历要与有效范围一致', paragraphs: ['遍历常写 <code>for (int i = 0; i < n; ++i)</code>，从第零项开始，到 n 之前停止。要处理每个值而不需要索引时，可以使用范围 for：<code>for (int score : scores)</code>。它直接提供每个元素的值，减少手工维护边界的机会。', '只写 int values[4]; 并不会自动把局部原生数组清零。写 int values[4]{}; 才让整数元素全部初始化为零。原生数组传给函数时常退化为指针，函数不能仅凭那个参数自动知道数组长度，因此还需显式传入长度或选用更合适的容器。'] },
        { title: '固定长度优先认识 std::array', paragraphs: ['<code>std::array&lt;int, 4&gt;</code> 也固定保存四个整数，却把长度纳入类型，并提供 size()、at() 和迭代器。使用 at(i) 时，索引不合法会抛出异常，而不是直接产生越界访问；方括号版本仍要求你自己保证范围。', '容器的 size() 常返回无符号类型。不要写 i >= 0 的无符号倒序循环，因为减到零再减一会绕到很大的值。可以让 i 从 size() 开始，在 i > 0 时访问 i - 1。安全不是来自某个容器名字，而是来自正确的范围约定。'] }
      ],
      example: { code: '#include <array>\n#include <iostream>\n\nint main() {\n    std::array<int, 4> scores{80, 91, 75, 88};\n    int sum = 0;\n    for (int score : scores) {\n        sum += score;\n    }\n    std::cout << "first: " << scores.at(0) << "\\n";\n    std::cout << "last: " << scores.at(scores.size() - 1) << "\\n";\n    std::cout << "sum: " << sum << "\\n";\n    return 0;\n}\n', output: 'first: 80\nlast: 88\nsum: 334', explanation: ['此数组长度固定为四，所以 size() - 1 合法且等于 3。', '范围 for 逐个复制整数元素到 score，累加后得到 334。', 'at() 提供运行时范围检查，但正确程序仍应提前知道要访问什么位置。'] },
      pitfall: '长度为 n 不代表索引 n 合法。所有下标都要满足 0 <= index < n；空容器时不能计算并访问所谓“最后一项”。',
      quiz: {"question":"std::array<int, 5> 的有效索引范围是什么？","options":["1 到 5","0 到 4","0 到 5","任意整数"],"answer":1,"explanation":"五个元素对应五个位置，从零开始的编号是 0、1、2、3、4。"},
      exercise: { title: '逆序输出', prompt: '把固定数组 2、4、6、8、10 逆序输出成 10 8 6 4 2。使用 std::array 和循环，不要直接把答案写在字符串里。', hint: '让 i 从 size() 开始，只在 i > 0 时访问 i - 1，再递减。', solution: '#include <array>\n#include <cstddef>\n#include <iostream>\n\nint main() {\n    std::array<int, 5> values{2, 4, 6, 8, 10};\n    for (std::size_t i = values.size(); i > 0; --i) {\n        std::cout << values[i - 1];\n        if (i > 1) {\n            std::cout << " ";\n        }\n    }\n    std::cout << "\\n";\n    return 0;\n}\n', explanation: '第一次访问索引 4，最后访问索引 0。循环在 i 为零时退出，没有让无符号 i 在零之后继续递减。' }
    },
    {
      id: 'l18', title: 'string：从一个字符到一整行文字', minutes: 15,
      lead: '人读的是词语和句子，程序首先面对的却是一串编码单元。学会读整行、拼接和查找，才能让文本处理真正有用。',
      objectives: ['区分字符、字符串与字符串长度', '使用 getline 读取含空格文本', '完成查找、拼接与安全索引'],
      sections: [
        { title: 'string 管理一串字符', paragraphs: ['<code>std::string name = "Ada";</code> 保存三个 char 编码单元，name.size() 为 3。可以用 + 拼接字符串，也可以用 += 追加。单引号的 \'A\' 是字符，双引号的 "A" 是字符串字面量，二者类型和可参与的运算并不完全相同。', 'string 自动管理自身存储空间，不必为每次追加手工申请内存。索引仍从零开始，name[0] 为 A。初学时只在 index < size() 的范围内访问文本元素，不把字符串结束位置当作普通字符位置。at() 同样提供范围检查。'] },
        { title: '单词读取与整行读取', paragraphs: ['<code>std::cin &gt;&gt; text</code> 默认读到空白就停，因此 New York 只会先读入 New。<code>std::getline(std::cin, text)</code> 读取一整行，保存空格，但不把行末分隔用的换行符放进字符串；空行可以成功读成空字符串。', '如果先用 >> 读数字，再立即 getline，留在输入流里的换行可能让 getline 得到空行。可以在切换前用 ignore 丢弃这一行剩余内容。不要无条件使用 std::ws 解决所有情况，因为它也会跳过前导空白和空行，这可能改变本来要保留的文本。'] },
        { title: '查找结果与文本编码', paragraphs: ['<code>text.find("C++")</code> 返回第一次出现的位置；找不到时返回 std::string::npos。应先检查是否等于 npos，再把位置用于处理。substr(pos, count) 可以截取子串，但起始位置也必须符合接口要求，不能把“没找到”当作普通索引。', 'string 的 size() 数的是 char 单元，UTF-8 文本里常相当于字节数，不是人眼看到的汉字数。逐个 char 反转中文可能破坏编码。当前练习限定 ASCII 文本；处理中文字符、组合符号和用户感知字符时，需要专门的 Unicode 工具与规则。'] }
      ],
      example: { code: '#include <iostream>\n#include <string>\n\nint main() {\n    std::string line;\n    if (!std::getline(std::cin, line)) {\n        return 1;\n    }\n    std::string message = "You wrote: " + line;\n    std::cout << message << "\\n";\n    std::cout << "bytes: " << line.size() << "\\n";\n    if (line.find("C++") != std::string::npos) {\n        std::cout << "Found C++\\n";\n    }\n    return 0;\n}\n', output: '输入：I like C++\n输出：You wrote: I like C++\nbytes: 10\nFound C++', explanation: ['getline 保存输入中的两个空格，所以整句不会被切成单词。', '本例全部是 ASCII，十个字符对应十个 char 编码单元。', '查找命中后输出提示；空行也可以被读取，长度会是零。'] },
      pitfall: 'string::npos 不是“最后一个字符的位置”，而是没有找到的标志。检查它之后再做索引或截取。',
      quiz: {"question":"输入 New York，使用 cin >> city 后 city 通常保存什么？","options":["New","New York","York","空字符串"],"answer":0,"explanation":"格式化的 string 提取以空白分隔，想保留空格应使用 getline。"},
      exercise: { title: '数一数元音', prompt: '读取一行 ASCII 英文文本，统计其中小写 a、e、i、o、u 的个数并输出。大写字母不计入。', hint: '用范围 for 获取每个 char，使用 || 连接五种匹配条件。', solution: '#include <iostream>\n#include <string>\n\nint main() {\n    std::string text;\n    if (!std::getline(std::cin, text)) {\n        return 1;\n    }\n    std::size_t count = 0;\n    for (char ch : text) {\n        if (ch == \'a\' || ch == \'e\' || ch == \'i\' || ch == \'o\' || ch == \'u\') {\n            ++count;\n        }\n    }\n    std::cout << count << "\\n";\n    return 0;\n}\n', explanation: '输入 hello world 输出 3。范围 for 自动走过全部编码单元，空格和其他字符不会改变计数。' }
    },
    {
      id: 'l19', title: 'vector：长度可以变化的数据列', minutes: 16,
      lead: '数组适合长度早已确定的数据；如果今天录入五条、明天录入八条，vector 可以随着元素数量变化管理连续存储。',
      objectives: ['使用 push_back、size 和遍历', '分清 size 与 capacity', '理解扩容和删除引起的迭代器失效'],
      sections: [
        { title: '元素数量由数据决定', paragraphs: ['<code>std::vector&lt;int&gt; values;</code> 建立一个空容器，size() 为零。push_back(x) 在末尾新增一个元素，pop_back() 删除最后一个元素，后者要求容器非空。vector 不只是一个“无限数组”，它仍受内存与容量上限约束。', '<code>std::vector&lt;int&gt; values(3, 7);</code> 建立三个 7，而 <code>std::vector&lt;int&gt; values{3, 7};</code> 建立两个元素 3 和 7。圆括号与花括号可能选择不同构造方式，要根据想表达的内容来写，不能只看起来顺眼就互换。'] },
        { title: 'size 与 capacity 回答不同问题', paragraphs: ['size() 是已经存在的元素数，capacity() 是现有存储空间最多能容纳多少元素而不用重新分配。reserve(100) 预留容量，但不会建立一百个元素，size 仍可能是零；resize(100) 才会把元素数量改到一百，并按规则初始化新增元素。', 'vector 需要连续存储，空间不够时可能申请更大的区域并搬移元素。因此单次 push_back 可能较贵，但一系列追加通常具有摊还常数复杂度。摊还说的是把总成本分到多次操作，不保证每一次追加耗时完全一样。'] },
        { title: '旧位置可能不再有效', paragraphs: ['扩容导致重新分配时，指向旧元素的指针、引用和迭代器都会失效。没有重新分配的末尾追加通常保留已有元素的位置，但旧 end() 仍失效。erase 删除后，删除位置及其后的迭代器和引用也会失效，不能继续把它们当原来的位置使用。', '不要在范围 for 遍历 vector 的同时对它随意 push_back 或 erase：循环依赖的迭代器可能被破坏。先收集要追加的数据，再在遍历结束后修改，是初学时清楚的做法。需要原地删除时，应使用返回新位置的接口和专门设计的循环。'] }
      ],
      example: { code: '#include <iostream>\n#include <vector>\n\nint main() {\n    std::vector<int> values;\n    values.reserve(4);\n    std::cout << "before: " << values.size() << "\\n";\n    values.push_back(5);\n    values.push_back(8);\n    values.push_back(13);\n    for (int value : values) {\n        std::cout << value << " ";\n    }\n    std::cout << "\\nsize: " << values.size() << "\\n";\n    return 0;\n}\n', output: 'before: 0\n5 8 13\nsize: 3', explanation: ['reserve 只准备容量，所以第一行仍是 0。', '三次 push_back 创建三个实际元素，遍历时只会访问这三个。', '没有打印 capacity 的确切值，因为实现可以预留比请求值更多的容量。'] },
      pitfall: 'reserve(10) 后直接访问 values[0]，若 size() 仍为零就是越界。预留存储空间与建立元素是两件事。',
      quiz: {"question":"空 vector 执行 reserve(20) 后，size() 是多少？","options":["20","19","由随机数决定","0"],"answer":3,"explanation":"reserve 不改变元素数量，只确保容量至少满足请求。"},
      exercise: { title: '保留非负数', prompt: '读入 n（0 到 100），再读入 n 个 -1000 到 1000 的整数。把所有非负数依次放入 vector，并用空格分隔输出；没有元素时输出一个空行。', hint: '先验证 n，再循环读取。符合条件时 push_back，最后用索引输出以便控制空格。', solution: '#include <iostream>\n#include <vector>\n\nint main() {\n    int n = 0;\n    if (!(std::cin >> n) || n < 0 || n > 100) {\n        return 1;\n    }\n    std::vector<int> kept;\n    for (int i = 0; i < n; ++i) {\n        int value = 0;\n        if (!(std::cin >> value) || value < -1000 || value > 1000) {\n            return 1;\n        }\n        if (value >= 0) {\n            kept.push_back(value);\n        }\n    }\n    for (std::size_t i = 0; i < kept.size(); ++i) {\n        if (i != 0) {\n            std::cout << " ";\n        }\n        std::cout << kept[i];\n    }\n    std::cout << "\\n";\n    return 0;\n}\n', explanation: '输入 5 和 -2 0 7 -1 3，输出 0 7 3。容器只保存符合条件的数据，遍历结束后再输出，不会在遍历时改变同一个容器。' }
    },
    {
      id: 'l20', title: '二维网格：把行列坐标写进程序', minutes: 16,
      lead: '棋盘、座位表、像素图和矩阵都有行列结构。二维数据不是新的魔法，只是“一行数据”之外又套了一层。',
      objectives: ['把 row、col 与二维索引对应起来', '用嵌套循环遍历网格', '检查边界并累加行或列'],
      sections: [
        { title: '第一个索引选行，第二个选列', paragraphs: ['<code>grid[row][col]</code> 先取第 row 行，再取这一行第 col 个元素。固定二维原生数组可以写 int grid[2][3]，表示两行三列；有效 row 为 0、1，有效 col 为 0、1、2，总元素数为 2 × 3。', '用 <code>std::vector&lt;std::vector&lt;int&gt;&gt;</code> 可以在运行时决定行列数。外层 vector 的每个元素是一行，内层 vector 保存这行的数据。它可以表达不等长的行，所以不能凭外层长度就假定所有行长度相同。'] },
        { title: '循环结构对应数据结构', paragraphs: ['遍历矩形网格时，外层循环控制 row，内层控制 col。处理完一行后再换行，就能把结构显示出来。求总和只需要一个累加器；求每行和则应在每次外层进入时把 rowSum 重新初始化为零。', '矩阵运算中的“列和”可以保持 col 不变而改变 row。不要因为 row、col 都是整数就随意互换；两行三列的网格一旦写成 grid[col][row]，原本合法的列索引可能超过行数。给变量起明确名字能减少这样的错误。'] },
        { title: '邻居需要同时检查两个边界', paragraphs: ['在网格算法中，上下左右邻居常写成 row - 1、row + 1、col - 1、col + 1。访问前必须确认新坐标同时满足行、列范围。若索引用无符号类型，零减一会绕到很大值；计算可能为负的邻居时，用适合范围的有符号索引更容易表达检查。', '所有网格输入都应先限制尺寸，避免创建不合理的大容器。vector 的二维版本不保证整个矩阵只有一块连续内存；每行各自管理存储。需要连续矩阵时，可以用一维 vector，并按 row * cols + col 映射，之后还需检查乘法与索引范围。'] }
      ],
      example: { code: '#include <iostream>\n#include <vector>\n\nint main() {\n    std::vector<std::vector<int>> grid{{1, 2, 3}, {4, 5, 6}};\n    int total = 0;\n    for (const auto& row : grid) {\n        int rowSum = 0;\n        for (int value : row) {\n            rowSum += value;\n        }\n        total += rowSum;\n        std::cout << "row sum: " << rowSum << "\\n";\n    }\n    std::cout << "total: " << total << "\\n";\n    return 0;\n}\n', output: 'row sum: 6\nrow sum: 15\ntotal: 21', explanation: ['外层 const auto& 只读引用当前行，避免复制整行。', 'rowSum 每进入新一行都从零开始，total 则延续累积结果。', '遍历使用各行自己的元素，因此即使以后行长不同，这种求和方式也仍能工作。'] },
      pitfall: '总和初始化在两层循环之外；每行和初始化在外层内部、内层之前。初始化位置错了，累加器保存的时间范围也会错。',
      quiz: {"question":"grid 有 3 行 4 列，grid[2][3] 表示哪个位置？","options":["第 2 行第 3 列","第 4 行第 3 列","第 3 行第 4 列","必定越界"],"answer":2,"explanation":"两个索引都从零开始，所以 row = 2 是第三行，col = 3 是第四列。"},
      exercise: { title: '计算主对角线', prompt: '建立 3 × 3 网格 {{1,2,3},{4,5,6},{7,8,9}}，输出左上到右下主对角线的和。', hint: '主对角线满足 row == col，可直接累加 grid[i][i]。', solution: '#include <array>\n#include <cstddef>\n#include <iostream>\n\nint main() {\n    std::array<std::array<int, 3>, 3> grid{{\n        {{1, 2, 3}},\n        {{4, 5, 6}},\n        {{7, 8, 9}}\n    }};\n    int sum = 0;\n    for (std::size_t i = 0; i < grid.size(); ++i) {\n        sum += grid[i][i];\n    }\n    std::cout << sum << "\\n";\n    return 0;\n}\n', explanation: '三个被选中的值是 1、5、9，和为 15。这里只有一个循环，因为每个行号只对应一个主对角线列号。' }
    }
  ] },
  { id: 'ch06', number: 6, title: '引用、指针与内存', description: '辨认值、对象与地址，建立生命周期和资源所有权的正确习惯。', lessons: [
    {
      id: 'l21', title: '引用：同一个对象的另一个名字', minutes: 14,
      lead: '引用让两种名字指向同一个对象。它不是把数值复制一份，也不是可以随意换目标的遥控器。',
      objectives: ['建立引用并预测别名修改', '区分重新赋值与重新绑定', '理解 const 引用与生命周期限制'],
      sections: [
        { title: '绑定在初始化时完成', paragraphs: ['<code>int score = 80; int& alias = score;</code> 让 alias 成为 score 的别名。读取 alias 就是读取 score，修改 alias 就是修改 score。这里的 & 出现在声明里表示引用类型；它与之后学习的“取地址运算符”使用同一符号但含义不同。', '普通引用必须在建立时绑定对象，不能先声明一个空引用再补上目标。引用表达“这里一定有一个对象可供使用”的接口意图；但程序仍需保证对象存在，类型写了引用并不能替你防止悬空。'] },
        { title: '赋值不改变引用的目标', paragraphs: ['如果另有 int other = 95，执行 alias = other 会把 other 的值 95 赋给 score，并不是让 alias 改绑到 other。之后改动 other，score 与 alias 不会自动跟着改变。引用初始化与普通赋值是不同阶段的动作。', '对 range for 使用 <code>int value</code> 得到每项的副本，修改它不会改变容器；使用 <code>int& value</code> 才能修改元素。只读遍历较大对象时常用 const auto&，避免复制并防止通过这条路径修改对象。选择哪种形式要符合任务。'] },
        { title: 'const 限制访问，不冻结世界', paragraphs: ['<code>const int& view = score;</code> 允许读 score，却不能通过 view 普通赋值。score 自己仍可被修改，因此 view 读到的值也会变化。不要把 const 引用理解成“永远保存绑定时的一份快照”；需要快照时应复制值。', '局部 const 引用在直接绑定某些临时对象时可以延长该临时对象的生命周期，但规则有边界，不能推广成“所有引用都能让对象活着”。尤其不要返回指向函数局部对象的引用；函数结束后那个对象已经不存在。下一节用地址把这个问题看得更清楚。'] }
      ],
      example: { code: '#include <iostream>\n\nint main() {\n    int score = 80;\n    int& alias = score;\n    const int& view = score;\n    alias += 5;\n    std::cout << score << " " << view << "\\n";\n    int other = 95;\n    alias = other;\n    other = 100;\n    std::cout << score << " " << alias << " " << other << "\\n";\n    return 0;\n}\n', output: '85 85\n95 95 100', explanation: ['alias 修改与 score 修改作用于同一个对象，所以 view 也读到 85。', 'alias = other 复制 other 的数值到 score，并没有改变绑定关系。', 'other 后来改为 100，只影响 other，score 和 alias 仍表示 95。'] },
      pitfall: '引用的赋值是给所引用的对象赋值，不能把它当成“更换引用目标”。如果需要可更换的地址关系，要了解指针或其他句柄类型。',
      quiz: {"question":"int a = 1, b = 2; int& r = a; r = b; b = 9; 最后 a 是多少？","options":["9","2","1","无法编译"],"answer":1,"explanation":"r = b 把 2 保存到 a；r 仍绑定 a，所以 b 后来改为 9 不影响 a。"},
      exercise: { title: '把数据限制在范围内', prompt: '实现 void clampScore(int& score)，负数改为 0，大于 100 改为 100，其余保持原值。读入一个整数，调用后输出。', hint: '通过引用直接改变调用者对象，用 if / else if 表达上下界。', solution: '#include <iostream>\n\nvoid clampScore(int& score) {\n    if (score < 0) {\n        score = 0;\n    } else if (score > 100) {\n        score = 100;\n    }\n}\n\nint main() {\n    int score = 0;\n    if (!(std::cin >> score)) {\n        return 1;\n    }\n    clampScore(score);\n    std::cout << score << "\\n";\n    return 0;\n}\n', explanation: '输入 -5 输出 0，输入 120 输出 100，输入 72 输出 72。函数没有返回结果，而是明确通过 int& 修改调用者的对象。' }
    },
    {
      id: 'l22', title: '指针：地址、解引用与 nullptr', minutes: 17,
      lead: '地址像位置说明，值像该位置保存的内容。指针保存地址；读取指针与读取它指向的对象，是两个不同动作。',
      objectives: ['区分 & 取地址和 * 解引用', '初始化并检查空指针', '限定指针算术在有效数组范围'],
      sections: [
        { title: '指针对象与目标对象', paragraphs: ['<code>int* pointer = &score;</code> 建立一个保存 int 对象地址的指针。这里 &score 取得 score 的地址；<code>*pointer</code> 则访问地址指向的对象。pointer 的值是地址，*pointer 的值才是 score 里的整数。', '指针本身也是变量，可以后来改为 &other。这与引用不能重新绑定不同。通过 *pointer 赋值会改变当前目标对象，而给 pointer 赋另一个地址只会改变它保存的位置。不要把取地址的 &、声明引用的 &，以及按位与的 & 混为同一种操作。'] },
        { title: '空指针明确表示没有目标', paragraphs: ['<code>int* pointer = nullptr;</code> 让指针处于明确的空状态。只有确认指针指向仍然活着的合适对象之后，才能解引用。nullptr 不指向任何对象，绝不能执行 *pointer。未经初始化的局部指针同样不能使用；“看起来不像零”也不能证明地址有效。', 'if (pointer != nullptr) 可以挡住空指针，但挡不住悬空指针：已经消失的对象留下的旧地址也可能非空。指针的安全条件同时包括目标存在、类型和权限正确、索引范围合法。空检查只是其中一项。'] },
        { title: '指针算术不是任意移动', paragraphs: ['在同一个数组内部，pointer + 1 表示下一个元素，不是简单加一个字节。数组末尾之后的位置可以形成并用于某些比较或迭代结束判断，但不能解引用；指针运算不能任意跨到别的对象或越过许可范围。', 'const int* p 表示不能通过 p 修改目标整数，但 p 自己可以换地址；int* const p 表示 p 的地址不能换，但可通过它修改非 const 目标。把 const 读清楚比靠记忆符号形状可靠。现代 C++ 中，普通指针常用于不拥有对象的短期访问。'] }
      ],
      example: { code: '#include <iostream>\n\nint main() {\n    int score = 80;\n    int other = 60;\n    int* pointer = &score;\n    *pointer += 5;\n    std::cout << score << "\\n";\n    pointer = &other;\n    *pointer = 70;\n    std::cout << score << " " << other << "\\n";\n    pointer = nullptr;\n    if (pointer == nullptr) {\n        std::cout << "No target\\n";\n    }\n    return 0;\n}\n', output: '85\n85 70\nNo target', explanation: ['第一处解引用修改 score，把它从 80 改为 85。', '地址改为 &other 之后，第二处解引用只改变 other。', '变成 nullptr 后不再解引用，只判断空状态，因此不存在空指针访问。'] },
      pitfall: 'int* p, q; 只把 p 声明为指针，q 仍是 int。为减少误读，指针变量最好分别声明并立即初始化。',
      quiz: {"question":"int x = 4; int* p = &x; *p = 7; 最后 x 是多少？","options":["7","4","x 的地址","一定编译失败"],"answer":0,"explanation":"*p 访问 x 这个对象，因此赋值直接把 x 改为 7。"},
      exercise: { title: '可选目标的更新', prompt: '实现 void setIfPresent(int* target, int value)：target 非空时写入 value，为空时什么也不做。在 main 中将 x 从 3 改为 9，再调用一次空指针版本，最终输出 9。', hint: '先判断 target != nullptr，再使用 *target = value。', solution: '#include <iostream>\n\nvoid setIfPresent(int* target, int value) {\n    if (target != nullptr) {\n        *target = value;\n    }\n}\n\nint main() {\n    int x = 3;\n    setIfPresent(&x, 9);\n    setIfPresent(nullptr, 100);\n    std::cout << x << "\\n";\n    return 0;\n}\n', explanation: '指针接口允许明确表达“没有目标”。两次调用都满足接口前提：非空目标在调用期间仍然存在，空目标则不被解引用。' }, demo: 'pointers'
    },
    {
      id: 'l23', title: '生命周期：地址还在，对象未必还在', minutes: 17,
      lead: '你记得一间旧教室的门牌，不代表里面仍有原来的课桌。指针保存地址，不能自动延长目标对象的生命。',
      objectives: ['区分作用域、存储期和对象生命周期', '识别返回局部地址的悬空风险', '使用值返回或明确的借用关系'],
      sections: [
        { title: '对象什么时候建立、什么时候结束', paragraphs: ['函数中的普通局部对象通常在执行到定义时建立，离开相应块时生命周期结束。作用域决定名字能在哪里使用，生命周期决定对象什么时候存在；二者有关，却不能简单当成同一个概念。动态对象、静态对象和临时对象有各自规则。', '口头常说“局部变量在栈上”，这是常见实现的描述，不是所有对象布局的语言保证。写正确 C++ 代码应依据生命周期规则，而不是猜地址排列。离开块后旧指针可能仍保存同样的数值，但它已经不能用来访问原来的局部对象。'] },
        { title: '不要返回局部对象的地址', paragraphs: ['函数内部建立 int result，然后返回 &result，调用者拿到的地址在函数返回时已经悬空。返回对 result 的引用也有同样问题。错误不一定立刻崩溃，偶尔看到预期数值只是偶然，不能据此认为程序安全。我们不实际执行这种未定义行为。', '如果要交出计算结果，直接按值返回。返回 std::string 也可以安全转交内容，标准库和编译器能够利用移动与复制消除等机制；无需为了“节省一次复制”把局部字符串的引用返回。先选正确的所有权，再考虑有证据的优化。'] },
        { title: '借用必须短于目标寿命', paragraphs: ['函数可以返回指向调用者容器元素的指针，但调用者必须保证容器和那个元素仍存在。例如数组在 main 中建立，搜索函数返回其中一个元素地址，main 还未离开作用域时可以使用。这个返回值借用元素，并不拥有它。', '即使容器本身还活着，vector 扩容或删除也可能让元素地址失效。把 pointer = nullptr 只能清空一个指针，不能自动修复其他副本。清晰的接口应说明返回的是值、借用对象还是所有权；下一节用 RAII 把资源的结束条件交给对象管理。'] }
      ],
      example: { code: '#include <iostream>\n#include <string>\n\nstd::string makeGreeting(const std::string& name) {\n    std::string message = "Hello, " + name;\n    return message;\n}\n\nint main() {\n    std::string greeting = makeGreeting("Ada");\n    std::cout << greeting << "\\n";\n    int value = 7;\n    const int* borrowed = &value;\n    std::cout << *borrowed << "\\n";\n    return 0;\n}\n', output: 'Hello, Ada\n7', explanation: ['返回类型是 std::string，因此调用者获得自己的有效结果对象，而不是局部 message 的引用。', 'borrowed 只在 value 的生命周期内使用，value 此时仍然存在。', '程序没有访问任何已经离开作用域的局部对象。'] },
      pitfall: '非空指针不一定有效。局部对象已经结束、容器已扩容、资源已释放时，旧指针都可能保持非零而仍不能解引用。',
      quiz: {"question":"函数返回一个指向其普通局部 int 的地址，主要问题是什么？","options":["指针总是比 int 小","函数不能包含局部变量","return 只能返回零","函数结束后局部对象已销毁，地址悬空"],"answer":3,"explanation":"地址没有给对象续命，调用者若通过该地址访问已结束的对象，会产生未定义行为。"},
      exercise: { title: '返回一次安全的借用', prompt: '在 main 中建立 std::array<int, 4>{3, 7, 8, 9}。写函数接收该数组的引用，返回第一个偶数的 int*，没有偶数则返回 nullptr；main 检查后输出找到的值。', hint: '范围 for 使用 int&，匹配后返回 &value。返回的是 main 数组元素的地址，不是副本的地址。', solution: '#include <array>\n#include <iostream>\n\nint* firstEven(std::array<int, 4>& values) {\n    for (int& value : values) {\n        if (value % 2 == 0) {\n            return &value;\n        }\n    }\n    return nullptr;\n}\n\nint main() {\n    std::array<int, 4> values{3, 7, 8, 9};\n    int* result = firstEven(values);\n    if (result != nullptr) {\n        std::cout << *result << "\\n";\n    } else {\n        std::cout << "None\\n";\n    }\n    return 0;\n}\n', explanation: 'value 是对数组元素的引用，所以 &value 是元素地址。数组在 main 中仍然存活，输出 8；若改成按值遍历，返回局部副本地址就会出错。' }
    },
    {
      id: 'l24', title: 'RAII 与 unique_ptr：让所有权负责收尾', minutes: 18,
      lead: '资源管理最容易漏掉的是“最后谁来清理”。RAII 把资源和对象绑定起来：对象活着时负责资源，对象结束时自动收尾。',
      objectives: ['用所有权解释资源释放责任', '使用 make_unique 建立独占所有权', '理解移动转移与借用指针的区别'],
      sections: [
        { title: '资源有开始，也要有结束', paragraphs: ['资源不只有内存，还包括文件、锁和网络连接。手工打开、手工关闭时，每一条提前 return 或异常路线都要考虑收尾，容易遗漏。RAII 让对象的构造或建立获取资源，让析构负责释放；离开作用域时自动完成，减少路线上的负担。', 'std::string 和 vector 已经运用这一思想：它们管理自己的存储，普通使用者无需手工 delete。最简单的选择通常是直接建立局部对象，不是先给每个整数套一个智能指针。只有确实需要动态生命周期、可选所有权或转移所有权时，再选相应工具。'] },
        { title: 'unique_ptr 表示唯一负责者', paragraphs: ['<code>std::make_unique&lt;int&gt;(42)</code> 建立一个动态 int 对象，并返回拥有它的 unique_ptr。拥有者结束时，所管理对象会被释放。*owner 访问目标，owner.get() 获取不转移所有权的普通指针，owner.reset() 可以提前结束当前所有权。', 'unique_ptr 不能普通复制，因为复制会让“唯一负责者”变成两个。不要把 get() 返回的指针手工 delete，也不要用同一个普通地址建立两个独立的拥有者。这些行为会让所有权约定被破坏，可能出现重复释放或悬空访问。'] },
        { title: '移动转移责任，借用不转移', paragraphs: ['<code>auto second = std::move(first);</code> 转移 unique_ptr 的所有权。std::move 本身是允许移动的类型转换，具体转移由 unique_ptr 的移动操作完成。转移之后 first 为空，second 负责对象；不是把目标整数复制了一份。', '向函数只提供暂时访问时，传引用或借用指针即可；若函数要接管资源，则可以按值接收 unique_ptr，并由调用者显式移动。reset 或拥有者销毁后，旧 get() 指针都失效。智能指针负责释放资源，但不能让所有借用者自动知道资源已经结束。'] }
      ],
      example: { code: '#include <iostream>\n#include <memory>\n#include <utility>\n\nint main() {\n    auto first = std::make_unique<int>(42);\n    std::cout << *first << "\\n";\n    auto second = std::move(first);\n    std::cout << std::boolalpha << (first == nullptr) << "\\n";\n    *second += 8;\n    std::cout << *second << "\\n";\n    second.reset();\n    std::cout << (second == nullptr) << "\\n";\n    return 0;\n}\n', output: '42\ntrue\n50\ntrue', explanation: ['make_unique 建立整数对象并初始化为 42。', '移动以后 first 为空；目标仍然是同一个对象，second 成为拥有者。', 'reset 释放对象并清空 second，此后没有再解引用。正常离开作用域同样会自动收尾。'] },
      pitfall: 'unique_ptr::get() 给出的只是借用指针，不转移所有权。它不能被另一个拥有者独立接管，更不能在原拥有者释放后继续使用。',
      quiz: {"question":"auto b = std::move(a); 用于非空 unique_ptr 后，哪个说法正确？","options":["a 和 b 各自拥有一份复制对象","两个指针都立即失效","b 拥有原对象，a 变为空","对象必定泄漏"],"answer":2,"explanation":"unique_ptr 的移动操作转移独占所有权，不复制目标对象；原拥有者变为空。"},
      exercise: { title: '动态数组的自动收尾', prompt: '读入 n（1 到 20），使用 std::make_unique<int[]>(n) 建立动态数组，将元素依次设成 1 到 n，计算并输出总和。不要写 delete[]。实际保存一组整数时通常优先使用 vector，此题用于练习独占所有权。', hint: '数组形式的 unique_ptr 使用 owner[i] 访问；离开作用域时会正确释放整块数组。', solution: '#include <iostream>\n#include <memory>\n\nint main() {\n    int n = 0;\n    if (!(std::cin >> n) || n < 1 || n > 20) {\n        return 1;\n    }\n    auto values = std::make_unique<int[]>(n);\n    int sum = 0;\n    for (int i = 0; i < n; ++i) {\n        values[i] = i + 1;\n        sum += values[i];\n    }\n    std::cout << sum << "\\n";\n    return 0;\n}\n', explanation: '输入 5 时建立五个元素，保存 1、2、3、4、5，总和为 15。数组 unique_ptr 的析构会选择正确的数组释放方式，因此不需要手工清理。' }
    }
  ] }
];

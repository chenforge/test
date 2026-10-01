/* 大学阶段 C++ 课程。默认示例标准为 C++17。 */
window.CPP_UNIVERSITY = [
  {
    id: 'ch07', number: 7, title: '类与对象',
    description: '把散落的数据和规则装进可靠的小工具：从一张成绩卡，到会自己管理状态的对象。',
    lessons: [
      {
        id: 'l25', title: '给数据一个完整的家：struct 与 class', minutes: 15,
        lead: '姓名、成绩和“成绩不能超过 100”这条规则，应该放在一起。类就是表达这种关系的一种办法。',
        objectives: ['会定义结构体与类，并创建对象', '理解公开接口、私有数据与不变量', '会通过成员函数检查输入'],
        sections: [
          { title: '从三列散落的数据，到一张成绩卡', paragraphs: ['假设你同时管理十名同学。用一个姓名数组和一个成绩数组也能工作，但两组下标一旦错位，张明的成绩可能记到李华名下。struct Student 把姓名和成绩组成一种新类型，一次创建的 Student 就是一张独立的成绩卡。类型是卡片格式，对象是按这个格式填出的具体卡片。', '访问成员使用点号，例如 s.name。结构体的成员默认公开，适合表示简单记录。class 与 struct 在这里的主要区别是默认访问权限：class 默认私有，struct 默认公开；二者都能拥有函数、构造函数和继承关系，并没有“一种只存数据，另一种才能写函数”的规定。'] },
          { title: '把“合理状态”写进接口', paragraphs: ['成绩必须在 0 到 100 之间，这是一条不变量：对象正常存在时应该一直成立的条件。如果任何人都能直接修改 score，就很难守住它。把 score_ 写在 private 区域，再提供 setScore 和 score 两个 public 函数，一个负责检查后修改，一个负责读取，使用者就有了一条清楚的入口。', '封装不是把代码藏起来，而是把“可以做什么”与“内部怎样存储”分开。自动售货机允许你选饮料，不允许你随手改库存。这个比喻只说明接口的作用；private 是编译阶段的访问限制，并不是密码保护或网络安全措施。'] },
          { title: '沿着一次调用看对象怎样工作', paragraphs: ['示例先创建一个成绩为 0 的对象。调用 card.setScore(86) 时，成员函数针对 card 的那一份数据执行，检查通过后再赋值。第二次输入 120 不合法，函数返回 false，并保留原成绩。把检查放在赋值之前，就不会出现“返回失败，数据却已经坏掉”的情况。', '给私有成员加下划线只是一种命名习惯，语言没有要求这样做。不要为每个成员机械地生成读写函数；如果一个对象代表计数器，更合理的接口可能是 increase，而不是让外部随意 setValue。接口要围绕任务设计，保证调用者容易做对。'] }
        ],
        example: { code: `#include <iostream>
class ScoreCard {
private:
    int score_ = 0;
public:
    bool setScore(int value) {
        if (value < 0 || value > 100) return false;
        score_ = value;
        return true;
    }
    int score() const { return score_; }
};
int main() {
    ScoreCard card;
    std::cout << std::boolalpha;
    std::cout << card.setScore(86) << '\\n';
    std::cout << card.setScore(120) << '\\n';
    std::cout << card.score() << '\\n';
}`, output: 'true\nfalse\n86', explanation: ['score_ = 0 为每个新对象提供初始值，不会读取未初始化的整数。', 'boolalpha 让布尔值以 true、false 显示；它不改变判断结果。', 'score() 后的 const 表示该读取操作不会修改对象的普通成员，下两课会继续解释。'] },
        pitfall: 'class 末尾需要分号。private 数据不能用 card.score_ 直接访问；不要为了绕过报错就把所有成员改成 public。',
        quiz: { question: '要保证成绩始终在 0～100 之间，哪种设计更合理？', options: ['公开 score，让调用者记住规则', '私有 score，修改函数先检查范围再赋值', '只把成员变量改名为 safeScore', '每次读取时把非法成绩打印出来'], answer: 1, explanation: '让所有修改都经过检查入口，才能把规则放在对象内部。改名和打印都不能阻止非法状态。' },
        exercise: { title: '有上限的计数器', prompt: '设计 Counter，初值为 0，increase() 每次加 1，到 3 后返回 false 且不再增加。连续调用 4 次，再输出最终值。', hint: '让 value_ 私有；在加一之前判断 value_ 是否已经等于上限。', solution: `#include <iostream>
class Counter {
    int value_ = 0;
public:
    bool increase() {
        if (value_ == 3) return false;
        ++value_;
        return true;
    }
    int value() const { return value_; }
};
int main() {
    Counter c;
    std::cout << std::boolalpha;
    for (int i = 0; i < 4; ++i) std::cout << c.increase() << ' ';
    std::cout << '\\n' << c.value() << '\\n';
}`, explanation: '输出 true true true false，最终值为 3。increase 表达了允许的操作，外部无法把计数器直接改成负数。' }, demo: 'objects'
      },
      {
        id: 'l26', title: '对象的一生：构造、初始化与析构', minutes: 18,
        lead: '对象出生时要准备好数据，离开作用域时要收拾资源。构造函数和析构函数负责这两个边界。',
        objectives: ['会使用构造函数与成员初始化列表', '区分初始化和赋值，理解成员初始化顺序', '认识作用域、析构与 RAII'],
        sections: [
          { title: '出生就应该能使用', paragraphs: ['如果每次创建矩形后还要手动调用 setWidth 和 setHeight，就容易忘掉一步。构造函数与类同名，没有返回类型，在创建对象时自动执行。Rectangle(3, 4) 可以让对象一开始就拥有完整尺寸。构造函数需要保证不变量；遇到无法接受的参数时，可以抛出异常，后面会专门学习。', '冒号后面的 width_(w), height_(h) 是成员初始化列表。它直接构造成员，进入函数体之后的 width_ = w 则是赋值。对 int 两种写法有时效果接近；对 const 成员、引用成员，以及没有默认构造函数的成员，初始化列表尤其重要，不能用事后赋值代替。'] },
          { title: '初始化顺序由声明决定', paragraphs: ['成员按照它们在类中声明的先后顺序初始化，与初始化列表的书写顺序无关。若 height_ 需要用到 width_，应先声明 width_，再声明 height_。最稳妥的习惯是让列表顺序与声明一致，并开启编译器警告，避免代码看起来先后有序、实际上却先用了未准备的数据。', '给单参数构造函数加 explicit，通常可以阻止它在不经意间参与隐式转换。例如 explicit Meter(double) 要求读者明确创建 Meter，而不会把任何小数自动当作长度。explicit 的细节可以以后展开，现在先记住“类型转换最好有意图”。'] },
          { title: '离开大括号时，谁负责收拾', paragraphs: ['局部对象在作用域结束时自动析构，同一作用域中后构造的对象通常先析构。析构函数写作 ~类名()，没有参数和返回类型。示例用打印观察生命周期；实际工程里，析构更常用来关闭文件、解锁或释放拥有的资源。', 'RAII 把资源的占用期间绑定到对象的生命期。比如 fstream 对象打开文件，离开作用域时负责关闭。这个机制也适用于异常离开作用域，不只适用于走到最后一行。不要把析构理解成“程序退出才发生”；小括号控制循环，大括号控制局部作用域，一小段代码结束也会触发析构。'] }
        ],
        example: { code: `#include <iostream>
#include <string>
#include <utility>
class Ticket {
    std::string name_;
public:
    explicit Ticket(std::string name) : name_(std::move(name)) {
        std::cout << "open " << name_ << '\\n';
    }
    ~Ticket() { std::cout << "close " << name_ << '\\n'; }
};
int main() {
    Ticket a("A");
    {
        Ticket b("B");
        std::cout << "inside\\n";
    }
    std::cout << "outside\\n";
}`, output: 'open A\nopen B\ninside\nclose B\noutside\nclose A', explanation: ['a 属于 main 的作用域，b 属于内部大括号的作用域。', 'std::move 把参数中的字符串交给成员保存；它的含义会在现代 C++ 一章详细学习。', '析构函数只演示时间点。不要为了打印而在实际业务类中随意加入自定义析构函数。'] },
        pitfall: '不要写 Rectangle r(); 来创建无参数对象，这会被解析为函数声明。使用 Rectangle r{} 或 Rectangle r。',
        quiz: { question: '类先声明 int a_;，再声明 int b_;，初始化列表写 b_(2), a_(1)，谁先初始化？', options: ['b_，因为在列表中写在前面', '随机决定', 'a_，因为它先声明', '二者同时初始化'], answer: 2, explanation: '非静态数据成员按照类内声明顺序初始化。列表反着写不会改变顺序，反而会误导读者。' },
        exercise: { title: '出生就完整的矩形', prompt: '定义 Rectangle，用构造函数初始化宽、高，提供 area() const。创建 3×4 和 5×2 的矩形，输出面积。尺寸在本题中已保证为正。', hint: '使用 : width_(w), height_(h)，面积函数只读取成员。', solution: `#include <iostream>
class Rectangle {
    double width_;
    double height_;
public:
    Rectangle(double w, double h) : width_(w), height_(h) {}
    double area() const { return width_ * height_; }
};
int main() {
    Rectangle a(3, 4);
    Rectangle b(5, 2);
    std::cout << a.area() << '\\n' << b.area() << '\\n';
}`, explanation: '输出 12 与 10。每个对象有独立的尺寸，构造完成后就能计算面积。生产代码还应按业务需要处理非法尺寸。' }
      },
      {
        id: 'l27', title: '只读操作与全班共用的数据', minutes: 16,
        lead: '有些函数只查看对象，有些数据属于整个类型。const 和 static 帮我们把这两种关系写清楚。',
        objectives: ['会声明和调用 const 成员函数', '区分每个对象的数据与 static 数据', '认识 C++17 的 inline static 成员'],
        sections: [
          { title: 'const 不只是“不能改的变量”', paragraphs: ['const Rectangle r(3, 4) 表示 r 这个对象不能通过普通方式修改。它能调用 area() const，却不能调用修改宽度的 setWidth。成员函数末尾的 const 约束的是它面对的对象；它仍然可以计算局部变量、打印结果，甚至修改并不属于该对象的外部数据。因此“const 函数绝对没有任何副作用”说得太宽。', '读取函数尽量声明 const，调用者就可以把对象通过 const 引用传过来。const Student& 避免复制，也表达“这里仅借来查看”。这既有助于性能，也让函数意图清楚。不要用强制转换去绕开 const；如果确实需要修改，应该重新检查接口是否设计合理。'] },
          { title: '每本书的页码，与整个书架的编号', paragraphs: ['普通成员像每本书自己的页码，每个对象各有一份。static 数据成员像整个分类共有的下一编号，所有对象访问的是同一个实体。访问时写 Book::nextId 更能说明它属于类型。static 成员函数也不依赖某个具体对象，因此没有隐含的 this，不能直接访问某一本书的 id_。', 'C++17 可以在类内写 inline static int nextId_ = 1，把声明和定义放在一起。旧写法通常需要在一个 .cpp 文件中另外定义静态数据成员。这里的 inline 不等于要求编译器把函数展开；用于变量时，它主要解决多个翻译单元中定义的安排。'] },
          { title: '把“发过多少号”与“现在有多少对象”分开', paragraphs: ['示例的计数器每构造一本新 Book 就递增，表示下一个待发的编号。它不是当前存活对象数：对象销毁后不会把编号收回。默认复制一本 Book 也会复制它的编号，不会自动调用这个接收名称的构造函数。不同业务需要不同语义，不能只靠一个 static 变量就宣称拥有了完整的唯一标识系统。', '如果多个线程同时修改同一计数器，还需要同步机制；这属于并发课程。当前示例只在单线程中使用。先学会分清数据归属，比急着加入计数器更重要：姓名和成绩属于学生对象，学校统一的评分上限可以属于类型，临时求和则属于函数的局部变量。'] }
        ],
        example: { code: `#include <iostream>
#include <string>
#include <utility>
class Book {
    inline static int nextId_ = 1; // C++17
    int id_;
    std::string title_;
public:
    explicit Book(std::string title)
        : id_(nextId_++), title_(std::move(title)) {}
    int id() const { return id_; }
    const std::string& title() const { return title_; }
    static int nextId() { return nextId_; }
};
int main() {
    const Book a("Algorithms");
    Book b("C++");
    std::cout << a.id() << ' ' << a.title() << '\\n';
    std::cout << b.id() << ' ' << b.title() << '\\n';
    std::cout << Book::nextId() << '\\n';
}`, output: '1 Algorithms\n2 C++\n3', explanation: ['构造 a 时分配 1 并把 nextId_ 变成 2；构造 b 时再分配 2。', 'a 是 const 对象，id() 和 title() 都需要是 const 成员函数。', 'title() 返回的引用借用了对象内部字符串，只能在原对象仍存活时使用。'] },
        pitfall: '不要从成员函数返回局部变量的引用。这里返回 title_ 的引用是借用成员，不是借用一个即将消失的局部字符串。',
        quiz: { question: 'static 成员函数为什么不能直接读取普通成员 id_？', options: ['static 只能操作整数', '它没有关联的具体对象，不知道要读取谁的 id_', 'id_ 必须先改成 public', 'const 会阻止所有 static 函数'], answer: 1, explanation: '普通成员属于具体对象。static 函数可以在拿到 Book 对象之后读取它的公开接口，但没有隐含对象。' },
        exercise: { title: '课程的统一及格线', prompt: '定义 Exam，普通成员保存成绩，inline static constexpr int passLine = 60 表示统一及格线，passed() const 判断是否及格。测试 59 与 60。', hint: 'constexpr 表示可以参与常量表达式；passed 用 score_ >= passLine。', solution: `#include <iostream>
class Exam {
    int score_;
public:
    inline static constexpr int passLine = 60;
    explicit Exam(int score) : score_(score) {}
    bool passed() const { return score_ >= passLine; }
};
int main() {
    const Exam a(59), b(60);
    std::cout << std::boolalpha << a.passed() << ' ' << b.passed() << '\\n';
}`, explanation: '输出 false true。score_ 每个对象各有一份，passLine 表示类型统一采用的常量。' }
      },
      {
        id: 'l28', title: '让向量自然相加：运算符重载', minutes: 18,
        lead: '数学里的二维向量可以写 a+b。我们可以为自己的类型提供这个写法，但符号应该保留读者熟悉的含义。',
        objectives: ['会为值类型定义加法运算符', '会编写 ostream 输出运算符', '理解重载的边界与一致性'],
        sections: [
          { title: '符号背后仍然是函数', paragraphs: ['二维向量有横、纵两个分量，相加时分别相加。定义 operator+ 后，a + b 就会调用相应函数。示例把它写成普通函数，参数是 const Vec2&，不复制输入，也不修改它们；返回一个新的 Vec2。这与整数加法“不改动两边原值”的体验一致。', '运算符重载不能创造新符号，也不能更改已有符号的优先级。a + b * c 仍然先做乘法。重载通常需要至少一个操作数是类或枚举类型，不能重新规定两个 int 相加的结果。先选择适合的类型，再考虑符号；不要把 + 设计成保存文件或弹出窗口。'] },
          { title: '为什么输出函数返回 ostream&', paragraphs: ['std::cout << a 中，左边是输出流，右边是向量，所以输出运算符通常写成非成员函数：std::ostream& operator<<(std::ostream& out, const Vec2& v)。函数把格式写到 out，而不是固定写到 cout，这样同一函数也可以服务于文件流和字符串流。', '返回 out 的引用，是为了支持 cout << a << b 这样的连续输出。第一次运算得到同一个流，再交给下一次 <<。流本身不复制；对象用 const 引用传入，因为打印不需要修改向量。若成员是私有的，可以通过公开读取函数访问，不必立刻使用 friend。'] },
          { title: '可读的形式，要配可靠的约定', paragraphs: ['数学向量是适合重载的例子，因为符号含义早已清楚。业务类型的约定则必须更谨慎：人民币与美元不能因为都存一个 double 就随便相加，矩阵尺寸不匹配也需要处理。一个漂亮表达式只能帮助阅读，不能替你解决数据有效性。', '练习使用整数坐标，让输出可以精确预测。若改成 double，比较相等时还要面对浮点误差；若坐标可能极大，整数加法还要处理溢出。当前小例子只承诺对给定的小整数安全工作。以后扩展类型时，要把这些边界一起写入接口和测试。'] }
        ],
        example: { code: `#include <iostream>
struct Vec2 { int x; int y; };
Vec2 operator+(const Vec2& a, const Vec2& b) {
    return {a.x + b.x, a.y + b.y};
}
std::ostream& operator<<(std::ostream& out, const Vec2& v) {
    return out << '(' << v.x << ", " << v.y << ')';
}
int main() {
    Vec2 a{2, 3}, b{4, -1};
    Vec2 c = a + b;
    std::cout << a << " + " << b << " = " << c << '\\n';
}`, output: '(2, 3) + (4, -1) = (6, 2)', explanation: ['{a.x + b.x, a.y + b.y} 创建新结果；a 和 b 保持原值。', '输出函数写入参数 out，保证它能与不同种类的输出流配合。', '最后返回同一个流，所以一行中可以连续使用多个 <<。'] },
        pitfall: '不要让 operator+ 修改左操作数。如果需要“加到自己身上”，通常用 operator+= 来表达。保持熟悉的符号语义。',
        quiz: { question: '输出运算符为什么通常返回 std::ostream&？', options: ['为了创建新的 cout', '为了支持连续的 << 调用并避免复制流', '为了提高数字精度', '为了改变 << 的运算优先级'], answer: 1, explanation: '每次返回同一个输出流，后续 << 就能继续使用它。重载不会改变优先级。' },
        exercise: { title: '给向量增加减法', prompt: '为 Vec2 定义 operator-，计算 (7,4) - (2,6)，并使用 << 输出结果。', hint: '每个分量分别相减，返回新的对象。', solution: `#include <iostream>
struct Vec2 { int x; int y; };
Vec2 operator-(const Vec2& a, const Vec2& b) {
    return {a.x - b.x, a.y - b.y};
}
std::ostream& operator<<(std::ostream& out, const Vec2& v) {
    return out << '(' << v.x << ", " << v.y << ')';
}
int main() {
    std::cout << (Vec2{7, 4} - Vec2{2, 6}) << '\\n';
}`, explanation: '输出 (5, -2)。负坐标完全合法；不要为了“让结果好看”而把负数擅自变成绝对值。' }
      }
    ]
  },
  {
    id: 'ch08', number: 8, title: '继承与多态',
    description: '先分清“包含一个”与“是一种”，再让同一个接口处理不同的对象。',
    lessons: [
      {
        id: 'l29', title: '组合与继承：自行车不是车轮', minutes: 16,
        lead: '“自行车有车轮”和“圆是一种图形”是两种不同关系。选对关系，代码才不会越写越别扭。',
        objectives: ['会通过成员对象建立组合关系', '理解 public 继承的可替代含义', '避免为了复用几行代码而强行继承'],
        sections: [
          { title: '先问一句：是“有”，还是“是”？', paragraphs: ['一辆自行车有两个车轮，但它并不是一种车轮。把 Wheel 对象作为 Bike 的成员，就是组合：较大的对象由较小的对象组成。成员对象跟随外部对象一起构造和析构，数据归属很清楚。程序里也常见这种关系：GradeBook 有一组学生记录，Game 有一个计分器。', 'public 继承表达的通常是“派生类是一种基类”。Circle 可以是一种 Shape，凡是只需要一个 Shape 的地方，也应该可以使用 Circle。这里的“应该可以”不只是语法允许，还要求行为符合承诺：如果基类说操作不会产生负面积，派生类不能突然违背它。'] },
          { title: '继承不是复制粘贴的替代键', paragraphs: ['假设 Stack 想借用 vector 的存储，不应因此 public 继承 vector。vector 公开的随机插入、从中间删除等操作，会破坏栈“只能从顶部放入和取出”的接口。让 Stack 内部持有一个 vector，然后只公开 push、pop 和 top，往往更合适。', '派生对象包含基类部分，构造时先构造基类，再构造成员，最后执行派生类构造函数体。public 继承保留基类公开接口的公开属性，private 成员依然不能由派生类直接访问。不要随手把所有 private 改成 protected；通过明确的成员函数操作状态，通常更容易保持规则。'] },
          { title: '一种关系可以随需求改变', paragraphs: ['示例让 Bike 含有前后两个 Wheel，各自保存半径。行驶一圈需要的距离由车轮负责计算，Bike 负责选择自己的前轮来调用。这是小对象协助大对象完成任务，不需要任何继承树。把代码拆开，是为了让职责清楚，而不是为了让类的数量看起来更多。', '判断继承时可以用替换问题自检：“如果调用者只认识基类，把我交给它之后，原先的承诺还能成立吗？”这比只看名字相似更可靠。继承、组合都不是高低级之分；大学课程会同时学习它们，工程代码通常更偏向用组合建立容易修改的结构。'] }
        ],
        example: { code: `#include <iostream>
#include <iomanip>
class Wheel {
    double radius_;
public:
    explicit Wheel(double radius) : radius_(radius) {}
    double circumference() const { return 2 * 3.141592653589793 * radius_; }
};
class Bike {
    Wheel front_;
    Wheel rear_;
public:
    explicit Bike(double radius) : front_(radius), rear_(radius) {}
    double distancePerTurn() const { return front_.circumference(); }
};
int main() {
    Bike bike(0.35);
    std::cout << std::fixed << std::setprecision(2)
              << bike.distancePerTurn() << " m\\n";
}`, output: '2.20 m', explanation: ['Bike 的初始化列表同时构造两个 Wheel，成员没有被遗忘。', 'radius 的单位约定为米，周长也以米表示；类型系统本身没有检查这个单位。', 'distancePerTurn 借助成员对象完成计算，是组合关系。'] },
        pitfall: '“想复用基类的几个方法”不足以证明 public 继承合理。先检查派生对象是否真的能替代基类。',
        quiz: { question: '图书馆保存许多 Book，哪种关系最贴切？', options: ['Library public 继承 Book', 'Book public 继承 Library', 'Library 内部拥有一组 Book，是组合', '把所有字段放到全局变量'], answer: 2, explanation: '图书馆有书，却不是一本书。用成员容器保存书籍，自然表达“包含”的关系。' },
        exercise: { title: '屏幕里的点', prompt: '定义 Point 保存 x、y，定义 Window 含有一个 Point 作为左上角。Window 构造时接收坐标，提供 print() const，输出 10 20。', hint: 'Point 是简单记录，Window 的成员可写 Point origin_;。', solution: `#include <iostream>
struct Point { int x; int y; };
class Window {
    Point origin_;
public:
    Window(int x, int y) : origin_{x, y} {}
    void print() const { std::cout << origin_.x << ' ' << origin_.y << '\\n'; }
};
int main() {
    Window w(10, 20);
    w.print();
}`, explanation: 'Window 有一个位置，组合即可表达。没有必要让 Window 继承 Point，把窗口当成坐标点使用。' }
      },
      {
        id: 'l30', title: 'virtual：听到的是对象自己的声音', minutes: 18,
        lead: '同样调用 speak()，猫和狗应该给出各自的回答。虚函数把选择留到程序运行时。',
        objectives: ['理解静态类型与动态类型', '会写 virtual、override 和虚析构函数', '知道何时发生动态派发'],
        sections: [
          { title: '名字牌，与实际站在面前的人', paragraphs: ['Animal& 是引用的静态类型，编译器据此判断允许调用哪些接口。如果这个引用实际绑定到 Cat，对象的动态类型就是 Cat。普通成员函数通常按静态类型选择；虚函数则在运行时根据实际对象选择最终覆盖版本。这个过程叫动态派发，也常被称为运行时多态。', '虚函数不是“同名函数自动变聪明”。基类先声明 virtual，派生类再用匹配的参数、const 等限定覆盖它。示例在派生类写 override；一旦拼错名字或漏写 const，编译器会告诉你并没有覆盖成功。它是一张检查单，比凭肉眼判断安全得多。'] },
          { title: '用基类的引用，保存对象的身份', paragraphs: ['makeSound(const Animal& animal) 不需要知道来的是猫还是狗。它只调用共同接口 speak，新的派生类也能参加。这种函数减少了按类型写 if 的需要。不过它只能使用 Animal 声明过的接口，不能因为引用背后碰巧是 Cat 就直接调用 Cat 独有的方法。', '多态调用通常通过基类指针或引用发生。对象本身必须还活着；引用不拥有对象，不能延长任意局部对象的生命周期。不要返回局部 Cat 的 Animal&。虚函数能选择正确代码，不能修复悬空引用。'] },
          { title: '为什么基类析构也需要 virtual', paragraphs: ['如果通过指向基类的指针删除一个派生对象，基类应具有虚析构函数，让整个派生对象被正确销毁。对于通常的多态拥有方式，非虚析构会导致未定义行为，并不只是“少打印一行”。写 virtual ~Animal() = default 能明确这一约定。', '析构期间的虚调用还有额外规则，不能期待在基类析构函数里调用到已经结束生命的派生类版本。当前阶段最实用的习惯是：打算以基类接口多态使用并销毁对象时，给基类提供公开虚析构；在构造、析构函数里避免调用虚函数来完成跨层业务。'] }
        ],
        example: { code: `#include <iostream>
class Animal {
public:
    virtual ~Animal() = default;
    virtual void speak() const { std::cout << "sound\\n"; }
};
class Cat : public Animal {
public:
    void speak() const override { std::cout << "meow\\n"; }
};
class Dog : public Animal {
public:
    void speak() const override { std::cout << "woof\\n"; }
};
void makeSound(const Animal& animal) { animal.speak(); }
int main() {
    Cat cat;
    Dog dog;
    makeSound(cat);
    makeSound(dog);
}`, output: 'meow\nwoof', explanation: ['两个调用的形参静态类型都相同，但引用所绑定的对象不同。', 'override 要求编译器确认这是对基类虚函数的覆盖。', '所有对象在 main 内正常存活，本例通过引用借用对象，不涉及动态分配。'] },
        pitfall: '基类函数是 speak() const 时，派生类写 speak() override 会报错。const 属于函数匹配的一部分，不能漏掉。',
        quiz: { question: 'const Animal& a = cat; 后调用 a.speak()，选择 Cat 版本所需的关键条件是什么？', options: ['cat 必须是全局对象', '基类 speak 是 virtual，派生类正确覆盖', 'Animal 必须只有一个成员', '把引用改成按值复制'], answer: 1, explanation: 'virtual 建立动态派发机制。按值复制成基类反而会丢掉派生部分，下一课组会讲到切片。' },
        exercise: { title: '两种通知器', prompt: '定义虚函数 send() const 的 Notifier，EmailNotifier 输出 email，SmsNotifier 输出 sms。写 notify(const Notifier&) 并依次调用。', hint: '基类虚析构写 = default，两个派生函数写 override。', solution: `#include <iostream>
class Notifier {
public:
    virtual ~Notifier() = default;
    virtual void send() const { std::cout << "generic\\n"; }
};
class EmailNotifier : public Notifier {
public:
    void send() const override { std::cout << "email\\n"; }
};
class SmsNotifier : public Notifier {
public:
    void send() const override { std::cout << "sms\\n"; }
};
void notify(const Notifier& n) { n.send(); }
int main() {
    EmailNotifier e;
    SmsNotifier s;
    notify(e);
    notify(s);
}`, explanation: '输出 email 与 sms。notify 只依赖共同接口，以后增加新的通知方式时不必修改这个函数。' }
      },
      {
        id: 'l31', title: '抽象接口：先约定能做什么', minutes: 18,
        lead: '图形都有面积，但“普通图形”的面积没法凭空算出来。把这个必须由具体类型回答的问题写成纯虚函数。',
        objectives: ['会定义纯虚函数与抽象基类', '能通过接口处理多种具体类型', '理解接口约定、动态派发与拥有关系的区别'],
        sections: [
          { title: '没有足够信息，就不要假装有答案', paragraphs: ['Shape 只表示图形这个抽象概念，没有边长、半径或其他尺寸。面积函数写 virtual double area() const = 0，表示具体派生类必须提供实现。末尾的 = 0 是纯虚声明，不是“函数返回零”。含有未实现纯虚函数的类是抽象类，不能直接创建 Shape 对象。', '抽象类可以有数据、普通成员函数和构造函数，但简单接口通常尽量保持轻量。Rectangle 实现 area 后就成为可以创建的具体类。它可以把内部存储改成另一种方式，只要继续满足 area 的公开约定，使用 Shape 的代码就不必跟着改。'] },
          { title: '写一次求和，支持多种图形', paragraphs: ['sumAreas 接受 vector<const Shape*>，逐个调用 area。指针中可以放矩形也可以放正方形，循环并不关心具体类型。返回类型使用 double，因为面积可能有小数。这里的多态发生在每次 p->area() 调用时，而不是发生在 vector 本身。', '这组指针只是借用，没有拥有图形。示例先创建两个对象，再创建指向它们的容器，求和完成前对象一直存活，并保证指针非空。若容器需要比创建它的作用域活得更久，应考虑 unique_ptr<Shape> 等拥有方式，后面的现代 C++ 课会给出做法。'] },
          { title: '接口还要描述行为上的约定', paragraphs: ['一个可信的 Shape 接口应该说明尺寸是否允许为零、面积是否总为非负、单位怎样确定。纯虚函数只保证派生类提供某个签名，并不能自动检查这些数学和业务规则。类图画得再漂亮，也不能替代输入检查和测试。', '抽象接口适合运行时需要互换实现的场景，例如多种导出格式、存储方式或图形。若类型在编译时已经确定，模板也可能更合适。当前先把两条路线分清：虚函数靠共同基类在运行时选实现，模板为不同类型生成适合的代码；没有必要把所有小函数都改成继承体系。'] }
        ],
        example: { code: `#include <iostream>
#include <vector>
class Shape {
public:
    virtual ~Shape() = default;
    virtual double area() const = 0;
};
class Rectangle : public Shape {
    double w_, h_;
public:
    Rectangle(double w, double h) : w_(w), h_(h) {}
    double area() const override { return w_ * h_; }
};
class Square : public Shape {
    double side_;
public:
    explicit Square(double side) : side_(side) {}
    double area() const override { return side_ * side_; }
};
double sumAreas(const std::vector<const Shape*>& shapes) {
    double total = 0;
    for (const Shape* p : shapes) total += p->area();
    return total;
}
int main() {
    Rectangle r(3, 4);
    Square s(2);
    std::vector<const Shape*> shapes{&r, &s};
    std::cout << sumAreas(shapes) << '\\n';
}`, output: '16', explanation: ['Rectangle 和 Square 都完整实现 area，因此能创建对象。', 'sumAreas 接口约定指针非空且有效；这些条件在本例由调用者保证。', '3×4 + 2×2 = 16，类型不同并不影响统一求和。'] },
        pitfall: '只在派生类声明 area，却不提供定义，会在需要它时产生链接错误；漏掉 override 对应的实现则可能让派生类仍是抽象类。',
        quiz: { question: 'virtual double area() const = 0; 中的 = 0 表示什么？', options: ['每次调用返回 0', '面积必须是整数', '这是纯虚函数声明', '把函数指针设置成空指针'], answer: 2, explanation: '它要求具体类提供实现，含有未覆盖纯虚函数的类不能直接实例化。' },
        exercise: { title: '三角形加入队伍', prompt: '定义抽象 Shape 和 Triangle，Triangle 保存底和高，实现 area。通过 const Shape& 输出底 6、高 4 的三角形面积。', hint: '三角形面积是底乘高除以 2.0；引用绑定到一个仍存活的 Triangle。', solution: `#include <iostream>
class Shape {
public:
    virtual ~Shape() = default;
    virtual double area() const = 0;
};
class Triangle : public Shape {
    double base_, height_;
public:
    Triangle(double b, double h) : base_(b), height_(h) {}
    double area() const override { return base_ * height_ / 2.0; }
};
int main() {
    Triangle t(6, 4);
    const Shape& shape = t;
    std::cout << shape.area() << '\\n';
}`, explanation: '输出 12。调用者只使用 Shape 接口，实际执行 Triangle 的面积算法。' }
      },
      {
        id: 'l32', title: '复制不是换名字：切片与资源管理', minutes: 20,
        lead: '把派生对象复制成一个基类对象，会丢掉派生部分。复制带资源的对象时，还要想清楚到底谁负责收拾。',
        objectives: ['识别对象切片并使用引用保留多态', '理解成员逐个复制与拥有资源的区别', '认识三/五法则及优先使用零法则'],
        sections: [
          { title: '身份证明还在，完整的人却不在', paragraphs: ['Base b = derived 创建的是一个新的 Base 对象，只复制 derived 的基类部分，派生类增加的数据和行为不属于这个新对象。这叫对象切片。即使 Base 的函数是 virtual，b 的动态类型也只有 Base，不能再凭空恢复原来的 Derived。', '如果只想查看对象，用 const Base&；如果需要统一保存不同派生对象的所有权，用智能指针容器。vector<Base> 按值存放基类对象，加入派生对象时仍会切片。切片有时是明确需要的基类值复制，但在多态设计中往往是错误，函数参数也应避免无意地按 Base 值传递。'] },
          { title: '默认复制会复制什么', paragraphs: ['编译器生成的复制操作通常逐个复制基类和成员。成员是 string、vector 时，它们知道怎样复制自己的内容，两个容器可独立修改。成员若是拥有一块动态内存的裸指针，默认复制只会复制地址，两个对象会认为同一块内存属于自己，最后可能重复释放。', '这里关键不是“指针一定不能复制”，而是所有权。一个明确不拥有资源的观察指针可以被复制，但原资源必须持续存活。一个拥有资源的指针需要定义深复制、转移拥有权，或者禁止复制。先说明谁负责释放，再选择表示方式。'] },
          { title: '零法则比手写五个函数更常用', paragraphs: ['传统三法则提醒：类若必须自定义析构、复制构造或复制赋值，通常要一起检查这三项。加入移动构造和移动赋值后，常称五法则。这不是要求每个类都写满五个函数，而是提醒特殊资源需要一致的复制与移动策略。', '零法则是更适合日常的目标：让 string、vector、unique_ptr 等成员负责资源，自己的业务类不手写这些特殊函数。示例的 Notebook 含有 vector，默认复制就已经具有正确的独立值语义。大学学习应当理解手动管理的原理，同时优先写不用手动管理的代码。'] }
        ],
        example: { code: `#include <iostream>
#include <vector>
struct Base {
    virtual ~Base() = default;
    virtual const char* name() const { return "Base"; }
};
struct Derived : Base {
    const char* name() const override { return "Derived"; }
};
struct Notebook { std::vector<int> pages; };
int main() {
    Derived d;
    Base sliced = d;
    const Base& borrowed = d;
    std::cout << sliced.name() << ' ' << borrowed.name() << '\\n';
    Notebook a{{1, 2}};
    Notebook b = a;
    b.pages[0] = 9;
    std::cout << a.pages[0] << ' ' << b.pages[0] << '\\n';
}`, output: 'Base Derived\n1 9', explanation: ['sliced 是独立的 Base；borrowed 仍引用原来的 Derived，所以两次名字不同。', 'Notebook 不自定义资源函数，vector 的复制已经让两个序列独立。', '本例有意展示切片用于观察规则；多态业务接口应优先避免这种按值复制。'] },
        pitfall: '不能通过添加 virtual 修复已经发生的切片。要保留完整对象，从参数传递和存储方式开始使用指针或引用。',
        quiz: { question: '一个业务类只含 std::string 和 std::vector，一般应如何管理复制与析构？', options: ['总是手写析构并逐个 delete 成员', '依赖成员的正确资源管理，优先遵循零法则', '用 memcpy 复制整个类', '把所有成员换成裸指针'], answer: 1, explanation: '标准资源类型已经管理好自己的复制和生命周期。多写一套手动释放代码反而容易破坏它们。' },
        exercise: { title: '复制一份独立的成绩册', prompt: '定义 GradeBook，成员是 vector<int>。复制含 80、90 的成绩册，修改副本第一项为 100，分别输出两个第一项。', hint: '普通的 GradeBook b = a 就足够，不需要写复制构造函数。', solution: `#include <iostream>
#include <vector>
struct GradeBook { std::vector<int> scores; };
int main() {
    GradeBook a{{80, 90}};
    GradeBook b = a;
    b.scores.at(0) = 100;
    std::cout << a.scores.at(0) << ' ' << b.scores.at(0) << '\\n';
}`, explanation: '输出 80 100。at 会检查下标，vector 的复制拥有独立元素；若元素本身是裸指针，复制地址的语义又要另行分析。' }
      }
    ]
  },
  {
    id: 'ch09', number: 9, title: '模板与泛型',
    description: '保留算法的骨架，把具体类型作为参数；再认识小函数与异常处理的边界。',
    lessons: [
      {
        id: 'l33', title: '一份算法，多种类型：函数模板', minutes: 16,
        lead: '求两个数中的较大值，不应该为 int 和 double 各抄一遍。模板让类型成为函数的一个参数。',
        objectives: ['会定义和调用简单函数模板', '理解类型推导与实例化', '认识模板对操作的隐含要求'],
        sections: [
          { title: '把类型名也留一个空格', paragraphs: ['普通函数 int larger(int a, int b) 固定处理整数。在函数前写 template<typename T>，再把 int 改成 T，就把“具体是什么类型”交给调用处决定。T 只是一个名称，也可以叫 Value。这里 typename 与 class 都可以用来声明类型模板参数，typename 对初学者更直观。', 'larger(3, 7) 让编译器推导 T 为 int，larger(2.5, 1.0) 推导为 double。编译器据此检查并生成相应代码，称为实例化。模板不是每次运行时检查类型的脚本，也不是让所有类型共享一段没有类型信息的机器代码。它仍然参与静态类型检查。'] },
          { title: '同一个 T，意味着同一种类型', paragraphs: ['larger(3, 2.5) 一边是 int，一边是 double，两个参数对同一个 T 给出冲突的推导结果，这个简单模板通常不能直接调用。你可以写 larger<double>(3, 2.5)，明确指定类型，让整数转成 double；也可以先统一数据类型。不要误以为“泛型”意味着任何混合输入都必然合理。', '函数体使用 a < b，因此 T 必须支持这种比较，而且结果要适合条件判断。整数、小数、字符串都可以；两个没有比较运算的自定义对象则不行。模板的真正含义是“适用于满足要求的一组类型”，不是“无条件适用于所有东西”。'] },
          { title: '返回值与报错要一起考虑', paragraphs: ['示例按值返回较大值，结果独立存在，初学阶段易于理解。若为了少一次复制改成 const T&，就必须确认调用参数的寿命，不能让结果引用已经消失的临时对象。标准库的 std::max 有自己的精确约定；学习时不要只抄一个看似更快的签名而忽略生命周期。', '读模板报错时，先找调用处推导了什么 T，再找函数体中哪项操作不成立。一个很长的诊断常常源于一件小事，比如比较运算不存在。实际工程中优先使用已有标准算法；手写这个模板是为了弄明白机制，而不是重新做一套标准库。'] }
        ],
        example: { code: `#include <iostream>
#include <string>
template<typename T>
T larger(T a, T b) { return a < b ? b : a; }
int main() {
    std::cout << larger(3, 7) << '\\n';
    std::cout << larger(2.5, 1.0) << '\\n';
    std::cout << larger(std::string("apple"), std::string("pear")) << '\\n';
    std::cout << larger<double>(3, 2.5) << '\\n';
}`, output: '7\n2.5\npear\n3', explanation: ['前三次调用分别实例化 int、double 和 std::string 版本。', '字符串比较采用字典序，不是比较长度；pear 在 apple 后面。', '最后一次明确指定 double，两个实参都按这个参数类型传入。'] },
        pitfall: '两个 const char* 的 < 比较不是按字符串内容排字典序。要比较文本，使用 std::string 或正确的字符串比较函数。',
        quiz: { question: '这个 larger 模板能处理自定义类型的前提是什么？', options: ['类型名字必须只有一个字母', '类型必须是 int 的别名', '它支持函数体所需的比较、复制等操作', '对象必须动态分配'], answer: 2, explanation: '模板把具体类型留给调用者，但函数体对类型仍有要求。缺失的操作会在实例化时造成错误。' },
        exercise: { title: '一个通用交换函数', prompt: '编写 swapValues(T& a, T& b)，用临时变量交换。测试两个 int，再测试两个 std::string。此练习允许复制；实际代码可用 std::swap。', hint: '先保存 a，再把 b 赋给 a，最后把保存的值赋给 b。', solution: `#include <iostream>
#include <string>
template<typename T>
void swapValues(T& a, T& b) {
    T temp = a;
    a = b;
    b = temp;
}
int main() {
    int a = 3, b = 8;
    swapValues(a, b);
    std::string x = "left", y = "right";
    swapValues(x, y);
    std::cout << a << ' ' << b << '\\n' << x << ' ' << y << '\\n';
}`, explanation: '输出 8 3 与 right left。引用让交换作用于原变量；按值传参只能交换函数内部的副本。' }
      },
      {
        id: 'l34', title: '类模板：同样的盒子，装不同的东西', minutes: 16,
        lead: 'vector<int> 与 vector<string> 看起来很像。它们来自同一份类模板，却是不同的具体类型。',
        objectives: ['会定义带类型参数的简单类模板', '理解不同实例化是不同类型', '了解模板定义通常放在头文件的原因'],
        sections: [
          { title: '给类的配方增加一个类型参数', paragraphs: ['template<typename T> class Box 定义的是一份配方，不是一个可以不加说明就到处使用的具体类型。Box<int> 把配方中的 T 换成整数，Box<std::string> 换成字符串。成员、函数参数和返回类型都可以使用 T，构造时则传入该具体类型的值。', '这正是 vector<int> 的基本思路：容器逻辑相同，元素类型由模板参数决定。Box<int> 与 Box<double> 是不同类型，不能因为名字相似就自动互相赋值。两种类型之间是否允许转换，必须由接口明确提供；本课的小盒子没有设计这样的转换。'] },
          { title: '借用里面的东西，还是拿走一份', paragraphs: ['get() const 返回 const T&，让读取者借用内部成员，避免复制大对象。引用只在 Box 仍然存活且该成员仍有效时可用。若希望结果能独立保存，可以写 T copy = box.get()，明确做一次复制。模板并不会消除普通 C++ 的生命周期规则。', '构造函数本例接受 const T& 并复制到成员，适用于可复制类型。它不是万能容器：unique_ptr 不能复制，因此这种构造方式不支持它。之后可以学习移动构造和完美转发来扩展接口，但先把“这段代码究竟需要哪些操作”说清楚，比一开始堆满语法更有用。'] },
          { title: '为什么模板通常写在 .hpp', paragraphs: ['编译器实例化 Box<int> 时，需要看见模板定义，才能检查和生成代码。如果只在头文件留声明、把所有定义藏进普通 .cpp，调用者常会遇到链接问题。常见方案是把模板定义写在头文件中，并用头文件保护防止重复包含。后面工程章节会说明翻译单元与链接。', '显式实例化等技术也能把部分模板实现放到源文件里，但要预先决定支持哪些类型，属于进阶主题。当前学习者不必把“模板都必须永远写在一个文件”背成定律；先记住一般使用场景中，使用点需要可见的定义。'] }
        ],
        example: { code: `#include <iostream>
#include <string>
template<typename T>
class Box {
    T value_;
public:
    explicit Box(const T& value) : value_(value) {}
    const T& get() const { return value_; }
    void set(const T& value) { value_ = value; }
};
int main() {
    Box<int> number(42);
    Box<std::string> word(std::string("hello"));
    number.set(7);
    std::cout << number.get() << '\\n' << word.get() << '\\n';
}`, output: '7\nhello', explanation: ['两种 Box 实例化拥有各自的成员类型，也有相应的成员函数实现。', 'number.set(7) 只修改 number，word 里的字符串不受影响。', 'get 返回成员引用，输出完成时两个盒子都仍存活。'] },
        pitfall: '不要在函数里创建 Box 后返回 box.get() 的引用。局部 Box 销毁后，返回的引用就悬空了。',
        quiz: { question: 'Box<int> 与 Box<double> 是什么关系？', options: ['总是同一个类型', '不同的类模板实例化，是不同类型', '只有运行时才能区分', '自动继承彼此'], answer: 1, explanation: '模板参数参与类型构成。模板配方相同，不意味着生成的具体类型相同。' },
        exercise: { title: '同类型的一对值', prompt: '定义 Pair<T>，保存 first 和 second，sum() const 返回两者之和。分别测试 Pair<int>{2,5} 与 Pair<double>{1.5,2.5}。', hint: '可以使用 struct 模板和公开成员；sum 的返回类型为 T。', solution: `#include <iostream>
template<typename T>
struct Pair {
    T first;
    T second;
    T sum() const { return first + second; }
};
int main() {
    Pair<int> a{2, 5};
    Pair<double> b{1.5, 2.5};
    std::cout << a.sum() << '\\n' << b.sum() << '\\n';
}`, explanation: '输出 7 和 4。此模板要求 T 的加法结果可以作为 T 返回，不能把它理解成对所有类型都成立的数学公式。' }
      },
      {
        id: 'l35', title: 'lambda：在需要的地方写一个小函数', minutes: 18,
        lead: '“把大于及格线的成绩挑出来”只需要一个很小的判断函数。lambda 让这个规则紧挨着它被使用的地方。',
        objectives: ['会写 lambda 的参数、函数体和捕获列表', '区分按值捕获与按引用捕获', '识别捕获局部引用后逃逸的危险'],
        sections: [
          { title: '先把语法拆成三小块', paragraphs: ['[limit](int score) { return score >= limit; } 是一个 lambda 表达式。方括号说明需要借用哪些外部名字，小括号说明调用参数，大括号说明函数体。可以用 auto passed = ... 保存它，再像函数一样写 passed(75)。它背后产生一个可调用对象，不是某种只能执行一次的特殊语句。', 'lambda 特别适合给算法传入局部规则，例如 count_if 的判断条件、sort 的比较规则。简单规则放在调用附近容易阅读；如果函数体开始包含多层分支和复杂业务，就应该考虑取一个清楚的函数名字，而不是为了短而把整段程序塞进 lambda。'] },
          { title: '捕获一份照片，还是一直看着原物', paragraphs: ['[limit] 按值捕获，保存创建 lambda 时 limit 的副本。后来外部 limit 改变，照片不会跟着改变。[&limit] 按引用捕获，调用时读取原变量，因此能看到后续修改，也依赖原变量仍活着。默认情况下，按值捕获在 lambda 内不能直接修改；mutable 可以允许修改捕获的副本，却仍不会修改外部原变量。', '示例同时保存快照与引用，修改 limit 后得到不同判断结果。二者没有绝对优劣，选择取决于意图。写明确的 [limit] 或 [&limit]，比到处使用 [=]、[&] 更容易审查数据依赖，尤其当代码以后会被移动到另一个作用域时。'] },
          { title: '最危险的是“小函数活得更久”', paragraphs: ['函数返回 lambda、把 lambda 存进容器或交给稍后执行的任务时，它可能比创建它的局部变量活得更久。如果捕获的是局部变量引用，后续调用就会访问已经消失的对象。引用捕获不延长变量寿命，lambda 的轻巧外观也不会让这种问题变安全。', '需要返回一个阈值判断器时，通常按值捕获阈值。若捕获 this，它保存的是指向当前对象的指针，对象必须持续存活；按值捕获 this 并不是自动复制整个对象。先处理同步小函数，再学异步任务，是比较稳妥的顺序。'] }
        ],
        example: { code: `#include <iostream>
#include <vector>
#include <algorithm>
int main() {
    int limit = 60;
    auto snapshot = [limit](int score) { return score >= limit; };
    auto live = [&limit](int score) { return score >= limit; };
    limit = 80;
    std::cout << std::boolalpha << snapshot(70) << ' ' << live(70) << '\\n';
    std::vector<int> scores{50, 70, 80, 95};
    auto count = std::count_if(scores.begin(), scores.end(), live);
    std::cout << count << '\\n';
}`, output: 'true false\n2', explanation: ['snapshot 的副本仍为 60，live 读取的原变量已经是 80。', 'count_if 对每个元素调用 live，80 和 95 满足条件，因此计数为 2。', '所有调用都发生在 limit 的作用域内，所以引用捕获在本例中有效。'] },
        pitfall: '不要返回捕获局部变量引用的 lambda。代码成功编译，不代表稍后调用时变量还活着。',
        quiz: { question: '要从函数返回“是否超过传入阈值”的 lambda，阈值是局部 int，怎样捕获更合适？', options: ['[&threshold]，引用会延长它寿命', '[threshold]，让判断器拥有阈值的副本', '[]，函数体仍可直接读取任意局部变量', '把阈值地址强转成整数'], answer: 1, explanation: '按值捕获让 lambda 携带独立阈值；引用捕获不会让局部变量在函数返回后继续存活。' },
        exercise: { title: '安全返回一个加法器', prompt: '写 makeAdder(int offset)，返回按值捕获 offset 的 lambda。main 中创建 add5，再输出 add5(7)。', hint: 'C++14 起可自动推导普通函数返回类型；本课程使用 C++17。', solution: `#include <iostream>
auto makeAdder(int offset) {
    return [offset](int value) { return value + offset; };
}
int main() {
    auto add5 = makeAdder(5);
    std::cout << add5(7) << '\\n';
}`, explanation: '输出 12。makeAdder 已返回，但 offset 的副本属于返回的可调用对象，后续调用仍然有效。' }
      },
      {
        id: 'l36', title: '异常：失败之后，状态还可靠吗', minutes: 20,
        lead: '有些操作无法完成。异常把失败传给能处理它的地方，资源管理则保证沿途能正确收拾。',
        objectives: ['会使用 throw、try 与按 const 引用 catch', '理解栈展开与 RAII', '区分基本保证、强保证与不抛出保证'],
        sections: [
          { title: '失败不是一个神秘的返回值', paragraphs: ['函数无法接受输入时，可以 throw std::invalid_argument("...")。控制流跳到匹配的 catch，try 块里抛出点后面的正常语句不会继续执行。catch(const std::exception& e) 按引用接住异常，并用 e.what() 查看说明。按基类值捕获可能切片，因此通常用 const 引用。', '异常适合报告无法正常完成的操作，不适合代替每次循环的常规判断。输入结束、用户取消、查找无结果常常可以用返回值表达。选择机制时要说明接口承诺，不要一遇到 if 就改成 throw，也不要为了“程序不退出”把所有错误无声吞掉。'] },
          { title: '抛出之后，局部对象会怎样', paragraphs: ['异常向外传播时，离开的作用域中已经成功构造的局部对象会析构，称为栈展开。vector、string、fstream 等资源对象因此能收拾自己的资源。若刚 new 一块内存就发生异常，裸指针本身的析构不会释放它，这正是 RAII 和智能指针有价值的地方。', '析构函数一般不应抛出异常。特别是在已有异常的栈展开中再抛出并逃离析构，程序会终止。noexcept 是“不允许异常逃出”的承诺，不是“自动忽略异常”；若异常真的逃出 noexcept 函数，通常会调用 terminate。'] },
          { title: '把失败后的状态也写进设计', paragraphs: ['基本保证表示失败后不泄漏资源、对象仍保持有效不变量，但内容可能已经改变。强保证更进一步：失败后可观察状态保持原样，像交易没有提交。示例先检查新成绩，再赋值，非法参数发生时原成绩不会变化。这个顺序就是很小的“先准备，后提交”。', '更复杂的修改可以先在临时对象上准备数据，成功后用安全的交换提交，但必须检查交换等操作的异常条件，不能笼统宣称任何两阶段写法都具有强保证。不抛出保证则适用于承诺不会让异常逃出的操作。三种保证描述的是行为，不是哪个 try/catch 写法更漂亮。'] }
        ],
        example: { code: `#include <iostream>
#include <stdexcept>
class Score {
    int value_ = 60;
public:
    void set(int value) {
        if (value < 0 || value > 100)
            throw std::invalid_argument("score out of range");
        value_ = value;
    }
    int value() const { return value_; }
};
int main() {
    Score score;
    try {
        score.set(120);
        std::cout << "updated\\n";
    } catch (const std::exception& e) {
        std::cout << e.what() << '\\n';
    }
    std::cout << score.value() << '\\n';
}`, output: 'score out of range\n60', explanation: ['非法范围先抛出，value_ 的赋值没有执行，原状态为 60。', 'updated 不会打印，控制流直接进入匹配的 catch。', '捕获完成后继续执行 try/catch 后面的正常语句。'] },
        pitfall: 'catch(...) 后什么也不做，会掩盖失败。至少让调用者知道失败，或在有明确恢复策略时再继续。',
        quiz: { question: '“操作失败后，原对象的可观察状态完全不变”描述哪种保证？', options: ['基本保证', '强保证', '类型推导', '自动内联保证'], answer: 1, explanation: '强保证把失败看成未提交的操作；基本保证只要求对象仍有效且不泄漏资源，内容可改变。' },
        exercise: { title: '拒绝除零', prompt: '编写 divide(double a,double b)，当 b 为 0 时抛出 invalid_argument。测试 divide(8,2) 与 divide(8,0)，在 main 捕获并打印消息。', hint: '对这组明确的零输入可直接判断 b == 0.0；这里不讨论近似为零的业务容差。', solution: `#include <iostream>
#include <stdexcept>
double divide(double a, double b) {
    if (b == 0.0) throw std::invalid_argument("division by zero");
    return a / b;
}
int main() {
    try {
        std::cout << divide(8, 2) << '\\n';
        std::cout << divide(8, 0) << '\\n';
    } catch (const std::exception& e) {
        std::cout << e.what() << '\\n';
    }
}`, explanation: '先输出 4，再输出 division by zero。函数将非法输入交给调用者处理，不会伪造一个看似正常的商。' }
      }
    ]
  },
  {
    id: 'ch10', number: 10, title: 'STL 与算法',
    description: '容器负责保存，迭代器负责走访，算法负责处理。把现成工具用对，比重复造轮子更重要。',
    lessons: [
      {
        id: 'l37', title: '迭代器：范围的起点与终点', minutes: 18,
        lead: '算法不必知道盒子的全部结构，只需要知道从哪里开始、到哪里停止。迭代器把这种约定写进代码。',
        objectives: ['理解半开区间 [begin,end)', '会遍历和安全删除 vector 元素', '认识迭代器失效与范围 for 的限制'],
        sections: [
          { title: '终点是门口，不是最后一张桌子', paragraphs: ['begin() 指向第一个元素，end() 指向最后一个元素之后的位置。算法通常处理 [begin,end)，包含起点、不包含终点。这样空容器的 begin 等于 end，不必为“没有最后一个元素”编造下标。end 可以参与比较，却不能解引用；写 *v.end() 就越过了有效范围。', '迭代器看起来有点像指针，但并不是所有迭代器都支持减法或加下标。vector 的迭代器支持随机访问；list 的迭代器需要逐步移动。std::distance 可按迭代器能力计算距离，复杂度可能不同。别因为 ++it 能工作，就假定 it + 5 也一定存在。'] },
          { title: '删除后要接住新的位置', paragraphs: ['vector::erase 会移动后面的元素，使删除位置及其之后的迭代器和引用失效。正确循环让 it = v.erase(it) 接住返回的新位置；没有删除时才 ++it。若删除后仍然使用旧 it，或者又无条件加一，就可能访问无效位置或跳过紧邻的元素。', 'push_back 触发重新分配时，所有元素指针、引用和迭代器都会失效；未重新分配时，旧 end 仍会失效。reserve 可以减少重新分配，但不能一劳永逸地保证所有迭代器永远有效。每次修改容器之前，都应该检查该操作的失效规则。'] },
          { title: '范围 for 也借用了一对边界', paragraphs: ['for (int x : v) 每次复制元素，for (int& x : v) 可以修改元素本身，for (const int& x : v) 只读访问。范围 for 背后也使用起点与终点，因此循环中随意向同一个 vector 追加或删除元素，可能让隐藏的迭代器失效。需要改变结构时，换成明确控制位置的循环。', '示例按迭代器删除奇数，是为了看清位置变化。只做“保留满足条件的元素”时，C++17 还常用 erase-remove 写法：remove_if 先把保留元素移到前面，再 erase 真正缩短容器。remove_if 本身不会改变容器 size，这个名字容易让初学者误会。'] }
        ],
        example: { code: `#include <iostream>
#include <vector>
int main() {
    std::vector<int> values{1, 2, 3, 4, 5, 6};
    for (auto it = values.begin(); it != values.end(); ) {
        if (*it % 2 != 0) it = values.erase(it);
        else ++it;
    }
    for (std::size_t i = 0; i < values.size(); ++i) {
        if (i != 0) std::cout << ' ';
        std::cout << values[i];
    }
    std::cout << '\\n';
}`, output: '2 4 6', explanation: ['每轮先确认 it != end 才解引用，空容器也能安全结束。', 'erase 返回删掉元素后的下一个有效位置，连续奇数也不会漏掉。', 'vector 中逐个删除可能总计达到 O(n²)；学习语义后应考虑批量删除。'] },
        pitfall: 'end 不是最后一个元素。判断非空后最后一个元素可用 back()；不要解引用 end。',
        quiz: { question: 'vector 删除 it 指向的元素后，接下来最稳妥的写法是什么？', options: ['继续解引用原来的 it', 'it = v.erase(it)，使用返回的新迭代器', '把 it 设置成 nullptr', '无条件 ++it 两次'], answer: 1, explanation: '旧迭代器已失效。erase 的返回值表达删除后应继续处理的位置。' },
        exercise: { title: '批量删除负数', prompt: '从 {3,-1,0,-5,7} 中删除所有负数，使用 C++17 的 erase-remove 写法并输出剩余元素。', hint: 'auto end = remove_if(...); 然后 v.erase(end,v.end())。', solution: `#include <iostream>
#include <vector>
#include <algorithm>
int main() {
    std::vector<int> v{3, -1, 0, -5, 7};
    auto newEnd = std::remove_if(v.begin(), v.end(), [](int x) { return x < 0; });
    v.erase(newEnd, v.end());
    for (std::size_t i = 0; i < v.size(); ++i) {
        if (i) std::cout << ' ';
        std::cout << v[i];
    }
    std::cout << '\\n';
}`, explanation: '输出 3 0 7。remove_if 线性整理元素，erase 一次删掉尾部范围，比循环中多次移动 vector 更合适。' }
      },
      {
        id: 'l38', title: '按键查找：map、set 与 unordered_map', minutes: 18,
        lead: '按学号找到成绩，比反复从第一行扫到最后一行方便。关联容器围绕“键”组织数据。',
        objectives: ['区分有序和无序关联容器', '会统计词频并使用 find 查询', '理解 operator[] 插入行为与复杂度边界'],
        sections: [
          { title: '字典的词条，与名单的去重', paragraphs: ['map<Key,Value> 保存键值对，键唯一，并按比较规则有序排列。set<Key> 只保存唯一键，适合去重和判断是否出现过。multimap、multiset 则允许重复键。常见 map、set 实现使用平衡树，但学习接口时重点是有序性和查找、插入的对数复杂度保证，而不是把某种树形当成唯一规定。', 'unordered_map 和 unordered_set 使用哈希组织，遍历顺序没有固定排序保证。查找平均通常为 O(1)，最坏可能是 O(n)，取决于哈希分布等条件。因此不能把“无序容器一定更快”背成结论；若需要有序遍历、范围查找或可预测的对数界，有序容器就有意义。'] },
          { title: '读取与插入，要分清一字符的差别', paragraphs: ['counts[word] 在键不存在时会插入它，并把 int 值初始化为 0，因此 ++counts[word] 很适合统计词频。但如果只是查询某个人的成绩，scores[id] 可能悄悄增加一个成绩为 0 的学生。只读查询使用 find；一定存在时可用 at，但不存在会抛出异常。', 'find 返回迭代器，找不到时等于 end。先比较再访问 it->second，才能保证读取有效。map 的元素包含 first 键和 second 值，键不能通过迭代器随意修改，否则就会破坏组织规则。修改键通常需要移除并重新插入，或使用更进阶的节点接口。'] },
          { title: '选容器前，先写出真正需求', paragraphs: ['只有几十个元素时，vector 线性查找可能已经足够简单；不要为了展示学过哈希表就引入复杂结构。若需要每次按字典序打印词频，map 能直接提供这种遍历；若只想快速查找大量键，不在意顺序，可以考虑 unordered_map。性能选择应由规模和操作模式共同决定。', '示例用 map 统计 apple、pear、apple，并故意查询一个不存在的键。查询完成后 size 没变，证明 find 没有插入。示例输出顺序是 apple 再 pear，来自 map 的有序规则；若换 unordered_map，不能再把这行顺序写成固定预期。'] }
        ],
        example: { code: `#include <iostream>
#include <map>
#include <string>
#include <vector>
int main() {
    std::vector<std::string> words{"apple", "pear", "apple"};
    std::map<std::string, int> counts;
    for (const auto& word : words) ++counts[word];
    for (const auto& item : counts)
        std::cout << item.first << ' ' << item.second << '\\n';
    auto it = counts.find("orange");
    std::cout << (it == counts.end() ? "not found" : "found") << '\\n';
    std::cout << counts.size() << '\\n';
}`, output: 'apple 2\npear 1\nnot found\n2', explanation: ['第一次 [] 会插入默认整数 0，再进行加一；第二次 apple 直接更新已有值。', 'map 按字符串比较规则排列键，输出顺序可预测。', 'find("orange") 返回 end，并不会让容器增加第三项。'] },
        pitfall: 'unordered_map 的遍历顺序不能用来表示排名，且可能随插入和重新哈希改变。需要顺序时明确排序或使用 map。',
        quiz: { question: '只是查看 map 中某学号是否存在，应优先使用哪项操作？', options: ['scores[id]，保证无副作用', 'scores.clear()', 'scores.find(id)', 'scores[id] = 0'], answer: 2, explanation: 'find 不会插入不存在的键。operator[] 可能创建默认值，适合有意更新而非纯查询。' },
        exercise: { title: '去重并排序', prompt: '将 {5,2,5,1,2} 放入 set<int>，输出去重后的递增序列和元素数量。', hint: 'set 的范围构造可以接收 vector 的 begin 与 end。', solution: `#include <iostream>
#include <vector>
#include <set>
int main() {
    std::vector<int> input{5, 2, 5, 1, 2};
    std::set<int> unique(input.begin(), input.end());
    bool first = true;
    for (int x : unique) {
        if (!first) std::cout << ' ';
        first = false;
        std::cout << x;
    }
    std::cout << '\\n' << unique.size() << '\\n';
}`, explanation: '输出 1 2 5，数量 3。set 同时表达唯一性和有序性，不需要额外调用 sort。' }
      },
      {
        id: 'l39', title: '排序与查找：先满足算法的前提', minutes: 20,
        lead: '二分查找速度快，是因为它利用了已经整理好的顺序。算法没有魔法，前提条件就是它的地基。',
        objectives: ['会使用 sort、find 与 lower_bound', '理解比较器的严格弱序要求', '区分比较次数和迭代器移动的复杂度'],
        sections: [
          { title: 'sort 要的是“严格排在前面”', paragraphs: ['std::sort 默认按小于关系递增排序，也可以传比较函数。比较器回答“a 应该严格排在 b 前面吗”，不是“a 不比 b 大”。所以 return a <= b 不合格，因为同一个值会被认为排在自己前面。比较规则需要满足严格弱序；初学时先用稳定一致的 < 规则，遇到多条件就明确依次比较。', '例如按成绩降序、同分按学号升序，先检查成绩是否不同，再用学号 <。sort 复杂度为 O(n log n) 比较，要求随机访问迭代器；std::list 不能直接交给它，应使用 list 的成员 sort。sort 不保证相同排序键的元素保留原顺序，需要这种保证时考虑 stable_sort。'] },
          { title: 'find 不要求排序，lower_bound 要求范围合规', paragraphs: ['find 从头到尾找相等元素，最坏线性比较，适用于未排序范围。lower_bound 寻找第一个不小于目标的位置。递增排序的范围满足它的常见使用前提；若范围未按同样规则分区，就不能期待正确结果。自定义排序后也要用相应的比较规则查找。', 'lower_bound 返回的是插入位置，不一定就是目标。要确认存在，先判断 it != end，再判断 *it == target。在 {2,4,4,8} 里找 4 得到第一个 4，找 5 得到 8，找 10 得到 end。不要把“得到一个位置”与“找到了相等值”混为一谈。'] },
          { title: '对数比较，不一定对数行走', paragraphs: ['在 vector 上，lower_bound 每次可以直接跳到中间位置，比较与移动都很有效率。对非随机访问迭代器，它仍可具有对数比较次数，但迭代器移动可能线性。若在 map 或 set 中查询，优先使用容器自己的 lower_bound，它能利用内部树结构。', '本课的复杂度讨论以元素数量 n 为规模，不代表固定毫秒数。小数据上一次线性查找可能更简单；大数据上频繁查询则值得先排序。还要算上整理成本：如果只查询一次，把未排序数据全部 sort 后再二分，不一定比直接 find 更划算。'] }
        ],
        example: { code: `#include <iostream>
#include <vector>
#include <algorithm>
#include <iterator>
int main() {
    std::vector<int> v{8, 4, 2, 4};
    std::sort(v.begin(), v.end());
    for (std::size_t i = 0; i < v.size(); ++i) {
        if (i) std::cout << ' ';
        std::cout << v[i];
    }
    std::cout << '\\n';
    auto it = std::lower_bound(v.begin(), v.end(), 4);
    std::cout << std::distance(v.begin(), it) << '\\n';
    auto pos = std::lower_bound(v.begin(), v.end(), 5);
    if (pos != v.end()) std::cout << *pos << '\\n';
}`, output: '2 4 4 8\n1\n8', explanation: ['sort 建立递增顺序，满足这里的 lower_bound 前提。', '第一个 4 位于从 0 开始的下标 1；distance 计算起点到它的距离。', '找 5 返回 8 的位置，说明 lower_bound 本身不是相等查找。'] },
        pitfall: '比较器不能写 <=，也不能在排序期间随意改变排序规则或修改被比较对象。违反要求可能导致未定义行为。',
        quiz: { question: '递增序列 {2,4,8} 对 5 调用 lower_bound，得到什么？', options: ['指向 4 的迭代器', '指向 8 的迭代器', '一定得到 end', '自动插入 5'], answer: 1, explanation: '它找第一个不小于 5 的元素，因此是 8。算法不会修改或插入元素。' },
        exercise: { title: '确认二分结果', prompt: '在递增 vector {1,3,3,7} 中判断 3 和 4 是否存在。封装 contains 函数，使用 lower_bound 并检查返回位置。', hint: '先检查 it != end；&& 会短路，因此之后才可以读取 *it。', solution: `#include <iostream>
#include <vector>
#include <algorithm>
bool contains(const std::vector<int>& sorted, int value) {
    auto it = std::lower_bound(sorted.begin(), sorted.end(), value);
    return it != sorted.end() && *it == value;
}
int main() {
    std::vector<int> v{1, 3, 3, 7};
    std::cout << std::boolalpha << contains(v, 3) << ' ' << contains(v, 4) << '\\n';
}`, explanation: '输出 true false。函数名称之外，还必须说明参数 sorted 已递增排序，这个前提由调用者满足。' }, demo: 'sort'
      },
      {
        id: 'l40', title: '栈、队列与优先队列', minutes: 18,
        lead: '叠盘子、排队买票、优先处理最紧急的任务，对应三种不同的取出规则。',
        objectives: ['理解 LIFO、FIFO 与按优先级取出', '会安全使用 stack、queue、priority_queue', '知道 pop 不返回元素，top/front 要先检查非空'],
        sections: [
          { title: '入口和出口决定处理顺序', paragraphs: ['stack 是后进先出，最后压入的元素最先取出，就像叠起来的盘子。常用于括号匹配、撤销操作和深度优先搜索。queue 是先进先出，先到者先离开，就像排队，适用于任务缓冲和广度优先搜索。比喻说明顺序，不代表程序真的需要模拟盘子或人。', '它们是容器适配器：对底层容器提供受限接口。push 放入，stack::top 查看栈顶，queue::front 查看队头，pop 仅删除。pop 没有返回值，所以通常先保存 top 或 front，再调用 pop。空容器上调用这些读取或删除操作不安全，应先用 empty 判断。'] },
          { title: '优先队列不等于完全排好序的数组', paragraphs: ['priority_queue 每次暴露当前最高优先级元素。默认对 int，数值最大的在 top；使用 std::greater<int> 可以让最小值在 top。它常借助堆结构实现，但内部元素并不按遍历顺序完全排序，而且接口不提供任意位置的普通迭代访问。', '插入和删除顶部通常需要 O(log n)，读取 top 为 O(1)。如果要一次输出所有元素，就要不断 top、pop，整体通常 O(n log n)，并且会消耗队列。如果需要反复完整遍历一个排序结果，排序后的 vector 可能更适合。'] },
          { title: '同一种数据，三种工作规则', paragraphs: ['示例把 2、5、1 依次放入三个适配器。栈最先取 1，队列最先取 2，默认优先队列最先取 5。容器选择不是看数据是什么，而是看下一步应该按什么规则处理。一个“成绩列表”既可以排序后展示，也可以进队列逐条计算，需求决定结构。', '括号匹配需要记住最近尚未配对的左括号，因此适合栈；按提交顺序处理作业适合队列；反复取最高分适合优先队列。写代码前先手工跟踪三四个元素的进出，比仅背 push 和 pop 的名字更有用。'] }
        ],
        example: { code: `#include <iostream>
#include <stack>
#include <queue>
#include <initializer_list>
int main() {
    std::stack<int> s;
    std::queue<int> q;
    std::priority_queue<int> p;
    for (int x : {2, 5, 1}) { s.push(x); q.push(x); p.push(x); }
    std::cout << s.top() << ' ' << q.front() << ' ' << p.top() << '\\n';
    s.pop(); q.pop(); p.pop();
    std::cout << s.top() << ' ' << q.front() << ' ' << p.top() << '\\n';
}`, output: '1 2 5\n5 5 2', explanation: ['第一行直接展示三种规则；相同输入顺序产生不同下一元素。', 'pop 只移除当前顶部或队头，所以需要读取时先用对应访问函数。', '本例每次读取前都已知还剩元素；通用循环应使用 while (!container.empty())。'] },
        pitfall: '不要写 int x = s.pop();。pop 的返回类型是 void；应先读 top，再 pop，并保证非空。',
        quiz: { question: '想按输入顺序处理所有任务，应选择什么？', options: ['stack', 'queue', '默认 priority_queue', '随机打乱的 vector'], answer: 1, explanation: 'queue 采用先进先出，保持到达次序。stack 反转次序，优先队列按优先级处理。' },
        exercise: { title: '最小值优先', prompt: '使用小顶优先队列插入 6、2、9、1，不断取出并输出递增序列。', hint: '类型写 priority_queue<int,vector<int>,greater<int>>，需要 functional。', solution: `#include <iostream>
#include <queue>
#include <vector>
#include <functional>
#include <initializer_list>
int main() {
    std::priority_queue<int, std::vector<int>, std::greater<int>> q;
    for (int x : {6, 2, 9, 1}) q.push(x);
    bool first = true;
    while (!q.empty()) {
        if (!first) std::cout << ' ';
        first = false;
        std::cout << q.top();
        q.pop();
    }
    std::cout << '\\n';
}`, explanation: '输出 1 2 6 9。每次 top 都是当前最小值，循环结束时队列已经为空。' }
      }
    ]
  },
  {
    id: 'ch11', number: 11, title: '文件与工程',
    description: '从单个练习走向真正的小项目：保存数据、拆分文件、定位错误，并分析规模增长。',
    lessons: [
      {
        id: 'l41', title: '把数据留下来：文件流与逐行解析', minutes: 18,
        lead: '程序结束后，内存里的成绩会消失。文件让数据能保存到下一次运行，但读回来的文本仍需要检查。',
        objectives: ['会使用 ifstream、ofstream 并检查失败', '会用 getline 与 istringstream 解析一行', '理解文件格式约定和 RAII 关闭'],
        sections: [
          { title: '文件流与 cout 使用相似的接口', paragraphs: ['ofstream 用于写文件，ifstream 用于读文件，都在 fstream 头文件中。创建流后先检查是否成功打开，再使用 << 或 >>。默认创建普通输出文件会截断原内容，追加需要 std::ios::app。第一次练习应该使用专门的练习文件，理解覆盖行为后再操作重要数据。', '相对路径依据程序的工作目录解析，不一定是源代码所在的目录。如果“明明有文件却打不开”，先检查运行时工作目录。流对象离开作用域会关闭文件；示例特意让写入流所在的大括号先结束，再用输入流读取，保证写入和关闭已完成。'] },
          { title: '先分行，再解释每一行', paragraphs: ['while (getline(in,line)) 每次读取完整的一行，适合保留记录边界。把 line 放入 istringstream 后，可以像读取 cin 一样拆出姓名和成绩。这样一行损坏不会自动把下一行的数据拼进来，错误报告也能指出行号。不要用 while(!in.eof()) 预测读取，读取操作本身的结果才可靠。', '输入不是自己生成时，需要检查字段数量、成绩范围和多余内容。示例的简单格式是“无空格姓名 整数成绩”，因此不能直接保存带空格的全名。CSV 还涉及引号和逗号转义，不能把简单按逗号切分当成完整 CSV 解析；格式越复杂，越应该采用成熟库。'] },
          { title: '打开成功，还不代表以后都成功', paragraphs: ['磁盘写满、权限变化或设备错误也可能让后续写入失败，因此重要写入完成后需要检查流状态。本例显式 close，再检查输出流，读取结束后用 bad 检查严重 I/O 错误。正常到达文件尾不是异常故障，解析失败与底层读取失败也应分开说明。', '保存关键数据时还要考虑半写文件的问题：可以先写临时文件，确认成功，再按平台规则替换目标。这里不实现完整的事务保存，只演示基础流与格式验证。程序面对错误不应静默生成看似正常的成绩；能告诉用户哪一行不合法，也是工程质量的一部分。'] }
        ],
        example: { code: `#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
int main() {
    const char* path = "cpp-course-scores.txt";
    {
        std::ofstream out(path);
        if (!out) { std::cerr << "cannot open output\\n"; return 1; }
        out << "Lin 88\\nChen 92\\n";
        out.close();
        if (!out) { std::cerr << "write failed\\n"; return 1; }
    }
    std::ifstream in(path);
    if (!in) { std::cerr << "cannot open input\\n"; return 1; }
    std::string line;
    int lineNumber = 0;
    while (std::getline(in, line)) {
        ++lineNumber;
        std::istringstream row(line);
        std::string name, extra;
        int score = 0;
        if (!(row >> name >> score) || (row >> extra) || score < 0 || score > 100) {
            std::cerr << "bad line " << lineNumber << '\\n';
            return 1;
        }
        std::cout << name << ' ' << score << '\\n';
    }
    if (in.bad()) { std::cerr << "read failed\\n"; return 1; }
}`, output: 'Lin 88\nChen 92', explanation: ['程序会在工作目录创建或覆盖 cpp-course-scores.txt，示例输出以文件可写、读取成功为前提。', 'row >> extra 用于拒绝第三个字段，成绩范围检查用于拒绝非法值。', '写、读分开两个作用域，资源生命周期清楚，失败时返回非零退出码。'] },
        pitfall: 'while (!in.eof()) 会在读到末尾后多处理一次失败读取。写 while (getline(in,line)) 或 while (in >> value)。',
        quiz: { question: '逐行读取文件时，哪种循环依据最可靠？', options: ['while (!in.eof())', 'while (std::getline(in,line))', '固定读取一万次', '只检查打开文件成功，不检查读取'], answer: 1, explanation: '读取操作成功才处理这一行；eof 只有在尝试读取并遇到末尾后才会更新。' },
        exercise: { title: '解析一行成绩', prompt: '不用真实文件，使用 istringstream 解析 "Wang 95"，检查没有额外字段且成绩在范围内，输出 Wang: 95。', hint: '把字符串流当作一行输入，失败时输出 invalid 并返回非零值。', solution: `#include <iostream>
#include <sstream>
#include <string>
int main() {
    std::istringstream row("Wang 95");
    std::string name, extra;
    int score = 0;
    if (!(row >> name >> score) || (row >> extra) || score < 0 || score > 100) {
        std::cout << "invalid\\n";
        return 1;
    }
    std::cout << name << ": " << score << '\\n';
}`, explanation: '字符串流让解析逻辑可以单独测试，不必每次创建文件。之后把同一逻辑接到 getline 读到的字符串上即可。' }
      },
      {
        id: 'l42', title: '多个文件怎样变成一个程序', minutes: 18,
        lead: '头文件告诉其他文件“这里有什么”，源文件提供“具体怎么做”。编译器各自处理，再由链接器接起来。',
        objectives: ['区分声明、定义与翻译单元', '理解头文件保护和链接错误', '会阅读简单多文件构建命令'],
        sections: [
          { title: '菜单和厨房不必印在同一张纸上', paragraphs: ['函数声明 double mean(const vector<int>&) 说明名字、参数和返回类型，函数定义还包含函数体。头文件 .hpp 常放声明、类型定义和必须可见的模板定义；.cpp 常放普通函数实现。调用者先看声明就能完成类型检查，链接阶段再把实际函数实现接上。', '头文件经 #include 参与预处理，效果接近把内容放到包含位置。每个 .cpp 连同它包含的内容形成一个翻译单元。不要 #include "stats.cpp" 来复用实现，否则容易把同一函数定义带入多个翻译单元，出现重复定义；包含它的头文件，并把 .cpp 作为独立源文件编译。'] },
          { title: '先让每一份声明可靠地出现一次', paragraphs: ['头文件保护使用 #ifndef、#define、#endif，避免同一翻译单元多次包含头文件产生重复类定义。也常见 #pragma once，但它不是 ISO C++ 标准规定的指令。普通函数的非 inline 定义通常只能在整个程序中有一份；头文件保护并不会消除不同 .cpp 之间的重复定义。', '头文件应自己包含它所使用的标准类型所需头文件，不依赖别的文件碰巧先包含 vector。不要在公共头文件中写 using namespace std，这会把名字影响扩散到所有包含者。类内定义的成员函数与模板有另外的定义规则，不必机械套用“任何函数体都不能放头文件”。'] },
          { title: '编译报错与链接报错是两步的事', paragraphs: ['例如 stats.hpp 声明 mean，stats.cpp 定义 mean，main.cpp 包含头文件并调用。GCC 或 Clang 的简单命令可写 g++ -std=c++17 -Wall -Wextra main.cpp stats.cpp -o study。漏掉 stats.cpp 时，各文件可能成功编译，却在链接时提示找不到 mean 的定义；重复实现则可能提示多重定义。', '项目变大后可以使用 CMake 等构建工具来记录源文件、依赖和编译选项，但构建工具不会替你解决语法或接口不匹配。下面提供单文件等价程序，方便先直接运行；随后把函数声明移到头文件，定义移到 stats.cpp，main 留在 main.cpp，再用上述命令构建。'] }
        ],
        example: { code: `#include <iostream>
#include <vector>
#include <stdexcept>
// In stats.hpp: declaration plus its own includes and header guard.
double mean(const std::vector<int>& values);
// In stats.cpp: definition; include stats.hpp there.
double mean(const std::vector<int>& values) {
    if (values.empty()) throw std::invalid_argument("empty data");
    double total = 0;
    for (int x : values) total += x;
    return total / values.size();
}
// In main.cpp: include stats.hpp, then call the declared function.
int main() {
    std::vector<int> scores{80, 90, 100};
    std::cout << mean(scores) << '\\n';
}`, output: '90', explanation: ['这是可直接编译的单文件等价版，注释标出拆分时各部分的位置。', 'mean 的声明没有函数体；后面的定义提供实现，参数和返回类型必须匹配。', '空数据不拥有有意义的平均值，因此函数明确拒绝，而不是除以零。'] },
        pitfall: '头文件保护只解决同一翻译单元中的重复包含，不会让头文件里的普通函数定义在整个程序中自动只剩一份。',
        quiz: { question: 'main.cpp 成功编译，但链接时报 undefined reference to mean，最应先检查什么？', options: ['字体是否支持中文', 'mean 的定义是否存在并参与链接，签名是否一致', '把 main 改名为 start', '增加更多 using namespace'], answer: 1, explanation: '声明足够让调用处通过编译，链接还需要匹配的实际定义，并且实现源文件必须参与构建。' },
        exercise: { title: '练习声明与定义', prompt: '先在 main 前声明 int square(int)，把定义放到 main 后，再输出 square(6)。之后可自行拆成 math.hpp、math.cpp、main.cpp。', hint: '声明结尾是分号；定义包含函数体。', solution: `#include <iostream>
int square(int value);
int main() {
    std::cout << square(6) << '\\n';
}
int square(int value) { return value * value; }
`, explanation: '输出 36。调用处先看到声明就能检查参数；实现写在后面，完整程序里仍只有一份定义。' }
      },
      {
        id: 'l43', title: '定位错误：断点、测试与检查工具', minutes: 20,
        lead: '“结果不对”只是起点。把失败缩小成一个可重复的小例子，再观察第一处偏离预期的位置。',
        objectives: ['能区分编译错误、运行错误与逻辑错误', '会设计边界测试并使用 assert', '认识调试器、警告和 Sanitizer 的作用范围'],
        sections: [
          { title: '从可重复的输入开始', paragraphs: ['调试先保存最小失败输入和预期结果。排序出错时，先用三个元素，而不是直接盯着一万行输出。把“我觉得应该对”改成“输入 {3,1,2} 应得到 {1,2,3}”，问题就可验证。编译错误先修第一条有意义的诊断，后面的几十条可能只是同一个语法错误引发的连锁反应。', '调试器的断点让程序暂停在某一行，可以观察变量、单步执行和查看调用栈。循环中重点看进入前状态、条件是否成立、执行后状态。观察到异常值时继续追问它第一次出现在哪里，而不是只在最终输出处修改结果。打印日志也有用，但不能代替对控制流的理解。'] },
          { title: '测试应该挑战规则的边界', paragraphs: ['及格函数至少测 59、60、61，因为边界最容易暴露 > 与 >= 的区别。容器算法考虑空、一项、重复、已经有序和逆序数据。测试预期应独立推导，不能把被测函数算出的结果再当作答案，否则测试只会证明函数等于自己。', 'assert 适合验证程序内部应该成立的条件。定义 NDEBUG 时断言可以被移除，因此不要在 assert 中放必须执行的副作用，也不要靠它校验真实用户输入。发布程序需要明确的输入检查和错误处理；项目测试可以使用专门框架，本课先用小而清楚的断言示范。'] },
          { title: '让工具替你发现难观察的问题', paragraphs: ['GCC、Clang 常用 -Wall -Wextra 提示可疑写法，-g 提供调试信息。支持的 Clang/GCC 环境可尝试 -fsanitize=address,undefined 配合 -O1 -g -fno-omit-frame-pointer，在测试运行时检查部分越界、释放后使用和未定义行为。不同平台和工具链的可用性不同，Windows 的 MSVC 选项也不同。', 'Sanitizer 是动态检查，只有执行到的问题才可能被发现，也不会证明算法逻辑正确。一次没报错，不等于没有缺陷。有效流程是小测试确认业务结果、编译器警告检查写法、调试器定位偏差、检查工具发现内存和语言层面的错误，各自解决不同问题。'] }
        ],
        example: { code: `#include <iostream>
#include <cassert>
bool passed(int score) { return score >= 60; }
int clampScore(int score) {
    if (score < 0) return 0;
    if (score > 100) return 100;
    return score;
}
int main() {
    assert(!passed(59));
    assert(passed(60));
    assert(passed(61));
    assert(clampScore(-1) == 0);
    assert(clampScore(0) == 0);
    assert(clampScore(100) == 100);
    assert(clampScore(101) == 100);
    std::cout << "boundary checks passed\\n";
}`, output: 'boundary checks passed', explanation: ['这组测试专门选择临界点，能发现把 >= 写成 > 的错误。', '断言没有副作用，即使关闭断言也不改变程序必要行为。', 'clampScore 的业务约定是截到区间端点；它不同于上一课拒绝非法输入的 set。'] },
        pitfall: '不要写 assert(++count == 3) 让计数成为断言的一部分。关闭断言后 ++count 就不会执行，程序行为会改变。',
        quiz: { question: '为什么不能只依赖 assert 检查用户输入？', options: ['assert 从来不检查条件', 'assert 可能在发布构建中被关闭', 'assert 只能比较字符串', 'assert 会自动修改输入'], answer: 1, explanation: '断言是内部开发检查，可能被 NDEBUG 移除。真实输入验证必须始终执行，并提供正常错误处理。' },
        exercise: { title: '最大值的边界测试', prompt: '实现 larger(int,int)，用 assert 测试 (2,5)、(5,2)、(3,3)、(-2,-7)，所有断言通过后输出 ok。', hint: '负数测试可发现把最大值初始设成 0 这类错误；这里直接比较两参数。', solution: `#include <iostream>
#include <cassert>
int larger(int a, int b) { return a < b ? b : a; }
int main() {
    assert(larger(2, 5) == 5);
    assert(larger(5, 2) == 5);
    assert(larger(3, 3) == 3);
    assert(larger(-2, -7) == -2);
    std::cout << "ok\\n";
}`, explanation: '四类输入检验了不同顺序、相等和负值。测试规模很小，但预期明确，比仅测一次普通输入更有价值。' }
      },
      {
        id: 'l44', title: '规模变大后：复杂度、链表与搜索树', minutes: 20,
        lead: '十个元素时的慢，不一定能看出来；十万个元素时，算法的增长方式会决定程序能不能用。',
        objectives: ['理解 O(1)、O(log n)、O(n)、O(n²) 的增长', '比较连续数组与链表的主要代价', '认识二叉搜索树及平衡的重要性'],
        sections: [
          { title: '先算工作量怎样增长', paragraphs: ['复杂度描述输入规模增长时的数量级，不是精确秒数。遍历 n 项通常 O(n)，两层各 n 次循环常为 O(n²)，每次把待查范围减半通常 O(log n)。n 从 1000 增到 10000，线性工作量约增十倍，平方量约增百倍。常数、缓存、输入分布仍影响真实耗时。', '不能只数代码行数判断复杂度：一行 sort 内部也会进行许多比较。也不能把每层循环都机械乘成 n；如果内层只是固定十次，总量仍是 O(n)。分析时写清循环次数和每次操作的代价，再组合它们，比背口诀可靠。'] },
          { title: '数组擅长直达，链表擅长局部接线', paragraphs: ['vector 连续存储，按下标访问为 O(1)，中间插入删除通常需要移动后续元素，为 O(n)。单链表节点保存数据和下一节点的地址，沿链访问第 k 个位置要逐步走，为 O(n)。已知前驱节点时，局部插入或删除可以 O(1)，但寻找这个位置仍可能 O(n)。', '链表还要支付节点分配、指针空间和较差局部性的成本。因此“插入频繁就一定用链表”不完整，必须看位置怎样得到、是否需要随机访问、数据规模如何。标准库 forward_list 和 list 提供链表接口；教学可手写节点理解链接，工程优先使用管理正确的现成容器。'] },
          { title: '二叉搜索树：顺序藏在分支里', paragraphs: ['二叉搜索树常约定左子树键小于当前键，右子树键大于当前键，重复键还需额外规定。查找时根据比较只走一边，代价与树高有关。若形状均衡，高度约为 log n；若按递增顺序插入普通未平衡树，可能退化成一条链，最坏查找 O(n)。', 'map、set 提供有序关联操作的对数复杂度保证，常通过平衡树实现；并不等于任何手写二叉树都自动一样快。下面的二分查找在已排序 vector 上演示“每次减半”，并把区间表示为 [left,right)。它与树查找共享缩小范围的思想，但数据结构和内存布局不同。'] }
        ],
        example: { code: `#include <iostream>
#include <vector>
#include <cstddef>
bool binaryContains(const std::vector<int>& sorted, int target) {
    std::size_t left = 0, right = sorted.size();
    while (left < right) {
        std::size_t mid = left + (right - left) / 2;
        if (sorted[mid] < target) left = mid + 1;
        else right = mid;
    }
    return left < sorted.size() && sorted[left] == target;
}
int main() {
    std::vector<int> v{1, 3, 5, 7, 9};
    std::cout << std::boolalpha << binaryContains(v, 7) << ' '
              << binaryContains(v, 8) << '\\n';
    std::vector<int> empty;
    std::cout << binaryContains(empty, 1) << '\\n';
}`, output: 'true false\nfalse', explanation: ['半开区间允许 right 等于 size，却从不直接读取 sorted[right]。', 'mid 用 left + (right-left)/2，避免直接 left+right 可能的加法溢出。', '空序列不进入循环，最后的 && 短路阻止读取不存在的元素。'] },
        pitfall: '“链表插入 O(1)”必须附带已经拿到合适位置的前提；如果先遍历寻找位置，整个操作仍可能 O(n)。',
        quiz: { question: '未平衡的二叉搜索树按递增顺序插入不同键，最坏可能发生什么？', options: ['一定保持完全平衡', '退化成近似链表，查找达到 O(n)', '所有查找都自动 O(1)', '插入顺序不可能影响形状'], answer: 1, explanation: '普通搜索树的复杂度与高度有关。没有平衡机制时，单调插入可能让每个节点只有一个后继。' },
        exercise: { title: '一次遍历求最大值', prompt: '使用 optional<int> 实现 maxValue(vector<int>)，空序列返回 nullopt，非空只遍历一次。测试 {-5,-2,-9} 和空序列。', hint: '不要用 0 当最大值初值；第一项或空结果才符合负数和空输入。', solution: `#include <iostream>
#include <vector>
#include <optional>
std::optional<int> maxValue(const std::vector<int>& v) {
    if (v.empty()) return std::nullopt;
    int result = v.front();
    for (int x : v) if (x > result) result = x;
    return result;
}
int main() {
    auto a = maxValue({-5, -2, -9});
    auto b = maxValue({});
    if (a) std::cout << *a << '\\n';
    if (!b) std::cout << "empty\\n";
}`, explanation: '输出 -2 与 empty。时间 O(n)，额外空间 O(1)。optional 是 C++17 的可选值类型，下一章会正式展开。' }
      }
    ]
  },
  {
    id: 'ch12', number: 12, title: '现代 C++ 与综合实践',
    description: '把所有权写清，把缺失值写清，最后完成一个可以保存与查询的成绩管理项目。',
    lessons: [
      {
        id: 'l45', title: '移动语义与智能指针：把所有权说清楚', minutes: 20,
        lead: '复制一箱书和把整箱书交给另一个人，是不同操作。移动语义用于允许后者，智能指针用于说明谁负责保管。',
        objectives: ['理解 std::move 是类型转换而非实际搬运', '会使用 make_unique 与转移 unique_ptr', '区分独占、共享和借用以及共享循环'],
        sections: [
          { title: 'move 给出许可，具体类型决定怎样搬', paragraphs: ['std::move(x) 本身不会搬动数据，它把表达式转换成可以选择移动操作的形式。真正发生什么，由随后调用的构造函数、赋值运算或其他函数决定。string、vector 的移动往往能转移内部资源，避免复制全部元素；对 int，这种转换没有搬箱子式的性能意义。', '移动后的标准库对象一般仍有效，但状态可能未指定；某些类型有更具体保证。不要推断移动后的字符串一定为空，也不要把 vector 的原内容继续当作可靠数据使用。可以析构、重新赋值，以及执行满足当前前提的操作。使用 const 对象时，move 还可能最终调用复制，因为常见移动接口需要修改源对象。'] },
          { title: '独占所有权：一把钥匙，只有一个保管人', paragraphs: ['unique_ptr<T> 表示独占拥有对象。std::make_unique<T>(...) 创建对象并返回拥有它的指针；拥有者销毁时自动释放。它不能复制，因为不允许两位独占拥有者同时声称同一对象归自己。std::move(p) 可以转移到 q，转移后 p 为空，这是 unique_ptr 的明确保证。', '需要借用对象时，可以传 T&、const T&，或明确不拥有的 T*，不用为了参数传递把所有权交出去。q.get() 得到的裸指针只观察对象，不负责 delete。若 q 被销毁或重置，观察指针会失效。智能指针管理拥有关系，不会自动让所有指向对象的地址都永远有效。'] },
          { title: '共享所有权要有真实理由', paragraphs: ['shared_ptr 用引用计数管理共享拥有，最后一个拥有者消失时释放对象。两个对象彼此持有 shared_ptr 可能形成环，即使外部不再使用，它们也会互相保活。weak_ptr 是不增加拥有计数的观察方式，需要通过 lock 获取当前是否仍有效的共享引用。', '优先把对象直接作为局部变量或成员；确需动态独占时用 unique_ptr，确需共享时才考虑 shared_ptr。不要为了“现代”把每个整数都放到堆上。RAII、容器和清楚的所有权一起使用，比反复手写 new、delete 更容易保证异常路径也安全。'] }
        ],
        example: { code: `#include <iostream>
#include <memory>
#include <string>
#include <vector>
#include <utility>
struct Book { std::string title; };
int main() {
    auto owner = std::make_unique<Book>(Book{"C++ notes"});
    auto newOwner = std::move(owner);
    std::cout << std::boolalpha << (owner == nullptr) << '\\n';
    std::cout << newOwner->title << '\\n';
    std::vector<int> source{2, 4, 6};
    std::vector<int> destination = std::move(source);
    std::cout << destination.size() << ' ' << destination.front() << '\\n';
    source = {9}; // reuse by assigning a new valid value
    std::cout << source.front() << '\\n';
}`, output: 'true\nC++ notes\n3 2\n9', explanation: ['unique_ptr 移动后源拥有者为空，新的拥有者负责释放对象。', '只打印 destination 的内容，不猜测移动后 source 的大小。', '重新赋值后 source 有明确的新内容，可以正常使用。'] },
        pitfall: '不要对 p.get() 的结果手动 delete。对象仍由智能指针拥有，手动释放会导致悬空访问和之后的重复释放。',
        quiz: { question: 'std::move(x) 本身做了什么？', options: ['立即释放 x 的内存', '立即复制所有元素', '转换表达式，使后续操作有机会选择移动', '保证 x 永远变成空对象'], answer: 2, explanation: '它提供移动选择的条件，真正移动由具体类型的操作完成。源对象后续状态要看类型的约定。' },
        exercise: { title: '在函数间转交独占对象', prompt: '写 makeNumber() 返回 make_unique<int>(42)，main 接住并输出值，再 move 到第二个拥有者，确认第一个为空。', hint: '返回 unique_ptr 可以转移所有权，不要返回局部变量的引用。', solution: `#include <iostream>
#include <memory>
#include <utility>
std::unique_ptr<int> makeNumber() { return std::make_unique<int>(42); }
int main() {
    auto first = makeNumber();
    std::cout << *first << '\\n';
    auto second = std::move(first);
    std::cout << std::boolalpha << (first == nullptr) << ' ' << *second << '\\n';
}`, explanation: '输出 42 和 true 42。对象一直只被一个 unique_ptr 拥有，离开 main 时自动释放。' }
      },
      {
        id: 'l46', title: '写清楚缺失与约束：C++17 到 C++20', minutes: 20,
        lead: '“没有结果”不是成绩 0；“可以求和的类型”也不是任意类型。新标准给这些意图提供了更直接的写法。',
        objectives: ['会安全使用 C++17 optional 与结构化绑定', '认识 C++20 concepts 的约束作用', '理解 C++20 span 是借用视图而非拥有容器'],
        sections: [
          { title: 'C++17：结果可以不存在', paragraphs: ['查找一个学号可能得到成绩，也可能什么都没找到。optional<int> 直接表达这两种情况，比用 -1 等特殊数值更清楚，因为特殊数值可能与有效数据混淆。返回 std::nullopt 表示无值；使用 if(result) 先检查，再通过 *result 读取。无值时直接解引用不安全，value() 则会抛出 bad_optional_access。', 'optional 保存的是一个可选值，不负责提供完整错误原因。查找未命中时它很合适；解析失败若需要报告行号、原因，则应采用更丰富的错误表示。C++17 的结构化绑定 auto [id,score] 可以拆开 pair，也可在遍历 map 时使用 const auto& [key,value] 避免复制。'] },
          { title: 'C++20：先说明模板接受谁', paragraphs: ['Concepts 是 C++20 的模板约束机制。template<std::integral T> 表示 T 满足标准库 integral 概念，例如常见整数类型。这样不合格调用能在接口处得到更清楚的诊断，不必一直深入函数体寻找缺失的操作。concept 不是运行时 if，也不是给对象加上虚函数。', '约束不能自动证明算法数学正确。std::integral 包含 bool，一份算法若不希望接收 bool，还应增加相应限制。下面短代码明确标记为 C++20，需要支持它的编译器和 -std=c++20；本站其他主要例子仍按 C++17 编译，不能把这个标记忽略。'], code: `// C++20 only: compile with -std=c++20
#include <iostream>
#include <concepts>
template<std::integral T>
T twice(T value) { return value + value; }
int main() { std::cout << twice(6) << '\\n'; }` },
          { title: 'C++20：span 借用连续的一段数据', paragraphs: ['std::span<T> 把连续元素的地址和数量组合成视图，不复制元素，也不拥有底层存储。它可描述数组或 vector 的一段；span<const int> 表示通过这个视图只读。原容器销毁或 vector 重新分配后，span 可能悬空。它解决传递范围的信息组织，不能自动延长寿命。', 'C++20 的 span 下标操作并不提供自动运行时越界检查，仍要保证 i < size。指向 list 的任意元素不能组成 span，因为链表元素不连续。版本学习应从问题出发：先理解“无值”“类型要求”“连续借用”，再记新语法，避免为了追标准把基础规则忘掉。'], code: `// C++20 only: compile with -std=c++20
#include <iostream>
#include <span>
int sum(std::span<const int> values) {
    int total = 0;
    for (int x : values) total += x;
    return total;
}
int main() {
    int values[]{2, 3, 4};
    std::cout << sum(values) << '\\n';
}` }
        ],
        example: { code: `// C++17
#include <iostream>
#include <map>
#include <optional>
std::optional<int> findScore(const std::map<int, int>& scores, int id) {
    auto it = scores.find(id);
    if (it == scores.end()) return std::nullopt;
    return it->second;
}
int main() {
    std::map<int, int> scores{{101, 0}, {102, 90}};
    for (const auto& [id, score] : scores)
        std::cout << id << ':' << score << '\\n';
    auto result = findScore(scores, 101);
    if (result) std::cout << "found " << *result << '\\n';
    if (!findScore(scores, 999)) std::cout << "missing\\n";
}`, output: '101:0\n102:90\nfound 0\nmissing', explanation: ['成绩 0 是有效结果，optional 的“有值”检查不会把它当成 false 的成绩。', 'const auto& 结构化绑定借用 map 中的键值对，不复制。', '主示例只使用 C++17；两段 C++20 代码分别展示新增概念。'] },
        pitfall: 'if (result) 检查 optional 是否有值，不是检查里面的 int 是否非零。无值时不能使用 *result。',
        quiz: { question: 'std::span 的哪项描述正确？', options: ['拥有数据，销毁时自动 delete', '借用连续范围，底层数据必须保持有效', '能自动把链表变成连续数组', 'C++17 已提供全部 span 接口'], answer: 1, explanation: 'span 是 C++20 的非拥有视图，原数据寿命和重新分配仍需由使用者保证。' },
        exercise: { title: '可选的平均值', prompt: '用 C++17 的 optional<double> 实现 average，空 vector 返回 nullopt，否则返回平均。测试 {80,90} 与空输入。', hint: '累加使用 double，避免整数除法丢掉小数。', solution: `#include <iostream>
#include <vector>
#include <optional>
std::optional<double> average(const std::vector<int>& v) {
    if (v.empty()) return std::nullopt;
    double sum = 0;
    for (int x : v) sum += x;
    return sum / v.size();
}
int main() {
    auto a = average({80, 90});
    auto b = average({});
    if (a) std::cout << *a << '\\n';
    if (!b) std::cout << "no average\\n";
}`, explanation: '输出 85 与 no average。空集没有平均分，接口诚实地表示缺失，而不是伪造 0。' }
      },
      {
        id: 'l47', title: '综合项目：能保存的成绩管理器', minutes: 20,
        lead: '把结构体、关联容器、算法、文件和输入检查接起来。这个小程序支持增删改查、排名、平均分和保存读取。',
        objectives: ['能把需求拆成数据、操作和交互三层', '会用临时容器保证读取失败不破坏原数据', '能测试完整命令流并进一步拆分工程'],
        sections: [
          { title: '先写规则，再选择容器', paragraphs: ['一个学生由正整数学号、非空姓名和 0～100 的成绩组成。学号唯一，重复添加应失败，更新不存在的学生也应失败。用 map<int,Student> 表达按学号查找和唯一性。排名是另一个视图，不改变原来的存储顺序；先复制成 vector，再按成绩降序、同分学号升序排序。', 'GradeBook 只负责数据和规则，main 负责把文本命令解析成调用。这样日后换成图形界面，不需要重写成绩逻辑。各命令接收精确字段数量，多余字段也视为格式错误。姓名用 std::quoted 读取，带空格时可以写成 "Li Hua"，避免简单按空格拆分丢失姓名。'] },
          { title: '保存与读取拥有不同的失败边界', paragraphs: ['保存逐行写出学号、带引号姓名和成绩，并在 close 后检查流状态。读取先放入一个临时 map，每行检查格式、范围和重复学号，整个文件都通过后才 swap 到正式数据。若读到第十行才发现问题，前九行也不会部分覆盖当前成绩册，这就是读取操作的强保证思路。', '写文件仍可能在中途失败，因此这个教学程序没有承诺磁盘文件的事务安全。正式项目可以再加入临时文件写入和平台适合的替换策略。空成绩册的平均值用 optional<double> 表示无值，不能拿 0 冒充；零分学生是真实存在的，两种情况需要区分。'] },
          { title: '怎样运行和验证完整流程', paragraphs: ['编译下面的完整 C++17 程序后，逐行输入命令，quit 退出。示例输入依次为 add 101 Lin 88、add 102 Chen 92、list、stats、save grades-demo.txt、remove 101、load grades-demo.txt、find 101、quit。右侧输出与这组输入对应，运行会创建或覆盖工作目录下的 grades-demo.txt。', '再试重复添加、成绩 101、查找不存在学号和损坏文件，确认失败时状态保持合理。进阶练习可把 Student 与 GradeBook 声明放入头文件，实现放入 .cpp，添加边界测试，再加课程字段和按科目统计。先确保这一版每条命令正确，再扩展功能，项目才不会成为一堆未经验证的菜单。'] }
        ],
        example: { code: `#include <iostream>
#include <iomanip>
#include <fstream>
#include <sstream>
#include <string>
#include <map>
#include <vector>
#include <algorithm>
#include <optional>
#include <utility>
struct Student { std::string name; int score; };
class GradeBook {
    std::map<int, Student> students_;
    static bool valid(int id, const Student& s) {
        return id > 0 && !s.name.empty() && s.score >= 0 && s.score <= 100;
    }
public:
    bool add(int id, const Student& s) {
        return valid(id, s) && students_.emplace(id, s).second;
    }
    bool update(int id, const Student& s) {
        auto it = students_.find(id);
        if (it == students_.end() || !valid(id, s)) return false;
        it->second = s;
        return true;
    }
    bool remove(int id) { return students_.erase(id) != 0; }
    std::optional<Student> find(int id) const {
        auto it = students_.find(id);
        if (it == students_.end()) return std::nullopt;
        return it->second;
    }
    std::optional<double> average() const {
        if (students_.empty()) return std::nullopt;
        double total = 0;
        for (const auto& [id, s] : students_) total += s.score;
        return total / students_.size();
    }
    void printRanking(std::ostream& out) const {
        std::vector<std::pair<int, Student>> rows(students_.begin(), students_.end());
        std::sort(rows.begin(), rows.end(), [](const auto& a, const auto& b) {
            if (a.second.score != b.second.score) return a.second.score > b.second.score;
            return a.first < b.first;
        });
        for (const auto& [id, s] : rows) out << id << ' ' << s.name << ' ' << s.score << '\\n';
    }
    bool save(const std::string& path) const {
        std::ofstream out(path);
        if (!out) return false;
        for (const auto& [id, s] : students_)
            out << id << ' ' << std::quoted(s.name) << ' ' << s.score << '\\n';
        out.close();
        return static_cast<bool>(out);
    }
    bool load(const std::string& path) {
        std::ifstream in(path);
        if (!in) return false;
        std::map<int, Student> pending;
        std::string line;
        while (std::getline(in, line)) {
            std::istringstream row(line);
            int id = 0;
            Student s{"", 0};
            std::string extra;
            if (!(row >> id >> std::quoted(s.name) >> s.score) || (row >> extra)
                || !valid(id, s) || !pending.emplace(id, s).second) return false;
        }
        if (in.bad()) return false;
        students_.swap(pending);
        return true;
    }
};
bool finished(std::istringstream& row) {
    row >> std::ws;
    return row.eof();
}
int main() {
    GradeBook book;
    std::string line;
    while (std::getline(std::cin, line)) {
        std::istringstream row(line);
        std::string command;
        if (!(row >> command)) continue;
        if (command == "quit" && finished(row)) break;
        if (command == "add" || command == "update") {
            int id = 0;
            Student s{"", 0};
            if (!(row >> id >> std::quoted(s.name) >> s.score) || !finished(row)) {
                std::cout << "invalid command\\n"; continue;
            }
            bool ok = command == "add" ? book.add(id, s) : book.update(id, s);
            std::cout << (ok ? (command == "add" ? "added" : "updated") : "rejected") << '\\n';
        } else if (command == "find" || command == "remove") {
            int id = 0;
            if (!(row >> id) || !finished(row)) { std::cout << "invalid command\\n"; continue; }
            if (command == "remove") std::cout << (book.remove(id) ? "removed" : "missing") << '\\n';
            else {
                auto s = book.find(id);
                if (s) std::cout << id << ' ' << s->name << ' ' << s->score << '\\n';
                else std::cout << "missing\\n";
            }
        } else if (command == "list" && finished(row)) book.printRanking(std::cout);
        else if (command == "stats" && finished(row)) {
            auto value = book.average();
            if (value) std::cout << "average " << std::fixed << std::setprecision(1) << *value << '\\n';
            else std::cout << "empty\\n";
        } else if (command == "save" || command == "load") {
            std::string path;
            if (!(row >> std::quoted(path)) || !finished(row)) {
                std::cout << "invalid command\\n"; continue;
            }
            bool ok = command == "save" ? book.save(path) : book.load(path);
            std::cout << (ok ? (command == "save" ? "saved" : "loaded") : "file failed") << '\\n';
        } else std::cout << "invalid command\\n";
    }
    if (std::cin.bad()) { std::cerr << "input failed\\n"; return 1; }
}`, output: 'added\nadded\n102 Chen 92\n101 Lin 88\naverage 90.0\nsaved\nremoved\nloaded\n101 Lin 88', explanation: ['输出需要配合正文给出的九行命令输入；程序不伪造输入，也没有固定的演示数据。', '读取时 pending 是待提交数据，只有所有行合法才替换正式 map。', 'update 也支持：例如 update 101 Lin 95；同分时按学号升序排名。', '姓名包含空格时输入 add 103 "Li Hua" 87，std::quoted 会保留完整姓名。'] },
        pitfall: '不要在读取每一行时直接清空或修改正式成绩册。文件后半段失败会留下半份数据，应该先验证临时容器。',
        quiz: { question: '为什么 load 先读入临时 map，成功后才 swap？', options: ['为了让文件变小', '为了减少成绩的精度', '为了读取失败时保留原来的完整数据', '因为 map 不能逐项插入'], answer: 2, explanation: '临时容器把准备阶段与提交阶段分开，格式或 I/O 失败时不会部分替换正式数据。' },
        exercise: { title: '加上及格人数统计', prompt: '对学生成绩 59、60、88、100 统计总人数和及格人数，输出 total 4 与 passed 3。写 GradeBook::passedCount() const，一次遍历完成。', hint: '判断条件使用 >=60；把统计写进数据层，不写进每一个菜单分支。', solution: `#include <iostream>
#include <map>
#include <string>
struct Student { std::string name; int score; };
class GradeBook {
    std::map<int, Student> students_;
public:
    void add(int id, const Student& s) { students_.emplace(id, s); }
    std::size_t size() const { return students_.size(); }
    std::size_t passedCount() const {
        std::size_t count = 0;
        for (const auto& [id, s] : students_) if (s.score >= 60) ++count;
        return count;
    }
};
int main() {
    GradeBook book;
    book.add(1, {"A", 59}); book.add(2, {"B", 60});
    book.add(3, {"C", 88}); book.add(4, {"D", 100});
    std::cout << "total " << book.size() << '\\n';
    std::cout << "passed " << book.passedCount() << '\\n';
}`, explanation: '这是统计功能的独立最小版本，便于直接运行；集成到完整项目时保留原有 add 的输入验证。遍历 O(n)，额外空间 O(1)。' }
      },
      {
        id: 'l48', title: '学完之后：把知识变成能独立完成的事', minutes: 15,
        lead: '看完四十八课是一个起点。真正的进步，是合上答案后能写出来、解释清楚，并修好自己的错误。',
        objectives: ['用具体成果检验学习阶段', '制定适合课业安排的复习和项目节奏', '分清教材、指南和标准草案的用途'],
        sections: [
          { title: '用能力验收，不用阅读进度验收', paragraphs: ['第一阶段应能独立完成输入、分支、循环、函数和 vector 的小任务，例如统计最高分和平均分。第二阶段能说明值、引用和指针的区别，避免越界、未初始化和悬空引用，能设计一个有不变量的小类。第三阶段能使用 STL、解释复杂度，并把项目拆成多个文件。', '最后的验收是把成绩管理器从空白文件重新做一遍，不照着答案逐行抄。允许查接口，但要自己确定数据结构、命令格式和失败处理。能解释为何用 map、为何排名复制成 vector、为何读取先用临时容器，比背下语法更能证明理解。不会的地方回到对应课程补练即可。'] },
          { title: '给复习留下时间，而不是赶完目录', paragraphs: ['若每周安排三次、每次 45～60 分钟，可以先试用四到六个月完成基础课程与一个小项目；这只是可调整的计划，不是保证所有人都在这个时间掌握。把一节课拆成阅读、预测输出、亲手输入、改变条件、独立练习，难课允许占用多次学习时间。', '每两周留一次复习：不看笔记写几个旧题，记录错误原因。完成项目后补充测试和说明文档，再尝试通讯录、词频分析或简单棋盘游戏。多线程、网络、图形界面和高级模板都可以继续学，但不要同时堆到第一个项目里。数据结构、离散数学、计算机组成与操作系统也属于大学计算机课程，不能由一门 C++ 语法课全部替代。'] },
          { title: '不同资料，各自用在合适的位置', paragraphs: ['Programming: Principles and Practice Using C++ 第三版由 Bjarne Stroustrup 编写，面向编程初学者，使用 C++20/23；对照本课时要留意标准版本与图形部分的依赖。C++ Primer 第五版由 Lippman、Lajoie、Moo 编写，主要基于 C++11，内容详细，适合基础巩固；C++ Primer Plus 是另一部书，不是它的新版。', 'A Tour of C++ 第三版更适合已有基础的读者快速整理现代 C++。C++ Core Guidelines 是设计与资源安全建议，不是从零教材；ISO 工作草案用于核对精确规则，也不适合按章节从头背诵。资料可通过图书馆、作者页面和出版社样章先判断是否适合自己，再决定是否购书。'], references: [ { title: 'Programming: Principles and Practice，作者资料', url: 'https://www.stroustrup.com/programming.html' }, { title: 'C++ Primer 第五版，出版社资料', url: 'https://www.informit.com/store/c-plus-plus-primer-9780321714114' }, { title: 'A Tour of C++ 第三版，作者资料', url: 'https://www.stroustrup.com/tour3.html' }, { title: 'C++ Core Guidelines', url: 'https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines' }, { title: 'ISO C++ 工作草案', url: 'https://eel.is/c++draft/' } ] }
        ],
        example: { code: `#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
struct Milestone { std::string task; bool done; };
int main() {
    std::vector<Milestone> plan{
        {"write a function independently", true},
        {"explain reference lifetime", true},
        {"finish and test a file project", false}
    };
    auto done = std::count_if(plan.begin(), plan.end(),
        [](const Milestone& m) { return m.done; });
    std::cout << done << '/' << plan.size() << " milestones\\n";
    for (const auto& item : plan)
        if (!item.done) std::cout << "next: " << item.task << '\\n';
}`, output: '2/3 milestones\nnext: finish and test a file project', explanation: ['这不是能力评分，只是展示如何把学习目标写成可检查的具体任务。', 'count_if、结构体、容器和 lambda 在一个很小的程序中自然协作。', '完成任务应以实际作品和解释为依据，不能只把 done 改为 true 当作学会。'] },
        pitfall: '只看答案产生的熟悉感不等于独立能力。预测输出后再运行、隔几天从空白重写，才能发现真正没掌握的地方。',
        quiz: { question: '哪项最能检验是否真正理解了成绩项目？', options: ['把代码逐字抄得更快', '能从空白重做、解释设计选择，并测试错误输入', '只读项目的标题', '把所有变量名改成单字母'], answer: 1, explanation: '独立实现、解释和验证把知识连接到解决问题的能力，单纯熟悉代码外观不能替代它们。' },
        exercise: { title: '写一份能复现的项目说明', prompt: '写程序输出三行：标准版本 C++17、构建命令、项目的一个边界测试。随后把这三项真正加入你的项目说明，测试空成绩册应得到 empty。', hint: '说明应让另一位同学知道怎样构建，以及如何确认程序的关键行为。', solution: `#include <iostream>
int main() {
    std::cout << "standard: C++17\\n";
    std::cout << "build: g++ -std=c++17 -Wall -Wextra main.cpp -o grades\\n";
    std::cout << "test: stats on an empty grade book -> empty\\n";
}`, explanation: '这三行只是说明的最小骨架。实际文档还应包含命令格式、输入样例、文件位置和已知限制，并与真实程序一致。' }
      }
    ]
  }
];

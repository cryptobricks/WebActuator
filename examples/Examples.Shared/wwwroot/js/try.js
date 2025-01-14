function init() {
    initLanguages();
    var splitter = document.getElementById('splitter');
    var code = document.getElementById('code');
    var render = document.getElementById('render');

    var mouseDownHandler = function (e) {
        // Prevent text selection
        e.preventDefault();

        // Set initial positions
        var startPos = e.clientX;
        var startLeftWidth = code.offsetWidth;
        var startRightWidth = render.offsetWidth;

        // Define the mouse move handler
        var mouseMoveHandler = function (e) {
            // Calculate the new widths
            var newLeftWidth = startLeftWidth + (e.clientX - startPos);
            var newRightWidth = startRightWidth - (e.clientX - startPos);

            // Update the widths
            code.style.width = newLeftWidth + 'px';
            render.style.width = newRightWidth + 'px';
        };

        // Define the mouse up handler
        var mouseUpHandler = function () {
            // Remove the handlers
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
        };

        // Add the handlers
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };

    splitter.addEventListener('mousedown', mouseDownHandler);
}

function initLanguages() {
    function createDependencyProposals(range) {
        return [
            {
                label: 'psvm',
                kind: monaco.languages.CompletionItemKind.Function,
                documentation: "生成一个Main方法",
                insertText:
                    `
internal class Program
{
    private static void Main(string[] args)
    {
        Console.WriteLine("Hello World!");
    }
}`,
                range: range,
            },
            {
                label: 'cw',
                kind: monaco.languages.CompletionItemKind.Function,
                documentation: "生成一个Console.WriteLine方法",
                insertText:
                    `Console.WriteLine("");`,
                range: range,
            },
            {
                label: 'prop',
                kind: monaco.languages.CompletionItemKind.Function,
                documentation: "生成一个属性",
                insertText:
                    `public TYPE Type { get; set; }`,
                range: range,
            },
            {
                label: 'propg',
                kind: monaco.languages.CompletionItemKind.Function,
                documentation: "生成一个私有set的属性",
                insertText:
                    `public int I { get; private set; }`,
                range: range,
            },
            {
                label: 'pci',
                kind: monaco.languages.CompletionItemKind.Function,
                documentation: "生成一个常量int类",
                insertText:
                    `public const int `,
                range: range,
            },
            {
                label: 'pcs',
                kind: monaco.languages.CompletionItemKind.Function,
                documentation: "生成一个常量string类",
                insertText:
                    `public const string`,
                range: range,
            }
        ];
    }

    monaco.languages.register({id: "logger"});
    monaco.languages.setMonarchTokensProvider("logger", {
        tokenizer: {
            root: [
                [/\[error.*/, "custom-error"],
                [/\[notice.*/, "custom-notice"],
                [/\[info.*/, "custom-info"],
                [/\[[a-zA-Z 0-9:]+\]/, "custom-date"],
            ],
        },
    });

    monaco.languages.registerCompletionItemProvider("csharp", {
        provideCompletionItems: function (model, position) {
            var word = model.getWordUntilPosition(position);
            var range = {
                startLineNumber: position.lineNumber,
                endLineNumber: position.lineNumber,
                startColumn: word.startColumn,
                endColumn: word.endColumn,
            };
            return {
                suggestions: createDependencyProposals(range),
            };
        },
    });

}

function setValue(key, value) {
    localStorage.setItem(key, value);
}

function getValue(key) {
    let result = localStorage.getItem(key);
    if (result) {
        return result;
    }
    return "";
}

function removeValue(key) {
    localStorage.removeItem(key);
}

function renderScroll() {
    var element = document.getElementById("render");
    element.scrollTop = element.scrollHeight;
}

function setClipboard(value) {

    // 创建一个临时的textarea元素
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = value;

    // 将textarea元素添加到DOM中
    document.body.appendChild(tempTextArea);

    // 选择文本
    tempTextArea.select();

    // 复制文本到剪贴板
    document.execCommand('copy');

    // 删除临时的textarea元素
    document.body.removeChild(tempTextArea);
}

function getHref() {
    return window.location.href;
}

export {
    init,
    renderScroll,
    setValue,
    getValue,
    removeValue,
    setClipboard,
    getHref
}
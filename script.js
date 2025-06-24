const dic = {
  "চলক": "var",
  "ধরি": "let",
  "অভেদ": "const",
  "বিরাম": "break",
  "ফেরত_দাও": "return",
  "যখন": "while",
  "প্রক্রিয়া": "function",
  "সত্য": "true",
  "মিথ্যা": "false",
  "নাল": "null",
  "অবজেক্ট": "class",
  "যদি": "if",
  "অথবা": "else if",
  "নাহলে": "else",
  "কর": "do",
  "কিছুনা": "void",
  "সুইচ": "switch",
  "যেখানে": "case",
  "এর চেয়ে বড়": "<",
  "এর চেয়ে ছোট": ">",
  "এর সমান": "==",
  "বানাও": "constructor",
  "এটাতে": "this",
  "নতুন": "new",
  "০": "0",
  "১": "1",
  "২": "2",
  "৩": "3",
  "৪": "4",
  "৫": "5",
  "৬": "6",
  "৭": "7",
  "৮": "8",
  "৯": "9"
};

const errorDic = {
  "SyntaxError": "ব্যাকরণগত ত্রুটি",
  "ReferenceError": "রেফারেন্স ত্রুটি",
  "TypeError": "টাইপ ত্রুটি",
  "RangeError": "সীমা ত্রুটি",
  "URIError": "URI ত্রুটি",
  "EvalError": "ইভ্যাল ত্রুটি",
  "Translation error": "অনুবাদ ত্রুটি",
  "is not defined": "সংজ্ঞায়িত হয়নি",
  "Unexpected token": "অপ্রত্যাশিত টোকেন",
  "missing )": ") বন্ধনী নেই",
  "missing }": "} বন্ধনী নেই",
  "missing ]": "] বন্ধনী নেই",
  "missing ;": "; সেমিকোলন নেই",
  "Invalid left-hand side": "অবৈধ বাম পাশ",
  "Cannot read property": "প্রপার্টি পড়তে ব্যর্থ",
  "of undefined": "অনির্ধারিত",
  "Cannot set property": "প্রপার্টি সেট করতে ব্যর্থ"
};

const errorSuggestions = {
  "সংজ্ঞায়িত হয়নি": "আপনি কি ভেরিয়েবলটি ডিক্লেয়ার করতে ভুলে গেছেন?",
  ") বন্ধনী নেই": "দয়া করে সমস্ত বন্ধনী জোড়া পরীক্ষা করুন",
  "অপ্রত্যাশিত টোকেন": "আপনার কোডে বানান বা সিনট্যাক্স চেক করুন",
  "টাইপ ত্রুটি": "আপনি ভুল ধরনের ডাটা ব্যবহার করছেন কিনা পরীক্ষা করুন"
};

CodeMirror.defineSimpleMode("borno", {
    start: [
        {regex: new RegExp(`(?:${Object.keys(dic).join('|')})(?=$|\\s|[;(){}\\[\\]])`), token: "keyword"},
        {regex: /"(?:[^\\]|\\.)*?(?:"|$)/, token: "string"},
        {regex: /'(?:[^\\]|\\.)*?(?:'|$)/, token: "string"},
        {regex: /[০-৯0-9]+/, token: "number"},
        {regex: /[{}()\[\]]/, token: "bracket"},
        {regex: /\/\/.*/, token: "comment"},
        {regex: /\/\*/, token: "comment", next: "comment"},
    ],
    comment: [
        {regex: /.*?\*\//, token: "comment", next: "start"},
        {regex: /.*/, token: "comment"}
    ],
    meta: {
        lineComment: "//"
    }
});

CodeMirror.registerHelper("hint", "borno", function(editor) {
  const cursor = editor.getCursor();
  const line = editor.getLine(cursor.line);
  const currentWord = line.substring(0, cursor.ch).split(/\s+/).pop();
  
  const suggestions = Object.keys(dic).filter(key => 
    key.startsWith(currentWord))
    .map(key => ({text: key, displayText: `${key} → ${dic[key]}`}));
  
  return {
    list: suggestions.length ? suggestions : [],
    from: CodeMirror.Pos(cursor.line, cursor.ch - currentWord.length),
    to: cursor
  };
});

const editorTa = document.getElementById("editor");
const run = document.getElementById("run");
const clear = document.getElementById("clear");
const consoleDiv = document.getElementById("output");

const editor = CodeMirror.fromTextArea(editorTa, {
    lineNumbers: true,
    mode: "borno",
    theme: "dracula",
    indentUnit: 4,
    tabSize: 4,
    lineWrapping: true,
    autoCloseBrackets: {
        pairs: '()[]{}""',
        closeBefore: ')]}\'"',
        triples: '',
        explode: '[]{}'
    },
    autoCloseTags: true,
    matchBrackets: true,
    highlightSelectionMatches: {showToken: /\w/},
    extraKeys: {
        "Ctrl-Enter": runBornoCode,
        "Cmd-Enter": runBornoCode,
        "'": function(cm) {
            cm.replaceSelection("''");
            cm.execCommand("goCharLeft");
        },
        '"': function(cm) {
            cm.replaceSelection('""');
            cm.execCommand("goCharLeft");
        },
        "(": function(cm) {
            cm.replaceSelection("()");
            cm.execCommand("goCharLeft");
        },
        "[": function(cm) {
            cm.replaceSelection("[]");
            cm.execCommand("goCharLeft");
        },
        "{": function(cm) {
            cm.replaceSelection("{}");
            cm.execCommand("goCharLeft");
        }
    }
});

editor.setValue(`দেখাও("হ্যালো বিশ্ব!")`);
run.addEventListener("click", runBornoCode);
editor.setOption("extraKeys", {
  ...editor.getOption("extraKeys"),
  "Ctrl-Space": "autocomplete"
});

function ইনপুট(s) {
    var pmp = window.prompt(s);
    return pmp;
}

function দেখাও(s) {
    console.log(s);
}

function translateToBorno(jsCode) {
    let translated = jsCode;
    const reverseDic = {};
    for (let key in dic) {
        reverseDic[dic[key]] = key;
    }
    
    for (let engKeyword in reverseDic) {
        translated = translated.replace(
            new RegExp(`\\b${engKeyword}\\b`, 'g'), 
            reverseDic[engKeyword]
        );
    }
    
    return translated;
}

clear.addEventListener("click", () => {
    consoleDiv.innerHTML = '';
});

const originalConsole = {
    log: console.log,
    error: console.error,
    warn: console.warn,
    clear: console.clear
};

function overrideConsole() {
    console.log = function(...args) {
        originalConsole.log.apply(console, args);
        writeToConsole('log', args);
    };
    
    console.error = function(...args) {
        originalConsole.error.apply(console, args);
        writeToConsole('error', args);
    };
    
    console.warn = function(...args) {
        originalConsole.warn.apply(console, args);
        writeToConsole('warn', args);
    };
    
    console.clear = function() {
        originalConsole.clear.apply(console);
        consoleDiv.innerHTML = '';
    };
}

function restoreConsole() {
    console.log = originalConsole.log;
    console.error = originalConsole.error;
    console.warn = originalConsole.warn;
    console.clear = originalConsole.clear;
}

function translateErrorToBangla(error) {
    let banglaError = error.toString();
    for (const [eng, bang] of Object.entries(errorDic)) {
        banglaError = banglaError.replace(eng, bang);
    }
    
    for (const [err, suggestion] of Object.entries(errorSuggestions)) {
        if (banglaError.includes(err)) {
            banglaError += `\nপরামর্শ: ${suggestion}`;
        }
    }
    
    return banglaError;
}

function writeToConsole(type, args) {
    let message = args.map(arg => {
        if (typeof arg === 'object' && arg !== null) {
            try {
                return JSON.stringify(arg, null, 2);
            } catch {
                return arg.toString();
            }
        }
        return String(arg);
    }).join(' ');

    if (type !== 'error') {
        message = translateToBorno(message);
    }

    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.innerHTML = `<span class="log-type">[${type.toUpperCase()}]</span> ${message}`;
    consoleDiv.appendChild(entry);
    consoleDiv.scrollTop = consoleDiv.scrollHeight;
}

function runBornoCode() {
    consoleDiv.innerHTML = '';
    overrideConsole();
    
    try {
        let borno_code = editor.getValue();
        for (let key in dic) {
            borno_code = borno_code.replace(new RegExp(key, 'g'), dic[key]);
        }

        try {
            const result = eval(borno_code);
            if (result !== undefined) {
                writeToConsole('log', [result]);
            }
        } catch (e) {
            const banglaError = translateErrorToBangla(e);
            writeToConsole('error', [banglaError]);
        }
    } catch (e) {
        const banglaError = translateErrorToBangla(e);
        writeToConsole('error', ["অনুবাদ ত্রুটি: " + banglaError]);
    } finally {
        setTimeout(restoreConsole, 100);
    }
}
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
  "এর চেয়ে বড়":"<",
  "এর চেয়ে ছোট":">",
  "এর সমান ":"==",
  "বানাও":"constructor",
  "এটাতে":"this",
  "নতুন":"new",
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

CodeMirror.defineSimpleMode("borno", {
    start: [
        // Bengali keywords
        {regex: new RegExp(`(?:${Object.keys(dic).join('|')})(?=$|\\s|[;(){}\\[\\]])`), token: "keyword"},
        // Strings
        {regex: /"(?:[^\\]|\\.)*?(?:"|$)/, token: "string"},
        {regex: /'(?:[^\\]|\\.)*?(?:'|$)/, token: "string"},
        // Numbers
        {regex: /[০-৯0-9]+/, token: "number"},
        // Brackets
        {regex: /[{}()\[\]]/, token: "bracket"},
        // Comments
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
    key.startsWith(currentWord)
    .map(key => ({text: key, displayText: `${key} → ${dic[key]}`})));
  
  return {
    list: suggestions.length ? suggestions : [],
    from: CodeMirror.Pos(cursor.line, cursor.ch - currentWord.length),
    to: cursor
  };
});

// Enable with Ctrl-Space


// CodeMirror.defineSimpleMode("borno", {
//     start: [
//         // Bengali keywords - modified regex to handle Unicode properly
//         {regex: new RegExp(`(?:${Object.keys(dic).join('|')})(?=$|\\s|[;(){}\\[\\]])`), token: "keyword"},
//         // Strings
//         {regex: /"(?:[^\\]|\\.)*?(?:"|$)/, token: "string"},
//         // Numbers (including Bengali numerals)
//         {regex: /[০-৯0-9]+/, token: "number"},
//         // Comments
//         {regex: /\/\/.*/, token: "comment"},
//         {regex: /\/\*/, token: "comment", next: "comment"},
//     ],
//     comment: [
//         {regex: /.*?\*\//, token: "comment", next: "start"},
//         {regex: /.*/, token: "comment"}
//     ],
//     meta: {
//         lineComment: "//"
//     }
// });


const editorTa = document.getElementById("editor");
const run = document.getElementById("run");
const clear = document.getElementById("clear");
const consoleDiv = document.getElementById("output");


// const editor = CodeMirror.fromTextArea(editorTa, {
//     lineNumbers: true,
//     mode: "borno",
//     theme: "dracula",
//     indentUnit: 4,
//     tabSize: 4,
//     lineWrapping: true,
//     autoCloseBrackets: true,
//     extraKeys: {
//         "Ctrl-Enter": runBornoCode,
//         "Cmd-Enter": runBornoCode
//             }
//         });

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



editor.setValue(`দেখাও(৫)`)
run.addEventListener("click",runBornoCode)
editor.setOption("extraKeys", {
  ...editor.getOption("extraKeys"),
  "Ctrl-Space": "autocomplete"
});
function ইনপুট(s){
    var pmp = window.prompt(s);
    return pmp;
}

function দেখাও(s){
    console.log(s);
}
function translateToBorno(jsCode) {
    let translated = jsCode;
    // Create reverse mapping (English to Bengali)
    const reverseDic = {};
    for (let key in dic) {
        reverseDic[dic[key]] = key;
    }
    
    // Replace JavaScript keywords with Bengali keywords
    for (let engKeyword in reverseDic) {
        // Use word boundaries to avoid partial matches
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

        // Store original console methods
        const originalConsole = {
            log: console.log,
            error: console.error,
            warn: console.warn,
            clear: console.clear
        };

        // Override console methods
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

        // Restore original console methods
        function restoreConsole() {
            console.log = originalConsole.log;
            console.error = originalConsole.error;
            console.warn = originalConsole.warn;
            console.clear = originalConsole.clear;
        }

        // Write to console div
        function writeToConsole(type, args) {
            var message = args.map(arg => {
                if (typeof arg === 'object' && arg !== null) {
                    try {
                        return JSON.stringify(arg, null, 2);
                    } catch {
                        return arg.toString();
                    }
                }
                return String(arg);
            }).join(' ');
             message = translateToBorno(message)

            const entry = document.createElement('div');
            entry.className = `log-entry ${type}`;

            entry.textContent = `[${type.toUpperCase()}] ${message}`;
            consoleDiv.appendChild(entry);
            consoleDiv.scrollTop = consoleDiv.scrollHeight;
        }

        // Run Borno code
        function runBornoCode() {
            // Clear console
            consoleDiv.innerHTML = '';
            
            // Override console methods
            overrideConsole();
            
            try {
                // Translate Borno code to JavaScript
                let borno_code = editor.getValue();
                for (let key in dic) {
                    borno_code = borno_code.replace(new RegExp(key, 'g'), dic[key]);
                }
                
                // Execute the code with proper error handling
                try {
                    // Use Function constructor to catch syntax errors
                    new Function(borno_code)();
                } catch (e) {
                    // Handle runtime errors
                    console.error(e.toString());
                }
            } catch (e) {
                // Handle any errors during translation
                console.error("Translation error:", e.toString());
            } finally {
                // Restore console after execution
                setTimeout(restoreConsole, 100);
            }
        }
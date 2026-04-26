# Borno Programming Language  — Docs

Borno is a **Bengali keyword-based JavaScript layer** that lets you write JavaScript using Bengali syntax. It is built on top of CodeMirror and executes by translating Bengali keywords into JavaScript before running via `eval()`.

---

## Try Borno Editor ->[Website URL](https://borno-app.vercel.app/)
## Read GPT generated docs -> [Website URL](https://borno-app.vercel.app/docs)

## Overview

This project provides:

* Bengali → JavaScript keyword translation
* Custom CodeMirror language mode (`borno`)
* Autocomplete support
* Bengali console output translation
* Error translation + suggestions in Bangla
* Simple runtime execution engine

---

## Keyword Dictionary (`dic`)

Borno replaces Bengali keywords with JavaScript equivalents.

### Core Keywords

| Bengali    | JavaScript |
| ---------- | ---------- |
| চলক        | var        |
| ধরি        | let        |
| অভেদ       | const      |
| প্রক্রিয়া | function   |
| ফেরত_দাও   | return     |
| যদি        | if         |
| নাহলে যদি  | else if    |
| নাহলে      | else       |
| যখন        | while      |
| কর         | do         |
| সুইচ       | switch     |
| যেখানে     | case       |
| বিরাম      | break      |
| কিছুনা     | void       |
| সত্য       | true       |
| মিথ্যা     | false      |
| নাল        | null       |

---

### Object-Oriented

| Bengali  | JavaScript  |
| -------- | ----------- |
| উপাদান   | class       |
| বানাও    | constructor |
| এটা      | this        |
| নতুন     | new         |
| সাথে আছে | extends     |
| সুপার    | super       |

---

### Operators

| Bengali     | Meaning |
| ----------- | ------- |
| এর চেয়ে বড়  | `<`     |
| এর চেয়ে ছোট | `>`     |
| এর সমান     | `==`    |
| এবং         | `&&`    |
| অসত্য       | `!`     |

---

### Numbers

| Bengali | Digit |
| ------- | ----- |
| ০       | 0     |
| ১       | 1     |
| ২       | 2     |
| ৩       | 3     |
| ৪       | 4     |
| ৫       | 5     |
| ৬       | 6     |
| ৭       | 7     |
| ৮       | 8     |
| ৯       | 9     |

---

## Console Functions

These are built-in helper functions written in Bengali:

### Output

```js
দেখাও("হ্যালো বিশ্ব!");
```

Equivalent:

```js
console.log("Hello World");
```

---

### Input

```js
ইনপুট("তোমার নাম কী?");
```

Equivalent:

```js
prompt()
```

---

### Memory (LocalStorage)

```js
মনে_রাখ("value", "key");
মনে_আছে("key");
```

* Stores and retrieves values using browser `localStorage`

---

## Code Translation Engine

Before execution, code is translated:

```js
for (let key in dic) {
    borno_code = borno_code.replace(new RegExp(key, 'g'), dic[key]);
}
```

This converts Bengali syntax into JavaScript.

---

## Execution Flow

1. User writes code in CodeMirror editor
2. Bengali keywords are replaced with JS equivalents
3. Code is executed using `eval()`
4. Console output is intercepted and displayed in UI

---

## CodeMirror Mode

Custom mode definition:

* Keywords → highlighted as `keyword`
* Strings → `"text"` and `'text'`
* Numbers → Bengali and English digits supported
* Comments:

  * `// single line`
  * `/* multi line */`

---

## Autocomplete

Autocomplete suggests Bengali keywords:

```js
CodeMirror.registerHelper("hint", "borno", function(editor) {
```

* Matches prefix input
* Shows: `Bengali → JavaScript`

---

## Error Translation System

### English → Bangla Errors

| English        | Bangla           |
| -------------- | ---------------- |
| SyntaxError    | ব্যাকরণগত ত্রুটি |
| ReferenceError | রেফারেন্স ত্রুটি |
| TypeError      | টাইপ ত্রুটি      |

---

### Common Error Fix Suggestions

| Error             | Suggestion                                      |
| ----------------- | ----------------------------------------------- |
| সংজ্ঞায়িত হয়নি  | আপনি কি ভেরিয়েবলটি ডিক্লেয়ার করতে ভুলে গেছেন? |
| ) বন্ধনী নেই      | দয়া করে সমস্ত বন্ধনী জোড়া পরীক্ষা করুন        |
| অপ্রত্যাশিত টোকেন | আপনার কোডে বানান বা সিনট্যাক্স চেক করুন         |

---

## Console Override System

The console is overridden to capture output:

* `console.log`
* `console.error`
* `console.warn`

Each output is rendered in a custom UI panel.

---

## UI Components

* CodeMirror editor (Dracula theme)
* Run button (`Ctrl + Enter`)
* Clear console button
* Output terminal panel

---

## Example Program

```js
প্রক্রিয়া অভিবাদন(নাম) {
    দেখাও("হ্যালো " + নাম);
}

অভিবাদন("বাংলাদেশ");
```

---

## Run Function

Main execution function:

```js
function runBornoCode()
```

Steps:

1. Clear console
2. Override console
3. Translate code
4. Execute via `eval()`
5. Show errors in Bangla
6. Restore console

---

## Limitations

* Uses `eval()` (not secure for production)
* Simple string-based translation (not AST-based)
* No real compiler
* No sandbox isolation

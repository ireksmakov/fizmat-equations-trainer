"use strict";
// Лёгкий smoke-test работы существующих браузерных скриптов без внешних зависимостей.
const assert=require("node:assert/strict");
const fs=require("node:fs");
const vm=require("node:vm");
const html=fs.readFileSync("index.html","utf8");
const inline=html.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(inline,"Основной встроенный скрипт найден");
const elements=new Map();
function element(id=""){
  if(elements.has(id))return elements.get(id);
  const e={id,innerHTML:"",textContent:"",value:"",hidden:false,disabled:false,
    className:"",style:{},dataset:{},
    insertAdjacentElement(){},closest(){return this},
    parentElement:{insertAdjacentElement(){}},onclick:null,onchange:null,onkeydown:null};
  if(id==="difficulty")e.value="0";
  if(id==="v2-count")e.value="5";
  if(id==="graphMode")e.value="linear";
  if(id==="param")e.value="2";
  elements.set(id,e);return e;
}
const document={
  getElementById:element,createElement:()=>element("generated-"+elements.size),
  querySelectorAll:()=>[]
};
const values=new Map();
const localStorage={getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v)};
const window={document,localStorage,console};
window.window=window;
vm.createContext(window);
for(const [path,source] of [
 ["inline",inline[1]],["trainer-bank.js",fs.readFileSync("trainer-bank.js","utf8")],
 ["trainer-v2.js",fs.readFileSync("trainer-v2.js","utf8")]
])vm.runInContext(source,window,{filename:path});
const F=window.FizmatBank;
assert.ok(F);
assert.equal(element("v2-number").textContent,"Задание 1 из 5");
function start(n,topic,level){
  element("v2-count").value=String(n);
  element("difficulty").value=String(level);
  vm.runInContext("topic="+topic,window);
  element("v2-start").onclick();
}
for(const n of [5,10,15]){
  start(n,0,0);
  const seen=new Set();
  for(let i=0;i<n;i++){
    const q=element("question").innerHTML;
    assert.ok(q&&!seen.has(q),"Повтор вопроса в тренировке "+n);
    seen.add(q);
    assert.equal(element("v2-number").textContent,"Задание "+(i+1)+" из "+n);
    element("next").onclick();
  }
  assert.ok(element("question").innerHTML.includes("Тренировка завершена"));
}
start(5,0,0);
let first=element("question").innerHTML;
const task=Array.from({length:15},(_,i)=>F.make(0,0,i)).find(t=>t.q===first);
assert.ok(task,"Найден эталон отображённого линейного задания");
element("answer").value="неверный ответ";
element("check").onclick();
assert.equal(element("check").disabled,false,"После ошибки можно исправить ответ");
assert.ok(element("feedback").textContent.includes("исправьте"));
element("answer").value=task.answer;
element("check").onclick();
assert.equal(element("check").disabled,true,"Верный ответ блокирует повторное начисление");
assert.ok(element("feedback").textContent.includes("Верно после исправления"));
assert.equal(element("v2-score").textContent,"Правильно: 1");
assert.equal(Number(element("attempts").textContent),2);
assert.equal(Number(element("correct").textContent),1);
element("check").onclick();
assert.equal(Number(element("attempts").textContent),2,"За повторное нажатие не начисляются попытки");
// Типографика через реальные функции сайта: дроби, корни, системы.
start(5,1,0);
assert.ok(element("question").innerHTML.includes("math-frac"),"Горизонтальная дробная черта");
start(5,8,0);
assert.ok(element("question").innerHTML.includes("v2-root"),"Знак радикала");
start(5,7,0);
assert.ok(element("question").innerHTML.includes("v2-system"),"Система с фигурной скобкой");
console.log("OK: режимы 5/10/15; исправление ответов; статистика; дроби, корни и системы.");

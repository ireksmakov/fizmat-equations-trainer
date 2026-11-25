"use strict";
// Независимый регрессионный аудит 675 вариантов банка без сторонних пакетов.
const assert=require("node:assert/strict");
const fs=require("node:fs");
const vm=require("node:vm");
const context={window:{}};
vm.runInNewContext(fs.readFileSync("trainer-bank.js","utf8"),context,{filename:"trainer-bank.js"});
const F=context.window.FizmatBank;
assert.ok(F&&typeof F.make==="function"&&typeof F.validate==="function");
const subToNum=s=>Number(s.replace(/[₀₁₂₃₄₅₆₇₈₉]/g,c=>"₀₁₂₃₄₅₆₇₈₉".indexOf(c)));
function jsExpr(s){
  s=s.replace(/−/g,"-").replace(/\s/g,"").replace(/π/g,"Math.PI");
  s=s.replace(/log([₀-₉]+)\(([^()]*)\)/g,(_,base,arg)=>"(Math.log("+arg+")/Math.log("+subToNum(base)+"))");
  s=s.replace(/√\(([^()]*)\)/g,"Math.sqrt($1)").replace(/√(\d+)/g,"Math.sqrt($1)");
  s=s.replace(/sin\(/g,"Math.sin(").replace(/cos\(/g,"Math.cos(");
  s=s.replace(/\|([^|]+)\|/g,"Math.abs($1)");
  s=s.replace(/²/g,"**2").replace(/³/g,"**3").replace(/\^/g,"**");
  s=s.replace(/(\d)(x|a|y)/g,"$1*$2").replace(/a(?=x)/g,"a*").replace(/(\d)(?=Math\.)/g,"$1*");
  s=s.replace(/(\d)(?=\()/g,"$1*").replace(/(x|a|y)(?=\()/g,"$1*").replace(/\)\(/g,")*(");
  return s;
}
function expr(s,x,y=0,a=0){return new Function("x","y","a","return ("+jsExpr(s)+")")(x,y,a)}
function equation(q,x,y=0,a=0){
  const m=q.match(/^(.*?)=(.*)$/);assert.ok(m,"Уравнение: "+q);
  return expr(m[1],x,y,a)-expr(m[2],x,y,a);
}
function relation(q,x,y=0,a=0){
  const m=q.match(/^(.*?)(<=|>=|=|<|>|≤|≥)(.*)$/);
  assert.ok(m,"Отношение: "+q);
  const left=expr(m[1],x,y,a),right=expr(m[3],x,y,a);
  if(!Number.isFinite(left)||!Number.isFinite(right))return false;
  if(m[2]==="=")return Math.abs(left-right)<=1e-7*Math.max(1,Math.abs(left),Math.abs(right));
  if(m[2]==="<")return left<right;
  if(m[2]===">")return left>right;
  if(m[2]==="<="||m[2]==="≤")return left<=right;
  return left>=right;
}
function number(s){
 const n=s.replace(/−/g,"-").split("/");
 return n.length===2?Number(n[0])/Number(n[1]):Number(s.replace(/−/g,"-").replace(",","."));
}
function answerNumbers(s){return s.split(";").map(number).sort((a,b)=>a-b)}
function close(a,b){return Math.abs(a-b)<1e-6*Math.max(1,Math.abs(a),Math.abs(b))}
function equalRoots(got,want){
  assert.equal(got.length,want.length,"Число корней");
  got.sort((a,b)=>a-b);want.sort((a,b)=>a-b);
  got.forEach((x,i)=>assert.ok(close(x,want[i]),"Корни "+got+" вместо "+want));
}
function solutionSet(answer,x){
  return answer.split(";").some(t=>{
    let m=t.match(/^(-?\d+)(<=|<)x(<=|<)(-?\d+)$/);
    if(m)return (m[2]==="<"?Number(m[1])<x:Number(m[1])<=x)
      &&(m[3]==="<"?x<Number(m[4]):x<=Number(m[4]));
    return relation(t,x);
  });
}
function quadraticRoots(f){
  const C=f(0),B=(f(1)-f(-1))/2,A=(f(1)+f(-1)-2*C)/2;
  if(Math.abs(A)<1e-9)return [-C/B];
  const D=B*B-4*A*C;
  assert.ok(D>=-1e-7,"Дискриминант "+D);
  return [(-B-Math.sqrt(Math.max(0,D)))/(2*A),(-B+Math.sqrt(Math.max(0,D)))/(2*A)];
}
let count=0;
for(let topic=0;topic<15;topic++)for(let level=0;level<3;level++){
  const seen=new Set();
  for(let i=0;i<15;i++){
    const task=F.make(topic,level,i),answer=answerNumbers(task.answer);
    const header="Тема "+topic+", уровень "+level+", вариант "+i+": "+task.q;
    try{
      assert.ok(task.q&&task.answer&&task.hint&&task.solution,header);
      assert.ok(!seen.has(task.q),"Дубликат: "+header);seen.add(task.q);
      assert.equal(F.validate(task.answer,task.answer),true,"Эталон не принимается");
      if([0,1].includes(topic)){
        const f=x=>equation(task.q,x);
        const root=-f(0)/(f(1)-f(0));
        equalRoots(answer,[root]);assert.ok(relation(task.q,root));
      }else if(topic===2){
        const formula=task.q.split(". ")[0],roots=quadraticRoots(x=>equation(formula,x));
        if(level===1&&i===0)equalRoots(answer,[Math.min(...roots)]);
        else equalRoots(answer,roots);
        answer.forEach(x=>assert.ok(relation(formula,x)));
      }else if(topic===3||topic===4||topic===8){
        // Для рациональных и иррациональных задач обязательно проверяем ОДЗ.
        const actual=[];
        for(let j=-40;j<=660;j++){const x=j/2;if(relation(task.q,x))actual.push(x)}
        equalRoots(answer,actual);
      }else if(topic===5||topic===6){
        for(let j=-120;j<=160;j++){
          const x=j/4;
          assert.equal(relation(task.q,x),solutionSet(task.answer,x),"Ошибка знака при x="+x);
        }
      }else if(topic===7){
        const [e1,rest]=task.q.split("; "),e2=rest.split(". ")[0];
        const A1=equation(e1,1,0)-equation(e1,0,0),B1=equation(e1,0,1)-equation(e1,0,0),C1=-equation(e1,0,0);
        const A2=equation(e2,1,0)-equation(e2,0,0),B2=equation(e2,0,1)-equation(e2,0,0),C2=-equation(e2,0,0);
        const D=A1*B2-A2*B1;assert.notEqual(D,0);
        const x=(C1*B2-C2*B1)/D,y=(A1*C2-A2*C1)/D;
        equalRoots(answer,[level===0?x:level===1?y:x+y]);
      }else if(topic===9){
        const [l,r]=task.q.split(" = ");
        const f=x=>Math.log(expr(l,x))-Math.log(expr(r,x));
        const root=-f(0)/(f(1)-f(0));
        equalRoots(answer,[root]);assert.ok(relation(task.q,root));
      }else if(topic===10){
        // Аргументы возрастают по x и основания >1: корень единственен.
        assert.equal(answer.length,1);assert.ok(relation(task.q,answer[0]));
        assert.ok(equation(task.q,answer[0]-.1)<0&&equation(task.q,answer[0]+.1)>0);
      }else if(topic===11){
        const [formula,tail]=task.q.split(" на ");
        const n=Number(tail.match(/2·(\d+)/)[1]),x=Math.PI*answer[0];
        assert.ok(x>=0&&x<=Math.PI/(2*n)+1e-9);
        assert.ok(relation(formula,x),"Неверный тригонометрический угол");
      }else if(topic===12){
        const [e1,rest]=task.q.split("; "),e2=rest.split(". ")[0];
        const roots=quadraticRoots(x=>equation(e1,x)-equation(e2,x));
        const expected=level===0?Math.max(...roots):level===1?roots.find(x=>Math.abs(x)>1e-8):roots.reduce((a,b)=>a+b,0);
        equalRoots(answer,[expected]);
      }else if(topic===13){
        let expected;
        if(level===0){const m=task.q.match(/ax=(-?\d+).+x=(-?\d+)/);assert.ok(m);expected=Number(m[1])/Number(m[2])}
        else if(level===1){const m=task.q.match(/\(a−(\d+)\)x=(\d+)/);assert.ok(m&&Number(m[2])!==0);expected=Number(m[1])}
        else {const m=task.q.match(/x²−2ax\+(\d+)=0/);assert.ok(m);expected=Math.sqrt(Number(m[1]))}
        equalRoots(answer,[expected]);
      }else if(topic===14){
        let expected;
        if(level===0){const m=task.q.match(/x=(\d+)/);assert.ok(m);expected=Number(m[1])-1}
        else if(level===1){const m=task.q.match(/ax>(\d+)/);assert.ok(m);expected=Number(m[1])+1}
        else {const m=task.q.match(/x²\+(\d+)<a/);assert.ok(m);expected=Number(m[1])}
        equalRoots(answer,[expected]);
      }
      count++;
    }catch(error){error.message=header+"\n"+error.message;throw error}
  }
}
assert.equal(count,675);
for(let n of [5,10,15]){
  for(let trial=0;trial<20;trial++){
    const ids=F.pickIndices(n);
    assert.equal(ids.length,n);assert.equal(new Set(ids).size,n);
    ids.forEach(i=>assert.ok(i>=0&&i<15));
  }
}
for(const [want,given,expected] of [
 ["1/2","0,5",true],["1/2","2/4",true],["1/2","2/3",false],
 ["3;-2","-2;3",true],["√2","sqrt(2)",true],["π/6","0,5235987756",true],
 ["x<2;x>3","(-∞;2)∪(3;+∞)",true],["x<2;x>3","(-∞;2)∪[3;+∞)",false],
 ["-2<=x<=3","[-2;3]",true],["-2<x<3","[-2;3]",false],
 ["нет решений","∅",true],["x>2","2<x",true],["x>2","x>=2",false]
 ])assert.equal(F.validate(want,given),expected,want+" vs "+given);
console.log("OK: "+count+" математических вариантов; уникальность 5/10/15; проверка эквивалентных ответов.");

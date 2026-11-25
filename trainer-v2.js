(function(){
"use strict";
if(!window.FizmatBank){console.error("Не загружен trainer-bank.js");return;}
const $v=id=>document.getElementById(id),F=window.FizmatBank;
let questions=[],position=0,score=0,answered=false,completed=false,wrongAttempts=0;
const styleText="Ответы: число или дробь (1/2 = 0,5), корни через ;, неравенство x>2 или промежутки (−∞;2) ∪ (3;+∞).";
function makeHTML(text){
 let prepared=String(text).replace(/√(\d+)\/(\d+)/g,"(√$1)/$2");
 let s=richMath(prepared);
 s=s.replace(/√\(([^()]+)\)/g,'<span class="v2-root"><span class="v2-sign">√</span><span class="v2-radicand">$1</span></span>');
 s=s.replace(/√(\d+)/g,'<span class="v2-root"><span class="v2-sign">√</span><span class="v2-radicand">$1</span></span>');
 return s;
}
function questionHTML(q){
 if(topic===7||topic===12){
  const separator=q.indexOf("; "),end=q.indexOf(". ",separator);
  if(separator>0&&end>separator){
   const first=q.slice(0,separator),second=q.slice(separator+2,end),tail=q.slice(end+2);
   return '<div class="v2-system"><span class="v2-sysbrace">{</span><span class="v2-syslines"><span>'+makeHTML(first)+'</span><span>'+makeHTML(second)+'</span></span></div><div class="v2-explain">'+makeHTML(tail)+'</div>';
  }
 }
 return makeHTML(q);
}
const opts=document.createElement("div");
opts.className="v2-options";
opts.innerHTML='<label>Заданий в тренировке<select id="v2-count"><option value="5">5 заданий</option><option value="10">10 заданий</option><option value="15">15 заданий</option></select></label><button class="btn" id="v2-start">Начать тренировку</button>';
$v("difficulty").closest(".controls").insertAdjacentElement("afterend",opts);
const progress=document.createElement("div");
progress.className="v2-progress";
progress.innerHTML='<div class="v2-info"><span id="v2-number">Задание 1 из 5</span><span id="v2-score">Правильно: 0</span></div><div class="v2-meter"><div id="v2-bar" style="width:0%"></div></div>';
$v("question").insertAdjacentElement("beforebegin",progress);
const srcDiv=document.createElement("div");
srcDiv.className="v2-source";srcDiv.id="v2-source";
$v("question").insertAdjacentElement("afterend",srcDiv);
const formats=document.createElement("p");
formats.className="muted";formats.textContent=styleText;
$v("answer").parentElement.insertAdjacentElement("beforebegin",formats);
const links=document.createElement("p");
links.className="v2-source";
links.innerHTML='Источники и типы заданий: <a href="https://fipi.ru/oge/otkrytyy-bank-zadaniy-oge" target="_blank" rel="noopener">ФИПИ ОГЭ</a> · <a href="https://fipi.ru/ege/otkrytyy-bank-zadaniy-ege" target="_blank" rel="noopener">ФИПИ ЕГЭ</a>. Большинство задач — новые авторские аналоги.';
$v("solution").insertAdjacentElement("afterend",links);
function topicButtons(){
 $v("topics").innerHTML=BANK.map((b,i)=>'<button class="topic '+(i===topic?"active":"")+'" data-topic="'+i+'">'+(i+1)+". "+b[0]+"</button>").join("");
 document.querySelectorAll("[data-topic]").forEach(btn=>btn.onclick=()=>{topic=Number(btn.dataset.topic);start()});
}
function updateProgress(done){
 $v("v2-number").textContent=completed?"Тренировка завершена":"Задание "+(position+1)+" из "+questions.length;
 $v("v2-score").textContent="Правильно: "+score;
 $v("v2-bar").style.width=Math.round(100*done/questions.length)+"%";
}
function show(){
 const t=questions[position];
 $v("title").textContent=BANK[topic][0];
 $v("question").innerHTML=questionHTML(t.q);
 $v("hint").textContent=t.hint;$v("hint").hidden=true;
 $v("solution").innerHTML=makeHTML(t.solution);$v("solution").hidden=true;
 $v("answer").value="";$v("answer").disabled=false;
 $v("check").disabled=false;
 $v("feedback").textContent="Решите уравнение и нажмите «Проверить».";
 $v("feedback").className="feedback";
 $v("next").textContent=position+1===questions.length?"Завершить тренировку":"Следующее задание →";
 $v("v2-source").innerHTML=t.source?('Тип задания и материалы: <a target="_blank" rel="noopener" href="'+t.source.url+'">'+t.source.name+"</a>"):"";
 answered=false;completed=false;wrongAttempts=0;updateProgress(position);
}
function start(){
 const n=Number($v("v2-count").value),level=Number($v("difficulty").value);
 // Новый случайный порядок без повторений внутри одной тренировки.
 questions=F.pickIndices(n).map(i=>({...F.make(topic,level,i),variantId:i}));
 position=0;score=0;completed=false;topicButtons();show();
}
function end(){
 completed=true;
 $v("title").textContent="Результаты: "+BANK[topic][0];
 $v("question").innerHTML='<div class="v2-completed"><h3>Тренировка завершена</h3><div>Правильно: '+score+' из '+questions.length+' · '+Math.round(100*score/questions.length)+'%</div></div>';
 $v("feedback").textContent="Выберите другую тему, уровень или количество заданий, чтобы продолжить.";
 $v("feedback").className="feedback good";
 $v("answer").disabled=true;$v("check").disabled=true;
 $v("v2-source").textContent="Ответы и попытки сохранены в статистике браузера.";
 $v("next").textContent="Повторить тренировку";
 updateProgress(questions.length);
}
function check(){
 if(completed||answered)return;
 const value=$v("answer").value.trim();
 if(!value){$v("feedback").textContent="Сначала введите ответ.";return;}
 const task=questions[position],isRight=F.validate(task.answer,value);
 stats.attempts+=1;stats.correct+=Number(isRight);
 if(isRight){
  score+=1;answered=true;
  stats.done["v2-"+topic+"-"+$v("difficulty").value+"-"+task.variantId]=true;
 }else wrongAttempts+=1;
 stats.history.push({date:new Date().toISOString(),topic:BANK[topic][0],
  level:Number($v("difficulty").value)+1,variant:task.variantId+1,
  answer:value,correct:isRight});
 save();
 $v("feedback").className="feedback "+(isRight?"good":"bad");
 $v("feedback").textContent=isRight
  ?(wrongAttempts?"Верно после исправления! Можете переходить к следующему заданию.":"Правильно! Можно переходить к следующему заданию.")
  :"Неверно. Проверьте ответ, исправьте его и попробуйте ещё раз — либо откройте подсказку или разбор.";
 $v("check").disabled=isRight;
 updateProgress(position+(isRight?1:0));
}
$v("v2-start").onclick=start;
$v("v2-count").onchange=start;
$v("difficulty").onchange=start;
$v("random").onclick=()=>{topic=Math.floor(Math.random()*BANK.length);start()};
$v("next").onclick=()=>{if(completed){start();return;}if(position+1<questions.length){position+=1;show();}else end()};
$v("check").onclick=check;
$v("answer").onkeydown=e=>{if(e.key==="Enter")check()};
$v("hintBtn").onclick=()=>$v("hint").hidden=!$v("hint").hidden;
$v("solutionBtn").onclick=()=>$v("solution").hidden=!$v("solution").hidden;
start();
})();
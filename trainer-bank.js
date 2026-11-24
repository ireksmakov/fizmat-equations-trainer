(function(g){
"use strict";
const OGE="https://fipi.ru/oge/otkrytyy-bank-zadaniy-oge";
const EGE="https://fipi.ru/ege/otkrytyy-bank-zadaniy-ege";
const demoO="https://egeresheniye.ru/oge-matematika/kim-demoversiya-2026";
const demoE="https://egeresheniye.ru/ege-matematika-profil/demoversiya-2026";
const similar="https://math-oge.sdamgia.ru/test?theme=74&ttest=true&wclones=1";
function signed(n){return n<0?" − "+(-n):" + "+n}
function lin(a,b){return a+"x"+signed(b)}
function poly(a,b,c){return (a===1?"x²":a+"x²")+(b===0?"":b<0?" − "+(-b)+"x":" + "+b+"x")+(c===0?"":signed(c))}
function pair(a,b){return [a,b].sort((x,y)=>x-y).join(";")}
function item(q,answer,hint,solution,d,source){return {q:q,answer:String(answer),hint:hint,solution:solution,source:source||{name:d===2?"Авторский аналог · профиль ЕГЭ":d===1?"Авторский аналог · ОГЭ / стандарт":"Авторский аналог · базовый уровень",url:d===2?EGE:OGE}}}
function sub(n){return String(n).replace(/[0-9]/g,function(ch){return "₀₁₂₃₄₅₆₇₈₉"[Number(ch)]})}
function make(k,d,i){
const v=i+1,x=i-6,a=2+i%5,p=2+i%4,q=p+1;
if(k===0){
 if(d===0){let r=i-7;return item(lin(a,-a*r)+" = 0",r,"Перенесите число вправо.","x="+r+".",d)}
 if(d===1){let r=i-5,b=1+i%3,c=a+1,t=a*(r+b)-c*r;return item(a+"(x + "+b+") = "+lin(c,t),r,"Раскройте скобки и перенесите x влево.","Решение x="+r+".",d)}
 let b=a+2,r=i-5,u=1+i%4,w=2+i%3,t=a*(r+u)-b*(r-w);return item(a+"(x + "+u+") − "+b+"(x − "+w+") = "+t,r,"Раскройте обе скобки.","x="+r+".",d)
}
if(k===1){
 if(d===0){let den=2+i%5,t=1+i%4,c=i+1,r=den*t-c;return item("(x + "+c+")/"+den+" = "+t,r,"Умножьте уравнение на "+den+".","x="+r+".",d)}
 if(d===1){let r=i-5,t=2+i%3,b=p*t-r,c=q*t-r;return item("(x"+signed(b)+")/"+p+" = (x"+signed(c)+")/"+q,r,"Умножьте уравнение на "+(p*q)+".","Подстановка x="+r+" даёт равенство.",d)}
 let r=i-5,t=1+i%4,u=2+i%3,b=p*t-r,c=q*u-r;return item("(x"+signed(b)+")/"+p+" + (x"+signed(c)+")/"+q+" = "+(t+u),r,"Умножьте на "+(p*q)+".","При x="+r+" дроби равны "+t+" и "+u+".",d)
}
if(k===2){
 if(d===1&&i===0)return item("2x² − 3x + 1 = 0. Укажите меньший корень.","1/2","Найдите дискриминант.","D=1. Меньший корень x=1/2.",d,{name:"Демоверсия ОГЭ-2026 · уравнение",url:demoO});
 if(d===0)return item("x² − "+v*v+" = 0",pair(-v,v),"Разность квадратов.","x="+(-v)+" или "+v+".",d);
 let r=i-5,s=r+3,A=d===1?1:2+i%4,B=-A*(r+s),C=A*r*s;
 return item(poly(A,B,C)+" = 0",pair(r,s),"Найдите дискриминант или разложите на множители.","Корни: "+r+" и "+s+".",d)
}
if(k===3){
 if(d===2&&i===0)return item("(2x² + 7x + 3)/(x² − 9) = 1",-4,"ОДЗ: x≠3 и x≠−3.","После сокращения подходящим остаётся x=−4.",d,{name:"РЕШУ ОГЭ · подборка дробно-рациональных уравнений",url:similar});
 if(d===0){let den=i%5-2,r=den+4+i,m=2+i%4,c=m*(r-den)-r;return item("(x"+signed(c)+")/(x"+signed(-den)+") = "+m,r,"Укажите ОДЗ.","Ответ x="+r+".",d)}
 if(d===1){let co=1+i%4,m=co+2,den=i%3-2,r=den+i+4,c=m*(r-den)-co*r;return item("("+lin(co,c)+")/(x"+signed(-den)+") = "+m,r,"Умножьте обе части на знаменатель при x≠"+den+".","x="+r+".",d)}
 let r=i+1,res=2*r+4+i;return item("(x² − "+(r*r)+")/(x − "+r+") = "+(res+r),res,"При x≠"+r+" дробь равна x+"+r+".","Решение x="+res+".",d)
}
if(k===4){let mid=i-6,b=1+i%5;if(d===0)return item("|x"+signed(-mid)+"| = "+b,pair(mid-b,mid+b),"Раскройте модуль по двум случаям.","Корни: "+(mid-b)+" и "+(mid+b)+".",d);let co=d===1?p:p+1,t=i%4+1;return item("|"+co+"(x"+signed(-mid)+")|"+(d===2?signed(t):"")+" = "+(co*b+(d===2?t:0)),pair(mid-b,mid+b),"Сначала выделите модуль.","Корни: "+(mid-b)+" и "+(mid+b)+".",d)}
if(k===5){let t=i-7;if(d===0)return item(lin(a,-a*t)+" > 0","x>"+t,"Разделите на положительное число.","x>"+t+".",d);if(d===1)return item(lin(-a,a*t)+" ≥ 0","x<="+t,"При делении на отрицательное число знак меняется.","x≤"+t+".",d);let c=2+i%4;return item(lin(a,c)+" − "+(a+2)+"x < "+(c-2*t),"x>"+t,"Приведите подобные.","−2x < "+(-2*t)+", значит x>"+t+".",d)}
if(k===6){let r=i-6,s=r+3,ex=poly(1,-r-s,r*s);if(d===0)return item(ex+" < 0",r+"<x<"+s,"Парабола ниже Ox между корнями.","Ответ "+r+"<x<"+s+".",d);if(d===1)return item(ex+" > 0","x<"+r+";x>"+s,"Ищите внешние промежутки.","x<"+r+" или x>"+s+".",d);return item(ex+" ≤ 0",r+"<=x<="+s,"Включите оба корня.","Ответ "+r+"≤x≤"+s+".",d)}
if(k===7){let r=1+i,s=i%7-3;if(d===0)return item("x+y="+(r+s)+"; x−y="+(r-s)+". Найдите x.",r,"Сложите уравнения.","x="+r+", y="+s+".",d);if(d===1)return item("2x+y="+(2*r+s)+"; x−y="+(r-s)+". Найдите y.",s,"Решите сложением.","x="+r+", y="+s+".",d);return item("3x+y="+(3*r+s)+"; x−2y="+(r-2*s)+". Найдите x+y.",r+s,"Составьте систему для x и y.","x="+r+", y="+s+" ⇒ x+y="+(r+s)+".",d)}
if(k===8){
 if(d===2&&i===0)return item("√(2x+3) = x",3,"ОДЗ: x≥0. Возведите в квадрат.","x²−2x−3=0; подходят только x=3.",d,{name:"Демоверсия ЕГЭ-2026, профиль · уравнение",url:demoE});
 if(d===0){let n=i+2,c=i%5+1;return item("√(x + "+c+") = "+n,n*n-c,"Возведите в квадрат.","x="+(n*n-c)+".",d)}
 if(d===1){let r=i+2,n=i+3,co=2+i%4,b=n*n-co*r;return item("√("+lin(co,b)+") = "+n,r,"Возведите обе части в квадрат.","x="+r+".",d)}
 let h=1+i%4,r=h+3+i,c=(r-h)*(r-h)-r;return item("√(x"+signed(c)+") = x − "+h,r,"ОДЗ: x≥"+h+".","После проверки x="+r+".",d)
}
if(k===9){let base=2+i%3,r=i+1;if(d===0)return item(base+"^x = "+Math.pow(base,r),r,"Приравняйте показатели степеней.","x="+r+".",d);if(d===1){let b=i+1,c=i%4+2;return item(base+"^(x−"+b+") = "+Math.pow(base,c),b+c,"Приравняйте показатели.","x="+(b+c)+".",d)}return item("("+base+"²)^x = "+base+"^(x+"+r+")",r,"Представьте левую часть как "+base+"^(2x).","2x=x+"+r+" ⇒ x="+r+".",d)}
if(k===10){let base=2+i%3,lg="log"+sub(base),r=i+2;
 if(d===0){let pow=1+i%3,c=Math.pow(base,pow)-r;return item(lg+"(x"+signed(c)+") = "+pow,r,"Перейдите к показательной форме.","x="+r+".",d)}
 if(d===1){let co=2+i%3,pow=2+i%2,c=Math.pow(base,pow)-co*r;return item(lg+"("+lin(co,c)+") = "+pow,r,"Аргумент логарифма должен быть положительным.","x="+r+".",d)}
 let t=2+i%2,c=i+1,res=Math.pow(base,t)-c;return item(lg+"(x+"+c+") + log"+sub(base*base)+"(x+"+c+") = "+(3*t/2),res,"Приведите второй логарифм к основанию "+base+".","x="+res+".",d)
}
if(k===11){let n=i+1,den=d===0?6*n:d===1?4*n:3*n,Q=d===0?"sin("+n+"x) = 1/2":d===1?"cos("+n+"x) = √2/2":"2sin("+n+"x) = √3";return item(Q+" на [0;π/(2·"+n+")]. Найдите x/π.","1/"+den,"Используйте табличный угол.","x/π=1/"+den+".",d)}
if(k===12){let r=i+2;if(d===0)return item("y=x²; y="+r*r+". Найдите положительное x.",r,"Приравняйте правые части.","x="+r+".",d);if(d===1)return item("y=x²; y="+r+"x. Найдите ненулевое x.",r,"Решите уравнение x²="+r+"x.","x="+r+".",d);let x=i-5,y=x+3,u=i%3+1,t=u-x*y;return item("y=x²+"+u+"; y="+lin(x+y,t)+". Найдите сумму абсцисс пересечения.",x+y,"Приравняйте правые части и примените Виета.","Корни "+x+" и "+y+". Сумма "+(x+y)+".",d)}
if(k===13){let c=i+2;if(d===0){let r=2+i%4;return item("При каком a уравнение ax="+(c*r)+" имеет корень x="+r+"?",c,"Подставьте x="+r+".","a="+c+".",d)}if(d===1)return item("При каком a уравнение (a−"+c+")x="+(c+1)+" не имеет решений?",c,"Коэффициент при x должен быть нулём.","a="+c+".",d);return item("При каком положительном a уравнение x²−2ax+"+c*c+"=0 имеет ровно один корень?",c,"Дискриминант равен нулю.","a="+c+".",d)}
if(k===14){let c=i+2;if(d===0)return item("Неравенство x>a содержит x="+c+". Назовите наибольшее целое a.",c-1,"Получите a<"+c+".","a="+(c-1)+".",d);if(d===1)return item("Неравенство ax>"+c+" содержит x=1. Назовите наименьшее целое a.",c+1,"Подставьте x=1.","a="+(c+1)+".",d);return item("При каком наибольшем целом a неравенство x²+"+c+"<a не имеет решений?",c,"Минимум x²+"+c+" равен "+c+".","a="+c+".",d)}
throw Error("Раздел вне списка "+k)
}
function numeric(s){s=String(s).replace(/−/g,"-").replace(/,/g,".").trim();if(/^[-+]?\d+(\.\d+)?$/.test(s))return Number(s);let m=s.match(/^([-+]?\d+(?:\.\d+)?)\/([-+]?\d+(?:\.\d+)?)$/);return m&&+m[2]!==0?+m[1]/+m[2]:NaN}
function validate(want,given){
 const norm=s=>String(s).toLowerCase().replace(/\s/g,"").replace(/−/g,"-").replace(/≤/g,"<=").replace(/≥/g,">=").replace(/,/g,".").replace(/или/g,";");
 let a=norm(want),b=norm(given);if(a===b)return true;let aa=a.split(";"),bb=b.split(";");if(aa.length!==bb.length)return false;
 let aNums=aa.map(numeric),bNums=bb.map(numeric);
 if(aNums.every(Number.isFinite)&&bNums.every(Number.isFinite)){aNums.sort((x,y)=>x-y);bNums.sort((x,y)=>x-y);return aNums.every((x,i)=>Math.abs(x-bNums[i])<0.00001)}
 return aa.sort().every((x,i)=>x===bb.sort()[i])
}
g.FizmatBank={make,validate,count:15,topics:15,levels:3};
})(window);
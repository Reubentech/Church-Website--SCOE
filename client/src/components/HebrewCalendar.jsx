import { useState, useEffect } from "react";
const HEBREW_MONTHS = ["Nisan","Iyar","Sivan","Tammuz","Av","Elul","Tishrei","Cheshvan","Kislev","Tevet","Shevat","Adar","Adar II"];
const HEBREW_MONTHS_HEB = ["נִיסָן","אִייָר","סִיוָן","תַּמּוּז","אָב","אֱלוּל","תִּשְׁרֵי","חֶשְׁוָן","כִּסְלֵו","טֵבֵת","שְׁבָט","אֲדָר","אֲדָר ב"];
const HEBREW_NUMS = ["","א","ב","ג","ד","ה","ו","ז","ח","ט","י","יא","יב","יג","יד","טו","טז","יז","יח","יט","כ","כא","כב","כג","כד","כה","כו","כז","כח","כט","ל"];
const DAYS_EN = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
function toHebrewDate(date) {
  const a = Math.floor((14-(date.getMonth()+1))/12);
  const y = date.getFullYear()+4800-a;
  const m = (date.getMonth()+1)+12*a-3;
  const jdn = date.getDate()+Math.floor((153*m+2)/5)+365*y+Math.floor(y/4)-Math.floor(y/100)+Math.floor(y/400)-32045;
  let yr = Math.floor((20*(jdn-1948438+122)+13)/7652);
  const p = jdn-(Math.floor(365*yr+yr/4-yr/100+yr/400)+32167+Math.floor((yr*7+1)/19)*30+5765);
  const ml = [30,29,30,29,30,29,30,((3*yr+5)%7<5?29:30),((yr*7+1)%19<7?30:29),29,30,29,29];
  const mi = ((7*(yr+1)+1)%19<7)?13:12;
  let month=0,day=0,el=p;
  for(let i=0;i<mi;i++){const l=ml[i]||29;if(el<l){month=i;day=el+1;break;}el-=l;}
  return {day,month,year:yr+3760};
}
function getParasha(date) {
  const p=[["Bereishit","Gen 1:1-6:8"],["Noach","Gen 6:9-11:32"],["Lech Lecha","Gen 12:1-17:27"],["Vayera","Gen 18:1-22:24"],["Chayei Sara","Gen 23:1-25:18"],["Toldot","Gen 25:19-28:9"],["Vayetzei","Gen 28:10-32:3"],["Vayishlach","Gen 32:4-36:43"],["Vayeshev","Gen 37:1-40:23"],["Miketz","Gen 41:1-44:17"],["Vayigash","Gen 44:18-47:27"],["Vayechi","Gen 47:28-50:26"],["Shemot","Ex 1:1-6:1"],["Vaera","Ex 6:2-9:35"],["Bo","Ex 10:1-13:16"],["Beshalach","Ex 13:17-17:16"],["Yitro","Ex 18:1-20:23"],["Mishpatim","Ex 21:1-24:18"],["Terumah","Ex 25:1-27:19"],["Tetzaveh","Ex 27:20-30:10"],["Ki Tisa","Ex 30:11-34:35"],["Vayakhel","Ex 35:1-38:20"],["Pekudei","Ex 38:21-40:38"],["Vayikra","Lev 1:1-5:26"],["Tzav","Lev 6:1-8:36"],["Shemini","Lev 9:1-11:47"],["Tazria","Lev 12:1-13:59"],["Metzora","Lev 14:1-15:33"],["Acharei Mot","Lev 16:1-18:30"],["Kedoshim","Lev 19:1-20:27"],["Emor","Lev 21:1-24:23"],["Behar","Lev 25:1-26:2"],["Bechukotai","Lev 26:3-27:34"],["Bamidbar","Num 1:1-4:20"],["Naso","Num 4:21-7:89"],["Beha'alotcha","Num 8:1-12:16"],["Shelach","Num 13:1-15:41"],["Korach","Num 16:1-18:32"],["Chukat","Num 19:1-22:1"],["Balak","Num 22:2-25:9"],["Pinchas","Num 25:10-30:1"],["Matot","Num 30:2-32:42"],["Masei","Num 33:1-36:13"],["Devarim","Deut 1:1-3:22"],["Va'etchanan","Deut 3:23-7:11"],["Eikev","Deut 7:12-11:25"],["Re'eh","Deut 11:26-16:17"],["Shoftim","Deut 16:18-21:9"],["Ki Teitzei","Deut 21:10-25:19"],["Ki Tavo","Deut 26:1-29:8"],["Nitzavim","Deut 29:9-30:20"],["Vayelech","Deut 31:1-30"],["Ha'azinu","Deut 32:1-52"],["Vezot Haberachah","Deut 33:1-34:12"]];
  const e=new Date(2023,9,7),d=Math.floor((date-e)/(7*86400000)),i=((d%p.length)+p.length)%p.length;
  return p[i];
}
function getOmer(date) {
  const d=new Date(date.getFullYear(),date.getMonth(),date.getDate());
  const seasons=[{start:new Date(2026,3,5),end:new Date(2026,4,21)},{start:new Date(2027,3,25),end:new Date(2027,5,9)}];
  for(const {start,end} of seasons){if(d>=start&&d<=end){const day=Math.floor((d-start)/86400000)+1;if(day>=1&&day<=49)return{day,week:Math.floor((day-1)/7)+1,dow:((day-1)%7)+1};}}
  const next=seasons.find(s=>d<s.start);
  return{day:0,daysUntil:next?Math.ceil((next.start-d)/86400000):null};
}
function getSabbath(date) {
  const LA=-0.2833,LO=36.3667,doy=Math.floor((date-new Date(date.getFullYear(),0,0))/86400000);
  const dc=23.45*Math.sin((360/365)*(doy-81)*Math.PI/180),dR=dc*Math.PI/180,lR=LA*Math.PI/180;
  const cH=(Math.cos(90.833*Math.PI/180)-Math.sin(lR)*Math.sin(dR))/(Math.cos(lR)*Math.cos(dR));
  const H=Math.acos(Math.max(-1,Math.min(1,cH)))*180/Math.PI;
  const eq=9.87*Math.sin(2*(360/365)*(doy-81)*Math.PI/180)-7.53*Math.cos((360/365)*(doy-81)*Math.PI/180)-1.5*Math.sin((360/365)*(doy-81)*Math.PI/180);
  const noon=720-4*LO-eq,ss=(noon+4*H)/60;
  const f=h=>{const hh=Math.floor(h),mm=Math.round((h-hh)*60);return `${hh}:${mm.toString().padStart(2,"0")}`;};
  return{candle:f(ss-18/60),start:f(ss),end:f(ss+24+18/60),havdalah:f(ss+24+42/60),sunsetHour:ss};
}
const FEASTS=[
  {name:"Purim",date:new Date(2026,2,3),heb:"14 Adar 5786"},
  {name:"Passover (Pesach)",date:new Date(2026,3,2),heb:"15 Nisan 5786"},
  {name:"First Fruits",date:new Date(2026,3,5),heb:"18 Nisan 5786"},
  {name:"Shavuot (Pentecost)",date:new Date(2026,4,21),heb:"6 Sivan 5786"},
  {name:"Tisha B'Av",date:new Date(2026,6,23),heb:"9 Av 5786"},
  {name:"Rosh Hashanah 5787",date:new Date(2026,8,11),heb:"1 Tishrei 5787"},
  {name:"Yom Kippur",date:new Date(2026,8,20),heb:"10 Tishrei 5787"},
  {name:"Sukkot Day 1",date:new Date(2026,8,25),heb:"15 Tishrei 5787"},
  {name:"Hoshana Raba",date:new Date(2026,9,1),heb:"21 Tishrei 5787"},
  {name:"Shemini Atzeret",date:new Date(2026,9,2),heb:"22 Tishrei 5787"},
  {name:"Simchat Torah",date:new Date(2026,9,3),heb:"23 Tishrei 5787"},
  {name:"Hanukkah (first night)",date:new Date(2026,11,4),heb:"25 Kislev 5787"},
  {name:"Hanukkah (last night)",date:new Date(2026,11,12),heb:"2 Tevet 5787"},
];
export default function HebrewCalendar() {
  const [now,setNow]=useState(new Date());
  useEffect(()=>{const t=setInterval(()=>setNow(new Date()),60000);return()=>clearInterval(t);},[]);
  const heb=toHebrewDate(now),para=getParasha(now),omer=getOmer(now);
  const fri=new Date(now);fri.setDate(now.getDate()+((5-now.getDay()+7)%7||7));
  const sat=new Date(fri);sat.setDate(fri.getDate()+1);
  const times=getSabbath(fri),timesEnd=getSabbath(sat);
  const isShab=now.getDay()===6,isErev=now.getDay()===5&&(now.getHours()+now.getMinutes()/60)>=getSabbath(now).sunsetHour;
  const shabbatOn=isShab||isErev;
  const today=new Date(now.getFullYear(),now.getMonth(),now.getDate());
  const feasts=FEASTS.map(f=>({...f,diff:Math.floor((f.date-today)/86400000)})).sort((a,b)=>a.date-b.date);
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-[#001F6B]">Hebrew Calendar</h1>
        <p className="text-gray-500 text-sm mt-1">Live dates, Sabbath times and feasts — Nyahururu, Kenya</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {[
          {label:"Hebrew date",value:`${heb.day} ${HEBREW_MONTHS[heb.month]}`,sub:`Year ${heb.year}`,color:"border-l-[#0038B8]"},
          {label:"Gregorian date",value:`${now.getDate()} ${now.toLocaleDateString("en-GB",{month:"long"})}`,sub:`${DAYS_EN[now.getDay()]} ${now.getFullYear()}`,color:"border-l-green-500"},
          {label:"Torah portion",value:para[0],sub:para[1],color:"border-l-purple-500"},
          {label:"Omer count",value:omer.day>0?`Day ${omer.day} of 49`:"Not counting",sub:omer.day>0?`Week ${omer.week}, Day ${omer.dow}`:omer.daysUntil?`Starts in ${omer.daysUntil}d`:"Season passed",color:"border-l-amber-500"},
        ].map(c=>(
          <div key={c.label} className={`bg-white border border-gray-200 rounded-xl p-4 border-l-4 ${c.color}`}>
            <p className="text-xs text-gray-500 mb-1">{c.label}</p>
            <p className="text-base font-semibold text-gray-900 leading-tight">{c.value}</p>
            <p className="text-xs text-gray-400 mt-1">{c.sub}</p>
            {c.label==="Omer count"&&omer.day>0&&<div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-amber-500 rounded-full" style={{width:`${Math.round((omer.day/49)*100)}%`}}/></div>}
          </div>
        ))}
      </div>
      <div className="bg-[#001F6B] rounded-xl p-4 mb-4 text-center">
        <p className="text-blue-300 text-xs mb-1">Today in Hebrew</p>
        <p className="text-2xl text-white font-semibold" style={{direction:"rtl",fontFamily:"serif"}}>{HEBREW_NUMS[heb.day]} {HEBREW_MONTHS_HEB[heb.month]} {heb.year}</p>
        <p className="text-blue-300 text-sm mt-1">{heb.day} {HEBREW_MONTHS[heb.month]} {heb.year}</p>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Sabbath Times — Nyahururu (EAT)</h2>
          <span className={`text-xs font-medium px-3 py-1 rounded-full ${shabbatOn?"bg-green-100 text-green-800":"bg-gray-100 text-gray-600"}`}>
            {shabbatOn?"Shabbat is active":`Shabbat in ${Math.ceil((fri-now)/86400000)}d`}
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[["Candle lighting",`${times.candle} Fri`],["Shabbat begins",`${times.start} Fri`],["Shabbat ends",`${timesEnd.end} Sat`],["Havdalah",`${timesEnd.havdalah} Sat`]].map(([l,v])=>(
            <div key={l} className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500">{l}</p><p className="text-sm font-semibold text-gray-900 mt-0.5">{v}</p></div>
          ))}
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Feasts of Elohim — 5786 / 5787</h2>
        <div className="space-y-1">
          {feasts.map((f,i)=>{
            const past=f.diff<0,tod=f.diff===0,soon=f.diff>0&&f.diff<=30;
            return(
              <div key={i} className={`flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0 ${past?"opacity-40":""}`}>
                <div>
                  <p className="text-sm font-medium text-gray-900">{f.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{f.date.toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short",year:"numeric"})} · {f.heb}</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ml-3 whitespace-nowrap ${past?"bg-gray-100 text-gray-500":tod?"bg-blue-100 text-blue-800":soon?"bg-amber-100 text-amber-800":"bg-green-100 text-green-800"}`}>
                  {past?"Passed":tod?"Today!":f.diff<=365?`In ${f.diff}d`:`In ${Math.ceil(f.diff/30)}mo`}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

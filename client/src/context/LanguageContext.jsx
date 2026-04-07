import { createContext, useContext, useState } from "react";
const T={en:{home:"Home",events:"Events",sermons:"Sermons",gallery:"Gallery",blog:"Blog",bulletin:"Bulletin",bibleStudy:"Bible Study",prayerRequests:"Prayer Requests",contact:"Contact",register:"Register",login:"Login",more:"More",churchName:"Sabbathtarian Church of Elohim",tagline:"Rooted in Scripture. Devoted to Truth.",welcomeTitle:"Welcome to Sabbathtarian Church of Elohim",welcomeText:"A congregation in Nyahururu, Kenya, devoted to the Word of Elohim, the seventh-day Sabbath, and the Feasts of the LORD.",nextSabbath:"Next Sabbath",days:"Days",hours:"Hours",minutes:"Minutes",seconds:"Seconds",upcomingEvents:"Upcoming Events",latestSermons:"Latest Sermons",submitPrayer:"Submit a Prayer Request",yourName:"Your Name",yourEmail:"Your Email",yourMessage:"Your Message",send:"Send",rsvp:"RSVP",readMore:"Read More",viewAll:"View All",loading:"Loading...",noEvents:"No upcoming events",adminLogin:"Admin Login",emailAddress:"Email Address",password:"Password",signIn:"Sign In",backToHome:"Back to Homepage",invalidCredentials:"Invalid email or password",subscribeNewsletter:"Subscribe to our newsletter",enterEmail:"Enter your email address",subscribe:"Subscribe",thankYou:"Thank you for subscribing!",learnMore:"Learn More",donate:"Give Online",sabbathShalom:"Shabbat Shalom!",location:"Nyahururu, Kenya"},sw:{home:"Nyumbani",events:"Matukio",sermons:"Mahubiri",gallery:"Picha",blog:"Blogu",bulletin:"Taarifa",bibleStudy:"Masomo ya Biblia",prayerRequests:"Maombi",contact:"Wasiliana",register:"Jisajili",login:"Ingia",more:"Zaidi",churchName:"Kanisa la Sabathtaria la Elohimu",tagline:"Imara katika Maandiko. Imetolewa kwa Ukweli.",welcomeTitle:"Karibu Kanisa la Sabathtaria la Elohimu",welcomeText:"Kusanyiko mjini Nyahururu, Kenya, lililowekwa wakfu kwa Neno la Elohimu, Sabato ya siku ya saba, na Sherehe za BWANA.",nextSabbath:"Sabato Inayokuja",days:"Siku",hours:"Masaa",minutes:"Dakika",seconds:"Sekunde",upcomingEvents:"Matukio Yanayokuja",latestSermons:"Mahubiri ya Hivi Karibuni",submitPrayer:"Wasilisha Ombi",yourName:"Jina Lako",yourEmail:"Barua Pepe Yako",yourMessage:"Ujumbe Wako",send:"Tuma",rsvp:"Jiandikishe",readMore:"Soma Zaidi",viewAll:"Ona Yote",loading:"Inapakia...",noEvents:"Hakuna matukio",adminLogin:"Ingia kwa Msimamizi",emailAddress:"Anwani ya Barua Pepe",password:"Nywila",signIn:"Ingia",backToHome:"Rudi Nyumbani",invalidCredentials:"Barua pepe au nywila si sahihi",subscribeNewsletter:"Jiandikishe kwa jarida letu",enterEmail:"Ingiza barua pepe yako",subscribe:"Jiandikishe",thankYou:"Asante kwa kujiandikisha!",learnMore:"Jifunze Zaidi",donate:"Toa Mtandaoni",sabbathShalom:"Sabato ya Amani!",location:"Nyahururu, Kenya"}};
const Ctx=createContext();
export function LanguageProvider({children}){
  const [lang,setLang]=useState(()=>{try{return localStorage.getItem("scoe_lang")||"en"}catch{return"en"}});
  const toggle=()=>{const n=lang==="en"?"sw":"en";setLang(n);try{localStorage.setItem("scoe_lang",n)}catch{}};
  const t=k=>T[lang][k]||T.en[k]||k;
  return <Ctx.Provider value={{lang,toggle,t}}>{children}</Ctx.Provider>;
}
export function useLang(){return useContext(Ctx);}
export function LanguageToggle(){
  const{lang,toggle}=useLang();
  return(
    <button onClick={toggle} title={lang==="en"?"Switch to Swahili":"Switch to English"} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-300 hover:border-[#0038B8] text-sm font-medium text-gray-700 hover:text-[#0038B8] transition-colors">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
      {lang==="en"?"SW":"EN"}
    </button>
  );
}
export default Ctx;

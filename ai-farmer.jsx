import { useState, useEffect, useRef, useCallback } from "react";

// ─── In-Memory User Store (persists across this session) ─────────────────────
const USER_STORE = {};

// ─── Constants ───────────────────────────────────────────────────────────────
const LANGUAGES = {
  en: { name: "English", greeting: "Hello Farmer!", label: "EN" },
  hi: { name: "हिंदी",   greeting: "नमस्ते किसान!", label: "HI" },
  te: { name: "తెలుగు",  greeting: "నమస్కారం రైతు!", label: "TE" },
};

const SOIL_TYPES = ["Clay", "Sandy", "Loamy", "Silt", "Black Cotton", "Red Laterite"];

const CROP_DB = {
  "Black Cotton": { hot:["Cotton","Soybean","Sunflower"],        mild:["Wheat","Chickpea","Lentil"],        cool:["Wheat","Mustard","Peas"] },
  Loamy:          { hot:["Rice","Maize","Sugarcane"],            mild:["Tomato","Potato","Onion"],          cool:["Spinach","Carrot","Cabbage"] },
  Sandy:          { hot:["Groundnut","Sesame","Millet"],         mild:["Watermelon","Pumpkin","Cucumber"],  cool:["Radish","Turnip","Garlic"] },
  Clay:           { hot:["Rice","Jute","Taro"],                  mild:["Wheat","Barley","Mustard"],         cool:["Cauliflower","Broccoli","Spinach"] },
  Silt:           { hot:["Rice","Sugarcane","Banana"],           mild:["Wheat","Potato","Tomato"],          cool:["Lettuce","Peas","Onion"] },
  "Red Laterite": { hot:["Cashew","Mango","Tapioca"],           mild:["Coffee","Pepper","Cardamom"],       cool:["Tea","Ginger","Turmeric"] },
};

const DISEASE_DB = [
  { name:"Leaf Blight",    causes:"Fungal infection due to excess moisture",     organic:"Neem oil spray every 7 days",                chemical:"Mancozeb 75% WP @ 2g/L water",              confidence:87, color:"#e74c3c" },
  { name:"Powdery Mildew", causes:"Erysiphe cichoracearum fungus, dry weather",  organic:"Baking soda solution (1 tbsp/liter)",         chemical:"Sulfur dust @ 25kg/hectare",                confidence:92, color:"#e67e22" },
  { name:"Rust Disease",   causes:"Puccinia fungus, high humidity",              organic:"Garlic extract spray",                        chemical:"Propiconazole 25% EC @ 1ml/L",              confidence:78, color:"#8e44ad" },
  { name:"Mosaic Virus",   causes:"Aphid-transmitted virus, poor soil health",   organic:"Remove infected plants, use reflective mulch", chemical:"Imidacloprid 17.8% SL for aphid control", confidence:83, color:"#27ae60" },
];

const EQUIPMENT = [
  { id:1, name:"John Deere Tractor 45HP", owner:"Ravi Kumar",   price:"₹800/day",  location:"Guntur, AP",   available:true,  icon:"🚜" },
  { id:2, name:"Paddy Harvester",         owner:"Suresh Reddy", price:"₹1200/day", location:"Krishna, AP",  available:true,  icon:"⚙️" },
  { id:3, name:"Rotavator",               owner:"Mohan Rao",    price:"₹400/day",  location:"Nellore, AP",  available:false, icon:"🔧" },
  { id:4, name:"Sprayer Pump",            owner:"Lakshmi Devi", price:"₹200/day",  location:"Prakasam, AP", available:true,  icon:"💧" },
];

const MARKET = [
  { id:1, crop:"Tomato",         farmer:"Gopal Rao",      qty:"500 kg",  price:"₹18/kg", location:"Vijayawada", icon:"🍅" },
  { id:2, crop:"Rice (Basmati)", farmer:"Srinivas Reddy", qty:"2 tons",  price:"₹42/kg", location:"Nellore",    icon:"🌾" },
  { id:3, crop:"Groundnut",      farmer:"Padma Devi",     qty:"800 kg",  price:"₹55/kg", location:"Guntur",     icon:"🥜" },
  { id:4, crop:"Chilli",         farmer:"Ramu Naidu",     qty:"300 kg",  price:"₹90/kg", location:"Warangal",   icon:"🌶️" },
];

const COMMUNITY_POSTS_INIT = [
  { id:1, user:"Ravi K.",  avatar:"👨‍🌾", time:"2h ago", msg:"My cotton leaves turning yellow. Any suggestions?",  replies:4, likes:12 },
  { id:2, user:"Padma D.", avatar:"👩‍🌾", time:"5h ago", msg:"Best organic fertilizer for tomatoes in summer?",    replies:7, likes:23 },
  { id:3, user:"Suresh M.",avatar:"👨‍🌾", time:"1d ago", msg:"Selling used pump at good price - Guntur area",      replies:2, likes:8  },
];

const T = {
  en: {
    appName:"Smart Farmer AI",
    login:"Login", signup:"Sign Up", logout:"Logout",
    email:"Email / Phone", password:"Password", confirmPassword:"Confirm Password",
    fullName:"Full Name", village:"Village / Town",
    farmer:"Farmer 👨‍🌾", buyer:"Buyer 🧑‍💼",
    loginBtn:"🔐 Login to Your Account", signupBtn:"🌱 Create Free Account",
    noAccount:"New to Smart Farmer?", haveAccount:"Already have an account?",
    home:"Home", crop:"Crops", disease:"Disease", market:"Market",
    equipment:"Equipment", community:"Community", profile:"Profile",
    talkToAI:"Talk to AI", listening:"Listening...",
    cropTitle:"🌱 AI Crop Advisor",
    enterLocation:"Enter your location", selectSoil:"Select soil type",
    getRecommendation:"Get Crop Recommendation",
    diseaseTitle:"📷 Crop Disease Scanner",
    uploadImage:"Upload Leaf Photo", analyzing:"Analyzing...", scanDisease:"Scan for Disease",
    marketTitle:"🛒 Direct Buyer Platform", listCrop:"+ List Your Crop",
    equipTitle:"🚜 Equipment Rental", rentNow:"Book Now",
    communityTitle:"🤝 Farmer Community", askQuestion:"Ask a question...", post:"Post",
    weatherNow:"Current Weather", aiChat:"AI Assistant", send:"Send",
    greeting:"Hello! I'm your Smart Farmer AI. How can I help you today?",
    welcomeBack:"Welcome back,", logoutConfirm:"Are you sure you want to logout?",
    editProfile:"Edit Profile", myListings:"My Listings",
    paymentHistory:"Payment History", govtSchemes:"Government Schemes",
    errorEmail:"Please enter a valid email or phone number",
    errorPassword:"Password must be at least 6 characters",
    errorMatch:"Passwords do not match",
    errorName:"Please enter your full name",
    errorNotFound:"No account found. Please sign up first.",
    errorWrongPass:"Incorrect password. Please try again.",
    errorExists:"Account already exists. Please login.",
    successSignup:"✅ Account created! Please login now.",
    cancel:"Cancel",
  },
  hi: {
    appName:"स्मार्ट किसान AI",
    login:"लॉगिन", signup:"साइन अप", logout:"लॉगआउट",
    email:"ईमेल / फोन", password:"पासवर्ड", confirmPassword:"पासवर्ड की पुष्टि",
    fullName:"पूरा नाम", village:"गाँव / शहर",
    farmer:"किसान 👨‍🌾", buyer:"खरीदार 🧑‍💼",
    loginBtn:"🔐 लॉगिन करें", signupBtn:"🌱 खाता बनाएं",
    noAccount:"खाता नहीं है?", haveAccount:"पहले से खाता है?",
    home:"होम", crop:"फसल", disease:"रोग", market:"बाज़ार",
    equipment:"उपकरण", community:"समुदाय", profile:"प्रोफ़ाइल",
    talkToAI:"AI से बात करें", listening:"सुन रहा है...",
    cropTitle:"🌱 AI फसल सलाहकार",
    enterLocation:"अपना स्थान दर्ज करें", selectSoil:"मिट्टी का प्रकार चुनें",
    getRecommendation:"फसल सुझाव पाएं",
    diseaseTitle:"📷 फसल रोग स्कैनर",
    uploadImage:"पत्ती की फोटो अपलोड करें", analyzing:"विश्लेषण...", scanDisease:"रोग स्कैन करें",
    marketTitle:"🛒 सीधे खरीदार मंच", listCrop:"+ फसल सूचीबद्ध करें",
    equipTitle:"🚜 उपकरण किराया", rentNow:"अभी बुक करें",
    communityTitle:"🤝 किसान समुदाय", askQuestion:"प्रश्न पूछें...", post:"पोस्ट",
    weatherNow:"मौजूदा मौसम", aiChat:"AI सहायक", send:"भेजें",
    greeting:"नमस्ते! मैं आपका Smart Farmer AI हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?",
    welcomeBack:"वापसी पर स्वागत है,", logoutConfirm:"क्या आप लॉगआउट करना चाहते हैं?",
    editProfile:"प्रोफ़ाइल संपादित करें", myListings:"मेरी लिस्टिंग",
    paymentHistory:"भुगतान इतिहास", govtSchemes:"सरकारी योजनाएं",
    errorEmail:"कृपया वैध ईमेल या फोन नंबर दर्ज करें",
    errorPassword:"पासवर्ड कम से कम 6 अक्षर का होना चाहिए",
    errorMatch:"पासवर्ड मेल नहीं खाते", errorName:"कृपया अपना पूरा नाम दर्ज करें",
    errorNotFound:"खाता नहीं मिला। कृपया पहले साइन अप करें।",
    errorWrongPass:"गलत पासवर्ड। कृपया पुनः प्रयास करें।",
    errorExists:"इस ईमेल से खाता पहले से मौजूद है।",
    successSignup:"✅ खाता बन गया! अब लॉगिन करें।",
    cancel:"रद्द करें",
  },
  te: {
    appName:"స్మార్ట్ రైతు AI",
    login:"లాగిన్", signup:"సైన్ అప్", logout:"లాగ్ అవుట్",
    email:"ఇమెయిల్ / ఫోన్", password:"పాస్‌వర్డ్", confirmPassword:"పాస్‌వర్డ్ నిర్ధారించండి",
    fullName:"పూర్తి పేరు", village:"గ్రామం / పట్టణం",
    farmer:"రైతు 👨‍🌾", buyer:"కొనుగోలుదారు 🧑‍💼",
    loginBtn:"🔐 లాగిన్ చేయండి", signupBtn:"🌱 ఖాతా సృష్టించండి",
    noAccount:"ఖాతా లేదా?", haveAccount:"ఇప్పటికే ఖాతా ఉందా?",
    home:"హోమ్", crop:"పంట", disease:"వ్యాధి", market:"మార్కెట్",
    equipment:"పరికరాలు", community:"సమాజం", profile:"ప్రొఫైల్",
    talkToAI:"AI తో మాట్లాడు", listening:"వింటున్నాను...",
    cropTitle:"🌱 AI పంట సలహాదారు",
    enterLocation:"మీ స్థానాన్ని నమోదు చేయండి", selectSoil:"మట్టి రకాన్ని ఎంచుకోండి",
    getRecommendation:"పంట సిఫారసు పొందండి",
    diseaseTitle:"📷 పంట వ్యాధి స్కానర్",
    uploadImage:"ఆకు ఫోటో అప్లోడ్ చేయండి", analyzing:"విశ్లేషిస్తున్నాము...", scanDisease:"వ్యాధి స్కాన్ చేయండి",
    marketTitle:"🛒 నేరుగా కొనుగోలుదారు వేదిక", listCrop:"+ మీ పంటను జాబితా చేయండి",
    equipTitle:"🚜 పరికరాల అద్దె", rentNow:"ఇప్పుడు బుక్ చేయండి",
    communityTitle:"🤝 రైతు సమాజం", askQuestion:"ప్రశ్న అడగండి...", post:"పోస్ట్",
    weatherNow:"ప్రస్తుత వాతావరణం", aiChat:"AI సహాయకుడు", send:"పంపండి",
    greeting:"నమస్కారం! నేను మీ Smart Farmer AI. ఈరోజు నేను మీకు ఎలా సహాయపడగలను?",
    welcomeBack:"మళ్ళీ స్వాగతం,", logoutConfirm:"మీరు నిజంగా లాగ్ అవుట్ చేయాలనుకుంటున్నారా?",
    editProfile:"ప్రొఫైల్ సవరించండి", myListings:"నా జాబితాలు",
    paymentHistory:"చెల్లింపు చరిత్ర", govtSchemes:"ప్రభుత్వ పథకాలు",
    errorEmail:"దయచేసి చెల్లుబాటు అయ్యే ఇమెయిల్ లేదా ఫోన్ నంబర్ నమోదు చేయండి",
    errorPassword:"పాస్‌వర్డ్ కనీసం 6 అక్షరాలు ఉండాలి",
    errorMatch:"పాస్‌వర్డ్‌లు సరిపోలలేదు", errorName:"దయచేసి మీ పూర్తి పేరు నమోదు చేయండి",
    errorNotFound:"ఖాతా కనుగొనబడలేదు. దయచేసి ముందు సైన్ అప్ చేయండి.",
    errorWrongPass:"తప్పు పాస్‌వర్డ్. దయచేసి మళ్ళీ ప్రయత్నించండి.",
    errorExists:"ఈ ఇమెయిల్‌తో ఖాతా ఇప్పటికే ఉంది.",
    successSignup:"✅ ఖాతా సృష్టించబడింది! దయచేసి లాగిన్ చేయండి.",
    cancel:"రద్దు చేయండి",
  },
};

// ─── AI Response ──────────────────────────────────────────────────────────────
async function getAIResponse(message, lang) {
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        model:"claude-sonnet-4-20250514",
        max_tokens:1000,
        system:`You are Smart Farmer AI, an expert agricultural assistant for Indian farmers. 
        Respond in ${lang==="te"?"Telugu":lang==="hi"?"Hindi":"English"}.
        Keep responses short, practical, easy for rural farmers.
        Focus on: crop advice, pest control, organic farming, weather impacts, government schemes.`,
        messages:[{role:"user",content:message}],
      }),
    });
    const data = await res.json();
    return data.content?.[0]?.text || "I'm here to help! Please ask your farming question.";
  } catch {
    return {en:"I'm here to help! Ask me about crops, diseases, or fertilizers.",hi:"मैं यहाँ मदद के लिए हूँ!",te:"నేను సహాయానికి ఇక్కడ ఉన్నాను!"}[lang];
  }
}

// ─── Colors ───────────────────────────────────────────────────────────────────
const G = {
  dark:"#1b5e20", main:"#2d6a4f", light:"#40916c",
  pale:"#d8f3dc", accent:"#f9c74f", brown:"#5a3e28",
  bg:"#f0f7f4", card:"#ffffff", danger:"#e74c3c", warn:"#e67e22"
};

// ═══════════════════════════════════════════════════════════════════════════════
//  ROOT
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [lang, setLang]           = useState("en");
  const [screen, setScreen]       = useState("login");  // "login" | "signup"
  const [currentUser, setUser]    = useState(null);
  const [toast, setToast]         = useState(null);

  const showToast = (msg, type="error") => {
    setToast({msg,type});
    setTimeout(()=>setToast(null), 3500);
  };

  const handleLogin = (email, pass) => {
    const t = T[lang];
    if (!email.trim())          return showToast(t.errorEmail);
    if (pass.length < 6)        return showToast(t.errorPassword);
    const u = USER_STORE[email.toLowerCase().trim()];
    if (!u)                     return showToast(t.errorNotFound);
    if (u.password !== pass)    return showToast(t.errorWrongPass);
    setUser({ ...u, password:undefined });
  };

  const handleSignup = (form) => {
    const t = T[lang];
    if (!form.name.trim())                      return showToast(t.errorName);
    if (!form.email.trim())                     return showToast(t.errorEmail);
    if (form.password.length < 6)               return showToast(t.errorPassword);
    if (form.password !== form.confirm)         return showToast(t.errorMatch);
    const key = form.email.toLowerCase().trim();
    if (USER_STORE[key])                        return showToast(t.errorExists);
    USER_STORE[key] = {
      name:form.name.trim(), email:key, village:form.village.trim(),
      role:form.role, password:form.password,
      avatar:form.role==="buyer"?"🧑‍💼":"👨‍🌾",
      joined:new Date().toLocaleDateString(),
    };
    showToast(t.successSignup, "success");
    setScreen("login");
  };

  const handleLogout = () => setUser(null);

  return (
    <div style={css.shell}>
      <Toast toast={toast}/>
      {!currentUser
        ? screen==="login"
          ? <LoginPage  lang={lang} setLang={setLang} onLogin={handleLogin}  onSwitch={()=>setScreen("signup")}/>
          : <SignupPage lang={lang} setLang={setLang} onSignup={handleSignup} onSwitch={()=>setScreen("login")}/>
        : <MainApp lang={lang} setLang={setLang} user={currentUser} onLogout={handleLogout}/>
      }
    </div>
  );
}

// ─── Toast Notification ───────────────────────────────────────────────────────
function Toast({toast}) {
  if (!toast) return null;
  return (
    <div style={{...css.toast, background:toast.type==="success"?G.light:G.danger}}>
      {toast.msg}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  LOGIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════
function LoginPage({lang, setLang, onLogin, onSwitch}) {
  const [email, setEmail]   = useState("");
  const [pass, setPass]     = useState("");
  const [show, setShow]     = useState(false);
  const t = T[lang];

  return (
    <div style={css.authPage}>
      <AuthTop lang={lang} setLang={setLang} sub="India's #1 Digital Farm Assistant"/>

      <div style={css.authCard}>
        <h2 style={css.authCardH}>{t.login} 👋</h2>

        <Label text={`📧 ${t.email}`}/>
        <input style={css.inp} type="text" value={email} onChange={e=>setEmail(e.target.value)}
          placeholder="name@email.com  or  9876543210"/>

        <Label text={`🔒 ${t.password}`}/>
        <div style={css.passRow}>
          <input style={{...css.inp,paddingRight:46,marginBottom:0}} type={show?"text":"password"}
            value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••"
            onKeyDown={e=>e.key==="Enter"&&onLogin(email,pass)}/>
          <button style={css.eyeBtn} onClick={()=>setShow(!show)}>{show?"🙈":"👁️"}</button>
        </div>

        <button style={{...css.bigBtn,marginTop:18}} onClick={()=>onLogin(email,pass)}>{t.loginBtn}</button>

        <div style={css.orLine}>── or ──</div>

        <div style={css.switchRow}>
          <span style={css.switchTxt}>{t.noAccount}</span>
          <button style={css.switchBtn} onClick={onSwitch}>{t.signup} →</button>
        </div>
      </div>

      <p style={css.hint}>💡 First time? Tap <b>Sign Up</b> to create your free account</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  SIGNUP PAGE
// ═══════════════════════════════════════════════════════════════════════════════
function SignupPage({lang, setLang, onSignup, onSwitch}) {
  const [form, setForm] = useState({name:"",email:"",village:"",role:"farmer",password:"",confirm:""});
  const [show, setShow] = useState(false);
  const t = T[lang];
  const f = (k,v) => setForm(p=>({...p,[k]:v}));

  return (
    <div style={css.authPage}>
      <AuthTop lang={lang} setLang={setLang} sub="Join millions of Indian farmers"/>

      <div style={css.authCard}>
        <h2 style={css.authCardH}>{t.signup} 🌱</h2>

        <Label text={`👤 ${t.fullName}`}/>
        <input style={css.inp} value={form.name} onChange={e=>f("name",e.target.value)} placeholder="Ravi Kumar"/>

        <Label text={`📧 ${t.email}`}/>
        <input style={css.inp} type="text" value={form.email} onChange={e=>f("email",e.target.value)} placeholder="name@email.com or 9876543210"/>

        <Label text={`📍 ${t.village}`}/>
        <input style={css.inp} value={form.village} onChange={e=>f("village",e.target.value)} placeholder="Guntur, Andhra Pradesh"/>

        <Label text="🧑 I am a"/>
        <div style={css.roleRow}>
          {["farmer","buyer"].map(r=>(
            <button key={r} onClick={()=>f("role",r)}
              style={{...css.roleBtn,...(form.role===r?css.roleBtnA:{})}}>
              {t[r]}
            </button>
          ))}
        </div>

        <Label text={`🔒 ${t.password}`}/>
        <div style={css.passRow}>
          <input style={{...css.inp,paddingRight:46,marginBottom:0}} type={show?"text":"password"}
            value={form.password} onChange={e=>f("password",e.target.value)} placeholder="Min 6 characters"/>
          <button style={css.eyeBtn} onClick={()=>setShow(!show)}>{show?"🙈":"👁️"}</button>
        </div>

        <Label text={`🔒 ${t.confirmPassword}`} mt={14}/>
        <input style={css.inp} type="password" value={form.confirm} onChange={e=>f("confirm",e.target.value)} placeholder="Re-enter password"/>

        <button style={css.bigBtn} onClick={()=>onSignup(form)}>{t.signupBtn}</button>

        <div style={css.orLine}>── or ──</div>
        <div style={css.switchRow}>
          <span style={css.switchTxt}>{t.haveAccount}</span>
          <button style={css.switchBtn} onClick={onSwitch}>{t.login} →</button>
        </div>
      </div>
    </div>
  );
}

// ─── Shared Auth header ───────────────────────────────────────────────────────
function AuthTop({lang, setLang, sub}) {
  return (
    <div style={css.authTop}>
      <div style={css.authLogo}>🌾</div>
      <div style={css.authAppName}>Smart Farmer AI</div>
      <div style={css.authSub}>{sub}</div>
      <div style={css.langRow}>
        {Object.entries(LANGUAGES).map(([code,l])=>(
          <button key={code} onClick={()=>setLang(code)}
            style={{...css.langPill,...(lang===code?css.langPillA:{})}}>
            {l.label} {l.name}
          </button>
        ))}
      </div>
    </div>
  );
}
function Label({text, mt=0}) {
  return <div style={{fontSize:13,fontWeight:700,color:G.main,marginBottom:6,marginTop:mt}}>{text}</div>;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN APP  (after successful login)
// ═══════════════════════════════════════════════════════════════════════════════
function MainApp({lang, setLang, user, onLogout}) {
  const [tab,         setTab]         = useState("home");
  const [isListening, setListening]   = useState(false);
  const [isSpeaking,  setSpeaking]    = useState(false);
  const [showChat,    setShowChat]    = useState(false);
  const [chatMsgs,    setChatMsgs]    = useState([]);
  const [chatInput,   setChatInput]   = useState("");
  const [aiLoading,   setAILoading]   = useState(false);
  const [showLogout,  setShowLogout]  = useState(false);
  const t = T[lang];

  useEffect(()=>{
    setChatMsgs([{role:"ai",text:t.greeting,time:new Date().toLocaleTimeString()}]);
  },[lang]);

  const speak = useCallback((text)=>{
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang==="te"?"te-IN":lang==="hi"?"hi-IN":"en-IN";
    u.rate = 0.9;
    setSpeaking(true);
    u.onend = ()=>setSpeaking(false);
    window.speechSynthesis.speak(u);
  },[lang]);

  const startListening = useCallback(()=>{
    if (!("webkitSpeechRecognition" in window||"SpeechRecognition" in window)){
      alert("Voice input requires Chrome browser."); return;
    }
    const SR = window.SpeechRecognition||window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = lang==="te"?"te-IN":lang==="hi"?"hi-IN":"en-IN";
    rec.onstart  = ()=>setListening(true);
    rec.onresult = e=>{setChatInput(e.results[0][0].transcript);setListening(false);setShowChat(true);};
    rec.onerror  = ()=>setListening(false);
    rec.onend    = ()=>setListening(false);
    rec.start();
  },[lang]);

  const sendChat = async (override)=>{
    const msg = override||chatInput;
    if (!msg.trim()) return;
    const msgs = [...chatMsgs,{role:"user",text:msg,time:new Date().toLocaleTimeString()}];
    setChatMsgs(msgs); setChatInput(""); setAILoading(true);
    const reply = await getAIResponse(msg, lang);
    setChatMsgs([...msgs,{role:"ai",text:reply,time:new Date().toLocaleTimeString()}]);
    setAILoading(false);
    speak(reply);
  };

  const TABS = [
    {id:"home",      icon:"🏠", lbl:t.home},
    {id:"crop",      icon:"🌱", lbl:t.crop},
    {id:"disease",   icon:"🔬", lbl:t.disease},
    {id:"market",    icon:"🛒", lbl:t.market},
    {id:"equipment", icon:"🚜", lbl:t.equipment},
    {id:"community", icon:"🤝", lbl:t.community},
    {id:"profile",   icon:"👤", lbl:t.profile},
  ];

  return (
    <div style={css.app}>
      {/* ── Header ── */}
      <header style={css.header}>
        <div style={css.hL}>
          <span style={{fontSize:28}}>🌾</span>
          <div>
            <div style={css.hTitle}>{t.appName}</div>
            <div style={css.hSub}>{LANGUAGES[lang].greeting}</div>
          </div>
        </div>
        <div style={css.hR}>
          <div style={{display:"flex",gap:4}}>
            {Object.entries(LANGUAGES).map(([code,l])=>(
              <button key={code} onClick={()=>setLang(code)}
                style={{...css.lbtn,...(lang===code?css.lbtnA:{})}}>
                {l.label}
              </button>
            ))}
          </div>
          <span style={{fontSize:26}}>{user.avatar||"👨‍🌾"}</span>
        </div>
      </header>

      {/* ── Page Content ── */}
      <main style={css.main}>
        {tab==="home"      && <HomeTab      t={t} lang={lang} speak={speak} user={user} setTab={setTab}/>}
        {tab==="crop"      && <CropTab      t={t} lang={lang} speak={speak}/>}
        {tab==="disease"   && <DiseaseTab   t={t} lang={lang} speak={speak}/>}
        {tab==="market"    && <MarketTab    t={t}/>}
        {tab==="equipment" && <EquipmentTab t={t}/>}
        {tab==="community" && <CommunityTab t={t} speak={speak}/>}
        {tab==="profile"   && <ProfileTab   t={t} user={user} onLogout={()=>setShowLogout(true)}/>}
      </main>

      {/* ── AI Chat Drawer ── */}
      {showChat && (
        <div style={css.overlay}>
          <div style={css.chatModal}>
            <div style={css.chatHead}>
              <span>🤖 {t.aiChat}</span>
              <button onClick={()=>setShowChat(false)} style={css.xBtn}>✕</button>
            </div>
            <div style={css.chatBody}>
              {chatMsgs.map((m,i)=>(
                <div key={i} style={{...css.bubble,...(m.role==="user"?css.bubbleU:css.bubbleA)}}>
                  <div style={css.bubbleTxt}>{m.text}</div>
                  <div style={css.bubbleTime}>{m.time}</div>
                  {m.role==="ai"&&<button onClick={()=>speak(m.text)} style={css.speakMini}>🔊</button>}
                </div>
              ))}
              {aiLoading&&<div style={{...css.bubble,...css.bubbleA}}><span style={{letterSpacing:4}}>● ● ●</span></div>}
            </div>
            <div style={css.chatFoot}>
              <button onClick={startListening}
                style={{...css.micCircle,...(isListening?css.micCircleActive:{})}}>
                {isListening?"🔴":"🎤"}
              </button>
              <input style={css.chatIn} value={chatInput} onChange={e=>setChatInput(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&sendChat()}
                placeholder={isListening?t.listening:t.askQuestion}/>
              <button onClick={()=>sendChat()} style={css.sendBtn}>{t.send} ➤</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Logout Confirm Modal ── */}
      {showLogout && (
        <div style={css.overlay}>
          <div style={css.confirmBox}>
            <div style={{fontSize:52,marginBottom:10}}>🚪</div>
            <div style={css.confirmTitle}>{t.logout}?</div>
            <div style={css.confirmMsg}>{t.logoutConfirm}</div>
            <div style={css.confirmBtns}>
              <button onClick={()=>setShowLogout(false)} style={css.cancelBtn}>{t.cancel}</button>
              <button onClick={()=>{setShowLogout(false);onLogout();}} style={css.confirmLogoutBtn}>
                🚪 {t.logout}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Floating Mic FAB ── */}
      <button
        onClick={()=>{setShowChat(true);startListening();}}
        style={{...css.fab,...(isListening?css.fabListen:{}),...(isSpeaking?css.fabSpeak:{})}}>
        <span style={{fontSize:22}}>{isSpeaking?"🔊":isListening?"🔴":"🎤"}</span>
        <span style={css.fabLbl}>{isListening?t.listening:t.talkToAI}</span>
      </button>

      {/* ── Bottom Navigation ── */}
      <nav style={css.nav}>
        {TABS.map(tb=>(
          <button key={tb.id} onClick={()=>setTab(tb.id)}
            style={{...css.navItem,...(tab===tb.id?css.navActive:{})}}>
            <span style={{fontSize:20}}>{tb.icon}</span>
            <span style={css.navLbl}>{tb.lbl}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  TABS
// ═══════════════════════════════════════════════════════════════════════════════
function HomeTab({t,lang,speak,user,setTab}) {
  const wx = {temp:"28°C",cond:"Partly Cloudy",hum:"72%",wind:"12 km/h",icon:"⛅"};
  const TIPS = {
    en:["Apply neem oil to prevent pests this season","Check soil moisture before irrigation","PM-KISAN ₹2000 installment due this month"],
    hi:["इस मौसम में कीट रोकने के लिए नीम तेल लगाएं","सिंचाई से पहले मिट्टी की नमी जांचें","PM-KISAN ₹2000 किश्त इस महीने देय"],
    te:["ఈ సీజన్‌లో వేప నూనె వాడండి","నీటిపారుదల ముందు మట్టి తేమను తనిఖీ చేయండి","PM-KISAN ₹2000 వాయిదా ఈ నెలలో వస్తుంది"],
  };
  return (
    <div style={css.tab}>
      {/* Welcome */}
      <div style={css.banner}>
        <div>
          <div style={{color:"rgba(255,255,255,0.8)",fontSize:13}}>{t.welcomeBack}</div>
          <div style={{color:"#fff",fontSize:22,fontWeight:800}}>{user.name} {user.avatar}</div>
          <div style={{color:"rgba(255,255,255,0.7)",fontSize:12,marginTop:2}}>📍 {user.village||"India"}</div>
        </div>
        <div style={{fontSize:58}}>🌾</div>
      </div>

      {/* Weather */}
      <div style={css.wxCard}>
        <div style={{fontSize:12,opacity:0.8,marginBottom:8}}>{t.weatherNow}</div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontSize:36}}>{wx.icon}</span>
          <div><div style={{fontSize:28,fontWeight:800}}>{wx.temp}</div><div style={{fontSize:13,opacity:0.85}}>{wx.cond}</div></div>
          <div style={{marginLeft:"auto",fontSize:13,lineHeight:1.8}}><div>💧 {wx.hum}</div><div>🌬️ {wx.wind}</div></div>
        </div>
        <button onClick={()=>speak(`Weather: ${wx.temp}, ${wx.cond}`)} style={css.wxSpeak}>🔊 Hear Weather</button>
      </div>

      {/* Quick Actions */}
      <div style={css.secH}>⚡ Quick Actions</div>
      <div style={css.qGrid}>
        {[{icon:"🌱",lbl:t.crop,id:"crop",bg:"#2ecc71"},{icon:"🔬",lbl:t.disease,id:"disease",bg:"#e74c3c"},{icon:"🛒",lbl:t.market,id:"market",bg:"#f39c12"},{icon:"🚜",lbl:t.equipment,id:"equipment",bg:"#3498db"},{icon:"🤝",lbl:t.community,id:"community",bg:"#9b59b6"},{icon:"👤",lbl:t.profile,id:"profile",bg:"#1abc9c"}].map(a=>(
          <button key={a.id} onClick={()=>setTab(a.id)} style={{...css.qCard,background:a.bg}}>
            <span style={{fontSize:26}}>{a.icon}</span>
            <span style={{color:"#fff",fontWeight:700,fontSize:12}}>{a.lbl}</span>
          </button>
        ))}
      </div>

      {/* Tips */}
      <div style={css.secH}>💡 Today's Tips</div>
      {(TIPS[lang]||TIPS.en).map((tip,i)=>(
        <div key={i} style={css.tipRow}>
          <span style={css.tipNum}>{i+1}</span>
          <span style={{flex:1,fontSize:14,color:"#333"}}>{tip}</span>
          <button onClick={()=>speak(tip)} style={css.tipSpk}>🔊</button>
        </div>
      ))}
    </div>
  );
}

function CropTab({t,lang,speak}) {
  const [loc,setLoc]     = useState("");
  const [soil,setSoil]   = useState("");
  const [res,setRes]     = useState(null);
  const [loading,setL]   = useState(false);

  const go = ()=>{
    if (!soil){alert("Select soil type");return;}
    setL(true);
    setTimeout(()=>{
      const m=new Date().getMonth();
      const season=m<3||m>10?"cool":m<7?"hot":"mild";
      const crops=CROP_DB[soil]?.[season]||["Rice","Wheat","Maize"];
      const r={crops,soil,season,
        fertilizer:"NPK 14-14-14 @ 150 kg/ha + Organic compost 2 tons",
        yield:`${20+Math.floor(Math.random()*15)}-${35+Math.floor(Math.random()*10)} qtl/ha`,
        rain:"650mm+"};
      setRes(r);setL(false);
      speak(`Best crops: ${crops.join(", ")}. Yield: ${r.yield}`);
    },1400);
  };

  return (
    <div style={css.tab}>
      <h2 style={css.tabH}>{t.cropTitle}</h2>
      <div style={css.card}>
        <Label text={`📍 ${t.enterLocation}`}/>
        <input style={css.inp} value={loc} onChange={e=>setLoc(e.target.value)} placeholder="e.g. Guntur, Andhra Pradesh"/>
        <Label text={`🌍 ${t.selectSoil}`}/>
        <div style={css.soilGrid}>
          {SOIL_TYPES.map(so=><button key={so} onClick={()=>setSoil(so)} style={{...css.soilBtn,...(soil===so?css.soilBtnA:{})}}>{so}</button>)}
        </div>
        <button onClick={go} style={css.primBtn} disabled={loading}>{loading?"⏳ Analyzing…":t.getRecommendation}</button>
      </div>
      {res&&(
        <div style={css.resCard}>
          <div style={css.resHead}>✅ Recommendations for {res.soil}</div>
          {res.crops.map((c,i)=>(
            <div key={i} style={css.cropRow}>
              <span style={{fontWeight:800,color:"#aaa",width:24}}>#{i+1}</span>
              <span style={{flex:1,fontWeight:700,fontSize:15}}>🌿 {c}</span>
              {i===0&&<span style={css.bestBadge}>Best</span>}
            </div>
          ))}
          <div style={css.iGrid}>
            <div style={css.iBox}><div style={css.iLbl}>📊 Yield</div><div style={css.iVal}>{res.yield}</div></div>
            <div style={css.iBox}><div style={css.iLbl}>🌧️ Rain</div><div style={css.iVal}>{res.rain}</div></div>
          </div>
          <div style={css.fertiBox}><b>🧪 Fertilizer:</b> {res.fertilizer}</div>
          <button onClick={()=>speak(`Crops: ${res.crops.join(", ")}. ${res.fertilizer}`)} style={css.voiceBtn}>
            🔊 Hear in {LANGUAGES[lang].name}
          </button>
        </div>
      )}
    </div>
  );
}

function DiseaseTab({t,lang,speak}) {
  const [img,setImg]     = useState(null);
  const [res,setRes]     = useState(null);
  const [scan,setScan]   = useState(false);

  const upload = e=>{
    const f=e.target.files[0]; if(!f)return;
    const r=new FileReader(); r.onload=ev=>setImg(ev.target.result); r.readAsDataURL(f); setRes(null);
  };
  const go = ()=>{
    if(!img){alert("Upload an image first");return;}
    setScan(true);
    setTimeout(()=>{
      const d=DISEASE_DB[Math.floor(Math.random()*DISEASE_DB.length)];
      setRes(d);setScan(false);
      speak(`Detected: ${d.name}. Cause: ${d.causes}. Remedy: ${d.organic}`);
    },2000);
  };

  return (
    <div style={css.tab}>
      <h2 style={css.tabH}>{t.diseaseTitle}</h2>
      <div style={css.uploadBox}>
        {img
          ? <img src={img} alt="" style={{width:"100%",maxHeight:170,objectFit:"contain",borderRadius:12,marginBottom:10}}/>
          : <div style={{padding:"24px 0"}}><div style={{fontSize:50}}>📷</div><div style={{color:"#999",marginTop:8}}>{t.uploadImage}</div></div>}
        <label style={css.uploadLbl}>
          📂 {t.uploadImage}
          <input type="file" accept="image/*" capture="environment" onChange={upload} style={{display:"none"}}/>
        </label>
      </div>
      <button onClick={go} style={css.primBtn} disabled={scan||!img}>{scan?`⏳ ${t.analyzing}`:`🔬 ${t.scanDisease}`}</button>
      {res&&(
        <div style={css.resCard}>
          <div style={{display:"flex",alignItems:"center",gap:12,padding:12,border:`3px solid ${res.color}`,borderRadius:12,marginBottom:10}}>
            <span style={{fontSize:30}}>⚠️</span>
            <div><div style={{fontWeight:800,fontSize:18}}>{res.name}</div><div style={{color:"#666",fontSize:13}}>Confidence: {res.confidence}%</div></div>
          </div>
          <div style={{background:"#eee",borderRadius:4,height:8,marginBottom:12,overflow:"hidden"}}>
            <div style={{height:"100%",borderRadius:4,width:`${res.confidence}%`,background:res.color}}/>
          </div>
          {[["🔍 Causes",res.causes,"#333"],["🌿 Organic",res.organic,"#27ae60"],["💊 Chemical",res.chemical,"#e74c3c"]].map(([lbl,val,col])=>(
            <div key={lbl} style={{marginBottom:10}}>
              <div style={{fontWeight:700,fontSize:13,marginBottom:3}}>{lbl}</div>
              <div style={{fontSize:14,lineHeight:1.5,color:col}}>{val}</div>
            </div>
          ))}
          <button onClick={()=>speak(`${res.name}. ${res.causes}. ${res.organic}`)} style={css.voiceBtn}>
            🔊 Hear in {LANGUAGES[lang].name}
          </button>
        </div>
      )}
    </div>
  );
}

function MarketTab({t}) {
  const [show,setShow]=useState(false);
  return (
    <div style={css.tab}>
      <h2 style={css.tabH}>{t.marketTitle}</h2>
      <button onClick={()=>setShow(!show)} style={css.primBtn}>{t.listCrop}</button>
      {show&&(
        <div style={css.card}>
          <input style={css.inp} placeholder="Crop Name"/>
          <input style={css.inp} placeholder="Quantity (kg)" type="number"/>
          <input style={css.inp} placeholder="Price per kg (₹)" type="number"/>
          <input style={css.inp} placeholder="Your Location"/>
          <button style={css.primBtn}>✅ Submit Listing</button>
        </div>
      )}
      <div style={css.secH}>🌾 Available Crops</div>
      {MARKET.map(item=>(
        <div key={item.id} style={css.mCard}>
          <div style={{fontSize:36}}>{item.icon}</div>
          <div style={{flex:1}}>
            <div style={{fontWeight:800,fontSize:15}}>{item.crop}</div>
            <div style={{fontSize:12,color:"#666",marginTop:2}}>👨‍🌾 {item.farmer} · 📍 {item.location}</div>
            <div style={{fontSize:12,color:"#888"}}>📦 {item.qty}</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontWeight:800,color:G.main,fontSize:17}}>{item.price}</div>
            <button style={css.contactBtn}>💬 Contact</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function EquipmentTab({t}) {
  return (
    <div style={css.tab}>
      <h2 style={css.tabH}>{t.equipTitle}</h2>
      <button style={css.primBtn}>➕ List My Equipment</button>
      {EQUIPMENT.map(eq=>(
        <div key={eq.id} style={css.mCard}>
          <div style={{fontSize:36}}>{eq.icon}</div>
          <div style={{flex:1}}>
            <div style={{fontWeight:800,fontSize:15}}>{eq.name}</div>
            <div style={{fontSize:12,color:"#666"}}>👨‍🌾 {eq.owner}</div>
            <div style={{fontSize:12,color:"#888"}}>📍 {eq.location}</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontWeight:800,color:G.main,fontSize:16}}>{eq.price}</div>
            <div style={{fontSize:11,padding:"3px 7px",borderRadius:10,color:"#fff",display:"inline-block",margin:"4px 0",fontWeight:700,background:eq.available?"#27ae60":"#e74c3c"}}>
              {eq.available?"✅ Free":"❌ Booked"}
            </div>
            {eq.available&&<button style={css.rentBtn}>{t.rentNow}</button>}
          </div>
        </div>
      ))}
    </div>
  );
}

function CommunityTab({t,speak}) {
  const [posts,setPosts] = useState(COMMUNITY_POSTS_INIT);
  const [txt,setTxt]     = useState("");
  const add=()=>{if(!txt.trim())return;setPosts([{id:Date.now(),user:"You",avatar:"👤",time:"Just now",msg:txt,replies:0,likes:0},...posts]);setTxt("");};
  return (
    <div style={css.tab}>
      <h2 style={css.tabH}>{t.communityTitle}</h2>
      <div style={css.card}>
        <textarea style={css.postTA} placeholder={t.askQuestion} value={txt} onChange={e=>setTxt(e.target.value)} rows={3}/>
        <div style={{display:"flex",gap:8,marginTop:8}}>
          <button style={css.voiceBtn}>🎤 Voice</button>
          <button onClick={add} style={css.primBtn}>{t.post} ➤</button>
        </div>
      </div>
      {posts.map(p=>(
        <div key={p.id} style={css.postCard}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
            <span style={{fontSize:28}}>{p.avatar}</span>
            <div><div style={{fontWeight:700}}>{p.user}</div><div style={{fontSize:12,color:"#888"}}>{p.time}</div></div>
          </div>
          <div style={{fontSize:14,color:"#333",marginBottom:10,lineHeight:1.5}}>{p.msg}</div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>speak(p.msg)} style={css.postAct}>🔊 Hear</button>
            <button style={css.postAct}>💬 {p.replies}</button>
            <button style={css.postAct}>❤️ {p.likes}</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProfileTab({t,user,onLogout}) {
  return (
    <div style={css.tab}>
      {/* Profile card */}
      <div style={css.profBanner}>
        <div style={{fontSize:60,marginBottom:8}}>{user.avatar||"👨‍🌾"}</div>
        <div style={{fontSize:22,fontWeight:800,color:"#fff"}}>{user.name}</div>
        <div style={{color:"rgba(255,255,255,0.8)",textTransform:"capitalize",fontSize:14}}>{user.role}</div>
        <div style={{color:"rgba(255,255,255,0.7)",fontSize:13,marginTop:4}}>📍 {user.village||"India"}</div>
        <div style={{color:"rgba(255,255,255,0.65)",fontSize:12,marginTop:2}}>📧 {user.email}</div>
        {user.joined&&<div style={{color:"rgba(255,255,255,0.55)",fontSize:11,marginTop:2}}>Member since {user.joined}</div>}
      </div>

      {/* Stats */}
      <div style={css.statRow}>
        {[["🌾","Crops","3"],["🚜","Equip","1"],["💬","Posts","12"],["⭐","Rating","4.8"]].map(([ic,lb,val])=>(
          <div key={lb} style={css.statBox}>
            <div style={{fontSize:20}}>{ic}</div>
            <div style={{fontWeight:800,fontSize:18,color:G.main}}>{val}</div>
            <div style={{fontSize:10,color:"#888"}}>{lb}</div>
          </div>
        ))}
      </div>

      {/* Menu */}
      <div style={css.menuCard}>
        {[t.editProfile,t.myListings,t.paymentHistory,t.govtSchemes].map(item=>(
          <div key={item} style={css.menuItem}>
            <span>{item}</span><span style={{color:"#ccc"}}>›</span>
          </div>
        ))}

        {/* ─── LOGOUT BUTTON ─── visible, red, clearly labelled */}
        <div onClick={onLogout} style={css.logoutRow}>
          <span>🚪 {t.logout}</span>
          <span style={{opacity:0.7}}>›</span>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  STYLE OBJECTS
// ═══════════════════════════════════════════════════════════════════════════════
const css = {
  shell:{ fontFamily:"'Segoe UI',system-ui,sans-serif", minHeight:"100vh", background:G.bg, maxWidth:480, margin:"0 auto" },
  app:{ fontFamily:"'Segoe UI',system-ui,sans-serif", background:G.bg, minHeight:"100vh", maxWidth:480, margin:"0 auto", paddingBottom:88 },

  // Toast
  toast:{ position:"fixed",top:14,left:"50%",transform:"translateX(-50%)",color:"#fff",padding:"12px 20px",borderRadius:14,zIndex:9999,fontSize:14,fontWeight:700,boxShadow:"0 4px 24px rgba(0,0,0,0.3)",maxWidth:380,textAlign:"center",whiteSpace:"pre-line" },

  // ── Auth ──
  authPage:{ minHeight:"100vh",background:`linear-gradient(160deg,${G.dark} 0%,${G.light} 100%)`,display:"flex",flexDirection:"column",alignItems:"center",padding:"0 16px 40px",overflowY:"auto" },
  authTop:{ textAlign:"center",paddingTop:44,paddingBottom:22,color:"#fff" },
  authLogo:{ fontSize:62,marginBottom:6,filter:"drop-shadow(0 4px 14px rgba(0,0,0,0.35))" },
  authAppName:{ fontSize:24,fontWeight:900,letterSpacing:"-0.5px" },
  authSub:{ fontSize:13,opacity:0.8,marginTop:4,marginBottom:16 },
  langRow:{ display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap" },
  langPill:{ padding:"6px 13px",borderRadius:20,border:"2px solid rgba(255,255,255,0.4)",background:"transparent",color:"#fff",cursor:"pointer",fontSize:13,fontWeight:600 },
  langPillA:{ background:"rgba(255,255,255,0.22)",border:"2px solid #fff" },
  authCard:{ background:"#fff",borderRadius:24,padding:"26px 22px 28px",width:"100%",maxWidth:400,boxShadow:"0 20px 60px rgba(0,0,0,0.22)" },
  authCardH:{ fontSize:21,fontWeight:900,color:G.dark,marginBottom:18,marginTop:0 },
  inp:{ width:"100%",padding:"12px 13px",borderRadius:11,border:"2px solid #ddd",fontSize:15,marginBottom:12,boxSizing:"border-box",outline:"none",fontFamily:"inherit" },
  passRow:{ position:"relative",marginBottom:12 },
  eyeBtn:{ position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:18 },
  bigBtn:{ width:"100%",padding:14,background:`linear-gradient(135deg,${G.dark},${G.light})`,color:"#fff",border:"none",borderRadius:13,fontSize:16,fontWeight:800,cursor:"pointer",marginBottom:10 },
  orLine:{ textAlign:"center",color:"#ccc",margin:"8px 0",fontSize:13 },
  switchRow:{ display:"flex",justifyContent:"center",alignItems:"center",gap:8 },
  switchTxt:{ color:"#777",fontSize:14 },
  switchBtn:{ background:"none",border:"none",color:G.main,fontWeight:800,fontSize:14,cursor:"pointer" },
  hint:{ color:"rgba(255,255,255,0.75)",fontSize:13,textAlign:"center",marginTop:14,padding:"0 20px" },
  roleRow:{ display:"flex",gap:10,marginBottom:12 },
  roleBtn:{ flex:1,padding:"11px 8px",borderRadius:11,border:"2px solid #ddd",background:"#f8f8f8",cursor:"pointer",fontWeight:700,fontSize:14 },
  roleBtnA:{ background:G.pale,border:`2px solid ${G.main}`,color:G.dark },

  // ── App header ──
  header:{ background:`linear-gradient(135deg,${G.dark},${G.light})`,padding:"12px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 12px rgba(0,0,0,0.2)" },
  hL:{ display:"flex",alignItems:"center",gap:10 },
  hTitle:{ color:"#fff",fontWeight:800,fontSize:17,lineHeight:1 },
  hSub:{ color:"rgba(255,255,255,0.8)",fontSize:11 },
  hR:{ display:"flex",alignItems:"center",gap:8 },
  lbtn:{ padding:"4px 8px",borderRadius:6,border:"2px solid rgba(255,255,255,0.4)",background:"transparent",color:"#fff",cursor:"pointer",fontSize:11,fontWeight:700 },
  lbtnA:{ background:G.accent,color:G.brown,border:`2px solid ${G.accent}` },

  main:{ padding:"14px 12px 0" },
  tab:{ paddingBottom:20 },
  tabH:{ fontSize:21,fontWeight:800,color:G.main,marginBottom:14,marginTop:0 },
  secH:{ fontSize:15,fontWeight:700,color:G.brown,margin:"14px 0 8px" },
  card:{ background:"#fff",borderRadius:16,padding:16,marginBottom:14,boxShadow:"0 2px 12px rgba(0,0,0,0.07)" },

  // Banner / weather
  banner:{ background:`linear-gradient(135deg,${G.dark},${G.light})`,borderRadius:16,padding:"18px 16px",marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center" },
  wxCard:{ background:"linear-gradient(135deg,#1a6b8a,#2196f3)",borderRadius:16,padding:16,marginBottom:14,color:"#fff" },
  wxSpeak:{ marginTop:10,background:"rgba(255,255,255,0.2)",border:"none",borderRadius:8,padding:"6px 14px",color:"#fff",cursor:"pointer",fontSize:13 },

  // Quick grid
  qGrid:{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:8 },
  qCard:{ borderRadius:14,padding:"14px 8px",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:6,boxShadow:"0 3px 10px rgba(0,0,0,0.13)" },

  // Tips
  tipRow:{ background:"#fff",borderRadius:12,padding:"10px 12px",marginBottom:7,display:"flex",alignItems:"center",gap:10,boxShadow:"0 2px 8px rgba(0,0,0,0.06)" },
  tipNum:{ background:G.main,color:"#fff",width:24,height:24,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,flexShrink:0 },
  tipSpk:{ background:"none",border:"none",cursor:"pointer",fontSize:18 },

  // Soil
  soilGrid:{ display:"flex",flexWrap:"wrap",gap:8,marginBottom:12 },
  soilBtn:{ padding:"8px 12px",borderRadius:20,border:`2px solid ${G.light}`,background:"transparent",color:G.main,cursor:"pointer",fontWeight:600,fontSize:13 },
  soilBtnA:{ background:G.main,color:"#fff",border:`2px solid ${G.main}` },

  // Buttons
  primBtn:{ width:"100%",padding:13,background:`linear-gradient(135deg,${G.dark},${G.light})`,color:"#fff",border:"none",borderRadius:12,fontSize:15,fontWeight:800,cursor:"pointer",marginBottom:10 },
  voiceBtn:{ width:"100%",padding:11,background:"linear-gradient(135deg,#e67e22,#f39c12)",color:"#fff",border:"none",borderRadius:12,fontSize:14,fontWeight:700,cursor:"pointer",marginTop:8 },

  // Results
  resCard:{ background:"#fff",borderRadius:16,padding:16,boxShadow:"0 4px 16px rgba(0,0,0,0.1)",marginTop:10 },
  resHead:{ fontSize:15,fontWeight:800,color:G.main,marginBottom:10 },
  cropRow:{ display:"flex",alignItems:"center",gap:10,padding:"9px 12px",background:"#f8fff8",borderRadius:10,marginBottom:6 },
  bestBadge:{ background:G.accent,color:G.brown,padding:"3px 8px",borderRadius:12,fontSize:11,fontWeight:700 },
  iGrid:{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,margin:"10px 0" },
  iBox:{ background:G.bg,borderRadius:10,padding:10 },
  iLbl:{ fontSize:11,color:"#888",marginBottom:3 },
  iVal:{ fontWeight:800,color:G.main,fontSize:14 },
  fertiBox:{ background:"#fff8e1",borderRadius:10,padding:12,fontSize:13,color:"#555" },

  // Upload
  uploadBox:{ background:"#fff",borderRadius:16,padding:20,textAlign:"center",marginBottom:12,boxShadow:"0 2px 12px rgba(0,0,0,0.07)" },
  uploadLbl:{ display:"inline-block",padding:"11px 22px",background:G.light,color:"#fff",borderRadius:12,cursor:"pointer",fontWeight:700,fontSize:14,marginTop:12 },

  // Market / Equipment
  mCard:{ background:"#fff",borderRadius:14,padding:14,marginBottom:10,display:"flex",alignItems:"center",gap:12,boxShadow:"0 2px 8px rgba(0,0,0,0.06)" },
  contactBtn:{ marginTop:6,padding:"6px 11px",background:"#25d366",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:700 },
  rentBtn:{ display:"block",padding:"7px 12px",background:`linear-gradient(135deg,${G.main},${G.light})`,color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:700,marginTop:4 },

  // Community
  postTA:{ width:"100%",padding:"10px 12px",borderRadius:10,border:"2px solid #ddd",fontSize:14,resize:"none",boxSizing:"border-box",outline:"none",fontFamily:"inherit" },
  postCard:{ background:"#fff",borderRadius:14,padding:14,marginBottom:10,boxShadow:"0 2px 8px rgba(0,0,0,0.06)" },
  postAct:{ padding:"6px 11px",background:G.bg,border:"none",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:600 },

  // Profile
  profBanner:{ background:`linear-gradient(135deg,${G.dark},${G.light})`,borderRadius:20,padding:"24px 16px",textAlign:"center",marginBottom:14 },
  statRow:{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:14 },
  statBox:{ background:"#fff",borderRadius:12,padding:"10px 6px",textAlign:"center",boxShadow:"0 2px 8px rgba(0,0,0,0.07)" },
  menuCard:{ background:"#fff",borderRadius:16,overflow:"hidden",boxShadow:"0 2px 8px rgba(0,0,0,0.07)" },
  menuItem:{ padding:"15px 16px",borderBottom:"1px solid #f0f0f0",display:"flex",justifyContent:"space-between",cursor:"pointer",fontWeight:600,fontSize:15,color:"#333" },
  // ▼ RED logout row — clearly visible and clickable ▼
  logoutRow:{ padding:"16px 16px",background:`linear-gradient(135deg,${G.danger},#c0392b)`,display:"flex",justifyContent:"space-between",cursor:"pointer",fontWeight:800,fontSize:16,color:"#fff",alignItems:"center" },

  // Logout confirm
  overlay:{ position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20 },
  confirmBox:{ background:"#fff",borderRadius:24,padding:"30px 24px",textAlign:"center",width:"100%",maxWidth:320,boxShadow:"0 20px 60px rgba(0,0,0,0.3)" },
  confirmTitle:{ fontSize:22,fontWeight:900,color:G.dark,marginBottom:8 },
  confirmMsg:{ color:"#666",fontSize:15,marginBottom:24,lineHeight:1.4 },
  confirmBtns:{ display:"flex",gap:12 },
  cancelBtn:{ flex:1,padding:13,border:"2px solid #ddd",borderRadius:12,background:"#fff",cursor:"pointer",fontWeight:700,fontSize:15,color:"#555" },
  confirmLogoutBtn:{ flex:1,padding:13,background:`linear-gradient(135deg,${G.danger},#c0392b)`,color:"#fff",border:"none",borderRadius:12,cursor:"pointer",fontWeight:800,fontSize:15 },

  // Chat
  chatModal:{ width:"100%",maxWidth:480,background:"#fff",borderRadius:"20px 20px 0 0",height:"76vh",display:"flex",flexDirection:"column",position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)" },
  chatHead:{ padding:"13px 16px",background:`linear-gradient(135deg,${G.dark},${G.light})`,borderRadius:"20px 20px 0 0",display:"flex",justifyContent:"space-between",alignItems:"center",color:"#fff",fontSize:16,fontWeight:700 },
  xBtn:{ background:"rgba(255,255,255,0.2)",border:"none",color:"#fff",width:30,height:30,borderRadius:"50%",cursor:"pointer",fontSize:16 },
  chatBody:{ flex:1,overflowY:"auto",padding:14,display:"flex",flexDirection:"column",gap:10 },
  bubble:{ maxWidth:"80%",padding:"10px 13px",borderRadius:14 },
  bubbleU:{ background:`linear-gradient(135deg,${G.dark},${G.light})`,color:"#fff",alignSelf:"flex-end",borderBottomRightRadius:4 },
  bubbleA:{ background:"#f0f0f0",color:"#333",alignSelf:"flex-start",borderBottomLeftRadius:4 },
  bubbleTxt:{ fontSize:14,lineHeight:1.5 },
  bubbleTime:{ fontSize:10,opacity:0.6,marginTop:3 },
  speakMini:{ background:"none",border:"none",cursor:"pointer",fontSize:16,marginTop:3 },
  chatFoot:{ padding:12,borderTop:"1px solid #eee",display:"flex",gap:8,alignItems:"center" },
  micCircle:{ width:42,height:42,borderRadius:"50%",border:"none",background:G.bg,fontSize:20,cursor:"pointer",flexShrink:0 },
  micCircleActive:{ background:"#fee" },
  chatIn:{ flex:1,padding:"10px 13px",borderRadius:20,border:"2px solid #ddd",fontSize:14,outline:"none",fontFamily:"inherit" },
  sendBtn:{ padding:"10px 14px",background:`linear-gradient(135deg,${G.dark},${G.light})`,color:"#fff",border:"none",borderRadius:20,cursor:"pointer",fontWeight:700,fontSize:14,whiteSpace:"nowrap" },

  // FAB
  fab:{ position:"fixed",bottom:76,right:14,zIndex:150,background:`linear-gradient(135deg,${G.dark},${G.light})`,border:"none",borderRadius:50,padding:"12px 15px",display:"flex",flexDirection:"column",alignItems:"center",cursor:"pointer",boxShadow:"0 4px 20px rgba(0,0,0,0.3)",color:"#fff",gap:3 },
  fabListen:{ background:"linear-gradient(135deg,#c0392b,#e74c3c)" },
  fabSpeak:{ background:"linear-gradient(135deg,#e67e22,#f39c12)" },
  fabLbl:{ fontSize:9,fontWeight:700,whiteSpace:"nowrap" },

  // Nav
  nav:{ position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:"#fff",borderTop:"2px solid #eee",display:"flex",justifyContent:"space-around",zIndex:100,boxShadow:"0 -4px 16px rgba(0,0,0,0.1)" },
  navItem:{ flex:1,padding:"7px 2px",border:"none",background:"transparent",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:1,color:"#aaa" },
  navActive:{ color:G.main },
  navLbl:{ fontSize:9,fontWeight:700 },
};
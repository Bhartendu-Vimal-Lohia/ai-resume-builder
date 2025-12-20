import React, { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Sparkles, Download, Mail, Phone, Camera, 
  Sun, Moon, ChevronRight, ChevronLeft, Wifi, WifiOff, Wand2
} from 'lucide-react';

// --- YOUR KEY (Restored for AI Power) ---
const API_KEY = "AIzaSyDWI3JEbbzdSyTMRwYRXdMkglNNHNPWNjk"; 

export default function App() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [image, setImage] = useState(null);
  const [template, setTemplate] = useState('classic');
  const [darkMode, setDarkMode] = useState(true);
  const [score, setScore] = useState(0);

  const [data, setData] = useState({
    name: "", branch: "", email: "", phone: "", location: "",
    skills: "", softSkills: "", experience: "", education: "Bachelor of Technology", 
    college: "", year: "", github: ""
  });

  const resumeRef = useRef();

  useEffect(() => {
    let s = 0;
    if (data.name) s += 10;
    if (data.email && data.phone) s += 20;
    if (data.skills.length > 5) s += 20;
    if (data.experience.length > 20) s += 25;
    if (data.softSkills.length > 5) s += 10;
    if (image) s += 5;
    if (data.github) s += 10;
    setScore(s);
  }, [data, image]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // --- 1. OFFLINE BACKUP (In case API fails) ---
  const runOfflineLogic = () => {
      let s = data.skills.toLowerCase();
      let enhancedTech = data.skills;
      let exp = "";

      // 1. Expand Tech Skills (Offline Dictionary)
      // --- COMPUTERS & IT ---
if (s.includes("java")) enhancedTech += ", Spring Boot, Hibernate, REST APIs, Microservices, Maven, JUnit";
if (s.includes("python")) enhancedTech += ", Pandas, NumPy, Scikit-learn, Django, FastAPI, Automation, Web Scraping";
if (s.includes("react") || s.includes("web")) enhancedTech += ", HTML5, CSS3, JavaScript (ES6+), Node.js, Express, MongoDB, Tailwind CSS";
if (s.includes("sql") || s.includes("database")) enhancedTech += ", PostgreSQL, MySQL, NoSQL, Redis, Database Design, Query Optimization";
if (s.includes("cloud") || s.includes("aws")) enhancedTech += ", Docker, Kubernetes, CI/CD, EC2, S3, Serverless Architecture";
if (s.includes("cyber") || s.includes("security")) enhancedTech += ", Ethical Hacking, Wireshark, Nmap, Penetration Testing, Cryptography, Metasploit";

// --- ARTIFICIAL INTELLIGENCE & DATA ---
if (s.includes("deep learning")) enhancedTech += ", Neural Networks, CNN, RNN, TensorFlow, PyTorch, Keras, Computer Vision";
if (s.includes("machine learning") || s.includes("ml")) enhancedTech += ", Supervised Learning, Regression, Clustering, XGBoost, Feature Engineering";
if (s.includes("data science")) enhancedTech += ", EDA, Statistical Modeling, Tableau, Power BI, ETL, R Programming";

// --- ELECTRONICS & IOT ---
if (s.includes("iot") || s.includes("embedded")) enhancedTech += ", MQTT, ESP32, RTOS, I2C/SPI Protocols, Firmware Development, Device Drivers";
if (s.includes("raspberry") || s.includes("pi")) enhancedTech += ", Linux Shell, GPIO Interfacing, Python (RPi.GPIO), Microcontrollers, Circuit Design";
if (s.includes("arduino")) enhancedTech += ", C++, Sensor Interfacing, Prototyping, PCB Design, Hardware Debugging";
if (s.includes("vlsi")) enhancedTech += ", Verilog, VHDL, FPGA, CMOS Design, Digital System Design, Cadence Virtuoso";

// --- ELECTRICAL ENGINEERING ---
if (s.includes("electrical") || s.includes("power")) enhancedTech += ", MATLAB, Simulink, Power Systems, Control Systems, PLC Programming, SCADA, Smart Grids";
if (s.includes("circuit")) enhancedTech += ", Altium Designer, KiCad, Proteus, Circuit Simulation, Troubleshooting, Multisim";

// --- MECHANICAL & ROBOTICS ---
if (s.includes("mechanical") || s.includes("cad")) enhancedTech += ", SolidWorks, CATIA, ANSYS, Thermodynamics, Fluid Mechanics, FEA, Manufacturing Processes";
if (s.includes("robotics")) enhancedTech += ", ROS (Robot Operating System), Kinematics, OpenCV, Path Planning, Servo Control, SLAM";

// --- CIVIL ENGINEERING ---
if (s.includes("civil")) enhancedTech += ", AutoCAD, Revit, STAAD.Pro, Structural Analysis, Geotechnical Engineering, Site Surveying, Project Estimation";
if (s.includes("construction")) enhancedTech += ", BIM, Concrete Technology, Steel Structures, Total Station, Highway Engineering";

// --- CHEMICAL & BIOTECH ---
if (s.includes("chemical")) enhancedTech += ", ASPEN Plus, HYSYS, Mass & Heat Transfer, Unit Operations, Process Control";
if (s.includes("bio") || s.includes("pharma")) enhancedTech += ", Bioinformatics, CRISPR, Molecular Biology, GLP/GMP Compliance, Lab Techniques";

// --- MANAGEMENT & FINANCE ---
if (s.includes("management") || s.includes("agile")) enhancedTech += ", Scrum, Jira, Risk Assessment, Project Planning, Stakeholder Management";
if (s.includes("finance") || s.includes("accounting")) enhancedTech += ", Tally Prime, Advanced Excel (VBA), Financial Modeling, GST Compliance, Equity Research";
if (s.includes("design") || s.includes("creative")) enhancedTech += ", Figma, UI/UX, Adobe Photoshop, Illustrator, Prototyping";
      // 2. Generate Experience
      if (s.includes("civil")) {
        exp = "• Designed structural layouts using AutoCAD and Revit.\n• Conducted site surveys and managed material estimation.";
      } else if (s.includes("java") || s.includes("web")) {
        exp = "• Developed a scalable web application using modern JavaScript frameworks.\n• Implemented secure authentication and optimized database performance.";
      } else {
        exp = "• Completed a comprehensive project solving real-world challenges.\n• Collaborated with a team to design, test, and validate the solution.";
      }

      // 3. Polish Soft Skills (Offline Dictionary)
      let enhancedSoft = data.softSkills || "";
      const softMap = {
          "talk": "Effective Communication",
          "lead": "Strategic Leadership",
          "photo": "Digital Photography & Editing",
          "music": "Music Composition",
          "draw": "Visual Arts & Sketching",
          "team": "Cross-Functional Teamwork"
      };
      
      Object.keys(softMap).forEach(key => {
          if (enhancedSoft.toLowerCase().includes(key)) {
             enhancedSoft = enhancedSoft.replace(key, softMap[key]); // Basic replace
          }
      });
      if (enhancedSoft.length < 5) enhancedSoft = "Leadership, Teamwork, Adaptability";

      setData(prev => ({ 
        ...prev, 
        skills: enhancedTech, 
        experience: exp, 
        softSkills: enhancedSoft 
      }));
      setIsOffline(true);
  };

  // --- 2. ONLINE AI (SUPER ENHANCE) ---
  const enhanceAll = async () => {
    if (!data.skills) return alert("Please enter at least one skill first!");
    
    setLoading(true);
    setIsOffline(false);

    try {
      // PROMPT: Explicitly ask to REWRITE EVERYTHING
      const prompt = `
        I am a student. 
        My Raw Tech Skills: "${data.skills}".
        My Raw Soft Skills/Hobbies: "${data.softSkills}".

        Please REWRITE and ENHANCE all 3 sections:
        1. **TechSkills**: Expand the raw skills into a professional list (e.g. "java" -> "Core Java, Spring Boot, Microservices").
        2. **Experience**: Write a 40-word professional project bullet point based on these skills.
        3. **SoftSkills**: Polish the hobbies/soft skills into professional terms (e.g. "photo" -> "Digital Photography", "talking" -> "Effective Communication").

        Format EXACTLY like this:
        TechSkills: [Enhanced list]
        Experience: [Text]
        SoftSkills: [Enhanced list]
      `;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        }
      );

      const json = await response.json();

      if (json.candidates && json.candidates.length > 0) {
        const text = json.candidates[0].content.parts[0].text;
        
        // Parse the 3 parts
        const techMatch = text.match(/TechSkills:\s*([\s\S]*?)(?=Experience:|$)/i);
        const expMatch = text.match(/Experience:\s*([\s\S]*?)(?=SoftSkills:|$)/i);
        const softMatch = text.match(/SoftSkills:\s*([\s\S]*?)$/i);
        
        setData(prev => ({ 
          ...prev, 
          skills: techMatch ? techMatch[1].trim() : prev.skills, // Updates Tech Skills
          experience: expMatch ? expMatch[1].trim() : text,      // Updates Experience
          softSkills: softMatch ? softMatch[1].trim() : prev.softSkills // Updates Soft Skills
        }));
      } else {
        throw new Error("Empty AI Response");
      }

    } catch (e) {
      console.warn("API Error, switching to offline:", e);
      runOfflineLogic(); 
    }
    
    setLoading(false);
  };

  const downloadPDF = async () => {
    const element = resumeRef.current;
    const canvas = await html2canvas(element, { scale: 3, useCORS: true });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
    pdf.save(`${data.name || 'Resume'}_Final.pdf`);
  };

  return (
    <div style={{ ...s.container, background: darkMode ? '#0f172a' : '#f1f5f9' }}>
      <div style={{ ...s.editor, background: darkMode ? '#1e293b' : '#ffffff', color: darkMode ? 'white' : 'black' }}>
        <div style={s.editorHeader}>
            <h2 style={s.editorTitle}><Sparkles color="#fbbf24" /> Resume Builder</h2>
            <button onClick={() => setDarkMode(!darkMode)} style={s.themeBtn}>
                {darkMode ? <Sun size={18}/> : <Moon size={18}/>}
            </button>
        </div>

        <div style={s.scoreBox}>
            <div style={{display:'flex', justifyContent:'space-between', fontSize:'11px'}}>
                <span>Resume Strength</span>
                <span>{score}%</span>
            </div>
            <div style={s.progressBar}><div style={{...s.progressFill, width: `${score}%`}}></div></div>
        </div>

        <div style={s.scrollArea}>
          {step === 1 && (
            <div className="fade-in">
              <p style={s.stepTag}>STEP 1: CONTACT INFO</p>
              <input name="name" style={s.input} placeholder="Full Name" value={data.name} onChange={handleInputChange} />
              <input name="email" style={s.input} placeholder="Email" value={data.email} onChange={handleInputChange} />
              <input name="phone" style={s.input} placeholder="Phone" value={data.phone} onChange={handleInputChange} />
              <input name="location" style={s.input} placeholder="Location" value={data.location} onChange={handleInputChange} />
              <input name="github" style={s.input} placeholder="Portfolio Link" value={data.github} onChange={handleInputChange} />
              <label style={s.uploadLabel}><Camera size={14} /> Add Photo <input type="file" hidden onChange={handlePhoto} /></label>
            </div>
          )}

          {step === 2 && (
            <div className="fade-in">
              <p style={s.stepTag}>STEP 2: SKILLS & INTERESTS</p>
              
              <label style={s.label}>Technical Skills (e.g. Java, Civil)</label>
              <textarea name="skills" style={{...s.input, height:'70px'}} placeholder="e.g. Java, Python..." value={data.skills} onChange={handleInputChange} />
              
              <label style={s.label}>Soft Skills / Hobbies (e.g. talk, photo)</label>
              <textarea name="softSkills" style={{...s.input, height:'50px'}} placeholder="e.g. leadership, photography..." value={data.softSkills} onChange={handleInputChange} />

              <button onClick={enhanceAll} style={s.aiBtn}>
                <Wand2 size={16} /> 
                {loading ? "Enhancing All..." : "Enhance Everything with AI ✨"}
              </button>

              {/* Status Indicator */}
              {!isOffline && data.experience && (
                  <div style={{marginTop:'5px', fontSize:'10px', color:'#4ade80', display:'flex', alignItems:'center', gap:'5px'}}>
                      <Wifi size={12}/> AI Enhanced Everything!
                  </div>
              )}
               
            </div>
          )}

          {step === 3 && (
            <div className="fade-in">
              <p style={s.stepTag}>STEP 3: EXPORT</p>
              <div style={s.templateSelector}>
                <button onClick={() => setTemplate('classic')} style={{...s.tempBtn, background: template === 'classic' ? '#3b82f6' : '#475569'}}>Classic</button>
                <button onClick={() => setTemplate('modern')} style={{...s.tempBtn, background: template === 'modern' ? '#3b82f6' : '#475569'}}>Modern</button>
              </div>
              <button onClick={downloadPDF} style={s.dlBtn}><Download size={18} /> Download PDF</button>
            </div>
          )}
        </div>
        
        <div style={s.navRow}>
            <button disabled={step === 1} onClick={() => setStep(step-1)} style={s.navBtn}><ChevronLeft size={16}/> Back</button>
            <span style={{fontSize:'12px'}}>Page {step}/3</span>
            <button disabled={step === 3} onClick={() => setStep(step+1)} style={s.navBtn}>Next <ChevronRight size={16}/></button>
        </div>
      </div>

      <div style={s.preview}>
        <div ref={resumeRef} style={{...s.paper, flexDirection: template === 'modern' ? 'column' : 'row'}}>
          {template === 'classic' && (
            <div style={s.sidebar}>
              <div style={s.photoCircle}>{image && <img src={image} style={s.img} alt="p" />}</div>
              <h3 style={s.sideName}>{data.name || "YOUR NAME"}</h3>
              <div style={s.sideSection}>
                <h4 style={s.sideHead}>CONTACT</h4>
                <p style={s.sideText}><Mail size={10}/> {data.email}</p>
                <p style={s.sideText}><Phone size={10}/> {data.phone}</p>
              </div>
              {data.github && (
                <div style={s.qrBox}>
                    <div style={s.qrBg}><QRCodeSVG value={data.github} size={60} /></div>
                    <p style={{fontSize:'8px', marginTop:'5px', color:'white'}}>PORTFOLIO</p>
                </div>
              )}
            </div>
          )}
          <div style={{...s.main, width: template === 'modern' ? '100%' : '70%'}}>
            <h1 style={s.mainName}>{data.name || "FULL NAME"}</h1>
            <div style={s.header}>TECHNICAL SKILLS</div>
            <p style={s.body}>{data.skills}</p>
            <div style={s.header}>PROJECTS / EXPERIENCE</div>
            <p style={s.body}>{data.experience}</p>
            <div style={s.header}>SOFT SKILLS & INTERESTS</div>
            <p style={s.body}>{data.softSkills}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  container: { display: 'flex', height: '100vh', overflow: 'hidden' },
  editor: { width: '380px', padding: '25px', display: 'flex', flexDirection: 'column', boxShadow: '5px 0 15px rgba(0,0,0,0.2)' },
  editorHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  editorTitle: { display: 'flex', alignItems: 'center', gap: '8px', color: '#60a5fa', fontSize: '18px' },
  themeBtn: { background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer' },
  scoreBox: { marginBottom: '20px' },
  progressBar: { height: '6px', background: '#334155', borderRadius: '10px', marginTop: '5px', overflow: 'hidden' },
  progressFill: { height: '100%', background: '#10b981', transition: 'width 0.4s' },
  scrollArea: { flex: 1, overflowY: 'auto' },
  stepTag: { fontSize: '10px', color: '#94a3b8', letterSpacing: '1px', marginBottom: '15px' },
  label: { fontSize: '11px', color: '#cbd5e1', marginBottom: '5px', display:'block' },
  input: { width: '100%', padding: '10px', background: '#334155', border: 'none', borderRadius: '4px', color: 'white', marginBottom: '10px', fontSize: '13px' },
  aiBtn: { width: '100%', padding: '12px', background: '#8b5cf6', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px' },
  dlBtn: { width: '100%', padding: '14px', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '8px' },
  navRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', borderTop: '1px solid #334155', paddingTop: '20px' },
  navBtn: { background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer', display: 'flex', alignItems: 'center' },
  uploadLabel: { cursor: 'pointer', background: '#3b82f6', padding: '10px', borderRadius: '4px', fontSize: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', color: 'white', marginBottom: '10px' },
  preview: { flex: 1, background: '#cbd5e1', padding: '40px', display: 'flex', justifyContent: 'center', overflowY: 'auto' },
  paper: { width: '210mm', height: '297mm', background: 'white', display: 'flex', color: 'black' },
  sidebar: { width: '30%', background: '#1a4371', color: 'white', padding: '30px', textAlign: 'center' },
  photoCircle: { width: '100px', height: '100px', borderRadius: '50%', background: '#3b82f6', margin: '0 auto', border: '3px solid white', overflow: 'hidden', display: 'flex', alignItems:'center', justifyContent:'center' },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  sideName: { fontSize: '14px', marginTop: '15px' },
  sideSection: { marginTop: '30px', textAlign: 'left' },
  sideHead: { borderBottom: '1px solid white', fontSize: '12px', marginBottom: '10px' },
  sideText: { fontSize: '10px', marginBottom: '5px' },
  qrBox: { marginTop: '30px' },
  qrBg: { background: 'white', padding: '5px', display: 'inline-block', borderRadius: '4px' },
  main: { padding: '40px 50px' },
  mainName: { fontSize: '30px', color: '#1a4371', margin: '0 0 10px 0', fontWeight: '800' },
  header: { background: '#f8fafc', color: '#1a4371', padding: '8px 12px', fontSize: '12px', fontWeight: '800', marginBottom: '10px', marginTop: '20px', borderLeft: '4px solid #1a4371' },
  body: { fontSize: '11px', lineHeight: '1.6', whiteSpace: 'pre-wrap' },
  templateSelector: { display: 'flex', gap: '10px', marginBottom: '20px' },
  tempBtn: { flex: 1, padding: '10px', border: 'none', borderRadius: '4px', color: 'white', cursor: 'pointer', fontSize: '11px' }
};
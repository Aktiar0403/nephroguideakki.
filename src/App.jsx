import React, { useState } from "react";
import Select from "react-select";
import Accordion from "./components/Accordion";
import Button from "./components/Button";

export default function App() {
  // -------------- STATE --------------
  const [patientProfile, setPatientProfile] = useState({
    name: "",
    age: "",
    gender: "",
    location: ""
  });

  const [medicalHistory, setMedicalHistory] = useState({
    diabetes: false,
    hypertension: false,
    diabetesDuration: "",
    hypertensionDuration: "",
    nsaidUse: false,
    pastStoneDisease: false,
    familyCKD: false,
    tb: false,
    hiv: false,
    hepatitis: false
  });

  const [symptoms, setSymptoms] = useState({
    edema: false,
    fatigue: false,
    nausea: false,
    vomiting: false,
    breathlessness: false,
    decreasedUrineOutput: false,
    flankPain: false,
    hematuria: false
  });

  const [physicalExam, setPhysicalExam] = useState({
    sbp: "",
    dbp: "",
    weight: "",
    volumeStatus: ""
  });

  const [labs, setLabs] = useState({
    creatinine: "",
    egfr: "",
    potassium: "",
    hemoglobin: "",
    urinalysisProtein: "",
    urinalysisBlood: "",
    acr: "",
    spotProteinCreatinine: "",
    urineProtein24h: ""
  });

  const [imaging, setImaging] = useState({
    ultrasoundFindings: "",
    notes: ""
  });

  const [takingMedicines, setTakingMedicines] = useState(false);
  const [medicinesList, setMedicinesList] = useState([
    { name: "", duration: "" }
  ]);

  const [diagnosis, setDiagnosis] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [medications, setMedications] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [patientSummary, setPatientSummary] = useState("");

  // -------------- MEDICINE OPTIONS --------------
  const medicineOptions = [
    {
      label: "🩺 Hypertension Medicines",
      options: [
        { value: "Enalapril", label: "Enalapril (ACEi)" },
        { value: "Ramipril", label: "Ramipril (ACEi)" },
        { value: "Losartan", label: "Losartan (ARB)" },
        { value: "Amlodipine", label: "Amlodipine (CCB)" },
        { value: "Hydrochlorothiazide", label: "Hydrochlorothiazide (Thiazide)" },
        { value: "Furosemide", label: "Furosemide (Loop Diuretic)" },
        { value: "Spironolactone", label: "Spironolactone (Aldosterone Antagonist)" }
      ],
    },
    {
      label: "🩹 Diabetes Medicines",
      options: [
        { value: "Metformin", label: "Metformin" },
        { value: "Glimepiride", label: "Glimepiride" },
        { value: "Insulin", label: "Insulin" },
        { value: "SGLT2 Inhibitor", label: "SGLT2 Inhibitor" },
        { value: "DPP4 Inhibitor", label: "DPP4 Inhibitor" },
        { value: "GLP1 Agonist", label: "GLP1 Agonist" }
      ],
    },
    {
      label: "💊 Painkillers (NSAIDs etc.)",
      options: [
        { value: "Ibuprofen", label: "Ibuprofen (⚠️ Avoid in CKD)" },
        { value: "Diclofenac", label: "Diclofenac (⚠️ Avoid in CKD)" },
        { value: "Paracetamol", label: "Paracetamol" },
        { value: "Tramadol", label: "Tramadol (Use with caution)" }
      ],
    },
    {
      label: "⚠️ Kidney-impacting Medicines",
      options: [
        { value: "PPI", label: "PPI (Omeprazole, Pantoprazole)" },
        { value: "NSAIDs", label: "NSAIDs" },
        { value: "Aminoglycosides", label: "Aminoglycosides" },
        { value: "Vancomycin", label: "Vancomycin" },
        { value: "Tenofovir", label: "Tenofovir" },
        { value: "Cisplatin", label: "Cisplatin" },
        { value: "Contrast Dye", label: "Contrast Dye" }
      ],
    },
    {
      label: "Other / Supportive",
      options: [
        { value: "Potassium Binder", label: "Potassium Binder" },
        { value: "Calcium Channel Blocker", label: "Calcium Channel Blocker" },
        { value: "Statin", label: "Statin" },
        { value: "Phosphate Binder", label: "Phosphate Binder" },
        { value: "Other", label: "Other" }
      ],
    },
  ];

  // -------------- LOGIC --------------
  function askAkI() {
    setDiagnosis("This is a test result for demonstration!");
    setSuggestions(["Regular monitoring", "Lifestyle modification"]);
    setMedications(["Enalapril", "Metformin"]);
    setWarnings(["Avoid NSAIDs"]);
  }

  function generatePatientSummary() {
    setPatientSummary("🧭 This is a summary of patient data for demo purposes.");
  }

  function copySummary() {
    navigator.clipboard.writeText(patientSummary);
    alert("Patient data copied to clipboard!");
  }

  function openChatGPTWithSummary() {
    if (!patientSummary) {
      alert("Please generate the patient summary first!");
      return;
    }
    const encoded = encodeURIComponent(patientSummary);
    const chatURL = `https://chat.openai.com/?prompt=${encoded}`;
    window.open(chatURL, "_blank");
  }

  // -------------- UI --------------
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6">

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-400 rounded-lg shadow-lg p-4 mb-6 text-center">
          <div className="flex items-center justify-center gap-3">
            <img src="/kidney.png" alt="Kidney Icon" className="h-10 w-10 md:h-12 md:w-12 object-contain" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">NephroCare Pro</h1>
          </div>
          <p className="text-green-100 italic text-sm md:text-base mt-1">A Doctor’s Friend</p>
        </div>

        {/* Accordions */}
        <Accordion title="👤 Patient Profile">
          <div className="grid gap-3 md:grid-cols-2">
            <input type="text" placeholder="Name" value={patientProfile.name} onChange={(e) => setPatientProfile({ ...patientProfile, name: e.target.value })} className="border rounded-md p-2 w-full focus:ring-indigo-500" />
            <input type="number" placeholder="Age" value={patientProfile.age} onChange={(e) => setPatientProfile({ ...patientProfile, age: e.target.value })} className="border rounded-md p-2 w-full focus:ring-indigo-500" />
            <select value={patientProfile.gender} onChange={(e) => setPatientProfile({ ...patientProfile, gender: e.target.value })} className="border rounded-md p-2 w-full focus:ring-indigo-500">
              <option value="">Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
            <select value={patientProfile.location} onChange={(e) => setPatientProfile({ ...patientProfile, location: e.target.value })} className="border rounded-md p-2 w-full focus:ring-indigo-500">
              <option value="">Location</option>
              <option>Rural</option>
              <option>Urban</option>
            </select>
          </div>
        </Accordion>

        <Accordion title="🩺 Medical History">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {["diabetes", "hypertension", "nsaidUse", "pastStoneDisease", "familyCKD", "tb", "hiv", "hepatitis"].map((item) => (
              <label key={item} className="flex items-center space-x-2">
                <input type="checkbox" checked={medicalHistory[item]} onChange={(e) => setMedicalHistory({ ...medicalHistory, [item]: e.target.checked })} className="accent-indigo-600" />
                <span className="text-slate-700">{item.replace(/([A-Z])/g, " $1").toUpperCase()}</span>
              </label>
            ))}
          </div>

          {takingMedicines && (
            <div className="space-y-3 mt-2">
              {medicinesList.map((med, idx) => (
                <div key={idx} className="grid md:grid-cols-2 gap-2">
                  <Select
                    options={medicineOptions}
                    value={med.name ? { value: med.name, label: med.name } : null}
                    onChange={(selected) => {
                      const updated = [...medicinesList];
                      updated[idx].name = selected ? selected.value : "";
                      setMedicinesList(updated);
                    }}
                    isClearable
                    isSearchable
                    className="react-select-container"
                    classNamePrefix="react-select"
                    placeholder="Search & Select Medicine..."
                  />
                  <input type="text" placeholder="Duration (e.g. 6 months)" value={med.duration} onChange={(e) => { const updated = [...medicinesList]; updated[idx].duration = e.target.value; setMedicinesList(updated); }} className="border rounded-md p-2 w-full focus:ring-indigo-500" />
                </div>
              ))}
              <button type="button" onClick={() => setMedicinesList([...medicinesList, { name: "", duration: "" }])} className="mt-2 text-indigo-600 underline">
                + Add Another Medicine
              </button>
            </div>
          )}
        </Accordion>

        <Accordion title="🩹 Symptoms">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {Object.keys(symptoms).map((item) => (
              <label key={item} className="flex items-center space-x-2">
                <input type="checkbox" checked={symptoms[item]} onChange={(e) => setSymptoms({ ...symptoms, [item]: e.target.checked })} className="accent-indigo-600" />
                <span className="text-slate-700">{item.replace(/([A-Z])/g, " $1").toUpperCase()}</span>
              </label>
            ))}
          </div>
        </Accordion>
        <Accordion title="🩺 Physical Exam">
          <div className="grid gap-3 md:grid-cols-2">
            <input
              type="number"
              placeholder="SBP (mmHg)"
              value={physicalExam.sbp}
              onChange={(e) => setPhysicalExam({ ...physicalExam, sbp: e.target.value })}
              className="border rounded-md p-2 w-full focus:ring-indigo-500"
            />
            <input
              type="number"
              placeholder="DBP (mmHg)"
              value={physicalExam.dbp}
              onChange={(e) => setPhysicalExam({ ...physicalExam, dbp: e.target.value })}
              className="border rounded-md p-2 w-full focus:ring-indigo-500"
            />
            <input
              type="number"
              placeholder="Weight (kg)"
              value={physicalExam.weight}
              onChange={(e) => setPhysicalExam({ ...physicalExam, weight: e.target.value })}
              className="border rounded-md p-2 w-full focus:ring-indigo-500"
            />
            <select
              value={physicalExam.volumeStatus}
              onChange={(e) => setPhysicalExam({ ...physicalExam, volumeStatus: e.target.value })}
              className="border rounded-md p-2 w-full focus:ring-indigo-500"
            >
              <option value="">Volume Status</option>
              <option value="Hypovolemic">Hypovolemic</option>
              <option value="Euvolemic">Euvolemic</option>
              <option value="Hypervolemic">Hypervolemic</option>
            </select>
          </div>
        </Accordion>

        <Accordion title="🧪 Lab Results">
          <div className="grid gap-3 md:grid-cols-2">
            <input
              type="text"
              placeholder="Creatinine"
              value={labs.creatinine}
              onChange={(e) => setLabs({ ...labs, creatinine: e.target.value })}
              className="border rounded-md p-2 w-full focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="eGFR"
              value={labs.egfr}
              onChange={(e) => setLabs({ ...labs, egfr: e.target.value })}
              className="border rounded-md p-2 w-full focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="Potassium"
              value={labs.potassium}
              onChange={(e) => setLabs({ ...labs, potassium: e.target.value })}
              className="border rounded-md p-2 w-full focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="Hemoglobin"
              value={labs.hemoglobin}
              onChange={(e) => setLabs({ ...labs, hemoglobin: e.target.value })}
              className="border rounded-md p-2 w-full focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="Urinalysis Protein"
              value={labs.urinalysisProtein}
              onChange={(e) => setLabs({ ...labs, urinalysisProtein: e.target.value })}
              className="border rounded-md p-2 w-full focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="Urinalysis Blood"
              value={labs.urinalysisBlood}
              onChange={(e) => setLabs({ ...labs, urinalysisBlood: e.target.value })}
              className="border rounded-md p-2 w-full focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="ACR"
              value={labs.acr}
              onChange={(e) => setLabs({ ...labs, acr: e.target.value })}
              className="border rounded-md p-2 w-full focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="Spot Protein/Creatinine"
              value={labs.spotProteinCreatinine}
              onChange={(e) => setLabs({ ...labs, spotProteinCreatinine: e.target.value })}
              className="border rounded-md p-2 w-full focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="24h Urine Protein"
              value={labs.urineProtein24h}
              onChange={(e) => setLabs({ ...labs, urineProtein24h: e.target.value })}
              className="border rounded-md p-2 w-full focus:ring-indigo-500"
            />
          </div>
        </Accordion>

        <Accordion title="🖼️ Imaging - Kidney Ultrasound">
          <div className="space-y-3">
            <select
              value={imaging.ultrasoundFindings}
              onChange={(e) => setImaging({ ...imaging, ultrasoundFindings: e.target.value })}
              className="border rounded-md p-2 w-full focus:ring-indigo-500"
            >
              <option value="">Select Finding</option>
              <option>Normal kidneys</option>
              <option>Increased echogenicity</option>
              <option>Small shrunken kidneys</option>
              <option>Asymmetry (one small)</option>
              <option>Hydronephrosis</option>
              <option>Cystic disease</option>
              <option>Obstructive calculi</option>
              <option>Other (describe below)</option>
            </select>
            <textarea
              placeholder="Additional ultrasound notes (optional)"
              value={imaging.notes}
              onChange={(e) => setImaging({ ...imaging, notes: e.target.value })}
              className="border rounded-md p-2 w-full focus:ring-indigo-500"
              rows={3}
            />
          </div>
        </Accordion>

        <div className="flex flex-wrap gap-3 justify-center my-6">
          <Button onClick={askAkI}>Ask Aktiar</Button>
          <Button onClick={generatePatientSummary}>Show Patient Data Summary</Button>
        </div>

        {diagnosis && (
          <Accordion title="🩺 Diagnosis Result">
            <p className="mb-2">{diagnosis}</p>
            {suggestions.length > 0 && (
              <>
                <h3 className="font-semibold mt-2">Recommendations:</h3>
                <ul className="list-disc pl-5">
                  {suggestions.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </>
            )}
            {medications.length > 0 && (
              <>
                <h3 className="font-semibold mt-2">Medications:</h3>
                <ul className="list-disc pl-5">
                  {medications.map((m, i) => <li key={i}>{m}</li>)}
                </ul>
              </>
            )}
            {warnings.length > 0 && (
              <>
                <h3 className="font-semibold mt-2 text-red-600">Warnings:</h3>
                <ul className="list-disc pl-5 text-red-600">
                  {warnings.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </>
            )}
          </Accordion>
        )}

        {patientSummary && (
          <Accordion title="📋 Patient Data Summary (for ChatGPT)">
            <textarea
              value={patientSummary}
              readOnly
              rows={10}
              className="border rounded-md p-2 w-full mb-3"
            />
            <div className="flex gap-3 justify-center">
              <Button onClick={copySummary}>Copy to Clipboard</Button>
              <Button onClick={openChatGPTWithSummary}>Search Online</Button>
            </div>
          </Accordion>
        )}
      </div>
    </div>
  );
}

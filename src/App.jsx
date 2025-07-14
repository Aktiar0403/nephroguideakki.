import React, { useState } from "react";
import Select from "react-select";
import Accordion from "./components/Accordion";
import Button from "./components/Button";

export default function App() {
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
  const [medicinesList, setMedicinesList] = useState([{ name: "", duration: "" }]);

  const [diagnosis, setDiagnosis] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [medications, setMedications] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [patientSummary, setPatientSummary] = useState("");

  const medicineOptions = [
    {
      label: "🩺 Hypertension Medicines",
      options: [
        { value: "Enalapril", label: "Enalapril (ACEi)" },
        { value: "Ramipril", label: "Ramipril (ACEi)" },
        { value: "Lisinopril", label: "Lisinopril (ACEi)" },
        { value: "Losartan", label: "Losartan (ARB)" },
        { value: "Valsartan", label: "Valsartan (ARB)" },
        { value: "Amlodipine", label: "Amlodipine (CCB)" },
        { value: "Nifedipine", label: "Nifedipine (CCB)" },
        { value: "Hydrochlorothiazide", label: "Hydrochlorothiazide (Thiazide)" },
        { value: "Chlorthalidone", label: "Chlorthalidone (Thiazide)" },
        { value: "Furosemide", label: "Furosemide (Loop Diuretic)" },
        { value: "Spironolactone", label: "Spironolactone (Aldosterone Antagonist)" }
      ]
    },
    {
      label: "🩹 Diabetes Medicines",
      options: [
        { value: "Metformin", label: "Metformin" },
        { value: "Glimepiride", label: "Glimepiride" },
        { value: "Insulin", label: "Insulin" },
        { value: "SGLT2 Inhibitor", label: "SGLT2 Inhibitor (e.g. Empagliflozin)" },
        { value: "DPP4 Inhibitor", label: "DPP4 Inhibitor (e.g. Sitagliptin)" },
        { value: "GLP1 Agonist", label: "GLP1 Agonist (e.g. Liraglutide)" }
      ]
    },
    {
      label: "💊 Painkillers (NSAIDs etc.)",
      options: [
        { value: "Ibuprofen", label: "Ibuprofen (⚠️ Avoid in CKD)" },
        { value: "Diclofenac", label: "Diclofenac (⚠️ Avoid in CKD)" },
        { value: "Indomethacin", label: "Indomethacin (⚠️ Avoid in CKD)" },
        { value: "Paracetamol", label: "Paracetamol (Safe)" },
        { value: "Tramadol", label: "Tramadol (Use with caution)" }
      ]
    },
    {
      label: "⚠️ Kidney-impacting Medicines",
      options: [
        { value: "PPI", label: "PPI (Omeprazole, Pantoprazole)" },
        { value: "NSAIDs", label: "NSAIDs (e.g. Ibuprofen, Diclofenac)" },
        { value: "Aminoglycosides", label: "Aminoglycosides (Gentamicin, Amikacin)" },
        { value: "Vancomycin", label: "Vancomycin" },
        { value: "Tenofovir", label: "Tenofovir" },
        { value: "Cisplatin", label: "Cisplatin (Nephrotoxic Chemo)" },
        { value: "Contrast Dye", label: "Contrast Dye (IV Contrast)" }
      ]
    },
    {
      label: "Other / Supportive",
      options: [
        { value: "Potassium Binder", label: "Potassium Binder" },
        { value: "Calcium Channel Blocker", label: "Calcium Channel Blocker" },
        { value: "Statin", label: "Statin" },
        { value: "Phosphate Binder", label: "Phosphate Binder" },
        { value: "Other", label: "Other" }
      ]
    }
  ];

  function askAkI() {
    let result = "";
    let suggest = [];
    let meds = [];
    let warns = [];

    const eGFR = parseFloat(labs.egfr);
    const proteinuria = parseFloat(labs.urineProtein24h);
    const potassium = parseFloat(labs.potassium);
    const hemoglobin = parseFloat(labs.hemoglobin);
    const acr = parseFloat(labs.acr);

    if (!isNaN(eGFR)) {
      if (eGFR >= 90) result = "Normal Kidney Function";
      else if (eGFR >= 60) result = "Mildly Reduced Function (Stage 2)";
      else if (eGFR >= 45) result = "CKD Stage 3a";
      else if (eGFR >= 30) result = "CKD Stage 3b";
      else if (eGFR >= 15) result = "CKD Stage 4";
      else result = "CKD Stage 5 (ESRD)";

      if (eGFR < 60) {
        suggest.push(
          "Regular eGFR monitoring every 3–6 months",
          "Avoid nephrotoxins",
          "Assess blood pressure control"
        );
      }
    }

    if (proteinuria > 3500 && symptoms.edema) {
      result = "Possible Nephrotic Syndrome";
      suggest.push(
        "Check serum albumin",
        "Consider renal biopsy if unexplained",
        "Manage edema with diuretics"
      );
      meds.push("Loop diuretic for edema");
    }

    if (medicalHistory.diabetes && eGFR < 60 && (acr > 30 || proteinuria > 150)) {
      result = "Likely Diabetic Kidney Disease";
      suggest.push(
        "Tight glucose control",
        "Annual ACR monitoring",
        "Eye screening for retinopathy"
      );
      if (eGFR >= 30 && potassium <= 5.5) {
        meds.push("ACEi/ARB if potassium normal");
      } else if (potassium > 5.5) {
        warns.push("Avoid ACEi/ARB due to hyperkalemia risk");
      }
    }

    if (medicalHistory.hypertension && eGFR < 60 && proteinuria < 1000) {
      result = "Possible Hypertensive Nephrosclerosis";
      suggest.push(
        "Optimize BP to <130/80",
        "Regular urinalysis monitoring"
      );
      meds.push("ACEi/ARB if potassium normal");
    }

    if (potassium > 5.5) {
      warns.push("Hyperkalemia detected: recommend dietary K+ restriction and review medications");
      meds.push("Consider potassium binders if persistent");
    }

    if (hemoglobin < 10 && eGFR < 45) {
      suggest.push(
        "Check iron studies",
        "Consider erythropoiesis-stimulating agents if iron replete"
      );
    }

    meds.push("Avoid NSAIDs");

    setDiagnosis(result);
    setSuggestions(suggest);
    setMedications(meds);
    setWarnings(warns);
  }

  function generatePatientSummary() {
    const historyItems = Object.entries(medicalHistory)
      .filter(([k, v]) => v === true || (typeof v === "string" && v.trim() !== ""))
      .map(([k, v]) => typeof v === "boolean" ? k : `${k}: ${v}`)
      .join("\n");

    const symptomItems = Object.entries(symptoms)
      .filter(([k, v]) => v === true)
      .map(([k]) => k)
      .join("\n");

    const labItems = Object.entries(labs)
      .filter(([k, v]) => v.trim() !== "")
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");

    const medicinesItems = takingMedicines
      ? medicinesList.filter(m => m.name || m.duration).map(m => `- ${m.name} (${m.duration})`).join("\n")
      : "No current medicines";

    setPatientSummary(`Medical History:\n${historyItems}\n\nSymptoms:\n${symptomItems}\n\nLabs:\n${labItems}\n\nMedicines:\n${medicinesItems}`);
  }

  function copySummary() {
    navigator.clipboard.writeText(patientSummary);
    alert("Patient data copied!");
  }

  function openChatGPTWithSummary() {
    if (!patientSummary) {
      alert("Please generate the summary first!");
      return;
    }
    const encoded = encodeURIComponent(patientSummary);
    window.open(`https://chat.openai.com/?prompt=${encoded}`, "_blank");
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">NephroCare Pro</h1>

      <Accordion title="Patient Profile">
         <div className="grid gap-3 md:grid-cols-2">
          <input
            type="text"
            placeholder="Name"
            value={patientProfile.name}
            onChange={(e) => setPatientProfile({ ...patientProfile, name: e.target.value })}
            className="border rounded-md p-2 w-full focus:ring-indigo-500"
          />
          <input
            type="number"
            placeholder="Age"
            value={patientProfile.age}
            onChange={(e) => setPatientProfile({ ...patientProfile, age: e.target.value })}
            className="border rounded-md p-2 w-full focus:ring-indigo-500"
          />
          <select
            value={patientProfile.gender}
            onChange={(e) => setPatientProfile({ ...patientProfile, gender: e.target.value })}
            className="border rounded-md p-2 w-full focus:ring-indigo-500"
          >
            <option value="">Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
          <select
            value={patientProfile.location}
            onChange={(e) => setPatientProfile({ ...patientProfile, location: e.target.value })}
            className="border rounded-md p-2 w-full focus:ring-indigo-500"
          >
            <option value="">Location</option>
            <option>Rural</option>
            <option>Urban</option>
          </select>
        </div>
      </Accordion>

      <Accordion title="Medical History">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={takingMedicines}
            onChange={e => setTakingMedicines(e.target.checked)}
          />
          <span>Currently Taking Medicines</span>
        </label>

        {takingMedicines && medicinesList.map((med, idx) => (
          <div key={idx} className="flex gap-2 mt-2">
            <Select
              options={medicineOptions}
              isSearchable
              value={med.name ? { value: med.name, label: med.name } : null}
              onChange={selected => {
                const updated = [...medicinesList];
                updated[idx].name = selected ? selected.value : "";
                setMedicinesList(updated);
              }}
              className="w-1/2"
            />
            <input
              type="text"
              placeholder="Duration"
              value={med.duration}
              onChange={e => {
                const updated = [...medicinesList];
                updated[idx].duration = e.target.value;
                setMedicinesList(updated);
              }}
              className="border rounded p-2 w-1/2"
            />
          </div>
        ))}
      </Accordion>
      {/* 🩹 Symptoms Accordion */}
      <Accordion title="🩹 Symptoms">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {Object.keys(symptoms).map((item) => (
            <label key={item} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={symptoms[item]}
                onChange={(e) =>
                  setSymptoms({ ...symptoms, [item]: e.target.checked })
                }
                className="accent-indigo-600"
              />
              <span className="text-slate-700">{item.replace(/([A-Z])/g, " $1").toUpperCase()}</span>
            </label>
          ))}
        </div>
      </Accordion>

      {/* 🩺 Physical Exam Accordion */}
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
            onChange={(e) =>
              setPhysicalExam({ ...physicalExam, volumeStatus: e.target.value })
            }
            className="border rounded-md p-2 w-full focus:ring-indigo-500"
          >
            <option value="">Volume Status</option>
            <option value="Hypovolemic">Hypovolemic</option>
            <option value="Euvolemic">Euvolemic</option>
            <option value="Hypervolemic">Hypervolemic</option>
          </select>
        </div>
      </Accordion>

      {/* 🧪 Lab Results Accordion */}
      <Accordion title="🧪 Lab Results">
        <div className="grid gap-3 md:grid-cols-2">
          {Object.entries(labs).map(([key, val]) => (
            <label key={key} className="block">
              <span className="text-slate-700 text-sm">{key.replace(/([A-Z])/g, " $1").toUpperCase()}</span>
              <input
                type="text"
                value={val}
                onChange={(e) => setLabs({ ...labs, [key]: e.target.value })}
                className="border rounded-md p-2 w-full focus:ring-indigo-500"
              />
            </label>
          ))}
        </div>
      </Accordion>

      {/* 🖼️ Imaging Accordion */}
      <Accordion title="🖼️ Imaging - Kidney Ultrasound">
        <div className="space-y-3">
          <label className="block">
            <span className="text-slate-700 text-sm">Ultrasound Findings</span>
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
          </label>
          <textarea
            placeholder="Additional ultrasound notes (optional)"
            value={imaging.notes || ""}
            onChange={(e) => setImaging({ ...imaging, notes: e.target.value })}
            className="border rounded-md p-2 w-full focus:ring-indigo-500"
            rows={3}
          />
        </div>
      </Accordion>

      {/* Add other Accordions here: Symptoms, Physical Exam, Lab Results, Imaging */}

      <Button onClick={askAkI}>Ask Aktiar</Button>
      <Button onClick={generatePatientSummary}>Generate Summary</Button>

      {diagnosis && <p className="mt-4">{diagnosis}</p>}
      {patientSummary && (
        <div className="mt-4">
          <textarea
            value={patientSummary}
            readOnly
            className="w-full h-40 border"
          />
          <Button onClick={copySummary}>Copy Summary</Button>
          <Button onClick={openChatGPTWithSummary}>Open in ChatGPT</Button>
        </div>
      )}
    </div>
  );
}

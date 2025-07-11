import React, { useState } from "react";
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
    ultrasoundFindings: ""
  });

  const [diagnosis, setDiagnosis] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [medications, setMedications] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [patientSummary, setPatientSummary] = useState("");
  const [takingMedicines, setTakingMedicines] = useState(false);
  const [medicinesList, setMedicinesList] = useState([
  { name: "", duration: "" }
]);


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
      warns.push(
        "Hyperkalemia detected: recommend dietary K+ restriction and review medications"
      );
      meds.push("Consider potassium binders if persistent");
    }

    if (hemoglobin < 10 && eGFR < 45) {
      suggest.push(
        "Check iron studies",
        "Consider erythropoiesis-stimulating agents if iron replete"
      );
    }

    meds.push("Avoid NSAIDs");

    if (!result) {
      result = "No specific renal diagnosis determined";
      suggest.push(
        "Consider repeating labs",
        "Refer to nephrologist if abnormalities persist"
      );
    }
// ✅ Interpret Ultrasound Findings
if (imaging.ultrasoundFindings) {
  switch (imaging.ultrasoundFindings) {
    case "Increased echogenicity":
    case "Small shrunken kidneys":
      result = result || "Chronic Kidney Disease (Ultrasound suggestive)";
      suggest.push("Chronic structural changes noted on ultrasound");
      break;
    case "Hydronephrosis":
      result = result || "Possible Obstructive Uropathy";
      suggest.push("Consider further imaging (CT/IVP)", "Assess for urinary obstruction");
      break;
    case "Asymmetry (one small)":
      suggest.push("Possible reflux nephropathy or chronic vascular disease");
      break;
    case "Cystic disease":
      result = result || "Possible Polycystic Kidney Disease";
      suggest.push("Consider family history, genetic counseling");
      break;
    case "Obstructive calculi":
      result = result || "Possible Obstructive Nephropathy (Stones)";
      suggest.push("Assess for hydronephrosis", "Consider urological referral");
      break;
    default:
      break;
  }
}

    setDiagnosis(result);
    setSuggestions(suggest);
    setMedications(meds);
    setWarnings(warns);
  }

  function generatePatientSummary() {
    const historyItems = Object.entries(medicalHistory)
      .filter(([k, v]) => v === true || (typeof v === "string" && v.trim() !== ""))
      .map(([k, v]) =>
        typeof v === "boolean" ? `${k.replace(/([A-Z])/g, " $1")}` : `${k.replace(/([A-Z])/g, " $1")}: ${v}`
      )
      .join("\n");

    const symptomItems = Object.entries(symptoms)
      .filter(([k, v]) => v === true)
      .map(([k]) => k.replace(/([A-Z])/g, " $1"))
      .join("\n");

    const labItems = Object.entries(labs)
      .filter(([_, v]) => v.trim() !== "")
      .map(([k, v]) => `${k.replace(/([A-Z])/g, " $1")}: ${v}`)
      .join("\n");

    let summary = `👤 Patient Profile
Name: ${patientProfile.name}
Age: ${patientProfile.age}
Gender: ${patientProfile.gender}
Location: ${patientProfile.location}

🩺 Medical History
${historyItems || "No significant history"}

🩹 Symptoms
${symptomItems || "No reported symptoms"}

🧪 Lab Results
${labItems || "No lab results entered"}

🖼️ Imaging
Ultrasound Findings: ${imaging.ultrasoundFindings || "Not provided"}

🧭
Determine the medical condition, diagnose, prescribe medicine and suggest further tests if required.
`;

    setPatientSummary(summary);
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

  return (
   <div className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-400 rounded-lg shadow-lg p-4 mb-6 text-center">
  <div className="flex items-center justify-center gap-3">
    <img
      src="/kidney.png"
      alt="Kidney Icon"
      className="h-10 w-10 md:h-12 md:w-12 object-contain"
    />
    <h1 className="text-3xl md:text-4xl font-bold text-white">
      NephroCare Pro
    </h1>
  </div>
  <p className="text-green-100 italic text-sm md:text-base mt-1">
    A Doctor’s Friend
  </p>
</div>

<Accordion title="👤 Patient Profile">
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
<Accordion title="🩺 Medical History">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
    {["diabetes", "hypertension", "nsaidUse", "pastStoneDisease", "familyCKD", "tb", "hiv", "hepatitis"].map((item) => (
      <label key={item} className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={medicalHistory[item]}
          onChange={(e) =>
            setMedicalHistory({ ...medicalHistory, [item]: e.target.checked })
          }
          className="accent-indigo-600"
        />
        <span className="text-slate-700">{item.replace(/([A-Z])/g, " $1").toUpperCase()}</span>
      </label>
    ))}
  </div>

  {medicalHistory.diabetes && (
    <input
      type="text"
      placeholder="Diabetes Duration (years)"
      value={medicalHistory.diabetesDuration}
      onChange={(e) =>
        setMedicalHistory({ ...medicalHistory, diabetesDuration: e.target.value })
      }
      className="mt-2 border rounded-md p-2 w-full focus:ring-indigo-500"
    />
  )}
  {medicalHistory.hypertension && (
    <input
      type="text"
      placeholder="Hypertension Duration (years)"
      value={medicalHistory.hypertensionDuration}
      onChange={(e) =>
        setMedicalHistory({ ...medicalHistory, hypertensionDuration: e.target.value })
      }
      className="mt-2 border rounded-md p-2 w-full focus:ring-indigo-500"
    />
  )}

  <hr className="my-3" />

  <label className="flex items-center space-x-2 mb-2">
    <input
      type="checkbox"
      checked={takingMedicines}
      onChange={(e) => setTakingMedicines(e.target.checked)}
      className="accent-indigo-600"
    />
    <span className="text-slate-700">Currently Taking Medicines</span>
  </label>

  {takingMedicines && (
    <div className="space-y-3 mt-2">
      {medicinesList.map((med, idx) => (
        <div key={idx} className="grid md:grid-cols-2 gap-2">
          <select
            value={med.name}
            onChange={(e) => {
              const updated = [...medicinesList];
              updated[idx].name = e.target.value;
              setMedicinesList(updated);
            }}
            className="border rounded-md p-2 w-full focus:ring-indigo-500"
          >
            <option value="">Select Medicine</option>
            <option>Enalapril</option>
            <option>Ramipril</option>
            <option>Losartan</option>
            <option>Furosemide</option>
            <option>Spironolactone</option>
            <option>Hydrochlorothiazide</option>
            <option>Potassium Binder</option>
            <option>Calcium Channel Blocker</option>
            <option>SGLT2 Inhibitor</option>
            <option>Other</option>
          </select>
          <input
            type="text"
            placeholder="Duration (e.g. 6 months)"
            value={med.duration}
            onChange={(e) => {
              const updated = [...medicinesList];
              updated[idx].duration = e.target.value;
              setMedicinesList(updated);
            }}
            className="border rounded-md p-2 w-full focus:ring-indigo-500"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => setMedicinesList([...medicinesList, { name: "", duration: "" }])}
        className="mt-2 text-indigo-600 underline"
      >
        + Add Another Medicine
      </button>
    </div>
  )}
</Accordion>



  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
    {["diabetes", "hypertension", "nsaidUse", "pastStoneDisease", "familyCKD", "tb", "hiv", "hepatitis"].map((item) => (
      <label key={item} className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={medicalHistory[item]}
          onChange={(e) =>
            setMedicalHistory({ ...medicalHistory, [item]: e.target.checked })
          }
          className="accent-indigo-600"
        />
        <span className="text-slate-700">{item.replace(/([A-Z])/g, " $1").toUpperCase()}</span>
      </label>
    ))}
  </div>
  {medicalHistory.diabetes && (
    <input
      type="text"
      placeholder="Diabetes Duration (years)"
      value={medicalHistory.diabetesDuration}
      onChange={(e) =>
        setMedicalHistory({ ...medicalHistory, diabetesDuration: e.target.value })
      }
      className="mt-2 border rounded-md p-2 w-full focus:ring-indigo-500"
    />
  )}
  {medicalHistory.hypertension && (
    <input
      type="text"
      placeholder="Hypertension Duration (years)"
      value={medicalHistory.hypertensionDuration}
      onChange={(e) =>
        setMedicalHistory({ ...medicalHistory, hypertensionDuration: e.target.value })
      }
      className="mt-2 border rounded-md p-2 w-full focus:ring-indigo-500"
    />
  )}
</Accordion>

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

      <Accordion title="🧪 Lab Results">
  <div className="grid gap-3 md:grid-cols-2">
    <label className="block">
      <span className="text-slate-700 text-sm">Creatinine (0.6–1.2 mg/dL)</span>
      <input
        type="text"
        value={labs.creatinine}
        onChange={(e) => setLabs({ ...labs, creatinine: e.target.value })}
        className="border rounded-md p-2 w-full focus:ring-indigo-500"
      />
    </label>

    <label className="block">
      <span className="text-slate-700 text-sm">eGFR (&gt;90 mL/min)</span>
      <input
        type="text"
        value={labs.egfr}
        onChange={(e) => setLabs({ ...labs, egfr: e.target.value })}
        className="border rounded-md p-2 w-full focus:ring-indigo-500"
      />
    </label>

    <label className="block">
      <span className="text-slate-700 text-sm">Potassium (3.5–5.0 mEq/L)</span>
      <input
        type="text"
        value={labs.potassium}
        onChange={(e) => setLabs({ ...labs, potassium: e.target.value })}
        className="border rounded-md p-2 w-full focus:ring-indigo-500"
      />
    </label>

    <label className="block">
      <span className="text-slate-700 text-sm">Hemoglobin (M:13–17 / F:12–15 g/dL)</span>
      <input
        type="text"
        value={labs.hemoglobin}
        onChange={(e) => setLabs({ ...labs, hemoglobin: e.target.value })}
        className="border rounded-md p-2 w-full focus:ring-indigo-500"
      />
    </label>

    <label className="block">
      <span className="text-slate-700 text-sm">Urinalysis Protein (Negative/Trace)</span>
      <input
        type="text"
        value={labs.urinalysisProtein}
        onChange={(e) => setLabs({ ...labs, urinalysisProtein: e.target.value })}
        className="border rounded-md p-2 w-full focus:ring-indigo-500"
      />
    </label>

    <label className="block">
      <span className="text-slate-700 text-sm">Urinalysis Blood (Negative)</span>
      <input
        type="text"
        value={labs.urinalysisBlood}
        onChange={(e) => setLabs({ ...labs, urinalysisBlood: e.target.value })}
        className="border rounded-md p-2 w-full focus:ring-indigo-500"
      />
    </label>

    <label className="block">
      <span className="text-slate-700 text-sm">ACR (&lt;30 mg/g)</span>
      <input
        type="text"
        value={labs.acr}
        onChange={(e) => setLabs({ ...labs, acr: e.target.value })}
        className="border rounded-md p-2 w-full focus:ring-indigo-500"
      />
    </label>

    <label className="block">
      <span className="text-slate-700 text-sm">Spot Protein/Creatinine (&lt;150 mg/g)</span>
      <input
        type="text"
        value={labs.spotProteinCreatinine}
        onChange={(e) => setLabs({ ...labs, spotProteinCreatinine: e.target.value })}
        className="border rounded-md p-2 w-full focus:ring-indigo-500"
      />
    </label>

    <label className="block">
      <span className="text-slate-700 text-sm">24h Urine Protein (&lt;150 mg/day)</span>
      <input
        type="text"
        value={labs.urineProtein24h}
        onChange={(e) => setLabs({ ...labs, urineProtein24h: e.target.value })}
        className="border rounded-md p-2 w-full focus:ring-indigo-500"
      />
    </label>
  </div>
</Accordion>
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


        <div className="flex flex-wrap gap-3 justify-center my-6">
          <Button onClick={askAkI}>Ask Aktiar</Button>
          <Button onClick={generatePatientSummary}>Show Patient Data Summary</Button>
        </div>

        {diagnosis && (
          <Accordion title="🩺 Diagnosis Result">
            <p>{diagnosis}</p>
            {suggestions.length > 0 && <ul>{suggestions.map((s, i) => <li key={i}>{s}</li>)}</ul>}
            {medications.length > 0 && <ul>{medications.map((m, i) => <li key={i}>{m}</li>)}</ul>}
            {warnings.length > 0 && <ul className="text-red-600">{warnings.map((w, i) => <li key={i}>{w}</li>)}</ul>}
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
            <div className="flex gap-3">
              <Button onClick={copySummary}>Copy to Clipboard</Button>
              <Button onClick={openChatGPTWithSummary}>Search Online</Button>
            </div>
          </Accordion>
        )}
      </div>
    </div>
  );
}

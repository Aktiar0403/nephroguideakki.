import React, { useState } from "react";
import Card from "./components/Card";
import Button from "./components/Button";

export default function App() {
  // State
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

  // Offline Diagnostic Logic
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

    setDiagnosis(result);
    setSuggestions(suggest);
    setMedications(meds);
    setWarnings(warns);
  }

  // Patient Summary Generator
  function generatePatientSummary() {
    let summary = `👤 Patient Profile
Name: ${patientProfile.name}
Age: ${patientProfile.age}
Gender: ${patientProfile.gender}
Location: ${patientProfile.location}

🩺 Medical History
${Object.entries(medicalHistory).map(([k, v]) => `${k}: ${v}`).join("\n")}

🩹 Symptoms
${Object.entries(symptoms).map(([k, v]) => `${k}: ${v}`).join("\n")}

🧪 Lab Results
${Object.entries(labs).map(([k, v]) => `${k}: ${v}`).join("\n")}

🖼️ Imaging
Ultrasound Findings: ${imaging.ultrasoundFindings}
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
    <div className="max-w-3xl mx-auto p-6 font-sans">
      <h1 className="text-2xl font-bold mb-4">NephroGuide - Diagnosis Interface</h1>

      {/* ALL INPUT CARDS */}
      <Card>
        <h2 className="font-semibold">👤 Patient Profile</h2>
        <input type="text" placeholder="Name" value={patientProfile.name} onChange={(e) => setPatientProfile({ ...patientProfile, name: e.target.value })} className="border p-2 block mb-2" />
        <input type="number" placeholder="Age" value={patientProfile.age} onChange={(e) => setPatientProfile({ ...patientProfile, age: e.target.value })} className="border p-2 block mb-2" />
        <select value={patientProfile.gender} onChange={(e) => setPatientProfile({ ...patientProfile, gender: e.target.value })} className="border p-2 block mb-2">
          <option value="">Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <select value={patientProfile.location} onChange={(e) => setPatientProfile({ ...patientProfile, location: e.target.value })} className="border p-2 block mb-2">
          <option value="">Location</option>
          <option value="Rural">Rural</option>
          <option value="Urban">Urban</option>
        </select>
      </Card>

      <Card>
        <h2 className="font-semibold">🩺 Medical History</h2>
        {["diabetes", "hypertension", "nsaidUse", "pastStoneDisease", "familyCKD", "tb", "hiv", "hepatitis"].map((item) => (
          <label key={item} className="block mb-1">
            <input type="checkbox" checked={medicalHistory[item]} onChange={(e) => setMedicalHistory({ ...medicalHistory, [item]: e.target.checked })} /> {item.replace(/([A-Z])/g, " $1").toUpperCase()}
          </label>
        ))}
        {medicalHistory.diabetes && (
          <input type="text" placeholder="Diabetes Duration (years)" value={medicalHistory.diabetesDuration} onChange={(e) => setMedicalHistory({ ...medicalHistory, diabetesDuration: e.target.value })} className="border p-2 block mt-2" />
        )}
        {medicalHistory.hypertension && (
          <input type="text" placeholder="Hypertension Duration (years)" value={medicalHistory.hypertensionDuration} onChange={(e) => setMedicalHistory({ ...medicalHistory, hypertensionDuration: e.target.value })} className="border p-2 block mt-2" />
        )}
      </Card>

      <Card>
        <h2 className="font-semibold">🩹 Symptoms</h2>
        {Object.keys(symptoms).map((item) => (
          <label key={item} className="block mb-1">
            <input type="checkbox" checked={symptoms[item]} onChange={(e) => setSymptoms({ ...symptoms, [item]: e.target.checked })} /> {item.replace(/([A-Z])/g, " $1").toUpperCase()}
          </label>
        ))}
      </Card>

      <Card>
        <h2 className="font-semibold">🩺 Physical Exam</h2>
        <input type="number" placeholder="SBP (mmHg)" value={physicalExam.sbp} onChange={(e) => setPhysicalExam({ ...physicalExam, sbp: e.target.value })} className="border p-2 block mb-2" />
        <input type="number" placeholder="DBP (mmHg)" value={physicalExam.dbp} onChange={(e) => setPhysicalExam({ ...physicalExam, dbp: e.target.value })} className="border p-2 block mb-2" />
        <input type="number" placeholder="Weight (kg)" value={physicalExam.weight} onChange={(e) => setPhysicalExam({ ...physicalExam, weight: e.target.value })} className="border p-2 block mb-2" />
        <select value={physicalExam.volumeStatus} onChange={(e) => setPhysicalExam({ ...physicalExam, volumeStatus: e.target.value })} className="border p-2 block mb-2">
          <option value="">Volume Status</option>
          <option value="Hypovolemic">Hypovolemic</option>
          <option value="Euvolemic">Euvolemic</option>
          <option value="Hypervolemic">Hypervolemic</option>
        </select>
      </Card>
<Card>
  <h2 className="font-semibold">🧪 Lab Results</h2>

  <label className="block mb-2">
    Creatinine (Normal: 0.6–1.2 mg/dL)
    <input type="text" value={labs.creatinine} onChange={(e) => setLabs({ ...labs, creatinine: e.target.value })} className="border p-2 w-full" />
  </label>

  <label className="block mb-2">
    eGFR (Normal: &gt;90 mL/min)
    <input type="text" value={labs.egfr} onChange={(e) => setLabs({ ...labs, egfr: e.target.value })} className="border p-2 w-full" />
  </label>

  <label className="block mb-2">
    Potassium (Normal: 3.5–5.0 mEq/L)
    <input type="text" value={labs.potassium} onChange={(e) => setLabs({ ...labs, potassium: e.target.value })} className="border p-2 w-full" />
  </label>

  <label className="block mb-2">
    Hemoglobin (M: 13–17 / F: 12–15 g/dL)
    <input type="text" value={labs.hemoglobin} onChange={(e) => setLabs({ ...labs, hemoglobin: e.target.value })} className="border p-2 w-full" />
  </label>

  <label className="block mb-2">
    Urinalysis Protein (Normal: Negative/Trace)
    <input type="text" value={labs.urinalysisProtein} onChange={(e) => setLabs({ ...labs, urinalysisProtein: e.target.value })} className="border p-2 w-full" />
  </label>

  <label className="block mb-2">
    Urinalysis Blood (Normal: Negative)
    <input type="text" value={labs.urinalysisBlood} onChange={(e) => setLabs({ ...labs, urinalysisBlood: e.target.value })} className="border p-2 w-full" />
  </label>

  <label className="block mb-2">
    ACR (Normal: &lt;30 mg/g)
    <input type="text" value={labs.acr} onChange={(e) => setLabs({ ...labs, acr: e.target.value })} className="border p-2 w-full" />
  </label>

  <label className="block mb-2">
    Spot Protein/Creatinine Ratio (Normal: &lt;150 mg/g)
    <input type="text" value={labs.spotProteinCreatinine} onChange={(e) => setLabs({ ...labs, spotProteinCreatinine: e.target.value })} className="border p-2 w-full" />
  </label>

  <label className="block mb-2">
    24h Urine Protein (Normal: &lt;150 mg/day)
    <input type="text" value={labs.urineProtein24h} onChange={(e) => setLabs({ ...labs, urineProtein24h: e.target.value })} className="border p-2 w-full" />
  </label>
</Card>

<Button onClick={askAkI}>Ask Aktiar</Button>
<Button onClick={generatePatientSummary}>Show Patient Data Summary</Button>

{diagnosis && (
  <Card>
    <p><strong>Diagnosis:</strong> {diagnosis}</p>
    {suggestions.length > 0 && (
      <>
        <strong>Recommendations:</strong>
        <ul className="list-disc pl-5">
          {suggestions.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
      </>
    )}
    {medications.length > 0 && (
      <>
        <strong>Medications:</strong>
        <ul className="list-disc pl-5">
          {medications.map((m, i) => <li key={i}>{m}</li>)}
        </ul>
      </>
    )}
    {warnings.length > 0 && (
      <>
        <strong className="text-red-600">Warnings:</strong>
        <ul className="list-disc pl-5 text-red-600">
          {warnings.map((w, i) => <li key={i}>{w}</li>)}
        </ul>
      </>
    )}
  </Card>
)}

{patientSummary && (
  <Card>
    <h2 className="font-semibold">📋 Patient Data Summary (for ChatGPT)</h2>
    <textarea
      value={patientSummary}
      readOnly
      rows={10}
      className="border p-2 w-full mb-2"
    />
    <Button onClick={copySummary}>Copy to Clipboard</Button>
    <Button onClick={openChatGPTWithSummary}>Search Online</Button>
  </Card>
)}
    </div>
  );
}

      {/* NEXT MESSAGE WILL HAVE THE LABS, IMAGING, AND BOTTOM BUTTONS! */}

    </div>
  );
}

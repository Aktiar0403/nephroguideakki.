import React, { useState } from "react";
import Card from "./components/Card";
import Button from "./components/Button";

export default function App() {
  // 🟢 All Patient States
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

  // ✅ Offline Diagnostic Logic
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
        suggest.push("Regular eGFR monitoring every 3–6 months", "Avoid nephrotoxins", "Assess blood pressure control");
      }
    }

    if (proteinuria > 3500 && symptoms.edema) {
      result = "Possible Nephrotic Syndrome";
      suggest.push("Check serum albumin", "Consider renal biopsy if unexplained", "Manage edema with diuretics");
      meds.push("Loop diuretic for edema");
    }

    if (medicalHistory.diabetes && eGFR < 60 && (acr > 30 || proteinuria > 150)) {
      result = "Likely Diabetic Kidney Disease";
      suggest.push("Tight glucose control", "Annual ACR monitoring", "Eye screening for retinopathy");
      if (eGFR >= 30 && potassium <= 5.5) {
        meds.push("ACEi/ARB if potassium normal");
      } else if (potassium > 5.5) {
        warns.push("Avoid ACEi/ARB due to hyperkalemia risk");
      }
    }

    if (medicalHistory.hypertension && eGFR < 60 && proteinuria < 1000) {
      result = "Possible Hypertensive Nephrosclerosis";
      suggest.push("Optimize BP to <130/80", "Regular urinalysis monitoring");
      meds.push("ACEi/ARB if potassium normal");
    }

    if (potassium > 5.5) {
      warns.push("Hyperkalemia detected: recommend dietary K+ restriction and review medications");
      meds.push("Consider potassium binders if persistent");
    }

    if (hemoglobin < 10 && eGFR < 45) {
      suggest.push("Check iron studies", "Consider erythropoiesis-stimulating agents if iron replete");
    }

    meds.push("Avoid NSAIDs");

    if (!result) {
      result = "No specific renal diagnosis determined";
      suggest.push("Consider repeating labs", "Refer to nephrologist if abnormalities persist");
    }

    setDiagnosis(result);
    setSuggestions(suggest);
    setMedications(meds);
    setWarnings(warns);
  }

  // ✅ Patient Summary Generator
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

  // ✅ Copy to Clipboard
  function copySummary() {
    navigator.clipboard.writeText(patientSummary);
    alert("Patient data copied to clipboard!");
  }

  // ✅ Open ChatGPT with Prompt
  function openChatGPTWithSummary() {
    if (!patientSummary) {
      alert("Please generate the patient summary first!");
      return;
    }
    const encoded = encodeURIComponent(patientSummary);
    const chatURL = `https://chat.openai.com/?prompt=${encoded}`;
    window.open(chatURL, "_blank");
  }

  // ✅ UI
  return (
    <div className="max-w-3xl mx-auto p-6 font-sans">
      <h1 className="text-2xl font-bold mb-4">NephroGuide - Diagnosis Interface</h1>

      {/* All your Cards for input go here - keep your existing Patient Profile, Medical History, Symptoms, Physical Exam, Lab Results, Imaging Cards */}

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

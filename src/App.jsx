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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
          NephroGuide - Diagnosis Interface
        </h1>
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
          {/* your medical history inputs here */}
        </Accordion>

        <Accordion title="🩹 Symptoms">
          {/* your symptoms inputs here */}
        </Accordion>

        <Accordion title="🩺 Physical Exam">
          {/* your physical exam inputs here */}
        </Accordion>

        <Accordion title="🧪 Lab Results">
          {/* your lab inputs here */}
        </Accordion>

        <Accordion title="🖼️ Imaging">
          {/* your imaging inputs here */}
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
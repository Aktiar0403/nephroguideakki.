import React, { useState } from "react";
import Card from "./components/Card";
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

  // Diagnostic logic
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
          NephroGuide - Diagnosis Interface
        </h1>

        {/* Profile */}
        <Card className="mb-4">
          <h2 className="text-lg font-semibold text-indigo-600 mb-3">👤 Patient Profile</h2>
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
        </Card>
        {/* Medical History */}
        <Card className="mb-4">
          <h2 className="text-lg font-semibold text-indigo-600 mb-3">🩺 Medical History</h2>
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
              onChange={(e) => setMedicalHistory({ ...medicalHistory, diabetesDuration: e.target.value })}
              className="mt-2 border rounded-md p-2 w-full focus:ring-indigo-500"
            />
          )}
          {medicalHistory.hypertension && (
            <input
              type="text"
              placeholder="Hypertension Duration (years)"
              value={medicalHistory.hypertensionDuration}
              onChange={(e) => setMedicalHistory({ ...medicalHistory, hypertensionDuration: e.target.value })}
              className="mt-2 border rounded-md p-2 w-full focus:ring-indigo-500"
            />
          )}
        </Card>

        {/* Symptoms */}
        <Card className="mb-4">
          <h2 className="text-lg font-semibold text-indigo-600 mb-3">🩹 Symptoms</h2>
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
        </Card>

        {/* Physical Exam */}
        <Card className="mb-4">
          <h2 className="text-lg font-semibold text-indigo-600 mb-3">🩺 Physical Exam</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <input type="number" placeholder="SBP (mmHg)" value={physicalExam.sbp} onChange={(e) => setPhysicalExam({ ...physicalExam, sbp: e.target.value })} className="border rounded-md p-2 w-full focus:ring-indigo-500" />
            <input type="number" placeholder="DBP (mmHg)" value={physicalExam.dbp} onChange={(e) => setPhysicalExam({ ...physicalExam, dbp: e.target.value })} className="border rounded-md p-2 w-full focus:ring-indigo-500" />
            <input type="number" placeholder="Weight (kg)" value={physicalExam.weight} onChange={(e) => setPhysicalExam({ ...physicalExam, weight: e.target.value })} className="border rounded-md p-2 w-full focus:ring-indigo-500" />
            <select value={physicalExam.volumeStatus} onChange={(e) => setPhysicalExam({ ...physicalExam, volumeStatus: e.target.value })} className="border rounded-md p-2 w-full focus:ring-indigo-500">
              <option value="">Volume Status</option>
              <option value="Hypovolemic">Hypovolemic</option>
              <option value="Euvolemic">Euvolemic</option>
              <option value="Hypervolemic">Hypervolemic</option>
            </select>
          </div>
        </Card>
        {/* Lab Results */}
        <Card className="mb-4">
          <h2 className="text-lg font-semibold text-indigo-600 mb-3">🧪 Lab Results</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="block">
              <span className="text-slate-700 text-sm">Creatinine (0.6–1.2 mg/dL)</span>
              <input type="text" value={labs.creatinine} onChange={(e) => setLabs({ ...labs, creatinine: e.target.value })} className="border rounded-md p-2 w-full focus:ring-indigo-500" />
            </label>
            <label className="block">
              <span className="text-slate-700 text-sm">eGFR (&gt;90 mL/min)</span>
              <input type="text" value={labs.egfr} onChange={(e) => setLabs({ ...labs, egfr: e.target.value })} className="border rounded-md p-2 w-full focus:ring-indigo-500" />
            </label>
            <label className="block">
              <span className="text-slate-700 text-sm">Potassium (3.5–5.0 mEq/L)</span>
              <input type="text" value={labs.potassium} onChange={(e) => setLabs({ ...labs, potassium: e.target.value })} className="border rounded-md p-2 w-full focus:ring-indigo-500" />
            </label>
            <label className="block">
              <span className="text-slate-700 text-sm">Hemoglobin (M:13–17 / F:12–15 g/dL)</span>
              <input type="text" value={labs.hemoglobin} onChange={(e) => setLabs({ ...labs, hemoglobin: e.target.value })} className="border rounded-md p-2 w-full focus:ring-indigo-500" />
            </label>
            <label className="block">
              <span className="text-slate-700 text-sm">Urinalysis Protein (Negative/Trace)</span>
              <input type="text" value={labs.urinalysisProtein} onChange={(e) => setLabs({ ...labs, urinalysisProtein: e.target.value })} className="border rounded-md p-2 w-full focus:ring-indigo-500" />
            </label>
            <label className="block">
              <span className="text-slate-700 text-sm">Urinalysis Blood (Negative)</span>
              <input type="text" value={labs.urinalysisBlood} onChange={(e) => setLabs({ ...labs, urinalysisBlood: e.target.value })} className="border rounded-md p-2 w-full focus:ring-indigo-500" />
            </label>
            <label className="block">
              <span className="text-slate-700 text-sm">ACR (&lt;30 mg/g)</span>
              <input type="text" value={labs.acr} onChange={(e) => setLabs({ ...labs, acr: e.target.value })} className="border rounded-md p-2 w-full focus:ring-indigo-500" />
            </label>
            <label className="block">
              <span className="text-slate-700 text-sm">Spot Protein/Creatinine (&lt;150 mg/g)</span>
              <input type="text" value={labs.spotProteinCreatinine} onChange={(e) => setLabs({ ...labs, spotProteinCreatinine: e.target.value })} className="border rounded-md p-2 w-full focus:ring-indigo-500" />
            </label>
            <label className="block">
              <span className="text-slate-700 text-sm">24h Urine Protein (&lt;150 mg/day)</span>
              <input type="text" value={labs.urineProtein24h} onChange={(e) => setLabs({ ...labs, urineProtein24h: e.target.value })} className="border rounded-md p-2 w-full focus:ring-indigo-500" />
            </label>
          </div>
        </Card>

        {/* Imaging */}
        <Card className="mb-4">
          <h2 className="text-lg font-semibold text-indigo-600 mb-3">🖼️ Imaging</h2>
          <textarea
            placeholder="Ultrasound Findings"
            value={imaging.ultrasoundFindings}
            onChange={(e) => setImaging({ ...imaging, ultrasoundFindings: e.target.value })}
            className="border rounded-md p-2 w-full focus:ring-indigo-500"
            rows={3}
          />
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-center mb-6">
          <Button onClick={askAkI} className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow hover:bg-indigo-700 transition">Ask Aktiar</Button>
          <Button onClick={generatePatientSummary} className="bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700 transition">Show Patient Data Summary</Button>
        </div>

        {/* Results */}
        {diagnosis && (
          <Card className="mb-4 bg-indigo-50 border-indigo-200">
            <h3 className="text-indigo-700 font-semibold mb-2">Diagnosis</h3>
            <p className="mb-2">{diagnosis}</p>
            {suggestions.length > 0 && (
              <>
                <h4 className="font-semibold mb-1">Recommendations:</h4>
                <ul className="list-disc pl-5 mb-2 text-slate-700">
                  {suggestions.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </>
            )}
            {medications.length > 0 && (
              <>
                <h4 className="font-semibold mb-1">Medications:</h4>
                <ul className="list-disc pl-5 mb-2 text-slate-700">
                  {medications.map((m, i) => <li key={i}>{m}</li>)}
                </ul>
              </>
            )}
            {warnings.length > 0 && (
              <>
                <h4 className="font-semibold text-red-600 mb-1">Warnings:</h4>
                <ul className="list-disc pl-5 text-red-600">
                  {warnings.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </>
            )}
          </Card>
        )}

        {/* Patient Summary */}
        {patientSummary && (
          <Card className="mb-4 bg-green-50 border-green-200">
            <h3 className="text-green-700 font-semibold mb-2">📋 Patient Data Summary (for ChatGPT)</h3>
            <textarea
              value={patientSummary}
              readOnly
              rows={10}
              className="border rounded-md p-2 w-full mb-3 focus:ring-green-500"
            />
            <div className="flex gap-3">
              <Button onClick={copySummary} className="bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700 transition">Copy to Clipboard</Button>
              <Button onClick={openChatGPTWithSummary} className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition">Search Online</Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

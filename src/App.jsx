import React, { useState } from "react";
import Card from "./components/Card";
import Button from "./components/Button";

export default function App() {

  // ✅ STATE: Patient Profile
  const [patientProfile, setPatientProfile] = useState({
    name: "",
    age: "",
    gender: "",
    location: ""
  });

  // ✅ STATE: Medical History
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

  // ✅ STATE: Symptoms
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

  // ✅ STATE: Physical Exam
  const [physicalExam, setPhysicalExam] = useState({
    sbp: "",
    dbp: "",
    weight: "",
    volumeStatus: ""
  });

  // ✅ STATE: Lab Results
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

  // ✅ STATE: Imaging
  const [imaging, setImaging] = useState({
    ultrasoundFindings: ""
  });

  // ✅ STATE: Results
  const [diagnosis, setDiagnosis] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [medications, setMedications] = useState([]);
  const [warnings, setWarnings] = useState([]);

  // ✅ AI Call
  async function askAkI() {
    const patientData = {
      patientProfile,
      medicalHistory,
      symptoms,
      physicalExam,
      labs,
      imaging
    };

    const prompt = `
You are an experienced nephrologist. Given the following patient data:

${JSON.stringify(patientData, null, 2)}

Provide:
- Likely diagnosis
- Recommendations
- Suggested medications
- Warnings

Reply in JSON with keys:
{
  "diagnosis": "",
  "recommendations": [],
  "medications": [],
  "warnings": []
}
`;

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer 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`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are a helpful nephrologist assistant." },
            { role: "user", content: prompt }
          ],
          temperature: 0.2
        })
      });

      const data = await response.json();
      const message = data.choices[0].message.content;

      // Parse JSON
      const aiResult = JSON.parse(message);
      setDiagnosis(aiResult.diagnosis);
      setSuggestions(aiResult.recommendations);
      setMedications(aiResult.medications);
      setWarnings(aiResult.warnings);

    } catch (error) {
      console.error("Error calling AkI:", error);
      setDiagnosis("Error getting AkI response. Please check API key and usage.");
      setSuggestions([]);
      setMedications([]);
      setWarnings([]);
    }
  }

  // ✅ UI
  return (
    <div className="max-w-3xl mx-auto p-6 font-sans">
      <h1 className="text-2xl font-bold mb-4">NephroGuide - Diagnosis Interface</h1>

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
            <input type="checkbox" name={item} checked={medicalHistory[item]} onChange={(e) => setMedicalHistory({ ...medicalHistory, [item]: e.target.checked })} />{" "}
            {item.replace(/([A-Z])/g, " $1").toUpperCase()}
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
            <input type="checkbox" name={item} checked={symptoms[item]} onChange={(e) => setSymptoms({ ...symptoms, [item]: e.target.checked })} />{" "}
            {item.replace(/([A-Z])/g, " $1").toUpperCase()}
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



      <Card>
        <h2 className="font-semibold">🖼️ Imaging</h2>
        <textarea placeholder="Ultrasound Findings" value={imaging.ultrasoundFindings} onChange={(e) => setImaging({ ...imaging, ultrasoundFindings: e.target.value })} className="border p-2 w-full" />
      </Card>

      <Button onClick={askAkI}>Ask AkI</Button>

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
    </div>
  );
}

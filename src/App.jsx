import React, { useState } from "react";
import Card from "./components/Card";
import Button from "./components/Button";

export default function App() {
  const [history, setHistory] = useState([]);
  const [symptoms, setSymptoms] = useState({});
  const [labs, setLabs] = useState({
    creatinine: "",
    egfr: "",
    proteinuria: "",
    potassium: "",
    hemoglobin: ""
  });
  const [diagnosis, setDiagnosis] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [medications, setMedications] = useState([]);
  const [warnings, setWarnings] = useState([]);

  const handleCheckboxChange = (e, type) => {
    const { name, checked } = e.target;
    if (type === "history") {
      setHistory(prev => checked ? [...prev, name] : prev.filter(item => item !== name));
    } else if (type === "symptoms") {
      setSymptoms(prev => ({ ...prev, [name]: checked }));
    }
  };

  const handleLabChange = (e) => {
    const { name, value } = e.target;
    setLabs(prev => ({ ...prev, [name]: value }));
  };

  const handleEvaluate = () => {
    let result = "";
    let suggest = [];
    let meds = [];
    let warns = [];
    const eGFR = parseFloat(labs.egfr);
    const proteinuria = labs.proteinuria;
    const potassium = parseFloat(labs.potassium);
    const hemoglobin = parseFloat(labs.hemoglobin);

    if (eGFR < 60) {
      result = "Chronic Kidney Disease";
      if (eGFR < 15) result += " (Stage G5 - ESRD)";
      else if (eGFR < 30) result += " (Stage G4)";
      else if (eGFR < 45) result += " (Stage G3b)";
      else result += " (Stage G3a)";
      suggest.push("Repeat eGFR in 3 months", "Check urine ACR", "Renal Ultrasound");
      if (!(history.includes("Hyperkalemia"))) {
        meds.push("Start ACEi/ARB if proteinuric");
      }
      meds.push("Avoid NSAIDs");
      if (potassium > 5.5) {
        warns.push("Avoid ACEi/ARB due to hyperkalemia risk");
      }
    }

    if (proteinuria === "Nephrotic Range" && symptoms.edema) {
      result = "Nephrotic Syndrome";
      suggest.push("24h Urine Protein", "Serum Albumin", "Renal Biopsy Evaluation");
      meds.push("Start corticosteroids if minimal change suspected", "Use furosemide for edema");
    }

    if (history.includes("Diabetes") && eGFR < 60 && proteinuria !== "None") {
      result = "Likely Diabetic Nephropathy";
      suggest.push("HbA1c", "Urine ACR", "Ophthalmology referral");
      if (eGFR > 30) meds.push("Use SGLT2 inhibitor");
      else warns.push("Avoid SGLT2 inhibitor (eGFR < 30)");
    }

    if (labs.potassium > 5.5) {
      meds.push("Restrict dietary K+", "Consider patiromer/sodium polystyrene");
      warns.push("Avoid spironolactone and ACEi/ARB due to high K+");
    }

    if (hemoglobin < 10 && eGFR < 45) {
      suggest.push("Evaluate for anemia", "Check iron studies");
      meds.push("Start ESA if iron sufficient");
    }

    if (!result) {
      result = "No clear renal diagnosis";
      suggest.push("Monitor annually", "Ensure proper hydration");
    }

    setDiagnosis(result);
    setSuggestions(suggest);
    setMedications(meds);
    setWarnings(warns);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 font-sans">
      <h1 className="text-2xl font-bold mb-4">NephroGuide - Diagnosis Interface</h1>
      
      <Card>
        <h2 className="font-semibold">Medical History</h2>
        {["Diabetes", "Hypertension", "Hyperkalemia", "NSAID use"].map((item) => (
          <label key={item} className="block">
            <input type="checkbox" name={item} onChange={(e) => handleCheckboxChange(e, "history")} />
            {` ${item}`}
          </label>
        ))}
      </Card>

      <Card>
        <h2 className="font-semibold">Symptoms</h2>
        {["edema", "fatigue", "nausea", "flankPain"].map((item) => (
          <label key={item} className="block">
            <input type="checkbox" name={item} onChange={(e) => handleCheckboxChange(e, "symptoms")} />
            {` ${item}`}
          </label>
        ))}
      </Card>

      <Card>
        <h2 className="font-semibold">Lab Results</h2>
        <div className="grid grid-cols-2 gap-4">
          <input type="number" name="creatinine" placeholder="Creatinine (mg/dL)" onChange={handleLabChange} className="border p-2" />
          <input type="number" name="egfr" placeholder="eGFR (ml/min)" onChange={handleLabChange} className="border p-2" />
          <input type="number" name="potassium" placeholder="Potassium (mEq/L)" onChange={handleLabChange} className="border p-2" />
          <input type="number" name="hemoglobin" placeholder="Hemoglobin (g/dL)" onChange={handleLabChange} className="border p-2" />
          <select name="proteinuria" onChange={handleLabChange} className="border p-2 col-span-2">
            <option value="">Select Proteinuria Level</option>
            <option value="None">None</option>
            <option value="Mild">Mild</option>
            <option value="Nephrotic Range">Nephrotic Range</option>
          </select>
        </div>
      </Card>

      <Button onClick={handleEvaluate}>Evaluate</Button>

      {diagnosis && (
        <Card>
          <p><strong>Diagnosis:</strong> {diagnosis}</p>
          {suggestions.length > 0 && (
            <>
              <strong>Recommendations:</strong>
              <ul>{suggestions.map((s, i) => <li key={i}>{s}</li>)}</ul>
            </>
          )}
          {medications.length > 0 && (
            <>
              <strong>Medications:</strong>
              <ul>{medications.map((m, i) => <li key={i}>{m}</li>)}</ul>
            </>
          )}
          {warnings.length > 0 && (
            <>
              <strong className="text-red-600">Warnings:</strong>
              <ul className="text-red-600">{warnings.map((w, i) => <li key={i}>{w}</li>)}</ul>
            </>
          )}
        </Card>
      )}
    </div>
  );
}


import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { triageSamples } from "@/utils/mockData";

const TriageAnalyzer = () => {
  const [triageText, setTriageText] = useState("");
  const [analysis, setAnalysis] = useState<{
    urgency: "urgent" | "high" | "medium" | "low";
    confidence: number;
    keywords: string[];
    recommendedDepartment: string;
  } | null>(null);

  const analyzeTriage = () => {
    // In a real implementation, this would call the NLP backend
    // Here we'll simulate an AI response based on keywords
    const text = triageText.toLowerCase();
    let urgency: "urgent" | "high" | "medium" | "low" = "low";
    let confidence = 0.7;
    let keywords: string[] = [];
    let recommendedDepartment = "general";

    if (
      text.includes("unconscious") ||
      text.includes("severe") ||
      text.includes("chest pain") ||
      text.includes("difficulty breathing") ||
      text.includes("hemorrhage")
    ) {
      urgency = "urgent";
      confidence = 0.95;
      keywords = ["critical", "emergency", "immediate attention"];
      recommendedDepartment = "emergency";
    } else if (
      text.includes("pain") ||
      text.includes("fracture") ||
      text.includes("vomiting") ||
      text.includes("bleeding")
    ) {
      urgency = "high";
      confidence = 0.85;
      keywords = ["acute", "prompt attention"];
      recommendedDepartment = "emergency";
    } else if (
      text.includes("fever") ||
      text.includes("infection") ||
      text.includes("mild") ||
      text.includes("moderate")
    ) {
      urgency = "medium";
      confidence = 0.78;
      keywords = ["stable", "moderate concern"];
      recommendedDepartment = "general";
    }

    // Check for specific department recommendations
    if (text.includes("heart") || text.includes("chest pain") || text.includes("cardiac")) {
      recommendedDepartment = "cardiology";
    } else if (text.includes("bone") || text.includes("fracture")) {
      recommendedDepartment = "radiology";
    } else if (text.includes("child") || text.includes("infant")) {
      recommendedDepartment = "pediatrics";
    } else if (text.includes("surgery") || text.includes("operation")) {
      recommendedDepartment = "surgery";
    }

    setAnalysis({
      urgency,
      confidence,
      keywords,
      recommendedDepartment,
    });
  };

  const loadSample = (index: number) => {
    setTriageText(triageSamples[index]);
    setAnalysis(null);
  };

  return (
    <Card className="col-span-full md:col-span-1">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          Triage Analyzer
          <Badge className="ml-2 bg-medflow-purple hover:bg-medflow-dark-purple">
            AI Powered
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Textarea
              className="min-h-[100px]"
              placeholder="Enter triage notes here..."
              value={triageText}
              onChange={(e) => setTriageText(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button onClick={analyzeTriage} className="bg-medflow-purple hover:bg-medflow-dark-purple">
              Analyze Urgency
            </Button>
            <Button variant="outline" size="sm" onClick={() => loadSample(0)}>
              Sample 1
            </Button>
            <Button variant="outline" size="sm" onClick={() => loadSample(1)}>
              Sample 2
            </Button>
            <Button variant="outline" size="sm" onClick={() => loadSample(2)}>
              Sample 3
            </Button>
          </div>
          
          {analysis && (
            <div className={`p-4 rounded-md mt-4 ${
              analysis.urgency === "urgent" ? "triage-urgent" :
              analysis.urgency === "high" ? "triage-high" :
              analysis.urgency === "medium" ? "triage-medium" :
              "triage-low"
            }`}>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold">
                  {analysis.urgency.toUpperCase()} PRIORITY
                </h3>
                <span className="text-sm">
                  {(analysis.confidence * 100).toFixed(0)}% confidence
                </span>
              </div>
              <div className="text-sm">
                <p><strong>Keywords detected:</strong> {analysis.keywords.join(", ")}</p>
                <p className="mt-1"><strong>Recommended department:</strong> {analysis.recommendedDepartment}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TriageAnalyzer;


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { departments, routeRecommendations } from "@/utils/mockData";

const HospitalMap = () => {
  // Generate patient flow lines between departments
  const generateFlowLines = () => {
    return routeRecommendations.map((rec, index) => {
      const sourceDept = departments.find((d) => d.id === rec.currentDept);
      const targetDept = departments.find((d) => d.id === rec.recommendedDept);
      
      if (!sourceDept || !targetDept) return null;
      
      const sourceX = sourceDept.coordinates.x + sourceDept.coordinates.width / 2;
      const sourceY = sourceDept.coordinates.y + sourceDept.coordinates.height / 2;
      const targetX = targetDept.coordinates.x + targetDept.coordinates.width / 2;
      const targetY = targetDept.coordinates.y + targetDept.coordinates.height / 2;
      
      const urgencyColor = 
        rec.urgency === "urgent" ? "#ef4444" : 
        rec.urgency === "high" ? "#f97316" : 
        rec.urgency === "medium" ? "#eab308" : "#22c55e";
      
      return (
        <line
          key={index}
          x1={sourceX}
          y1={sourceY}
          x2={targetX}
          y2={targetY}
          stroke={urgencyColor}
          strokeWidth="3"
          strokeDasharray="5,5"
          className="flow-line"
          markerEnd="url(#arrowhead)"
        />
      );
    });
  };

  return (
    <Card className="col-span-full md:col-span-2">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          Hospital Map & Patient Routing
          <Badge className="ml-2 bg-medflow-purple hover:bg-medflow-dark-purple">
            AI Powered
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="hospital-map h-[400px] border rounded-lg relative">
          <svg width="100%" height="100%" viewBox="0 0 500 250" preserveAspectRatio="xMidYMid meet">
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#8B5CF6" />
              </marker>
            </defs>
            
            {/* Department boxes */}
            {departments.map((dept) => (
              <rect
                key={dept.id}
                x={dept.coordinates.x}
                y={dept.coordinates.y}
                width={dept.coordinates.width}
                height={dept.coordinates.height}
                rx="5"
                fill="rgba(155, 135, 245, 0.2)"
                stroke="#9b87f5"
                strokeWidth="2"
              />
            ))}
            
            {/* Department labels */}
            {departments.map((dept) => (
              <text
                key={`text-${dept.id}`}
                x={dept.coordinates.x + dept.coordinates.width / 2}
                y={dept.coordinates.y + dept.coordinates.height / 2}
                textAnchor="middle"
                fill="#1f2937"
                fontSize="10"
                fontWeight="bold"
              >
                {dept.name}
              </text>
            ))}
            
            {/* Patient capacity indicators */}
            {departments.map((dept) => (
              <text
                key={`capacity-${dept.id}`}
                x={dept.coordinates.x + dept.coordinates.width / 2}
                y={dept.coordinates.y + dept.coordinates.height / 2 + 15}
                textAnchor="middle"
                fill="#4b5563"
                fontSize="8"
              >
                {dept.currentPatients}/{dept.capacity}
              </text>
            ))}
            
            {/* Patient flow lines */}
            {generateFlowLines()}
          </svg>
          
          <div className="absolute bottom-2 right-2 bg-white p-2 rounded-md border text-xs">
            <div className="font-semibold mb-1">Patient Flow</div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-red-500"></span>
                <span>Urgent</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-orange-500"></span>
                <span>High</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                <span>Medium</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HospitalMap;

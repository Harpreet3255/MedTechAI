
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { waitTimeTrends, departments } from "@/utils/mockData";
import { BarChart } from "@/components/ui/chart";

interface WaitTimePredictorProps {
  fullView?: boolean;
}

const WaitTimePredictor = ({ fullView = false }: WaitTimePredictorProps) => {
  // Format data for recharts
  const chartData = waitTimeTrends.labels.map((time, index) => {
    const dataPoint: { name: string; [key: string]: string | number } = { name: time };
    
    waitTimeTrends.datasets.forEach((dataset) => {
      dataPoint[dataset.department] = dataset.data[index];
    });
    
    return dataPoint;
  });

  return (
    <Card className="col-span-full md:col-span-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Wait Time Predictor</CardTitle>
        <Badge className="bg-medflow-purple hover:bg-medflow-dark-purple">AI Powered</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-4">
            {departments.slice(0, 4).map((dept) => (
              <div key={dept.id} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-medflow-purple"></div>
                <div className="flex-1 flex items-center justify-between">
                  <div className="text-sm font-medium">{dept.name}</div>
                  <div className="text-sm">
                    <span>Current: </span>
                    <span className="font-semibold">{dept.waitTime} mins</span>
                  </div>
                  <div className="text-sm">
                    <span>Predicted: </span>
                    <span className={`font-semibold ${dept.waitTime > 30 ? 'text-orange-500' : 'text-green-600'}`}>
                      {Math.round(dept.waitTime * (Math.random() > 0.5 ? 0.8 : 1.2))} mins
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="h-[200px] mt-8">
            <BarChart
              data={chartData}
              index="name"
              categories={["Emergency", "Radiology", "Surgery"]}
              colors={["#9b87f5", "#0EA5E9", "#F97316"]}
              yAxisWidth={30}
              valueFormatter={(value) => `${value} mins`}
            />
          </div>
          
          <div className="text-xs text-muted-foreground mt-2">
            <p className="text-center">Predicted wait times over next 12 hours</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WaitTimePredictor;

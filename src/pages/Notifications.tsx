import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Bell, CheckCircle, Clock, AlertTriangle, Info } from "lucide-react";

// Mock notification data
const mockNotifications = [
  {
    id: "n1",
    title: "Critical: ICU Bed Shortage",
    message: "ICU is currently at 95% capacity. Consider patient transfers or discharge reviews.",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    type: "critical",
    read: false,
  },
  {
    id: "n2",
    title: "Patient Transfer Completed",
    message: "Patient #P045 has been successfully transferred from Emergency to Cardiology.",
    timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
    type: "info",
    read: false,
  },
  {
    id: "n3",
    title: "New AI Recommendation",
    message: "AI suggests moving 3 patients from Emergency to Radiology based on current wait times.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    type: "recommendation",
    read: true,
  },
  {
    id: "n4",
    title: "System Update Scheduled",
    message: "A system update is scheduled for tonight at 2:00 AM. Expect 15 minutes of downtime.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    type: "system",
    read: true,
  },
  {
    id: "n5",
    title: "Daily Report Available",
    message: "Your daily hospital operations report for yesterday is now available.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    type: "report",
    read: true,
  },
  {
    id: "n6",
    title: "Warning: Radiology Queue Growing",
    message: "The wait time for Radiology has increased by 45% in the last hour.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26), // 26 hours ago
    type: "warning",
    read: true,
  },
  {
    id: "n7",
    title: "Staff Shortage Alert",
    message: "Pediatrics department is understaffed for the upcoming night shift.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    type: "warning",
    read: true,
  },
];

const Notifications = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [notifications, setNotifications] = useState(mockNotifications);
  
  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notification.read;
    if (activeTab === "critical") return notification.type === "critical" || notification.type === "warning";
    return notification.type === activeTab;
  });
  
  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };
  
  // Format timestamp
  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
  };
  
  // Get icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />;
      case "recommendation":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "system":
        return <Bell className="h-5 w-5 text-purple-500" />;
      case "report":
        return <Clock className="h-5 w-5 text-gray-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Get badge color based on notification type
  const getNotificationBadge = (type: string) => {
    switch (type) {
      case "critical":
        return <Badge className="bg-red-500">Critical</Badge>;
      case "warning":
        return <Badge className="bg-amber-500">Warning</Badge>;
      case "info":
        return <Badge className="bg-blue-500">Info</Badge>;
      case "recommendation":
        return <Badge className="bg-green-500">Recommendation</Badge>;
      case "system":
        return <Badge className="bg-purple-500">System</Badge>;
      case "report":
        return <Badge className="bg-gray-500">Report</Badge>;
      default:
        return <Badge className="bg-gray-500">Other</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto py-6 px-4">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">Notifications</h1>
              <p className="text-muted-foreground">
                View and manage your system notifications
              </p>
            </div>
            <Button variant="outline" onClick={markAllAsRead}>
              Mark All as Read
            </Button>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="all">
                All
                <Badge variant="outline" className="ml-2">{notifications.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="unread">
                Unread
                <Badge variant="outline" className="ml-2">
                  {notifications.filter(n => !n.read).length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="critical">Critical</TabsTrigger>
              <TabsTrigger value="recommendation">Recommendations</TabsTrigger>
              <TabsTrigger value="system">System</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Notifications
                  </CardTitle>
                  <CardDescription>
                    {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredNotifications.length === 0 ? (
                      <div className="text-center py-8">
                        <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium">No notifications</h3>
                        <p className="text-muted-foreground">
                          You don't have any {activeTab !== 'all' ? activeTab : ''} notifications at the moment.
                        </p>
                      </div>
                    ) : (
                      filteredNotifications.map((notification) => (
                        <div 
                          key={notification.id} 
                          className={`p-4 rounded-lg border ${notification.read ? 'bg-background' : 'bg-muted/30'}`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex items-start gap-4">
                            <div className="mt-1">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium">{notification.title}</h3>
                                {getNotificationBadge(notification.type)}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {notification.message}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <p className="text-xs text-muted-foreground">
                                  {formatTimestamp(notification.timestamp)}
                                </p>
                                {!notification.read && (
                                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                    New
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Notifications;

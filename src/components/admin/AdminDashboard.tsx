
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, ShieldCheck, FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface StatsCard {
  title: string;
  count: number | null;
  icon: React.ReactNode;
  description: string;
  link: string;
  color: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<{
    usersCount: number | null;
    departmentsCount: number | null;
    activeUsers: number | null;
    recentActivities: number | null;
  }>({
    usersCount: null,
    departmentsCount: null,
    activeUsers: null,
    recentActivities: null,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch users count
        const { count: usersCount, error: usersError } = await supabase
          .from("users")
          .select("*", { count: "exact", head: true });

        // Fetch departments count
        const { count: departmentsCount, error: deptsError } = await supabase
          .from("departments")
          .select("*", { count: "exact", head: true });

        // Fetch active users count
        const { count: activeUsers, error: activeError } = await supabase
          .from("users")
          .select("*", { count: "exact", head: true })
          .eq("active", true);

        // Fetch recent activities count
        const { count: recentActivities, error: activitiesError } = await supabase
          .from("activity_logs")
          .select("*", { count: "exact", head: true })
          .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

        if (usersError || deptsError || activeError || activitiesError) {
          throw new Error("Error fetching dashboard stats");
        }

        setStats({
          usersCount: usersCount || 0,
          departmentsCount: departmentsCount || 0,
          activeUsers: activeUsers || 0,
          recentActivities: recentActivities || 0,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard statistics",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [toast]);

  const statsCards: StatsCard[] = [
    {
      title: "Total Users",
      count: stats.usersCount,
      icon: <Users className="h-5 w-5" />,
      description: "Total users in the system",
      link: "/admin/users",
      color: "bg-blue-500",
    },
    {
      title: "Departments",
      count: stats.departmentsCount,
      icon: <Building2 className="h-5 w-5" />,
      description: "Organizational structure",
      link: "/admin/departments",
      color: "bg-green-500",
    },
    {
      title: "Active Users",
      count: stats.activeUsers,
      icon: <Users className="h-5 w-5" />,
      description: "Currently active users",
      link: "/admin/users?status=active",
      color: "bg-purple-500",
    },
    {
      title: "Recent Activity",
      count: stats.recentActivities,
      icon: <FileText className="h-5 w-5" />,
      description: "Activities in the last 7 days",
      link: "/admin/audit",
      color: "bg-amber-500",
    },
  ];

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p className="text-gray-500">
        Manage your organization's users, departments, and permissions.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card, index) => (
          <Link to={card.link} key={index}>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{card.title}</CardTitle>
                  <div className={`p-2 rounded-md text-white ${card.color}`}>
                    {card.icon}
                  </div>
                </div>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <div className="text-3xl font-bold">{card.count}</div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>User Activity</CardTitle>
            <CardDescription>Active vs. Inactive Users</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <Skeleton className="h-4 w-full" />
            ) : (
              <>
                <div className="flex justify-between text-sm">
                  <span>Active: {stats.activeUsers || 0}</span>
                  <span>Total: {stats.usersCount || 0}</span>
                </div>
                <Progress
                  value={
                    stats.usersCount
                      ? (stats.activeUsers || 0) / (stats.usersCount || 1) * 100
                      : 0
                  }
                />
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <Link to="/admin/users/new">
                <div className="p-3 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Add User</span>
                </div>
              </Link>
              <Link to="/admin/departments/new">
                <div className="p-3 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center space-x-2">
                  <Building2 className="h-5 w-5" />
                  <span>Add Department</span>
                </div>
              </Link>
              <Link to="/admin/permissions">
                <div className="p-3 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center space-x-2">
                  <ShieldCheck className="h-5 w-5" />
                  <span>Manage Permissions</span>
                </div>
              </Link>
              <Link to="/admin/audit">
                <div className="p-3 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>View Audit Logs</span>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;

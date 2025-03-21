
import {
  TriangleAlert,
  UserRoundPlus,
  Lock,
  FilePen,
  ArrowRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import HeroCard from "../tenantDashboard/components/HeroCard";
import { QuickIconButton } from "../tenantDashboard/components";
import { InsightLogo } from "../assets/InsightLogo";
import IssuesList from "../components/issues/IssueList";
import useGlobalContext from "../hooks/useGlobalContext";
import { getData } from "../services/api";

type Notifications = {
  date: string;
  message: string;
  type: string;
};

type Insight = {
  title: string;
  description: string;
};

type Issue = {
  id: number;
  title: string;
  status: string;
};

export default function AdminDashboard() {
  const { user } = useGlobalContext();

  const [viewAllInsights, setViewAllInsights] = useState(false);
  const [notifications, setNotifications] = useState<Notifications[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);

  useEffect(() => {
    if (!user?.userId) return;

    const fetchData = async () => {
      try {
        const [notifsData, insightsData, issuesData] = await Promise.all([
          getData<Notifications[]>(`notification/latest?userId=${user.userId}`),
          getData<Insight[]>(`Insights`),
          getData<Issue[]>(`Issues`)
        ]);
        setNotifications(notifsData);
        setInsights(insightsData);
        setIssues(issuesData);
        console.log(notifsData, insightsData, issuesData)
      } catch (error) {
        console.error("Error fetching admin data", error);
      }
    };

    fetchData();
  }, [user?.userId]);

  const renderInsights = insights.map((insight, index) => (
    <div
      key={index}
      className={`bg-white p-4 rounded-2xl flex flex-col whitespace-nowrap ${viewAllInsights ? "w-full" : "w-72"
        }`}
      style={{ boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}
    >
      <p className="font-semibold mb-1">{insight.title}</p>
      <div className="flex flex-col">
        <p className="font-light text-sm line-clamp-2">{insight.description}</p>
        <div className="cursor-pointer text-sm flex items-center space-x-1">
          <p className="text-accent">Show suggestions</p>
          <ArrowRight size={12} color="#C4AEF1" />

        </div>
      </div>
    </div>
  ));

  // Quick actions for your dashboard
  const quickActions = [
    {
      icon: <TriangleAlert size={38} />,
      label: "Report Issues",
      to: "/reportissue",
    },
    { icon: <UserRoundPlus size={38} />, label: "Register Tenant", to: "/" },
    { icon: <Lock size={38} />, label: "Security", to: "/" },
    { icon: <FilePen size={38} />, label: "Manage Lease", to: "/" },
  ];


  return (
    <div className="min-h-screen p-5 md:p-10">
      <div className="space-y-6 mt-14 ">
        <header className="">
          <h1 className="font-normal text-2xl font-heading">
            Welcome, {user?.firstName}
          </h1>
        </header >
        <HeroCard
          title="Notifications"
          count={notifications.length}
          notifications={notifications}
          onActionClick={(index) => console.log("Clicked notification", index)}
          onViewAllClick={() => console.log("View all clicked")}
        />

        <div className="grid grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <QuickIconButton
              key={index}
              icon={action.icon}
              label={action.label}
              to={action.to}
              variant="primary"
            />
          ))}
        </div>

        <div className={viewAllInsights ? "" : "-mr-5 md:-mr-10"}>
          <div className="w-full flex justify-between mb-4 font-heading pr-5">
            <div className="flex space-x-1 items-center">
              <InsightLogo />
              <p className="text-sm font-semibold text-dark-gray">Insights</p>
            </div>
            <p
              className="md:hidden cursor-pointer text-primary font-semibold text-sm"
              onClick={() => setViewAllInsights((prev) => !prev)}
            >
              {viewAllInsights ? "View Less" : "View all"}
            </p>
          </div>

          <div
            className={`flex w-full overflow-scroll space-x-3 py-2 ${viewAllInsights ? "flex-col  space-y-2 " : ""
              }`}
          >
            {renderInsights}
          </div>
        </div>

        <IssuesList />
      </div >
    </div >
  );
}

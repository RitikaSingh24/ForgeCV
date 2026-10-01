import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileText, TrendingUp, Award, Layers, UploadCloud } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import ScoreEvolutionChart from "@/components/dashboard/ScoreEvolutionChart";
import AtsGauge from "@/components/dashboard/AtsGauge";
import ProfileCard from "@/components/dashboard/ProfileCard";
import VersionStack from "@/components/dashboard/VersionStack";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import KeepSharpCard from "@/components/dashboard/KeepSharpCard";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import { useDashboard } from "@/hooks/useDashboard";

export function Dashboard() {
  const { data, isLoading } = useDashboard();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64 rounded-full" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-28 rounded-3xl" />
          <Skeleton className="h-28 rounded-3xl" />
          <Skeleton className="h-28 rounded-3xl" />
          <Skeleton className="h-28 rounded-3xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 rounded-3xl lg:col-span-2" />
          <Skeleton className="h-64 rounded-3xl" />
        </div>
      </div>
    );
  }

  const { stats, scoreEvolution, latestAnalysis, profile, versions, activity } = data || {
    stats: { totalResumes: 0, avgScore: 0, bestScore: 0, improvementDelta: 0 },
    scoreEvolution: [],
    latestAnalysis: null,
    profile: null,
    versions: [],
    activity: [],
  };

  const isNewUser = stats.totalResumes === 0;

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome back, ${profile?.name?.split(" ")[0] || "User"} `}
        description="Here is your ATS resume performance summary and recent version iterations."
        action={
          !isNewUser && (
            <Link to="/resumes">
              <Button variant="primary" size="sm">
                <UploadCloud className="w-4 h-4" /> Upload Resume
              </Button>
            </Link>
          )
        }
      />

      {isNewUser ? (
        <EmptyState
          icon={UploadCloud}
          title="Welcome to ForgeCV!"
          description="Upload your first PDF resume to get an instant ATS score, identify missing keywords, and generate AI bullet point rewrites."
          actionLabel="Upload Your Resume Now →"
          onAction={() => navigate("/resumes")}
        />
      ) : (
        <>
          {/* 4 StatCards Grid (2x2 mobile, 4 across lg) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <StatCard
              label="Total Resumes"
              value={stats.totalResumes}
              icon={FileText}
            />
            <StatCard
              label="Average ATS Score"
              value={stats.avgScore ? `${stats.avgScore}%` : "N/A"}
              icon={TrendingUp}
            />
            <StatCard
              label="Highest ATS Score"
              value={stats.bestScore ? `${stats.bestScore}%` : "N/A"}
              icon={Award}
            />
            <StatCard
              label="Score Improvement"
              value={stats.improvementDelta ? `+${stats.improvementDelta} pts` : "0 pts"}
              delta={stats.improvementDelta}
              icon={Layers}
            />
          </div>

          {/* Chart + Gauge Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Score Evolution Chart */}
            <Card className="p-6 lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-base text-ink">
                    Score Evolution Trend
                  </h3>
                  <p className="text-xs text-ink-muted">ATS score progression across resume versions</p>
                </div>
              </div>
              <ScoreEvolutionChart data={scoreEvolution} />
            </Card>

            {/* Latest ATS Score Gauge */}
            <Card
              onClick={() => {
                if (latestAnalysis?.resumeId) {
                  navigate(`/resumes/${latestAnalysis.resumeId}`);
                } else {
                  navigate("/resumes");
                }
              }}
              className="p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-accent/40 transition-all group"
            >
              <h3 className="font-display font-bold text-base text-ink mb-2 group-hover:text-accent transition-colors">
                Latest ATS Score →
              </h3>
              <AtsGauge score={latestAnalysis?.atsScore || 0} size="md" />
              {latestAnalysis?.summary && (
                <p className="text-xs text-ink-muted mt-3 line-clamp-2 leading-relaxed">
                  {latestAnalysis.summary}
                </p>
              )}
            </Card>
          </div>

          {/* Responsive Grid (1 col mobile, 2 tablet, 3 desktop) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProfileCard profile={profile} />
            <VersionStack versions={versions} />
            <div className="space-y-6">
              <ActivityFeed events={activity} />
              <KeepSharpCard />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;

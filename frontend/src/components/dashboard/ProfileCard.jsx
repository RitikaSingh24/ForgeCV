import React from "react";
import { Link } from "react-router-dom";
import { Settings, ShieldCheck } from "lucide-react";
import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";

export function ProfileCard({ profile }) {
  if (!profile) return null;

  return (
    <Card className="p-6">
      <div className="flex items-center gap-4 mb-4">
        <Avatar name={profile.name} size="lg" />
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-base text-ink truncate">
            {profile.name}
          </h3>
          <p className="text-xs text-ink-muted truncate">{profile.email}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border/50 text-xs">
        <Badge variant="success" icon={ShieldCheck}>
          Verified Account
        </Badge>
        <Link
          to="/settings"
          className="inline-flex items-center gap-1 font-semibold text-accent hover:text-accent-strong"
        >
          <Settings className="w-3.5 h-3.5" /> Edit Profile
        </Link>
      </div>
    </Card>
  );
}

export default ProfileCard;

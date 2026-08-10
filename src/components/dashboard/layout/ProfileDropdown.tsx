import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { UserResponseDto } from "@/types/api";
import { LogOut, Settings, User } from "lucide-react";
import Link from "next/link";

interface ProfileDropdownProps {
  user: UserResponseDto;
  handleLogout: () => void;
  isPending: boolean;
  expanded?: boolean;
}

export function ProfileDropdown({
  user,
  handleLogout,
  isPending,
  expanded: expandedProp,
}: ProfileDropdownProps) {
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed" && !isMobile;
  const expanded = expandedProp ?? !isCollapsed;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          tooltip="User Settings"
          className={cn(
            "relative flex items-center transition-all cursor-pointer",
            expanded
              ? "w-full px-3 py-6 justify-start gap-3 rounded-lg"
              : "h-8 w-8 justify-center rounded-full p-0",
          )}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted border border-border">
            {user.firstName && user.lastName ? (
              <span className="text-xs font-bold uppercase">
                {user.firstName.charAt(0) + user.lastName.charAt(0)}
              </span>
            ) : (
              <User className="h-5 w-5" />
            )}
          </div>
          {expanded && (
            <div className="flex flex-col text-start overflow-hidden">
              <p className="text-sm font-medium leading-none truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs leading-none text-muted-foreground truncate mt-1">
                {user.email}
              </p>
            </div>
          )}
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.firstName + " " + user.lastName}
            </p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard/profile" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600 cursor-pointer"
          onClick={handleLogout}
          disabled={isPending}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isPending ? "Logging out..." : "Log out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

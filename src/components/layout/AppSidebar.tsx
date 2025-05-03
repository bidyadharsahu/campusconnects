import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '@/context/auth/auth-context';
import {
  Calculator,
  Calendar,
  GraduationCap,
  Home,
  Bus,
  Bell,
  Users,
  Book,
  LogOut,
  StickyNote,
  Settings,
  User,
  BookOpen
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

export function AppSidebar() {
  const { user, profile, logout, isAdmin } = useAuth();
  
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="text-campus-purple h-6 w-6" />
          <Link to="/dashboard" className="text-xl font-bold text-white">
            Campus<span className="text-campus-purple">Connect</span>
          </Link>
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          {isAdmin ? (
            <span className="text-campus-purple">Admin Account</span>
          ) : (
            <>
              {profile?.name} • Semester {profile?.semester || 'N/A'}
              {profile?.department && <> • {profile?.department}</>}
            </>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/dashboard" className={({isActive}) => isActive ? "text-campus-purple" : ""}>
                    <Home className="w-5 h-5" />
                    <span>Dashboard</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/profile" className={({isActive}) => isActive ? "text-campus-purple" : ""}>
                    <User className="w-5 h-5" />
                    <span>Profile</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              {isAdmin ? (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/admin" className={({isActive}) => isActive ? "text-campus-purple" : ""}>
                        <Settings className="w-5 h-5" />
                        <span>Admin Dashboard</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/admin/courses" className={({isActive}) => isActive ? "text-campus-purple" : ""}>
                        <BookOpen className="w-5 h-5" />
                        <span>Manage Courses</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              ) : (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/calculator" className={({isActive}) => isActive ? "text-campus-purple" : ""}>
                        <Calculator className="w-5 h-5" />
                        <span className="text-sm">SGPA/CGPA Calculator</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/exams" className={({isActive}) => isActive ? "text-campus-purple" : ""}>
                        <Calendar className="w-5 h-5" />
                        <span>Exam Schedule</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/classes" className={({isActive}) => isActive ? "text-campus-purple" : ""}>
                        <Book className="w-5 h-5" />
                        <span>Class Schedule</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/notes" className={({isActive}) => isActive ? "text-campus-purple" : ""}>
                        <StickyNote className="w-5 h-5" />
                        <span>My Notes</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>College Resources</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/teachers" className={({isActive}) => isActive ? "text-campus-purple" : ""}>
                    <Users className="w-5 h-5" />
                    <span>Teachers</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/bus-schedule" className={({isActive}) => isActive ? "text-campus-purple" : ""}>
                    <Bus className="w-5 h-5" />
                    <span>Bus Schedule</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/notifications" className={({isActive}) => isActive ? "text-campus-purple" : ""}>
                    <Bell className="w-5 h-5" />
                    <span>Notifications</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <Button 
          variant="ghost" 
          className="w-full flex items-center justify-start text-muted-foreground hover:text-white"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

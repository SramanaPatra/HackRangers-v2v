import { NavLink } from "react-router-dom";
import BreathingBloom from "./BreathingBloom.jsx";
import { Home, BookHeart, Wind, MessagesSquare, BarChart3, ClipboardList, Sparkles, User } from "lucide-react";

const links = [
  { to: "/", label: "Home", icon: Home },
  { to: "/journal", label: "Journal", icon: BookHeart },
  { to: "/exercises", label: "Exercises", icon: Wind },
  { to: "/circles", label: "Circles", icon: MessagesSquare },
  { to: "/dashboard", label: "Trends", icon: BarChart3 },
  { to: "/quiz", label: "Check-in", icon: ClipboardList },
  { to: "/companion", label: "Companion", icon: Sparkles },
  { to: "/profile", label: "Profile", icon: User },
];

export default function Navigation() {
  return (
    <>
      <nav className="hidden md:flex md:flex-col md:w-60 md:shrink-0 md:h-screen md:sticky md:top-0 md:p-6 md:border-r md:border-ink/10 bg-petal-soft">
        <div className="flex items-center gap-2 mb-10">
          <BreathingBloom size="sm" />
          <span className="font-display text-lg font-medium text-ink">MindEase</span>
        </div>
        <ul className="flex flex-col gap-1">
          {links.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-full font-body text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blossom text-white shadow-lift"
                      : "text-ink/70 hover:bg-ink/5"
                  }`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-cream border-t border-ink/10 flex justify-around py-2 z-50 overflow-x-auto">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-2 py-1 text-[10px] font-body shrink-0 ${
                isActive ? "text-blossom" : "text-ink/50"
              }`
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
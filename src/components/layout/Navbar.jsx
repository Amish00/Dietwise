import { NavLink } from 'react-router-dom'
import { LayoutDashboard, UtensilsCrossed, ChefHat, CalendarDays, Dumbbell, User, Settings } from 'lucide-react'
import { useDiet } from '../../context/DietContext'

const NAV = [
  { to: '/',         icon: LayoutDashboard, label: 'Dashboard'  },
  { to: '/logger',   icon: UtensilsCrossed, label: 'Meal Log'   },
  { to: '/recipes',  icon: ChefHat,         label: 'AI Recipes' },
  { to: '/plans',    icon: CalendarDays,    label: 'Meal Plans' },
  { to: '/exercise', icon: Dumbbell,        label: 'Exercise'   },
  { to: '/profile',  icon: User,            label: 'Profile'    },
  { to: '/settings', icon: Settings,        label: 'Settings'   },
]

const Navbar = () => {
  const { state } = useDiet()
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 flex items-center gap-1 h-14">
        <NavLink to="/" className="flex items-center gap-2 mr-5 shrink-0">
          <span className="text-xl">🥗</span>
          <span className="font-black text-lg text-gray-900 tracking-tight">DietWise</span>
        </NavLink>
        <nav className="flex items-center gap-0.5 flex-1 overflow-x-auto">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap
                ${isActive ? 'bg-indigo-50 text-primary' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}>
              <Icon size={14} strokeWidth={2.5} />{label}
            </NavLink>
          ))}
        </nav>
        {state.profile && (
          <div className="text-right hidden md:block ml-3 shrink-0">
            {state.profile.name && <p className="text-xs font-bold text-gray-800">{state.profile.name}</p>}
            <p className="text-xs text-primary font-semibold">{state.profile.dailyCalTarget} kcal/day</p>
          </div>
        )}
      </div>
    </header>
  )
}
export default Navbar

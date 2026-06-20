import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard    from './pages/Dashboard'
import MealLogger   from './pages/MealLogger'
import RecipeFinder from './pages/RecipeFinder'
import MealPlans    from './pages/MealPlans'
import Exercise     from './pages/Exercise'
import Profile      from './pages/Profile'
import Settings     from './pages/Settings'

const App = () => (
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index           element={<Dashboard />}    />
      <Route path="logger"   element={<MealLogger />}   />
      <Route path="recipes"  element={<RecipeFinder />} />
      <Route path="plans"    element={<MealPlans />}    />
      <Route path="exercise" element={<Exercise />}     />
      <Route path="profile"  element={<Profile />}      />
      <Route path="settings" element={<Settings />}     />
      <Route path="*"        element={<Navigate to="/" replace />} />
    </Route>
  </Routes>
)

export default App

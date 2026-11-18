import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SafetyLayout } from '../layouts/SafetyLayout'
import { CreateAccountView } from '../views/CreateAccountView'
import { DashboardView } from '../views/DashboardView'
import { DirectoryView } from '../views/DirectoryView'
import { EmergencyView } from '../views/EmergencyView'
import { HomeView } from '../views/HomeView'
import { OtpVerificationView } from '../views/OtpVerificationView'
import { PlaceholderView } from '../views/PlaceholderView'
import { ProfileEditView } from '../views/ProfileEditView'
import { VerifyView } from '../views/VerifyView'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SafetyLayout />}>
          <Route index element={<HomeView />} />
          <Route path="register" element={<CreateAccountView />} />
          <Route path="login" element={<OtpVerificationView />} />
          <Route path="otp" element={<OtpVerificationView />} />
          <Route path="verify" element={<VerifyView />} />
          <Route path="directory" element={<DirectoryView />} />
          <Route path="dashboard" element={<DashboardView />} />
          <Route path="profile/edit" element={<ProfileEditView />} />
          <Route path="emergency" element={<EmergencyView />} />
          <Route
            path="assistant"
            element={<PlaceholderView title="AI legal assistant" sprint="Sprint 4" />}
          />
          <Route path="community" element={<PlaceholderView title="Community" sprint="Sprint 3" />} />
          <Route path="sos" element={<PlaceholderView title="SOS alerts" sprint="Sprint 3" />} />
          <Route path="vault" element={<PlaceholderView title="Evidence vault" sprint="Sprint 3" />} />
          <Route
            path="threads/:id"
            element={<PlaceholderView title="Secure messaging" sprint="Sprint 2" />}
          />
          <Route path="call/:meetingId" element={<PlaceholderView title="Video call room" sprint="Sprint 2" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
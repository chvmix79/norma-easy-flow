import { useAppStore } from "@/lib/store";
import LoginPage from "./LoginPage";
import AppLayout from "@/components/AppLayout";
import Dashboard from "./Dashboard";
import CompanyRegistration from "./CompanyRegistration";
import DiagnosisModule from "./DiagnosisModule";
import CompliancePlan from "./CompliancePlan";
import EvidenceManagement from "./EvidenceManagement";
import AlertsPanel from "./AlertsPanel";
import AIAssistant from "./AIAssistant";
import AuditReports from "./AuditReports";

const MainApp = () => {
  const { isAuthenticated, currentPage } = useAppStore();

  if (!isAuthenticated) return <LoginPage />;

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":          return <Dashboard />;
      case "company":            return <CompanyRegistration />;
      case "diagnosis":          return <DiagnosisModule />;
      case "compliance-plan":    return <CompliancePlan />;
      case "evidence":           return <EvidenceManagement />;
      case "alerts":             return <AlertsPanel />;
      case "ai-assistant":       return <AIAssistant />;
      case "reports":            return <AuditReports />;
      default:                   return <Dashboard />;
    }
  };

  return <AppLayout>{renderPage()}</AppLayout>;
};

export default MainApp;

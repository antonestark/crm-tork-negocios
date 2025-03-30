
import { BaseLayout } from "@/components/layout/BaseLayout";
import { ServicesNav } from "@/components/services/ServicesNav";
import { ServiceAreas } from "@/components/services/ServiceAreas";
import { AreasPageHeader } from "@/components/services/areas/AreasPageHeader";
import { AuthenticationWarning } from "@/components/services/areas/AuthenticationWarning";
import { useAreasPage } from "@/hooks/use-areas-page";

const AreasPage = () => {
  const {
    isSubmitting,
    isAuthenticated,
    authLoading,
    areas,
    loading,
    error,
    refresh,
    userAuthenticated,
    handleCreateArea
  } = useAreasPage();

  // Show authentication warning if not authenticated
  if (!authLoading && !isAuthenticated) {
    return (
      <BaseLayout>
        <div className="py-6 px-4 max-w-7xl mx-auto">
          <ServicesNav />
          <AuthenticationWarning />
        </div>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout>
      <div className="py-6 px-4 max-w-7xl mx-auto">
        <div className="animate-fade-in">
          <ServicesNav />
        </div>
        
        <div className="animate-fade-in delay-100">
          <AreasPageHeader 
            onCreateArea={handleCreateArea}
            isSubmitting={isSubmitting}
            isAuthenticated={userAuthenticated}
          />
        </div>

        <div className="mt-6 bg-slate-900/50 backdrop-blur-md border border-blue-900/40 rounded-lg p-6 animate-fade-in delay-200">
          <ServiceAreas 
            areas={areas} 
            loading={loading || authLoading} 
            error={error} 
            onAreaUpdated={refresh}
          />
        </div>
      </div>
    </BaseLayout>
  );
};

export default AreasPage;

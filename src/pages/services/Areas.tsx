
import { Header } from "@/components/layout/Header";
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
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto py-6 px-4">
          <ServicesNav />
          <AuthenticationWarning />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <ServicesNav />
        <AreasPageHeader 
          onCreateArea={handleCreateArea}
          isSubmitting={isSubmitting}
          isAuthenticated={userAuthenticated}
        />

        <ServiceAreas 
          areas={areas} 
          loading={loading || authLoading} 
          error={error} 
          onAreaUpdated={refresh}
        />
      </main>
    </div>
  );
};

export default AreasPage;

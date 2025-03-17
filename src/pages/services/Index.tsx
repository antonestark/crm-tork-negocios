
// Add proper type assertion for RPC calls
const fetchServiceStats = async () => {
  try {
    setStatsLoading(true);
    
    // Use proper type assertion for RPC calls
    const { data, error } = await supabase
      .rpc('get_service_statistics' as any) as {
        data: ServiceStatisticsResult | null, 
        error: any
      };
    
    if (error) throw error;
    
    setStats(data);
  } catch (err) {
    console.error('Error fetching service statistics:', err);
    toast.error('Erro ao carregar estatísticas de serviços');
  } finally {
    setStatsLoading(false);
  }
};

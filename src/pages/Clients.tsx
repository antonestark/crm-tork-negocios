
import { ClientsTable } from "@/components/clients/ClientsTable";
import { Header } from "@/components/layout/Header";

const Clients = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Clientes</h1>
        </div>
        <ClientsTable />
      </main>
    </div>
  );
};

export default Clients;

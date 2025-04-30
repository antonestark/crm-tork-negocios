import React, { useState } from "react"; // Import React
import { Button } from "@/components/ui/button";
import { Plus, Lock } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AreaSubmitData } from "./hooks/useAreaForm";
import { DialogHeader } from "./dialog/DialogHeader";
import { DialogContentManager } from "./dialog/DialogContentManager";

interface CreateAreaDialogProps {
  onCreateArea: (data: AreaSubmitData) => Promise<void>;
  isSubmitting: boolean;
  isAuthenticated: boolean;
}

// Helper Components
// Apply React.forwardRef to handle the 'ref' from DialogTrigger
const DialogTriggerButton = React.forwardRef<HTMLButtonElement, { isAuthenticated: boolean }>(
  ({ isAuthenticated }, ref) => {
    return (
      <Button
        ref={ref} // Pass the ref to the actual button element
        disabled={!isAuthenticated}
        onClick={() => {
          if (!isAuthenticated) {
            // We handle the toast here and prevent dialog opening
            import('sonner').then(({ toast }) => {
              toast.error("Você precisa estar autenticado para criar uma área");
            });
          }
        }}
      >
        {isAuthenticated ? (
          <>
            <Plus className="mr-2 h-4 w-4" />
            Nova Área
          </>
        ) : (
          <>
            <Lock className="mr-2 h-4 w-4" />
            Login Necessário
          </>
        )}
      </Button>
    );
  }
);
// Add display name for better debugging
DialogTriggerButton.displayName = "DialogTriggerButton";


const ErrorMessage = ({ error }: { error: string }) => (
  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-4">
    {error}
  </div>
);


export const CreateAreaDialog = ({
  onCreateArea,
  isSubmitting,
  isAuthenticated
}: CreateAreaDialogProps) => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTypeManager, setShowTypeManager] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    // Prevent opening if not authenticated (handled by button, but good fallback)
    if (newOpen && !isAuthenticated) {
      return;
    }

    setOpen(newOpen);
    if (!newOpen) {
      setError(null); // Clear error when dialog is closed
      setShowTypeManager(false); // Reset to form view when closing
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {/* Use the forwardRef'd button */}
        <DialogTriggerButton isAuthenticated={isAuthenticated} />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader
          showTypeManager={showTypeManager}
          setShowTypeManager={setShowTypeManager}
        />

        {error && <ErrorMessage error={error} />}

        <DialogContentManager
          showTypeManager={showTypeManager}
          onCreateArea={onCreateArea}
          onCancel={() => setOpen(false)}
          isSubmitting={isSubmitting}
          isAuthenticated={isAuthenticated}
          setError={setError}
          setOpen={setOpen}
        />
      </DialogContent>
    </Dialog>
  );
};

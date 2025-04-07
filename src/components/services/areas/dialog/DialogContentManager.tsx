
import { Dispatch, SetStateAction } from "react";
import { CreateAreaForm } from "../CreateAreaForm";
import { AreaTypesManager } from "../AreaTypesManager";
import { AreaSubmitData } from "../hooks/useAreaForm";

interface DialogContentManagerProps {
  showTypeManager: boolean;
  onCreateArea: (data: AreaSubmitData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  isAuthenticated: boolean;
  setError: Dispatch<SetStateAction<string | null>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const DialogContentManager = ({
  showTypeManager,
  onCreateArea,
  onCancel,
  isSubmitting,
  isAuthenticated,
  setError,
  setOpen
}: DialogContentManagerProps) => {
  
  const handleSubmit = async (values: AreaSubmitData) => {
    try {
      if (!isAuthenticated) {
        setError("Você precisa estar autenticado para criar uma área.");
        return;
      }
      
      setError(null);
      console.log("Submitting form with values:", values);
      await onCreateArea(values);
      
      // Only close the dialog if submission was successful
      setOpen(false);
    } catch (err) {
      console.error("Error in dialog submit:", err);
      
      if (err instanceof Error) {
        if (err.message.includes("auth") || 
            err.message.includes("permission") || 
            err.message.includes("session") ||
            err.message.includes("token") ||
            err.message.includes("JWT")) {
          setError("Erro de autenticação. Por favor, faça login novamente.");
        } else {
          setError(err.message);
        }
      } else {
        setError("Erro ao criar área");
      }
      // Keep the dialog open so the user can see the error
    }
  };

  if (showTypeManager) {
    return <AreaTypesManager />;
  }
  
  return (
    <CreateAreaForm 
      onSubmit={handleSubmit} 
      onCancel={onCancel} 
      isSubmitting={isSubmitting} 
    />
  );
};

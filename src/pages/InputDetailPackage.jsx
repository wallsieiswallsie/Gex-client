import { useInputDetailPackage } from "../hooks/useInputDetailPackage";
import InputDetailPackageForm from "../components/InputDetailPackageForm";

function InputDetailPackage() {
  const { formData, errors, handleChange, handleSave, handleCancel } = useInputDetailPackage();

  return (
    <InputDetailPackageForm
      formData={formData}
      errors={errors}
      handleChange={handleChange}
      handleSave={handleSave}
      handleCancel={handleCancel}
    />
  );
}

export default InputDetailPackage;
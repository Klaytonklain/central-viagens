import { PackageForm } from "@/components/forms/PackageForm";

export default function NewPackagePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Novo Pacote</h1>
      <PackageForm />
    </div>
  );
}

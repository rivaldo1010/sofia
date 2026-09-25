export function AdminPlaceholder({ title }: { title: string }) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-black tracking-tight mb-2">{title}</h1>
      <p className="text-neutral-500">Próximamente en la siguiente entrega</p>
    </div>
  );
}
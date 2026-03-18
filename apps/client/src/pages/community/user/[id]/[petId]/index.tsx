interface PetProfilePageProps {
  params: Promise<{ id: string; petId: string }>;
}

export default async function PetProfilePage({ params }: PetProfilePageProps) {
  const { id, petId } = await params;
  const userId = Number(id);
  const petIdNum = Number(petId);

  return (
    <div>
      {userId} {petIdNum}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import EditPetForm from '@/features/pet/edit/ui/edit-pet-form';
import { PetDetail, PetProfileCard } from '@/features/pet/detail/ui';

export default function MyPetPage() {
  const params = useParams();
  const id = Number(params!.id);

  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="flex flex-col pb-8">
      <PetProfileCard id={id} isEditing={isEditing} onToggle={() => setIsEditing(v => !v)} />

      {isEditing ? (
        <EditPetForm
          id={id}
          onSuccess={() => setIsEditing(false)}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <PetDetail id={id} />
      )}
    </div>
  );
}

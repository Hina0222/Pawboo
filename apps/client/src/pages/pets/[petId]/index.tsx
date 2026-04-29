'use client';

import { useParams } from 'next/navigation';
import { Header } from '@/widgets/header';
import { CalendarView } from '@/features/calendar/ui';
import PetCalendarHeader from './ui/pet-calendar-header';

export default function PetCalendarPage() {
  const params = useParams();
  const petId = Number(params!.petId);

  return (
    <>
      <Header>
        <Header.Left>
          <Header.Back />
        </Header.Left>
        <Header.Center>
          <PetCalendarHeader petId={petId} />
        </Header.Center>
      </Header>
      <CalendarView petId={petId} />
    </>
  );
}

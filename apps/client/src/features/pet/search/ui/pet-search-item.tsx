import LogoIcon from '@/shared/assets/icons/LogoIcon.svg';
import { Link } from '@/app/i18n/navigation';

interface PetSearchItemProps {
  petId: number;
  name: string;
  imageUrl: string | null;
}

export function PetSearchItem({ petId, name, imageUrl }: PetSearchItemProps) {
  return (
    <li>
      <Link href={`/pets/${petId}`} className="flex items-center gap-4">
        <div className="h-[44px] w-[55px] overflow-hidden rounded-full border border-[#E1E1E3]">
          {imageUrl ? (
            <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#FADF78]">
              <LogoIcon className="h-[26px] w-[26px] text-[#C59D07]" />
            </div>
          )}
        </div>
        <span className="font-semibold text-[#E1E1E3]">{name}</span>
      </Link>
    </li>
  );
}

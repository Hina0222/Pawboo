interface TitleHeaderProps {
  title: string;
}

export function TitleHeader({ title }: TitleHeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-primary/10 bg-background/80 px-5 shadow-sm backdrop-blur-md">
      <h1 className="text-xl font-bold text-foreground">{title}</h1>
    </header>
  );
}

function MissionCardError() {
  return (
    <div className="mx-4 mt-4 flex flex-col items-center justify-center rounded-2xl bg-card py-12 text-muted-foreground shadow-sm">
      <p className="text-sm">미션을 불러오는 데 실패했습니다.</p>
    </div>
  );
}

export default MissionCardError;

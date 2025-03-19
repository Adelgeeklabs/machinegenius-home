export default function Loading() {
  return (
    <section className="h-full w-full flex flex-col items-center justify-center bg-[--dark] fixed inset-0 z-[99999999999999]">
      <img src="/assets/logo white.svg" className="w-[80px] animate-pulse" />
    </section>
  );
}

export function useStaggerReveal(itemCount: number): string[] {
  const classNames: string[] = [];
  
  for (let i = 0; i < itemCount; i++) {
    classNames.push('opacity-0 animate-fade-up');
  }
  
  return classNames;
}

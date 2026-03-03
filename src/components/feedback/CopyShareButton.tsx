'use client';

import { Button } from '@/components/ui/button';

interface CopyShareButtonProps {
  shareUrl: string;
}

export function CopyShareButton({ shareUrl }: CopyShareButtonProps) {
  function handleCopy() {
    navigator.clipboard.writeText(shareUrl);
  }

  return (
    <Button onClick={handleCopy}>
      Copy Share Link
    </Button>
  );
}

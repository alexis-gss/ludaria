"use client";

import { MoveLeftIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export enum DeepPageEnum {
  LEVELS = "levels",
  DIFFICULTIES = "difficulties",
}

interface BtnBackToProps {
  deepPage?: DeepPageEnum;
  slug?: string;
}

export default function BtnBackTo({ deepPage, slug }: BtnBackToProps) {
  const router = useRouter();
  const { difficulty } = useParams();
  let trans: string;

  if (deepPage === DeepPageEnum.LEVELS) {
    trans = "Back to levels";
  } else if (deepPage === DeepPageEnum.DIFFICULTIES) {
    trans = "Back to difficulties";
  } else {
    trans = "Back to dashboard";
  }

  const handleClick = function () {
    if (deepPage === DeepPageEnum.LEVELS) {
      router.push(`/games/${slug}/${difficulty}`);
    } else if (deepPage === DeepPageEnum.DIFFICULTIES) {
      router.push(`/games/${slug}`);
    } else {
      router.push("/dashboard");
    }
  };
  return (
    <Button
      type="button"
      variant="ghost"
      className="cursor-pointer"
      onClick={handleClick}
    >
      <MoveLeftIcon /> {trans}
    </Button>
  );
}

import Button from "@/Components/foodimus/Button";
import TipComponent, { TipContainer } from "@/Components/foodimus/Tip";
import TipContent from "@/Components/foodimus/TipContent";
import { TipProps } from "@/Types/page-data";
import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import useRoute from "@/Hooks/useRoute";

type Props = TipProps & {
  orientation?: "auto" | "vertical";
  avatarSide?: "left" | "right";
  contained?: boolean;
};

export const Tip = (tip: Props) => {
  const [tipShown, setTipShown] = useState(true);
  const { route } = useRoute();
  const avatarSide = tip.avatarSide || "left";
  return (
    <TipContainer contained={tip.contained} open={tipShown}>
      <TipComponent
        backgroundColor="purple"
        avatarColor="yellow"
        ambassadorAvatar={tip.ambassador?.avatar?.src}
        flipAvatar={tip.ambassador?.avatar?.orientation === avatarSide}
        avatarSide={avatarSide}
        closeable
        onClose={() => setTipShown(false)}
      >
        <TipContent
          orientation={tip.orientation}
          ambassadorName={tip.ambassador?.name}
          ambassadorTitle={tip.ambassadorTitle}
          text={tip.text}
          button={
            tip.button && (
              <Button
                color="green"
                onClick={() => {
                  if (tip.buttonTarget === undefined) return;
                  Inertia.get(route(tip.buttonTarget, tip.buttonTargetParam));
                }}
              >
                {tip.button}
              </Button>
            )
          }
        />
      </TipComponent>
    </TipContainer>
  );
};

export default Tip;

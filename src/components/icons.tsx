import { Gi3DGlasses, GiAk47U, GiBurningSkull, GiClover, GiDualityMask } from "react-icons/gi";

interface IconMap {
  [index: string]: JSX.Element
}


const iconMap: IconMap = {
  "ak47": <GiAk47U />,
  "glasses": <Gi3DGlasses />,
  "burningSkull": <GiBurningSkull />,
  "clover": <GiClover />,
  "mask": <GiDualityMask />
}

export default iconMap

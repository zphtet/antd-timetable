import { BaseEdge, getStraightPath } from "@xyflow/react"



const CustomEdge = ({id ,sourceX,sourceY , targetX , targetY})=>{
      const [edgePath] = getStraightPath({
         sourceX,
         sourceY,
         targetX,
         targetY,
      })

      return <>
         <BaseEdge id={id} path={edgePath} />
        </>
}

export default CustomEdge;
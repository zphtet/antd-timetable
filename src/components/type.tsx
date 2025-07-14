import {Select} from "antd"
import type {GetRef}  from 'antd'



export type SelectTypeRef = GetRef<typeof Select>

// const SelectType = forwardRef<SelectTypeRef, SelectProps>((props, ref) => {
//   return <Select ref={ref} {...props} />
// })

// export default SelectType
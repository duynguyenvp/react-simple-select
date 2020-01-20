# reacthook-simple-select

#### Installation:
```sh
$ npm install --save reacthook-simple-select
```
#### Options
| option | Description | Example |  
|-----------|:----------------------:|-----------------------:|  
| selected  | default selected value | ['option1', 'option2'] |
| options | data | [{ name: 'Option 1', value: 'option1'},...]|
| filter | Enable filtering | `default:` false|
| multiple | Enable multiple choice | `default:` false|
| placeholder | Placeholder of select | `default:` 'Chọn'|
| placeholderSearch | Placeholder of filter | `default:` 'Tìm kiếm ...'|
| small | size small | `default:` fasle|

#### Usage:
```js
import React, { useEffect, useState, useRef } from 'react';
import Select from 'react-simple-select'
export default function Component() {
    const [selected, setSelected] = useState(['2020']);
    render (<Select options={[{name: '2020', value: '2020'},{name: '2019', value: '2019'}]}
                placeholder="--Years--"
                selected={selected}
                multiple={false}
                filter={true}
                placeholderSearch="Search ..."
                onChange={value => {console.log(value)} />)
}
```

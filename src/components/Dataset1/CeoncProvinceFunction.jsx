import React, { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

import { dynamicGraph } from '../../utils/dynamicGraph';
import { color } from '../color';
import { host } from '../../utils';

const CeoncProvinceFunction = ({ graphWidth, data4, dataType4 }) => {
  const [data, setData] = useState([])

  const requestOptions = {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
    },
    mode: 'cors'
  }

  const provinceData = data?.map(item => item?.data)
  const provinceName = [
    {
      "name": "Province 1",
      "index": 4
    },
    {
      "name": "Province 2",
      "index": 1
    },
    {
      "name": "Bagmati Province",
      "index": 0
    },
    {
      "name": "Gandaki Province",
      "index": 5
    },
    {
      "name": "Lumbini Province",
      "index": 2
    },
    {
      "name": "Karnali Province",
      "index": 6
    },
    {
      "name": "Sudurpashchim Province",
      "index": 3
    },
  ]


  const provinceFacility = provinceName?.map((item) => {
    const name = item.name;
    const provinceFacility = (provinceData[item.index]?.map(item => item?.data).flat())
    const healthFacility=new Set(provinceFacility?.map(item=>item?.data).flat()).size
    return { name, "Health Facility Count": healthFacility}
  })

  useEffect(() => {
    let dismount = false

    const getRequest = async () => {
      let res = await fetch(`${host}/palikaprovince`, requestOptions)
      let data = await res.json()
      if (!dismount) {
        if (res.ok) {
          setData(data)
        }
      }
    }

    getRequest()
    return () => {
      dismount = true
    }
  }, [dataType4])

  return (
    <div>
      <div>
        <p className="text-center header-color">Total sum of distinct name of facility of the different province</p>
      </div>
      <BarChart
        width={dynamicGraph(graphWidth)}
        height={500}
        data={provinceFacility}
      >
        <CartesianGrid strokeDasharray="9 9" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Health Facility Count" stackId="a" fill={color.color_1} />
      </BarChart>
    </div>
  )
}

export default CeoncProvinceFunction
import React, { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { dynamicGraph } from '../../utils/dynamicGraph';
import { color } from '../color';
import { host } from '../../utils';
import Select from 'react-select';

const CeoncProvinceFacilityListFunction = ({ graphWidth, dataType5, }) => {
    const [data, setData] = useState([])
    const [value2, setValue2] = useState([])
    const [allFacility, setAllFacility] = useState([])
    const [hfaility, setHfaility] = useState([])

    const requestOptions = {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
        },
        mode: 'cors'
    }

    const provinceData = data?.map(item => item?.data)
    const provinceList = [

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
        {
            "name": "All",
            "index": 7
        },
    ]
    const provinceList2 = [
        {
            "name": "All",
            "index": 7
        },
        {
            "name": "Province 1",
            "index": 0
        },
        {
            "name": "Province 2",
            "index": 1
        },
        {
            "name": "Bagmati Province",
            "index": 2
        },
        {
            "name": "Gandaki Province",
            "index": 3
        },
        {
            "name": "Lumbini Province",
            "index": 4
        },
        {
            "name": "Karnali Province",
            "index": 5
        },
        {
            "name": "Sudurpashchim Province",
            "index": 6
        },

    ]

    const provinceDistrict = provinceList?.map((item) => {
        const name = item.name;
        const provinceDistrict = (new Set(provinceData[item.index]?.map(item => item?.data).flat()))
        return { name, "provinceDistrict": provinceDistrict }
    })

    const provinceMuncipalityList = provinceDistrict?.map((item) => {
        const provinceName = item.name;
        const provinceMuncipalityList = Array.from(item.provinceDistrict).map((item) => {
            const HealthName = item.data.map(item => item?.name);
            return { provinceName, HealthName }
        })
        return { provinceName, "provinceMuncipalityList": provinceMuncipalityList }
    })
    const provinceMuncipalityList1 = provinceMuncipalityList?.map((item) => item?.provinceMuncipalityList)

    const provinceMuncipalityList2 = (index) => {
        if (index === 7) {
            const listOfAllFacility = (provinceMuncipalityList1?.flat().map(item => item?.HealthName).flat()).sort()
            const listOfAllFacility1 = listOfAllFacility.map((item) => {
                return { "name": item, "Health Facility": 1 }
            })
            setHfaility(listOfAllFacility1)
            setAllFacility(listOfAllFacility)

        }
        if (index === 0 || index === 1 || index === 2 || index === 3 || index === 4 || index === 5 || index === 6) {
            const hName = provinceMuncipalityList1[index].flat().map((item) => {
                return (item?.HealthName)
            }).flat();
            const hName2 = hName.map((item) => {
                return { "name": item, "Health Facility": 1 }
            });
            // console.log(hName2, "hName2");
            setHfaility(hName2)
            setAllFacility(hName.sort())
        }
    }

    let defaultFacility1 = {
        value: "All",
        label: "All",
        index: 7,
    }
    const listOfAllHeathFacility = (provinceMuncipalityList1?.flat().map(item => item?.HealthName).flat()).sort().map((item) => {
        return { "name": item, "Health Facility": 1 }
    })
    // console.log(listOfAllHeathFacility, "listOfAllHeathFacility");

    const defaultHname = provinceMuncipalityList1[2].flat().map((item) => {
        return (item?.HealthName)
    }).flat().map((item) => {
        return { "name": item, "Health Facility": 1 }
    });

    // console.log(defaultHname, "defaultHname");



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
    }, [dataType5])

    return (
        <div>
            <div>
                <p className="text-center header-color">List of health facility of different province</p>
            </div>
            <div style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                width: "100%",
            }}>
                <div className="box">
                    Province
                    <Select
                        className="select-dropdown"
                        options={provinceList2.map(item => ({ value: item.name, label: item.name, index: item.index }))}
                        value1={defaultFacility1}
                        onChange={(option) => {
                            // setValue1(option)
                            provinceMuncipalityList2(option.index)
                        }}
                    />
                </div>
                <div className="box">
                    Name of Health facility
                    <Select
                        className="select-dropdown"
                        options={allFacility.map(item => ({ value: item, label: item }))}
                        value={value2}
                        defaultValue={listOfAllHeathFacility}
                        onChange={(option) => {
                            setHfaility([{ "name": option.value, "Health Facility": 1 }])
                            setValue2(option)
                        }}
                    />
                </div></div>

            <BarChart
                width={dynamicGraph(graphWidth)}
                height={500}
                data={hfaility.length > 0 ? hfaility : defaultHname}
            >
                <CartesianGrid strokeDasharray="9 9" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Health Facility" stackId="a" fill={color.color_2} />
            </BarChart>
        </div>
    )
}

export default CeoncProvinceFacilityListFunction
"use client"

import { ColumnDef } from "@tanstack/react-table"
import Pop from "@/components/app/pop"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import axios from "axios"
import { useRef, useState, useCallback, useEffect } from "react"

export type User = {
    user_id: string
    user_name: string
    name: string
    mail: string
    phone: string
    job: string
    province: string
    address: string
}

interface Closeable {
    close: () => void
}

interface PopRef {
    current: Closeable | undefined
}

const JobCell = ({ value }: { value: string }) => {
    return value === "其他" ? <div className="text-yellow-600">{value}</div> : value
}

const ModifyForm = ({ row, onChange }: { row: any, onChange: (data: any) => void }) => {
    const [name, setName] = useState(String(row.getValue('name')))
    const [phone, setPhone] = useState(String(row.getValue('phone')))
    const [province, setProvince] = useState(String(row.getValue('province')))

    useEffect(() => {
        onChange({ name, phone, province })
    }, [name, phone, province, onChange])


    return (
        <div className="grid grid-flow-row grid-cols-4 gap-4">
            <Label className="content-center justify-self-end">账户:</Label>
            <Label className="col-span-3">{row.getValue('user_id')}</Label>
            <Label className="content-center justify-self-end">用户:</Label>
            <Input className="col-span-3" value={name} onChange={(e) => setName(e.target.value)} />
            <Label className="content-center justify-self-end">手机号:</Label>
            <Input className="col-span-3" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <Label className="content-center justify-self-end">省份:</Label>
            <Input className="col-span-3" value={province} onChange={(e) => setProvince(e.target.value)} />
        </div>
    )
}

const DeleteConfirm = ({ row }: { row: any }) => (
    <div className="grid grid-flow-row grid-cols-4 gap-4">
        <Label className="col-span-1">账户:</Label>
        <Label className="col-span-3">{row.getValue('user_name')}</Label>
        <Label className="col-span-1">用户:</Label>
        <Label className="col-span-3">{row.getValue('name')}</Label>
        <Label className="col-span-4 content-center justify-self-end">是否要删除该用户？</Label>
    </div>
)

const ActionCell = ({ row, refreshData }: { row: any, refreshData: () => void }) => {
    const removePopRef = useRef<Closeable>()
    const modifyPopRef = useRef<Closeable>()
    const [modifyData, setModifyData] = useState({})

    const handleRemoveClose = useCallback(() => {
        axios.post(`/api/user/delete/${row.getValue('user_id')}`)
            .then(() => {
                removePopRef.current?.close()
                refreshData()
            })
    }, [row, refreshData])

    const handleModifyClose = useCallback(() => {
        axios({
            url: `/api/user/update/${row.getValue('user_id')}`,
            method: "POST",
            data: modifyData
        }).then(() => {
            modifyPopRef.current?.close()
            refreshData()
        })
    }, [row, modifyData, refreshData])

    return (
        <div className="flex flex-row gap-4">
            <Pop title="修改" description="修改界面" submit={handleModifyClose} ref={modifyPopRef as PopRef}>
                <ModifyForm row={row} onChange={setModifyData} />
            </Pop>
            <Pop title="删除" description="删除界面" submit={handleRemoveClose} ref={removePopRef as PopRef}>
                <DeleteConfirm row={row} />
            </Pop>
        </div>
    )
}


export const columns = (refreshData: () => void): ColumnDef<User>[] => [
    { accessorKey: "user_id", header: "Id" },
    { accessorKey: "user_name", header: "账号" },
    { accessorKey: "name", header: "用户名" },
    { accessorKey: "mail", header: "邮箱" },
    { accessorKey: "phone", header: "手机号" },
    {
        accessorKey: "job",
        header: "工作",
        cell: ({ row }) => <JobCell value={row.getValue('job')} />
    },
    { accessorKey: "province", header: "省份" },
    { accessorKey: "address", header: "地址" },
    {
        id: "actions",
        header: "操作",
        cell: ({ row }) => <ActionCell row={row} refreshData={refreshData} />
    },
]

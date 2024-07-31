import { forwardRef, useImperativeHandle, useState } from "react";
import { Button } from "@/components/ui/button";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";


function Pop(props:any, ref: any) {
    const [open, setOpen] = useState(false)
    useImperativeHandle(ref, ()=> ({
        close: ()=> {
            setOpen(false)
        }
    }))

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    {props.title == "新增" || props.title == "修改" ?
                        <Button className="w-20 bg-pink-600">{props.title}</Button>
                    : 
                        <Button className="w-20 bg-purple-500">{props.title}</Button>
                    }
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{props.title}</DialogTitle>
                        <DialogDescription>{props.description}</DialogDescription>
                    </DialogHeader>
                    {props.children}
                    <DialogFooter>
                        {props.title == "新增" || props.title == "修改" &&
                            <>
                            <Button className='bg-blue-700' onClick={props.submit}>确认</Button>
                            <DialogClose asChild>
                                <Button className="bg-gray-700">取消</Button>
                            </DialogClose></>
                        }
                        {props.title == "删除" &&
                            <>
                            <Button className="bg-blue-700" onClick={props.submit}>是</Button>
                            <DialogClose asChild>
                                <Button className="bg-gray-700">否</Button>
                            </DialogClose></>
                        }
                    </DialogFooter>
                </DialogContent>

            </Dialog>
        </>
    )
}

export default forwardRef(Pop)

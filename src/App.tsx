import { useRef, useEffect, useCallback } from 'react'
import { Updater, useImmer } from 'use-immer'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { ThemeProvider } from "@/components/theme-provider"

import { columns } from '@/components/user/columns'
import { DataTable } from '@/components/user/data-table'
import Pop from '@/components/app/pop'

import axios from 'axios'

interface Closeable {
  close: () => void
}

interface State {
  queryForm: {
    user_name: string
    name: string
    phone: string
    province: string
  }
  addForm: {
    user_name: string
    name: string
    password: string
    phone: string
    province: string
  }
  data: any[]
}

const useDataState = (initState: State) => {
  const [state, updateState] = useImmer<State>(initState)

  const fetchData = useCallback((data: any) => {
    axios({
      url: "/api/user/read",
      method: "POST",
      data: data,
    }).then((res) => {
      updateState(draft => {
        draft.data = res.data.data || []
      })
    });
  }, [updateState])

  const queryData = useCallback(() => {
    // console.log(state.queryForm)
    fetchData(state.queryForm)
  }, [fetchData, state.queryForm])


  useEffect(() => {
    document.title = "用户数据展示"
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "用户数据展示");
    }
    queryData()
  }, [])

  return { state, updateState, queryData }
}

const AddForm = ({ state, updateState, popRef, handleAddClose }: { state: any, updateState: Updater<State>, popRef: any, handleAddClose: any }) => (
  <Pop title="新增" description="新增界面" submit={handleAddClose} ref={popRef}>
    <div className='grid grid-flow-row grid-cols-4 gap-4'>
      <Label className='content-center justify-self-end' htmlFor='username'>账户:</Label>
      <Input className='w-50 col-span-3' id='username' placeholder='账户' value={state.addForm.username} onChange={(e) => {
        updateState(draft => {
          draft.addForm.user_name = e.currentTarget.value
        })
      }}></Input>

      <Label className='content-center justify-self-end' htmlFor='password'>密码:</Label>
      <Input className='w-50 col-span-3' id='password' type='password' placeholder='密码' value={state.addForm.password} onInput={(e) => {
        updateState(draft => {
          draft.addForm.password = e.currentTarget.value
        })
      }}></Input>

      <Label className='content-center justify-self-end' htmlFor='name'>用户名:</Label>
      <Input className='w-50 col-span-3' id='name' placeholder='用户名' value={state.addForm.name} onInput={(e) => {
        updateState(draft => {
          draft.addForm.name = e.currentTarget.value
        })
      }}></Input>

      <Label className='content-center justify-self-end' htmlFor='phone'>手机号:</Label>
      <Input className='w-50 col-span-3' id='phone' placeholder='手机号' value={state.addForm.phone} onInput={(e) => {
        updateState(draft => {
          draft.addForm.phone = e.currentTarget.value
        })
      }}></Input>

      <Label className='content-center justify-self-end' htmlFor='province'>省份:</Label>
      <Input className='w-50 col-span-3' id='province' placeholder='省份' value={state.addForm.province} onInput={(e) => {
        updateState(draft => {
          draft.addForm.province = e.currentTarget.value
        })
      }}></Input>
    </div>
  </Pop>
)


const QueryForm = ({ state, updateState, queryData }: { state: any, updateState: Updater<State>, queryData: any }) => {
  const popRef = useRef<Closeable>()

  const handleAddClose = useCallback(() => {
    axios({
      url: "/api/user/create",
      method: "POST",
      data: state.addForm,
    }).then(() => {
      updateState(draft => {
        draft.addForm = { user_name: '', name: '', password: '', phone: '', province: '' }
      })
      popRef.current?.close()
      queryData()
    })
  }, [state.addForm])

  return (
    <div className='grid grid-flow-col auto-cols-max gap-4'>
      <Label className='content-center w-12' htmlFor='username'>账号:</Label>
      <Input id='username' placeholder='账号' className='w-36' value={state.queryForm.user_name} onChange={(e) => {
        updateState(draft => {
          draft.queryForm.user_name = e.currentTarget.value
        })
      }}></Input>
      <Label className='content-center' htmlFor='name'>用户名:</Label>
      <Input id='name' placeholder='用户名' className='w-36' value={state.queryForm.name} onChange={(e) => {
        updateState(draft => {
          draft.queryForm.name = e.currentTarget.value
        })
      }}></Input>
      <Label className='content-center' htmlFor='phone'>手机号:</Label>
      <Input id='phone' placeholder='手机号' className='w-36' value={state.queryForm.phone} onChange={(e) => {
        updateState(draft => {
          draft.queryForm.phone = e.currentTarget.value
        })
      }}></Input>
      <Label className='content-center' htmlFor='province'>省份:</Label>
      <Input id='province' placeholder='省份' className='w-36' value={state.queryForm.province} onChange={(e) => {
        updateState(draft => {
          draft.queryForm.province = e.currentTarget.value
        })
      }} />

      <Button className='bg-blue-500 w-20' onClick={queryData}>查询</Button>
      <Button className='bg-yellow-600 w-20' onClick={() => {
        updateState(draft => {
          draft.queryForm = { user_name: '', name: '', phone: '', province: '' }
        })
      }}>重置</Button>

      <AddForm state={state} updateState={updateState} popRef={popRef} handleAddClose={handleAddClose} />
    </div>
  )
}

function App() {
  const { state, updateState, queryData } = useDataState({
    queryForm: { user_name: '', name: '', phone: '', province: '' },
    addForm: { user_name: '', name: '', password: '', phone: '', province: '' },
    data: [],
  })

  const enterFunction = useCallback((event: any) => {
    if (event.keyCode === 13) {
      queryData()
    }
  }, [queryData, state.queryForm]);

  useEffect(() => {
    document.addEventListener("keydown", enterFunction, false)
    return () => document.removeEventListener("keydown", enterFunction)
  }, [enterFunction])

  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className='container mx-auto py-10'>
          <QueryForm state={state} updateState={updateState} queryData={queryData}/>
          <Separator className='my-4'></Separator>
          <DataTable columns={columns(queryData)} data={state.data} />
        </div>
      </ThemeProvider>
    </>
  )
}

export default App


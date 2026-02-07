'use client'
import axios from 'axios';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Comment {
  id: string
  content: string
  userId: string
  user: {
    id: string
    name: string
    email: string
  }
  createdAt: string
  updatedAt: string
}


export default function Chat() {
  const [data, setData] = useState<Comment[]>([])
  const [texto, setTexto] = useState<string>('')
  const [name, setName] = useState<string>('')


  async function getData() {
    try {
      const response = await axios.get<Comment[]>('http://localhost:3000/comentarios')
      const conteudo = response.data
      setData(conteudo)

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const userName = localStorage.getItem('userName') || ''
    setName(userName)
    getData()
  }, [])



  async function sendTexto() {
    try {
      const userId = localStorage.getItem('userId')
      const enviar = await axios.post('http://localhost:3000/comentarios', {
        content: texto,
        userId: userId
      })
    } catch (error) {
      alert('Você não está logado!')
    }
    getData()
    setTexto('')
  }

  async function deletarTexto(id: string, usercomment: string) {
    const userId = localStorage.getItem('userId')

    if (userId !== usercomment) {
      alert('Comentário não é seu')
      return
    }


    try {
      axios.delete(`http://localhost:3000/comentarios/${id}`)
      getData()
    } catch (error) {
      console.log(error)
    }
  }



  return (
    <div>

      <div className='flex flex-row justify-between m-1'>
        <h1>Welcome to the Chat App {name} </h1>
      </div>

      <div>
        <h1 className='mt-5 ml-5 mb-2 font-bold text-center text-2xl'>Chat</h1>
        <div>
          <input className='border border-white p-5 placeholder-blue-100' placeholder='
          Texto' value={texto} onChange={e => setTexto(e.target.value)} type="text" name="texto" id="texto" />
          <input type="button" value="Enviar" onClick={sendTexto} />
        </div>
        <h1>
          {data.map((item) => (
            <div key={item.id}>

              <div className='flex flex-col justify-center item-center border border-[#a8a8a86b] mt-5 rounded mb-5'>

                <div className='ml-2 mt-5'>
                  <p className='font-bold text-[20px]'>{item.user.name}</p>
                </div>

                <div className='ml-2 mb-5'>
                  <p className='text-[18px]'>{item.content}</p>
                  <div className='flex flex-col justify-center items-end mr-3'>

                    <button onClick={() => deletarTexto(item.id, item.userId)}
                      className='bg-red-700 p-0.5 rounded outline-1 cursor-pointer'>Deletar</button>


                  </div>
                </div>

              </div>

            </div>
          ))}
        </h1>
      </div>
    </div>
  )
}

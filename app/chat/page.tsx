'use client'
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import io from 'socket.io-client'



interface Comment {
  id: string
  content: string
  userId: string
  user: {
    id: string
    name: string
    avatar: string
    email: string
  }
  createdAt: string
  updatedAt: string
}


const socket = io('https://backend-chat-production-dbf0.up.railway.app')

export default function Chat() {
  const [data, setData] = useState<Comment[]>([])
  const [texto, setTexto] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [urlImage, setUrlImage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)


  async function getData() {
    try {
      const response = await axios.get<Comment[]>('https://backend-chat-production-dbf0.up.railway.app/comentarios')
      const conteudo = response.data
      setData(conteudo)

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getData()
    socket.on('chat message', (novoComentario) => {
      console.log(novoComentario)
      setData((mensagensAnteriores) => [...mensagensAnteriores, novoComentario])
    })
    const userName = localStorage.getItem('userName') || ''
    setName(userName)
    const imagem = localStorage.getItem('avatar') || ''
    setUrlImage(imagem)
    
    return () => {
      socket.off('chat message')
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [data])



  async function sendTexto() {
    if(!texto) {
            return alert('Você não escreveu nada')
        }

    try {
      const userId = localStorage.getItem('userId')
      const enviar = await axios.post('https://backend-chat-production-dbf0.up.railway.app/comentarios', {
        content: texto,
        userId: userId
      })

      socket.emit('chat message', enviar.data)

    } catch (error) {
      alert('Você não está logado!')
    }
    
    getData()
    setTexto('')
  }


  
  return (
    <div className='min-h-screen pb-24 sm:pb-28'>
      
      <div className='flex flex-row gap-2 justify-between mt-5 ml-4'>
        <div className='flex flex-row gap-2'>
          <h1 className='font-bold text-[18px] text-[#dddddde3] '>Seja Bem-Vindo</h1>
          <p className='font-bold text-[18px]'>{name}</p>
        </div>
        <div className='flex flex-row mr-3'>
          <img className='w-8 h-8 mr-3 rounded-lg' src={urlImage || '../usericon.png'}/>
          <Link href='/settings' ><img src="../iconeconfig.svg" className='w-8 cursor-pointer' alt="Icone de Configurações" /></Link>
        </div>
      </div>
      <div>

        <div className='fixed bottom-0 left-0 w-full bg-black border-t border-[#e6e6e69a] px-3 py-3 sm:px-6 sm:py-4'>
          <div className='max-w-4xl mx-auto flex items-center gap-2 sm:gap-3 w-full'>
            <input
              className='flex-1 min-w-0 border rounded-lg h-12 sm:h-14 border-[#e6e6e69a] p-3 sm:p-5 placeholder-[#e6e6e69a] font-semibold'
              placeholder='Texto'
              maxLength={119}
              value={texto}
              onChange={e => setTexto(e.target.value)}
              type="text"
              name="texto"
              id="texto"
            />
            <input
              className='shrink-0 border w-20 sm:w-24 h-12 sm:h-14 rounded-lg p-2 border-[#e6e6e69a] font-semibold'
              type="button"
              value="Enviar"
              onClick={sendTexto}
            />
          </div>
        </div>

        <h1>
          {data.map((item) => (
            <div key={item.id}>

              <div className='flex flex-col justify-center item-center border border-[#a8a8a86b] mt-5 min-w-80 max-w-[95%] ml-2 lg:w-[90%] lg:ml-4 lg:mt-10 rounded-lg lg:mb-5'>
                <div className='flex flex-row ml-3 mt-4'>
                  <img className='w-8 h-8 mr-3 mb-3 rounded-lg' src={item.user?.avatar}alt="" />  
                  <p className='font-bold text-[18px]'>{item.user?.name}</p>
                </div>

                  <div className='flex flex-row items-end justify-between mr-3 mb-5 ml-3 break-all'>
                    
                    <p className='text-[18px]'>{item.content}</p>


                  </div>
            
              </div>

            </div>
          ))}
        </h1>
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}

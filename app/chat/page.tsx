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
    avatar: string
    email: string
  }
  createdAt: string
  updatedAt: string
}


export default function Chat() {
  const [data, setData] = useState<Comment[]>([])
  const [texto, setTexto] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [urlImage, setUrlImage] = useState('')


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
    const imagem = localStorage.getItem('avatar') || ''
    setUrlImage(imagem)
    getData()
  }, [])



  async function sendTexto() {
    if(!texto) {
            return alert('Você não escreveu nada')
        }

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


  
  return (
    <div>
      
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

        <div className='mt-10 ml-4'>
          <input className='border rounded-lg border-[#e6e6e69a] p-5 placeholder-[#e6e6e69a] h-20 font-semibold' placeholder='
          Texto' value={texto} onChange={e => setTexto(e.target.value)} type="text" name="texto" id="texto" />
          <input className='border rounded-lg p-5 ml-3 border-[#e6e6e69a] font-semibold' type="button" value="Enviar" onClick={sendTexto} />
        </div>

        <h1>
          {data.map((item) => (
            <div key={item.id}>

              <div className='flex flex-col justify-center item-center border border-[#a8a8a86b] w-300 ml-4 mt-10 rounded-lg mb-5'>
                <div className='flex flex-row ml-3 mt-5'>
                  <img className='w-8 h-8 mr-3 mb-3 rounded-lg' src={item.user.avatar}alt="" />  
                  <p className='font-bold text-[18px]'>{item.user.name}</p>
                </div>

                  <div className='flex flex-row items-end justify-between mr-3 mb-5 ml-3'>
                    
                    <p className='text-[18px]'>{item.content}</p>


                  </div>
            
              </div>

            </div>
          ))}
        </h1>
      </div>
    </div>
  )
}

'use client'
import Link from "next/link"
import axios from 'axios'
import { useState, useEffect } from "react"
import Modal from "@/components/modal"

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


    export default function Settings() {

    const [data, setData] = useState<Comment[]>([])

    async function getData() {
        try {
            const userId = localStorage.getItem('userId') || ''
            const response = await axios.get(`http://localhost:3000/comentarios/${userId}`)
            const conteudo = response.data
            console.log(conteudo)
            console.log(response)
            setData(conteudo)

        } catch (error) {
            console.log(error)
        }
    }

    async function deletarTexto(id: string) {

        try {
            await axios.delete(`http://localhost:3000/comentarios/${id}`)
            getData()
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const userName = localStorage.getItem('userName') || ''
        getData()
    }, [])

     async function deletarTudo() {
        const userId = localStorage.getItem('userId')
        try {
            const deletartudo = await axios.delete(`http://localhost:3000/comentariosall/${userId}`)
            getData()
        } catch (error) {
            console.log(error)
        }
        alert('Todos os Comentários foram excluidos!')
    }


    return (
        <div>
            <div className="ml-5 mt-2">
                <Link href='/chat'>Voltar</Link>
            </div>
            <div>
                <div className="flex flex-row gap-5 mt-10 mb-10">
                    <h1 className="text-2xl font-bold ml-3">Suas mensagens</h1>
                    <button onClick={deletarTudo} className="border rounded-lg p-1 cursor-pointer h-10 bg-red-700">Deletar Todas</button>
                </div>



                {data.map((item) => (
                    <div key={item.id}>
                        <div className=" flex flex-row justify-between border border-white p-1 mt-3 ml-3 rounded-lg">
                            <p>{item.content}</p>
                            <button onClick={() => deletarTexto(item.id)}
                                className='bg-red-700 p-1 rounded-lg outline-1 cursor-pointer'>Deletar
                            </button>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}
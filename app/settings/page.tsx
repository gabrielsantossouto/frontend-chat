'use client'
import Link from "next/link"
import axios from 'axios'
import { useState, useEffect } from "react"

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
            // criar rota backend para trazer os comentários... ;=;
            const response = await axios.get(`http://localhost:3000/user/${userId}`)
            const conteudo = response.data
            console.log(conteudo)
            setData(conteudo)

        } catch (error) {
            console.log(error)
        }
    }

      useEffect(() => {
        const userName = localStorage.getItem('userName') || ''
        getData()
      }, [])


    return (
        <div>
            <div className="ml-5 mt-2">
                <Link href='/chat'>Voltar</Link>
            </div>
            <div>
                {data.map((item) => (
                    <div key={item.content}></div>
                ))}
            </div>

        </div>
    )
}
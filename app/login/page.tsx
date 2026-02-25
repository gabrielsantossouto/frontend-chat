'use client'
import { useState } from "react"
import axios from 'axios'
import Link from "next/link"
import { useRouter } from "next/navigation"



export default function Login() {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const router = useRouter()


    async function fazerLogin() {
        if(!name && !email) {
            return alert('Você não escreveu nada')
        }

        try {
            const response = await axios.post('http://localhost:3000/login', { email })
            const user = response.data

            document.cookie = `userId=${response.data.id}; path=/`
            localStorage.setItem('avatar', response.data.avatar)
            localStorage.setItem('userName', response.data.name)
            localStorage.setItem('userId', response.data.id)
            // usa o useRouter para poder redirecionar melhor que usar o link do nextjs
            router.refresh()
            router.push('/chat')


        } catch (error) {
            alert('Usuario não encontrado!')
            router.push('/register')
        }
    }

    return (
        <div className="h-screen flex justify-center items-center">

            <div className="w-80 h-90 border flex flex-col justify-center items-center rounded-lg">
                <div className="flex flex-col justify-center items-center gap-3">

                    <h1 className="text-2xl">Login</h1>

                    <input className="border rounded-lg text-center p-2" type="text" name="name" value={name} placeholder="Nome de Usuário" onChange={e => setName(e.target.value)} id="name" />

                    <input className="border rounded-lg text-center p-2" type="email" name="email" value={email} placeholder="E-mail" onChange={e => setEmail(e.target.value)} id="email" />

                    <input className="cursor-pointer border rounded-lg hover:bg-white hover:text-black w-30 h-10 p-0.5" type="button" onClick={fazerLogin} value="Enviar" />

                    <Link href='/register'><input type="button" className="cursor-pointer" value="Cadastrar-se" /></Link>

                </div>
            </div>

        </div>

    )
}
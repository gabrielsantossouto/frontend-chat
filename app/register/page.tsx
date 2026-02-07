'use client'
import { useState } from "react"
import axios from 'axios'
import Link from "next/link"
import { useRouter } from "next/navigation"



export default function Register() {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const router = useRouter()


    async function fazerRegister() {
        try {
            const send = await axios.post('http://localhost:3000/users', {
                name: name,
                email: email
            })

            document.cookie = `userId=${send.data.id}; path=/`
            localStorage.setItem('userName', send.data.name)
            localStorage.setItem('userId', send.data.id)

            alert('Registro feito com sucesso!')

            router.refresh()
            router.push('/chat')

        } catch (error) {
            alert('Esse email já existe!')
            router.push('/login')
        }
    }

    return (
        <div className="h-screen flex justify-center items-center">

            <div className="w-80 h-90 border flex flex-col justify-center items-center rounded-lg">
                <div className="flex flex-col justify-center items-center gap-3">

                    <h1 className="text-2xl">Registrar</h1>

                    <input className="border rounded-lg text-center p-2" type="text" name="name" value={name} placeholder="Nome de Usuário" onChange={e => setName(e.target.value)} id="name" />

                    <input className="border rounded-lg text-center p-2" type="email" name="email" value={email} placeholder="E-mail" onChange={e => setEmail(e.target.value)} id="email" />

                    <input className="cursor-pointer border rounded-lg hover:bg-white hover:text-black w-30 h-10 p-0.5" type="button" onClick={fazerRegister} value="Enviar" />

                    <Link href='/login'><input type="button" className="cursor-pointer" value="Já tem conta?" /></Link>

                </div>
            </div>

        </div>

    )
}
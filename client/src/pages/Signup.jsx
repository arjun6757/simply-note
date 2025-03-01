import { GithubIcon, GoogleIcon } from '@/components/icons/Icons';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import React from 'react'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/supabaseClient';
import LoadingSpinner from '@/components/loader';

export default function Signup() {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignUp = async (e) => {
        e.preventDefault();

        if (!email || !password || !username) {
            setMessage('Empty spaces are not allowed!');
            return;
        }

        if (password.length < 6) {
            setMessage('Password must be atleast 6 characters!');
            return;
        }

        if (username.length < 4) {
            setMessage('Username must be at least 4 characters!');
            return;
        }

        setLoading(true);
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { username: username }    // store username in meta data
            }
        });

        // const { user } = data;
        setLoading(false);

        if (error) {
            setMessage(error.message);
        } else {
            setMessage("Check your email for confirmation!");
            // console.log('data.user: ', data.user);
        }

    };

    const handleOAuthGoogle = async () => {
        const {data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
        });

        if (error) {
            console.error('Google auth error: ', error.message);
            setMessage('Error: ', error.message);
        }
    }

    return (
        <div className='flex min-h-screen p-4 bg-gray-50 justify-center items-center font-inter'>
            <div className='bg-white min-w-md max-w-md h-full border border-[#ddd] shadow-sm rounded-md px-6 py-8 text-sm text-gray-800 flex flex-col gap-4'>
                <div className='mb-2'>
                    <span className='text-2xl font-bold'>Sign up</span>
                    <p className='text-xs text-gray-500'>Choose your preferred sign up method</p>
                </div>

                <div>
                    <form className='flex flex-col gap-4' >
                        <div className='flex flex-col gap-1'>
                            <label className='font-medium'>Username</label>
                            <input
                                type='text'
                                placeholder='name'
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className='outline-offset-4 focus:outline-gray-500 p-2 border border-[#ddd] rounded-md'
                                required />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label className='font-medium'>Email</label>
                            <input
                                type='email'
                                placeholder='name@example.com'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className='outline-offset-4 focus:outline-gray-500 p-2 border border-[#ddd] rounded-md'
                                required />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label className='font-medium'>Password</label>
                            <input
                                type='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className='outline-offset-4 focus:outline-gray-500 p-2 border border-[#ddd] rounded-md'
                                required />
                        </div>

                        <Button onClick={handleSignUp} type={'submit'} className={'cursor-pointer text-xs'}>
                            <Mail className='w-4 h-4' />
                            Sign up with Email
                            {loading && <LoadingSpinner className={'text-gray-300'} />}
                        </Button>
                    </form>

                    {message && <p className="mt-3 text-sm text-red-500">{message}</p>}
                </div>

                <div className="flex items-center">
                    <hr className="flex-grow border-t border-gray-300" />
                    <span className="text-gray-500 text-xs mx-2">OR CONTINUE WITH</span>
                    <hr className="flex-grow border-t border-gray-300" />
                </div>

                <div className='flex justify-between gap-4'>
                    <Button onClick={handleOAuthGoogle} variant={'outline'} className={'flex-grow text-xs gap-3 cursor-pointer'}>
                        <GoogleIcon />
                        Google
                    </Button>
                    <Button variant={'outline'} className={'flex-grow text-xs gap-3 cursor-pointer'}>
                        <GithubIcon />
                        Github
                    </Button>
                </div>

                <div className='flex gap-1 justify-center'>
                    <span className='text-gray-500'>Already have an account?</span>
                    <Link to={'/login'} className='underline-offset-4 hover:underline font-medium'>
                        Log in
                    </Link>
                </div>
            </div>
        </div>
    )
}

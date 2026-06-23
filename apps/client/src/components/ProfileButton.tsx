"use client";

import { UserButton } from '@clerk/nextjs';
import { ShoppingBasket } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react'

const ProfileButton = () => {
    const router = useRouter();
  return (
    <UserButton>
        <UserButton.MenuItems>
        <UserButton.Action label='See Order' labelIcon={<ShoppingBasket className=' '/>} onClick={()=>router.push('/orders')}/>
        </UserButton.MenuItems>

    </UserButton>
  )
}

export default ProfileButton
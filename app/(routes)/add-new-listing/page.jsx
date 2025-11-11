"use client"
import GoogleAddressSearch from '@/app/_components/GoogleAddressSearch'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'

function AddNewListing() {
    const [selectedAddress, setSelectedAddress] = useState();
    const [coordinates, setCoordinates] = useState();

    const nextHandler = () => {
        console.log(selectedAddress, coordinates)
    }
    return (
        <div className='mt-10 md:mx-56 lg:mx-80'>
            <div className='p-10 flex flex-col gap-5 items-center justify-center'>
                <h2 className='font-bold text-2xl'>Add new listing</h2>
                <div className='p-10 w-full rounded-lg border shadow-md flex flex-col gap-5'>
                    <h2 className='text-gray-500'>
                        Enter the Property Address
                    </h2>
                    <GoogleAddressSearch
                        selectedAddress={(value) => setSelectedAddress(value)}
                        setCoordinates={(value) => setCoordinates(value)}
                    />
                    <Button
                        onClick={nextHandler}
                        disabled={!selectedAddress || !coordinates}>
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default AddNewListing

"use client"
import LocationAutocomplete from '@/app/_components/LocationAutoComplete';
import { Button } from '@/components/ui/button'
import { supabase } from '@/utils/supabase/client';
import { useUser } from '@clerk/nextjs';
import { Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from "sonner";

function AddNewListing() {
    const [selectedAddress, setSelectedAddress] = useState();
    const [coordinates, setCoordinates] = useState();
    const user = useUser();
    const [loader, setLoader] = useState(false);
    const router = useRouter();

    const nextHandler = async () => {
        setLoader(true);
        console.log('hello')
        console.log(selectedAddress, coordinates)
        console.log('hehehe', coordinates)
        user ? console.log('user', user?.user?.primaryEmailAddress?.emailAddress) : console.log('no user');
        const { data, error } = await supabase
            .from('listings')
            .insert([
                { address: selectedAddress, coordinates: coordinates, createdBy: user?.user?.primaryEmailAddress?.emailAddress },
            ])
            .select();

        if (data) {
            setLoader(false);
            toast("New Address Added")
            console.log("New Data Added", data);
            router.replace('/edit-listing/' + data[0].id);
        }
        if (error) {
            setLoader(false);
            toast("Error occured. Try again")
            console.log("Error", error)
        }
    }
    return (
        <div className='mt-10 md:mx-56 lg:mx-80'>
            <div className='p-10 flex flex-col gap-5 items-center justify-center'>
                <h2 className='font-bold text-2xl'>Add new listing</h2>
                <div className='p-10 w-full rounded-lg border shadow-md flex flex-col gap-5'>
                    <h2 className='text-gray-500'>
                        Enter the Property Address
                    </h2>
                    <LocationAutocomplete
                        selectedAddress={(value) => setSelectedAddress(value)}
                        setCoordinates={(value) => setCoordinates(value)}
                    />
                    <Button
                        onClick={nextHandler}
                        disabled={!selectedAddress || !coordinates || loader}
                    >
                        {loader ? <Loader className='animate-spin' /> : 'Next'}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default AddNewListing

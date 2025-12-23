"use client"
import React, { use, useEffect, useState } from 'react'
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Formik } from 'formik'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { supabase } from '@/utils/supabase/client'
import { useUser } from '@clerk/nextjs'
import FileUpload from '../_components/FileUpload'
import { Loader } from 'lucide-react'

function EditListing({ params }) {
    // const params = usePathname();
    const { id } = use(params);
    const user = useUser();
    const router = useRouter();
    const [listing, setListing] = useState([]);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log(id)
        user && verifyUserRecord();
    }, []);

    const verifyUserRecord = async () => {
        const { data, error } = await supabase
            .from('listings')
            .select('*, listingImages(listing_id, imageUrl)')
            .eq('createdBy', user?.user?.primaryEmailAddress?.emailAddress)
            .eq('id', id);
        if (data) {
            setListing(data[0]);
            console.log('data[0]', data[0]);
        }
        if (data?.length <= 0) {
            console.log('taking you to home')
            router.replace('/');
        }
    }
    const onSubmitHandler = async (formValue) => {
        setLoading(true);
        console.log('formValue: ', formValue);

        const { data, error } = await supabase
            .from('listings')
            .update(formValue)
            .eq('id', id)
            .select();

        if (data) {
            console.log('data', data);
            toast("Listing updated")
        }
        if (error) {
            console.log('error', error);
        }
        for (const image of images) {

            const file = image;
            const fileName = Date.now().toString();
            const fileExt = fileName.split('.').pop();

            const { data, error } = await supabase.storage
                .from('listingImages')
                .upload(`${fileName}`, file, {
                    contentType: `image/${fileExt}`,
                    upsert: false
                });

            if (error) {
                toast("Error while uploading images");
                setLoading(false);
            } else {
                const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL + fileName;
                console.log('image url: ', imageUrl);
                console.log('id: ', id);
                const { data, error } = await supabase
                    .from('listingImages')
                    .insert([
                        { 'imageUrl': imageUrl, 'listing_id': id }
                    ])
                    .select();

                if (error) {
                    setLoading(false);
                }
            }
            setLoading(false);
        }

    }
    return (
        <div className='px-10 md:px-36 my-10'>
            <h2 className='font-bold text-2xl'>Enter some details about your listing</h2>
            <Formik initialValues={{
                type: 'Sell',
                propertyType: 'Town house',
                profileImage: user?.user?.imageUrl,
                fullName: user?.user?.fullName
            }}
                onSubmit={(values) => {
                    console.log('form values', values);
                    onSubmitHandler(values);
                }}
            >
                {({
                    values,
                    handleChange,
                    handleSubmit
                }) => (
                    <form onSubmit={handleSubmit}>
                        <div className='p-8 rounded-lg shadow-md'>
                            <div className='grid grid-cols-1 md:grid-cols-3'>
                                <div className='flex flex-col gap-2'>
                                    <h2 className='text-md text-gray-500'>Rent or Sell?</h2>
                                    <RadioGroup onValueChange={(e) => values.type = e} defaultValue={listing?.type}>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="Rent" id="Rent" />
                                            <Label htmlFor="Rent">Rent</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="Sell" id="Sell" />
                                            <Label htmlFor="Sell">Sell</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <h2 className='text-md text-gray-500'>Property type</h2>
                                    <Select onValueChange={(e) => values.propertyType = e}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder={listing?.propertyType ? listing?.propertyType : "Select property type"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Single family house">Single family house</SelectItem>
                                            <SelectItem value="Town house">Town house</SelectItem>
                                            <SelectItem value="Condo">Condo</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-10'>
                                <div className='flex flex-col gap-2 mr-4'>
                                    <h2 className='text-md text-gray-500'>
                                        Bedroom
                                    </h2>
                                    <Input placeholder='Ex.2' name='bedroom' defaultValue={listing?.bedroom} onChange={handleChange} />
                                </div>
                                <div className='flex flex-col gap-2 mr-4'>
                                    <h2 className='text-md text-gray-500'>
                                        Bathroom
                                    </h2>
                                    <Input placeholder='Ex.2' name='bathroom' defaultValue={listing?.bathroom} onChange={handleChange} />
                                </div>
                                <div className='flex flex-col gap-2 mr-4'>
                                    <h2 className='text-md text-gray-500'>
                                        Built In (year)
                                    </h2>
                                    <Input placeholder='Ex.2024' name='builtIn' defaultValue={listing?.builtIn} onChange={handleChange} />
                                </div>
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-4'>
                                <div className='flex flex-col gap-2 mr-4'>
                                    <h2 className='text-md text-gray-500'>
                                        Parking
                                    </h2>
                                    <Input placeholder='Ex.2' name='parking' defaultValue={listing?.parking} onChange={handleChange} />
                                </div>
                                <div className='flex flex-col gap-2 mr-4'>
                                    <h2 className='text-md text-gray-500'>
                                        Lot size (Sq.ft)
                                    </h2>
                                    <Input placeholder='Ex.2800' name='lotSize' defaultValue={listing?.lotSize} onChange={handleChange} />
                                </div>
                                <div className='flex flex-col gap-2 mr-4'>
                                    <h2 className='text-md text-gray-500'>
                                        Area (Sq.ft)
                                    </h2>
                                    <Input placeholder='Ex.1900' name='area' defaultValue={listing?.area} onChange={handleChange} />
                                </div>
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-4'>
                                <div className='flex flex-col gap-2 mr-4'>
                                    <h2 className='text-md text-gray-500'>
                                        Selling Price ($)
                                    </h2>
                                    <Input placeholder='Ex.40000' name='price' defaultValue={listing?.price} onChange={handleChange} />
                                </div>
                                <div className='flex flex-col gap-2 mr-4'>
                                    <h2 className='text-md text-gray-500'>
                                        HOA (Per Month)($)
                                    </h2>
                                    <Input type="number" placeholder='Ex.100' name='hoa' defaultValue={listing?.hoa} onChange={handleChange} />
                                </div>
                            </div>
                            <div className='grid grid-cols-1 gap-10 mt-4'>
                                <div className='flex flex-col gap-2'>
                                    <h2 className='text-md text-gray-500'>
                                        Description
                                    </h2>
                                    <Textarea placeholder="" name="description" defaultValue={listing?.description} onChange={handleChange} />
                                </div>
                            </div>
                            <div>
                                <h2 className='font-lg text-gray-500 my-2'>Upload Images</h2>
                                <FileUpload
                                    setImages={(value) => setImages(value)}
                                    imageList={listing?.listingImages}
                                />
                            </div>
                            <div className='flex gap-7 justify-end mt-4'>
                                <Button variant='outline' className='text-primary border-primary'>Save</Button>
                                <Button disabled={loading} className=''>{loading ? <Loader className='animate-spin' /> : 'Save and Publish'}</Button>
                            </div>
                        </div></form>
                )}

            </Formik>

        </div>
    )
}

export default EditListing

import Image from 'next/image';
import React, { useState } from 'react'

function FileUpload({ setImages, imageList }) {

    const [imagePreview, setImagePreview] = useState([]);

    const handleFileUpload = (event) => {
        const files = event.target.files;
        console.log('files: ', files);
        setImages(files);
        const previews = Array.from(files).map((file) => URL.createObjectURL(file));
        setImagePreview(previews);
    }
    return (
        <div>

            <div className="flex items-center justify-center w-full">
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 bg-neutral-secondary-medium border border-dashed border-default-strong rounded-base cursor-pointer hover:bg-neutral-tertiary-medium">
                    <div className="flex flex-col items-center justify-center text-body pt-5 pb-6">
                        <svg className="w-8 h-8 mb-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h3a3 3 0 0 0 0-6h-.025a5.56 5.56 0 0 0 .025-.5A5.5 5.5 0 0 0 7.207 9.021C7.137 9.017 7.071 9 7 9a4 4 0 1 0 0 8h2.167M12 19v-9m0 0-2 2m2-2 2 2" /></svg>
                        <p className="mb-2 text-sm"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                    </div>
                    <input id="dropzone-file" type="file" multiple className="hidden" onChange={handleFileUpload} accept='image/png, image/gif, image/jpeg' />
                </label>
            </div>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-10 mt-3 gap-3'>
                {imagePreview.map((image, index) => (
                    <div key={index}>
                        <Image src={image} width={100} height={100} className='rounded-lg object-cover h-25 w-55' alt={index} />
                    </div>
                ))}
            </div>
            {imageList && <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-10 mt-3 gap-3'>
                {imageList.map((image, index) => (
                    <div key={index}>
                        <Image src={image?.imageUrl} width={100} height={80} className='rounded-lg object-cover h-25 w-55' alt={index} />
                    </div>
                ))}
            </div>}

        </div>
    )
}

export default FileUpload
